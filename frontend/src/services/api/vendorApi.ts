import {
  VendorProfile,
  VendorMetrics,
  VendorProduct,
  InventoryItem,
  VendorOrder,
  VendorCustomer,
  VendorReview,
  VendorAnalytics,
  PaymentTransaction,
  VendorPayout,
  VendorStoreSettings,
  OrderStatus,
} from "@/types/vendor";

// MOCK DATA STORAGE
let mockProfile: VendorProfile = {
  id: "v_109283",
  storeName: "Apex Tech Labs",
  slug: "apex-tech-labs",
  logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=200&q=80",
  banner: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&h=300&q=80",
  description: "Official Flagship Store for High-Performance Electronics, Gaming Gear & Premium Audio.",
  rating: 4.88,
  totalReviews: 1420,
  verified: true,
  productCount: 48,
  joinedDate: "2023-04-12",
  email: "seller@apextech.io",
  phone: "+1 (800) 555-0199",
  address: {
    street: "742 Silicon Parkway, Suite 400",
    city: "San Jose",
    state: "CA",
    zip: "95134",
    country: "United States",
  },
};

let mockMetrics: VendorMetrics = {
  totalRevenue: 184920.50,
  revenueChangePercent: 14.8,
  totalOrders: 1240,
  ordersChangePercent: 8.2,
  productsSold: 3410,
  productsSoldChangePercent: 12.1,
  totalCustomers: 980,
  customersChangePercent: 5.4,
  pendingOrdersCount: 12,
  processingOrdersCount: 28,
  shippedOrdersCount: 45,
  deliveredOrdersCount: 1140,
  cancelledOrdersCount: 15,
  lowStockCount: 4,
  outOfStockCount: 2,
};

