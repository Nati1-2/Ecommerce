"use client";

import { useEffect, useState } from "react";
import { useCheckoutStore, Address } from "@/store/checkoutStore";
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, X, Home, Briefcase, Phone, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardAddresses() {
  const { addresses: storeAddresses, setAddresses, selectedAddressId, selectAddress } = useCheckoutStore();
  const [addresses, setLocalAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    phone: "",
    isDefault: false,
  });

  useEffect(() => {
    fetch("/api/users/addresses")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.addresses) && data.addresses.length > 0) {
          setLocalAddresses(data.addresses);
          setAddresses(data.addresses);
        } else if (storeAddresses.length > 0) {
          setLocalAddresses(storeAddresses);
        } else {
          // Default initial address
          const initialAddr: Address = {
            id: "addr_default_1",
            firstName: "John",
            lastName: "Smith",
            street: "742 Evergreen Terrace",
            city: "Springfield",
            state: "IL",
            postalCode: "62704",
            country: "US",
            phone: "+1 (555) 019-2834",
            isDefault: true,
          };
          setLocalAddresses([initialAddr]);
          setAddresses([initialAddr]);
        }
      })
      .catch(() => {
        setLocalAddresses(storeAddresses);
      })
      .finally(() => setLoading(false));
  }, []);

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({
      firstName: "",
      lastName: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "US",
      phone: "",
      isDefault: addresses.length === 0,
    });
    setModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setFormData({
      firstName: addr.firstName || "",
      lastName: addr.lastName || "",
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      postalCode: addr.postalCode || "",
      country: addr.country || "US",
      phone: addr.phone || "",
      isDefault: Boolean(addr.isDefault),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingAddress) {
        // PUT update address
        const res = await fetch("/api/users/addresses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingAddress.id, ...formData }),
        });
        const data = await res.json();
        if (data.success && data.addresses) {
          setLocalAddresses(data.addresses);
          setAddresses(data.addresses);
        } else {
          const updated = addresses.map((a) => (a.id === editingAddress.id ? { ...a, ...formData } : a));
          setLocalAddresses(updated);
          setAddresses(updated);
        }
      } else {
        // POST create address
        const res = await fetch("/api/users/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success && data.addresses) {
          setLocalAddresses(data.addresses);
          setAddresses(data.addresses);
        } else {
          const newAddr: Address = {
            id: `addr_${Date.now()}`,
            ...formData,
          };
          const updated = [...addresses, newAddr];
          setLocalAddresses(updated);
          setAddresses(updated);
        }
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Address save error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/users/addresses?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success && data.addresses) {
        setLocalAddresses(data.addresses);
        setAddresses(data.addresses);
      } else {
        const updated = addresses.filter((a) => a.id !== id);
        setLocalAddresses(updated);
        setAddresses(updated);
      }
    } catch (err) {
      console.error("Address delete error:", err);
    }
  };

  const handleSetDefault = async (addr: Address) => {
    try {
      selectAddress(addr.id);
      const updated = addresses.map((a) => ({ ...a, isDefault: a.id === addr.id }));
      setLocalAddresses(updated);
      setAddresses(updated);
      await fetch("/api/users/addresses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: addr.id, isDefault: true }),
      });
    } catch (err) {
      console.error("Set default error:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 border border-gray-100 bg-white rounded-3xl animate-pulse space-y-4">
        <div className="h-6 w-40 bg-gray-100 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 bg-gray-50 rounded-2xl"></div>
          <div className="h-40 bg-gray-50 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border border-gray-100 bg-white rounded-3xl shadow-sm space-y-6 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#007BFF]">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-gray-900">Delivery Addresses</h2>
            <p className="text-[11px] text-gray-400 font-semibold">
              Manage saved shipping & billing destinations for fast checkout
            </p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="py-2.5 px-4 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/15 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => {
          const isDefault = addr.isDefault || addr.id === selectedAddressId;

          return (
            <div
              key={addr.id}
              className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-4 ${
                isDefault
                  ? "border-[#007BFF] bg-blue-50/20 shadow-sm"
                  : "border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-white"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                    {addr.firstName} {addr.lastName}
                  </span>
                  {isDefault && (
                    <span className="text-[9px] font-black uppercase text-[#007BFF] bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Default
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-600 font-medium space-y-0.5">
                  <p>{addr.street}</p>
                  <p>
                    {addr.city}, {addr.state} {addr.postalCode}
                  </p>
                  <p>{addr.country}</p>
                  {addr.phone && (
                    <p className="text-[11px] text-gray-400 font-semibold flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" />
                      {addr.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                {!isDefault ? (
                  <button
                    onClick={() => handleSetDefault(addr)}
                    className="text-[11px] font-bold text-[#007BFF] hover:underline"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-[10px] text-gray-400 font-bold">Selected Destination</span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(addr)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl z-10 border border-gray-100 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-base font-black text-gray-900">
                  {editingAddress ? "Edit Delivery Address" : "Add New Address"}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="John"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Smith"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="123 Innovation Street, Suite 400"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="New York"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      State / Province
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="NY"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      Postal / ZIP Code
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="10001"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isDefaultCheck"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded text-[#007BFF] focus:ring-[#007BFF]"
                  />
                  <label htmlFor="isDefaultCheck" className="text-xs font-semibold text-gray-700">
                    Set as default delivery address
                  </label>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-[#007BFF] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/15 flex items-center justify-center gap-2 transition-all"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Address"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
