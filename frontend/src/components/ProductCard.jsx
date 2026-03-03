// /components/ProductCard.jsx
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import { FaShoppingCart, FaStar, FaMinus, FaPlus } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const user = useAuthStore((state) => state.user);
  const [quantity, setQuantity] = useState(1);

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <div className="relative group bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">

      {/* Category Badge */}
      <span className="absolute top-4 left-4 bg-[var(--color-primary)] text-[var(--color-bg)] text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
        {product.category}
      </span>

      {/* Product Image */}
      {product.image && (
        <div className="overflow-hidden bg-[var(--color-bg)]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-contain p-6 group-hover:scale-105 transition duration-500 ease-in-out"
          />
        </div>
      )}

      <div className="p-5 space-y-3">

        {/* Product Name */}
        <h2 className="text-lg md:text-xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-all duration-300">
          {product.name}
        </h2>

        {/* Rating */}
        <div className="flex items-center gap-1 text-yellow-400 text-sm">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="group-hover:scale-110 transition" />
          ))}
          <span className="text-[var(--color-muted)] ml-2 text-xs">(5.0)</span>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between">
          <p className="text-xl md:text-2xl font-semibold text-[var(--color-danger)] tracking-tight">
            ${product.price}
          </p>
          <span className="text-xs bg-[var(--color-primary)/20] text-[var(--color-primary)] px-3 py-1 rounded-full">
            In Stock
          </span>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-center gap-4 bg-[var(--color-bg)] rounded-lg py-2 border border-[var(--color-border)]">
          <button
            onClick={decreaseQty}
            className="text-[var(--color-primary)] hover:text-[var(--color-text)] transition"
          >
            <FaMinus />
          </button>
          <span className="text-[var(--color-text)] font-semibold text-lg">{quantity}</span>
          <button
            onClick={increaseQty}
            className="text-[var(--color-primary)] hover:text-[var(--color-text)] transition"
          >
            <FaPlus />
          </button>
        </div>

        {/* CTA Button */}
        {user ? (
          <button
            onClick={() => addToCart(product, quantity)}
            className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-[var(--color-bg)] font-bold py-3 rounded-xl shadow hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <FaShoppingCart />
            Add to Cart
          </button>
        ) : (
          <button
            disabled
            className="w-full bg-[var(--color-border)] text-[var(--color-muted)] py-3 rounded-xl cursor-not-allowed"
          >
            Login to Add
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;