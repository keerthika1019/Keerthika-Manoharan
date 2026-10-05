import heroTitaniumImg from '../assets/images/hero_flagship_titanium_phone_1791194367499.jpg';
import phoneObsidianImg from '../assets/images/phone_pro_obsidian_1791194383302.jpg';
import phoneFoldSilverImg from '../assets/images/phone_fold_silver_1791194394606.jpg';
import phoneCompactCeramicImg from '../assets/images/phone_compact_ceramic_1791194408140.jpg';
import phoneUltraDesertImg from '../assets/images/phone_ultra_desert_titanium_1791194419207.jpg';

export interface ColorFinish {
  id: string;
  name: string;
  hex: string;
  ringHex: string;
  materialNote: string;
  imageOverride?: string;
}

export interface StorageOption {
  capacity: '256 GB' | '512 GB' | '1 TB';
  priceDelta: number;
}

export interface PhoneProduct {
  id: string;
  name: string;
  series: string;
  category: 'pro' | 'fold' | 'compact';
  tagline: string;
  description: string;
  basePrice: number;
  stockStatus: 'In Stock' | 'Limited Allocation';
  dispatchTime: string;
  image: string;
  finishes: ColorFinish[];
  storageOptions: StorageOption[];
  specs: {
    displaySize: string;
    displayTech: string;
    peakBrightness: string;
    refreshRate: string;
    processor: string;
    ram: string;
    mainCamera: string;
    telephotoCamera: string;
    ultrawideCamera: string;
    batteryMah: string;
    chargingWatts: string;
    chassisMaterial: string;
    ipRating: string;
    dimensionsMm: string;
    weightGrams: number;
    repairabilityScore: string;
  };
  boxContents: string[];
}

export interface TradeInDeviceModel {
  brand: 'Apple' | 'Samsung' | 'Google' | 'Vantage';
  model: string;
  baseValue: number;
  storageMultipliers: Record<'128 GB' | '256 GB' | '512 GB', number>;
}

export interface AppliedTradeIn {
  brand: string;
  model: string;
  storage: '128 GB' | '256 GB' | '512 GB';
  screenIntact: boolean;
  bodyClean: boolean;
  batteryHealthy: boolean;
  creditAmount: number;
}

export interface CartItem {
  cartItemId: string;
  phoneId: string;
  phoneName: string;
  series: string;
  image: string;
  finish: ColorFinish;
  storage: StorageOption;
  connectivity: 'Unlocked SIM-Free' | 'Global Enterprise eSIM';
  vantageCare: boolean;
  paymentMode: 'full' | 'monthly';
  unitPrice: number;
  quantity: number;
}

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  paymentMethod: 'Card' | 'Monthly 0% APR' | 'Cash on Delivery (COD)';
  items: CartItem[];
  subtotal: number;
  tradeInCredit: number;
  tradeInDetails?: AppliedTradeIn | null;
  shippingCost: number;
  totalAmount: number;
  status: 'Confirmed — Preparing Shipment' | 'Optical Calibration Complete' | 'Dispatched via Insured Courier';
}

export const HERO_IMAGE = heroTitaniumImg;

