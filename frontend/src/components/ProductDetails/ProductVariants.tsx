"use client";

import { ProductVariant } from "@/types";

interface ProductVariantsProps {
  variants?: ProductVariant[];
  selectedVariants: Record<string, string>;
  onSelectOption: (variantName: string, optionValue: string) => void;
}

export default function ProductVariants({
  variants,
  selectedVariants,
  onSelectOption,
}: ProductVariantsProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-4">
      {variants.map((v) => {
        const selectedValue = selectedVariants[v.name];

        return (
          <div key={v.name} className="space-y-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Select {v.name}
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {v.options.map((opt) => {
                // Handle either raw string option or VariantOption object
                const val = typeof opt === "string" ? opt : opt.value;
                const isSelected = selectedValue === val;

                return (
                  <button
                    key={val}
                    onClick={() => onSelectOption(v.name, val)}
                    className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-[#111827] border-[#111827] text-white shadow-md shadow-[#111827]/10"
                        : "bg-white border-gray-200 text-gray-700 hover:border-[#007BFF] hover:text-[#007BFF]"
                    }`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
