"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, IndianRupee, ShieldCheck, Zap } from "lucide-react";

const AMOUNTS = [100, 500, 1000];

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export default function Home() {
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(100);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const finalAmount =
    selectedAmount === "custom" ? Number(customAmount) : selectedAmount;

  const handlePayment = async () => {
    if (!finalAmount || finalAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on server
      const response = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount }),
      });

      const order = await response.json();

      if (order.error) throw new Error(order.error);

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, 
        amount: order.amount,
        currency: order.currency,
        name: "Razorpay Demo App",
        description: "Test Payment Transaction",
        image: "https://nextjs.org/icons/next.svg",
        order_id: order.id,
        handler: async function (response: RazorpaySuccessResponse) {
          // 3. Verify payment on server
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyRes.ok) {
            alert("Payment successful! ID: " + response.razorpay_payment_id);
          } else {
            alert("Payment verification failed: " + verifyData.message);
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed", error);
      alert("Payment failed. Please check the console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-blue-500/10 rounded-full blur-[128px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6 glass"
          >
            <Zap className="w-8 h-8 text-white fill-white/10" />
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Secure Checkout
          </h1>
          <p className="text-neutral-400">Select an amount to proceed with payment</p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="space-y-4">
            <label className="text-sm font-medium text-neutral-400 px-1 uppercase tracking-wider">
              Choose Amount
            </label>
            <div className="grid grid-cols-3 gap-3">
              {AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={`relative py-4 rounded-xl transition-all duration-300 border ${
                    selectedAmount === amount
                      ? "bg-white text-black border-white"
                      : "bg-white/5 text-neutral-300 border-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <span className="font-semibold">₹{amount}</span>
                  {selectedAmount === amount && (
                    <motion.div
                      layoutId="active-bg"
                      className="absolute inset-0 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedAmount("custom")}
              className={`w-full py-4 rounded-xl transition-all duration-300 border ${
                selectedAmount === "custom"
                  ? "bg-white text-black border-white"
                  : "bg-white/5 text-neutral-300 border-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              Custom Amount
            </button>

            <AnimatePresence>
              {selectedAmount === "custom" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="relative pt-2">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                      type="number"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-medium"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-4">
            <button
              disabled={loading || !finalAmount || finalAmount <= 0}
              onClick={handlePayment}
              className="group relative w-full bg-white text-black py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[0_0_80px_rgba(255,255,255,0.1)] hover:shadow-[0_0_80px_rgba(255,255,255,0.2)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="flex items-center justify-center gap-2 relative z-10">
                {loading ? (
                  <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-current" />
                    Pay ₹{finalAmount || 0}
                  </>
                )}
              </span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 py-2 opacity-50">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <ShieldCheck className="w-4 h-4" />
              Secure Payment
            </div>
            <div className="w-1 h-1 rounded-full bg-neutral-600" />
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 text-nowrap">
              <CreditCard className="w-4 h-4 " />
              Powered by Razorpay
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-neutral-600 text-sm">
          Protected by industry-leading encryption and safety protocols.
        </p>
      </motion.div>
    </div>
  );
}