export const PHONES: PhoneProduct[] = [
  {
    id: 'vantage-01-pro-titanium',
    name: 'Vantage 01 Pro Titanium',
    series: 'Pro Series',
    category: 'pro',
    tagline: 'CNC-milled Grade-5 titanium chassis with 5x tetraprism sapphire optics.',
    description:
      'Engineered from a single billet of aerospace Grade-5 titanium bonded to an internal copper-graphite thermal core. Features a 1-inch main optical sensor with custom fluorite glass elements and 2,800-nit LTPO reference display.',
    basePrice: 1099,
    stockStatus: 'In Stock',
    dispatchTime: 'Dispatches within 24 hours',
    image: heroTitaniumImg,
    finishes: [
      {
        id: 'raw-titanium',
        name: 'Raw Natural Titanium',
        hex: '#C4BFB6',
        ringHex: '#9E988E',
        materialNote: ' Bead-blasted raw Grade-5 titanium with clear PVD seal',
        imageOverride: heroTitaniumImg,
      },
      {
        id: 'obsidian-black',
        name: 'Obsidian Anodized',
        hex: '#222224',
        ringHex: '#3A3A3D',
        materialNote: 'Deep vapor-deposited carbon titanium finish',
        imageOverride: phoneObsidianImg,
      },
      {
        id: 'desert-bronze',
        name: 'Warm Travertine Titanium',
        hex: '#C8B59E',
        ringHex: '#A69076',
        materialNote: 'Warm mineral-toned satin titanium rail',
        imageOverride: phoneUltraDesertImg,
      },
    ],
    storageOptions: [
      { capacity: '256 GB', priceDelta: 0 },
      { capacity: '512 GB', priceDelta: 150 },
      { capacity: '1 TB', priceDelta: 350 },
    ],
    specs: {
      displaySize: '6.8"',
      displayTech: 'LTPO AMOLED Reference Panel',
      peakBrightness: '2,800 nits',
      refreshRate: '1–120 Hz Adaptive',
      processor: 'Vantage Silicon V9 Pro (3nm)',
      ram: '16 GB LPDDR5X',
      mainCamera: '50 MP 1.0" Sensor, f/1.6 OIS',
      telephotoCamera: '50 MP 5x Periscope, 120mm f/2.6',
      ultrawideCamera: '48 MP 14mm f/1.8 Macro',
      batteryMah: '5,400 mAh Silicon-Carbon',
      chargingWatts: '80W Wired · 50W Qi2 Magnetic',
      chassisMaterial: 'Grade-5 Titanium & Ceramic Shield',
      ipRating: 'IP68 (6m / 30 min)',
      dimensionsMm: '162.3 × 76.8 × 8.2 mm',
      weightGrams: 219,
      repairabilityScore: '8.9 / 10 Modular Torx Architecture',
    },
    boxContents: [
      'Vantage 01 Pro Titanium Smartphone',
      'Braided 2m USB-C 240W Coaxial Cable',
      'Machined Stainless SIM Ejector Pin',
      'Factory Color Calibration Certificate',
    ],
  },
  {
    id: 'vantage-01-obsidian-stealth',
    name: 'Vantage 01 Darkroom Edition',
    series: 'Pro Series',
    category: 'pro',
    tagline: 'Co-engineered for mobile cinematography with hardware LUT pipeline and matte anti-glare back.',
    description:
      'Designed for field photographers and cinematographers. Features a micro-etched obsidian glass back, dedicated two-stage mechanical shutter button on the lower rail, and uncompressed 14-bit RAW capture across all three focal lengths.',
    basePrice: 1199,
    stockStatus: 'In Stock',
    dispatchTime: 'Dispatches within 24 hours',
    image: phoneObsidianImg,
    finishes: [
      {
        id: 'obsidian-matte',
        name: 'Stealth Obsidian',
        hex: '#1C1C1E',
        ringHex: '#333336',
        materialNote: 'Micro-etched matte volcanic glass & dark titanium',
        imageOverride: phoneObsidianImg,
      },
      {
        id: 'graphite-ash',
        name: 'Graphite Slate',
        hex: '#4A4B4E',
        ringHex: '#2F3033',
        materialNote: 'Brushed dark gunmetal titanium frame',
      },
    ],
    storageOptions: [
      { capacity: '256 GB', priceDelta: 0 },
      { capacity: '512 GB', priceDelta: 150 },
      { capacity: '1 TB', priceDelta: 350 },
    ],
    specs: {
      displaySize: '6.7"',
      displayTech: 'Calibrated D65 OLED Panel',
      peakBrightness: '2,600 nits',
      refreshRate: '1–120 Hz Adaptive',
      processor: 'Vantage Silicon V9 Pro + ISP-X',
      ram: '16 GB LPDDR5X',
      mainCamera: '50 MP Variable Aperture f/1.4–f/4.0',
      telephotoCamera: '64 MP 3.5x Portrait + 7x Optical Crop',
      ultrawideCamera: '50 MP Rectilinear 15mm f/2.0',
      batteryMah: '5,300 mAh Silicon-Carbon',
      chargingWatts: '80W Wired · 50W Qi2 Magnetic',
      chassisMaterial: 'PVD Dark Titanium & Matte Gorilla Armor',
      ipRating: 'IP68 (6m / 30 min)',
      dimensionsMm: '160.8 × 75.4 × 8.4 mm',
      weightGrams: 214,
      repairabilityScore: '9.0 / 10 Quick-Release Battery Pull',
    },
    boxContents: [
      'Vantage 01 Darkroom Edition',
      'Anodized Filter Thread Adapter Ring (52mm)',
      'Braided 2m USB 4.0 High-Speed Data Cable',
      'Individual Sensor Dark-Frame Calibration Report',
    ],
  },
  {
    id: 'vantage-horizon-fold',
    name: 'Vantage Horizon Fold',
    series: 'Foldable Architecture',
    category: 'fold',
    tagline: '9.2mm folded profile with zero-gap liquid-metal micro-hinge and dual 120Hz LTPO displays.',
    description:
      'Redefining spatial computing in the pocket. At just 4.5mm unfolded, the Horizon Fold combines a standard 21:9 cover screen with an expansive 8.0-inch anti-reflective inner canvas rated for 500,000 articulation cycles.',
    basePrice: 1599,
    stockStatus: 'Limited Allocation',
    dispatchTime: 'Dispatches in 2–3 business days',
    image: phoneFoldSilverImg,
    finishes: [
      {
        id: 'platinum-silver',
        name: 'Brushed Silver Alloy',
        hex: '#D8D9DD',
        ringHex: '#A6A8AE',
        materialNote: 'Precision-machined zirconium liquid-metal hinge spine',
        imageOverride: phoneFoldSilverImg,
      },
      {
        id: 'carbon-titanium',
        name: 'Anthracite Weave',
        hex: '#2C2D30',
        ringHex: '#48494E',
        materialNote: 'Aerospace carbon-composite back plate for reduced mass',
      },
    ],
    storageOptions: [
      { capacity: '256 GB', priceDelta: 0 },
      { capacity: '512 GB', priceDelta: 150 },
      { capacity: '1 TB', priceDelta: 350 },
    ],
    specs: {
      displaySize: '8.0" Inner / 6.4" Cover',
      displayTech: 'Dual Ultra-Thin Glass LTPO OLED',
      peakBrightness: '2,500 nits',
      refreshRate: '1–120 Hz Both Screens',
      processor: 'Vantage Silicon V9Pro Dual-NPU',
      ram: '16 GB LPDDR5X',
      mainCamera: '50 MP Dual-Layer Transistor Sensor',
      telephotoCamera: '48 MP 3.2x Floating Telephoto OIS',
      ultrawideCamera: '48 MP 114° Ultra-Wide',
      batteryMah: '5,600 mAh Dual-Cell Silicon-Carbon',
      chargingWatts: '67W Wired · 50W Wireless',
      chassisMaterial: 'Zirconium Hinge & Grade-5 Titanium Frame',
      ipRating: 'IPX8 Water Resistant',
      dimensionsMm: '158.4 × 142.6 × 4.5 mm (Unfolded)',
      weightGrams: 229,
      repairabilityScore: '8.2 / 10 Modular Outer Screen Assembly',
    },
    boxContents: [
      'Vantage Horizon Fold Smartphone',
      'Aramid Fiber Snap-On Rear Shell',
      '80W GaN Dual-Port Compact Power Adapter',
      'Braided USB-C Cable',
    ],
  },
  {
    id: 'vantage-mono-compact',
    name: 'Vantage Mono 6.1 Ceramic',
    series: 'Compact & Acoustic',
    category: 'compact',
    tagline: 'One-handed 6.1-inch ergonomic form in warm zirconia ceramic with flush camera housing.',
    description:
      'Built for purists who value pocketable dimensions without flagship compromise. Features a kiln-fired micro-crystalline zirconia ceramic unibody that resists scratches without a case, paired with a dedicated balanced DAC for studio acoustics.',
    basePrice: 849,
    stockStatus: 'In Stock',
    dispatchTime: 'Dispatches within 24 hours',
    image: phoneCompactCeramicImg,
    finishes: [
      {
        id: 'chalk-ceramic',
        name: 'Warm Chalk Ceramic',
        hex: '#EFECE6',
        ringHex: '#C9C4BA',
        materialNote: 'Sintered zirconia ceramic back with champagne aluminum rail',
        imageOverride: phoneCompactCeramicImg,
      },
      {
        id: 'basalt-ceramic',
        name: 'Basalt Stone',
        hex: '#3A3937',
        ringHex: '#575552',
        materialNote: 'Matte mineral-finished dark ceramic unibody',
      },
    ],
    storageOptions: [
      { capacity: '256 GB', priceDelta: 0 },
      { capacity: '512 GB', priceDelta: 150 },
      { capacity: '1 TB', priceDelta: 350 },
    ],
    specs: {
      displaySize: '6.1"',
      displayTech: 'Flat LTPO OLED with 1.2mm Uniform Bezel',
      peakBrightness: '2,400 nits',
      refreshRate: '1–120 Hz Adaptive',
      processor: 'Vantage Silicon V9 Core',
      ram: '12 GB LPDDR5X',
      mainCamera: '50 MP 24mm f/1.7 OIS Flush Module',
      telephotoCamera: '50 MP 2.5x Optical Portrait Lens',
      ultrawideCamera: '12 MP 15mm Autofocus',
      batteryMah: '4,800 mAh High-Density Silicon Cell',
      chargingWatts: '65W Wired · 30W Qi2 Magnetic',
      chassisMaterial: 'Zirconia Ceramic & 7000-Series Aluminum',
      ipRating: 'IP68 (6m / 30 min)',
      dimensionsMm: '146.2 × 70.6 × 7.8 mm',
      weightGrams: 174,
      repairabilityScore: '9.2 / 10 Tool-Free Back Plate Access',
    },
    boxContents: [
      'Vantage Mono 6.1 Ceramic Smartphone',
      'USB-C to 3.5mm Reference DAC Adapter',
      'Braided 1.5m USB-C Cable',
      'Microfiber Polishing Cloth',
    ],
  },
  {
    id: 'vantage-ultra-optics',
    name: 'Vantage 01 Ultra Telephoto',
    series: 'Pro Series',
    category: 'pro',
    tagline: 'Continuous 85mm–170mm optical zoom lens with knurled focus control ring.',
    description:
      'Our pinnacle imaging instrument. Houses a true moving-element optical zoom periscope assembly alongside a 200MP apochromatic telephoto sensor and satellite emergency transceiver in a desert-sand titanium body.',
    basePrice: 1349,
    stockStatus: 'In Stock',
    dispatchTime: 'Dispatches within 24 hours',
    image: phoneUltraDesertImg,
    finishes: [
      {
        id: 'desert-titanium',
        name: 'Desert Sand Titanium',
        hex: '#C9B39B',
        ringHex: '#9E876E',
        materialNote: 'Knurled brass-accented camera bezel on Grade-5 titanium',
        imageOverride: phoneUltraDesertImg,
      },
      {
        id: 'natural-titanium',
        name: 'Raw Natural Titanium',
        hex: '#C4BFB6',
        ringHex: '#9E988E',
        materialNote: 'Machined raw titanium with sapphire crystal lens deck',
        imageOverride: heroTitaniumImg,
      },
      {
        id: 'obsidian-black',
        name: 'Obsidian Anodized',
        hex: '#222224',
        ringHex: '#3A3A3D',
        materialNote: 'Stealth anodized titanium with red focal index mark',
        imageOverride: phoneObsidianImg,
      },
    ],
    storageOptions: [
      { capacity: '256 GB', priceDelta: 0 },
      { capacity: '512 GB', priceDelta: 150 },
      { capacity: '1 TB', priceDelta: 350 },
    ],
    specs: {
      displaySize: '6.85"',
      displayTech: 'Micro-Lens Array LTPO OLED',
      peakBrightness: '3,000 nits',
      refreshRate: '1–120 Hz Adaptive',
      processor: 'Vantage Silicon V9 Ultra + Dual ISP',
      ram: '16 GB LPDDR5X',
      mainCamera: '50 MP 1.0" LYT-900 Sensor, Stepless Aperture',
      telephotoCamera: '200 MP Continuous 3.5x–7.1x Optical Zoom',
      ultrawideCamera: '50 MP 1/1.56" Free-Form Lens',
      batteryMah: '5,800 mAh Silicon-Carbon',
      chargingWatts: '90W Wired · 50W Qi2 Magnetic',
      chassisMaterial: 'Grade-5 Titanium & Sapphire Lens Deck',
      ipRating: 'IP68 / IP69 High-Pressure Jet',
      dimensionsMm: '163.6 × 77.2 × 8.8 mm',
      weightGrams: 232,
      repairabilityScore: '8.7 / 10 Modular Camera Deck',
    },
    boxContents: [
      'Vantage 01 Ultra Telephoto Smartphone',
      '90W GaN Fast Charger',
      'Braided 2m USB-C 10Gbps Data & Power Cable',
      'Machined Aluminum Lens Cap & Grip Mount',
    ],
  },
  {
    id: 'vantage-studio-acoustic',
    name: 'Vantage Acoustic Pure 6.3',
    series: 'Compact & Acoustic',
    category: 'compact',
    tagline: 'Dual ESS Sabre quad-DAC architecture with zero-PWM DC-dimmed OLED display.',
    description:
      'Engineered for audiophiles and flicker-sensitive readers. Combines a true hardware DC-dimmed 6.3-inch display with dedicated analog headphone circuitry, dual front-firing planar magnetic micro-speakers, and a tactile volume wheel.',
    basePrice: 929,
    stockStatus: 'In Stock',
    dispatchTime: 'Dispatches within 24 hours',
    image: phoneCompactCeramicImg,
    finishes: [
      {
        id: 'stone-ivory',
        name: 'Travertine Ivory',
        hex: '#EAE6DF',
        ringHex: '#B8B2A6',
        materialNote: 'Warm stone-textured ceramic with brass volume crown',
        imageOverride: phoneCompactCeramicImg,
      },
      {
        id: 'obsidian-black',
        name: 'Studio Matte Black',
        hex: '#202022',
        ringHex: '#3D3D40',
        materialNote: 'Anodized acoustic aluminum enclosure',
        imageOverride: phoneObsidianImg,
      },
    ],
    storageOptions: [
      { capacity: '256 GB', priceDelta: 0 },
      { capacity: '512 GB', priceDelta: 150 },
      { capacity: '1 TB', priceDelta: 350 },
    ],
    specs: {
      displaySize: '6.3"',
      displayTech: 'Zero-PWM Hardware DC-Dimmed OLED',
      peakBrightness: '2,400 nits',
      refreshRate: '1–120 Hz Adaptive',
      processor: 'Vantage Silicon V9 + Dual ESS 9281AC DAC',
      ram: '12 GB LPDDR5X',
      mainCamera: '50 MP 35mm Equivalent Street Optics f/1.6',
      telephotoCamera: '50 MP 85mm Portrait Telephoto f/2.0',
      ultrawideCamera: '48 MP 16mm Architectural Wide',
      batteryMah: '5,100 mAh Silicon-Carbon',
      chargingWatts: '65W Wired · 30W Qi2 Magnetic',
      chassisMaterial: 'CNC Acoustic Aluminum & Ceramic Back',
      ipRating: 'IP68 (6m / 30 min)',
      dimensionsMm: '151.4 × 71.9 × 8.1 mm',
      weightGrams: 189,
      repairabilityScore: '9.4 / 10 User-Accessible M.2 & Battery',
    },
    boxContents: [
      'Vantage Acoustic Pure 6.3 Smartphone',
      '4.4mm Balanced to USB-C Studio Interconnect',
      'Braided 1.5m Oxygen-Free Copper USB-C Cable',
      'Acoustic Frequency Response Chart',
    ],
  },
];

