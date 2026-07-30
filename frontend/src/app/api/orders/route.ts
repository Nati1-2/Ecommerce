import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // 1. Try to fetch from backend Order Service via API Gateway
    const authHeader = req.headers.get("authorization");
    const token = authHeader || req.cookies.get("token")?.value;

    try {
      const response = await fetch("http://localhost:8000/api/v1/orders/my-orders", {
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
          return NextResponse.json(mappedOrders);
        }
      }
    } catch (err) {
      console.warn("Backend Order Service fetch failed, falling back to local DB:", err);
    }

    // 2. Fallback to direct local MongoDB database query
    await connectDB();

    const query: any = {};
    if (userId) query.userId = userId;

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const authHeader = req.headers.get("authorization");
    const token = authHeader || req.cookies.get("token")?.value;

    // 1. Try to submit to backend Order Service via API Gateway
    try {
      const backendPayload = {
        items: (body.items || []).map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: body.shippingAddress?.fullName || `${body.shippingAddress?.firstName || ""} ${body.shippingAddress?.lastName || ""}`.trim() || "John Smith",
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

      const response = await fetch("http://localhost:8000/api/v1/orders", {
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
          return NextResponse.json(mappedOrder, { status: 201 });
        }
      }
    } catch (err) {
      console.warn("Backend Order Service submit failed, falling back to local DB:", err);
    }

    // 2. Fallback to direct local MongoDB database write
    await connectDB();

    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newOrder = await Order.create({
      ...body,
      orderId,
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 400 });
  }
}
