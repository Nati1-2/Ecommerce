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
  // ── ELECTRONICS ───────────────────────────────────────────
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
      "Titanium alloy chassis design for lightweight durability"
    ],
    variants: [
      { name: "Color", options: [{ value: "Sunset Orange" }, { value: "Titanium Grey" }, { value: "Stellar Black" }] },
      { name: "Storage", options: [{ value: "128GB", price: 0 }, { value: "256GB", price: 100 }, { value: "512GB", price: 300 }] }
    ]
  },
  {
    id: "1", name: "Apple MacBook Pro M3", slug: "macbook-pro-m3",
    price: 1999, originalPrice: 2499, discount: 20, rating: 4.9, reviewCount: 2847,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"],
    category: "Electronics", brand: "Apple", badge: "hot", inStock: true,
    description: "The most powerful MacBook Pro ever with M3 chip.",
    stock: 8,
    features: ["Apple M3 Max chip with 16-core CPU", "Liquid Retina XDR display", "Massive battery life up to 22 hours"]
  },
  {
    id: "2", name: "Sony WH-1000XM5 Headphones", slug: "sony-xm5",
    price: 279, originalPrice: 399, discount: 30, rating: 4.8, reviewCount: 5120,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"],
    category: "Electronics", brand: "Sony", badge: "sale", inStock: true,
    description: "Industry-leading noise canceling headphones.",
    stock: 12
  },
  {
    id: "4", name: "iPad Pro 12.9\" M2", slug: "ipad-pro-m2",
    price: 899, originalPrice: 1099, discount: 18, rating: 4.8, reviewCount: 3240,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80"],
    category: "Electronics", brand: "Apple", badge: "new", inStock: true,
    description: "The ultimate iPad experience with M2 chip.",
    stock: 7
  },
  {
    id: "5", name: "Samsung 4K OLED TV 65\"", slug: "samsung-oled-65",
    price: 1299, originalPrice: 1899, discount: 32, rating: 4.6, reviewCount: 1540,
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80"],
    category: "Electronics", brand: "Samsung", badge: "sale", inStock: true,
    description: "Breathtaking OLED picture quality in 4K with deep blacks and vibrant colors.",
    stock: 4
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

  // ── FASHION ───────────────────────────────────────────────
  {
    id: "3", name: "Nike Air Jordan 1 Retro", slug: "air-jordan-1",
    price: 189, originalPrice: 220, discount: 14, rating: 4.7, reviewCount: 8930,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"],
    category: "Fashion", brand: "Nike", badge: "bestseller", inStock: true,
    description: "The iconic silhouette reimagined for a new generation.",
    stock: 15
  },
  {
    id: "f1", name: "Levi's 501 Original Fit Denim Jeans", slug: "levis-501-jeans",
    price: 79, originalPrice: 98, discount: 19, rating: 4.6, reviewCount: 3120,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80"],
    category: "Fashion", brand: "Nike", badge: "popular", inStock: true,
    description: "The timeless straight-leg blue denim jeans crafted from 100% premium cotton.",
    stock: 20
  },
  {
    id: "f2", name: "Ray-Ban Classic Wayfarer Sunglasses", slug: "rayban-wayfarer",
    price: 165, originalPrice: 195, discount: 15, rating: 4.8, reviewCount: 1840,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80"],
    category: "Fashion", brand: "Sony", badge: "hot", inStock: true,
    description: "Iconic UV400 protective polarized sunglasses with lightweight acetate frame.",
    stock: 14
  },
  {
    id: "f3", name: "The North Face Nuptse Down Jacket", slug: "tnf-nuptse-jacket",
    price: 299, originalPrice: 350, discount: 14, rating: 4.9, reviewCount: 2450,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80"],
    category: "Fashion", brand: "Nike", badge: "bestseller", inStock: true,
    description: "Ultra-warm 700-fill goose down insulated puffer jacket for winter comfort.",
    stock: 9
  },

  // ── HOME & LIVING ─────────────────────────────────────────
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
    id: "h1", name: "Nespresso VertuoPlus Coffee Machine", slug: "nespresso-vertuoplus",
    price: 159, originalPrice: 199, discount: 20, rating: 4.7, reviewCount: 4210,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80"],
    category: "Home & Living", brand: "Dyson", badge: "bestseller", inStock: true,
    description: "Single-serve espresso & coffee maker with Centrifusion extraction technology.",
    stock: 18
  },
  {
    id: "h2", name: "Ergonomic Executive Mesh Desk Chair", slug: "ergonomic-mesh-chair",
    price: 249, originalPrice: 320, discount: 22, rating: 4.6, reviewCount: 1290,
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=600&q=80"],
    category: "Home & Living", brand: "Samsung", badge: "sale", inStock: true,
    description: "Adjustable 3D lumbar support mesh office chair for all-day posture comfort.",
    stock: 11
  },
  {
    id: "h3", name: "Philips Hue Smart RGB LED Light Strip", slug: "philips-hue-strip",
    price: 89, originalPrice: 110, discount: 19, rating: 4.8, reviewCount: 3510,
    image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&q=80"],
    category: "Home & Living", brand: "Samsung", badge: "popular", inStock: true,
    description: "16 million color smart LED light strip compatible with Alexa, Google & Apple HomeKit.",
    stock: 25
  },

  // ── GAMING ────────────────────────────────────────────────
  {
    id: "7", name: "PlayStation 5 Console Slim", slug: "ps5-slim",
    price: 499, originalPrice: 499, discount: 0, rating: 4.9, reviewCount: 12400,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80"],
    category: "Gaming", brand: "Sony", badge: "hot", inStock: true,
    description: "Experience lightning speed loading with ultra-high speed SSD on PS5 Slim.",
    stock: 11
  },
  {
    id: "g1", name: "NVIDIA GeForce RTX 4090 GPU", slug: "rtx-4090-gpu",
    price: 1599, originalPrice: 1799, discount: 11, rating: 4.9, reviewCount: 1820,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80"],
    category: "Gaming", brand: "Sony", badge: "new", inStock: true,
    description: "The ultimate gaming graphics card powered by DLSS 3 & Ada Lovelace architecture.",
    stock: 3
  },
  {
    id: "g2", name: "Razer BlackWidow V4 Pro Keyboard", slug: "razer-blackwidow-v4",
    price: 229, originalPrice: 269, discount: 15, rating: 4.7, reviewCount: 980,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80"],
    category: "Gaming", brand: "Sony", badge: "popular", inStock: true,
    description: "Mechanical gaming keyboard with Chroma RGB, macro keys & wrist rest.",
    stock: 16
  },
  {
    id: "g3", name: "Logitech G Pro X Superlight 2 Mouse", slug: "logitech-gpro-superlight",
    price: 159, originalPrice: 179, discount: 11, rating: 4.8, reviewCount: 3410,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80"],
    category: "Gaming", brand: "Sony", badge: "bestseller", inStock: true,
    description: "Ultra-lightweight 60g wireless esports gaming mouse with HERO 2 sensor.",
    stock: 22
  },

  // ── BEAUTY ────────────────────────────────────────────────
  {
    id: "b1", name: "Dyson Airwrap Multi-Styler Complete", slug: "dyson-airwrap",
    price: 599, originalPrice: 649, discount: 8, rating: 4.9, reviewCount: 6890,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80"],
    category: "Beauty", brand: "Dyson", badge: "hot", inStock: true,
    description: "Curl, shape, smooth and hide flyaways with no extreme heat damage.",
    stock: 8
  },
  {
    id: "b2", name: "Estée Lauder Advanced Night Repair Serum", slug: "estee-lauder-serum",
    price: 115, originalPrice: 135, discount: 15, rating: 4.8, reviewCount: 5120,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80"],
    category: "Beauty", brand: "Dyson", badge: "bestseller", inStock: true,
    description: "Revolutionary anti-aging face serum for radiantly hydrated skin.",
    stock: 19
  },
  {
    id: "b3", name: "La Mer Crème de la Mer Moisturizer 60ml", slug: "la-mer-creme",
    price: 380, originalPrice: 420, discount: 10, rating: 4.9, reviewCount: 1450,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80"],
    category: "Beauty", brand: "Dyson", badge: "luxury", inStock: true,
    description: "Ultra-luxurious moisturizing cream infused with Miracle Broth elixir.",
    stock: 5
  },
  {
    id: "b4", name: "Yves Saint Laurent Black Opium EDP 90ml", slug: "ysl-black-opium",
    price: 155, originalPrice: 175, discount: 11, rating: 4.7, reviewCount: 3980,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80"],
    category: "Beauty", brand: "Dyson", badge: "popular", inStock: true,
    description: "Seductive gourmand floral fragrance with notes of black coffee & vanilla.",
    stock: 14
  },

  // ── SPORTS ────────────────────────────────────────────────
  {
    id: "s1", name: "Adidas Ultraboost Light Running Shoes", slug: "adidas-ultraboost-light",
    price: 190, originalPrice: 220, discount: 14, rating: 4.8, reviewCount: 3890,
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80"],
    category: "Sports", brand: "Nike", badge: "bestseller", inStock: true,
    description: "Lightest Ultraboost ever made with responsive Light BOOST cushioning.",
    stock: 17
  },
  {
    id: "s2", name: "Garmin Forerunner 965 GPS Smartwatch", slug: "garmin-forerunner-965",
    price: 599, originalPrice: 649, discount: 8, rating: 4.9, reviewCount: 1640,
    image: "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1510017803434-a899398421b3?w=600&q=80"],
    category: "Sports", brand: "Apple", badge: "new", inStock: true,
    description: "Premium triathlon & running smartwatch with vibrant AMOLED display & full mapping.",
    stock: 8
  },
  {
    id: "s3", name: "Bowflex SelectTech 552 Dumbbells", slug: "bowflex-552-dumbbells",
    price: 429, originalPrice: 549, discount: 22, rating: 4.7, reviewCount: 5410,
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80"],
    category: "Sports", brand: "Nike", badge: "hot", inStock: true,
    description: "Adjustable weights from 5 to 52.5 lbs with intuitive dial selection system.",
    stock: 10
  },
  {
    id: "s4", name: "Wilson NBA Authentic Official Basketball", slug: "wilson-nba-basketball",
    price: 49, originalPrice: 65, discount: 24, rating: 4.8, reviewCount: 2190,
    image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&q=80"],
    category: "Sports", brand: "Nike", badge: "popular", inStock: true,
    description: "Official NBA leather composite game basketball with high durability tack cover.",
    stock: 25
  }
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
