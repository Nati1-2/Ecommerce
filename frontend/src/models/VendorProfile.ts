import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVendorProfile extends Document {
  userId: string; // linked to User._id
  storeName: string;
  slug: string;
  logo: string;
  banner: string;
  description: string;
  rating: number;
  totalReviews: number;
  verified: boolean;
  productCount: number;
  joinedDate: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  shipping: {
    freeShippingThreshold: number;
    standardShippingFee: number;
    expressShippingFee: number;
    estimatedDeliveryDays: string;
    deliveryZones: string[];
  };
  returns: {
    returnWindowDays: number;
    policyText: string;
    allowRefunds: boolean;
  };
  tax: {
    vatNumber: string;
    taxRatePercent: number;
    pricesIncludeTax: boolean;
  };
  notifications: {
    emailOrderAlerts: boolean;
    smsOrderAlerts: boolean;
    payoutAlerts: boolean;
    lowStockAlerts: boolean;
    customerReviewAlerts: boolean;
  };
  companyDetails: {
    legalName: string;
    taxId: string;
    registrationNumber: string;
    address: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const vendorProfileSchema = new Schema<IVendorProfile>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    storeName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    logo: { type: String, default: "" },
    banner: { type: String, default: "" },
    description: { type: String, default: "" },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    productCount: { type: Number, default: 0 },
    joinedDate: { type: String, default: () => new Date().toISOString().split("T")[0] },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zip: { type: String, default: "" },
      country: { type: String, default: "United States" },
    },
    shipping: {
      freeShippingThreshold: { type: Number, default: 100 },
      standardShippingFee: { type: Number, default: 9.99 },
      expressShippingFee: { type: Number, default: 24.99 },
      estimatedDeliveryDays: { type: String, default: "2-4 Business Days" },
      deliveryZones: [{ type: String }],
    },
    returns: {
      returnWindowDays: { type: Number, default: 30 },
      policyText: { type: String, default: "30-day return policy." },
      allowRefunds: { type: Boolean, default: true },
    },
    tax: {
      vatNumber: { type: String, default: "" },
      taxRatePercent: { type: Number, default: 8.5 },
      pricesIncludeTax: { type: Boolean, default: false },
    },
    notifications: {
      emailOrderAlerts: { type: Boolean, default: true },
      smsOrderAlerts: { type: Boolean, default: false },
      payoutAlerts: { type: Boolean, default: true },
      lowStockAlerts: { type: Boolean, default: true },
      customerReviewAlerts: { type: Boolean, default: true },
    },
    companyDetails: {
      legalName: { type: String, default: "" },
      taxId: { type: String, default: "" },
      registrationNumber: { type: String, default: "" },
      address: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete (ret as any)._id;
        delete (ret as any).__v;
      },
    },
  }
);

export const VendorProfile: Model<IVendorProfile> =
  mongoose.models.VendorProfile ||
  mongoose.model<IVendorProfile>("VendorProfile", vendorProfileSchema);
