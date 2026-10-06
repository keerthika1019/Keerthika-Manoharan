/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ShoppingBag,
  ArrowRight,
  Check,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  PHONES,
  HERO_IMAGE,
  TESTIMONIALS,
  PhoneProduct,
  ColorFinish,
  CartItem,
  AppliedTradeIn,
  OrderRecord,
  formatINR,
} from './data/phones';
import { SmartImage } from './components/SmartImage';
import { ProductDetailModal } from './components/ProductDetailModal';
import {
  TradeInEstimatorModal,
  ComparisonMatrixSection,
} from './components/TradeInAndCompare';
import { CartAndCheckoutDrawer } from './components/CartAndCheckoutDrawer';

const INITIAL_SAMPLE_ORDER: OrderRecord = {
  orderId: 'VTG-1042',
  createdAt: 'Oct 4, 2026',
  customerName: 'Marcus Lindqvist',
  customerPhone: '+46 70 123 4567',
  customerEmail: 'marcus@nordicframe.se',
  shippingAddress: 'Strandvägen 7A',
  city: 'Stockholm',
  postalCode: '114 56',
  paymentMethod: 'Card',
  items: [
    {
      cartItemId: 'sample-1',
      phoneId: 'vantage-01-pro-titanium',
      phoneName: 'Vantage 01 Pro Titanium',
      series: 'Pro Series',
      image: PHONES[0].image,
      finish: PHONES[0].finishes[0],
      storage: PHONES[0].storageOptions[1],
      connectivity: 'Unlocked SIM-Free',
      vantageCare: true,
      paymentMode: 'full',
      unitPrice: 118998,
      quantity: 1,
    },
  ],
  subtotal: 118998,
  tradeInCredit: 0,
  shippingCost: 0,
  totalAmount: 118998,
  status: 'Confirmed — Preparing Shipment',
};

