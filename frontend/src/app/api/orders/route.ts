import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
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
    const gatewayUrl = process.env.API_GATEWAY_URL || process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000";

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
      console.warn("Backend Order Service fetch failed, falling back to local DB:", err);
    }

    // 2. Fallback to direct local MongoDB database query
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
    const items = (body.items || []).map((item: any) => ({
      productId: item.productId || "prod-unknown",
      name: item.name || item.productName || "Product",
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      image: item.image || item.imageUrl || "/iphone17.png",
    }));

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cannot create an order with an empty cart." },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get("authorization");
    const token = authHeader || req.cookies.get("token")?.value;
    const userId = decoded.id; // Strictly associate with the authenticated user

    // 1. Try to submit to backend Order Service via API Gateway
    const gatewayUrl = process.env.API_GATEWAY_URL || process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000";
    try {
      const backendPayload = {
        items: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: body.shippingAddress?.fullName || `${body.shippingAddress?.firstName || ""} ${body.shippingAddress?.lastName || ""}`.trim() || "Customer",
          phone: body.shippingAddress?.phone || "+1 (555) 019-2834",
          street: body.shippingAddress?.street || "",
          city: body.shippingAddress?.city || "",
          state: body.shippingAddress?.state || "",
          zipCode: body.shippingAddress?.zipCode || "",
          country: body.shippingAddress?.country || "US"
        },
        pricing: {
          subtotal: body.subtotal || body.totalAmount || 0,
          tax: body.tax || 0,
          shippingFee: body.shippingCost || 0,
          discount: body.discount || 0,
          total: body.grandTotal || body.totalAmount || 0
        }
      };

      const response = await fetch(`${gatewayUrl}/api/v1/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(backendPayload),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const o = result.data;
          const mappedOrder = {
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
          };
          return NextResponse.json({ success: true, data: mappedOrder }, { status: 201 });
        }
      }
    } catch (err) {
      console.warn("Backend Order Service submit failed, falling back to local DB:", err);
    }

    // 2. Fallback to direct local MongoDB database write
    try {
      await connectDB();

      const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const calculatedTotal = items.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0);
      const totalAmount = Number(body.totalAmount ?? body.subtotal ?? calculatedTotal);
      const shippingCost = Number(body.shippingCost ?? body.shippingFee ?? 0);
      const tax = Number(body.tax ?? Math.round(totalAmount * 0.05 * 100) / 100);
      const grandTotal = Number(body.grandTotal ?? (totalAmount + shippingCost + tax));

      const shippingAddress = {
        street: body.shippingAddress?.street || "123 Main St",
        city: body.shippingAddress?.city || "San Francisco",
        state: body.shippingAddress?.state || "CA",
        zipCode: body.shippingAddress?.zipCode || body.shippingAddress?.postalCode || "94105",
        country: body.shippingAddress?.country || "US",
      };

      const newOrder = await Order.create({
        orderId,
        userId,
        items,
        shippingAddress,
        paymentStatus: body.paymentStatus || "PENDING",
        orderStatus: body.orderStatus || "PENDING",
        totalAmount,
        shippingCost,
        tax,
        grandTotal,
        paymentIntentId: body.paymentIntentId,
        trackingNumber: body.trackingNumber,
      });

      const { notifyOrderCreated } = await import("@/lib/notifications");
      await notifyOrderCreated(newOrder).catch((err) => console.warn("Notify error:", err));

      return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
    } catch (dbErr: any) {
      console.error("Order creation database error:", dbErr);
      return NextResponse.json({ error: `Database error: ${dbErr.message}` }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 400 });
  }
}
