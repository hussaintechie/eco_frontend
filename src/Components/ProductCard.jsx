import React from "react";
import { Plus } from "lucide-react";

function ProductCard({ product }) {
  return (
    <div className="relative bg-white rounded-2xl p-3 shadow-sm border border-gray-200">

      {product.discount && (
        <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] px-2 py-1 rounded-md">
          {product.discount}% OFF
        </span>
      )}

      <div className="w-full h-24 bg-gray-100 rounded-xl mb-3 flex items-center justify-center">
        <span className="text-xs text-gray-400">Image</span>
      </div>

      <h2 className="text-sm font-semibold line-clamp-2">{product.name}</h2>
      <p className="text-xs text-gray-500">{product.qty}</p>

      <div className="flex items-center gap-2 mt-1">
        <span className="font-semibold text-sm">₹{product.price}</span>
        <span className="text-xs line-through text-gray-400">₹{product.oldPrice}</span>
      </div>

      <button className="absolute right-3 bottom-3 bg-yellow-400 rounded-full p-2 shadow">
        <Plus size={18} />
      </button>
    </div>
  );
}

export default ProductCard;