export const TRADE_IN_MODELS: TradeInDeviceModel[] = [
  {
    brand: 'Apple',
    model: 'iPhone 16 Pro Max',
    baseValue: 640,
    storageMultipliers: { '128 GB': 0, '256 GB': 40, '512 GB': 90 },
  },
  {
    brand: 'Apple',
    model: 'iPhone 16 Pro',
    baseValue: 550,
    storageMultipliers: { '128 GB': 0, '256 GB': 40, '512 GB': 80 },
  },
  {
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    baseValue: 490,
    storageMultipliers: { '128 GB': 0, '256 GB': 35, '512 GB': 70 },
  },
  {
    brand: 'Apple',
    model: 'iPhone 14 Pro',
    baseValue: 340,
    storageMultipliers: { '128 GB': 0, '256 GB': 30, '512 GB': 60 },
  },
  {
    brand: 'Samsung',
    model: 'Galaxy S25 Ultra',
    baseValue: 610,
    storageMultipliers: { '128 GB': 0, '256 GB': 45, '512 GB': 85 },
  },
  {
    brand: 'Samsung',
    model: 'Galaxy Z Fold 6',
    baseValue: 650,
    storageMultipliers: { '128 GB': 0, '256 GB': 50, '512 GB': 95 },
  },
  {
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    baseValue: 460,
    storageMultipliers: { '128 GB': 0, '256 GB': 35, '512 GB': 70 },
  },
  {
    brand: 'Google',
    model: 'Pixel 9 Pro XL',
    baseValue: 470,
    storageMultipliers: { '128 GB': 0, '256 GB': 35, '512 GB': 70 },
  },
  {
    brand: 'Google',
    model: 'Pixel 9 Pro Fold',
    baseValue: 580,
    storageMultipliers: { '128 GB': 0, '256 GB': 45, '512 GB': 85 },
  },
  {
    brand: 'Vantage',
    model: 'Vantage 00 Titanium (Gen 1)',
    baseValue: 520,
    storageMultipliers: { '128 GB': 0, '256 GB': 45, '512 GB': 90 },
  },
];