let mockProducts: VendorProduct[] = [
  {
    id: "prod_1",
    name: "UltraBook Pro M3 Max 16-inch",
    slug: "ultrabook-pro-m3-max",
    sku: "UBP-M3M-16",
    brand: "Apex Tech",
    category: "Laptops & Computers",
    description: "Enterprise workstation laptop with 36GB Unified Memory, 1TB NVMe SSD, Liquid Retina XDR display.",
    price: 2499.00,
    discountPrice: 2299.00,
    currency: "USD",
    taxRate: 8.5,
    stock: 24,
    warehouseLocation: "USA-WEST-01",
    lowStockThreshold: 5,
    status: "Active",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80"
    ],
    variants: [
      { id: "v1", name: "16GB RAM / 512GB SSD", sku: "UBP-16-512", price: 1999.00, stock: 12, attributes: { RAM: "16GB", Storage: "512GB" } },
      { id: "v2", name: "36GB RAM / 1TB SSD", sku: "UBP-36-1TB", price: 2499.00, stock: 12, attributes: { RAM: "36GB", Storage: "1TB" } }
    ],
    weightKg: 2.1,
    dimensionsCm: { length: 35.5, width: 24.8, height: 1.68 },
    deliveryTimeDays: "2-3 Business Days",
    seoTitle: "Buy UltraBook Pro M3 Max 16-inch - Apex Tech",
    metaDescription: "Get the fastest enterprise laptop with Liquid Retina XDR and 36GB memory.",
    salesCount: 382,
    revenueGenerated: 878200.00,
    createdAt: "2024-01-15",
    updatedAt: "2026-07-10",
  },
  {
    id: "prod_2",
    name: "SonicPro Wireless ANC Headphones",
    slug: "sonicpro-wireless-anc",
    sku: "SP-ANC-BLK",
    brand: "Apex Sound",
    category: "Audio",
    description: "Active noise cancelling wireless headphones with 40h battery life and spatial audio.",
    price: 349.99,
    discountPrice: 299.99,
    currency: "USD",
    taxRate: 8.5,
    stock: 4,
    warehouseLocation: "USA-EAST-02",
    lowStockThreshold: 10,
    status: "Active",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
    ],
    variants: [
      { id: "v3", name: "Matte Black", sku: "SP-ANC-BLK", price: 349.99, stock: 2, attributes: { Color: "Black" } },
      { id: "v4", name: "Silver White", sku: "SP-ANC-SLV", price: 349.99, stock: 2, attributes: { Color: "Silver" } }
    ],
    weightKg: 0.38,
    dimensionsCm: { length: 20, width: 18, height: 8 },
    deliveryTimeDays: "1-2 Business Days",
    salesCount: 840,
    revenueGenerated: 251990.00,
    createdAt: "2024-03-01",
    updatedAt: "2026-07-12",
  },
  {
    id: "prod_3",
    name: "Quantum OLED Curved Gaming Monitor 34\"",
    slug: "quantum-oled-curved-monitor-34",
    sku: "MON-34-OLED",
    brand: "Apex Vision",
    category: "Monitors",
    description: "175Hz 0.03ms QD-OLED ultra-wide curved gaming display with HDR True Black 400.",
    price: 999.00,
    currency: "USD",
    taxRate: 8.5,
    stock: 0,
    warehouseLocation: "USA-WEST-01",
    lowStockThreshold: 5,
    status: "Active",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80"
    ],
    variants: [],
    weightKg: 8.5,
    dimensionsCm: { length: 81.5, width: 30.2, height: 52 },
    deliveryTimeDays: "3-5 Business Days",
    salesCount: 195,
    revenueGenerated: 194805.00,
    createdAt: "2024-05-10",
    updatedAt: "2026-07-15",
  },
  {
    id: "prod_4",
    name: "Apex Mechanical Keyboard RGB (Custom Swappable)",
    slug: "apex-mechanical-keyboard-rgb",
    sku: "KB-RGB-SWAP",
    brand: "Apex Gear",
    category: "Accessories",
    description: "75% Hot-swappable wireless mechanical keyboard with gasket mount & PBT keycaps.",
    price: 149.00,
    currency: "USD",
    taxRate: 8.5,
    stock: 65,
    warehouseLocation: "USA-CENTRAL-01",
    lowStockThreshold: 15,
    status: "Active",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"
    ],
    variants: [],
    weightKg: 1.1,
    dimensionsCm: { length: 32, width: 14, height: 4 },
    deliveryTimeDays: "2-4 Business Days",
    salesCount: 520,
    revenueGenerated: 77480.00,
    createdAt: "2024-06-18",
    updatedAt: "2026-07-02",
  },
  {
    id: "prod_5",
    name: "SmartDesk Electric Standing Frame",
    slug: "smartdesk-electric-standing-frame",
    sku: "DSK-ELEC-DUAL",
    brand: "Apex Home",
    category: "Office",
    description: "Dual motor ergonomic standing desk frame with memory keypads & cable tray.",
    price: 499.00,
    currency: "USD",
    taxRate: 8.5,
    stock: 3,
    warehouseLocation: "USA-WEST-01",
    lowStockThreshold: 5,
    status: "Draft",
    images: [
      "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=600&q=80"
    ],
    variants: [],
    weightKg: 28,
    dimensionsCm: { length: 110, width: 20, height: 25 },
    deliveryTimeDays: "4-7 Business Days",
    salesCount: 45,
    revenueGenerated: 22455.00,
    createdAt: "2024-07-01",
    updatedAt: "2026-07-16",
  }
];

let mockInventory: InventoryItem[] = mockProducts.map(p => ({
  id: `inv_${p.id}`,
  productId: p.id,
  productName: p.name,
  productImage: p.images[0] || "",
  sku: p.sku,
  totalStock: p.stock + 5,
  availableStock: p.stock,
  reservedStock: 5,
  warehouse: p.warehouseLocation,
  status: p.stock === 0 ? "Out of Stock" : p.stock <= p.lowStockThreshold ? "Low Stock" : "In Stock",
  lastUpdated: p.updatedAt,
}));

