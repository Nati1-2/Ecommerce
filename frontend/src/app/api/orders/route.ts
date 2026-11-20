import { NextRequest, NextResponse } from "next/server";
import { connectDB, safeFindProductById, safeDeductProductStock } from "@/lib/mongodb";
import { Order, PaymentStatus, OrderStatus } from "@/models/Order";
import { getUserFromToken } from "@/lib/authHelper";

export async function GET(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
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

    // 1. Try to fetch from backend Order Service via API Gateway
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
              orderStatus: o.status || o.orderStatus || "PENDING",
              status: o.status || o.orderStatus || "PENDING",
              totalAmount: o.pricing?.total || o.totalAmount || 0,
              grandTotal: o.pricing?.total || o.grandTotal || 0,
              createdAt: o.createdAt,
              updatedAt: o.updatedAt
            }));
            return NextResponse.json({ success: true, data: mappedOrders });
          }
        }
      } catch (err) {
        // Continue to local DB
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
    const decoded = getUserFromToken(req);
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

    // ── Server-Authoritative Product Verification & Pricing ───────────────
    // Never trust client prices, totals, or stock values
    const verifiedItems = [];
    let subtotal = 0;

    for (const rawItem of rawItems) {
      const productId = String(rawItem.productId || rawItem.id || "");
      const quantity = Math.max(1, Math.floor(Number(rawItem.quantity) || 1));

      if (!productId) {
        return NextResponse.json(
          { success: false, error: "Each cart item must have a valid productId." },
          { status: 400 }
        );
      }

      // 1. Fetch authoritative product from database
      const product = await safeFindProductById(productId);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product '${productId}' could not be found or is discontinued.` },
          { status: 400 }
        );
      }

      // 2. Verify product active status
      if (!product.isActive) {
        return NextResponse.json(
          { success: false, error: `Product '${product.name}' is currently unavailable.` },
          { status: 400 }
        );
      }

      // 3. Verify stock availability
      if (product.stock < quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient stock for product '${product.name}'. Requested: ${quantity}, Available: ${product.stock}.`
          },
          { status: 400 }
        );
      }

      // 4. Use server-authoritative price
      const itemPrice = Number(product.price);
      subtotal += itemPrice * quantity;

      verifiedItems.push({
        productId: product.id,
        name: product.name,
        price: itemPrice, // Server-calculated authoritative price
        quantity,
        image: product.image || "/iphone17.png",
      });
    }

    // Server-calculated financial figures
    const shippingCost = subtotal >= 100 ? 0 : 10;
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const grandTotal = Math.round((subtotal + shippingCost + tax) * 100) / 100;
    const totalAmount = grandTotal;

    const userId = decoded.id; // Strictly from verified JWT
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const shippingAddress = {
      street: String(body.shippingAddress?.street || "123 Main St").trim(),
      city: String(body.shippingAddress?.city || "San Francisco").trim(),
      state: String(body.shippingAddress?.state || "CA").trim(),
      zipCode: String(body.shippingAddress?.zipCode || body.shippingAddress?.postalCode || "94105").trim(),
      country: String(body.shippingAddress?.country || "US").trim(),
    };

    // ── Atomic Inventory Deduction ─────────────────────────────────────────
    for (const item of verifiedItems) {
      await safeDeductProductStock(item.productId, item.quantity);
    }

    // ── Save Order in MongoDB ──────────────────────────────────────────────
    await connectDB();

    const newOrder = await Order.create({
      orderId,
      userId,
      items: verifiedItems,
      shippingAddress,
      paymentStatus: PaymentStatus.PENDING, // Always starts PENDING on creation
      orderStatus: OrderStatus.PENDING,
      totalAmount,
      shippingCost,
      tax,
      grandTotal,
    });

    const { notifyOrderCreated } = await import("@/lib/notifications");
    await notifyOrderCreated(newOrder).catch((err) => console.warn("Notify error:", err));

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
