import { NextRequest, NextResponse } from "next/server";
import { connectDB, safeFindProductById, safeDeductProductStock, safeRestoreProductStock } from "@/lib/mongodb";
import { Order, PaymentStatus, OrderStatus } from "@/models/Order";
import { getUserFromToken } from "@/lib/authHelper";

export async function GET(req: NextRequest) {
  try {
    const decoded = await getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Authentication required to view orders. Please log in." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get("userId");

    // Enforce authorization: Non-admins can ONLY view their own orders
    const isAdmin = decoded.role === "ADMIN";
    let targetUserId = decoded.id;
    if (isAdmin && requestedUserId) {
      targetUserId = requestedUserId;
    } else if (!isAdmin && requestedUserId && requestedUserId !== decoded.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You cannot access another customer's orders." },
        { status: 403 }
      );
    }

    // 1. Try to fetch from backend Order Service via API Gateway if configured
    const authHeader = req.headers.get("authorization");
    const token = authHeader || req.cookies.get("token")?.value;
    const gatewayUrl = process.env.API_GATEWAY_URL || process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "");

    if (gatewayUrl) {
      try {
        const endpoint = isAdmin && !requestedUserId
          ? `${gatewayUrl}/api/v1/orders/admin/all`
          : `${gatewayUrl}/api/v1/orders/my-orders`;

        const response = await fetch(endpoint, {
          headers: token ? { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` } : {},
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            const mappedOrders = result.data.map((o: any) => ({
              id: o.orderId || o._id,
              orderId: o.orderId || o._id,
              userId: o.customerId || o.userId,
              items: (o.items || []).map((item: any) => ({
                productId: item.productId,
                name: item.productName || item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image || "/iphone17.png"
              })),
              shippingAddress: {
                street: o.shippingAddress?.street || "",
                city: o.shippingAddress?.city || "",
                state: o.shippingAddress?.state || "",
                zipCode: o.shippingAddress?.zipCode || "",
                country: o.shippingAddress?.country || ""
              },
              paymentStatus: o.paymentStatus || "PENDING",
              orderStatus: o.status || o.orderStatus || "PENDING_PAYMENT",
              status: o.status || o.orderStatus || "PENDING_PAYMENT",
              totalAmount: o.pricing?.total || o.totalAmount || 0,
              grandTotal: o.pricing?.total || o.grandTotal || 0,
              currency: o.currency || "usd",
              createdAt: o.createdAt,
              updatedAt: o.updatedAt
            }));
            return NextResponse.json({ success: true, data: mappedOrders });
          }
        }
      } catch (err) {
        // Fall back to local DB
      }
    }

    // 2. Fetch directly from MongoDB
    try {
      await connectDB();

      const query: any = isAdmin && !requestedUserId
        ? {}
        : { userId: targetUserId };

      const orders = await Order.find(query).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: orders });
    } catch (dbErr: any) {
      return NextResponse.json({ error: `Database error: ${dbErr.message}` }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const decoded = await getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Authentication required to create orders. Please log in first." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const rawItems = Array.isArray(body.items) ? body.items : [];

    if (rawItems.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cannot create an order with an empty cart." },
        { status: 400 }
      );
    }

    // ── 1. Consolidate Duplicate Cart Items (Anti-Overselling Guard) ───────
    // If cart contains multiple lines with the same productId, combine quantities
    const consolidatedMap = new Map<string, number>();

    for (const rawItem of rawItems) {
      const productId = String(rawItem.productId || rawItem.id || "").trim();
      const rawQty = rawItem.quantity;

      // Reject non-integer, negative, or zero quantities
      if (
        typeof rawQty !== "number" ||
        isNaN(rawQty) ||
        !Number.isInteger(rawQty) ||
        rawQty <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid quantity for product '${productId}'. Whole positive numbers are required.`,
          },
          { status: 400 }
        );
      }

      if (!productId) {
        return NextResponse.json(
          { success: false, error: "Each cart item must have a valid productId." },
          { status: 400 }
        );
      }

      const currentQty = consolidatedMap.get(productId) || 0;
      consolidatedMap.set(productId, currentQty + rawQty);
    }

    // ── 2. Server-Authoritative Product Verification & Stock Check ─────────
    const verifiedItems = [];
    let subtotal = 0;

    for (const [productId, quantity] of consolidatedMap.entries()) {
      const product = await safeFindProductById(productId);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product '${productId}' could not be found or is discontinued.` },
          { status: 400 }
        );
      }

      if (!product.isActive) {
        return NextResponse.json(
          { success: false, error: `Product '${product.name}' is currently unavailable.` },
          { status: 400 }
        );
      }

      // Check stock against total combined requested quantity
      if (product.stock < quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient stock for product '${product.name}'. Requested: ${quantity}, Available: ${product.stock}.`,
          },
          { status: 400 }
        );
      }

      const itemPrice = Number(product.price);
      subtotal += itemPrice * quantity;

      verifiedItems.push({
        productId: product.id,
        name: product.name,
        price: itemPrice, // Server-authoritative catalog price
        quantity,
        image: product.image || "/iphone17.png",
      });
    }

    // ── 3. Server-Calculated Financial Figures ─────────────────────────────
    const shippingCost = subtotal >= 100 ? 0 : 10;
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const grandTotal = Math.round((subtotal + shippingCost + tax) * 100) / 100;
    const totalAmount = grandTotal;

    const userId = decoded.id; // Strictly bound to authenticated customer
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Validate shipping address
    const street = String(body.shippingAddress?.street || "").trim();
    const city = String(body.shippingAddress?.city || "").trim();
    const state = String(body.shippingAddress?.state || "").trim();
    const zipCode = String(body.shippingAddress?.zipCode || body.shippingAddress?.postalCode || "").trim();
    const country = String(body.shippingAddress?.country || "US").trim();

    if (!street || !city || !state || !zipCode) {
      return NextResponse.json(
        { success: false, error: "Complete shipping address (street, city, state, zipCode) is required." },
        { status: 400 }
      );
    }

    const shippingAddress = { street, city, state, zipCode, country };

    // ── 4. Atomic Inventory Reservation with Compensation Rollback ─────────
    const deductedItems: Array<{ productId: string; quantity: number }> = [];

    for (const item of verifiedItems) {
      const deductionSuccess = await safeDeductProductStock(item.productId, item.quantity);
      if (!deductionSuccess) {
        // Rollback all previously deducted items in this transaction
        for (const previouslyDeducted of deductedItems) {
          await safeRestoreProductStock(previouslyDeducted.productId, previouslyDeducted.quantity);
        }

        return NextResponse.json(
          {
            success: false,
            error: `Inventory reservation failed for product '${item.name}'. The requested quantity is no longer available.`,
          },
          { status: 409 }
        );
      }
      deductedItems.push({ productId: item.productId, quantity: item.quantity });
    }

    // ── 5. Persist Order in MongoDB ─────────────────────────────────────────
    try {
      await connectDB();

      const newOrder = await Order.create({
        orderId,
        userId,
        items: verifiedItems,
        shippingAddress,
        paymentStatus: PaymentStatus.PENDING,
        orderStatus: OrderStatus.PENDING_PAYMENT,
        totalAmount,
        shippingCost,
        tax,
        grandTotal,
        currency: "usd",
        paymentProvider: "stripe",
      });

      const { notifyOrderCreated } = await import("@/lib/notifications");
      await notifyOrderCreated(newOrder).catch((err) => console.warn("Notify error:", err));

      return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
    } catch (orderPersistErr: any) {
      // Order persistence failed: Execute compensating rollback to restore inventory
      console.error("Order persistence failed, rolling back inventory reservations:", orderPersistErr);
      for (const item of deductedItems) {
        await safeRestoreProductStock(item.productId, item.quantity);
      }

      return NextResponse.json(
        {
          success: false,
          error: "Database error creating order. Reserved inventory has been safely restored.",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
