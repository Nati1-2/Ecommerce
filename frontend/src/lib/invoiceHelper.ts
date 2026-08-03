import { jsPDF } from "jspdf";
import { Order } from "@/types";

export function generateInvoicePDF(order: Order) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Margins & Dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Primary Colors (Elegant Deep Blue/Slate theme)
  const primaryColor = [15, 23, 42]; // #0f172a (Dark Slate)
  const lightBg = [248, 250, 252]; // #f8fafc (Very Light gray)
  const borderGray = [226, 232, 240]; // #e2e8f0 (Border gray)
  const textDark = [51, 65, 85]; // #334155 (Text Slate)

  // Helper for setting colors
  const setFillColor = (colors: number[]) => doc.setFillColor(colors[0], colors[1], colors[2]);
  const setTextColor = (colors: number[]) => doc.setTextColor(colors[0], colors[1], colors[2]);
  const setDrawColor = (colors: number[]) => doc.setDrawColor(colors[0], colors[1], colors[2]);

  // Header Banner Background
  setFillColor(primaryColor);
  doc.rect(0, 0, pageWidth, 40, "F");

  // Logo & Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("Nati.", margin, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  doc.text("Your Premium Tech Destination", margin, 32);

  // Invoice Text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("INVOICE", pageWidth - margin - 30, 25);

  // Date and ID
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Reference: #${order.id}`, pageWidth - margin - 55, 32);

  let y = 50;

  // Billing & Info Box
  // Left Column: Customer Details
  setTextColor(primaryColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("SHIP TO:", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextColor(textDark);
  
  const addr = order.shippingAddress;
  const fullName = `${addr.firstName || ""} ${addr.lastName || ""}`.trim() || "Valued Customer";
  doc.text(fullName, margin, y + 5);
  doc.text(addr.street || "Demo Street", margin, y + 10);
  doc.text(`${addr.city || "San Francisco"}, ${addr.state || "CA"} ${addr.postalCode || "94103"}`, margin, y + 15);
  doc.text(addr.country || "United States", margin, y + 20);
  if (addr.phone) doc.text(`Phone: ${addr.phone}`, margin, y + 25);

  // Right Column: Invoice Metadata
  setTextColor(primaryColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("ORDER INFO:", pageWidth / 2 + 10, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextColor(textDark);
  doc.text(`Date Placed: ${order.createdAt}`, pageWidth / 2 + 10, y + 5);
  doc.text(`Order Status: ${order.status}`, pageWidth / 2 + 10, y + 10);

  // Payment Status Badge
  const isPaid = order.paymentStatus?.toUpperCase() === "PAID";
  if (isPaid) {
    doc.setFillColor(209, 250, 229); // light green bg
    doc.rect(pageWidth / 2 + 10, y + 14, 30, 6, "F");
    doc.setTextColor(5, 150, 105); // dark green text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("PAID IN FULL", pageWidth / 2 + 15, y + 18);
  } else {
    doc.setFillColor(254, 226, 226); // light red bg
    doc.rect(pageWidth / 2 + 10, y + 14, 30, 6, "F");
    doc.setTextColor(220, 38, 38); // dark red text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("UNPAID", pageWidth / 2 + 19, y + 18);
  }

  y += 40;

  // Draw Line Separator
  setDrawColor(borderGray);
  doc.line(margin, y, pageWidth - margin, y);

  y += 10;

  // Table Headers
  setFillColor(lightBg);
  doc.rect(margin, y, pageWidth - 2 * margin, 8, "F");
  
  setTextColor(primaryColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Description", margin + 2, y + 5.5);
  doc.text("Qty", pageWidth - margin - 50, y + 5.5);
  doc.text("Unit Price", pageWidth - margin - 35, y + 5.5);
  doc.text("Total", pageWidth - margin - 15, y + 5.5);

  y += 8;

  // Table Rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextColor(textDark);

  (order.items || []).forEach((item) => {
    // Check if we need a page break (just in case there are many items)
    if (y > pageHeight - margin - 40) {
      doc.addPage();
      y = margin;
      // Redraw Table Headers on new page
      setFillColor(lightBg);
      doc.rect(margin, y, pageWidth - 2 * margin, 8, "F");
      setTextColor(primaryColor);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("Description", margin + 2, y + 5.5);
      doc.text("Qty", pageWidth - margin - 50, y + 5.5);
      doc.text("Unit Price", pageWidth - margin - 35, y + 5.5);
      doc.text("Total", pageWidth - margin - 15, y + 5.5);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setTextColor(textDark);
    }

    // Row borders
    setDrawColor(borderGray);
    doc.line(margin, y, pageWidth - margin, y);

    // Item Info
    const itemName = item.name.length > 40 ? item.name.substring(0, 37) + "..." : item.name;
    doc.text(itemName, margin + 2, y + 6);
    doc.text(item.quantity.toString(), pageWidth - margin - 48, y + 6);
    doc.text(`$${item.price.toFixed(2)}`, pageWidth - margin - 35, y + 6);
    doc.text(`$${(item.price * item.quantity).toFixed(2)}`, pageWidth - margin - 15, y + 6);

    y += 9;
  });

  // End Table Line
  setDrawColor(borderGray);
  doc.line(margin, y, pageWidth - margin, y);

  y += 10;

  // Summary Totals
  const summaryX = pageWidth - margin - 60;
  
  const drawTotalRow = (label: string, value: string, isGrandTotal = false) => {
    doc.setFont("helvetica", isGrandTotal ? "bold" : "normal");
    doc.setFontSize(isGrandTotal ? 11 : 9);
    setTextColor(isGrandTotal ? primaryColor : textDark);
    doc.text(label, summaryX, y);
    doc.text(value, pageWidth - margin - 15, y);
    y += isGrandTotal ? 8 : 6;
  };

  drawTotalRow("Subtotal:", `$${(order.subtotal || 0).toFixed(2)}`);
  if (order.discount > 0) {
    drawTotalRow("Discount:", `-$${(order.discount || 0).toFixed(2)}`);
  }
  drawTotalRow("Shipping:", `$${(order.shipping || 0).toFixed(2)}`);
  drawTotalRow("Estimated Tax:", `$${(order.tax || 0).toFixed(2)}`);
  
  setDrawColor(borderGray);
  doc.line(summaryX, y - 2, pageWidth - margin, y - 2);
  y += 3;
  
  drawTotalRow("Total:", `$${(order.total || 0).toFixed(2)}`, true);

  // Footer Message
  y = pageHeight - 30;
  setDrawColor(borderGray);
  doc.line(margin, y, pageWidth - margin, y);

  setTextColor(textDark);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Thank you for shopping at Nati Store!", margin, y + 6);
  doc.text("If you have any questions about this invoice, please contact support@nati.store", margin, y + 10);
  
  doc.setTextColor(150, 150, 150);
  doc.text("Generated automatically on checkout.", pageWidth - margin - 50, y + 6);

  // Save the PDF file
  doc.save(`invoice-${order.id}.pdf`);
}
