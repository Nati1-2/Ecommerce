import { connectDB } from "@/lib/mongodb";
import { Notification } from "@/models/Notification";

export async function createNotification(data: {
  recipientId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  try {
    await connectDB();
    const notif = await Notification.create({
      recipientId: data.recipientId,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link || "#",
      read: false,
    });
    return notif;
  } catch (err) {
    console.warn("Failed to create notification:", err);
    return null;
  }
}

export async function notifyOrderCreated(order: any) {
  const orderId = order.orderId || order.id || order._id?.toString();
  const total = order.grandTotal || order.totalAmount || 0;

  // 1. Notify Customer
  if (order.userId) {
    await createNotification({
      recipientId: order.userId,
      type: "ORDER_CREATED",
      title: "Order Placed Successfully! 🎉",
      message: `Your order #${orderId} for $${total.toFixed(2)} has been placed and is being processed.`,
      link: `/orders/${orderId}/tracking`,
    });
  }

  // 2. Notify Admin
  await createNotification({
    recipientId: "ADMIN",
    type: "ORDER_CREATED",
    title: "New Marketplace Order",
    message: `Order #${orderId} for $${total.toFixed(2)} was placed by customer.`,
    link: `/admin/orders`,
  });

  // 3. Notify Vendors for each product in order
  for (const item of order.items || []) {
    const vendorId = item.vendorId || "usr-demo-vendor";
    await createNotification({
      recipientId: vendorId,
      type: "NEW_VENDOR_ORDER",
      title: "New Customer Order Received! 📦",
      message: `Order #${orderId} containing "${item.name}" (${item.quantity}x) requires fulfillment.`,
      link: `/vendor/orders`,
    });
  }
}

export async function notifyOrderStatusChanged(orderId: string, newStatus: string, userId?: string, vendorId?: string) {
  // Notify Customer
  if (userId) {
    await createNotification({
      recipientId: userId,
      type: "ORDER_STATUS_UPDATED",
      title: `Order Status Updated: ${newStatus}`,
      message: `Your order #${orderId} has been updated to "${newStatus}".`,
      link: `/orders/${orderId}/tracking`,
    });
  }

  // Notify Admin
  await createNotification({
    recipientId: "ADMIN",
    type: "ORDER_STATUS_UPDATED",
    title: `Order #${orderId} Updated`,
    message: `Order status changed to "${newStatus}".`,
    link: `/admin/orders`,
  });
}
