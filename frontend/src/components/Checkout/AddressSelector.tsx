"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { Address } from "@/types";
import { useCheckoutStore } from "@/store/checkoutStore";
import AddressForm from "./AddressForm";
import { motion, AnimatePresence } from "framer-motion";

export default function AddressSelector() {
  const {
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    addAddress,
    updateAddress,
    deleteAddress,
  } = useCheckoutStore();

  const [isAdding, setIsAdding] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleAddSubmit = (data: any) => {
    addAddress(data);
    setIsAdding(false);
  };

  const handleEditSubmit = (data: any) => {
    if (editingAddress) {
      updateAddress({ ...data, id: editingAddress.id });
      setEditingAddress(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-black text-gray-900">Select Shipping Address</h3>
        {!isAdding && !editingAddress && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1 bg-white hover:bg-gray-50 border border-gray-200 text-[#007BFF] text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            key="add-form"
          >
            <AddressForm
              onSubmit={handleAddSubmit}
              onCancel={() => setIsAdding(false)}
            />
          </motion.div>
        )}

        {editingAddress && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            key="edit-form"
          >
            <AddressForm
              initialData={editingAddress}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingAddress(null)}
            />
          </motion.div>
        )}

        {!isAdding && !editingAddress && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            key="address-grid"
          >
            {addresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id;

              return (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`relative p-5 rounded-3xl border cursor-pointer flex flex-col justify-between transition-all select-none ${
                    isSelected
                      ? "border-[#007BFF] bg-blue-50/10 ring-2 ring-[#007BFF]/10 shadow-sm"
                      : "border-gray-100 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-gray-900">
                        {addr.firstName} {addr.lastName}
                      </p>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#007BFF] fill-current bg-white rounded-full" />
                      )}
                    </div>
                    <p className="text-gray-500 text-[11px] leading-relaxed">
                      {addr.street}
                      <br />
                      {addr.city}, {addr.state} {addr.postalCode}
                      <br />
                      {addr.country}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 pt-1">
                      📞 {addr.phone}
                    </p>
                  </div>

                  {/* Actions Row */}
                  <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-50 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAddress(addr);
                      }}
                      className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-950 transition-colors"
                      title="Edit Address"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAddress(addr.id);
                      }}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                      title="Delete Address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
