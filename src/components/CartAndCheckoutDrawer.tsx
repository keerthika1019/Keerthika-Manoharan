import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Check,
  Truck,
  Shield,
  ArrowLeft,
  Package,
} from 'lucide-react';
import { CartItem, AppliedTradeIn, OrderRecord, formatINR } from '../data/phones';
import { SmartImage } from './SmartImage';

interface CartAndCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  appliedTradeIn: AppliedTradeIn | null;
  onOpenTradeIn: () => void;
  onCompleteOrder: (order: OrderRecord) => void;
  orders: OrderRecord[];
  initialMode?: 'bag' | 'orders';
}

export const CartAndCheckoutDrawer: React.FC<CartAndCheckoutDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  appliedTradeIn,
  onOpenTradeIn,
  onCompleteOrder,
  orders,
  initialMode = 'bag',
}) => {
  const [stage, setStage] = useState<'bag' | 'checkout' | 'confirmed' | 'orders'>(
    initialMode
  );
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<
    'Card' | 'Monthly 0% APR' | 'Cash on Delivery (COD)'
  >('Cash on Delivery (COD)');
  const [formError, setFormError] = useState('');
  const [latestOrder, setLatestOrder] = useState<OrderRecord | null>(null);
  const [lookupQuery, setLookupQuery] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setStage(initialMode);
      setFormError('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tradeInCredit =
    cart.length > 0 && appliedTradeIn ? appliedTradeIn.creditAmount : 0;
  const freeShippingThreshold = 25000;
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 999;
  const totalAmount = Math.max(0, subtotal - tradeInCredit + shippingCost);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !customerName.trim() ||
      !customerPhone.trim() ||
      !shippingAddress.trim() ||
      !city.trim() ||
      !postalCode.trim()
    ) {
      setFormError(
        'Please complete all required recipient verification fields (Name, Phone, Street Address, City, and Postal Code).'
      );
      return;
    }

    const orderNum = Math.floor(1040 + Math.random() * 8900);
    const newOrder: OrderRecord = {
      orderId: `VTG-${orderNum}`,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || 'verified-dispatch@vantage.hardware',
      shippingAddress: shippingAddress.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      paymentMethod,
      items: [...cart],
      subtotal,
      tradeInCredit,
      tradeInDetails: appliedTradeIn,
      shippingCost,
      totalAmount,
      status: 'Confirmed — Preparing Shipment',
    };

    setLatestOrder(newOrder);
    onCompleteOrder(newOrder);
    setStage('confirmed');
  };

  const filteredOrders = orders.filter(
    (o) =>
      !lookupQuery.trim() ||
      o.orderId.toLowerCase().includes(lookupQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(lookupQuery.toLowerCase()) ||
      o.customerPhone.includes(lookupQuery.trim())
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and Order Verification"
    >
      <div className="w-full max-w-lg bg-[#FBFBF9] text-[#141413] h-full flex flex-col justify-between shadow-2xl border-l border-black/10 overflow-hidden">
        {/* Top Drawer Header */}
        <div className="px-6 py-4 border-b border-black/8 flex items-center justify-between bg-[#FBFBF9]">
          <div className="flex items-center gap-3">
            {stage === 'checkout' && (
              <button
                type="button"
                onClick={() => setStage('bag')}
                className="p-1.5 rounded-lg hover:bg-black/5 text-[#575653] hover:text-[#141413] transition-colors cursor-pointer"
                aria-label="Back to shopping bag"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 className="text-base font-bold tracking-tight font-display">
                {stage === 'bag' && 'Hardware Shopping Bag'}
                {stage === 'checkout' && 'Recipient & Payment Verification'}
                {stage === 'confirmed' && `Order #${latestOrder?.orderId} Confirmed`}
                {stage === 'orders' && 'Order Tracking & Dispatch History'}
              </h2>
              <p className="text-xs text-[#6E6D68]">
                {stage === 'bag' &&
                  'Free insured express delivery on all flagship hardware'}
                {stage === 'checkout' &&
                  'Direct factory dispatch with Cash on Delivery or 0% APR support'}
                {stage === 'confirmed' && 'Preparing Shipment · Optical QC Passed'}
                {stage === 'orders' && 'Verify shipment status and hardware receipts'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {stage !== 'orders' && orders.length > 0 && (
              <button
                type="button"
                onClick={() => setStage('orders')}
                className="px-2.5 py-1.5 rounded-md text-xs font-medium text-[#575653] hover:text-[#141413] hover:bg-black/5 transition-colors whitespace-nowrap cursor-pointer"
              >
                Orders ({orders.length})
              </button>
            )}
            {stage === 'orders' && (
              <button
                type="button"
                onClick={() => setStage('bag')}
                className="px-2.5 py-1.5 rounded-md text-xs font-medium text-[#575653] hover:text-[#141413] hover:bg-black/5 transition-colors whitespace-nowrap cursor-pointer"
              >
                View Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="p-2 rounded-lg text-[#575653] hover:text-[#141413] hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STAGE 1: SHOPPING BAG */}
          {stage === 'bag' && (
            <>
              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#F2F1ED] mx-auto flex items-center justify-center text-[#575653]">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#141413]">
                      Your hardware bag is empty
                    </p>
                    <p className="text-xs text-[#6E6D68] max-w-xs mx-auto">
                      Configure a flagship smartphone or estimate your instant trade-in
                      credit to begin.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-lg bg-[#141413] text-[#FBFBF9] text-xs font-semibold hover:bg-[#292927] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Explore Flagships
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenTradeIn();
                      }}
                      className="px-4 py-2 rounded-lg border border-black/15 text-xs font-medium text-[#141413] hover:border-[#141413] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Estimate Trade-In
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Free Delivery Threshold Notice */}
                  <div className="p-3.5 rounded-xl bg-[#F2F1ED] border border-black/8 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <Truck className="w-4 h-4 text-[#141413] shrink-0" />
                      <span className="text-[#141413] font-medium">
                        {subtotal >= freeShippingThreshold
                          ? 'Qualified for Free Insured Express Courier (₹0)'
                          : `Add ${formatINR(freeShippingThreshold - subtotal)} for free express courier`}
                      </span>
                    </div>
                    <span className="font-mono-tabular text-[#6E6D68]">24h Dispatch</span>
                  </div>

                  {/* Itemized Configurations */}
                  <div className="divide-y divide-black/8">
                    {cart.map((item) => (
                      <div key={item.cartItemId} className="py-4 flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F2F1ED] border border-black/6 shrink-0">
                          <SmartImage
                            src={item.image}
                            alt={item.phoneName}
                            fallbackTitle={item.phoneName}
                            accentHex={item.finish.hex}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-semibold text-[#141413] truncate">
                              {item.phoneName}
                            </h3>
                            <span className="text-sm font-semibold font-mono-tabular text-[#141413] shrink-0">
                              {formatINR(item.unitPrice * item.quantity)}
                            </span>
                          </div>

                          <p className="text-xs text-[#6E6D68] mt-0.5">
                            {item.finish.name} · {item.storage.capacity} · {item.connectivity}
                          </p>
                          {item.vantageCare && (
                            <p className="text-[11px] text-[#141413] font-medium mt-0.5">
                              Includes VantageCare+ 3-Year Sapphire Coverage (+{formatINR(11999)})
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-3">
                            <div className="inline-flex items-center border border-black/15 rounded-lg bg-[#FBFBF9]">
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                                aria-label="Decrease quantity"
                                className="p-1.5 text-[#575653] hover:text-[#141413] cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2.5 text-xs font-mono-tabular font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                                aria-label="Increase quantity"
                                className="p-1.5 text-[#575653] hover:text-[#141413] cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.cartItemId)}
                              aria-label={`Remove ${item.phoneName}`}
                              className="p-1.5 text-[#6E6D68] hover:text-[#141413] transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Trade-In Credit Box */}
                  <div className="p-4 rounded-xl border border-black/10 bg-[#FBFBF9] flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-[#141413]">
                        {appliedTradeIn
                          ? `Trade-In Applied: ${appliedTradeIn.model} (${appliedTradeIn.storage})`
                          : 'Trading in an existing smartphone?'}
                      </p>
                      <p className="text-[11px] text-[#6E6D68] mt-0.5">
                        {appliedTradeIn
                          ? `Instant deduction of -${formatINR(appliedTradeIn.creditAmount)} locked for 14 days`
                          : `Get up to ${formatINR(63000)} instant credit toward your hardware order`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenTradeIn();
                      }}
                      className="text-xs font-semibold underline underline-offset-4 text-[#141413] hover:text-[#575653] whitespace-nowrap cursor-pointer"
                    >
                      {appliedTradeIn ? 'Modify' : 'Add Trade-In'}
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* STAGE 2: CHECKOUT & CUSTOMER VERIFICATION FORM */}
          {stage === 'checkout' && (
            <form id="checkout-verification-form" onSubmit={handlePlaceOrder} className="space-y-5">
              {/* Payment Method Selector */}
              <div className="space-y-2.5">
                <label className="block text-xs font-semibold text-[#141413]">
                  01. Select Payment Method
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {(
                    [
                      {
                        id: 'Cash on Delivery (COD)',
                        title: 'Cash on Delivery (COD) / Courier Terminal',
                        desc: 'Pay upon physical inspection at delivery · ₹0 upfront fee',
                      },
                      {
                        id: 'Card',
                        title: 'Instant Card / UPI / NetBanking Settlement',
                        desc: 'Immediate full settlement · Insured priority dispatch',
                      },
                      {
                        id: 'Monthly 0% APR',
                        title: `24-Month No-Cost EMI (${formatINR(Math.round(totalAmount / 24))}/mo)`,
                        desc: 'Equal monthly payments · Zero interest or processing fees',
                      },
                    ] as const
                  ).map((method) => {
                    const active = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-3.5 rounded-lg border text-left flex items-start justify-between gap-3 transition-colors cursor-pointer ${
                          active
                            ? 'border-[#141413] bg-[#F2F1ED]'
                            : 'border-black/12 bg-[#FBFBF9] hover:border-black/30'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-semibold text-[#141413]">
                            {method.title}
                          </p>
                          <p className="text-[11px] text-[#6E6D68] mt-0.5">
                            {method.desc}
                          </p>
                        </div>
                        {active && <Check className="w-4 h-4 text-[#141413] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer Delivery & COD Verification Fields */}
              <div className="space-y-3 pt-2 border-t border-black/8">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#141413]">
                    02. Recipient & Delivery Verification
                  </span>
                  <span className="text-[11px] text-[#6E6D68]">Signature Required</span>
                </div>

                {formError && (
                  <div className="p-3 rounded-lg bg-[#FDF2F2] border border-[#DC2626]/30 text-xs text-[#991B1B]">
                    {formError}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="cust-name"
                      className="block text-xs font-medium text-[#575653] mb-1"
                    >
                      Full Legal Name *
                    </label>
                    <input
                      id="cust-name"
                      type="text"
                      required
                      placeholder="e.g. Elena Rostova"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-black/15 bg-[#FBFBF9] text-xs text-[#141413] focus:outline-none focus:border-[#141413]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="cust-phone"
                        className="block text-xs font-medium text-[#575653] mb-1"
                      >
                        Mobile Number (Courier SMS) *
                      </label>
                      <input
                        id="cust-phone"
                        type="tel"
                        required
                        placeholder="+1 (555) 234-5678"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-black/15 bg-[#FBFBF9] text-xs font-mono-tabular text-[#141413] focus:outline-none focus:border-[#141413]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cust-email"
                        className="block text-xs font-medium text-[#575653] mb-1"
                      >
                        Email for Optical Certificate
                      </label>
                      <input
                        id="cust-email"
                        type="email"
                        placeholder="elena@studio.org"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-black/15 bg-[#FBFBF9] text-xs text-[#141413] focus:outline-none focus:border-[#141413]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="cust-address"
                      className="block text-xs font-medium text-[#575653] mb-1"
                    >
                      Street Address & Suite *
                    </label>
                    <input
                      id="cust-address"
                      type="text"
                      required
                      placeholder="742 Architectural Way, Suite 4B"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-black/15 bg-[#FBFBF9] text-xs text-[#141413] focus:outline-none focus:border-[#141413]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="cust-city"
                        className="block text-xs font-medium text-[#575653] mb-1"
                      >
                        City *
                      </label>
                      <input
                        id="cust-city"
                        type="text"
                        required
                        placeholder="San Francisco"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-black/15 bg-[#FBFBF9] text-xs text-[#141413] focus:outline-none focus:border-[#141413]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cust-postal"
                        className="block text-xs font-medium text-[#575653] mb-1"
                      >
                        Postal / ZIP Code *
                      </label>
                      <input
                        id="cust-postal"
                        type="text"
                        required
                        placeholder="94107"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-black/15 bg-[#FBFBF9] text-xs font-mono-tabular text-[#141413] focus:outline-none focus:border-[#141413]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* COD / Payment Terms Summary Box */}
              <div className="p-4 rounded-xl bg-[#F2F1ED] border border-black/8 space-y-2 text-xs">
                <div className="flex items-center justify-between font-semibold text-[#141413]">
                  <span>Payment Verification Terms</span>
                  <span className="font-mono-tabular">{paymentMethod}</span>
                </div>
                <p className="text-[#575653] leading-relaxed">
                  Total due upon verification:{' '}
                  <strong className="font-mono-tabular text-[#141413]">
                    {formatINR(totalAmount)}
                  </strong>{' '}
                  (Free insured courier threshold met). Every unit ships sealed with a
                  matching factory calibration report.
                </p>
              </div>
            </form>
          )}

          {/* STAGE 3: CONFIRMED POST-ORDER STATE */}
          {stage === 'confirmed' && latestOrder && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-[#F2F1ED] border border-black/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-tabular font-semibold text-[#155E3B]">
                    ● {latestOrder.status}
                  </span>
                  <span className="text-xs font-mono-tabular text-[#6E6D68]">
                    {latestOrder.createdAt}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display text-[#141413]">
                  Order #{latestOrder.orderId} Confirmed — Preparing Shipment
                </h3>
                <p className="text-xs text-[#575653] leading-relaxed">
                  Recipient: <strong className="text-[#141413]">{latestOrder.customerName}</strong>{' '}
                  ({latestOrder.customerPhone}) · Dispatching to {latestOrder.shippingAddress},{' '}
                  {latestOrder.city} {latestOrder.postalCode}.
                </p>
              </div>

              {/* Receipt Summary */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-[#141413]">
                  Allocated Hardware Receipt
                </h4>
                <div className="divide-y divide-black/8 border-y border-black/8">
                  {latestOrder.items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="py-3 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-[#141413]">
                          {item.quantity}× {item.phoneName}
                        </p>
                        <p className="text-[#6E6D68]">
                          {item.finish.name} · {item.storage.capacity} · {item.connectivity}
                        </p>
                      </div>
                      <span className="font-mono-tabular font-semibold text-[#141413]">
                        {formatINR(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5 pt-2 text-xs">
                  <div className="flex justify-between text-[#575653]">
                    <span>Hardware Subtotal</span>
                    <span className="font-mono-tabular">
                      {formatINR(latestOrder.subtotal)}
                    </span>
                  </div>
                  {latestOrder.tradeInCredit > 0 && (
                    <div className="flex justify-between text-[#155E3B] font-medium">
                      <span>Applied Trade-In Credit</span>
                      <span className="font-mono-tabular">
                        -{formatINR(latestOrder.tradeInCredit)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#575653]">
                    <span>Insured Express Courier</span>
                    <span className="font-mono-tabular">
                      {latestOrder.shippingCost === 0
                        ? 'FREE (₹0)'
                        : formatINR(latestOrder.shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#575653]">
                    <span>Payment Method</span>
                    <span className="font-mono-tabular">{latestOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#141413] pt-2 border-t border-black/8">
                    <span>Total Verified Amount</span>
                    <span className="font-mono-tabular">
                      {formatINR(latestOrder.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: ORDER LOOKUP & HISTORY */}
          {stage === 'orders' && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="order-lookup-input"
                  className="block text-xs font-medium text-[#575653] mb-1.5"
                >
                  Filter by Order Number, Recipient Name, or Phone
                </label>
                <input
                  id="order-lookup-input"
                  type="text"
                  placeholder="e.g. VTG-1042 or recipient name..."
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-black/15 bg-[#FBFBF9] text-xs text-[#141413] focus:outline-none focus:border-[#141413]"
                />
              </div>

              {filteredOrders.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <p className="text-sm font-semibold text-[#141413]">
                    No matching orders found
                  </p>
                  <p className="text-xs text-[#6E6D68]">
                    Orders placed during your session are saved automatically for instant
                    verification.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.orderId}
                      className="p-4 rounded-xl border border-black/10 bg-[#F2F1ED]/60 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-black/8 pb-2.5">
                        <div>
                          <span className="text-xs font-bold font-mono-tabular text-[#141413]">
                            Order #{order.orderId}
                          </span>
                          <span className="text-xs text-[#6E6D68] ml-2">
                            · {order.createdAt}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-[#155E3B]">
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        {order.items.map((item) => (
                          <div
                            key={item.cartItemId}
                            className="flex justify-between text-[#141413]"
                          >
                            <span>
                              {item.quantity}× {item.phoneName} ({item.storage.capacity})
                            </span>
                            <span className="font-mono-tabular">
                              {formatINR(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-black/8 flex items-center justify-between text-xs">
                        <span className="text-[#6E6D68]">
                          {order.customerName} · {order.paymentMethod}
                        </span>
                        <span className="font-bold font-mono-tabular text-[#141413]">
                          Total: {formatINR(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {stage === 'bag' && cart.length > 0 && (
          <div className="p-6 border-t border-black/10 bg-[#FBFBF9] space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#575653]">
                <span>Subtotal</span>
                <span className="font-mono-tabular">{formatINR(subtotal)}</span>
              </div>
              {tradeInCredit > 0 && (
                <div className="flex justify-between text-[#155E3B] font-medium">
                  <span>Instant Trade-In Credit ({appliedTradeIn?.model})</span>
                  <span className="font-mono-tabular">
                    -{formatINR(tradeInCredit)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#575653]">
                <span>Insured Express Courier</span>
                <span className="font-mono-tabular">
                  {shippingCost === 0 ? 'FREE (₹0)' : formatINR(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#141413] pt-2 border-t border-black/8">
                <span>Estimated Total</span>
                <span className="font-mono-tabular">
                  {formatINR(totalAmount)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStage('checkout')}
              className="w-full py-3.5 px-6 rounded-lg bg-[#141413] text-[#FBFBF9] text-xs font-semibold hover:bg-[#292927] transition-colors whitespace-nowrap cursor-pointer"
            >
              Proceed to Verification & Checkout — {formatINR(totalAmount)}
            </button>
          </div>
        )}

        {stage === 'checkout' && (
          <div className="p-6 border-t border-black/10 bg-[#FBFBF9] space-y-3">
            <div className="flex items-center justify-between text-sm font-bold text-[#141413]">
              <span>Total Verification Amount</span>
              <span className="font-mono-tabular">{formatINR(totalAmount)}</span>
            </div>
            <button
              type="submit"
              form="checkout-verification-form"
              className="w-full py-3.5 px-6 rounded-lg bg-[#141413] text-[#FBFBF9] text-xs font-semibold hover:bg-[#292927] transition-colors whitespace-nowrap cursor-pointer"
            >
              Confirm Order ({paymentMethod})
            </button>
          </div>
        )}

        {stage === 'confirmed' && (
          <div className="p-6 border-t border-black/10 bg-[#FBFBF9] flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStage('orders')}
              className="flex-1 py-3 px-4 rounded-lg border border-black/15 text-xs font-semibold text-[#141413] hover:border-[#141413] transition-colors whitespace-nowrap cursor-pointer"
            >
              View All Orders
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg bg-[#141413] text-[#FBFBF9] text-xs font-semibold hover:bg-[#292927] transition-colors whitespace-nowrap cursor-pointer"
            >
              Continue Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
