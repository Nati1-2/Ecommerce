"use client";

import { ProductResult } from "@/services/api/search";
import { Star, ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { useState } from "react";

interface SearchProductCardProps {
  product: ProductResult;
  viewMode: "grid" | "list";
}

export default function SearchProductCard({ product, viewMode }: SearchProductCardProps) {
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useCartStore((s) => s.setCartDrawerOpen);

  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image[0],
      quantity: 1,
    });
    setCartDrawerOpen(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  if (viewMode === "list") {
    return (
      <Link href={`/products/${product.id}`} className="group flex bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all p-4 gap-6">
        <div className="relative w-48 h-48 bg-gray-50 rounded-xl shrink-0 overflow-hidden flex items-center justify-center">
          {product.image[0] ? (
            <Image src={product.image[0]} alt={product.name} fill className="object-contain p-4 mix-blend-multiply" />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-xl" />
          )}
          {product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
              -{product.discount}%
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-xs font-semibold text-gray-500 mb-1">{product.brand}</div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">{product.name}</h3>
          
          <div className="flex items-center gap-1.5 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current text-yellow-400" : "text-gray-200"}`} />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-600">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900">${product.price}</span>
              {product.discount > 0 && (
                <span className="text-sm font-medium text-gray-400 line-through">
                  ${(product.price * (1 + product.discount / 100)).toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleWishlist}
                className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`px-6 h-10 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                  product.stock > 0 
                    ? "bg-[#111827] text-white hover:bg-gray-800 shadow-md shadow-gray-900/10" 
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      href={`/products/${product.id}`} 
      className="group flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square bg-[#F5F7FA] overflow-hidden flex items-center justify-center p-6">
        {product.image[0] ? (
          <Image 
            src={product.image[0]} 
            alt={product.name} 
            fill 
            className={`object-contain p-6 mix-blend-multiply transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`} 
          />
        ) : (
          <div className="w-20 h-20 bg-gray-200 rounded-xl" />
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.discount > 0 && (
            <div className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
              -{product.discount}%
            </div>
          )}
          {product.stock === 0 && (
            <div className="bg-gray-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
              Out of stock
            </div>
          )}
        </div>

        {/* Wishlist quick action */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors z-10"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        {/* Quick Add overlay */}
        <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-2.5 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 backdrop-blur-md ${
              product.stock > 0 
                ? "bg-white/90 text-gray-900 hover:bg-white border border-white/20" 
                : "bg-gray-100/90 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock > 0 ? "Quick Add" : "Unavailable"}
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{product.brand}</div>
        <h3 className="text-sm font-bold text-gray-900 leading-tight mb-2 group-hover:text-[#007BFF] transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex text-yellow-400">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-bold text-gray-700">{product.rating}</span>
          <span className="text-[10px] font-semibold text-gray-400">({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-lg font-black text-gray-900">${product.price}</span>
          {product.discount > 0 && (
            <span className="text-xs font-bold text-gray-400 line-through">
              ${(product.price * (1 + product.discount / 100)).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
