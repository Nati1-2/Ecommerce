"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle, Gift } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section className="py-16 bg-[#F5F7FA] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Left: copy */}
            <div className="p-8 sm:p-12 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 bg-[#007BFF]/8 border border-[#007BFF]/15 text-[#007BFF] text-sm font-semibold px-3.5 py-1.5 rounded-full mb-5">
                  <Gift className="w-4 h-4" />
                  Members-Only Perk
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-[#111827] leading-tight">
                  Get 15% Off<br />Your First Order
                </h2>
                <p className="text-gray-500 mt-3 leading-relaxed text-sm sm:text-base max-w-sm">
                  Join 500,000+ savvy shoppers. Get exclusive deals, early access to sales, and personalized recommendations delivered weekly.
                </p>

                <div className="flex flex-wrap gap-4 mt-6">
                  {["Weekly deals", "Early sale access", "No spam ever"].map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <CheckCircle className="w-4 h-4 text-[#007BFF]" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: form */}
            <div className="bg-[#F5F7FA] p-8 sm:p-12 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-gray-100">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                {submitted ? (
                  <div className="flex flex-col items-center text-center gap-4 py-6">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-[#111827]">You're in! 🎉</p>
                      <p className="text-gray-500 text-sm mt-1">Check your inbox for your 15% off code.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-gray-600 mb-4">Enter your email to get started</p>
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          id="newsletter-email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 focus:border-[#007BFF] transition-all"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#007BFF] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-md shadow-blue-500/20 disabled:opacity-70"
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            Get My 15% Off
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                    <p className="text-gray-400 text-xs mt-3">
                      🔒 No spam. Unsubscribe anytime.
                    </p>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