let mockOrders: VendorOrder[] = [
  {
    id: "ord_1001",
    orderNumber: "ORD-2026-8940",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.j@techcorp.com",
    customerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    items: [
      {
        id: "item_1",
        productId: "prod_1",
        productName: "UltraBook Pro M3 Max 16-inch",
        productImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
        quantity: 1,
        unitPrice: 2299.00
      }
    ],
    totalAmount: 2299.00,
    paymentMethod: "Credit Card (Visa)",
    paymentStatus: "Paid",
    status: "Processing",
    shippingAddress: "450 Mission St, San Francisco, CA 94105",
    createdAt: "2026-07-18T10:14:00Z",
    updatedAt: "2026-07-18T10:15:00Z",
  },
  {
    id: "ord_1002",
    orderNumber: "ORD-2026-8941",
    customerName: "Michael Chen",
    customerEmail: "mchen@horizon.dev",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    items: [
      {
        id: "item_2",
        productId: "prod_2",
        productName: "SonicPro Wireless ANC Headphones",
        productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        quantity: 2,
        unitPrice: 299.99
      }
    ],
    totalAmount: 599.98,
    paymentMethod: "Apple Pay",
    paymentStatus: "Paid",
    status: "Pending",
    shippingAddress: "1200 Market Street, Seattle, WA 98101",
    createdAt: "2026-07-18T08:30:00Z",
    updatedAt: "2026-07-18T08:30:00Z",
  },
  {
    id: "ord_1003",
    orderNumber: "ORD-2026-8939",
    customerName: "Elena Rostova",
    customerEmail: "elena.r@designhub.io",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    items: [
      {
        id: "item_3",
        productId: "prod_4",
        productName: "Apex Mechanical Keyboard RGB",
        productImage: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
        quantity: 1,
        unitPrice: 149.00
      }
    ],
    totalAmount: 149.00,
    paymentMethod: "PayPal",
    paymentStatus: "Paid",
    status: "Shipped",
    trackingNumber: "TRK-982341908-US",
    carrier: "FedEx Express",
    shippingAddress: "88 Broadway Ave, New York, NY 10003",
    createdAt: "2026-07-17T14:20:00Z",
    updatedAt: "2026-07-18T09:00:00Z",
  },
  {
    id: "ord_1004",
    orderNumber: "ORD-2026-8938",
    customerName: "David Miller",
    customerEmail: "david.m@apex.com",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    items: [
      {
        id: "item_4",
        productId: "prod_3",
        productName: "Quantum OLED Curved Gaming Monitor 34\"",
        productImage: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
        quantity: 1,
        unitPrice: 999.00
      }
    ],
    totalAmount: 999.00,
    paymentMethod: "Credit Card (Mastercard)",
    paymentStatus: "Paid",
    status: "Delivered",
    trackingNumber: "TRK-441092831-UPS",
    carrier: "UPS Ground",
    shippingAddress: "320 N Michigan Ave, Chicago, IL 60601",
    createdAt: "2026-07-15T11:00:00Z",
    updatedAt: "2026-07-17T16:45:00Z",
  }
];

let mockCustomers: VendorCustomer[] = [
  {
    id: "cust_1",
    name: "Sarah Jenkins",
    email: "sarah.j@techcorp.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    phone: "+1 (415) 890-1234",
    location: "San Francisco, CA",
    totalOrders: 14,
    totalSpent: 12490.00,
    lastPurchaseDate: "2026-07-18",
    memberSince: "2024-02-10",
    status: "VIP",
  },
  {
    id: "cust_2",
    name: "Michael Chen",
    email: "mchen@horizon.dev",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    phone: "+1 (206) 555-9012",
    location: "Seattle, WA",
    totalOrders: 6,
    totalSpent: 3420.50,
    lastPurchaseDate: "2026-07-18",
    memberSince: "2024-08-19",
    status: "Active",
  },
  {
    id: "cust_3",
    name: "Elena Rostova",
    email: "elena.r@designhub.io",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    phone: "+1 (212) 345-6789",
    location: "New York, NY",
    totalOrders: 9,
    totalSpent: 5120.00,
    lastPurchaseDate: "2026-07-17",
    memberSince: "2024-05-01",
    status: "VIP",
  },
  {
    id: "cust_4",
    name: "David Miller",
    email: "david.m@apex.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    phone: "+1 (312) 789-0123",
    location: "Chicago, IL",
    totalOrders: 3,
    totalSpent: 1840.00,
    lastPurchaseDate: "2026-07-15",
    memberSince: "2025-01-12",
    status: "Active",
  }
];

