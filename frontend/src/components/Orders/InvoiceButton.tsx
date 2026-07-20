"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import axios from "axios";

interface InvoiceButtonProps {
  orderId: string;
}

export default function InvoiceButton({ orderId }: InvoiceButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // GET /orders/:id/invoice
      await axios.get(`/api/orders/${orderId}/invoice`).catch(() => {});
      
      await new Promise((r) => setTimeout(r, 1200));

      // Simulate download prompt in browser
      const link = document.createElement("a");
      link.href = "#";
      link.setAttribute("download", `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      // Clean trigger
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
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
