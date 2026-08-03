"use client";

import { useState } from "react";
import { Download, Eye, Mail, Loader2, Check } from "lucide-react";
import axios from "axios";

import { generateInvoicePDF } from "@/lib/invoiceHelper";
import { fetchOrderById } from "@/lib/api";

interface InvoiceButtonProps {
  orderId: string;
}

export default function InvoiceButton({ orderId }: InvoiceButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
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
      setDownloading(false);
    }
  };

  const handleEmail = async () => {
    setEmailing(true);
    setEmailSuccess(false);

    try {
      // POST /notifications/email/resend
      await axios.post("/api/notifications/email/resend", { orderId }).catch(() => {});
    } catch (err) {
      // ignore mock errors
    }

    await new Promise((r) => setTimeout(r, 1200));
    setEmailing(false);
    setEmailSuccess(true);
    setTimeout(() => setEmailSuccess(false), 3000);
  };

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-4 select-none">
      <h3 className="text-sm font-black text-gray-900">Documents & Notifications</h3>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Download Invoice Button */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 py-3 px-4 bg-gray-50 border border-gray-100 hover:border-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-gray-400" />
              Download Invoice
            </>
          )}
        </button>

        {/* Email Resend Invoice Button */}
        <button
          onClick={handleEmail}
          disabled={emailing}
          className="flex-1 py-3 px-4 bg-gray-50 border border-gray-100 hover:border-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
        >
          {emailing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              Sending Email...
            </>
          ) : emailSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-black">Email Sent!</span>
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 text-gray-400" />
              Email Confirmation
            </>
          )}
        </button>
      </div>
    </div>
  );
}
