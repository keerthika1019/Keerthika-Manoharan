import React, { useState } from 'react';
import { PhoneProduct } from '../data/phones';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  accentHex?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle = 'Vantage Hardware',
  accentHex = '#C4BFB6',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-[#F2F1ED] text-[#141413] p-6 select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          className="w-28 h-28 text-[#141413]/75 mb-3"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="32"
            y="12"
            width="56"
            height="96"
            rx="10"
            stroke="currentColor"
            strokeWidth="2"
            fill={accentHex}
            fillOpacity="0.2"
          />
          <circle cx="48" cy="30" r="7" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="48" cy="48" r="7" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="66" cy="39" r="5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="50" y1="100" x2="70" y2="100" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span className="text-xs font-medium tracking-tight text-[#575653] text-center">
          {fallbackTitle}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};

interface HardwareBlueprintProps {
  phone: PhoneProduct;
  mode: 'cad' | 'dimensions';
  selectedFinishHex: string;
}

export const HardwareBlueprintCanvas: React.FC<HardwareBlueprintProps> = ({
  phone,
  mode,
  selectedFinishHex,
}) => {
  const isFold = phone.category === 'fold';

  if (mode === 'cad') {
    return (
      <div className="w-full h-full min-h-[360px] bg-[#141413] text-[#FBFBF9] p-6 flex flex-col justify-between rounded-xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs text-[#A3A19A]">
          <span>Internal Architecture · {phone.name}</span>
          <span className="font-mono-tabular">SCALE 1:1 · REV 4.2</span>
        </div>

        <div className="my-auto py-6 flex flex-col md:flex-row items-center justify-around gap-6">
          <svg
            viewBox="0 0 260 320"
            className="w-56 h-64 shrink-0"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Grid lines */}
            <path
              d="M0 40H260M0 100H260M0 160H260M0 220H260M0 280H260M50 0V320M130 0V320M210 0V320"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
            {/* Chassis Outline */}
            <rect
              x={isFold ? '30' : '55'}
              y="16"
              width={isFold ? '200' : '150'}
              height="288"
              rx="22"
              stroke={selectedFinishHex}
              strokeWidth="2.5"
              fill="rgba(255,255,255,0.02)"
            />
            {/* Optical Array Cutout */}
            <rect
              x={isFold ? '46' : '70'}
              y="32"
              width="74"
              height="82"
              rx="12"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1.5"
            />
            <circle cx={isFold ? '68' : '92'} cy="54" r="14" stroke="#E5E0D5" strokeWidth="1.5" />
            <circle cx={isFold ? '68' : '92'} cy="90" r="14" stroke="#E5E0D5" strokeWidth="1.5" />
            <rect
              x={isFold ? '92' : '116'}
              y="44"
              width="18"
              height="28"
              rx="4"
              stroke="#C8B59E"
              strokeWidth="1.5"
            />
            {/* Silicon Logic Board */}
            <rect
              x={isFold ? '132' : '150'}
              y="38"
              width="42"
              height="70"
              rx="4"
              stroke="rgba(255,255,255,0.35)"
              strokeDasharray="3 3"
              strokeWidth="1.2"
            />
            {/* Qi2 Magnetic Coil & Silicon-Carbon Battery */}
            <circle
              cx="130"
              cy="192"
              r="44"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              strokeDasharray="6 3"
            />
            <circle cx="130" cy="192" r="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            {/* Taptic & USB-C Port Assembly */}
            <rect
              x="92"
              y="262"
              width="76"
              height="24"
              rx="4"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="1.2"
            />
          </svg>

          <div className="space-y-3 text-xs max-w-xs">
            <div className="border-l-2 border-[#C8B59E] pl-3">
              <p className="text-[#A3A19A]">Optical Assembly</p>
              <p className="font-medium text-[#FBFBF9] mt-0.5">{phone.specs.mainCamera}</p>
              <p className="text-[#A3A19A] mt-0.5">{phone.specs.telephotoCamera}</p>
            </div>
            <div className="border-l-2 border-white/30 pl-3">
              <p className="text-[#A3A19A]">Silicon & Thermal Core</p>
              <p className="font-medium text-[#FBFBF9] mt-0.5">
                {phone.specs.processor} · {phone.specs.ram}
              </p>
            </div>
            <div className="border-l-2 border-white/30 pl-3">
              <p className="text-[#A3A19A]">Energy & Serviceability</p>
              <p className="font-medium text-[#FBFBF9] mt-0.5">{phone.specs.batteryMah}</p>
              <p className="text-[#A3A19A] mt-0.5">Repairability: {phone.specs.repairabilityScore}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-[#A3A19A] font-mono-tabular">
          <span>CHASSIS: {phone.specs.chassisMaterial}</span>
          <span>PROTECTION: {phone.specs.ipRating}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[360px] bg-[#F2F1ED] text-[#141413] p-6 flex flex-col justify-between rounded-xl border border-black/8">
      <div className="flex items-center justify-between border-b border-black/8 pb-3 text-xs text-[#6E6D68]">
        <span>Dimensional Elevation · {phone.name}</span>
        <span className="font-mono-tabular">UNITS: MILLIMETERS / GRAMS</span>
      </div>

      <div className="my-auto py-6 flex flex-col items-center justify-center">
        <svg
          viewBox="0 0 320 220"
          className="w-full max-w-sm h-48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Front View */}
          <rect
            x="60"
            y="20"
            width="92"
            height="180"
            rx="14"
            stroke="#141413"
            strokeWidth="2"
            fill="#FBFBF9"
          />
          <circle cx="106" cy="30" r="3" fill="#141413" />
          {/* Height dimension line */}
          <line x1="38" y1="20" x2="38" y2="200" stroke="#6E6D68" strokeWidth="1" />
          <line x1="32" y1="20" x2="44" y2="20" stroke="#6E6D68" strokeWidth="1" />
          <line x1="32" y1="200" x2="44" y2="200" stroke="#6E6D68" strokeWidth="1" />
          {/* Width dimension line */}
          <line x1="60" y1="212" x2="152" y2="212" stroke="#6E6D68" strokeWidth="1" />
          {/* Side Profile */}
          <rect
            x="215"
            y="20"
            width="14"
            height="180"
            rx="5"
            stroke="#141413"
            strokeWidth="2"
            fill={selectedFinishHex}
          />
          {/* Camera bump profile */}
          <rect x="229" y="34" width="5" height="44" rx="2" fill="#141413" />
        </svg>

        <div className="grid grid-cols-3 gap-6 w-full max-w-md mt-4 pt-4 border-t border-black/8 text-center">
          <div>
            <p className="text-xs text-[#6E6D68]">Footprint</p>
            <p className="text-sm font-semibold font-mono-tabular mt-0.5">
              {phone.specs.dimensionsMm}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#6E6D68]">Total Mass</p>
            <p className="text-sm font-semibold font-mono-tabular mt-0.5">
              {phone.specs.weightGrams} g
            </p>
          </div>
          <div>
            <p className="text-xs text-[#6E6D68]">Display Diagonal</p>
            <p className="text-sm font-semibold font-mono-tabular mt-0.5">
              {phone.specs.displaySize}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-black/8 pt-3 text-xs text-[#6E6D68]">
        <span>Tolerance ±0.02 mm CNC Inspection</span>
        <span className="font-mono-tabular">ISO-2768-f</span>
      </div>
    </div>
  );
};
