import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  Currency,
  AllergenTag,
  CartItem,
  LegalModalType,
  GDPRConsent,
  OrderCheckoutData,
  PastryItem,
} from '../types/patisserie';
import { BOX_TIERS, SIGNATURE_PASTRIES } from '../data/patisserieData';

interface PatisserieContextType {
  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartTotalEUR: number;
  cartItemCount: number;

  // Drawer
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  checkoutStep: 1 | 2 | 3;
  setCheckoutStep: (step: 1 | 2 | 3) => void;
  confirmedOrder: OrderCheckoutData | null;
  submitOrder: (formData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    pickupWindow: string;
    giftRibbonNote?: string;
  }) => void;

  // Custom Box Builder
  boxSize: 6 | 12 | 24;
  setBoxSize: (size: 6 | 12 | 24) => void;
  boxItems: Record<string, number>;
  addPastryToBox: (pastryId: string) => void;
  removePastryFromBox: (pastryId: string) => void;
  resetBox: () => void;
  boxTotalCount: number;
  isBoxFull: boolean;
  boxBasePriceEUR: number;
  boxDiscountEUR: number;
  boxFinalPriceEUR: number;
  addBoxToCart: () => void;

  // Allergen Filters
  activeAllergens: AllergenTag[];
  toggleAllergen: (tag: AllergenTag) => void;
  clearAllergens: () => void;

  // Legal Modals
  legalModal: LegalModalType;
  setLegalModal: (modal: LegalModalType) => void;

  // GDPR Consent
  gdprConsent: GDPRConsent;
  updateGdprConsent: (consent: Partial<GDPRConsent>) => void;
  acceptAllCookies: () => void;
  acceptNecessaryCookies: () => void;

  // Quick Action
  reservePastryQuick: (pastry: PastryItem) => void;
}

const PatisserieContext = createContext<PatisserieContextType | undefined>(undefined);

const GDPR_STORAGE_KEY = 'maison_doree_gdpr_v1';
const CART_STORAGE_KEY = 'maison_doree_cart_v1';

