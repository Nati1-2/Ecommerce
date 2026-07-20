"use client";

import { Plus, Minus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max: number;
}

export default function QuantitySelector({ quantity, onChange, max }: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > 1) onChange(quantity - 1);
  };

  const handleIncrement = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quantity</h4>
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-gray-200 rounded-2xl bg-gray-50 p-1">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-gray-100 hover:border-gray-200 text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-40 disabled:hover:border-gray-100"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-bold text-sm text-gray-900 select-none">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={quantity >= max}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-gray-100 hover:border-gray-200 text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-40 disabled:hover:border-gray-100"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="text-xs text-gray-400 font-semibold select-none">
          {max} items available
        </span>
      </div>
    </div>
  );
}
