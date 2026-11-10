import React, { useState } from 'react';
import { usePatisserie } from '../context/PatisserieContext';
import { UI_TRANSLATIONS } from '../data/patisserieData';
import { FullScreenHeroVideo } from './FullScreenHeroVideo';
import { BakingCroissantExperience } from './BakingCroissantExperience';
import { useTypewriter } from '../hooks/useTypewriter';
import {
  ArrowRight,
  Flame,
  Clock,
  Award,
  ShieldCheck,
  Gift,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { language } = usePatisserie();
  const t = UI_TRANSLATIONS[language];

  // Specific requirement: "after writting the 'The Quintessence of Parisian Puff Pastry & Living Sourdough.'"
  // We type out the headline smoothly on page load, with instant rendering in tests and for reduced-motion
  const targetHeadline = t.heroHeadline || 'The Quintessence of Parisian Puff Pastry & Living Sourdough.';
  const { displayedText, isComplete } = useTypewriter(targetHeadline, 22, 60);

  const [showSimulationStudio, setShowSimulationStudio] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      aria-label="Hero Section"
      className="relative overflow-hidden pt-2 pb-12 sm:pt-4 sm:pb-16 lg:pb-20"
    >
      {/* Subtle organic bakery background texture & warm gourmand ambient glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(65,32,15,0.45)_0%,rgba(19,11,7,0.85)_60%,#130B07_100%)]" />

      {/* 
        MANDATORY REQUIREMENT:
        "the video will be for full screen in the top after writting the 'The Quintessence of Parisian Puff Pastry & Living Sourdough.' . 
         And there wont be any button for pausing the video . It will be played in a loop . 
         And the website including the video will be optimised and feasible to use in any kind of device like pc, mobile ,tab etc... 
         it will observe the screen size and fit into it as suitable."
      */}

      {/* 1. Top Section: Writing the Editorial Headline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-2 pb-2 text-center lg:text-left">
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-creme-surface border border-stone-300/60 shadow-sm mx-auto lg:mx-0 mb-3">
          <span className="flex h-2 w-2 rounded-full bg-terracotta animate-pulse" />
          <span className="text-xs uppercase tracking-widest font-bold text-espresso-deep">
            {t.parisianQuarter}
          </span>
          <span className="text-stone-300">•</span>
          <span className="text-[11px] font-medium text-patisserie-muted flex items-center gap-1">
            <Award className="w-3 h-3 text-terracotta" />
            <span>{t.heroPillMof}</span>
          </span>
        </div>

        {/* Main Editorial Headline with Live Writing Effect */}
        <div className="relative">
          <h1
            aria-label={targetHeadline}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-espresso-deep leading-[1.14] tracking-tight text-balance min-h-[2.5em] sm:min-h-[2.2em] flex flex-wrap items-baseline justify-center lg:justify-start"
          >
            <span>{displayedText}</span>
            {!isComplete && (
              <span
                aria-hidden="true"
                className="inline-block w-1 sm:w-1.5 h-7 sm:h-11 bg-terracotta ml-1.5 animate-pulse align-middle"
              />
            )}
          </h1>

          {/* Heritage Moniker subtitle */}
          <p className="text-xs sm:text-sm uppercase tracking-widest text-terracotta font-serif font-semibold mt-2">
            {language === 'FR'
              ? 'La Quintessence du Feuilletage Parisien & du Levain Vivant — Paris VIIe'
              : 'Maison Dorée — Artisan Bakery & Haute Pâtisserie Paris'}
          </p>
        </div>
      </div>

      {/* 2. Full-Screen Video in the Top — Placed immediately after writing the headline */}
      <div className="w-full relative z-10 my-3 sm:my-4 px-2 sm:px-4 lg:px-6 max-w-[1920px] mx-auto">
        <FullScreenHeroVideo
          onExploreBakes={() => scrollTo('live-schedule')}
          onComposeBox={() => scrollTo('box-calculator')}
        />
      </div>

      {/* 3. Editorial Context, Primary CTAs & Artisan Trust Dossier */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mt-6 space-y-6">
        {/* Subheadline description */}
        <p className="text-base sm:text-lg text-patisserie-muted max-w-3xl font-normal leading-relaxed text-center lg:text-left">
          {t.heroSubheadline}
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
          <button
            type="button"
            onClick={() => scrollTo('live-schedule')}
            className="btn-magnetic group flex items-center justify-center gap-3 bg-terracotta hover:bg-terracotta-hover text-white px-7 py-3.5 sm:py-4 rounded-full font-semibold text-sm shadow-tactile-hover transition-all"
          >
            <span>{t.viewSchedule}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={() => scrollTo('box-calculator')}
            className="btn-magnetic flex items-center justify-center gap-2.5 bg-creme-surface hover:bg-stone-ivory text-espresso-deep px-6 py-3.5 sm:py-4 rounded-full font-semibold text-sm border border-stone-300 shadow-tactile-subtle transition-all"
          >
            <Gift className="w-4 h-4 text-terracotta" />
            <span>{t.buildBoxBtn}</span>
          </button>
        </div>

        {/* Artisan Trust Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 max-w-2xl">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-creme-surface/85 border border-stone-200 text-xs font-semibold text-espresso-deep">
            <ShieldCheck className="w-4 h-4 text-terracotta shrink-0" />
            <span>{t.trustButter}</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-creme-surface/85 border border-stone-200 text-xs font-semibold text-espresso-deep">
            <Clock className="w-4 h-4 text-terracotta shrink-0" />
            <span>{t.trustLevain}</span>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center gap-2 p-2.5 rounded-xl bg-creme-surface/85 border border-stone-200 text-xs font-semibold text-espresso-deep">
            <Flame className="w-4 h-4 text-terracotta shrink-0" />
            <span>{t.trustWaves}</span>
          </div>
        </div>

        {/* Quick Counter Wait & Metro Link */}
        <div className="flex items-center justify-center lg:justify-start gap-2.5 sm:gap-3 text-xs text-patisserie-muted flex-wrap">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>
            {language === 'FR'
              ? 'Affluence comptoir actuelle :'
              : language === 'EN'
              ? 'Current Counter Wait:'
              : 'Aktuelle Wartezeit:'}{' '}
            <strong className="text-espresso-deep font-bold">{t.liveQueueHero}</strong>
          </span>
          <span className="hidden sm:inline text-stone-300">•</span>
          <button
            type="button"
            onClick={() => scrollTo('access-map')}
            className="text-terracotta hover:underline font-semibold focus:outline-none"
          >
            {t.metroHeroLink}
          </button>
        </div>

        {/* Companion Interactive Baking Masterclass Simulation Studio */}
        <div className="bg-creme-surface/60 rounded-2xl border border-stone-300/70 p-4 sm:p-6 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-butter/30 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 text-terracotta" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-espresso-deep">
                  Atelier Pâtissier : Simulation Interactive de Cuisson 4 Étapes
                </h3>
                <p className="text-xs text-patisserie-muted">
                  Explorez la réaction de Maillard, le coup de buée à 215°C et le test tactile de croustillance.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSimulationStudio(!showSimulationStudio)}
              className="tactile-chip px-4 py-2 rounded-full text-xs font-bold text-espresso-deep hover:text-terracotta transition-colors flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-auto"
            >
              <span>{showSimulationStudio ? 'Masquer la simulation' : 'Ouvrir la simulation 4 étapes'}</span>
              {showSimulationStudio ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showSimulationStudio && (
            <div className="mt-6 pt-6 border-t border-stone-200/80 animate-in fade-in duration-300">
              <div className="max-w-2xl mx-auto">
                <BakingCroissantExperience onExploreBakes={() => scrollTo('live-schedule')} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
