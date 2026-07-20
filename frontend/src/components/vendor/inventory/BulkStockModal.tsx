"use client";

import { useState } from "react";
import { X, Upload, CheckCircle2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmBulkUpdate: (addedQuantity: number) => void;
}

export default function BulkStockModal({ isOpen, onClose, onConfirmBulkUpdate }: Props) {
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(10);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFileName(file.name);
    }
  };

  const handleSave = () => {
    onConfirmBulkUpdate(adjustmentAmount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Bulk Stock Adjustment
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Update inventory counts in bulk or import CSV warehouse file.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quantity Increase Form */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Bulk Add Quantity (+ Units to all selected)
            </label>
            <input
              type="number"
              value={adjustmentAmount}
              onChange={(e) => setAdjustmentAmount(Number(e.target.value))}
              className="w-full mt-1.5 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 font-bold outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-center bg-slate-50/50 dark:bg-slate-800/50">
            <Upload className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {csvFileName ? `Selected File: ${csvFileName}` : "Upload CSV Stock File"}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Format: SKU, Quantity, Warehouse</p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Apply Bulk Update
          </button>
        </div>
      </div>
    </div>
  );
}
