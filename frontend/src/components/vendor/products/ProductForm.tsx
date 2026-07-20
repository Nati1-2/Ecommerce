"use client";

import { useState } from "react";
import { VendorProduct, ProductVariant } from "@/types/vendor";
import ImageUploader from "./ImageUploader";
import VariantManager from "./VariantManager";
import { Save, Eye, ArrowLeft, CheckCircle2, AlertTriangle, Layers } from "lucide-react";
import Link from "next/link";

interface Props {
  initialData?: VendorProduct;
  onSubmit: (data: Partial<VendorProduct>) => void;
  isSubmitting?: boolean;
  onPreview: (data: VendorProduct) => void;
}

export default function ProductForm({ initialData, onSubmit, isSubmitting = false, onPreview }: Props) {
  const [name, setName] = useState(initialData?.name || "");
  const [sku, setSku] = useState(initialData?.sku || "");
  const [brand, setBrand] = useState(initialData?.brand || "Apex Tech");
  const [category, setCategory] = useState(initialData?.category || "Laptops & Computers");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price || 199.00);
  const [discountPrice, setDiscountPrice] = useState(initialData?.discountPrice || undefined);
  const [stock, setStock] = useState(initialData?.stock || 25);
  const [warehouseLocation, setWarehouseLocation] = useState(initialData?.warehouseLocation || "USA-WEST-01");
  const [lowStockThreshold, setLowStockThreshold] = useState(initialData?.lowStockThreshold || 5);
  const [images, setImages] = useState<string[]>(
    initialData?.images || ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80"]
  );
  const [variants, setVariants] = useState<ProductVariant[]>(initialData?.variants || []);
  const [weightKg, setWeightKg] = useState(initialData?.weightKg || 1.2);
  const [length, setLength] = useState(initialData?.dimensionsCm?.length || 30);
  const [width, setWidth] = useState(initialData?.dimensionsCm?.width || 20);
  const [height, setHeight] = useState(initialData?.dimensionsCm?.height || 5);
  const [deliveryTimeDays, setDeliveryTimeDays] = useState(initialData?.deliveryTimeDays || "2-3 Business Days");
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      sku,
      brand,
      category,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock),
      warehouseLocation,
      lowStockThreshold: Number(lowStockThreshold),
      images,
      variants,
      weightKg: Number(weightKg),
      dimensionsCm: { length: Number(length), width: Number(width), height: Number(height) },
      deliveryTimeDays,
      seoTitle,
      metaDescription,
    });
  };

  const currentProductMock: VendorProduct = {
    id: initialData?.id || "preview_id",
    name: name || "Product Name",
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    sku: sku || "SKU-PREVIEW",
    brand,
    category,
    description,
    price: Number(price) || 0,
    discountPrice: discountPrice ? Number(discountPrice) : undefined,
    currency: "USD",
    taxRate: 8.5,
    stock: Number(stock) || 0,
    warehouseLocation,
    lowStockThreshold: Number(lowStockThreshold) || 5,
    status: initialData?.status || "Draft",
    images,
    variants,
    weightKg: Number(weightKg),
    dimensionsCm: { length: Number(length), width: Number(width), height: Number(height) },
    deliveryTimeDays,
    salesCount: initialData?.salesCount || 0,
    revenueGenerated: initialData?.revenueGenerated || 0,
    createdAt: initialData?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/vendor/products"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {initialData ? `Edit Product: ${initialData.name}` : "Add New Product"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Fill in product attributes, pricing, media and variants.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onPreview(currentProductMock)}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-blue-500" />
            <span>Storefront Preview</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-blue-500/25 flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "Saving..." : initialData ? "Update Product" : "Submit for Approval"}</span>
          </button>
        </div>
      </div>

      {/* Approval Status Banner */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 rounded-2xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
          <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
          <span>
            <strong>Approval Workflow:</strong> Products submitted are automatically verified by Admin Services before listing publicly on marketplace.
          </span>
        </div>
      </div>

      {/* Form Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Core info & media (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Basic Information
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Product Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. UltraBook Pro M3 Max 16-inch"
                  className="w-full mt-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="UBP-M3M-16"
                    className="w-full mt-1 px-4 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Brand Name</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Apex Tech"
                    className="w-full mt-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                >
                  <option value="Laptops & Computers">Laptops & Computers</option>
                  <option value="Audio">Audio</option>
                  <option value="Monitors">Monitors</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Office">Office</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed product specification and features..."
                  className="w-full mt-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Media Uploader */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <ImageUploader images={images} onChange={setImages} />
          </div>

          {/* Variants */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <VariantManager variants={variants} onChange={setVariants} basePrice={Number(price)} />
          </div>
        </div>

        {/* Right Column: Pricing, Inventory, Shipping & SEO */}
        <div className="space-y-8">
          {/* Pricing & Stock */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Pricing & Stock
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Base Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full mt-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-600 outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Discount Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={discountPrice || ""}
                  onChange={(e) => setDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Optional promotional price"
                  className="w-full mt-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Initial Stock Units *</label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full mt-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-600 outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Warehouse Hub</label>
                <select
                  value={warehouseLocation}
                  onChange={(e) => setWarehouseLocation(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                >
                  <option value="USA-WEST-01">USA-WEST-01 (San Jose)</option>
                  <option value="USA-EAST-02">USA-EAST-02 (New York)</option>
                  <option value="USA-CENTRAL-01">USA-CENTRAL-01 (Chicago)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Low Stock Limit Warning</label>
                <input
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                  className="w-full mt-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Shipping & Logistics
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Weight (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full mt-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500">L (cm)</label>
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full mt-1 px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500">W (cm)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full mt-1 px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500">H (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full mt-1 px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Estimated Delivery</label>
                <input
                  type="text"
                  value={deliveryTimeDays}
                  onChange={(e) => setDeliveryTimeDays(e.target.value)}
                  placeholder="e.g. 2-3 Business Days"
                  className="w-full mt-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
