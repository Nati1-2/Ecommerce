"use client";

import { useState } from "react";
import { ProductVariant } from "@/types/vendor";
import { Plus, Trash2, Layers } from "lucide-react";

interface Props {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
  basePrice: number;
}

export default function VariantManager({ variants, onChange, basePrice }: Props) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState(basePrice || 0);
  const [stock, setStock] = useState(10);

  const handleAddVariant = () => {
    if (!name.trim()) return;

    const newVar: ProductVariant = {
      id: `v_${Date.now()}`,
      name: name.trim(),
      sku: sku.trim() || `SKU-VAR-${Math.floor(Math.random() * 900)}`,
      price: Number(price) || basePrice || 0,
      stock: Number(stock) || 0,
      attributes: { Option: name.trim() },
    };

    onChange([...variants, newVar]);
    setName("");
    setSku("");
    setPrice(basePrice || 0);
    setStock(10);
  };

  const handleRemoveVariant = (id: string) => {
    onChange(variants.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-blue-500" />
          <span>Product Variants (Size, Color, Specification)</span>
        </label>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
          {variants.length} variant(s)
        </span>
      </div>

      {/* Add New Variant Row */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Variant Name (e.g. 32GB / Space Gray)"
          className="sm:col-span-2 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
        />
        <input
          type="text"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          placeholder="SKU Code"
          className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white font-mono"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="Price ($)"
          className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white tabular-nums"
        />
        <div className="flex gap-2">
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            placeholder="Stock"
            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white tabular-nums"
          />
          <button
            type="button"
            onClick={handleAddVariant}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shrink-0 flex items-center gap-1 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* List */}
      {variants.length > 0 && (
        <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Variant Option</th>
                <th className="py-2.5 px-4">SKU</th>
                <th className="py-2.5 px-4">Price</th>
                <th className="py-2.5 px-4">Stock</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {variants.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850">
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{v.name}</td>
                  <td className="py-2.5 px-4 font-mono text-slate-500 dark:text-slate-400">{v.sku}</td>
                  <td className="py-2.5 px-4 font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                    ${v.price.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                    {v.stock} units
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(v.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Remove variant"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
