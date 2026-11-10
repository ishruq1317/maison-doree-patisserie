import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePatisserie } from '../context/PatisserieContext';
import { PICKUP_WINDOWS, UI_TRANSLATIONS, formatPrice, FOOT_TRAFFIC_DATA } from '../data/patisserieData';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Clock,
  CheckCircle2,
  MapPin,
  ArrowRight,
  ShieldCheck,
  QrCode,
  ArrowLeft,
} from 'lucide-react';

export const ClickAndCollectDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    closeDrawer,
    cart,
    removeFromCart,
    updateQuantity,
    cartTotalEUR,
    cartItemCount,
    language,
    currency,
    checkoutStep,
    setCheckoutStep,
    confirmedOrder,
    submitOrder,
  } = usePatisserie();

  const t = UI_TRANSLATIONS[language];

  // Step 2 Form State
  const [selectedWindow, setSelectedWindow] = useState<string>(PICKUP_WINDOWS[0].id);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [giftNote, setGiftNote] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmitStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setFormError(t.formErrorRequired || 'Veuillez renseigner tous les champs obligatoires.');
      return;
    }
    setFormError('');
    const win = PICKUP_WINDOWS.find((w) => w.id === selectedWindow);
    const windowStr = win ? win.timeRange : '08:30 – 09:00';

    submitOrder({
      customerName,
      customerEmail,
      customerPhone,
      pickupWindow: windowStr,
      giftRibbonNote: giftNote.trim() ? giftNote.trim() : undefined,
    });
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop with fade animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-espresso-deep/60 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            {/* Slide-out drawer with cubic-bezier(0.16, 1, 0.3, 1) */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
              className="w-screen max-w-lg glass-patisserie backdrop-blur-2xl bg-stone-ivory/95 shadow-2xl flex flex-col justify-between border-l border-white/50"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-stone-200/80 bg-creme-surface/70 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-espresso-deep text-butter flex items-center justify-center shadow-sm">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-espresso-deep">
                      {t.bagTitle}
                    </h3>
                    <p className="text-[11px] text-patisserie-muted font-medium">
                      {cartItemCount > 0 ? `${cartItemCount} ${t.itemsSelected}` : t.emptyBag}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeDrawer}
                  className="p-2 text-stone-500 hover:text-espresso-deep rounded-full hover:bg-stone-200/80 transition-colors"
                  aria-label={t.closeDrawer}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stepper interactive progress indicator */}
              <div className="px-6 py-3 bg-stone-100/90 border-b border-stone-200 grid grid-cols-3 text-center text-xs font-semibold text-stone-600">
                <button
                  type="button"
                  onClick={() => {
                    if (checkoutStep !== 3) setCheckoutStep(1);
                  }}
                  disabled={checkoutStep === 3}
                  className={`py-1 rounded-lg transition-colors ${
                    checkoutStep === 1
                      ? 'text-terracotta font-bold bg-[#1E120B] border border-terracotta/30 shadow-sm'
                      : checkoutStep > 1
                      ? 'text-espresso-deep hover:text-terracotta cursor-pointer'
                      : ''
                  }`}
                >
                  {t.step1Cart}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (cart.length > 0 && checkoutStep !== 3) setCheckoutStep(2);
                  }}
                  disabled={cart.length === 0 || checkoutStep === 3}
                  className={`py-1 rounded-lg transition-colors ${
                    checkoutStep === 2
                      ? 'text-terracotta font-bold bg-[#1E120B] border border-terracotta/30 shadow-sm'
                      : cart.length > 0 && checkoutStep !== 3
                      ? 'text-espresso-deep hover:text-terracotta cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {t.step2Pickup}
                </button>

                <div
                  className={`py-1 rounded-lg ${
                    checkoutStep === 3 ? 'text-emerald-700 font-bold bg-emerald-50' : 'opacity-60'
                  }`}
                >
                  {t.step3Pass}
                </div>
              </div>

              {/* Main Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                
                {/* STEP 1: REVIEW CART ITEMS */}
                {checkoutStep === 1 && (
                  <>
                    {cart.length === 0 ? (
                      <div className="text-center py-16 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-creme-surface mx-auto flex items-center justify-center text-stone-400">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-serif text-lg font-bold text-espresso-deep">
                            {t.emptyBag}
                          </p>
                          <p className="text-xs text-patisserie-muted max-w-xs mx-auto">
                            {language === 'FR'
                              ? 'Découvrez notre carnet de fournées du matin ou composez un écrin personnalisé.'
                              : language === 'EN'
                              ? 'Explore our live morning deck bakes or curate a custom pastry box.'
                              : 'Entdecken Sie unseren Live-Backplan oder stellen Sie eine individuelle Box zusammen.'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            closeDrawer();
                            const el = document.getElementById('live-schedule');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="btn-magnetic px-6 py-3 rounded-full bg-terracotta text-white text-xs font-bold shadow-md inline-block"
                        >
                          {t.startOrder}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm flex items-start gap-4"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 rounded-xl object-cover shrink-0"
                            />

                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif font-bold text-sm text-espresso-deep leading-snug">
                                {item.name}
                              </h4>
                              
                              {/* Box breakdown list */}
                              {item.isCustomBox && item.boxItems && (
                                <div className="mt-1.5 space-y-0.5 bg-stone-50 p-2 rounded-lg text-[10px] text-patisserie-muted">
                                  {item.boxItems.map((b, i) => (
                                    <div key={i} className="flex justify-between">
                                      <span>{b.quantity}x {b.pastryName}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="mt-2 flex items-center justify-between">
                                <span className="font-serif font-bold text-xs text-terracotta">
                                  {formatPrice(item.priceEUR * item.quantity, currency)}
                                </span>

                                <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg">
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="w-5 h-5 flex items-center justify-center text-espresso-deep hover:bg-white rounded transition-colors"
                                    aria-label="Diminuer quantité"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-4 text-center text-xs font-bold font-mono">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="w-5 h-5 flex items-center justify-center text-espresso-deep hover:bg-white rounded transition-colors"
                                    aria-label="Augmenter quantité"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                                  title="Supprimer"
                                  aria-label="Supprimer article"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* STEP 2: PICKUP WINDOW & CONTACT INFO */}
                {checkoutStep === 2 && (
                  <form onSubmit={handleSubmitStep2} className="space-y-6">
                    {/* Back to Cart link */}
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(1)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta hover:underline focus:outline-none"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{t.backToCart}</span>
                    </button>
                    
                    {/* Pickup Window Selector */}
                    <div className="space-y-3">
                      <label className="font-serif font-bold text-sm text-espresso-deep flex items-center gap-2">
                        <Clock className="w-4 h-4 text-terracotta" />
                        <span>{t.pickupTimeLabel}</span>
                      </label>

                      <div className="grid grid-cols-1 gap-2.5">
                        {PICKUP_WINDOWS.map((win) => {
                          const isSelected = selectedWindow === win.id;
                          return (
                            <button
                              key={win.id}
                              type="button"
                              disabled={!win.available}
                              onClick={() => setSelectedWindow(win.id)}
                              className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                                !win.available
                                  ? 'bg-stone-100 border-stone-200 opacity-60 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-espresso-deep text-white border-espresso-deep shadow-md'
                                  : 'bg-white text-espresso-deep border-stone-200 hover:border-terracotta/40'
                              }`}
                            >
                              <div>
                                <div className="font-mono font-bold text-sm">
                                  {win.timeRange}
                                </div>
                                <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-butter-light' : 'text-patisserie-muted'}`}>
                                  {win.temperatureNote[language]}
                                </div>
                              </div>

                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                                  isSelected
                                    ? 'bg-terracotta border-terracotta text-white'
                                    : 'border-stone-300'
                                }`}
                              >
                                {isSelected && <CheckCircle2 className="w-4 h-4" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-espresso-deep">
                          {t.fullNameLabel} *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Jean-Luc Moreau"
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-espresso-deep">
                            {t.emailLabel} *
                          </label>
                          <input
                            type="email"
                            required
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="jeanluc@gmail.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-espresso-deep">
                            {t.phoneLabel} *
                          </label>
                          <input
                            type="tel"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="+33 6 12 34 56 78"
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-espresso-deep">
                          {t.giftNoteLabel}
                        </label>
                        <textarea
                          rows={2}
                          value={giftNote}
                          onChange={(e) => setGiftNote(e.target.value)}
                          placeholder={t.giftNotePlaceholder}
                          className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta"
                        />
                      </div>

                      {formError && (
                        <p className="text-xs text-rose-600 font-semibold">{formError}</p>
                      )}
                    </div>

                    <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>{t.noOnlinePaymentNote}</span>
                    </div>

                    <button
                      type="submit"
                      className="btn-magnetic w-full py-4 rounded-full bg-terracotta hover:bg-terracotta-hover text-white font-bold text-sm shadow-tactile-hover flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4 text-butter" />
                      <span>{t.confirmReservation}</span>
                    </button>
                  </form>
                )}

                {/* STEP 3: SKIP-THE-LINE PASS & CONFIRMATION */}
                {checkoutStep === 3 && confirmedOrder && (
                  <div className="space-y-6">
                    
                    {/* Congratulatory Hero Header */}
                    <div className="text-center space-y-2">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-espresso-deep">
                        {t.orderSuccessTitle}
                      </h3>
                      <p className="text-xs text-patisserie-muted max-w-xs mx-auto">
                        {t.orderSuccessSubtitle}
                      </p>
                    </div>

                    {/* Priority Boarding Pass Card */}
                    <div className="bg-espresso-deep text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden border-2 border-butter/30 space-y-6">
                      
                      {/* Decorative background watermark */}
                      <div className="absolute -right-8 -bottom-8 opacity-10 text-white pointer-events-none">
                        <QrCode className="w-48 h-48" />
                      </div>

                      {/* Pass Top row */}
                      <div className="flex items-center justify-between border-b border-espresso-warm/80 pb-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-butter">
                            {t.priorityPassBadge}
                          </span>
                          <h4 className="font-serif text-xl font-bold">Maison Dorée</h4>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest">
                            {t.orderNumber}
                          </span>
                          <p className="font-mono font-bold text-base text-butter">
                            {confirmedOrder.orderNumber}
                          </p>
                        </div>
                      </div>

                      {/* Pass Mid Details */}
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase tracking-wider">
                            {t.reservingCustomer}
                          </span>
                          <p className="font-bold text-stone-100 mt-0.5">{confirmedOrder.customerName}</p>
                          <p className="text-[11px] text-stone-400 font-mono">{confirmedOrder.customerPhone}</p>
                        </div>

                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase tracking-wider">
                            {t.pickupReady}
                          </span>
                          <p className="font-mono font-bold text-butter text-sm mt-0.5">
                            {confirmedOrder.pickupWindow}
                          </p>
                          <span className="text-[10px] text-emerald-400 font-semibold">{t.expressCounter}</span>
                        </div>
                      </div>

                      {/* Itemized summary in pass */}
                      <div className="pt-2 border-t border-espresso-warm/60 space-y-1 text-xs">
                        <span className="text-stone-400 block text-[10px] uppercase tracking-wider">
                          {t.reservedSelection}
                        </span>
                        {confirmedOrder.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-stone-300 text-[11px]">
                            <span>{it.quantity}x {it.name}</span>
                            <span className="font-mono text-stone-200">{formatPrice(it.priceEUR * it.quantity, currency)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-espresso-warm/80">
                          <span>{t.totalToPay}</span>
                          <span className="text-butter font-mono">{formatPrice(confirmedOrder.totalEUR, currency)}</span>
                        </div>
                      </div>

                      {/* Pass QR Barcode Mockup */}
                      <div className="bg-white p-3 rounded-2xl flex items-center justify-between text-espresso-deep">
                        <div className="flex items-center gap-3">
                          <QrCode className="w-10 h-10 text-espresso-deep" />
                          <div className="text-[10px]">
                            <p className="font-bold">{t.scanAtCounter}</p>
                            <p className="text-stone-500 font-mono">14 Rue de Grenelle, 75007</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                          {t.passVerified}
                        </span>
                      </div>

                    </div>

                    {/* Direct Google Maps walking directions */}
                    <div className="space-y-3">
                      <a
                        href={FOOT_TRAFFIC_DATA.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-magnetic w-full py-4 rounded-full bg-espresso-deep hover:bg-terracotta text-butter-light font-bold text-xs shadow-md flex items-center justify-center gap-2"
                      >
                        <MapPin className="w-4 h-4 text-butter" />
                        <span>{t.directionsBtn}</span>
                      </a>

                      <button
                        type="button"
                        onClick={closeDrawer}
                        className="w-full text-center text-xs text-stone-500 hover:text-espresso-deep hover:underline"
                      >
                        {t.returnToBoutique}
                      </button>
                    </div>

                  </div>
                )}

              </div>

              {/* Footer Actions for Step 1 */}
              {checkoutStep === 1 && cart.length > 0 && (
                <div className="p-6 bg-creme-surface/80 border-t border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-patisserie-muted">{t.estimatedTotal}</p>
                      <p className="font-serif text-2xl font-bold text-espresso-deep">
                        {formatPrice(cartTotalEUR, currency)}
                      </p>
                    </div>
                    <div className="text-right text-[11px] text-patisserie-muted">
                      <span>{t.vatIncluded}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCheckoutStep(2)}
                    className="btn-magnetic w-full py-4 rounded-full bg-terracotta hover:bg-terracotta-hover text-white font-bold text-sm shadow-tactile-hover flex items-center justify-center gap-2"
                  >
                    <span>{t.choosePickupTime}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ClickAndCollectDrawer;
