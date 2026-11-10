import React from 'react';
import { usePatisserie } from '../context/PatisserieContext';
import { BOX_TIERS, SIGNATURE_PASTRIES, UI_TRANSLATIONS, formatPrice } from '../data/patisserieData';
import { AllergenTag } from '../types/patisserie';
import { ResponsiveImage } from './ResponsiveImage';
import { Plus, Minus, Check, Gift, Layers, ShieldCheck, ShoppingBag } from 'lucide-react';

export const PastryBoxCalculator: React.FC = () => {
  const {
    language,
    currency,
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
  } = usePatisserie();

  const t = UI_TRANSLATIONS[language];
  const activeTier = BOX_TIERS.find((tier) => tier.size === boxSize) || BOX_TIERS[0];

  const allergenLabels: Record<AllergenTag, { label: string; icon: string }> = {
    'nut-free': {
      label: language === 'FR' ? 'Sans Fruits à Coque' : language === 'EN' ? 'Nut-Free' : 'Nussfrei',
      icon: '🌰',
    },
    vegetarian: {
      label: language === 'FR' ? 'Végétarien' : language === 'EN' ? 'Vegetarian' : 'Vegetarisch',
      icon: '🌱',
    },
    'vegan-sourdough': {
      label: language === 'FR' ? 'Vegan Sourdough' : language === 'EN' ? 'Vegan Sourdough' : 'Veganer Sauerteig',
      icon: '🌾',
    },
    'low-gluten': {
      label: language === 'FR' ? 'Faible Teneur en Gluten (48h)' : language === 'EN' ? 'Low-Gluten Long Ferment' : 'Glutenarm (48h Ferment)',
      icon: '⏱️',
    },
  };

  // Filter pastries eligible for box based on allergens
  const availablePastries = SIGNATURE_PASTRIES.filter((p) => {
    if (activeAllergens.length === 0) return true;
    return activeAllergens.every((tag) => p.allergens.includes(tag));
  });

  const getTierSubtext = (size: number) => {
    if (size === 6) return t.tier6Sub;
    if (size === 12) return t.tier12Sub;
    return t.tier24Sub;
  };

  const remainingNeeded = Math.max(0, boxSize - boxTotalCount);

  return (
    <section id="box-calculator" className="py-16 sm:py-24 bg-stone-ivory relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-terracotta/10 border border-terracotta/20 text-terracotta text-xs font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5" />
            <span>{language === 'FR' ? "Écrin & Traiteur d'Entreprise" : language === 'EN' ? 'Executive & Gift Boxes' : 'Präsent- & Catering-Boxen'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-deep">
            {t.boxCalculatorTitle}
          </h2>
          <p className="text-sm sm:text-base text-patisserie-muted leading-relaxed">
            {t.boxCalculatorSubtitle}
          </p>
        </div>

        {/* Step 1: Box Size Tier Selector */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-espresso-deep flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-espresso-deep text-white text-xs flex items-center justify-center font-sans font-bold">
              1
            </span>
            <span>{t.selectBoxSize}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BOX_TIERS.map((tier) => {
              const isSelected = boxSize === tier.size;
              return (
                <button
                  key={tier.size}
                  type="button"
                  onClick={() => setBoxSize(tier.size)}
                  className={`relative p-5 sm:p-6 rounded-3xl text-left border-2 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-creme-surface border-terracotta shadow-tactile-hover scale-[1.01]'
                      : 'bg-white border-stone-200 hover:border-stone-300 shadow-tactile-subtle'
                  }`}
                >
                  {/* Discount ribbon badge */}
                  <div className="absolute top-4 right-4 bg-terracotta text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                    {tier.badge[language]}
                  </div>

                  <div className="space-y-1 pt-1">
                    <span className="font-serif text-2xl font-bold text-espresso-deep">
                      {tier.size} {t.tierSizeSuffix || 'Pièces'}
                    </span>
                    <p className="text-xs text-patisserie-muted">
                      {getTierSubtext(tier.size)}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-stone-200/60 mt-4 text-xs font-semibold">
                    <span className="text-terracotta">
                      {t.autoDiscount} : {tier.discountPercent}%
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        isSelected
                          ? 'bg-terracotta border-terracotta text-white'
                          : 'border-stone-300 text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Dietary / Allergen Filter Bar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-espresso-deep flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-espresso-deep text-white text-xs flex items-center justify-center font-sans font-bold">
                2
              </span>
              <span>{t.filterAllergens}</span>
            </h3>

            {activeAllergens.length > 0 && (
              <button
                type="button"
                onClick={clearAllergens}
                className="text-xs text-terracotta hover:underline font-semibold"
              >
                {t.resetFilters}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {(Object.keys(allergenLabels) as AllergenTag[]).map((tag) => {
              const active = activeAllergens.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleAllergen(tag)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold border flex items-center gap-2 transition-all ${
                    active
                      ? 'bg-espresso-deep text-white border-espresso-deep shadow-sm'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <span>{allergenLabels[tag].icon}</span>
                  <span>{allergenLabels[tag].label}</span>
                  {active && <Check className="w-3 h-3 text-butter" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Interactive Pastry Selection Grid & Live Box Cart Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Pastry Selection Grid (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-espresso-deep flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-espresso-deep text-white text-xs flex items-center justify-center font-sans font-bold">
                3
              </span>
              <span>{t.fillBoxPastries}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availablePastries.map((pastry) => {
                const qty = boxItems[pastry.id] || 0;
                const disableAdd = isBoxFull;

                return (
                  <div
                    key={pastry.id}
                    className="flex bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow items-center gap-3.5"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <ResponsiveImage
                        src={pastry.image}
                        alt={pastry.name}
                        aspectRatio="1/1"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-sm text-espresso-deep truncate">
                        {pastry.name}
                      </h4>
                      <p className="text-[11px] text-patisserie-muted truncate">
                        {pastry.badge || pastry.category}
                      </p>
                      <p className="text-xs font-serif font-bold text-terracotta mt-1">
                        {formatPrice(pastry.priceEUR, currency)}
                      </p>
                    </div>

                    {/* Plus / Minus tactile controllers */}
                    <div className="flex items-center gap-1.5 bg-[#24160E] p-1 rounded-xl border border-butter/25 shadow-inner">
                      <button
                        type="button"
                        disabled={qty === 0}
                        onClick={() => removePastryFromBox(pastry.id)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          qty === 0
                            ? 'text-stone-500 cursor-not-allowed opacity-40'
                            : 'text-butter-light hover:bg-[#341F14] active:scale-95'
                        }`}
                        aria-label="Diminuer quantité"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-5 text-center text-xs font-bold text-butter font-mono">
                        {qty}
                      </span>

                      <button
                        type="button"
                        disabled={disableAdd}
                        onClick={() => addPastryToBox(pastry.id)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          disableAdd
                            ? 'text-stone-300 cursor-not-allowed'
                            : 'bg-espresso-deep text-white hover:bg-terracotta active:scale-95'
                        }`}
                        aria-label="Augmenter quantité"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Live Box Progress & Tier Price Summary Sticky Card (4 Cols) */}
          <div className="lg:col-span-4 sticky top-28 bg-white rounded-3xl p-6 border-2 border-terracotta/20 shadow-tactile-hover space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-terracotta" />
                <span className="font-serif font-bold text-lg text-espresso-deep">
                  {t.boxProgress}
                </span>
              </div>
              <span className="font-mono text-sm font-bold text-terracotta">
                {boxTotalCount} / {boxSize} {t.piecesLeft}
              </span>
            </div>

            {/* Visual Capacity Fill Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden p-0.5 border border-stone-200">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isBoxFull ? 'bg-emerald-500' : 'bg-terracotta'
                  }`}
                  style={{ width: `${Math.min(100, (boxTotalCount / boxSize) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-patisserie-muted text-right font-medium">
                {isBoxFull
                  ? t.boxFullReady
                  : `${t.boxAddMore} ${remainingNeeded} ${t.boxPiecesRemaining}`}
              </p>
            </div>

            {/* Visual Interactive Parisian Pastry Box Grid */}
            <div className="bg-creme-surface/90 p-3 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-espresso-deep">
                <span className="flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-terracotta" />
                  <span>Écrin Luxe ({boxSize} alvéoles)</span>
                </span>
                {isBoxFull ? (
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                    Écrin Prêt
                  </span>
                ) : (
                  <span className="text-patisserie-muted text-[10px]">
                    {boxTotalCount}/{boxSize} garnis
                  </span>
                )}
              </div>

              <div
                className={`grid gap-1.5 ${
                  boxSize === 6 ? 'grid-cols-3' : boxSize === 12 ? 'grid-cols-4' : 'grid-cols-6'
                }`}
              >
                {Array.from({ length: boxSize }).map((_, slotIdx) => {
                  // Find which pastry occupies this slot index
                  let curCount = 0;
                  let slotPastry: (typeof SIGNATURE_PASTRIES)[0] | null = null;
                  for (const [pId, qty] of Object.entries(boxItems)) {
                    if (slotIdx >= curCount && slotIdx < curCount + qty) {
                      slotPastry = SIGNATURE_PASTRIES.find((p) => p.id === pId) || null;
                      break;
                    }
                    curCount += qty;
                  }

                  if (slotPastry) {
                    return (
                      <button
                        key={slotIdx}
                        type="button"
                        onClick={() => removePastryFromBox(slotPastry!.id)}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-terracotta/40 bg-white shadow-sm hover:border-rose-400 transition-all focus:outline-none"
                        title={`${slotPastry.name} (Cliquer pour retirer)`}
                      >
                        <img
                          src={slotPastry.image}
                          alt={slotPastry.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-espresso-deep/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                          ✕
                        </div>
                      </button>
                    );
                  }

                  return (
                    <div
                      key={slotIdx}
                      className="aspect-square rounded-xl border border-dashed border-butter/25 bg-[#170E08] flex items-center justify-center text-butter/40 text-[10px] font-mono select-none"
                    >
                      {slotIdx + 1}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Pastries List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {boxTotalCount === 0 ? (
                <div className="text-center py-6 text-stone-400 text-xs">
                  {t.noItemsInBox}
                </div>
              ) : (
                Object.entries(boxItems).map(([pId, qty]) => {
                  const p = SIGNATURE_PASTRIES.find((item) => item.id === pId);
                  if (!p) return null;
                  return (
                    <div
                      key={pId}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-stone-50"
                    >
                      <span className="text-espresso-deep font-medium truncate max-w-[170px]">
                        {qty}x {p.name}
                      </span>
                      <span className="text-stone-600 font-mono">
                        {formatPrice(p.priceEUR * qty, currency)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-2 pt-3 border-t border-stone-200 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>{t.regularUnitPrice}</span>
                <span className="font-mono">{formatPrice(boxBasePriceEUR, currency)}</span>
              </div>

              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>{t.tierDiscountLabel} ({activeTier.discountPercent}%)</span>
                <span className="font-mono">- {formatPrice(boxDiscountEUR, currency)}</span>
              </div>

              <div className="flex justify-between text-base font-serif font-bold text-espresso-deep pt-2 border-t border-stone-200">
                <span>{t.totalBoxPrice}</span>
                <span className="text-terracotta font-sans text-lg font-bold">
                  {formatPrice(boxFinalPriceEUR, currency)}
                </span>
              </div>
            </div>

            {/* Gift Box Packaging Guarantee Badge */}
            <div className="bg-creme-surface/80 p-3 rounded-2xl flex items-center gap-2.5 text-[11px] text-patisserie-muted border border-stone-200">
              <ShieldCheck className="w-4 h-4 text-terracotta shrink-0" />
              <span>{t.packagingGuarantee}</span>
            </div>

            {/* Add to Bag CTA */}
            <button
              type="button"
              disabled={!isBoxFull}
              onClick={addBoxToCart}
              className={`w-full py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2.5 shadow-tactile-hover transition-all ${
                !isBoxFull
                  ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                  : 'btn-magnetic bg-terracotta hover:bg-terracotta-hover text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-butter" />
              <span>
                {isBoxFull
                  ? t.addBoxToBag
                  : `${t.boxAddMore} ${remainingNeeded} ${t.boxPiecesRemaining}`}
              </span>
            </button>

            {boxTotalCount > 0 && (
              <button
                type="button"
                onClick={resetBox}
                className="w-full text-center text-xs text-stone-400 hover:text-stone-600 hover:underline"
              >
                {t.emptyThisBox}
              </button>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};

export default PastryBoxCalculator;
