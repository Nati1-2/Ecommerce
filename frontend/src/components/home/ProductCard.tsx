"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Star, Eye, Zap } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { cn, formatPrice, formatDiscount } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const badgeConfig: Record<string, { label: string; class: string }> = {
  new: { label: "NEW", class: "bg-green-500" },
  sale: { label: "SALE", class: "bg-red-500" },
  hot: { label: "🔥 HOT", class: "bg-orange-500" },
  bestseller: { label: "★ BEST", class: "bg-purple-600" },
  popular: { label: "POPULAR", class: "bg-blue-600" },
  luxury: { label: "LUXURY", class: "bg-amber-600" },
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageError, setImageError] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const wishlisted = mounted ? isWishlisted(product.id) : false;
  const discount = product.discount || formatDiscount(product.originalPrice, product.price);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#007BFF]/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={imageError ? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" : product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <span className={cn(
            "absolute top-3 left-3 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg",
            badgeConfig[product.badge]?.class || "bg-gray-800"
          )}>
            {badgeConfig[product.badge]?.label || product.badge.toUpperCase()}
          </span>
        )}

        {/* Discount */}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
            -{discount}%
          </span>
        )}

        {/* Actions Overlay */}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={() => toggleItem(product.id)}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-all duration-200",
              wishlisted
                ? "bg-rose-500 text-white"
                : "bg-white/90 backdrop-blur-md text-gray-700 hover:bg-rose-500 hover:text-white"
            )}
            title="Wishlist"
          >
            <Heart className={cn("w-4 h-4", wishlisted && "fill-white")} />
          </button>

          <Link
            href={`/products/${product.id}`}
            className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-gray-700 hover:bg-[#007BFF] hover:text-white shadow-md transition-all duration-200"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between h-40">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-semibold text-[#007BFF] uppercase tracking-wider text-[10px]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-gray-700 text-xs">{product.rating}</span>
            </div>
          </div>

          <Link href={`/products/${product.id}`}>
            <h3 className="font-bold text-sm text-gray-900 line-clamp-2 hover:text-[#007BFF] transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
          <div>
            <span className="text-base font-black text-gray-900">${formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through ml-1.5 font-medium">
                ${formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={cn(
              "py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 shadow-sm",
              addedToCart
                ? "bg-green-500 text-white"
                : "bg-[#007BFF] text-white hover:bg-blue-600 shadow-blue-500/20"
            )}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{addedToCart ? "Added!" : "Add"}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface ProductGridSectionProps {
  title: string;
  subtitle: string;
  label: string;
  products: Product[];
  viewAllHref: string;
}

export function ProductGridSection({
  title,
  subtitle,
  label,
  products,
  viewAllHref,
}: ProductGridSectionProps) {
  return (
    <section className="py-14 bg-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4"
        >
          <div>
            <p className="text-[#007BFF] text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">{title}</h2>
            <p className="text-xs text-gray-400 font-medium mt-1">{subtitle}</p>
          </div>
          <Link
            href={viewAllHref}
            className="flex items-center gap-1.5 text-xs font-bold text-[#007BFF] hover:gap-2.5 transition-all self-start sm:self-auto"
          >
            <span>View All</span>
            <span>→</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