export const PatisserieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('FR');
  const [currency, setCurrency] = useState<Currency>('EUR');
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Drawer & Checkout
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderCheckoutData | null>(null);

  // Box Builder state
  const [boxSize, setBoxSizeState] = useState<6 | 12 | 24>(6);
  const [boxItems, setBoxItems] = useState<Record<string, number>>({});

  const setBoxSize = (newSize: 6 | 12 | 24) => {
    setBoxSizeState(newSize);
    // When downsizing, truncate excess items so boxTotalCount never exceeds newSize
    setBoxItems((prev) => {
      let currentTotal = Object.values(prev).reduce((sum, q) => sum + q, 0);
      if (currentTotal <= newSize) return prev;
      const updated = { ...prev };
      const keys = Object.keys(updated);
      for (let i = keys.length - 1; i >= 0 && currentTotal > newSize; i--) {
        const k = keys[i];
        const canRemove = Math.min(updated[k], currentTotal - newSize);
        updated[k] -= canRemove;
        currentTotal -= canRemove;
        if (updated[k] <= 0) {
          delete updated[k];
        }
      }
      return updated;
    });
  };

  // Allergens
  const [activeAllergens, setActiveAllergens] = useState<AllergenTag[]>([]);

  // Legal Modals
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);

  // GDPR
  const [gdprConsent, setGdprConsent] = useState<GDPRConsent>(() => {
    try {
      const saved = localStorage.getItem(GDPR_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      necessary: true,
      analytics: false,
      marketing: false,
      decided: false,
    };
  });

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Persist GDPR
  const saveConsent = (newConsent: GDPRConsent) => {
    setGdprConsent(newConsent);
    try {
      localStorage.setItem(GDPR_STORAGE_KEY, JSON.stringify(newConsent));
    } catch {
      // ignore
    }
  };

  const acceptAllCookies = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      decided: true,
    });
  };

  const acceptNecessaryCookies = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      decided: true,
    });
  };

  const updateGdprConsent = (updates: Partial<GDPRConsent>) => {
    saveConsent({
      ...gdprConsent,
      ...updates,
      decided: true,
    });
  };

  // Cart operations
  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const id = `${item.pastryId || 'custom-box'}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setCart((prev) => {
      // If it's a standard pastry already in cart, increment quantity
      if (!item.isCustomBox && item.pastryId) {
        const existingIndex = prev.findIndex((p) => p.pastryId === item.pastryId && !p.isCustomBox);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += item.quantity;
          return updated;
        }
      }
      return [...prev, { ...item, id }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalEUR = cart.reduce((sum, item) => sum + item.priceEUR * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Box Builder logic
  const boxTotalCount = Object.values(boxItems).reduce((sum, qty) => sum + qty, 0);
  const isBoxFull = boxTotalCount >= boxSize;

  const addPastryToBox = (pastryId: string) => {
    if (boxTotalCount >= boxSize) return;
    setBoxItems((prev) => ({
      ...prev,
      [pastryId]: (prev[pastryId] || 0) + 1,
    }));
  };

  const removePastryFromBox = (pastryId: string) => {
    setBoxItems((prev) => {
      const current = prev[pastryId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[pastryId];
        return copy;
      }
      return {
        ...prev,
        [pastryId]: current - 1,
      };
    });
  };

  const resetBox = () => {
    setBoxItems({});
  };

  const tier = BOX_TIERS.find((t) => t.size === boxSize) || BOX_TIERS[0];

  // Base price of current box
  const boxBasePriceEUR = Object.entries(boxItems).reduce((sum, [pId, qty]) => {
    const pastry = SIGNATURE_PASTRIES.find((p) => p.id === pId);
    return sum + (pastry ? pastry.priceEUR * qty : 0);
  }, 0);

  const boxDiscountEUR = (boxBasePriceEUR * tier.discountPercent) / 100;
  const boxFinalPriceEUR = Math.max(0, boxBasePriceEUR - boxDiscountEUR);

  const addBoxToCart = () => {
    // Must have at least 1 item and be completely filled to guarantee tier integrity
    if (boxTotalCount < boxSize) return;
    const boxList: { pastryName: string; quantity: number }[] = [];
    Object.entries(boxItems).forEach(([pId, qty]) => {
      const p = SIGNATURE_PASTRIES.find((item) => item.id === pId);
      if (p) {
        boxList.push({ pastryName: p.name, quantity: qty });
      }
    });

    const boxLabel = `${tier.label} (${tier.badge[language]})`;
    addToCart({
      name: `Écrin Sur-Mesure : ${boxLabel}`,
      priceEUR: boxFinalPriceEUR,
      quantity: 1,
      isCustomBox: true,
      boxSize,
      boxItems: boxList,
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    });

    resetBox();
    setIsDrawerOpen(true);
    setCheckoutStep(1);
  };

  // Allergen toggle
  const toggleAllergen = (tag: AllergenTag) => {
    setActiveAllergens((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAllergens = () => {
    setActiveAllergens([]);
  };

  // Quick reserve
  const reservePastryQuick = (pastry: PastryItem) => {
    addToCart({
      pastryId: pastry.id,
      name: pastry.name,
      priceEUR: pastry.priceEUR,
      quantity: 1,
      image: pastry.image,
    });
    setIsDrawerOpen(true);
    setCheckoutStep(1);
  };

  const submitOrder = (formData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    pickupWindow: string;
    giftRibbonNote?: string;
  }) => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderNum = `#MD-${randomSuffix}`;
    const newOrder: OrderCheckoutData = {
      orderNumber: orderNum,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      pickupWindow: formData.pickupWindow,
      giftRibbonNote: formData.giftRibbonNote,
      totalEUR: cartTotalEUR,
      currency,
      items: [...cart],
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConfirmedOrder(newOrder);
    setCheckoutStep(3);
    clearCart();
  };

  return (
    <PatisserieContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotalEUR,
        cartItemCount,
        isDrawerOpen,
        openDrawer: () => {
          setIsDrawerOpen(true);
          if (cart.length > 0 && checkoutStep === 3) {
            setCheckoutStep(1);
          }
        },
        closeDrawer: () => setIsDrawerOpen(false),
        checkoutStep,
        setCheckoutStep,
        confirmedOrder,
        submitOrder,
        boxSize,
        setBoxSize,
        boxItems,
        addPastryToBox,
        removePastryFromBox,
        resetBox,
        boxTotalCount,
        isBoxFull,
        boxBasePriceEUR,
        boxDiscountEUR,
        boxFinalPriceEUR,
        addBoxToCart,
        activeAllergens,
        toggleAllergen,
        clearAllergens,
        legalModal,
        setLegalModal,
        gdprConsent,
        updateGdprConsent,
        acceptAllCookies,
        acceptNecessaryCookies,
        reservePastryQuick,
      }}
    >
      {children}
    </PatisserieContext.Provider>
  );
};

export const usePatisserie = () => {
  const context = useContext(PatisserieContext);
  if (!context) {
    throw new Error('usePatisserie must be used within a PatisserieProvider');
  }
  return context;
};
