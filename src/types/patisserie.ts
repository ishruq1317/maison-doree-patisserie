export type Language = 'FR' | 'EN' | 'DE';
export type Currency = 'EUR' | 'GBP' | 'CHF';

export type Category = 'viennoiserie' | 'boulangerie' | 'patisserie';

export type BakeStatus = 
  | 'just-out'     // Just Out of the Oven — Warm
  | 'cooling'      // Cooling on Rack
  | 'in-deck'      // In Deck Oven — Ready at ...
  | 'limited'      // Limited Batch — X Left
  | 'sold-out';    // Sold Out for Today

export type AllergenTag = 
  | 'nut-free' 
  | 'vegetarian' 
  | 'vegan-sourdough' 
  | 'low-gluten';

export interface SensoryRadar {
  butterLamination: number; // 0 - 100
  sweetness: number;        // 0 - 100
  fruitAcidity: number;     // 0 - 100
  roastedPraline: number;   // 0 - 100
  crumbCrispness: number;   // 0 - 100
  fermentationDepth: number;// 0 - 100
}

export interface PastryItem {
  id: string;
  name: string;
  frenchTitle: string;
  category: Category;
  description: {
    FR: string;
    EN: string;
    DE: string;
  };
  priceEUR: number; // Base price in EUR
  image: string;
  imageAlt: string;
  badge?: string;
  status: BakeStatus;
  statusText: {
    FR: string;
    EN: string;
    DE: string;
  };
  readyTime?: string;
  stockLeft?: number;
  allergens: AllergenTag[];
  sensoryScores: SensoryRadar;
  pairingRecommendation: {
    FR: string;
    EN: string;
    DE: string;
  };
  craftDetails: {
    fermentationTime: string;
    flourHydration: string;
    deckTemperature: string;
    butterOrigin: string;
  };
}

export interface BoxTier {
  size: 6 | 12 | 24;
  label: string;
  discountPercent: number;
  badge: {
    FR: string;
    EN: string;
    DE: string;
  };
}

export interface BoxSelectionItem {
  pastryId: string;
  quantity: number;
}

export interface CartItem {
  id: string; // unique item id in cart
  pastryId?: string;
  name: string;
  priceEUR: number;
  quantity: number;
  isCustomBox?: boolean;
  boxSize?: 6 | 12 | 24;
  boxItems?: { pastryName: string; quantity: number }[];
  image: string;
}

export interface PickupWindow {
  id: string;
  timeRange: string;
  available: boolean;
  temperatureNote: {
    FR: string;
    EN: string;
    DE: string;
  };
}

export interface OrderCheckoutData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupWindow: string;
  giftRibbonNote?: string;
  totalEUR: number;
  currency: Currency;
  items: CartItem[];
  placedAt: string;
}

export type LegalModalType = 'impressum' | 'privacy' | 'terms' | null;

export interface GDPRConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  decided: boolean;
}
