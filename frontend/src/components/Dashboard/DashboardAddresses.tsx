"use client";

import { useEffect, useState } from "react";
import { useCheckoutStore, Address } from "@/store/checkoutStore";
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, X, Phone, Loader2 } from "lucide-react";
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
          setLocalAddresses([]);
          setAddresses([]);
        }
      })
      .catch(() => {
        setLocalAddresses(storeAddresses.length > 0 ? storeAddresses : []);
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
      <div className="p-8 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl animate-pulse space-y-4">
        <div className="h-6 w-40 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 bg-slate-50 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-40 bg-slate-50 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-xs space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">Delivery Addresses</h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">
              Manage saved shipping & billing destinations for fast checkout
            </p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800/60 space-y-3">
          <MapPin className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto stroke-[1.5]" />
          <div>
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-200">
              No saved delivery addresses
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto mt-0.5">
              Add your preferred shipping address to enable 1-click checkout.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Delivery Address</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => {
            const isDefault = addr.isDefault || addr.id === selectedAddressId;

            return (
              <div
                key={addr.id}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-4 ${
                  isDefault
                    ? "border-blue-600 dark:border-blue-500 bg-blue-50/30 dark:bg-blue-950/20 shadow-xs"
                    : "border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                      {addr.firstName} {addr.lastName}
                    </span>
                    {isDefault && (
                      <span className="text-[9px] font-black uppercase text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-blue-200 dark:border-blue-800">
                        <CheckCircle2 className="w-3 h-3" />
                        Default
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 font-medium space-y-0.5">
                    <p>{addr.street}</p>
                    <p>
                      {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                    <p>{addr.country}</p>
                    {addr.phone && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3" />
                        {addr.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800 pt-3 text-xs">
                  {!isDefault ? (
                    <button
                      onClick={() => handleSetDefault(addr)}
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                      Selected Destination
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(addr)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Edit Address"
                      aria-label="Edit Address"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Delete Address"
                      aria-label="Delete Address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl z-10 border border-slate-200/80 dark:border-slate-800 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {editingAddress ? "Edit Delivery Address" : "Add New Address"}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="First name"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Last name"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="Street, apartment, suite, unit"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">
                      State / Province
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">
                      Postal / ZIP Code
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="ZIP code"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Phone number"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                  />
                  <label htmlFor="isDefault" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Set as default delivery destination
                  </label>
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Address</span>
                    )}
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
