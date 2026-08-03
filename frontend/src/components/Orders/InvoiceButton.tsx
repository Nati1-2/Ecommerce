"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import axios from "axios";

import { generateInvoicePDF } from "@/lib/invoiceHelper";
import { fetchOrderById } from "@/lib/api";

interface InvoiceButtonProps {
  orderId: string;
}

export default function InvoiceButton({ orderId }: InvoiceButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const order = await fetchOrderById(orderId);
      if (order) {
        generateInvoicePDF(order);
      } else {
        alert("Failed to locate order details for invoice download");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during invoice PDF generation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="py-2 px-3.5 bg-gray-50 border border-gray-150 text-gray-700 font-bold text-[10px] rounded-xl flex items-center justify-center gap-1.5 hover:border-gray-250 transition-colors shrink-0"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Download className="w-3.5 h-3.5 text-gray-400" />
      )}
      Invoice
    </button>
  );
}