export default function App() {
  // Filter & Search State
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'pro' | 'fold' | 'compact'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'weight'>(
    'featured'
  );

  // Selected finish per product card on the storefront grid
  const [cardFinishes, setCardFinishes] = useState<Record<string, ColorFinish>>(() => {
    const initial: Record<string, ColorFinish> = {};
    PHONES.forEach((p) => {
      initial[p.id] = p.finishes[0];
    });
    return initial;
  });

  // Quick-add feedback state per card
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  // Active PDP Phone
  const [selectedPdpPhone, setSelectedPdpPhone] = useState<PhoneProduct | null>(null);

  // Trade-In Estimator State
  const [isTradeInOpen, setIsTradeInOpen] = useState(false);
  const [appliedTradeIn, setAppliedTradeIn] = useState<AppliedTradeIn | null>(() => {
    try {
      const saved = localStorage.getItem('vantage_trade_in_inr');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Comparison Matrix Slots (3 phones)
  const [comparedIds, setComparedIds] = useState<string[]>([
    'vantage-01-pro-titanium',
    'vantage-horizon-fold',
    'vantage-mono-compact',
  ]);

  // Cart & Orders State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vantage_cart_inr');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('vantage_orders_inr');
      return saved ? JSON.parse(saved) : [INITIAL_SAMPLE_ORDER];
    } catch {
      return [INITIAL_SAMPLE_ORDER];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'bag' | 'orders'>('bag');

  useEffect(() => {
    try {
      localStorage.setItem('vantage_cart_inr', JSON.stringify(cart));
    } catch {
      // ignore storage errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedTradeIn) {
        localStorage.setItem('vantage_trade_in_inr', JSON.stringify(appliedTradeIn));
      } else {
        localStorage.removeItem('vantage_trade_in_inr');
      }
    } catch {
      // ignore storage errors
    }
  }, [appliedTradeIn]);

  useEffect(() => {
    try {
      localStorage.setItem('vantage_orders_inr', JSON.stringify(orders));
    } catch {
      // ignore storage errors
    }
  }, [orders]);

  // Filtered & Sorted Products
  const filteredPhones = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = PHONES.filter((phone) => {
      const matchesCat =
        activeCategory === 'all' || phone.category === activeCategory;
      const matchesSearch =
        !q ||
        phone.name.toLowerCase().includes(q) ||
        phone.tagline.toLowerCase().includes(q) ||
        phone.specs.processor.toLowerCase().includes(q) ||
        phone.specs.chassisMaterial.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.basePrice - b.basePrice);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.basePrice - a.basePrice);
    }
    if (sortBy === 'weight') {
      return [...list].sort((a, b) => a.specs.weightGrams - b.specs.weightGrams);
    }
    return list;
  }, [activeCategory, searchQuery, sortBy]);

  const totalBagCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.cartItemId === newItem.cartItemId
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity,
        };
        return updated;
      }
      return [...prev, newItem];
    });
  };

  const handleQuickAddFromCard = (phone: PhoneProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const chosenFinish = cardFinishes[phone.id] || phone.finishes[0];
    const defaultStorage = phone.storageOptions[0];
    const activeImg = chosenFinish.imageOverride || phone.image;

    const item: CartItem = {
      cartItemId: `${phone.id}-${chosenFinish.id}-${defaultStorage.capacity}-Unlocked SIM-Free-std-full`,
      phoneId: phone.id,
      phoneName: phone.name,
      series: phone.series,
      image: activeImg,
      finish: chosenFinish,
      storage: defaultStorage,
      connectivity: 'Unlocked SIM-Free',
      vantageCare: false,
      paymentMode: 'full',
      unitPrice: phone.basePrice,
      quantity: 1,
    };

    handleAddToCart(item);
    setQuickAddedId(phone.id);
    setTimeout(() => {
      setQuickAddedId((prev) => (prev === phone.id ? null : prev));
    }, 1200);
  };

  const handleUpdateCartQty = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleCompleteOrder = (newOrder: OrderRecord) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
  };

  const handleToggleCompare = (phoneId: string) => {
    setComparedIds((prev) => {
      if (prev.includes(phoneId)) {
        return prev;
      }
      return [phoneId, prev[0], prev[1]];
    });
    const el = document.getElementById('compare-specs');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleChangeCompareSlot = (slotIndex: number, phoneId: string) => {
    setComparedIds((prev) => {
      const next = [...prev];
      next[slotIndex] = phoneId;
      return next;
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#141413]">
      {/* TOP NAVIGATION BAR — Strict 3-Zone Contract */}
      <header className="sticky top-0 z-40 bg-[#FBFBF9]/95 backdrop-blur-md border-b border-black/8">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single Text Element Wordmark */}
          <a
            href="#top"
            className="text-xl font-bold tracking-tight text-[#141413] font-display whitespace-nowrap shrink-0"
          >
            Vantage
          </a>

          {/* Zone 2: 5 Clean Single-Line Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#575653]"
          >
            <button
              type="button"
              onClick={() => scrollToSection('collection')}
              className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
            >
              Flagships
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('compare-specs')}
              className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
            >
              Compare Specs
            </button>
            <button
              type="button"
              onClick={() => setIsTradeInOpen(true)}
              className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
            >
              Trade-In Credit
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('craftsmanship')}
              className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
            >
              Craftsmanship
            </button>
            <button
              type="button"
              onClick={() => {
                setDrawerMode('orders');
                setIsDrawerOpen(true);
              }}
              className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
            >
              Order Lookup
            </button>
          </nav>

          {/* Zone 3: 2 Primary Actions (Trade-In Status & Shopping Bag) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsTradeInOpen(true)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap cursor-pointer ${
                appliedTradeIn
                  ? 'border-[#155E3B]/40 bg-[#155E3B]/8 text-[#155E3B]'
                  : 'border-black/15 text-[#141413] hover:border-[#141413]'
              }`}
            >
              {appliedTradeIn
                ? `Trade-In: -${formatINR(appliedTradeIn.creditAmount)}`
                : 'Trade-In Estimator'}
            </button>

            <button
              type="button"
              onClick={() => {
                setDrawerMode('bag');
                setIsDrawerOpen(true);
              }}
              className="px-4 py-2 rounded-lg bg-[#141413] text-[#FBFBF9] text-xs font-semibold hover:bg-[#292927] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="font-mono-tabular">Bag ({totalBagCount})</span>
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* SECTION 1: STOREFRONT HERO */}
        <section className="max-w-[1200px] mx-auto px-6 pt-10 pb-16 md:pt-14 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Hero Editorial Copy & Primary Route */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2 text-xs text-[#6E6D68]">
                <span>Series 01 Flagship Release</span>
                <span aria-hidden="true">·</span>
                <span>Grade-5 Titanium Architecture</span>
                <span aria-hidden="true">·</span>
                <span>In Stock</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#141413] font-display leading-[1.08]">
                Machined from solid billet. Calibrated for optical truth.
              </h1>

              <p className="text-base text-[#575653] leading-relaxed max-w-xl">
                The Vantage 01 Pro Titanium pairs a 1-inch fluorite glass main sensor
                and 5x periscope telephoto array with a modular Torx internal chassis
                designed to last a decade.
              </p>

              {/* Single Dominant Visual Anchor CTA + Secondary Route */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPdpPhone(PHONES[0])}
                  className="px-6 py-3.5 rounded-lg bg-[#141413] text-[#FBFBF9] text-sm font-semibold hover:bg-[#292927] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <span>
                    Configure Vantage 01 Pro —{' '}
                    {appliedTradeIn
                      ? formatINR(Math.max(0, PHONES[0].basePrice - appliedTradeIn.creditAmount))
                      : formatINR(PHONES[0].basePrice)}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('collection')}
                  className="px-5 py-3.5 rounded-lg border border-black/15 text-sm font-medium text-[#141413] hover:border-[#141413] transition-colors whitespace-nowrap cursor-pointer"
                >
                  Explore All 6 Instruments
                </button>
              </div>

              {/* Adjacent Claim-to-Proof Metrics */}
              <div className="pt-6 border-t border-black/8 grid grid-cols-3 gap-6">
                <div>
                  <p className="text-lg sm:text-xl font-bold font-mono-tabular text-[#141413]">
                    2,800 nits
                  </p>
                  <p className="text-xs text-[#6E6D68] mt-0.5">
                    CIE D65 Reference LTPO OLED
                  </p>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold font-mono-tabular text-[#141413]">
                    8.9 / 10
                  </p>
                  <p className="text-xs text-[#6E6D68] mt-0.5">
                    Modular Torx Repairability
                  </p>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold font-mono-tabular text-[#141413]">
                    5,400 mAh
                  </p>
                  <p className="text-xs text-[#6E6D68] mt-0.5">
                    Silicon-Carbon 80W Cell
                  </p>
                </div>
              </div>
            </div>

            {/* Hero 16:9 Studio Product Showcase */}
            <div className="lg:col-span-6">
              <div
                onClick={() => setSelectedPdpPhone(PHONES[0])}
                className="group relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-[#F2F1ED] border border-black/8 shadow-sm cursor-pointer"
              >
                <SmartImage
                  src={HERO_IMAGE}
                  alt="Vantage 01 Pro Titanium smartphone resting on raw travertine stone"
                  fallbackTitle="Vantage 01 Pro Titanium"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-[#FBFBF9] flex items-end justify-between">
                  <div>
                    <p className="text-xs text-white/80">
                      Vantage 01 Pro Titanium · Raw Natural Finish
                    </p>
                    <p className="text-sm font-semibold mt-0.5">
                      120mm f/2.6 Sapphire Periscope · 3nm Vantage Silicon V9 Pro
                    </p>
                  </div>
                  <span className="text-xs font-mono-tabular underline underline-offset-4 text-white/90 shrink-0 ml-4">
                    Inspect CAD & Specs →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: FEATURED HARDWARE COLLECTION GRID */}
        <section
          id="collection"
          className="py-16 md:py-20 border-t border-black/8 max-w-[1200px] mx-auto px-6"
        >
          {/* Section Header & Interactive Filter Controls */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#6E6D68] mb-2">
                <span>Direct Factory Allocation</span>
                <span aria-hidden="true">·</span>
                <span>Unlocked Worldwide 5G & Satellite</span>
                <span aria-hidden="true">·</span>
                <span>30-Day Field Trial</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141413] font-display">
                2026 Smartphone Lineup
              </h2>
            </div>

            {/* Interactive Controls: Category Tabs + Search + Sort */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Segmented Category Filter */}
              <div
                role="tablist"
                aria-label="Filter hardware by category"
                className="inline-flex items-center gap-1 p-1 bg-[#F0EFEA] rounded-lg"
              >
                {(
                  [
                    { id: 'all', label: 'All Hardware' },
                    { id: 'pro', label: 'Pro Series' },
                    { id: 'fold', label: 'Foldable' },
                    { id: 'compact', label: 'Compact & Acoustic' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      activeCategory === tab.id
                        ? 'bg-[#FBFBF9] text-[#141413] shadow-xs'
                        : 'text-[#6E6D68] hover:text-[#141413]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#6E6D68] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  aria-label="Search smartphones by model or specification"
                  placeholder="Search model, titanium, 200MP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-7 py-2 rounded-lg border border-black/12 bg-[#FBFBF9] text-xs text-[#141413] placeholder:text-[#6E6D68] focus:outline-none focus:border-[#141413] w-48 sm:w-56"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6E6D68] hover:text-[#141413] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="inline-flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#6E6D68]" />
                <select
                  aria-label="Sort smartphones"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'weight'
                    )
                  }
                  className="rounded-lg border border-black/12 bg-[#FBFBF9] px-2.5 py-2 text-xs font-medium text-[#141413] focus:outline-none focus:border-[#141413] cursor-pointer"
                >
                  <option value="featured">Sort: Featured Lineup</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="weight">Mass: Lightest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Trade-In Banner inside Catalog if applied */}
          {appliedTradeIn && (
            <div className="mb-8 p-4 rounded-xl bg-[#F2F1ED] border border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs">
                <span className="font-semibold text-[#155E3B]">
                  Active Trade-In Credit Applied (-{formatINR(appliedTradeIn.creditAmount)}):
                </span>{' '}
                <span className="text-[#575653]">
                  All prices below reflect your instant deduction for trading in a{' '}
                  {appliedTradeIn.model} ({appliedTradeIn.storage}).
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsTradeInOpen(true)}
                  className="text-xs font-semibold underline underline-offset-4 text-[#141413] cursor-pointer"
                >
                  Change Device
                </button>
                <button
                  type="button"
                  onClick={() => setAppliedTradeIn(null)}
                  className="text-xs text-[#6E6D68] hover:text-[#141413] cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* 3-Column Product Grid */}
          {filteredPhones.length === 0 ? (
            <div className="py-16 text-center bg-[#F2F1ED]/50 rounded-2xl border border-black/8 space-y-3">
              <p className="text-base font-semibold text-[#141413]">
                No hardware instruments match "{searchQuery}"
              </p>
              <p className="text-xs text-[#6E6D68]">
                Try clearing your search filter or switching hardware categories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-lg bg-[#141413] text-[#FBFBF9] text-xs font-semibold hover:bg-[#292927] transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPhones.map((phone) => {
                const activeFinish = cardFinishes[phone.id] || phone.finishes[0];
                const displayImg = activeFinish.imageOverride || phone.image;
                const effectivePrice = appliedTradeIn
                  ? Math.max(0, phone.basePrice - appliedTradeIn.creditAmount)
                  : phone.basePrice;
                const isQuickAdded = quickAddedId === phone.id;

                return (
                  <article
                    key={phone.id}
                    onClick={() => setSelectedPdpPhone(phone)}
                    className="group flex flex-col justify-between rounded-xl bg-[#FBFBF9] border border-black/8 hover:border-black/25 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
                  >
                    <div>
                      {/* Product Image Container (70% visual lead on neutral stone backdrop) */}
                      <div className="relative aspect-4/3 w-full bg-[#F2F1ED] overflow-hidden border-b border-black/6">
                        <SmartImage
                          src={displayImg}
                          alt={`${phone.name} in ${activeFinish.name}`}
                          fallbackTitle={phone.name}
                          accentHex={activeFinish.hex}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                      </div>

                      {/* Card Content Body */}
                      <div className="p-6 space-y-3">
                        {/* Unboxed Clean Metadata with Typographic Separators */}
                        <div className="flex items-center justify-between text-xs text-[#6E6D68]">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="uppercase tracking-wider text-[11px]">
                              {phone.series}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono-tabular">
                              {phone.specs.displaySize}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{phone.stockStatus}</span>
                          </div>
                          <span className="font-mono-tabular text-[11px] shrink-0">
                            {phone.specs.weightGrams}g
                          </span>
                        </div>

                        {/* Title & Price */}
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="text-base font-semibold text-[#141413] group-hover:underline underline-offset-4">
                            {phone.name}
                          </h3>
                          <div className="text-right shrink-0">
                            <span className="text-[15px] font-semibold font-mono-tabular text-[#141413]">
                              {formatINR(effectivePrice)}
                            </span>
                            {appliedTradeIn && (
                              <span className="block text-[11px] line-through text-[#6E6D68] font-mono-tabular">
                                {formatINR(phone.basePrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-[#575653] line-clamp-2 leading-relaxed">
                          {phone.tagline}
                        </p>

                        {/* Key Technical Spec Line */}
                        <div className="pt-2 border-t border-black/6 flex items-center gap-2 text-[11px] text-[#6E6D68] font-mono-tabular truncate">
                          <span>{phone.specs.processor}</span>
                          <span aria-hidden="true">·</span>
                          <span>{phone.specs.batteryMah}</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Finish Selector & Card Actions */}
                    <div className="px-6 pb-6 pt-2 flex flex-col gap-4">
                      {/* Finish Swatches */}
                      <div
                        className="flex items-center justify-between"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-2">
                          {phone.finishes.map((finish) => {
                            const isSelected = finish.id === activeFinish.id;
                            return (
                              <button
                                key={finish.id}
                                type="button"
                                onClick={() =>
                                  setCardFinishes((prev) => ({
                                    ...prev,
                                    [phone.id]: finish,
                                  }))
                                }
                                title={finish.name}
                                aria-label={`Select ${finish.name} finish for ${phone.name}`}
                                className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                                  isSelected
                                    ? 'scale-110 ring-2 ring-[#141413] ring-offset-2 ring-offset-[#FBFBF9]'
                                    : 'border-black/20 hover:scale-105'
                                }`}
                                style={{ backgroundColor: finish.hex }}
                              />
                            );
                          })}
                          <span className="text-[11px] text-[#6E6D68] ml-1 truncate max-w-[130px]">
                            {activeFinish.name}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleCompare(phone.id)}
                          className="text-[11px] font-medium text-[#575653] hover:text-[#141413] underline underline-offset-4 whitespace-nowrap cursor-pointer"
                        >
                          {comparedIds.includes(phone.id) ? 'Comparing ✓' : 'Compare'}
                        </button>
                      </div>

                      {/* Primary Configure & Quick-Add Buttons */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPdpPhone(phone);
                          }}
                          className="py-2.5 px-3 rounded-lg border border-black/15 text-xs font-semibold text-[#141413] hover:border-[#141413] transition-colors whitespace-nowrap cursor-pointer"
                        >
                          Configure & Specs
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleQuickAddFromCard(phone, e)}
                          className={`py-2.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                            isQuickAdded
                              ? 'bg-[#155E3B] text-[#FBFBF9]'
                              : 'bg-[#141413] text-[#FBFBF9] hover:bg-[#292927]'
                          }`}
                        >
                          {isQuickAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added to Bag</span>
                            </>
                          ) : (
                            <span>Quick Add (256 GB)</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 3: SIDE-BY-SIDE SPECIFICATION COMPARISON MATRIX */}
        <ComparisonMatrixSection
          phones={PHONES}
          comparedIds={comparedIds}
          onChangeSlot={handleChangeCompareSlot}
          onSelectPhoneForPdp={(phone) => setSelectedPdpPhone(phone)}
          appliedTradeIn={appliedTradeIn}
        />

        {/* SECTION 4: CRAFTSMANSHIP, MATERIALS & ATTRIBUTABLE FIELD PROOF */}
        <section
          id="craftsmanship"
          className="py-20 border-t border-black/8 bg-[#F4F3EF]"
        >
          <div className="max-w-[1200px] mx-auto px-6 space-y-16">
            {/* Architectural Engineering Pillars */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2 text-xs text-[#6E6D68]">
                  <span>Material Integrity</span>
                  <span aria-hidden="true">·</span>
                  <span>Right to Repair Standard</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141413] font-display">
                  Built like a mechanical camera, not a disposable appliance.
                </h2>
                <p className="text-sm text-[#575653] leading-relaxed">
                  Every Vantage instrument is machined in-house with replaceable optical
                  modules, non-glued battery pull tabs, and published factory service
                  schematics.
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2 border-t-2 border-[#141413] pt-4">
                  <p className="text-xs font-mono-tabular text-[#6E6D68]">
                    01 · CHASSIS MILLING
                  </p>
                  <h3 className="text-sm font-semibold text-[#141413]">
                    Aerospace Grade-5 Titanium
                  </h3>
                  <p className="text-xs text-[#575653] leading-relaxed">
                    42 minutes of 5-axis CNC machining per frame yields a 2.4× higher
                    strength-to-mass ratio than standard aluminum rails.
                  </p>
                </div>

                <div className="space-y-2 border-t-2 border-[#141413] pt-4">
                  <p className="text-xs font-mono-tabular text-[#6E6D68]">
                    02 · OPTICAL GLASS
                  </p>
                  <h3 className="text-sm font-semibold text-[#141413]">
                    Fluorite & Sapphire Lenses
                  </h3>
                  <p className="text-xs text-[#575653] leading-relaxed">
                    Low-dispersion fluorite crystal elements eliminate chromatic
                    aberration across our 120mm and 170mm periscope focal lengths.
                  </p>
                </div>

                <div className="space-y-2 border-t-2 border-[#141413] pt-4">
                  <p className="text-xs font-mono-tabular text-[#6E6D68]">
                    03 · SERVICEABILITY
                  </p>
                  <h3 className="text-sm font-semibold text-[#141413]">
                    11-Minute Module Swap
                  </h3>
                  <p className="text-xs text-[#575653] leading-relaxed">
                    Standard T3 Torx fasteners allow independent replacement of the
                    battery cell, USB-C port, or display without heat guns.
                  </p>
                </div>
              </div>
            </div>

            {/* Attributable Field Testimonials (Adjacent Proof) */}
            <div className="pt-12 border-t border-black/8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-base font-bold text-[#141413] font-display">
                  Independent Field & Laboratory Verification
                </h3>
                <span className="text-xs text-[#6E6D68] font-mono-tabular">
                  Verified Production Units
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TESTIMONIALS.map((item) => (
                  <blockquote
                    key={item.author}
                    className="flex flex-col justify-between p-6 rounded-xl bg-[#FBFBF9] border border-black/8 space-y-5"
                  >
                    <div className="space-y-3">
                      <p className="text-xs font-mono-tabular font-semibold text-[#141413]">
                        {item.metric}
                      </p>
                      <p className="text-xs text-[#141413] leading-relaxed">
                        "{item.quote}"
                      </p>
                    </div>
                    <footer className="pt-4 border-t border-black/6 text-xs">
                      <p className="font-semibold text-[#141413]">{item.author}</p>
                      <p className="text-[#6E6D68]">
                        {item.role} · {item.organization}
                      </p>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* QUIET FOOTER */}
      <footer className="bg-[#141413] text-[#FBFBF9] py-12 border-t border-black/10">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-1.5">
            <span className="text-lg font-bold tracking-tight font-display">
              Vantage
            </span>
            <p className="text-xs text-[#A3A19A]">
              Direct-to-Consumer Precision Mobile Hardware · ISO-9001 & CIE D65 Certified
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#A3A19A]">
            <button
              type="button"
              onClick={() => scrollToSection('collection')}
              className="hover:text-[#FBFBF9] transition-colors cursor-pointer"
            >
              Hardware Lineup
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('compare-specs')}
              className="hover:text-[#FBFBF9] transition-colors cursor-pointer"
            >
              Specification Matrix
            </button>
            <button
              type="button"
              onClick={() => setIsTradeInOpen(true)}
              className="hover:text-[#FBFBF9] transition-colors cursor-pointer"
            >
              Trade-In Valuation
            </button>
            <button
              type="button"
              onClick={() => {
                setDrawerMode('orders');
                setIsDrawerOpen(true);
              }}
              className="hover:text-[#FBFBF9] transition-colors cursor-pointer"
            >
              Order Tracking ({orders.length})
            </button>
          </div>

          <p className="text-xs text-[#A3A19A] font-mono-tabular">
            © {new Date().getFullYear()} Vantage Hardware Inc.
          </p>
        </div>
      </footer>

      {/* CONTIGUOUS PURCHASE MODULE (PDP MODAL) */}
      <ProductDetailModal
        phone={selectedPdpPhone}
        onClose={() => setSelectedPdpPhone(null)}
        onAddToCart={(item) => {
          handleAddToCart(item);
        }}
        appliedTradeIn={appliedTradeIn}
        onOpenTradeIn={() => setIsTradeInOpen(true)}
        isCompared={
          selectedPdpPhone ? comparedIds.includes(selectedPdpPhone.id) : false
        }
        onToggleCompare={handleToggleCompare}
      />

      {/* INTERACTIVE TRADE-IN ESTIMATOR MODAL */}
      <TradeInEstimatorModal
        isOpen={isTradeInOpen}
        onClose={() => setIsTradeInOpen(false)}
        appliedTradeIn={appliedTradeIn}
        onApplyTradeIn={(tradeIn) => setAppliedTradeIn(tradeIn)}
      />

      {/* SLIDE-OVER SHOPPING BAG, COD CHECKOUT & ORDER TRACKING DRAWER */}
      <CartAndCheckoutDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        appliedTradeIn={appliedTradeIn}
        onOpenTradeIn={() => setIsTradeInOpen(true)}
        onCompleteOrder={handleCompleteOrder}
        orders={orders}
        initialMode={drawerMode}
      />
    </div>
  );
}
