// Home.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { motion } from "framer-motion";
import { FaHeadset, FaShippingFast, FaLock } from "react-icons/fa";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (searchTerm = "") => {
    try {
      const res = await api.get(`/api/products${searchTerm ? `?search=${searchTerm}` : ""}`);
      setProducts(res.data);
      setFilteredProducts(res.data);

      const uniqueCategories = ["All", ...new Set(res.data.map((p) => p.category))];
      setCategories(uniqueCategories);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === category));
    }
  };

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[var(--color-bg)] text-[var(--color-primary)] text-2xl">
        Loading products...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] overflow-hidden relative">

      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center text-center px-6 pt-36 pb-14"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold bg-[var(--color-primary)] bg-clip-text text-transparent mb-6 pb-5">
          Bring Home What You Love
        </h1>
        <p className="text-[var(--color-muted)] text-lg max-w-2xl mb-10">
          Explore a wide range of quality products made for your lifestyle
        </p>
        <div className="w-full max-w-2xl">
          <SearchBar onSearch={fetchProducts} />
        </div>
      </motion.div>

      {/* CATEGORY FILTER */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 mb-12 flex flex-wrap gap-4 justify-center">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleCategoryClick(cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
              activeCategory === cat
                ? "bg-[var(--color-primary)] text-[var(--color-bg)] border-[var(--color-primary)] shadow-sm"
                : "bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-primary)]"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* PRODUCTS GRID */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-7xl mx-auto px-8 pb-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        {filteredProducts.map((product) => (
          <motion.div key={product._id} variants={itemVariants}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {/* FEATURE CARDS SECTION */}
      <section className="bg-[var(--color-card)] pb-20 px-8">
        <h1 className="text-center text-4xl text-[var(--color-primary)] font-bold py-12">Why Choose Us</h1>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-center">

          <div className="p-8 rounded-2xl border border-[var(--color-border)] hover:shadow-xl transition duration-300">
            <FaHeadset className="text-5xl mx-auto mb-6 text-[var(--color-primary)]" />
            <h3 className="text-xl font-bold mb-3">24/7 Customer Support</h3>
            <p className="text-[var(--color-muted)]">
              Our team is available anytime to assist you with your orders.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-[var(--color-border)] hover:shadow-xl transition duration-300">
            <FaShippingFast className="text-5xl mx-auto mb-6 text-[var(--color-primary)]" />
            <h3 className="text-xl font-bold mb-3">Fast & Secure Shipping</h3>
            <p className="text-[var(--color-muted)]">
              Quick delivery with trusted logistics partners worldwide.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-[var(--color-border)] hover:shadow-xl transition duration-300">
            <FaLock className="text-5xl mx-auto mb-6 text-[var(--color-primary)]" />
            <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
            <p className="text-[var(--color-muted)]">
              Your transactions are encrypted and 100% safe.
            </p>
          </div>

        </div>
      </section>

    

    </div>
  );
};

export default Home;