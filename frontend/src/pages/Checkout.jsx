import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

import api from "../api/axios";
import { toast } from "react-toastify";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

/* ==============================
   Checkout Payment Form
============================== */
const CheckoutForm = ({ cart, orderIds, totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

 
  const handlePayment = async () => {
  if (!stripe || !elements) return;

  try {
    setLoading(true);

    // Create PaymentIntent
    const res = await api.post("/api/payment", { orderIds });
    const clientSecret = res.data.clientSecret;

    // Confirm Payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardNumberElement) }
    });

    if (result.error) {
      toast.error("Payment failed");
      navigate("/cancel");
      setLoading(false);
      return;
    }

    toast.success("Payment successful 🎉");

    // Update order status to CONFIRMED immediately
    await Promise.all(
      orderIds.map((id) =>
        api.patch(`/api/orders/${id}/status`, { status: "CONFIRMED" })
      )
    );

    // Now order history page will show confirmed orders
    navigate("/payment-success");
  } catch (err) {
    console.log(err);
    toast.error("Payment error");
    navigate("/cancel");
  }

  setLoading(false);
};



  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-20">

 {/* ===== Banner Section ===== */}  
      <div className="h-[350px] md:h-[500px] relative flex items-center justify-center overflow-hidden">
        <img
          src="./payment.webp"
          alt="checkout banner"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>

       <motion.h2 
               initial={{ opacity: 0, y: -40 }}
               animate={{ opacity: 1, y: 0 }}
               className="relative text-4xl md:text-5xl font-bold text-white">
                 Checkout
               </motion.h2>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12 space-y-6 flex flex-col lg:flex-row w-full gap-10 relative z-10">

        {/* ===== ORDER SUMMARY ===== */}
        <div className="lg:w-1/2 backdrop-blur-xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-2xl rounded-3xl p-8 space-y-6">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-4 bg-[var(--color-card)] rounded-xl shadow-sm hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-contain rounded-xl"
                  />
                  <div>
                    <p className="text-[var(--color-text)] font-semibold">{item.product.name}</p>
                    <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-[var(--color-primary)] font-bold">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <hr className="border-gray-300/30" />

          <div className="flex justify-between text-xl font-bold text-[var(--color-primary)]">
            <span>Total:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* ===== PAYMENT FORM ===== */}
        <div className="lg:w-1/2 backdrop-blur-xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-2xl rounded-3xl p-8 space-y-6">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6 text-center">Payment Details</h2>

          <div className="space-y-4">
            <label className="text-[var(--color-text)] font-semibold">Card Number</label>
            <div className="bg-gray-100 text-black px-4 py-4 rounded-xl shadow-inner">
              <CardNumberElement />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[var(--color-text)] font-semibold">Expiry</label>
                <div className="bg-gray-100 text-black px-4 py-4 rounded-xl shadow-inner">
                  <CardExpiryElement />
                </div>
              </div>
              <div>
                <label className="text-[var(--color-text)] font-semibold">CVC</label>
                <div className="bg-gray-100 text-black px-4 py-4 rounded-xl shadow-inner">
                  <CardCvcElement />
                </div>
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            onClick={handlePayment}
            className="w-full mt-6 bg-gradient-to-r from-[var(--color-primary)] to-cyan-400 hover:scale-[1.03] transition-all py-4 rounded-2xl font-bold shadow-lg disabled:opacity-50 text-xl text-[var(--color-text)]"
          >
            {loading ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==============================
   Checkout Wrapper
============================== */
const Checkout = () => {
  const location = useLocation();
  const cart = location.state?.cart || [];

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const orderIds = cart.map(item => item._id);

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm cart={cart} orderIds={orderIds} totalAmount={totalAmount} />
    </Elements>
  );
};

export default Checkout;