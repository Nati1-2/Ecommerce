"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, Mail, Phone, MapPin, Building, Briefcase, Download,
  TrendingUp, HelpCircle, Truck, RotateCcw, Compass, Ruler, Zap,
  Plus, CheckCircle, ArrowRight, Lock, FileText, Gift, DollarSign,
  Users, BookOpen, ChevronRight, Home, ArrowLeft, RefreshCw, Sparkles
} from "lucide-react";
import { mockProducts } from "@/data/mock";
import { useCartStore } from "@/store/cart";

// Types
interface FooterPageClientProps {
  slug: string;
}

export default function FooterPageClient({ slug }: FooterPageClientProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const validSlugs = [
    "about", "careers", "press", "blog", "investors", "help",
    "shipping", "returns", "track", "size-guide", "flash-sale",
    "new", "bestsellers", "gift-cards", "affiliate", "privacy", "terms"
  ];

  // If page doesn't exist, we can render a nice 404 block or redirect
  const isValid = validSlugs.includes(slug);

  // States for interactive components
  // General feedback / notifications
  const [toast, setToast] = useState("");
  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Careers state
  const [jobSearch, setJobSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [careerForm, setCareerForm] = useState({ name: "", email: "", resume: "" });

  // Blog state
  const [blogSearch, setBlogSearch] = useState("");
  const [activeBlogCat, setActiveBlogCat] = useState("All");

  // Investors state
  const [stockPrice, setStockPrice] = useState(42.50);
  const [stockChange, setStockChange] = useState(1.8);
  useEffect(() => {
    if (slug !== "investors") return;
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.48) * 0.4; // Slightly positive bias
      setStockPrice((prev) => parseFloat((prev + delta).toFixed(2)));
      setStockChange((prev) => parseFloat((prev + delta * 2).toFixed(2)));
    }, 3000);
    return () => clearInterval(interval);
  }, [slug]);

  // Help FAQ search
  const [faqSearch, setFaqSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [helpForm, setHelpForm] = useState({ email: "", subject: "", message: "" });

  // Size Guide state
  const [sizeTab, setSizeTab] = useState<"men" | "women" | "shoes">("men");
  const [sizeUnit, setSizeUnit] = useState<"cm" | "in">("in");

  // Track Order state
  const [trackOrderId, setTrackOrderId] = useState("");

  // Flash Sale countdown
  const [countdown, setCountdown] = useState({ hours: 4, minutes: 34, seconds: 12 });
  useEffect(() => {
    if (slug !== "flash-sale") return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 }; // Restart cycle
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [slug]);

  // Gift Cards State
  const [giftTheme, setGiftTheme] = useState<"gold" | "cyber" | "sakura" | "carbon">("gold");
  const [giftAmount, setGiftAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [giftMessage, setGiftMessage] = useState({ toName: "", toEmail: "", note: "" });

  // Affiliate State
  const [affiliateForm, setAffiliateForm] = useState({ name: "", email: "", website: "", experience: "" });

  if (!isValid) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center justify-center text-center">
        <HelpCircle className="w-16 h-16 text-amber-500 mb-4 animate-bounce" />
        <h3 className="text-2xl font-black text-gray-900">Information Page Not Found</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-xs">
          The informational page you requested is currently unavailable or has been archived.
        </p>
        <Link href="/" className="mt-6 bg-[#007BFF] hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-md text-sm">
          Return Home
        </Link>
      </div>
    );
  }

  // Handle support form submission
  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpForm.email || !helpForm.message) return;
    triggerToast("Support ticket successfully submitted! We'll reply within 4 hours.");
    setHelpForm({ email: "", subject: "", message: "" });
  };

  // Handle career form submission
  const handleCareerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast(`Application submitted successfully for ${selectedJob}!`);
    setCareerForm({ name: "", email: "", resume: "" });
    setSelectedJob(null);
  };

  // Handle tracking redirect
  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackOrderId.trim()) return;
    router.push(`/orders/${trackOrderId.trim()}/tracking`);
  };

  // Handle affiliate form submission
  const handleAffiliateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast("Application submitted! Our partnership team will review and reply in 48h.");
    setAffiliateForm({ name: "", email: "", website: "", experience: "" });
  };

  // Add customized gift card to cart
  const handleAddGiftCardToCart = () => {
    const finalAmount = giftAmount === 0 ? parseFloat(customAmount) : giftAmount;
    if (isNaN(finalAmount) || finalAmount <= 0) {
      triggerToast("Please enter a valid gift card amount.");
      return;
    }
    const themeLabel = giftTheme.charAt(0).toUpperCase() + giftTheme.slice(1);
    addItem({
      productId: `gift-card-${giftTheme}-${finalAmount}`,
      name: `Nati Gift Card ($${finalAmount} - ${themeLabel} Edition)`,
      price: finalAmount,
      quantity: 1,
      image: "/giftcard.png",
    });
    triggerToast(`$${finalAmount} Gift Card added to your Shopping Bag!`);
  };

  return (
    <div className="bg-white min-h-screen pb-16 font-sans">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-xs font-bold px-6 py-4 rounded-2xl shadow-2xl z-50 animate-fade-in border border-white/10">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* ── BREADCRUMBS ── */}
      <div className="bg-gray-50 border-b border-gray-100 py-5 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Link href="/" className="hover:text-[#007BFF] flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600 font-bold capitalize">
              {slug.replace("-", " ")}
            </span>
          </nav>
        </div>
      </div>

      {/* ── ABOUT US ── */}
      {slug === "about" && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-950 tracking-tight">
              About Nati<span className="text-[#007BFF]">.</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              We design and curate premium consumer shopping experiences across apparel, tech, and everyday luxury.
            </p>
          </div>

          <div className="relative aspect-video rounded-3xl overflow-hidden border border-gray-100 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=80"
              alt="Our Team Working"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent flex items-end p-6 sm:p-10">
              <p className="text-white text-base sm:text-lg font-bold max-w-lg">
                &quot;Driven by values, verified by tech, and committed to absolute visual and logistical perfection.&quot;
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Happy Customers", value: "50k+", icon: Users },
              { label: "Premium Brands", value: "200+", icon: Sparkles },
              { label: "Successful Deliveries", value: "99.9%", icon: Truck },
              { label: "Direct Support Hours", value: "24/7", icon: Phone },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="p-6 border border-gray-100 rounded-3xl bg-gray-50/50 text-center space-y-2">
                <div className="w-10 h-10 bg-blue-50 text-[#007BFF] rounded-2xl flex items-center justify-center mx-auto">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6 pt-6">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Our Core Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Customer Obsession", desc: "Every flow, design detail, and logistical standard exists solely to create customer delight." },
                { title: "Design Excellence", desc: "We reject the default. We design state-of-the-art visual grids and beautiful typography hierarchies." },
                { title: "Verifiable Trust", desc: "From real-time socket tracking streams to instant refunds, transparency is built into our code." }
              ].map((val) => (
                <div key={val.title} className="p-6 border border-gray-100 rounded-3xl hover:shadow-lg transition-all space-y-2 bg-white">
                  <h4 className="text-md font-bold text-gray-950">{val.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CAREERS ── */}
      {slug === "careers" && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-950 tracking-tight">
              Careers at Nati
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Help us reshape the modern digital shopfront. Work remotely, grow quickly, and make real impact.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search roles (e.g. Developer, Designer)..."
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-955 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Open Positions</h3>
            {[
              { id: "fe", title: "Senior Frontend Engineer (Next.js / React)", dept: "Engineering", loc: "Remote (Global)", type: "Full-time" },
              { id: "pd", title: "Lead Product Designer", dept: "Design", loc: "Remote (US/EU)", type: "Full-time" },
              { id: "mm", title: "Growth Marketing Associate", dept: "Marketing", loc: "Remote (APAC)", type: "Full-time" },
              { id: "cs", title: "Customer Success Representative", dept: "Support", loc: "Remote (US Timezones)", type: "Part-time" }
            ]
              .filter(j => j.title.toLowerCase().includes(jobSearch.toLowerCase()) || j.dept.toLowerCase().includes(jobSearch.toLowerCase()))
              .map((job) => (
                <div key={job.id} className="p-6 border border-gray-100 hover:border-gray-200 bg-white rounded-3xl hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-md px-2.5 py-0.5 uppercase tracking-wide inline-block">
                      {job.dept}
                    </span>
                    <h4 className="text-base font-bold text-gray-950">{job.title}</h4>
                    <p className="text-xs text-gray-400 font-semibold">{job.loc} • {job.type}</p>
                  </div>
                  <button
                    onClick={() => setSelectedJob(job.title)}
                    className="py-2.5 px-5 bg-[#111827] text-white hover:bg-gray-800 text-xs font-bold rounded-xl transition-all self-start sm:self-center"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
          </div>

          {/* Application Modal */}
          {selectedJob && (
            <div className="fixed inset-0 bg-gray-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl p-6 sm:p-8 max-w-md w-full relative animate-scale-up space-y-6">
                <div>
                  <h3 className="text-xl font-black text-gray-955">Apply for Position</h3>
                  <p className="text-xs text-gray-400 font-semibold mt-1">{selectedJob}</p>
                </div>
                <form onSubmit={handleCareerSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={careerForm.name}
                      onChange={(e) => setCareerForm({ ...careerForm, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold placeholder-gray-400 focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={careerForm.email}
                      onChange={(e) => setCareerForm({ ...careerForm, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold placeholder-gray-400 focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Link to Resume / CV</label>
                    <input
                      type="url"
                      required
                      value={careerForm.resume}
                      onChange={(e) => setCareerForm({ ...careerForm, resume: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold placeholder-gray-400 focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedJob(null)}
                      className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/15"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── PRESS ── */}
      {slug === "press" && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-955 tracking-tight">
              Press Room
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Official press releases, brand information, and media kits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-lg font-black text-gray-900 tracking-tight">Latest Press Releases</h3>
              {[
                { title: "Nati Reaches 50,000 Verified Orders Milestone", date: "August 4, 2026", desc: "Leading premium curation retail storefront Nati hits milestone customer metrics across tech and apparel." },
                { title: "Announcing Same-Day Drone Delivery Hubs", date: "July 28, 2026", desc: "Fulfillment networks to pilot autonomous logistics mapping in select West Coast zones starting next month." },
                { title: "Nati Closes Series B Funding round of $24 Million", date: "June 15, 2026", desc: "Capital injection focused on scale integrations, instant local shipping partnerships, and AI-led user dashboards." }
              ].map((pr) => (
                <div key={pr.title} className="p-6 border border-gray-100 hover:border-gray-200 bg-white rounded-3xl space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pr.date}</span>
                  <h4 className="text-base font-bold text-gray-955 leading-snug">{pr.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{pr.desc}</p>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="p-6 border border-gray-100 rounded-3xl bg-gray-50/50 space-y-4">
                <h4 className="text-sm font-bold text-gray-955">Media Contacts</h4>
                <div className="space-y-2.5 text-xs text-gray-500">
                  <p className="font-semibold text-gray-700">PR Department</p>
                  <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#007BFF]" /> press@nati.shop</p>
                  <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#007BFF]" /> +1 (800) 555-0199</p>
                </div>
              </div>

              <div className="p-6 border border-gray-100 rounded-3xl bg-gray-50/50 space-y-4">
                <h4 className="text-sm font-bold text-gray-955">Brand Assets</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Download official logos, style guide, and headshots.</p>
                <button
                  onClick={() => triggerToast("Brand Kit zip download started!")}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#111827] text-white hover:bg-gray-800 text-xs font-bold rounded-xl transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Media Kit (8.4MB)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BLOG ── */}
      {slug === "blog" && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-955 tracking-tight">
              The Nati Blog
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Curated tips, technology spotlights, and seasonal trend guide collections.
            </p>
          </div>

          {/* Filters & search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <div className="flex gap-2 items-center flex-wrap">
              {["All", "Tech", "Fashion", "Lifestyle"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveBlogCat(cat)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeBlogCat === cat
                      ? "bg-[#111827] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search blog..."
                value={blogSearch}
                onChange={(e) => setBlogSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 text-gray-955 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#007BFF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { id: 1, title: "The Next Era of Connected Wearables: What to Expect", category: "Tech", readTime: "5 min read", date: "Aug 6, 2026", image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&q=80", desc: "Apple Watch Ultra and new sensors are changing fitness and spatial bio-health metrics. Explore what lies ahead." },
              { id: 2, title: "Sartorial Simplicity: Minimalist Capsule Wardrobes", category: "Fashion", readTime: "4 min read", date: "Jul 30, 2026", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80", desc: "Build a premium daily wardrobe selection with less clutter. Quality denim, fine fabrics, and structured outerwear." },
              { id: 3, title: "Home Office Setup Ideas for Peak Creative Focus", category: "Lifestyle", readTime: "6 min read", date: "Jul 18, 2026", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80", desc: "From organic lighting rules to ergonomic custom seating integrations. Crafting an inspiring high-output room." },
              { id: 4, title: "The Anatomy of Noise Cancelation in XM5 & Beyond", category: "Tech", readTime: "7 min read", date: "Jun 24, 2026", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", desc: "Breaking down high-precision DSP algorithm waves and ambient sound isolating architectures that isolate audio." }
            ]
              .filter(post => activeBlogCat === "All" || post.category === activeBlogCat)
              .filter(post => post.title.toLowerCase().includes(blogSearch.toLowerCase()))
              .map((post) => (
                <article
                  key={post.id}
                  onClick={() => triggerToast(`Navigating to blog article "${post.title}"...`)}
                  className="border border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-lg transition-all cursor-pointer group bg-white"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-gray-900 border border-gray-100 rounded-md px-2.5 py-0.5 uppercase tracking-wide">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-md font-bold text-gray-955 group-hover:text-[#007BFF] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed truncate-2-lines">
                      {post.desc}
                    </p>
                  </div>
                </article>
              ))}
          </div>
        </div>
      )}

      {/* ── INVESTORS ── */}
      {slug === "investors" && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-955 tracking-tight">
              Investor Relations
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Financial announcements, governance resources, and real-time equity metrics.
            </p>
          </div>

          {/* Stock Ticker Simulator widget */}
          <div className="p-6 border border-gray-100 rounded-3xl bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nati Store Equities Inc.</span>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-3xl font-black text-gray-900">NATI</span>
                <span className="text-3xl font-black text-[#007BFF]">${stockPrice}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white border border-gray-100 px-6 py-3.5 rounded-2xl shadow-sm">
              <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Change (24h)</p>
                <p className={`text-md font-black ${stockChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {stockChange >= 0 ? "+" : ""}{stockChange}%
                </p>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Logistics Flow Volume</p>
                <p className="text-md font-black text-gray-900">54.2k items/hr</p>
              </div>
            </div>

            <button
              onClick={() => triggerToast("Refreshing pricing index indices...")}
              className="flex items-center gap-2 py-2.5 px-4 bg-[#111827] text-white hover:bg-gray-800 text-xs font-bold rounded-xl transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Force Sync</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-black text-gray-900 tracking-tight">Governance & Disclosures</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Nati operates with transparency, reporting full quarterly earnings statements, board structure profiles, and general shareholder disclosure letters.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  { name: "Q2 2026 Earnings Letter.pdf", size: "1.4MB" },
                  { name: "2025 Annual Shareholder Audit.pdf", size: "4.8MB" },
                  { name: "Corporate Bylaws & Charter Code.pdf", size: "2.1MB" }
                ].map((doc) => (
                  <div key={doc.name} className="flex items-center justify-between p-3.5 border border-gray-100 bg-white hover:border-gray-200 rounded-2xl transition-all">
                    <span className="text-xs font-semibold text-gray-700">{doc.name}</span>
                    <button
                      onClick={() => triggerToast(`Downloading ${doc.name}...`)}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
                    >
                      PDF ({doc.size})
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border border-gray-100 rounded-3xl bg-gray-50/50 space-y-4 flex flex-col justify-center">
              <h4 className="text-sm font-bold text-gray-955">Investor Support</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                For questions regarding stockholder equity, share conversion, and transfer agent inquiries, please contact:
              </p>
              <div className="space-y-2 text-xs text-gray-600 font-semibold">
                <p>Nati Store Investor Relations Department</p>
                <p>One Front Street, San Francisco, CA</p>
                <p className="text-[#007BFF]">ir@nati.shop</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── HELP CENTER / FAQS ── */}
      {slug === "help" && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-955 tracking-tight">
              Help Center
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Find answers to shipping, return policies, account profiles, and general store orders.
            </p>
          </div>

          {/* Search FAQs */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-955 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-black text-gray-900 tracking-tight">Frequently Asked Questions</h3>
              {[
                { q: "How do I check the delivery status of my order?", a: "Once your package is dispatched, tracking credentials are sent to your verified email. You can also paste your order code into the Track Order dashboard or visit your Profile account page." },
                { q: "What is your return policy window?", a: "We provide a hassle-free, 30-day return policy for unused, original condition products. Visit our Returns page for step-by-step printing instructions." },
                { q: "Do you ship products internationally?", a: "Yes! We ship to over 120 countries. Customs clearance, shipping speeds, and local courier handovers vary based on region. View the Shipping table page details." },
                { q: "How do I update account subscription plans?", a: "Navigate to your Dashboard Account page and select Settings. You can alter email notifications, push preferences, and subscription cards." }
              ]
                .filter(item => item.q.toLowerCase().includes(faqSearch.toLowerCase()) || item.a.toLowerCase().includes(faqSearch.toLowerCase()))
                .map((item, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left text-xs font-bold text-gray-955 hover:bg-gray-50 transition-colors"
                    >
                      <span>{item.q}</span>
                      <Plus className={`w-4 h-4 text-gray-400 transition-transform ${openFaq === idx ? "rotate-45 text-[#007BFF]" : ""}`} />
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 pb-5 pt-1 text-xs text-gray-500 leading-relaxed border-t border-gray-50 animate-slide-down">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <div className="p-6 border border-gray-100 rounded-3xl bg-gray-50/50 space-y-6">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-955">Submit a Ticket</h4>
                <p className="text-xs text-gray-400 font-semibold">Can&apos;t find your answers? Message support.</p>
              </div>
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={helpForm.email}
                    onChange={(e) => setHelpForm({ ...helpForm, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold placeholder-gray-400 focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Subject</label>
                  <input
                    type="text"
                    required
                    value={helpForm.subject}
                    onChange={(e) => setHelpForm({ ...helpForm, subject: e.target.value })}
                    placeholder="Order query"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold placeholder-gray-400 focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Message Details</label>
                  <textarea
                    required
                    rows={4}
                    value={helpForm.message}
                    onChange={(e) => setHelpForm({ ...helpForm, message: e.target.value })}
                    placeholder="Describe your issue..."
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold placeholder-gray-400 focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/15"
                >
                  Send Ticket
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── SHIPPING INFO ── */}
      {slug === "shipping" && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-955 tracking-tight">
              Shipping & Delivery
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Curated delivery networks tailored to get products to your door securely and promptly.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Shipping Tier Options</h3>
            <div className="border border-gray-100 rounded-3xl overflow-hidden overflow-x-auto shadow-sm bg-white">
              <table className="w-full min-w-[500px] text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="p-4 sm:p-5">Tier Method</th>
                    <th className="p-4 sm:p-5">Speed Frame</th>
                    <th className="p-4 sm:p-5">Billing Rates</th>
                    <th className="p-4 sm:p-5">Order Rules</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 font-semibold">
                  <tr>
                    <td className="p-4 sm:p-5 text-gray-955 font-bold">Standard Ground</td>
                    <td className="p-4 sm:p-5">3 - 5 Business Days</td>
                    <td className="p-4 sm:p-5">$4.95</td>
                    <td className="p-4 sm:p-5">Free on orders above $50</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 text-gray-955 font-bold">Priority Express</td>
                    <td className="p-4 sm:p-5">1 - 2 Business Days</td>
                    <td className="p-4 sm:p-5">$12.95</td>
                    <td className="p-4 sm:p-5">Flat rate shipping index</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 text-gray-955 font-bold">Same-Day Local</td>
                    <td className="p-4 sm:p-5">Within 24 Hours</td>
                    <td className="p-4 sm:p-5">$24.95</td>
                    <td className="p-4 sm:p-5">Available in select cities only</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-black text-gray-900 tracking-tight">Worldwide Fulfillment Zones</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Nati utilizes distributed warehouse hubs across North America, Europe, Asia Pacific, and Australia to guarantee short-hop delivery pathways.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#007BFF]" />
                  <span>North America Hubs: California, Ohio, Ontario</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#007BFF]" />
                  <span>European Hubs: Frankfurt, London, Amsterdam</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#007BFF]" />
                  <span>Asia Pacific Hubs: Tokyo, Singapore, Sydney</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border border-gray-100 rounded-3xl bg-gray-50/50 space-y-4 flex flex-col justify-center">
              <h4 className="text-sm font-bold text-gray-955">Fulfillment Customs Notice</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                International shipments may be subject to import taxes, duties, and customs fees levied by the destination country once the package arrives. These fees are pre-calculated at checkout so you will not experience delay or extra delivery costs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── RETURNS & REFUNDS ── */}
      {slug === "returns" && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-955 tracking-tight">
              Returns & Refunds
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
              We stand by our products. If you are not completely satisfied, return within 30 days for a full refund.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Return Process Walkthrough</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
              {[
                { step: "01", title: "Submit Request", desc: "Select return items inside your account dashboard." },
                { step: "02", title: "Print Label", desc: "Download and print your pre-paid carrier shipping label." },
                { step: "03", title: "Pack & Ship", desc: "Box items securely, attach label, and drop off at courier." },
                { step: "04", title: "Get Refund", desc: "Refund clears to original payment method in 3 days." }
              ].map((s, idx) => (
                <div key={s.step} className="space-y-2.5 relative select-none">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 bg-blue-50 text-[#007BFF] border border-blue-100 text-xs font-black rounded-xl flex items-center justify-center">
                      {s.step}
                    </span>
                    <h4 className="text-xs font-bold text-gray-955">{s.title}</h4>
                  </div>
                  <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border border-gray-100 rounded-3xl bg-gray-50/50 space-y-4 mt-6">
            <h4 className="text-sm font-bold text-gray-955">Refund Terms Policy Checklist</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500 leading-relaxed">
              <div className="space-y-2">
                <p className="font-bold text-gray-800">Eligible Returns:</p>
                <p>• Items in unused condition with tags attached.</p>
                <p>• Clean packaging boxes & brand tags.</p>
                <p>• Return submitted within 30 days of shipment receipt.</p>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-gray-800">Non-refundable Items:</p>
                <p>• Digital gift cards (once activated).</p>
                <p>• Opened cosmetics or items marked as Final Sale.</p>
                <p>• Items damaged after delivery receipt.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TRACK ORDER ── */}
      {slug === "track" && (
        <div className="max-w-md mx-auto px-4 sm:px-6 py-20 space-y-8">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-[#007BFF] rounded-3xl flex items-center justify-center mx-auto">
              <Compass className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-gray-955 tracking-tight">
              Track Your Order
            </h1>
            <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto">
              Enter your unique order number or shipment tracking reference code to check transit status.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Order ID or tracking number</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={trackOrderId}
                  onChange={(e) => setTrackOrderId(e.target.value)}
                  placeholder="e.g. ord_123 or TRK98765432"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-955 rounded-2xl text-xs font-semibold placeholder-gray-400 focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-2xl transition-all shadow-lg shadow-blue-500/15 flex items-center justify-center gap-1.5"
            >
              <span>Query Logistics Stream</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick links to orders */}
          <div className="text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Or check your account dashboard:{" "}
              <Link href="/orders" className="text-[#007BFF] hover:underline">
                View My Orders
              </Link>
            </span>
          </div>
        </div>
      )}

      {/* ── SIZE GUIDE ── */}
      {slug === "size-guide" && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-955 tracking-tight">
              Size & Fit Guide
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
              Find your ideal measurements. Follow our guidelines to secure a perfect fit.
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-2xl">
              {[
                { id: "men", label: "Men's Apparel" },
                { id: "women", label: "Women's Apparel" },
                { id: "shoes", label: "Footwear" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSizeTab(tab.id as any)}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    sizeTab === tab.id
                      ? "bg-[#111827] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400">Unit System:</span>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setSizeUnit("in")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    sizeUnit === "in" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                  }`}
                >
                  Inches (in)
                </button>
                <button
                  onClick={() => setSizeUnit("cm")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    sizeUnit === "cm" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                  }`}
                >
                  Centimeters (cm)
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-100 rounded-3xl overflow-hidden overflow-x-auto shadow-sm bg-white">
              <table className="w-full min-w-[540px] text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="p-4 sm:p-5">Size Rating</th>
                    {sizeTab === "shoes" ? (
                      <>
                        <th className="p-4 sm:p-5">US Size</th>
                        <th className="p-4 sm:p-5">UK Size</th>
                        <th className="p-4 sm:p-5">EU Size</th>
                        <th className="p-4 sm:p-5">Heel-to-Toe</th>
                      </>
                    ) : (
                      <>
                        <th className="p-4 sm:p-5">Chest Profile</th>
                        <th className="p-4 sm:p-5">Waist Profile</th>
                        <th className="p-4 sm:p-5">Hip Profile</th>
                        <th className="p-4 sm:p-5">Sleeve Fit</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 font-semibold">
                  {sizeTab === "men" && [
                    { name: "S", chest: sizeUnit === "in" ? "36 - 38" : "91 - 96", waist: sizeUnit === "in" ? "29 - 31" : "74 - 79", hip: sizeUnit === "in" ? "35 - 37" : "89 - 94", sleeve: sizeUnit === "in" ? "32.5" : "82.5" },
                    { name: "M", chest: sizeUnit === "in" ? "38 - 40" : "96 - 101", waist: sizeUnit === "in" ? "32 - 34" : "81 - 86", hip: sizeUnit === "in" ? "38 - 40" : "96 - 101", sleeve: sizeUnit === "in" ? "33.5" : "85" },
                    { name: "L", chest: sizeUnit === "in" ? "42 - 44" : "106 - 111", waist: sizeUnit === "in" ? "36 - 38" : "91 - 96", hip: sizeUnit === "in" ? "42 - 44" : "106 - 111", sleeve: sizeUnit === "in" ? "34.5" : "87.5" },
                    { name: "XL", chest: sizeUnit === "in" ? "46 - 48" : "117 - 122", waist: sizeUnit === "in" ? "40 - 42" : "101 - 106", hip: sizeUnit === "in" ? "46 - 48" : "117 - 122", sleeve: sizeUnit === "in" ? "35.5" : "90" }
                  ].map((s) => (
                    <tr key={s.name}>
                      <td className="p-4 sm:p-5 text-gray-950 font-bold">{s.name}</td>
                      <td className="p-4 sm:p-5">{s.chest} {sizeUnit}</td>
                      <td className="p-4 sm:p-5">{s.waist} {sizeUnit}</td>
                      <td className="p-4 sm:p-5">{s.hip} {sizeUnit}</td>
                      <td className="p-4 sm:p-5">{s.sleeve} {sizeUnit}</td>
                    </tr>
                  ))}

                  {sizeTab === "women" && [
                    { name: "XS", chest: sizeUnit === "in" ? "31 - 32" : "79 - 81", waist: sizeUnit === "in" ? "24 - 25" : "61 - 63", hip: sizeUnit === "in" ? "34 - 35" : "86 - 89", sleeve: sizeUnit === "in" ? "30" : "76" },
                    { name: "S", chest: sizeUnit === "in" ? "33 - 34" : "84 - 86", waist: sizeUnit === "in" ? "26 - 27" : "66 - 69", hip: sizeUnit === "in" ? "36 - 37" : "91 - 94", sleeve: sizeUnit === "in" ? "30.5" : "77" },
                    { name: "M", chest: sizeUnit === "in" ? "35 - 37" : "89 - 94", waist: sizeUnit === "in" ? "28 - 30" : "71 - 76", hip: sizeUnit === "in" ? "38 - 40" : "96 - 101", sleeve: sizeUnit === "in" ? "31.5" : "80" },
                    { name: "L", chest: sizeUnit === "in" ? "39 - 41" : "99 - 104", waist: sizeUnit === "in" ? "32 - 34" : "81 - 86", hip: sizeUnit === "in" ? "42 - 44" : "106 - 111", sleeve: sizeUnit === "in" ? "32.5" : "82.5" }
                  ].map((s) => (
                    <tr key={s.name}>
                      <td className="p-4 sm:p-5 text-gray-955 font-bold">{s.name}</td>
                      <td className="p-4 sm:p-5">{s.chest} {sizeUnit}</td>
                      <td className="p-4 sm:p-5">{s.waist} {sizeUnit}</td>
                      <td className="p-4 sm:p-5">{s.hip} {sizeUnit}</td>
                      <td className="p-4 sm:p-5">{s.sleeve} {sizeUnit}</td>
                    </tr>
                  ))}

                  {sizeTab === "shoes" && [
                    { name: "7.0", us: "7", uk: "6", eu: "40", len: sizeUnit === "in" ? "9.6" : "24.4" },
                    { name: "8.5", us: "8.5", uk: "7.5", eu: "42", len: sizeUnit === "in" ? "10.1" : "25.7" },
                    { name: "10.0", us: "10", uk: "9", eu: "43", len: sizeUnit === "in" ? "10.6" : "27" },
                    { name: "11.5", us: "11.5", uk: "10.5", eu: "45", len: sizeUnit === "in" ? "11.1" : "28.3" }
                  ].map((s) => (
                    <tr key={s.name}>
                      <td className="p-4 sm:p-5 text-gray-955 font-bold">{s.name}</td>
                      <td className="p-4 sm:p-5">{s.us}</td>
                      <td className="p-4 sm:p-5">{s.uk}</td>
                      <td className="p-4 sm:p-5">{s.eu}</td>
                      <td className="p-4 sm:p-5">{s.len} {sizeUnit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── FLASH SALE ── */}
      {slug === "flash-sale" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          {/* Sale Header Banner */}
          <div className="bg-[#111827] text-white p-8 sm:p-12 rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5 select-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="space-y-3 text-center md:text-left relative z-10">
              <span className="text-[10px] font-bold text-[#007BFF] uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-md">
                Limited Time Offer
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
                Nati Flash Sale
              </h1>
              <p className="text-xs text-gray-400 max-w-xs">
                Premium gear at unprecedented prices. Orders qualify for fast free delivery.
              </p>
            </div>

            <div className="flex items-center gap-3 relative z-10 bg-white/5 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest shrink-0">Ending In:</span>
              <div className="flex gap-1.5 text-center font-mono">
                {[
                  { value: countdown.hours, label: "h" },
                  { value: countdown.minutes, label: "m" },
                  { value: countdown.seconds, label: "s" }
                ].map((t) => (
                  <span key={t.label} className="bg-white/10 px-2.5 py-1.5 rounded-lg text-sm font-black tracking-tight inline-block min-w-10">
                    {String(t.value).padStart(2, "0")}{t.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sale Grid Products */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Active Flash Deals</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockProducts.slice(0, 4).map((p) => {
                // Adjust price for higher flash discounts
                const salePrice = Math.floor(p.price * 0.7);
                return (
                  <div key={p.id} className="border border-gray-100 hover:border-gray-200 bg-white rounded-3xl overflow-hidden hover:shadow-md transition-all group flex flex-col justify-between">
                    <div className="aspect-square bg-gray-50 relative overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                        SAVE 30%
                      </span>
                    </div>

                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{p.brand}</span>
                        <h4 className="text-xs font-bold text-gray-955 group-hover:text-[#007BFF] transition-colors leading-tight line-clamp-1">{p.name}</h4>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-black text-gray-955">${salePrice}</span>
                          <span className="text-xs text-gray-400 font-semibold line-through">${p.price}</span>
                        </div>

                        <button
                          onClick={() => {
                            addItem({ productId: p.id, name: p.name, price: salePrice, quantity: 1, image: p.image });
                            triggerToast(`"${p.name}" added to shopping bag!`);
                          }}
                          className="w-full py-2.5 bg-[#111827] text-white hover:bg-gray-800 text-[10px] font-bold rounded-xl transition-all"
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── NEW ARRIVALS ── */}
      {slug === "new" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-955 tracking-tight">
              New Arrivals
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
              Discover the latest items newly cataloged in our premium collection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts
              .filter((p) => p.badge === "new" || p.badge === "hot" || p.id === "0")
              .map((p) => (
                <div key={p.id} className="border border-gray-100 hover:border-gray-200 bg-white rounded-3xl overflow-hidden hover:shadow-md transition-all group flex flex-col justify-between">
                  <div className="aspect-square bg-gray-50 relative overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-[#007BFF] text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                      JUST IN
                    </span>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{p.brand}</span>
                      <h4 className="text-xs font-bold text-gray-955 group-hover:text-[#007BFF] transition-colors leading-tight line-clamp-1">{p.name}</h4>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-black text-gray-955">${p.price}</span>
                        {p.discount > 0 && <span className="text-xs text-gray-400 font-semibold line-through">${p.originalPrice}</span>}
                      </div>

                      <button
                        onClick={() => {
                          addItem({ productId: p.id, name: p.name, price: p.price, quantity: 1, image: p.image });
                          triggerToast(`"${p.name}" added to shopping bag!`);
                        }}
                        className="w-full py-2.5 bg-[#111827] text-white hover:bg-gray-800 text-[10px] font-bold rounded-xl transition-all"
                      >
                        Add to Bag
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── BEST SELLERS ── */}
      {slug === "bestsellers" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-955 tracking-tight">
              Best Sellers
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
              Explore products rated highest and ordered most frequently by our customers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts
              .filter((p) => p.badge === "bestseller" || p.badge === "popular" || p.rating >= 4.8)
              .map((p) => (
                <div key={p.id} className="border border-gray-100 hover:border-gray-200 bg-white rounded-3xl overflow-hidden hover:shadow-md transition-all group flex flex-col justify-between">
                  <div className="aspect-square bg-gray-50 relative overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-[#E5B800] text-gray-955 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                      TRENDING
                    </span>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{p.brand}</span>
                      <h4 className="text-xs font-bold text-gray-955 group-hover:text-[#007BFF] transition-colors leading-tight line-clamp-1">{p.name}</h4>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-black text-gray-955">${p.price}</span>
                        {p.discount > 0 && <span className="text-xs text-gray-400 font-semibold line-through">${p.originalPrice}</span>}
                      </div>

                      <button
                        onClick={() => {
                          addItem({ productId: p.id, name: p.name, price: p.price, quantity: 1, image: p.image });
                          triggerToast(`"${p.name}" added to shopping bag!`);
                        }}
                        className="w-full py-2.5 bg-[#111827] text-white hover:bg-gray-800 text-[10px] font-bold rounded-xl transition-all"
                      >
                        Add to Bag
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── GIFT CARDS ── */}
      {slug === "gift-cards" && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-955 tracking-tight">
              Nati E-Gift Cards
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
              Send instant style, beauty, and tech choice directly to their email inbox.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Customizer Preview */}
            <div className="space-y-6">
              <h3 className="text-md font-bold text-gray-955">Card Visualizer Preview</h3>
              <div className={`aspect-[1.58/1] rounded-[2rem] p-8 border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between text-white transition-all select-none ${
                giftTheme === "gold" ? "bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-amber-500/10" :
                giftTheme === "cyber" ? "bg-gradient-to-br from-purple-600 via-indigo-700 to-cyan-500 shadow-indigo-500/10" :
                giftTheme === "sakura" ? "bg-gradient-to-br from-pink-400 via-rose-500 to-pink-600 shadow-pink-500/10" :
                "bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-gray-900/20"
              }`}>
                {/* Visual accents */}
                <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-40 h-40 rounded-full bg-white/5 blur-lg" />
                <div className="absolute left-0 bottom-0 -translate-x-1/4 translate-y-1/4 w-32 h-32 rounded-full bg-white/5 blur-lg" />

                <div className="flex items-start justify-between relative z-10">
                  <span className="text-2xl font-black tracking-tight">Nati<span className="text-black">.</span></span>
                  <Gift className="w-6 h-6 stroke-[1.5]" />
                </div>

                <div className="relative z-10 space-y-1">
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">E-Gift Certificate Value</p>
                  <h3 className="text-4xl font-black tracking-tight">
                    ${giftAmount === 0 ? (customAmount || "0") : giftAmount}
                  </h3>
                </div>

                <div className="flex justify-between items-end relative z-10 text-[9px] font-bold opacity-80 uppercase tracking-widest">
                  <span>To: {giftMessage.toName || "Gift Recipient"}</span>
                  <span>Premium Store Access</span>
                </div>
              </div>

              {/* Theme Selector */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-gray-500">Choose Card Theme Design:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "gold", name: "Amber Gold", color: "bg-amber-500" },
                    { id: "cyber", name: "Cyber Neon", color: "bg-indigo-600" },
                    { id: "sakura", name: "Sakura Pink", color: "bg-pink-500" },
                    { id: "carbon", name: "Carbon Fiber", color: "bg-gray-850" }
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setGiftTheme(theme.id as any)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-[9px] font-bold ${
                        giftTheme === theme.id ? "border-[#007BFF] bg-[#007BFF]/5 text-blue-600" : "border-gray-250 text-gray-400"
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full block border border-white/20 ${theme.color}`} />
                      <span>{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Customizer Fields */}
            <div className="p-6 border border-gray-100 rounded-[2rem] bg-gray-50/50 space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-gray-500">Select Gift Card Amount:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[25, 50, 100, 250].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setGiftAmount(amt); setCustomAmount(""); }}
                      className={`py-3 text-xs font-bold rounded-xl transition-all border ${
                        giftAmount === amt ? "border-[#007BFF] bg-[#007BFF]/5 text-blue-600" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Or enter custom amount ($)</label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setGiftAmount(0); }}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold placeholder-gray-400 focus:outline-none focus:border-[#007BFF] focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold text-gray-500">Recipient Details:</span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Recipient Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={giftMessage.toName}
                      onChange={(e) => setGiftMessage({ ...giftMessage, toName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#007BFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Recipient Email</label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      value={giftMessage.toEmail}
                      onChange={(e) => setGiftMessage({ ...giftMessage, toEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#007BFF]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Gift Message Note (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Hope you enjoy this premium gift..."
                    value={giftMessage.note}
                    onChange={(e) => setGiftMessage({ ...giftMessage, note: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#007BFF] resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleAddGiftCardToCart}
                className="w-full py-4 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/15"
              >
                Purchase E-Gift Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── AFFILIATE ── */}
      {slug === "affiliate" && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-955 tracking-tight">
              Affiliate Program
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
              Partner with Nati and earn up to 10% commission on every customer order referral.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-black text-gray-900 tracking-tight">How Partner Referrals Work</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { step: "1", title: "Join Program", desc: "Submit your social profile info. Free approval process." },
                    { step: "2", title: "Share Links", desc: "Post referral codes on your blogs, videos, or chats." },
                    { step: "3", title: "Earn Cash", desc: "Get paid monthly on converted baskets." }
                  ].map((s) => (
                    <div key={s.step} className="p-5 border border-gray-100 rounded-2xl bg-white space-y-2">
                      <span className="w-8 h-8 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg flex items-center justify-center text-xs font-black">
                        {s.step}
                      </span>
                      <h4 className="text-xs font-bold text-gray-900">{s.title}</h4>
                      <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Referral Commission Structure</h3>
                <div className="border border-gray-100 rounded-3xl overflow-hidden overflow-x-auto bg-white">
                  <table className="w-full min-w-[500px] text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider font-mono">
                        <th className="p-4">Volume Tier</th>
                        <th className="p-4">Monthly Orders Referrals</th>
                        <th className="p-4">Commission rates</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 font-semibold">
                      <tr>
                        <td className="p-4 text-gray-955 font-bold">Bronze Partner</td>
                        <td className="p-4">1 - 20 orders</td>
                        <td className="p-4 text-[#007BFF] font-black">5% commission</td>
                      </tr>
                      <tr>
                        <td className="p-4 text-gray-955 font-bold">Silver Partner</td>
                        <td className="p-4">21 - 100 orders</td>
                        <td className="p-4 text-[#007BFF] font-black">7% commission</td>
                      </tr>
                      <tr>
                        <td className="p-4 text-gray-955 font-bold">Gold Elite Partner</td>
                        <td className="p-4">101+ orders</td>
                        <td className="p-4 text-[#007BFF] font-black">10% commission + bonuses</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-6 border border-gray-100 rounded-3xl bg-gray-50/50 space-y-6">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-955">Partner Registration</h4>
                <p className="text-xs text-gray-400 font-semibold">Submit your links to register.</p>
              </div>
              <form onSubmit={handleAffiliateSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={affiliateForm.name}
                    onChange={(e) => setAffiliateForm({ ...affiliateForm, name: e.target.value })}
                    placeholder="Jane Smith"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#007BFF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={affiliateForm.email}
                    onChange={(e) => setAffiliateForm({ ...affiliateForm, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#007BFF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Primary Site Website / Social Link</label>
                  <input
                    type="url"
                    required
                    value={affiliateForm.website}
                    onChange={(e) => setAffiliateForm({ ...affiliateForm, website: e.target.value })}
                    placeholder="https://youtube.com/mychannel"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#007BFF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Prior Affiliate experience</label>
                  <input
                    type="text"
                    required
                    value={affiliateForm.experience}
                    onChange={(e) => setAffiliateForm({ ...affiliateForm, experience: e.target.value })}
                    placeholder="Amazon Associates, etc."
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#007BFF]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/15"
                >
                  Apply to Program
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── PRIVACY POLICY ── */}
      {slug === "privacy" && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-gray-955 tracking-tight">Privacy Policy</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Last Modified: August 8, 2026</p>
          </div>

          <div className="prose prose-sm max-w-none text-xs text-gray-500 leading-relaxed space-y-6">
            <p>
              At Nati E-Commerce, accessible from Nati.shop, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Nati and how we use it.
            </p>
            <p>
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
            </p>

            <div className="space-y-3">
              <h3 className="text-md font-bold text-gray-900">1. Information We Collect</h3>
              <p>
                The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
              </p>
              <p>
                If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-md font-bold text-gray-900">2. How We Use Your Information</h3>
              <p>We use the information we collect in various ways, including to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide, operate, and maintain our e-commerce platform</li>
                <li>Improve, personalize, and expand our store features</li>
                <li>Understand and analyze how you use our web services</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you regarding purchases, delivery tracking, and promotions</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-md font-bold text-gray-900">3. Cookies & Tracking Web Beacons</h3>
              <p>
                Like any other website, Nati uses &apos;cookies&apos;. These cookies are used to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── TERMS OF SERVICE ── */}
      {slug === "terms" && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-gray-955 tracking-tight">Terms of Service</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Last Modified: August 8, 2026</p>
          </div>

          <div className="prose prose-sm max-w-none text-xs text-gray-500 leading-relaxed space-y-6">
            <p>
              Welcome to Nati E-Commerce! These terms and conditions outline the rules and regulations for the use of Nati&apos;s Website, located at Nati.shop.
            </p>
            <p>
              By accessing this website, we assume you accept these terms and conditions. Do not continue to use Nati if you do not agree to take all of the terms and conditions stated on this page.
            </p>

            <div className="space-y-3">
              <h3 className="text-md font-bold text-gray-900">1. Intellectual Property Rights</h3>
              <p>
                Other than the content you own, under these Terms, Nati and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-md font-bold text-gray-900">2. Restrictions on Use</h3>
              <p>You are specifically restricted from all of the following:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Publishing any Website material in any other media</li>
                <li>Selling, sublicensing and/or otherwise commercializing any Website material</li>
                <li>Publicly performing and/or showing any Website material</li>
                <li>Using this Website in any way that is or may be damaging to this Website</li>
                <li>Using this Website in any way that impacts user access to this Website</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-md font-bold text-gray-900">3. Limitation of Liability</h3>
              <p>
                In no event shall Nati, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Nati, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