let mockReviews: VendorReview[] = [
  {
    id: "rev_1",
    productId: "prod_1",
    productName: "UltraBook Pro M3 Max 16-inch",
    productImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    customerName: "Sarah Jenkins",
    customerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    comment: "Absolute powerhouse laptop! The display color accuracy is unbelievable for editing 4K footage and compiling large codebases.",
    createdAt: "2026-07-16T14:00:00Z",
    reply: {
      text: "Thank you so much Sarah! We are thrilled to hear the UltraBook Pro is boosting your workflow.",
      repliedAt: "2026-07-16T16:30:00Z"
    },
    status: "Published",
  },
  {
    id: "rev_2",
    productId: "prod_2",
    productName: "SonicPro Wireless ANC Headphones",
    productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    customerName: "Michael Chen",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 4,
    comment: "Great sound cancellation during flights. Ear cushions are soft and comfy. Fast shipping from Apex Tech!",
    createdAt: "2026-07-12T09:15:00Z",
    status: "Published",
  },
  {
    id: "rev_3",
    productId: "prod_3",
    productName: "Quantum OLED Curved Gaming Monitor 34\"",
    productImage: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
    customerName: "Elena Rostova",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    comment: "The deep blacks on QD-OLED are mindblowing. No ghosting or motion blur at 175Hz.",
    createdAt: "2026-07-08T18:22:00Z",
    status: "Published",
  }
];

let mockAnalytics: VendorAnalytics = {
  dailyPerformance: [
    { date: "Jul 12", revenue: 14200, orders: 42, profit: 4200, conversionRate: 3.4, views: 1240 },
    { date: "Jul 13", revenue: 18900, orders: 58, profit: 5600, conversionRate: 3.8, views: 1520 },
    { date: "Jul 14", revenue: 16500, orders: 49, profit: 4900, conversionRate: 3.5, views: 1400 },
    { date: "Jul 15", revenue: 22400, orders: 67, profit: 7100, conversionRate: 4.1, views: 1630 },
    { date: "Jul 16", revenue: 28100, orders: 84, profit: 9200, conversionRate: 4.6, views: 1820 },
    { date: "Jul 17", revenue: 25400, orders: 76, profit: 8100, conversionRate: 4.3, views: 1750 },
    { date: "Jul 18", revenue: 31200, orders: 92, profit: 10400, conversionRate: 4.9, views: 1980 },
  ],
  categoryBreakdown: [
    { category: "Laptops & Computers", revenue: 94000, sales: 382 },
    { category: "Audio", revenue: 45000, sales: 840 },
    { category: "Monitors", revenue: 32000, sales: 195 },
    { category: "Accessories", revenue: 13920, sales: 520 },
  ],
  conversionRate: 4.25,
  averageOrderValue: 412.50,
  repeatCustomerRate: 38.4,
  topGeographicRegions: [
    { region: "California, USA", sales: 420, revenue: 64200 },
    { region: "New York, USA", sales: 310, revenue: 48900 },
    { region: "Washington, USA", sales: 180, revenue: 28400 },
    { region: "Texas, USA", sales: 150, revenue: 22100 },
  ],
};

let mockTransactions: PaymentTransaction[] = [
  { id: "tx_1", orderId: "ord_1001", orderNumber: "ORD-2026-8940", amount: 2299.00, fee: 66.67, netAmount: 2232.33, type: "Sale", status: "Completed", date: "2026-07-18" },
  { id: "tx_2", orderId: "ord_1002", orderNumber: "ORD-2026-8941", amount: 599.98, fee: 17.40, netAmount: 582.58, type: "Sale", status: "Completed", date: "2026-07-18" },
  { id: "tx_3", orderId: "ord_1003", orderNumber: "ORD-2026-8939", amount: 149.00, fee: 4.32, netAmount: 144.68, type: "Sale", status: "Completed", date: "2026-07-17" },
  { id: "tx_4", orderId: "ord_1004", orderNumber: "ORD-2026-8938", amount: 999.00, fee: 28.97, netAmount: 970.03, type: "Sale", status: "Completed", date: "2026-07-15" },
];

