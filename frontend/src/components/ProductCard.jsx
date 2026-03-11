// /components/ProductCard.jsx
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import { FaShoppingCart, FaStar, FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();



  const [quantity, setQuantity] = useState(
    product.warehouses.C > 0 ? 1 : 0
  );

  const increaseQty = () => {
    if (quantity < product.warehouses) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if(!user){
     toast.info("Please login to add items to cart");
      navigate("/login");
    }

    if (quantity <= product.warehouses.C && product.warehouses.C > 0) {
      addToCart(product, quantity);
    } else {
      toast.error("Invalid quantity or out of stock");
    }
  };

  const getStockLabel = () => {
    if (product.warehouses.C === 0) return "Out of Stock";
    return "In Stock";
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

          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold
              ${
                product.warehouses.C > 0
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
          >
            {getStockLabel()}
          </span>
        </div>

        {/* Quantity Selector */}
        <div
          className={`flex items-center justify-center gap-4 rounded-lg py-2 border
          ${
            product.warehouses.C === 0
              ? "bg-gray-200 cursor-not-allowed opacity-60"
              : "bg-[var(--color-bg)] border-[var(--color-border)]"
          }`}
        >
          <button
            onClick={decreaseQty}
            disabled={product.warehouses.C === 0}
            className="text-[var(--color-primary)] hover:text-[var(--color-text)] transition disabled:opacity-50"
          >
            <FaMinus />
          </button>

          <span className="text-[var(--color-text)] font-semibold text-lg">
            {quantity}
          </span>

          <button
            onClick={increaseQty}
            disabled={product.warehouses.C === 0}
            className="text-[var(--color-primary)] hover:text-[var(--color-text)] transition disabled:opacity-50"
          >
            <FaPlus />
          </button>
        </div>

        {/* CTA Button */}
        {user ? (
          <button
            onClick={handleAddToCart}
            disabled={product.warehouses.C === 0}
            className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl shadow transition-all duration-300
              ${
                product.warehouses.C  === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[var(--color-primary)] text-[var(--color-bg)] hover:shadow-lg hover:scale-105 active:scale-95"
              }`}
          >
            <FaShoppingCart />
            {product.warehouses.C === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full bg-[var(--color-primary)] text-[var(--color-bg)] py-3 rounded-xl cursor-pointer"
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;