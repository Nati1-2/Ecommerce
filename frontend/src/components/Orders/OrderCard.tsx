"use client";

import { useState } from "react";
import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { Truck, RotateCw, Eye, EyeOff, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import OrderProductItem from "./OrderProductItem";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderDetails from "./OrderDetails";
import InvoiceButton from "./InvoiceButton";
import CancelOrderModal from "./CancelOrderModal";
import ReturnOrderModal from "./ReturnOrderModal";
import { motion, AnimatePresence } from "framer-motion";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  const [cancelOpen, setCancelOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useCartStore((s) => s.setCartDrawerOpen);

  // Determine actions based on status guidelines
  const canCancel = order.status === "Processing";
  const canReturn = order.status === "Delivered";
  const canTrack = order.status === "Shipped" || order.status === "Processing";

  const handleBuyAgain = () => {
    // Re-add all products contained in this order
    order.items.forEach((item) => {
      addItem({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      });
    });
    setCartDrawerOpen(true);
  };

  return (
    <div className="border border-gray-150 rounded-3xl bg-white shadow-sm overflow-hidden select-none">
      
      {/* Header summaries */}
      <div className="p-5 bg-gray-55/60 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs font-semibold">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {/* Order ID */}
          <div className="space-y-1 text-left">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Order Reference</span>
            <span className="text-gray-950 font-black">#{order.id}</span>
          </div>

          {/* Placement Date */}
          <div className="space-y-1 text-left">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Date Placed</span>
            <span className="text-gray-600 font-bold">{order.createdAt}</span>
          </div>

          {/* Grand total price */}
          <div className="space-y-1 text-left">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Amount</span>
            <span className="text-gray-950 font-black">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Product list section */}
      <div className="p-5 divide-y divide-gray-100/50">
        {order.items.map((item) => (
          <OrderProductItem key={item.productId} item={item} />
        ))}
      </div>

      {/* Footer trigger buttons */}
      <div className="px-5 pb-5 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Accordion toggle button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] font-black text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          {expanded ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
          {expanded ? "Hide Details" : "View Order details"}
        </button>

        {/* Dynamic actions row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Invoice */}
          <InvoiceButton orderId={order.id} />

          {/* Track order */}
          {canTrack && (
            <Link
              href={`/orders/${order.id}/tracking`}
              className="py-2 px-3.5 bg-blue-50 hover:bg-[#007BFF] text-[#007BFF] hover:text-white font-bold text-[10px] rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Truck className="w-3.5 h-3.5" />
              Track Package
            </Link>
          )}

          {/* Cancel Order */}
          {canCancel && (
            <button
              onClick={() => setCancelOpen(true)}
              className="py-2 px-3.5 bg-white hover:bg-red-50 border border-red-200 text-red-600 font-bold text-[10px] rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Cancel Order
            </button>
          )}

          {/* Return items */}
          {canReturn && (
            <button
              onClick={() => setReturnOpen(true)}
              className="py-2 px-3.5 bg-white hover:bg-purple-50 border border-purple-200 text-purple-600 font-bold text-[10px] rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Return Items
            </button>
          )}

          {/* Buy Again */}
          <button
            onClick={handleBuyAgain}
            className="py-2 px-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-[10px] rounded-xl flex items-center gap-1.5 transition-colors"
          >
            Reorder Products
          </button>
        </div>
      </div>

      {/* Expanded Accordion container */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <OrderDetails order={order} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Order confirmation modal */}
      <CancelOrderModal
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        orderId={order.id}
      />

      {/* Return request modal */}
      <ReturnOrderModal
        isOpen={returnOpen}
        onClose={() => setReturnOpen(false)}
        orderId={order.id}
      />
    </div>
  );
}