let mockPayouts: VendorPayout[] = [
  { id: "po_1", amount: 14820.00, currency: "USD", status: "Paid", payoutMethod: "Stripe Direct Deposit", bankAccountLast4: "4092", initiatedAt: "2026-07-15", estimatedArrival: "2026-07-16" },
  { id: "po_2", amount: 28910.50, currency: "USD", status: "Processing", payoutMethod: "Stripe Direct Deposit", bankAccountLast4: "4092", initiatedAt: "2026-07-18", estimatedArrival: "2026-07-19" },
];

let mockSettings: VendorStoreSettings = {
  storeName: "Apex Tech Labs",
  logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=200&q=80",
  banner: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&h=300&q=80",
  description: "Official Flagship Store for High-Performance Electronics, Gaming Gear & Premium Audio.",
  email: "seller@apextech.io",
  phone: "+1 (800) 555-0199",
  companyDetails: {
    legalName: "Apex Tech Corp LLC",
    taxId: "EIN-892341908",
    registrationNumber: "LLC-CA-98124",
    address: "742 Silicon Parkway, Suite 400, San Jose, CA 95134",
  },
  shipping: {
    freeShippingThreshold: 150,
    standardShippingFee: 9.99,
    expressShippingFee: 24.99,
    estimatedDeliveryDays: "2-4 Business Days",
    deliveryZones: ["United States", "Canada", "European Union", "United Kingdom"],
  },
  returns: {
    returnWindowDays: 30,
    policyText: "30-day hassle free money back guarantee. Returned items must be in original box with all accessories included.",
    allowRefunds: true,
  },
  tax: {
    vatNumber: "US-892341908-VAT",
    taxRatePercent: 8.5,
    pricesIncludeTax: false,
  },
  notifications: {
    emailOrderAlerts: true,
    smsOrderAlerts: true,
    payoutAlerts: true,
    lowStockAlerts: true,
    customerReviewAlerts: true,
  },
};

