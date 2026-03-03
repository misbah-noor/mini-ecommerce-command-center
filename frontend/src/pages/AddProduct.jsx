import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";
import { FaTrash } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { useMemo } from "react";


const AddProduct = () => {
  // Auth
  const user = useAuthStore((state) => state.user);

  // State Hooks
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    A: 0,
    B: 0,
    C: 0,
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);


  // Dropzone Logic 
  const onDrop = (acceptedFiles) => {
  if (acceptedFiles.length > 0) {
    setImage(acceptedFiles[0]);
  }
};

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
  accept: {
    "image/*": []
  },
  multiple: false
});

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  // Handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const data = new FormData();
      Object.keys(form).forEach((key) =>
        data.append(key, form[key])
      );

      if (image) data.append("image", image);

      await api.post("/api/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          userid: user?._id,
        },
      });

      toast.success("Product added successfully 🎉");

      setForm({
        name: "",
        price: "",
        category: "",
        A: 0,
        B: 0,
        C: 0,
      });

      setImage(null);
      fetchProducts(); // Refresh list
    } catch (err) {
      console.log(err);
      toast.error("Product upload failed");
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/products/${id}`, {
        headers: { userid: user?._id },
      });
      toast.success("Product removed 🗑️");
      fetchProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };


  return (
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 py-10">

    {/* LEFT PANEL */}
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-10 shadow-lg space-y-6"
    >
      <h2 className="text-3xl font-bold text-[var(--color-primary)] text-center">
        Product Studio
      </h2>

      {/* Basic Inputs */}
      {["name", "price", "category"].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field.toUpperCase()}
          value={form[field]}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-transparent border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none"
          required
        />
      ))}

      {/* Warehouse */}
      <div className="grid grid-cols-3 gap-4">
        {["A", "B", "C"].map((wh) => (
          <input
            key={wh}
            name={wh}
            placeholder={`Warehouse ${wh}`}
            value={form[wh]}
            onChange={handleChange}
            className="p-4 rounded-xl bg-transparent border border-[var(--color-border)] text-center focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none"
          />
        ))}
      </div>

      {/* Image Upload */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-[var(--color-border)] rounded-2xl p-10 text-center cursor-pointer hover:border-[var(--color-primary)] hover:bg-blue-50 dark:hover:bg-blue-900/10 transition"
      >
        <input {...getInputProps()} />

        {image ? (
          <p className="text-[var(--color-success)] font-semibold">
            {image.name}
          </p>
        ) : isDragActive ? (
          <p className="text-[var(--color-primary)]">
            Drop image here...
          </p>
        ) : (
          <p className="text-[var(--color-muted)]">
            Drag & Drop Product Image
            <br />
            or Click to Upload
          </p>
        )}
      </div>

      <button
        disabled={loading}
        className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white py-4 rounded-xl font-semibold transition shadow-md disabled:opacity-50"
      >
        {loading ? "Publishing..." : "Add Product"}
      </button>
    </form>

    {/* RIGHT PANEL */}
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-8 shadow-lg max-h-[700px] overflow-y-auto">
      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-8 text-center">
        Inventory
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-[var(--color-muted)]">
          No products available
        </p>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex justify-between items-center p-5 rounded-2xl border border-[var(--color-border)] hover:shadow-md transition"
            >
              <div>
                <h3 className="font-semibold">
                  {product.name}
                </h3>
                <p className="text-[var(--color-primary)] font-medium">
                  ${product.price}
                </p>
              </div>

              <button
                onClick={() => handleDelete(product._id)}
                className="p-3 rounded-xl border border-[var(--color-danger)] text-[var(--color-danger)] hover:bg-[var(--color-danger)] hover:text-white transition"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);


};

export default AddProduct;