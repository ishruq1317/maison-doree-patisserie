import React, { useState } from 'react';
import { usePatisserie } from '../context/PatisserieContext';
import { FOOT_TRAFFIC_DATA, UI_TRANSLATIONS } from '../data/patisserieData';
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Coffee,
  HeartHandshake,
  Wheat,
  ExternalLink,
  Map,
  Camera,
} from 'lucide-react';

export const WalkingTrafficMapHub: React.FC = () => {
  const { language } = usePatisserie();
  const t = UI_TRANSLATIONS[language];
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'storefront' | 'map'>('storefront');

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(FOOT_TRAFFIC_DATA.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="access-map" className="py-16 sm:py-24 bg-creme-surface/60 border-t border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>Saint-Germain-des-Prés • Paris VIIe</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-deep">
            {t.mapHubTitle}
          </h2>
          <p className="text-sm sm:text-base text-patisserie-muted leading-relaxed">
            {t.mapHubSubtitle}
          </p>
        </div>

        {/* 12-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Interactive Navigation Cards & Transit Times (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            
            {/* Live Queue Banner Card */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-tactile-subtle flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-espresso-deep">
                    {t.liveQueueTitle}
                  </h4>
                  <p className="text-xs text-patisserie-muted">
                    {t.queueSubtitle}
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 text-emerald-900 px-4 py-2 rounded-2xl border border-emerald-200 font-bold text-sm">
                ⏱️ {language === 'FR' ? FOOT_TRAFFIC_DATA.currentWaitTime : language === 'EN' ? FOOT_TRAFFIC_DATA.currentWaitTimeEN : FOOT_TRAFFIC_DATA.currentWaitTimeDE}
              </div>
            </div>

            {/* Walking Distances from Public Transport */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-tactile-subtle space-y-4">
              <h4 className="font-serif font-bold text-lg text-espresso-deep flex items-center gap-2">
                <Navigation className="w-5 h-5 text-terracotta" />
                <span>{t.transitTitle}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {FOOT_TRAFFIC_DATA.transitStops.map((stop, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1"
                  >
                    <span className="font-bold text-espresso-deep block truncate">
                      {stop.name}
                    </span>
                    <div className="flex items-center justify-between text-terracotta font-semibold">
                      <span>{stop.distance}</span>
                      <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-[10px]">
                        {language === 'FR' ? stop.timeWalk : language === 'EN' ? stop.timeWalkEN : stop.timeWalkDE}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bakery Amenities Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {FOOT_TRAFFIC_DATA.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-2xl border border-stone-200 text-center space-y-1 shadow-sm"
                >
                  <div className="w-8 h-8 mx-auto rounded-full bg-butter/30 flex items-center justify-center text-espresso-deep">
                    {idx === 0 && <Coffee className="w-4 h-4 text-terracotta" />}
                    {idx === 1 && <Clock className="w-4 h-4 text-terracotta" />}
                    {idx === 2 && <HeartHandshake className="w-4 h-4 text-terracotta" />}
                    {idx === 3 && <Wheat className="w-4 h-4 text-terracotta" />}
                  </div>
                  <p className="font-bold text-xs text-espresso-deep">
                    {amenity.title[language]}
                  </p>
                  <p className="text-[10px] text-patisserie-muted leading-tight">
                    {amenity.desc[language]}
                  </p>
                </div>
              ))}
            </div>

            {/* Oversized Click-to-Navigate Google Maps Trigger */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={FOOT_TRAFFIC_DATA.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-magnetic flex-1 bg-espresso-deep hover:bg-terracotta text-butter-light py-4 px-6 rounded-full font-bold text-sm shadow-tactile-hover transition-all flex items-center justify-center gap-2.5"
              >
                <Navigation className="w-4 h-4 text-butter" />
                <span>{t.openInMaps}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <a
                href={`tel:${FOOT_TRAFFIC_DATA.phone.replace(/\s+/g, '')}`}
                className="btn-magnetic bg-white hover:bg-creme-surface text-espresso-deep border border-stone-300 py-4 px-5 rounded-full font-semibold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-terracotta" />
                <span>{t.callBakery}</span>
              </a>
            </div>

          </div>

          {/* Right: Map Graphic / Storefront Card (5 Cols) */}
          <div className="lg:col-span-5 relative bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-tactile-hover flex flex-col justify-between">
            
            {/* View Toggle Tabs */}
            <div className="absolute top-3 right-3 z-20 flex bg-espresso-deep/80 backdrop-blur-md p-1 rounded-full text-[11px] font-semibold text-white shadow-md">
              <button
                type="button"
                onClick={() => setViewMode('storefront')}
                className={`px-3 py-1 rounded-full flex items-center gap-1 transition-all ${
                  viewMode === 'storefront' ? 'bg-terracotta text-white font-bold' : 'text-stone-300 hover:text-white'
                }`}
              >
                <Camera className="w-3 h-3" />
                <span>{t.togglePhoto}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-3 py-1 rounded-full flex items-center gap-1 transition-all ${
                  viewMode === 'map' ? 'bg-terracotta text-white font-bold' : 'text-stone-300 hover:text-white'
                }`}
              >
                <Map className="w-3 h-3" />
                <span>{t.toggleMap}</span>
              </button>
            </div>

            {/* Visual Storefront Header or Interactive Map */}
            <div className="relative h-64 overflow-hidden bg-stone-100">
              {viewMode === 'storefront' ? (
                <>
                  <img
                    src="https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80"
                    alt="Façade boutique Maison Dorée 14 Rue de Grenelle Paris 7"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso-deep/90 via-espresso-deep/30 to-transparent" />

                  {/* Pin Overlay Badge */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-terracotta text-white flex items-center justify-center shadow-lg">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-serif font-bold text-base">Maison Dorée</h5>
                        <p className="text-[11px] text-butter-light/80">Paris VIIe • Quartier Saint-Germain</p>
                      </div>
                    </div>

                    <a
                      href={FOOT_TRAFFIC_DATA.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </>
              ) : (
                <iframe
                  title="Maison Dorée Google Maps Route"
                  src="https://maps.google.com/maps?q=14+Rue+de+Grenelle+75007+Paris&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              )}
            </div>

            {/* Address & Hours details */}
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta">
                  {t.postalAddress}
                </span>
                <div className="flex items-center justify-between bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  <span className="font-mono text-xs text-espresso-deep font-semibold">
                    {FOOT_TRAFFIC_DATA.address}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="p-1.5 text-stone-500 hover:text-espresso-deep hover:bg-stone-200 rounded-lg transition-colors"
                    title="Copier l'adresse"
                    aria-label="Copier l'adresse"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta">
                  {t.openingHoursTitle}
                </span>
                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-espresso-deep">
                    {FOOT_TRAFFIC_DATA.openingHours}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {t.openToday}
                  </span>
                </div>
              </div>

              {/* Direct Concierge link */}
              <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                <a
                  href={`https://wa.me/${FOOT_TRAFFIC_DATA.whatsapp}?text=Bonjour%20Maison%20Dorée,%20je%20souhaite%20réserver...`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.whatsappConcierge}</span>
                </a>

                <span className="text-xs text-patisserie-muted font-mono font-medium">
                  {FOOT_TRAFFIC_DATA.phone}
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default WalkingTrafficMapHub;
