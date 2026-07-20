import { Product, Category, Review } from "@/types";

export const mockCategories: Category[] = [
  { id: "1", name: "Electronics", slug: "electronics", icon: "💻", productCount: 1240, image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80", color: "from-blue-500 to-blue-700" },
  { id: "2", name: "Fashion", slug: "fashion", icon: "👗", productCount: 3580, image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80", color: "from-pink-500 to-rose-600" },
  { id: "3", name: "Home & Living", slug: "home", icon: "🏠", productCount: 890, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", color: "from-amber-500 to-orange-600" },
  { id: "4", name: "Gaming", slug: "gaming", icon: "🎮", productCount: 540, image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&q=80", color: "from-purple-500 to-indigo-700" },
  { id: "5", name: "Beauty", slug: "beauty", icon: "✨", productCount: 1120, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80", color: "from-fuchsia-500 to-pink-600" },
  { id: "6", name: "Sports", slug: "sports", icon: "⚽", productCount: 720, image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80", color: "from-green-500 to-emerald-600" },
];

export const mockProducts: Product[] = [
  {
    id: "0", name: "Apple iPhone 17 Pro", slug: "iphone-17-pro",
    price: 1199, originalPrice: 1399, discount: 14, rating: 5.0, reviewCount: 942,
    image: "/iphone17.png",
    images: [
      "/iphone17.png",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80"
    ],
    category: "Electronics", brand: "Apple", badge: "new", inStock: true,
    description: "The next generation of iPhone with A19 Pro chip and integrated Holographic Display.",
    stock: 5,
    features: [
      "A19 Pro chip with next-generation Neural Engine",
      "6.9-inch always-on Super Retina XDR display",
      "Holographic screen technology with gesture controls",
      "Advanced triple camera system (48MP wide, ultra-wide, telephoto)",
      "Titanium alloy chassis design for lightweight durability"
    ],
    variants: [
      {
        name: "Color",
        options: [
          { value: "Sunset Orange" },
          { value: "Titanium Grey" },
          { value: "Stellar Black" }
        ]
      },
      {
        name: "Storage",
        options: [
          { value: "128GB", price: 0 },
          { value: "256GB", price: 100 },
          { value: "512GB", price: 300 }
        ]
      }
    ]
  },
  {
    id: "1", name: "Apple MacBook Pro M3", slug: "macbook-pro-m3",
    price: 1999, originalPrice: 2499, discount: 20, rating: 4.9, reviewCount: 2847,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80"
    ],
    category: "Electronics", brand: "Apple", badge: "hot", inStock: true,
    description: "The most powerful MacBook Pro ever with M3 chip.",
    stock: 8,
    features: [
      "Apple M3 Max chip with 16-core CPU and 40-core GPU",
      "Liquid Retina XDR display with ProMotion technology",
      "Up to 128GB unified memory support",
      "Massive battery life up to 22 hours",
      "High fidelity six-speaker sound system"
    ],
    variants: [
      {
        name: "Color",
        options: [
          { value: "Space Black" },
          { value: "Silver" }
        ]
      },
      {
        name: "Storage",
        options: [
          { value: "512GB", price: 0 },
          { value: "1TB", price: 200 },
          { value: "2TB", price: 600 }
        ]
      }
    ]
  },
  {
    id: "2", name: "Sony WH-1000XM5 Headphones", slug: "sony-xm5",
    price: 279, originalPrice: 399, discount: 30, rating: 4.8, reviewCount: 5120,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"],
    category: "Electronics", brand: "Sony", badge: "sale", inStock: true,
    description: "Industry-leading noise canceling headphones.",
    stock: 12,
    features: [
      "Industry-leading noise cancellation with Auto NC Optimizer",
      "Exceptional sound quality with new Integrated Processor V1",
      "Crystal clear hands-free calling with 4 beamforming microphones",
      "Up to 30-hour battery life with quick charging",
      "Ultra-comfortable lightweight design"
    ],
    variants: [
      {
        name: "Color",
        options: [
          { value: "Black" },
          { value: "Silver" },
          { value: "Midnight Blue" }
        ]
      }
    ]
  },
  {
    id: "3", name: "Nike Air Jordan 1 Retro", slug: "air-jordan-1",
    price: 189, originalPrice: 220, discount: 14, rating: 4.7, reviewCount: 8930,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"],
    category: "Fashion", brand: "Nike", badge: "bestseller", inStock: true,
    description: "The iconic silhouette reimagined for a new generation.",
    stock: 15,
    features: [
      "Premium leather construction for maximum comfort",
      "Air-Sole unit in the heel for lightweight cushioning",
      "Solid rubber outsole with deep flex grooves for traction",
      "Iconic Wings logo stamped on the collar",
      "Perforated toe box for enhanced ventilation"
    ],
    variants: [
      {
        name: "Size",
        options: [
          { value: "US 8" },
          { value: "US 9" },
          { value: "US 10" },
          { value: "US 11" }
        ]
      }
    ]
  },
  {
    id: "4", name: "iPad Pro 12.9\" M2", slug: "ipad-pro-m2",
    price: 899, originalPrice: 1099, discount: 18, rating: 4.8, reviewCount: 3240,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80"],
    category: "Electronics", brand: "Apple", badge: "new", inStock: true,
    description: "The ultimate iPad experience with M2 chip.",
    stock: 7,
    features: [
      "Apple M2 chip with 8-core CPU and 10-core GPU",
      "12.9-inch Liquid Retina XDR display with ProMotion",
      "Support for Apple Pencil (2nd gen) hover tech",
      "Thunderbolt / USB 4 port for high-speed external drives",
      "Face ID for secure authentication"
    ]
  },
  {
    id: "5", name: "Samsung 4K OLED TV 65\"", slug: "samsung-oled-65",
    price: 1299, originalPrice: 1899, discount: 32, rating: 4.6, reviewCount: 1540,
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80",
      "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&q=80"
    ],
    category: "Electronics", brand: "Samsung", badge: "sale", inStock: true,
    description: "Breathtaking OLED picture quality in 4K with deep blacks and vibrant colors.",
    stock: 4
  },
  {
    id: "6", name: "Dyson V15 Detect Vacuum", slug: "dyson-v15",
    price: 549, originalPrice: 749, discount: 27, rating: 4.7, reviewCount: 2180,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"],
    category: "Home & Living", brand: "Dyson", badge: "hot", inStock: true,
    description: "Laser reveals invisible dust. Reveals what has to be cleaned.",
    stock: 9
  },
  {
    id: "7", name: "PlayStation 5 Console", slug: "ps5",
    price: 499, originalPrice: 499, discount: 0, rating: 4.9, reviewCount: 12400,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80"],
    category: "Gaming", brand: "Sony", badge: "hot", inStock: true,
    description: "Experience lightning speed with the PS5.",
    stock: 11
  },
  {
    id: "8", name: "Apple Watch Ultra 2", slug: "apple-watch-ultra-2",
    price: 799, originalPrice: 949, discount: 16, rating: 4.8, reviewCount: 4210,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80"],
    category: "Electronics", brand: "Apple", badge: "new", inStock: true,
    description: "The most rugged and capable Apple Watch ever.",
    stock: 6
  },
];

export const mockFlashSaleProducts: Product[] = [
  { ...mockProducts[1], price: 179, discount: 55 },
  { ...mockProducts[0], price: 1499, discount: 40 },
  { ...mockProducts[2], price: 99, discount: 55 },
  { ...mockProducts[4], price: 799, discount: 58 },
];

export const mockNewArrivals: Product[] = [
  { ...mockProducts[7], badge: "new" },
  { ...mockProducts[3], badge: "new" },
  { ...mockProducts[6], badge: "new" },
  { ...mockProducts[5], badge: "new" },
  { ...mockProducts[0], badge: "new" },
];

export const mockBestSellers: Product[] = [
  { ...mockProducts[6] },
  { ...mockProducts[2] },
  { ...mockProducts[1] },
  { ...mockProducts[4] },
];

export const mockRecommendations: Product[] = [
  { ...mockProducts[0] },
  { ...mockProducts[3] },
  { ...mockProducts[7] },
  { ...mockProducts[6] },
  { ...mockProducts[1] },
];

export const mockReviews: Review[] = [
  {
    id: "1", author: "Sarah Johnson", avatar: "https://i.pravatar.cc/80?img=1",
    rating: 5, date: "2 days ago",
    text: "Absolutely stunning quality. The packaging was perfect and delivery was super fast. Will definitely order again!",
    product: "Apple MacBook Pro M3", verified: true,
  },
  {
    id: "2", author: "Marcus Chen", avatar: "https://i.pravatar.cc/80?img=3",
    rating: 5, date: "1 week ago",
    text: "Best online shopping experience I've had. The product exceeded my expectations and customer support was phenomenal.",
    product: "Sony WH-1000XM5", verified: true,
  },
  {
    id: "3", author: "Emily Rodriguez", avatar: "https://i.pravatar.cc/80?img=5",
    rating: 5, date: "3 days ago",
    text: "I was skeptical at first, but the quality blew me away. Premium products at competitive prices. This is my new go-to store.",
    product: "Nike Air Jordan 1", verified: true,
  },
  {
    id: "4", author: "James Williams", avatar: "https://i.pravatar.cc/80?img=8",
    rating: 4, date: "5 days ago",
    text: "Great selection of products and the prices are very competitive. Fast shipping and excellent packaging. Highly recommend!",
    product: "PlayStation 5", verified: true,
  },
  {
    id: "5", author: "Aisha Patel", avatar: "https://i.pravatar.cc/80?img=9",
    rating: 5, date: "1 day ago",
    text: "The flash sale was incredible — got my dream laptop at 40% off. The whole experience from browsing to delivery was flawless.",
    product: "Apple MacBook Pro M3", verified: true,
  },
];
