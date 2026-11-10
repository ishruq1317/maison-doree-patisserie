import React, { useState } from 'react';
import { usePatisserie } from '../context/PatisserieContext';
import { FOOT_TRAFFIC_DATA, UI_TRANSLATIONS } from '../data/patisserieData';
import {
  Phone,
  MessageCircle,
  Navigation,
  Shield,
  X,
  Check,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const EuropeanCompliance: React.FC = () => {
  const {
    language,
    legalModal,
    setLegalModal,
    gdprConsent,
    acceptAllCookies,
    acceptNecessaryCookies,
    updateGdprConsent,
  } = usePatisserie();

  const [cookieSettingsOpen, setCookieSettingsOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(gdprConsent.analytics);
  const [marketingEnabled, setMarketingEnabled] = useState(gdprConsent.marketing);

  const t = UI_TRANSLATIONS[language];

  const handleSaveCookieSettings = () => {
    updateGdprConsent({
      analytics: analyticsEnabled,
      marketing: marketingEnabled,
    });
    setCookieSettingsOpen(false);
  };

  return (
    <>
      {/* 1. PERSISTENT FLOATING QUICK-ACTION DOCK (Safe-Area Aware) */}
      <aside aria-label="Quick action contacts" className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5">
        
        {/* WhatsApp Concierge */}
        <a
          href={`https://wa.me/${FOOT_TRAFFIC_DATA.whatsapp}?text=Bonjour%20Maison%20Dorée,%20je%20souhaite%20commander...`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          title="WhatsApp Concierge"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-bold tracking-wide">
            {t.whatsappConcierge}
          </span>
        </a>

        {/* Direct Call Button */}
        <a
          href={`tel:${FOOT_TRAFFIC_DATA.phone.replace(/\s+/g, '')}`}
          className="flex items-center gap-2 bg-espresso-deep text-butter px-4 py-3 rounded-full shadow-lg hover:bg-terracotta hover:text-white transition-all duration-300 hover:scale-105"
          title={t.callBakery}
        >
          <Phone className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-bold tracking-wide">
            {t.callBakery}
          </span>
        </a>

        {/* Google Maps Route shortcut */}
        <a
          href={FOOT_TRAFFIC_DATA.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white text-espresso-deep border border-stone-200 px-4 py-3 rounded-full shadow-lg hover:border-terracotta transition-all duration-300 hover:scale-105"
          title={t.openInMaps}
        >
          <Navigation className="w-4 h-4 text-terracotta" />
          <span className="hidden sm:inline text-xs font-bold text-espresso-deep">
            Itinéraire 120m
          </span>
        </a>
      </aside>

      {/* 2. GDPR COOKIE CONSENT BANNER (Persisted in localStorage) */}
      {!gdprConsent.decided && (
        <aside
          aria-label="Cookie consent banner"
          className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-stone-ivory/95 backdrop-blur-md border-t border-stone-300/80 shadow-2xl"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3 max-w-3xl">
              <Shield className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-espresso-deep">
                  {t.cookieTitle}
                </h4>
                <p className="text-xs text-patisserie-muted leading-relaxed mt-0.5">
                  {t.cookieText}
                </p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2.5 shrink-0 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => setCookieSettingsOpen(true)}
                className="px-4 py-2 rounded-full text-xs font-bold text-espresso-deep hover:bg-stone-200 border border-stone-300 transition-colors"
              >
                {t.cookieSettings}
              </button>
              <button
                type="button"
                onClick={acceptNecessaryCookies}
                className="px-4 py-2 rounded-full text-xs font-bold text-stone-700 hover:bg-stone-200 border border-stone-300 transition-colors"
              >
                {t.cookieAcceptNecessary}
              </button>
              <button
                type="button"
                onClick={acceptAllCookies}
                className="btn-magnetic px-5 py-2 rounded-full text-xs font-bold bg-espresso-deep text-butter hover:bg-terracotta hover:text-white transition-colors shadow-sm"
              >
                {t.cookieAcceptAll}
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Cookie Preferences Modal */}
      {cookieSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-deep/60 backdrop-blur-sm">
          <div className="bg-stone-ivory rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-lg text-espresso-deep">
                Préférences de Confidentialité
              </h3>
              <button
                type="button"
                onClick={() => setCookieSettingsOpen(false)}
                className="p-1 text-stone-400 hover:text-espresso-deep"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-white border border-stone-200">
                <div>
                  <span className="font-bold text-espresso-deep block">Cookies Essentiels (Panier & Retrait)</span>
                  <p className="text-patisserie-muted text-[11px] mt-0.5">
                    Strictement obligatoires pour retenir vos pâtisseries réservées et votre session.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-200 text-stone-700">
                  Requis
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-white border border-stone-200">
                <div>
                  <span className="font-bold text-espresso-deep block">Mesure d'Audience Anonyme</span>
                  <p className="text-patisserie-muted text-[11px] mt-0.5">
                    Nous permet d'estimer les heures de pointe du fournil sans aucun pistage publicitaire.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="w-4 h-4 text-terracotta rounded mt-1 cursor-pointer"
                />
              </div>

              <div className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-white border border-stone-200">
                <div>
                  <span className="font-bold text-espresso-deep block">Communication & Conciergerie</span>
                  <p className="text-patisserie-muted text-[11px] mt-0.5">
                    Personnalise l'affichage de notre conciergerie WhatsApp et alertes fournées.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={marketingEnabled}
                  onChange={(e) => setMarketingEnabled(e.target.checked)}
                  className="w-4 h-4 text-terracotta rounded mt-1 cursor-pointer"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveCookieSettings}
              className="btn-magnetic w-full py-3 rounded-full bg-espresso-deep text-butter font-bold text-xs shadow-md"
            >
              Enregistrer mes préférences
            </button>
          </div>
        </div>
      )}

      {/* 3. WORKING EU LEGAL MODALS (Impressum, Privacy, Terms) */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-deep/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stone-ivory rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[85vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-serif font-bold text-2xl text-espresso-deep">
                {legalModal === 'impressum' && t.impressumTitle}
                {legalModal === 'privacy' && t.privacyTitle}
                {legalModal === 'terms' && t.termsTitle}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-espresso-deep transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Impressum Content (EU/DACH compliant) */}
            {legalModal === 'impressum' && (
              <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
                <div>
                  <h5 className="font-bold text-sm text-espresso-deep">Éditeur du Site</h5>
                  <p>Maison Dorée S.A.S. — Société par Actions Simplifiée au capital de 50 000 €</p>
                  <p>Siège social : 14 Rue de Grenelle, 75007 Paris, France</p>
                  <p>RCS Paris B 912 345 678 • SIRET : 912 345 678 00019 • Code NAF : 1071C (Boulangerie-Pâtisserie)</p>
                  <p>Numéro de TVA Intracommunautaire : FR 72 912345678</p>
                </div>

                <div>
                  <h5 className="font-bold text-sm text-espresso-deep">Directeur de la Publication</h5>
                  <p>Maître Artisan Pâtissier : M. Alexandre Dorée</p>
                  <p>Contact : contact@maisondoree-paris.fr • Téléphone : +33 1 45 48 29 10</p>
                </div>

                <div>
                  <h5 className="font-bold text-sm text-espresso-deep">Hébergement Web</h5>
                  <p>OVH SAS — 2 rue Kellermann, 59100 Roubaix, France • Téléphone : 1007</p>
                </div>

                <div>
                  <h5 className="font-bold text-sm text-espresso-deep">Médiation de la Consommation (Directive Européenne 2013/11/UE)</h5>
                  <p>
                    Conformément aux dispositions du Code de la consommation, le client a le droit de recourir gratuitement au service de médiation proposé par la Fédération de la Boulangerie-Pâtisserie de Paris.
                  </p>
                </div>
              </div>
            )}

            {/* Privacy Policy (GDPR / RGPD) */}
            {legalModal === 'privacy' && (
              <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
                <div>
                  <h5 className="font-bold text-sm text-espresso-deep">1. Responsable de Traitement</h5>
                  <p>Maison Dorée S.A.S., 14 Rue de Grenelle 75007 Paris (dpo@maisondoree-paris.fr).</p>
                </div>

                <div>
                  <h5 className="font-bold text-sm text-espresso-deep">2. Données Collectées & Finalité</h5>
                  <p>
                    Dans le cadre du Click & Collect, nous collectons exclusivement votre nom, adresse courriel et numéro de téléphone afin de réserver vos créations auprès de nos boulangers et vous notifier dès sortie du four. Aucune donnée n'est cédée ni vendue à des tiers commerciaux.
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-sm text-espresso-deep">3. Durée de Conservation</h5>
                  <p>Les données liées aux bons de retrait sont purgées sous 30 jours après la date de retrait au comptoir.</p>
                </div>

                <div>
                  <h5 className="font-bold text-sm text-espresso-deep">4. Vos Droits RGPD</h5>
                  <p>
                    Vous disposez d'un droit permanent d'accès, de rectification, de portabilité et de suppression de vos données en écrivant à dpo@maisondoree-paris.fr. Vous pouvez également saisir la CNIL (Commission Nationale de l'Informatique et des Libertés - www.cnil.fr).
                  </p>
                </div>
              </div>
            )}

            {/* Terms of Service (CGV) */}
            {legalModal === 'terms' && (
              <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
                <div>
                  <h5 className="font-bold text-sm text-espresso-deep">1. Produits Frais Artisanaux</h5>
                  <p>
                    Toutes nos viennoiseries, pains au levain et pâtisseries fines sont confectionnés de manière artisanale le matin même sans additif ni conservateur. En raison de leur caractère périssable immédiat (article L.221-28 du Code de la consommation), les denrées retirées ne font l'objet d'aucun droit de rétractation après remise au comptoir.
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-sm text-espresso-deep">2. Modalités de Retrait Click & Collect</h5>
                  <p>
                    Votre commande réservée est conservée sous cloche chaude ou réfrigérée pendant votre créneau sélectionné + 45 minutes de tolérance. Au-delà, pour préserver la qualité de texture optimale, la marchandise peut être réattribuée.
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-sm text-espresso-deep">3. Tarifs et Règlement</h5>
                  <p>
                    Les prix sont indiqués en Euros TTC. Le paiement intervient physiquement en boutique par carte bancaire, sans contact ou espèces au moment du retrait.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-stone-200 text-right">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-6 py-2.5 rounded-full bg-espresso-deep text-butter text-xs font-bold"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. STREAMLINED EU LEGAL FOOTER (Compact & Essential Only) */}
      <footer className="bg-espresso-deep text-stone-300 py-5 sm:py-6 border-t border-espresso-warm/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-espresso-warm/40">
            {/* Essential Brand & Contact Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="font-serif text-xl font-bold tracking-tight text-butter">
                  MAISON DORÉE
                </span>
                <span className="text-[10px] tracking-widest text-stone-400 uppercase font-semibold">
                  Paris VIIe
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono">
                14 Rue de Grenelle, 75007 Paris • +33 1 45 48 29 10 • 07h00 – 20h00
              </p>
            </div>

            {/* Essential Legal Compliance Links */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-400">
              <button
                type="button"
                onClick={() => setLegalModal('impressum')}
                className="hover:text-butter transition-colors"
              >
                Mentions Légales & Impressum (DACH/EU)
              </button>
              <span className="text-stone-600 hidden sm:inline">•</span>
              <button
                type="button"
                onClick={() => setLegalModal('privacy')}
                className="hover:text-butter transition-colors"
              >
                Protection des Données (RGPD)
              </button>
              <span className="text-stone-600 hidden sm:inline">•</span>
              <button
                type="button"
                onClick={() => setLegalModal('terms')}
                className="hover:text-butter transition-colors"
              >
                CGV
              </button>
              <span className="text-stone-600 hidden sm:inline">•</span>
              <button
                type="button"
                onClick={() => setCookieSettingsOpen(true)}
                className="hover:text-butter transition-colors"
              >
                Cookies
              </button>
            </div>
          </div>

          {/* Bottom Copyright & EU Conformity */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-1.5">
            <p>{t.allRightsReserved}</p>
            <p className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Conforme aux normes alimentaires UE & RGPD 2016/679</span>
            </p>
          </div>

        </div>
      </footer>
    </>
  );
};
