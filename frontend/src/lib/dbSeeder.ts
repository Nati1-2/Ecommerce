import bcrypt from "bcryptjs";

export async function seedDatabaseCollections() {
  try {
    const { User } = await import("@/models/User");
    const { VendorProfile } = await import("@/models/VendorProfile");
    const { VendorProduct } = await import("@/models/VendorProduct");
    const { Order } = await import("@/models/Order");
    const { Review } = await import("@/models/Review");

    const userCount = await User.countDocuments();
    if (userCount > 0) return; // already seeded

    console.log("🌱 Database is empty! Seeding MongoDB with real portfolio data...");

    // 1. Create Users
    const demoAccounts = [
      {
        email: "john.smith@gmail.com",
        plainPassword: "password123",
        name: "John Smith",
        role: "CUSTOMER" as const,
        id: "usr-demo-customer",
        _id: "usr-demo-customer",
        membership: "Standard Member ⭐",
        points: 120,
        isVerified: true,
      },
      {
        email: "vendor@natistore.com",
        plainPassword: "vendor123",
        name: "Apex Tech Wearables Store",
        role: "VENDOR" as const,
        id: "usr-demo-vendor",
        _id: "usr-demo-vendor",
        membership: "Vendor Merchant 🚀",
        points: 450,
        isVerified: true,
      },
      {
        email: "nati@admin.com",
        plainPassword: "nati1234",
        name: "Nati Demo Admin",
        role: "ADMIN" as const,
        id: "usr-demo-admin",
        _id: "usr-demo-admin",
        membership: "SuperAdmin Tier 👑",
        points: 9999,
        isVerified: true,
      },
    ];

    for (const account of demoAccounts) {
      const hashedPassword = await bcrypt.hash(account.plainPassword, 10);
      await User.create({
        ...account,
        password: hashedPassword,
      });
    }

    // 2. Create VendorProfile
    await VendorProfile.create({
      userId: "usr-demo-vendor",
      storeName: "Apex Tech Wearables Store",
      slug: "apex-tech-wearables",
      logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80",
      banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      description: "Your absolute destination for premium sports smartwatches, fitness trackers and audio tech.",
      rating: 4.8,
      totalReviews: 2,
      verified: true,
      productCount: 3,
      joinedDate: "2026-01-15",
      email: "vendor@natistore.com",
      phone: "+1 (555) 832-9210",
      address: { street: "100 Innovation Way", city: "San Jose", state: "CA", zip: "95110", country: "US" },
    });

    // 3. Create Products
    const productsData = [
      {
        _id: "prod-demo-1",
        vendorId: "usr-demo-vendor",
        name: "Apex Smart Watch Ultra",
        slug: "apex-smart-watch-ultra",
        sku: "APX-WCH-ULT",
        brand: "Apex",
        category: "Electronics",
        description: "A premium smartwatch with heart-rate sensor, GPS and water resistance.",
        price: 299.99,
        discountPrice: 249.99,
        currency: "USD",
        taxRate: 8,
        stock: 25,
        warehouseLocation: "Aisle 4, Shelf B",
        lowStockThreshold: 5,
        status: "Active",
        images: ["https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=400&q=80"],
        variants: [],
        salesCount: 145,
        revenueGenerated: 36248.55,
      },
      {
        _id: "prod-demo-2",
        vendorId: "usr-demo-vendor",
        name: "Sonic Bass Pro Wireless Headphones",
        slug: "sonic-bass-pro-wireless-headphones",
        sku: "SNC-HDP-BSS",
        brand: "Sonic",
        category: "Electronics",
        description: "Premium wireless over-ear headphones with active noise cancellation.",
        price: 189.99,
        discountPrice: 159.99,
        currency: "USD",
        taxRate: 8,
        stock: 3,
        warehouseLocation: "Aisle 2, Shelf A",
        lowStockThreshold: 5,
        status: "Active",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"],
        variants: [],
        salesCount: 92,
        revenueGenerated: 14719.08,
      },
      {
        _id: "prod-demo-3",
        vendorId: "usr-demo-vendor",
        name: "Pulse Fit Pro Tracker",
        slug: "pulse-fit-pro-tracker",
        sku: "PLS-FIT-TRK",
        brand: "Pulse",
        category: "Electronics",
        description: "Sleek fitness tracker band with automatic workout detection.",
        price: 99.99,
        discountPrice: 79.99,
        currency: "USD",
        taxRate: 8,
        stock: 0,
        warehouseLocation: "Aisle 4, Shelf C",
        lowStockThreshold: 5,
        status: "Active",
        images: ["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=400&q=80"],
        variants: [],
        salesCount: 210,
        revenueGenerated: 16797.90,
      }
    ];

    for (const p of productsData) {
      await VendorProduct.create(p);
    }

    // 4. Create Orders
    const ordersData = [
      {
        _id: "ord-demo-1001",
        orderId: "NATI-1001",
        userId: "usr-demo-customer",
        items: [
          {
            productId: "prod-demo-1",
            name: "Apex Smart Watch Ultra",
            image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=400&q=80",
            quantity: 1,
            price: 249.99,
          }
        ],
        totalAmount: 249.99,
        grandTotal: 249.99,
        paymentStatus: "PAID",
        orderStatus: "PROCESSING",
        shippingAddress: {
          street: "742 Evergreen Terrace",
          city: "Springfield",
          state: "IL",
          zipCode: "62704",
          country: "US",
        },
        trackingNumber: "TRK-NATI-1001-925",
      },
      {
        _id: "ord-demo-1002",
        orderId: "NATI-1002",
        userId: "usr-demo-customer",
        items: [
          {
            productId: "prod-demo-2",
            name: "Sonic Bass Pro Wireless Headphones",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
            quantity: 2,
            price: 159.99,
          }
        ],
        totalAmount: 319.98,
        grandTotal: 319.98,
        paymentStatus: "PAID",
        orderStatus: "SHIPPED",
        shippingAddress: {
          street: "123 Cyberdyne Systems Rd",
          city: "Pasadena",
          state: "CA",
          zipCode: "91101",
          country: "US",
        },
        trackingNumber: "TRK-NATI-1002-841",
        createdAt: new Date(Date.now() - 3600 * 24 * 1000), // 1 day ago
      }
    ];

    for (const o of ordersData) {
      await Order.create(o);
    }

    // 5. Create Reviews
    const reviewsData = [
      {
        _id: "rev-demo-1",
        productId: "prod-demo-1",
        productName: "Apex Smart Watch Ultra",
        productImage: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=400&q=80",
        customerName: "Sarah Connor",
        rating: 5,
        comment: "Incredible watch, battery life is outstanding!",
        createdAt: new Date().toISOString(),
        reply: "Thank you Sarah! Glad you love the battery life.",
        status: "Published",
        vendorId: "usr-demo-vendor",
      },
      {
        _id: "rev-demo-2",
        productId: "prod-demo-2",
        productName: "Sonic Bass Pro Wireless Headphones",
        productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
        customerName: "John Connor",
        rating: 4,
        comment: "Great sound quality, ANC is decent.",
        createdAt: new Date(Date.now() - 3600 * 24 * 1000).toISOString(),
        status: "Published",
        vendorId: "usr-demo-vendor",
      }
    ];

    for (const r of reviewsData) {
      await Review.create(r);
    }

    console.log("🌱 Database seeding completed successfully!");
  } catch (err) {
    console.error("❌ Failed to seed database collections:", err);
  }
}
