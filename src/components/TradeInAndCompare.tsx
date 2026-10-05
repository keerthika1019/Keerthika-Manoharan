import React, { useState } from 'react';
import { Check, RefreshCw, X } from 'lucide-react';
import {
  PhoneProduct,
  TRADE_IN_MODELS,
  AppliedTradeIn,
} from '../data/phones';
import { SmartImage } from './SmartImage';

interface TradeInModalProps {
  isOpen: boolean;
  onClose: () => void;
  appliedTradeIn: AppliedTradeIn | null;
  onApplyTradeIn: (tradeIn: AppliedTradeIn | null) => void;
}

export const TradeInEstimatorModal: React.FC<TradeInModalProps> = ({
  isOpen,
  onClose,
  appliedTradeIn,
  onApplyTradeIn,
}) => {
  const brands = ['Apple', 'Samsung', 'Google', 'Vantage'] as const;
  const [selectedBrand, setSelectedBrand] = useState<(typeof brands)[number]>(
    (appliedTradeIn?.brand as (typeof brands)[number]) || 'Apple'
  );

  const modelsForBrand = TRADE_IN_MODELS.filter((m) => m.brand === selectedBrand);
  const [selectedModelName, setSelectedModelName] = useState<string>(
    appliedTradeIn?.model || modelsForBrand[0].model
  );
  const [selectedStorage, setSelectedStorage] = useState<'128 GB' | '256 GB' | '512 GB'>(
    appliedTradeIn?.storage || '256 GB'
  );
  const [screenIntact, setScreenIntact] = useState<boolean>(
    appliedTradeIn ? appliedTradeIn.screenIntact : true
  );
  const [bodyClean, setBodyClean] = useState<boolean>(
    appliedTradeIn ? appliedTradeIn.bodyClean : true
  );
  const [batteryHealthy, setBatteryHealthy] = useState<boolean>(
    appliedTradeIn ? appliedTradeIn.batteryHealthy : true
  );

  if (!isOpen) return null;

  const activeModelObj =
    TRADE_IN_MODELS.find((m) => m.model === selectedModelName) || modelsForBrand[0];

  const baseWithStorage =
    activeModelObj.baseValue + activeModelObj.storageMultipliers[selectedStorage];

  const screenDeduction = screenIntact ? 0 : Math.round(baseWithStorage * 0.35);
  const bodyDeduction = bodyClean ? 0 : Math.round(baseWithStorage * 0.15);
  const batteryDeduction = batteryHealthy ? 0 : 45;

  const estimatedCredit = Math.max(
    50,
    baseWithStorage - screenDeduction - bodyDeduction - batteryDeduction
  );

  const handleBrandChange = (brand: (typeof brands)[number]) => {
    setSelectedBrand(brand);
    const firstModel = TRADE_IN_MODELS.find((m) => m.brand === brand);
    if (firstModel) {
      setSelectedModelName(firstModel.model);
    }
  };

  const handleApply = () => {
    onApplyTradeIn({
      brand: selectedBrand,
      model: activeModelObj.model,
      storage: selectedStorage,
      screenIntact,
      bodyClean,
      batteryHealthy,
      creditAmount: estimatedCredit,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tradein-modal-title"
    >
      <div className="w-full max-w-2xl bg-[#FBFBF9] text-[#141413] rounded-2xl border border-black/10 shadow-2xl overflow-hidden my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/8">
          <div>
            <h2
              id="tradein-modal-title"
              className="text-lg font-bold tracking-tight font-display"
            >
              Hardware Trade-In Valuation
            </h2>
            <p className="text-xs text-[#6E6D68]">
              Instant credit applied directly at checkout · Insured return kit included
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close trade-in estimator"
            className="p-2 rounded-lg text-[#575653] hover:text-[#141413] hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Step 1: Brand Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#141413]">
              01. Current Manufacturer
            </label>
            <div className="grid grid-cols-4 gap-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => handleBrandChange(brand)}
                  className={`py-2.5 px-3 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap cursor-pointer ${
                    selectedBrand === brand
                      ? 'bg-[#141413] text-[#FBFBF9] border-[#141413]'
                      : 'bg-[#FBFBF9] text-[#141413] border-black/12 hover:border-black/30'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Model & Storage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="tradein-model-select"
                className="block text-xs font-semibold text-[#141413]"
              >
                02. Device Model
              </label>
              <select
                id="tradein-model-select"
                value={activeModelObj.model}
                onChange={(e) => setSelectedModelName(e.target.value)}
                className="w-full rounded-lg border border-black/15 bg-[#FBFBF9] px-3 py-2.5 text-xs font-medium text-[#141413] focus:outline-none focus:border-[#141413]"
              >
                {modelsForBrand.map((m) => (
                  <option key={m.model} value={m.model}>
                    {m.model} (Up to ${m.baseValue + m.storageMultipliers['512 GB']})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-semibold text-[#141413]">
                03. Storage Capacity
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['128 GB', '256 GB', '512 GB'] as const).map((cap) => (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => setSelectedStorage(cap)}
                    className={`py-2.5 px-2 rounded-lg text-xs font-mono-tabular font-medium border transition-colors whitespace-nowrap cursor-pointer ${
                      selectedStorage === cap
                        ? 'bg-[#141413] text-[#FBFBF9] border-[#141413]'
                        : 'bg-[#FBFBF9] text-[#141413] border-black/12 hover:border-black/30'
                    }`}
                  >
                    {cap}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Condition Checklist */}
          <div className="space-y-2.5">
            <span className="block text-xs font-semibold text-[#141413]">
              04. Physical & Optical Inspection
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setScreenIntact(!screenIntact)}
                className={`flex items-center justify-between p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  screenIntact
                    ? 'border-[#141413] bg-[#F2F1ED]'
                    : 'border-black/12 bg-[#FBFBF9]'
                }`}
              >
                <div>
                  <p className="text-xs font-semibold text-[#141413]">
                    Display & OLED Panel Intact
                  </p>
                  <p className="text-[11px] text-[#6E6D68]">
                    Free of cracks, deep gouges, or pixel burn-in
                  </p>
                </div>
                <span className="text-xs font-mono-tabular font-medium text-[#141413]">
                  {screenIntact ? 'Verified ✓' : `-$${screenDeduction}`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBodyClean(!bodyClean)}
                className={`flex items-center justify-between p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  bodyClean
                    ? 'border-[#141413] bg-[#F2F1ED]'
                    : 'border-black/12 bg-[#FBFBF9]'
                }`}
              >
                <div>
                  <p className="text-xs font-semibold text-[#141413]">
                    Chassis & Rear Camera Glass Clean
                  </p>
                  <p className="text-[11px] text-[#6E6D68]">
                    No structural bends or cracked camera lenses
                  </p>
                </div>
                <span className="text-xs font-mono-tabular font-medium text-[#141413]">
                  {bodyClean ? 'Verified ✓' : `-$${bodyDeduction}`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBatteryHealthy(!batteryHealthy)}
                className={`flex items-center justify-between p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  batteryHealthy
                    ? 'border-[#141413] bg-[#F2F1ED]'
                    : 'border-black/12 bg-[#FBFBF9]'
                }`}
              >
                <div>
                  <p className="text-xs font-semibold text-[#141413]">
                    Battery Maximum Capacity ≥ 80%
                  </p>
                  <p className="text-[11px] text-[#6E6D68]">
                    Holds normal charge without service warning
                  </p>
                </div>
                <span className="text-xs font-mono-tabular font-medium text-[#141413]">
                  {batteryHealthy ? 'Verified ✓' : `-$${batteryDeduction}`}
                </span>
              </button>
            </div>
          </div>

          {/* Valuation Summary Box */}
          <div className="p-4 rounded-xl bg-[#F2F1ED] border border-black/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#6E6D68]">
                Guaranteed 14-Day Lock · {activeModelObj.model} ({selectedStorage})
              </p>
              <p className="text-2xl font-bold font-mono-tabular text-[#141413] mt-0.5">
                ${estimatedCredit.toLocaleString()} Instant Credit
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {appliedTradeIn && (
                <button
                  type="button"
                  onClick={() => {
                    onApplyTradeIn(null);
                    onClose();
                  }}
                  className="px-3.5 py-2.5 rounded-lg border border-black/15 text-xs font-medium text-[#575653] hover:text-[#141413] transition-colors whitespace-nowrap cursor-pointer"
                >
                  Remove Trade-In
                </button>
              )}
              <button
                type="button"
                onClick={handleApply}
                className="px-5 py-2.5 rounded-lg bg-[#141413] text-[#FBFBF9] text-xs font-semibold hover:bg-[#292927] transition-colors whitespace-nowrap cursor-pointer"
              >
                Apply ${estimatedCredit} Credit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ComparisonMatrixSectionProps {
  phones: PhoneProduct[];
  comparedIds: string[];
  onChangeSlot: (slotIndex: number, phoneId: string) => void;
  onSelectPhoneForPdp: (phone: PhoneProduct) => void;
  appliedTradeIn: AppliedTradeIn | null;
}

export const ComparisonMatrixSection: React.FC<ComparisonMatrixSectionProps> = ({
  phones,
  comparedIds,
  onChangeSlot,
  onSelectPhoneForPdp,
  appliedTradeIn,
}) => {
  const [highlightDiffOnly, setHighlightDiffOnly] = useState(false);

  const selectedPhones = comparedIds.map(
    (id) => phones.find((p) => p.id === id) || phones[0]
  );

  const specRows: {
    label: string;
    getValue: (p: PhoneProduct) => string;
  }[] = [
    {
      label: 'Starting Price',
      getValue: (p) =>
        appliedTradeIn
          ? `$${Math.max(0, p.basePrice - appliedTradeIn.creditAmount).toLocaleString()} (with trade-in)`
          : `$${p.basePrice.toLocaleString()}`,
    },
    { label: 'Display Diagonal', getValue: (p) => p.specs.displaySize },
    { label: 'Panel Architecture', getValue: (p) => p.specs.displayTech },
    {
      label: 'Peak Luminance & Refresh',
      getValue: (p) => `${p.specs.peakBrightness} · ${p.specs.refreshRate}`,
    },
    { label: 'System-on-Chip', getValue: (p) => p.specs.processor },
    { label: 'Memory (RAM)', getValue: (p) => p.specs.ram },
    { label: 'Primary Camera', getValue: (p) => p.specs.mainCamera },
    { label: 'Telephoto Optics', getValue: (p) => p.specs.telephotoCamera },
    { label: 'Ultra-Wide Optics', getValue: (p) => p.specs.ultrawideCamera },
    { label: 'Battery Chemistry', getValue: (p) => p.specs.batteryMah },
    { label: 'Power Delivery', getValue: (p) => p.specs.chargingWatts },
    { label: 'Chassis Material', getValue: (p) => p.specs.chassisMaterial },
    {
      label: 'Dimensions & Mass',
      getValue: (p) => `${p.specs.dimensionsMm} · ${p.specs.weightGrams} g`,
    },
    { label: 'Modular Repairability', getValue: (p) => p.specs.repairabilityScore },
  ];

  const visibleRows = specRows.filter((row) => {
    if (!highlightDiffOnly) return true;
    const values = selectedPhones.map((p) => row.getValue(p));
    return new Set(values).size > 1;
  });

  return (
    <section
      id="compare-specs"
      className="py-20 border-t border-black/8 max-w-[1200px] mx-auto px-6"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#6E6D68] mb-2">
            <span>Side-by-Side Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Laboratory Verified Specifications</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141413] font-display">
            Hardware Specification Matrix
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setHighlightDiffOnly(!highlightDiffOnly)}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap cursor-pointer ${
              highlightDiffOnly
                ? 'bg-[#141413] text-[#FBFBF9] border-[#141413]'
                : 'bg-[#FBFBF9] text-[#141413] border-black/15 hover:border-[#141413]'
            }`}
          >
            {highlightDiffOnly ? 'Showing Differences Only ✓' : 'Highlight Differences Only'}
          </button>
        </div>
      </div>

      {/* Model Selector Headers */}
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-4 gap-6 pb-6 border-b border-black/10">
            <div className="flex flex-col justify-end">
              <p className="text-xs font-semibold text-[#141413]">
                Select up to 3 Instruments
              </p>
              <p className="text-xs text-[#6E6D68] mt-1">
                All measurements follow ISO-2768 and CIE D65 optical standards.
              </p>
            </div>

            {selectedPhones.map((phone, idx) => (
              <div key={`${phone.id}-${idx}`} className="space-y-3">
                <select
                  aria-label={`Select phone ${idx + 1} to compare`}
                  value={phone.id}
                  onChange={(e) => onChangeSlot(idx, e.target.value)}
                  className="w-full rounded-lg border border-black/15 bg-[#FBFBF9] px-3 py-2 text-xs font-semibold text-[#141413] focus:outline-none focus:border-[#141413] cursor-pointer"
                >
                  {phones.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>

                <div className="aspect-4/3 rounded-lg overflow-hidden bg-[#F3F2EE] border border-black/6">
                  <SmartImage
                    src={phone.image}
                    alt={phone.name}
                    fallbackTitle={phone.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-semibold font-mono-tabular text-[#141413]">
                    ${phone.basePrice.toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectPhoneForPdp(phone)}
                    className="text-xs font-medium underline underline-offset-4 text-[#141413] hover:text-[#575653] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Configure →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tabular Specification Rows */}
          <div className="divide-y divide-black/8">
            {visibleRows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-4 gap-6 py-4 items-baseline text-xs hover:bg-[#F5F4F0]/60 transition-colors"
              >
                <div className="font-medium text-[#6E6D68]">{row.label}</div>
                {selectedPhones.map((phone, idx) => (
                  <div
                    key={`${phone.id}-${row.label}-${idx}`}
                    className="font-medium text-[#141413] font-mono-tabular"
                  >
                    {row.getValue(phone)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
