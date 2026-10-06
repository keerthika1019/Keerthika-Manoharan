import React, { useState, useEffect } from 'react';
import { X, Check, ArrowLeft, Shield, Truck, RefreshCw } from 'lucide-react';
import {
  PhoneProduct,
  ColorFinish,
  StorageOption,
  AppliedTradeIn,
  CartItem,
  formatINR,
} from '../data/phones';
import { SmartImage, HardwareBlueprintCanvas } from './SmartImage';

interface ProductDetailModalProps {
  phone: PhoneProduct | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  appliedTradeIn: AppliedTradeIn | null;
  onOpenTradeIn: () => void;
  isCompared: boolean;
  onToggleCompare: (phoneId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  phone,
  onClose,
  onAddToCart,
  appliedTradeIn,
  onOpenTradeIn,
  isCompared,
  onToggleCompare,
}) => {
  if (!phone) return null;

  const [selectedFinish, setSelectedFinish] = useState<ColorFinish>(phone.finishes[0]);
  const [selectedStorage, setSelectedStorage] = useState<StorageOption>(
    phone.storageOptions[0]
  );
  const [connectivity, setConnectivity] = useState<
    'Unlocked SIM-Free' | 'Global Enterprise eSIM'
  >('Unlocked SIM-Free');
  const [vantageCare, setVantageCare] = useState<boolean>(false);
  const [paymentMode, setPaymentMode] = useState<'full' | 'monthly'>('full');
  const [galleryView, setGalleryView] = useState<'studio' | 'cad' | 'dimensions'>('studio');
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    setSelectedFinish(phone.finishes[0]);
    setSelectedStorage(phone.storageOptions[0]);
    setConnectivity('Unlocked SIM-Free');
    setVantageCare(false);
    setGalleryView('studio');
  }, [phone]);

  const carePrice = vantageCare ? 11999 : 0;
  const connectivityDelta = connectivity === 'Global Enterprise eSIM' ? 3500 : 0;
  const grossUnitPrice =
    phone.basePrice + selectedStorage.priceDelta + carePrice + connectivityDelta;
  const netAfterTradeIn = Math.max(
    0,
    grossUnitPrice - (appliedTradeIn ? appliedTradeIn.creditAmount : 0)
  );
  const monthlyPrice = Math.round(netAfterTradeIn / 24);

  const activeImage = selectedFinish.imageOverride || phone.image;

  const handleConfirmAdd = () => {
    const newItem: CartItem = {
      cartItemId: `${phone.id}-${selectedFinish.id}-${selectedStorage.capacity}-${connectivity}-${vantageCare ? 'care' : 'std'}-${paymentMode}`,
      phoneId: phone.id,
      phoneName: phone.name,
      series: phone.series,
      image: activeImage,
      finish: selectedFinish,
      storage: selectedStorage,
      connectivity,
      vantageCare,
      paymentMode,
      unitPrice: grossUnitPrice,
      quantity: 1,
    };
    onAddToCart(newItem);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 1400);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs overflow-y-auto flex items-start justify-center p-0 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
    >
      <div className="relative w-full max-w-[1240px] bg-[#FBFBF9] text-[#141413] md:rounded-2xl border border-black/10 shadow-2xl overflow-hidden my-auto">
        {/* Top Bar inside PDP */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/8 bg-[#FBFBF9] sticky top-0 z-20">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#575653] hover:text-[#141413] transition-colors whitespace-nowrap cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Hardware Lineup</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#6E6D68]">
            <span>{phone.series}</span>
            <span aria-hidden="true">·</span>
            <span>{phone.specs.chassisMaterial}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">{phone.stockStatus}</span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close hardware configurator"
            className="p-2 rounded-lg text-[#575653] hover:text-[#141413] hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main 2-Column Contiguous Purchase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-10">
          {/* Left Column: Sticky Gallery & Technical Inspector (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="lg:sticky lg:top-20 space-y-6">
              {/* View Switcher (Interactive Segmented Control) */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="inline-flex items-center gap-1 p-1 bg-[#F0EFEA] rounded-lg">
                  <button
                    type="button"
                    onClick={() => setGalleryView('studio')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      galleryView === 'studio'
                        ? 'bg-[#FBFBF9] text-[#141413] shadow-xs'
                        : 'text-[#6E6D68] hover:text-[#141413]'
                    }`}
                  >
                    Studio Photography
                  </button>
                  <button
                    type="button"
                    onClick={() => setGalleryView('cad')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      galleryView === 'cad'
                        ? 'bg-[#FBFBF9] text-[#141413] shadow-xs'
                        : 'text-[#6E6D68] hover:text-[#141413]'
                    }`}
                  >
                    Internal Architecture CAD
                  </button>
                  <button
                    type="button"
                    onClick={() => setGalleryView('dimensions')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      galleryView === 'dimensions'
                        ? 'bg-[#FBFBF9] text-[#141413] shadow-xs'
                        : 'text-[#6E6D68] hover:text-[#141413]'
                    }`}
                  >
                    Elevation & Mass
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleCompare(phone.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                    isCompared
                      ? 'border-[#141413] bg-[#141413] text-[#FBFBF9]'
                      : 'border-black/15 text-[#141413] hover:border-[#141413]'
                  }`}
                >
                  {isCompared ? 'In Comparison Matrix' : 'Add to Spec Compare'}
                </button>
              </div>

              {/* Primary Visual Frame */}
              <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-[#F3F2EE] border border-black/6">
                {galleryView === 'studio' ? (
                  <>
                    <SmartImage
                      src={activeImage}
                      alt={`${phone.name} in ${selectedFinish.name}`}
                      fallbackTitle={phone.name}
                      accentHex={selectedFinish.hex}
                      className="w-full h-full object-cover transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-5 text-[#FBFBF9] flex items-end justify-between">
                      <div>
                        <p className="text-xs text-white/80">
                          {selectedFinish.name} · {selectedStorage.capacity}
                        </p>
                        <p className="text-xs text-white/70 mt-0.5">
                          {selectedFinish.materialNote}
                        </p>
                      </div>
                      <span className="text-xs font-mono-tabular text-white/90">
                        {phone.specs.dimensionsMm}
                      </span>
                    </div>
                  </>
                ) : (
                  <HardwareBlueprintCanvas
                    phone={phone}
                    mode={galleryView}
                    selectedFinishHex={selectedFinish.hex}
                  />
                )}
              </div>

              {/* Technical Specification Grid */}
              <div className="pt-4 border-t border-black/8">
                <h3 className="text-sm font-semibold text-[#141413] mb-3">
                  Hardware Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs">
                  <div>
                    <p className="text-[#6E6D68]">Display Panel</p>
                    <p className="font-medium text-[#141413] mt-0.5">
                      {phone.specs.displaySize} {phone.specs.displayTech}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6E6D68]">Luminance & Refresh</p>
                    <p className="font-medium text-[#141413] font-mono-tabular mt-0.5">
                      {phone.specs.peakBrightness} · {phone.specs.refreshRate}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6E6D68]">Silicon & Memory</p>
                    <p className="font-medium text-[#141413] mt-0.5">
                      {phone.specs.processor} · {phone.specs.ram}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6E6D68]">Primary Optics</p>
                    <p className="font-medium text-[#141413] mt-0.5">
                      {phone.specs.mainCamera}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6E6D68]">Telephoto Array</p>
                    <p className="font-medium text-[#141413] mt-0.5">
                      {phone.specs.telephotoCamera}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6E6D68]">Power & Charging</p>
                    <p className="font-medium text-[#141413] font-mono-tabular mt-0.5">
                      {phone.specs.batteryMah} · {phone.specs.chargingWatts}
                    </p>
                  </div>
                </div>
              </div>

              {/* Included in the Box */}
              <div className="pt-4 border-t border-black/8">
                <h3 className="text-sm font-semibold text-[#141413] mb-2">
                  Included in the Factory Case
                </h3>
                <p className="text-xs text-[#575653] leading-relaxed">
                  {phone.boxContents.join(' · ')}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-black/8 pt-6 lg:pt-0 lg:pl-8">
            <div className="space-y-6">
              {/* Quiet Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs text-[#6E6D68]">
                <span>{phone.series}</span>
                <span aria-hidden="true">·</span>
                <span>{phone.stockStatus}</span>
                <span aria-hidden="true">·</span>
                <span>{phone.dispatchTime}</span>
              </div>

              {/* Title & Live Price Block */}
              <div>
                <h2
                  id="pdp-title"
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141413] font-display"
                >
                  {phone.name}
                </h2>
                <p className="text-sm text-[#575653] mt-2 leading-relaxed">
                  {phone.description}
                </p>

                <div className="mt-4 pt-4 border-t border-black/8 flex items-baseline justify-between">
                  <div>
                    {appliedTradeIn ? (
                      <div className="space-y-0.5">
                        <div className="flex items-baseline gap-2.5">
                          <span className="text-2xl font-bold font-mono-tabular text-[#141413]">
                            {formatINR(netAfterTradeIn)}
                          </span>
                          <span className="text-sm line-through text-[#6E6D68] font-mono-tabular">
                            {formatINR(grossUnitPrice)}
                          </span>
                        </div>
                        <p className="text-xs text-[#155E3B] font-medium">
                          Includes -{formatINR(appliedTradeIn.creditAmount)} trade-in credit (
                          {appliedTradeIn.model})
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <span className="text-2xl font-bold font-mono-tabular text-[#141413]">
                          {formatINR(grossUnitPrice)}
                        </span>
                        <p className="text-xs text-[#6E6D68] font-mono-tabular">
                          Or {formatINR(monthlyPrice)}/mo for 24 mo No-Cost EMI
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={onOpenTradeIn}
                    className="text-xs font-medium underline underline-offset-4 text-[#141413] hover:text-[#575653] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {appliedTradeIn ? 'Edit Trade-In' : 'Estimate Trade-In Credit'}
                  </button>
                </div>
              </div>

              {/* Step 1: Finish Selector */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#141413]">
                    01. Select Chassis Finish
                  </span>
                  <span className="text-[#575653]">{selectedFinish.name}</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {phone.finishes.map((finish) => {
                    const active = finish.id === selectedFinish.id;
                    return (
                      <button
                        key={finish.id}
                        type="button"
                        onClick={() => setSelectedFinish(finish)}
                        className={`flex items-center justify-between p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                          active
                            ? 'border-[#141413] bg-[#F2F1ED]'
                            : 'border-black/10 hover:border-black/25 bg-[#FBFBF9]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-5 h-5 rounded-full shrink-0 border border-black/20"
                            style={{ backgroundColor: finish.hex }}
                          />
                          <div>
                            <p className="text-xs font-semibold text-[#141413]">
                              {finish.name}
                            </p>
                            <p className="text-[11px] text-[#6E6D68]">
                              {finish.materialNote}
                            </p>
                          </div>
                        </div>
                        {active && <Check className="w-4 h-4 text-[#141413] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Storage Capacity Selector */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#141413]">
                    02. Select NVMe Flash Storage
                  </span>
                  <span className="text-[#6E6D68] font-mono-tabular">UFS 4.0 Architecture</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {phone.storageOptions.map((option) => {
                    const active = option.capacity === selectedStorage.capacity;
                    const tierPrice = phone.basePrice + option.priceDelta;
                    return (
                      <button
                        key={option.capacity}
                        type="button"
                        onClick={() => setSelectedStorage(option)}
                        className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                          active
                            ? 'border-[#141413] bg-[#141413] text-[#FBFBF9]'
                            : 'border-black/12 bg-[#FBFBF9] text-[#141413] hover:border-black/30'
                        }`}
                      >
                        <p className="text-sm font-semibold font-mono-tabular whitespace-nowrap">
                          {option.capacity}
                        </p>
                        <p
                          className={`text-xs font-mono-tabular mt-1 ${
                            active ? 'text-white/80' : 'text-[#6E6D68]'
                          }`}
                        >
                          {formatINR(tierPrice)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Carrier / Band Provisioning */}
              <div className="space-y-2.5">
                <span className="block text-xs font-semibold text-[#141413]">
                  03. Band & SIM Provisioning
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {(
                    ['Unlocked SIM-Free', 'Global Enterprise eSIM'] as const
                  ).map((mode) => {
                    const active = connectivity === mode;
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setConnectivity(mode)}
                        className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                          active
                            ? 'border-[#141413] bg-[#F2F1ED]'
                            : 'border-black/12 bg-[#FBFBF9] hover:border-black/30'
                        }`}
                      >
                        <p className="text-xs font-semibold text-[#141413] truncate">
                          {mode}
                        </p>
                        <p className="text-[11px] text-[#6E6D68] font-mono-tabular mt-0.5">
                          {mode === 'Unlocked SIM-Free'
                            ? 'Included · All 5G Carriers'
                            : `+${formatINR(3500)} · Global Roaming`}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: VantageCare+ Coverage */}
              <div className="space-y-2.5">
                <span className="block text-xs font-semibold text-[#141413]">
                  04. Hardware Protection Plan
                </span>
                <button
                  type="button"
                  onClick={() => setVantageCare(!vantageCare)}
                  className={`w-full p-3.5 rounded-lg border text-left flex items-start justify-between gap-3 transition-colors cursor-pointer ${
                    vantageCare
                      ? 'border-[#141413] bg-[#F2F1ED]'
                      : 'border-black/12 bg-[#FBFBF9] hover:border-black/30'
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold text-[#141413]">
                      VantageCare+ Sapphire & Chassis Protection (3 Years)
                    </p>
                    <p className="text-[11px] text-[#6E6D68] mt-0.5">
                      Zero-deductible sapphire glass replacement and express 24h courier swap.
                    </p>
                  </div>
                  <span className="text-xs font-semibold font-mono-tabular shrink-0 text-[#141413]">
                    {vantageCare ? `Added (+${formatINR(11999)})` : `+${formatINR(11999)}`}
                  </span>
                </button>
              </div>

              {/* Step 5: Payment Preference */}
              <div className="space-y-2.5">
                <span className="block text-xs font-semibold text-[#141413]">
                  05. Payment Structure
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('full')}
                    className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                      paymentMode === 'full'
                        ? 'border-[#141413] bg-[#F2F1ED]'
                        : 'border-black/12 bg-[#FBFBF9] hover:border-black/30'
                    }`}
                  >
                    <p className="text-xs font-semibold text-[#141413]">Pay in Full</p>
                    <p className="text-xs font-mono-tabular text-[#575653] mt-0.5">
                      {formatINR(netAfterTradeIn)} one-time
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('monthly')}
                    className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                      paymentMode === 'monthly'
                        ? 'border-[#141413] bg-[#F2F1ED]'
                        : 'border-black/12 bg-[#FBFBF9] hover:border-black/30'
                    }`}
                  >
                    <p className="text-xs font-semibold text-[#141413]">24-Month No-Cost EMI</p>
                    <p className="text-xs font-mono-tabular text-[#575653] mt-0.5">
                      {formatINR(monthlyPrice)}/mo · ₹0 down
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Primary Action Area */}
            <div className="mt-8 pt-6 border-t border-black/10 space-y-4">
              <button
                type="button"
                onClick={handleConfirmAdd}
                className="w-full py-3.5 px-6 rounded-lg bg-[#141413] text-[#FBFBF9] text-sm font-semibold hover:bg-[#292927] transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Configuration Added to Bag</span>
                  </>
                ) : (
                  <span>
                    Add to Bag —{' '}
                    {paymentMode === 'full'
                      ? formatINR(netAfterTradeIn)
                      : `${formatINR(monthlyPrice)}/mo`}
                  </span>
                )}
              </button>

              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-[#6E6D68]">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 shrink-0 text-[#141413]" />
                  <span className="truncate">Free Insured Courier</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 shrink-0 text-[#141413]" />
                  <span className="truncate">30-Day Field Trial</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 shrink-0 text-[#141413]" />
                  <span className="truncate">COD Supported</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