// HELPER DELAY
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const vendorApi = {
  getProfile: async (): Promise<VendorProfile> => {
    await delay(200);
    return { ...mockProfile };
  },

  getMetrics: async (): Promise<VendorMetrics> => {
    await delay(200);
    return { ...mockMetrics };
  },

  getProducts: async (): Promise<VendorProduct[]> => {
    await delay(250);
    return [...mockProducts];
  },

  getProductById: async (id: string): Promise<VendorProduct | undefined> => {
    await delay(200);
    return mockProducts.find(p => p.id === id);
  },

  createProduct: async (productData: Partial<VendorProduct>): Promise<VendorProduct> => {
    await delay(400);
    const newProd: VendorProduct = {
      id: `prod_${Date.now()}`,
      name: productData.name || "New Product",
      slug: (productData.name || "new-product").toLowerCase().replace(/\s+/g, "-"),
      sku: productData.sku || `SKU-${Math.floor(Math.random() * 9000 + 1000)}`,
      brand: productData.brand || "Apex Tech",
      category: productData.category || "General",
      description: productData.description || "",
      price: productData.price || 99.00,
      discountPrice: productData.discountPrice,
      currency: "USD",
      taxRate: 8.5,
      stock: productData.stock || 10,
      warehouseLocation: productData.warehouseLocation || "USA-WEST-01",
      lowStockThreshold: productData.lowStockThreshold || 5,
      status: "Pending", // Submitted for approval
      approvalMessage: "Submitted for admin review",
      images: productData.images || ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80"],
      variants: productData.variants || [],
      weightKg: productData.weightKg || 1,
      dimensionsCm: productData.dimensionsCm || { length: 10, width: 10, height: 10 },
      deliveryTimeDays: productData.deliveryTimeDays || "2-3 Days",
      salesCount: 0,
      revenueGenerated: 0,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    mockProducts.unshift(newProd);
    mockProfile.productCount += 1;
    return newProd;
  },

  updateProduct: async (id: string, updates: Partial<VendorProduct>): Promise<VendorProduct> => {
    await delay(400);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");

    mockProducts[index] = {
      ...mockProducts[index],
      ...updates,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    return mockProducts[index];
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    await delay(300);
    mockProducts = mockProducts.filter(p => p.id !== id);
    mockProfile.productCount = Math.max(0, mockProfile.productCount - 1);
    return true;
  },

  duplicateProduct: async (id: string): Promise<VendorProduct> => {
    await delay(300);
    const original = mockProducts.find(p => p.id === id);
    if (!original) throw new Error("Product not found");

    const copy: VendorProduct = {
      ...original,
      id: `prod_${Date.now()}`,
      name: `${original.name} (Copy)`,
      sku: `${original.sku}-COPY`,
      status: "Draft",
      salesCount: 0,
      revenueGenerated: 0,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    mockProducts.unshift(copy);
    return copy;
  },

  bulkDeleteProducts: async (ids: string[]): Promise<boolean> => {
    await delay(400);
    mockProducts = mockProducts.filter(p => !ids.includes(p.id));
    mockProfile.productCount = mockProducts.length;
    return true;
  },

  bulkActivateProducts: async (ids: string[]): Promise<boolean> => {
    await delay(300);
    mockProducts = mockProducts.map(p => ids.includes(p.id) ? { ...p, status: "Active" } : p);
    return true;
  },

  getInventory: async (): Promise<InventoryItem[]> => {
    await delay(250);
    // sync with mockProducts
    return mockProducts.map(p => ({
      id: `inv_${p.id}`,
      productId: p.id,
      productName: p.name,
      productImage: p.images[0] || "",
      sku: p.sku,
      totalStock: p.stock + 5,
      availableStock: p.stock,
      reservedStock: 5,
      warehouse: p.warehouseLocation,
      status: p.stock === 0 ? "Out of Stock" : p.stock <= p.lowStockThreshold ? "Low Stock" : "In Stock",
      lastUpdated: p.updatedAt,
    }));
  },

  updateStock: async (productId: string, newStock: number): Promise<boolean> => {
    await delay(300);
    const prod = mockProducts.find(p => p.id === productId);
    if (prod) {
      prod.stock = newStock;
      prod.updatedAt = new Date().toISOString().split("T")[0];
    }
    return true;
  },

  getOrders: async (): Promise<VendorOrder[]> => {
    await delay(250);
    return [...mockOrders];
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<VendorOrder> => {
    await delay(300);
    const index = mockOrders.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error("Order not found");

    mockOrders[index].status = status;
    mockOrders[index].updatedAt = new Date().toISOString();
    return mockOrders[index];
  },

  getCustomers: async (): Promise<VendorCustomer[]> => {
    await delay(250);
    return [...mockCustomers];
  },

  getReviews: async (): Promise<VendorReview[]> => {
    await delay(250);
    return [...mockReviews];
  },

  replyReview: async (reviewId: string, replyText: string): Promise<VendorReview> => {
    await delay(300);
    const rev = mockReviews.find(r => r.id === reviewId);
    if (!rev) throw new Error("Review not found");

    rev.reply = {
      text: replyText,
      repliedAt: new Date().toISOString(),
    };
    return rev;
  },

  getAnalytics: async (): Promise<VendorAnalytics> => {
    await delay(300);
    return { ...mockAnalytics };
  },

  getPayments: async (): Promise<{ transactions: PaymentTransaction[]; payouts: VendorPayout[]; balance: { available: number; pending: number; totalEarnings: number } }> => {
    await delay(300);
    return {
      transactions: [...mockTransactions],
      payouts: [...mockPayouts],
      balance: {
        available: 34920.50,
        pending: 28910.50,
        totalEarnings: 184920.50,
      }
    };
  },

  requestPayout: async (amount: number): Promise<VendorPayout> => {
    await delay(400);
    const newPayout: VendorPayout = {
      id: `po_${Date.now()}`,
      amount,
      currency: "USD",
      status: "Processing",
      payoutMethod: "Stripe Direct Deposit",
      bankAccountLast4: "4092",
      initiatedAt: new Date().toISOString().split("T")[0],
      estimatedArrival: "In 1-2 Business Days",
    };
    mockPayouts.unshift(newPayout);
    return newPayout;
  },

  getSettings: async (): Promise<VendorStoreSettings> => {
    await delay(200);
    return { ...mockSettings };
  },

  updateSettings: async (updates: Partial<VendorStoreSettings>): Promise<VendorStoreSettings> => {
    await delay(400);
    mockSettings = {
      ...mockSettings,
      ...updates,
    };
    return { ...mockSettings };
  }
};