export const TESTIMONIALS = [
  {
    quote:
      'Before switching our field production crew to the Vantage 01 Darkroom Edition, we carried dedicated LUT monitors for B-cam location scouting. The calibrated D65 OLED and 14-bit uncompressed RAW across all three lenses cut our scouting kit weight by 3.4 kg while matching our cinema A-cam color science.',
    author: 'Marcus Lindqvist',
    role: 'Director of Photography',
    organization: 'Nordic Frame Studios, Stockholm',
    metric: '14-Bit RAW · 3.4 kg Kit Reduction',
  },
  {
    quote:
      'Most modern flagships glue the battery and display into an unserviceable sandwich. When our hardware lab tore down the Vantage 01 Pro Titanium, we replaced the battery cell and periscope camera assembly in under 11 minutes using a single T3 Torx driver.',
    author: 'Dr. Elena Rostova',
    role: 'Principal Reliability Engineer',
    organization: 'EuroTech Materials Testing Institute, Munich',
    metric: '11-Minute Modular Module Swap',
  },
  {
    quote:
      'After two years of eye strain from low-frequency PWM flicker on conventional OLED phones, the Vantage Acoustic Pure 6.3 with hardware DC dimming and balanced 4.4mm output completely eliminated my evening visual fatigue during long overseas flights.',
    author: 'Kenji Takahashi',
    role: 'Mastering Engineer',
    organization: 'Aoyama Acoustic Lab, Tokyo',
    metric: 'Zero-PWM DC Dimming · 128 dB DNR',
  },
];
