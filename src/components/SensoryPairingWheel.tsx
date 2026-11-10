import React, { useState, useRef } from 'react';
import { usePatisserie } from '../context/PatisserieContext';
import { SIGNATURE_PASTRIES, UI_TRANSLATIONS } from '../data/patisserieData';
import { SensoryRadar } from '../types/patisserie';
import { Coffee, Compass, Award } from 'lucide-react';

export const SensoryPairingWheel: React.FC = () => {
  const { language } = usePatisserie();
  const t = UI_TRANSLATIONS[language];
  const [selectedPastryId, setSelectedPastryId] = useState<string>(SIGNATURE_PASTRIES[0].id);
  const [activeAxisKey, setActiveAxisKey] = useState<keyof SensoryRadar | null>(null);

  // 3D Perspective Tilt state
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const activePastry = SIGNATURE_PASTRIES.find((p) => p.id === selectedPastryId) || SIGNATURE_PASTRIES[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // 6 Axis Definition
  const axisLabels: { key: keyof SensoryRadar; labelFR: string; labelEN: string; labelDE: string }[] = [
    { key: 'butterLamination', labelFR: 'Feuilletage', labelEN: 'Lamination', labelDE: 'Blätterteig' },
    { key: 'sweetness', labelFR: 'Douceur', labelEN: 'Sweetness', labelDE: 'Süße' },
    { key: 'fruitAcidity', labelFR: 'Acidité', labelEN: 'Acidity', labelDE: 'Fruchtsäure' },
    { key: 'roastedPraline', labelFR: 'Praliné', labelEN: 'Praline', labelDE: 'Röstaroma' },
    { key: 'crumbCrispness', labelFR: 'Croustillant', labelEN: 'Crispness', labelDE: 'Knusprig' },
    { key: 'fermentationDepth', labelFR: 'Levain', labelEN: 'Ferment', labelDE: 'Gärtiefe' },
  ];

  // Radar geometry calibrated for guaranteed zero-overflow in compact viewports
  const size = 340;
  const center = size / 2;
  const radius = 105;
  const angleStep = (Math.PI * 2) / 6;

  // Compute point for a given axis index and value (0-100)
  const getPoint = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2; // start at top
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Background concentric grid polygons (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [20, 40, 60, 80, 100];
  const gridPolygons = gridLevels.map((lvl) => {
    return Array.from({ length: 6 })
      .map((_, i) => {
        const pt = getPoint(i, lvl);
        return `${pt.x},${pt.y}`;
      })
      .join(' ');
  });

  // Active pastry radar polygon points
  const activePolygonPoints = axisLabels
    .map((axis, i) => {
      const val = activePastry.sensoryScores[axis.key];
      const pt = getPoint(i, val);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  return (
    <section id="sensory-wheel" className="py-16 sm:py-24 bg-creme-surface/40 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-bordeaux/10 border border-bordeaux/20 text-bordeaux text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>{language === 'FR' ? 'Harmonie Aromatique' : language === 'EN' ? 'Flavor Harmony' : 'Aromen-Harmonie'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-deep">
            {t.radarTitle}
          </h2>
          <p className="text-sm sm:text-base text-patisserie-muted leading-relaxed">
            {t.radarSubtitle}
          </p>
        </div>

        {/* Pastry Selector Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-2.5">
          {SIGNATURE_PASTRIES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPastryId(p.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedPastryId === p.id
                  ? 'bg-bordeaux text-white shadow-md'
                  : 'bg-white text-espresso-deep border border-stone-200 hover:border-bordeaux/50 shadow-sm'
              }`}
            >
              {p.name.split(' ')[0]} {p.name.split(' ')[1] || ''}
            </button>
          ))}
        </div>

        {/* Interactive 3D Perspective Card Container */}
        <div className="max-w-4xl mx-auto" style={{ perspective: 1200 }}>
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-tactile-hover grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
          >
            
            {/* Left: 6-Axis SVG Radar Polygon (7 Cols) */}
            <div className="md:col-span-7 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
                <svg
                  viewBox={`0 0 ${size} ${size}`}
                  className="w-full h-full overflow-visible"
                >
                  {/* Concentric Hexagonal Grids */}
                  {gridPolygons.map((poly, idx) => (
                    <polygon
                      key={idx}
                      points={poly}
                      fill="none"
                      stroke="#E5DECE"
                      strokeWidth="1"
                      strokeDasharray={idx === 4 ? 'none' : '3,3'}
                    />
                  ))}

                  {/* Axis Spokes from center */}
                  {Array.from({ length: 6 }).map((_, i) => {
                    const end = getPoint(i, 100);
                    return (
                      <line
                        key={i}
                        x1={center}
                        y1={center}
                        x2={end.x}
                        y2={end.y}
                        stroke="#D5C7B7"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Dynamic Radar Area */}
                  <polygon
                    points={activePolygonPoints}
                    fill="rgba(245, 179, 56, 0.28)"
                    stroke="#F5B338"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    className="transition-all duration-500 ease-out"
                  />

                  {/* Radar Value Vertices */}
                  {/* Vertices Points on radar */}
                  {axisLabels.map((axis, i) => {
                    const val = activePastry.sensoryScores[axis.key];
                    const pt = getPoint(i, val);
                    const isSelected = activeAxisKey === axis.key;
                    return (
                      <g key={i} className="cursor-pointer" onClick={() => setActiveAxisKey(isSelected ? null : axis.key)}>
                        {isSelected && (
                          <circle cx={pt.x} cy={pt.y} r="9" fill="none" stroke="#D95A2B" strokeWidth="2" className="animate-ping opacity-60" />
                        )}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isSelected ? '6' : '4'}
                          fill={isSelected ? '#D95A2B' : '#F5B338'}
                          stroke="#1E120B"
                          strokeWidth="2"
                          className="transition-all duration-300 ease-out"
                        />
                      </g>
                    );
                  })}

                  {/* Labels around perimeter */}
                  {axisLabels.map((axis, i) => {
                    const labelPt = getPoint(i, 128);
                    const labelText =
                      language === 'FR'
                        ? axis.labelFR
                        : language === 'EN'
                        ? axis.labelEN
                        : axis.labelDE;
                    const isSelected = activeAxisKey === axis.key;

                    return (
                      <text
                        key={i}
                        x={labelPt.x}
                        y={labelPt.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        onClick={() => setActiveAxisKey(isSelected ? null : axis.key)}
                        className={`text-[11px] font-bold cursor-pointer transition-colors ${
                          isSelected ? 'fill-terracotta' : 'fill-espresso-deep hover:fill-terracotta'
                        }`}
                        style={{ fontFamily: 'Plus Jakarta Sans' }}
                      >
                        {labelText}
                      </text>
                    );
                  })}
                </svg>
              </div>

              <p className="text-[11px] text-patisserie-muted text-center mt-3">
                {language === 'FR'
                  ? 'Cliquez sur un axe ou inclinez au survol en 3D'
                  : language === 'EN'
                  ? 'Click an axis or tilt in 3D'
                  : 'Klicken Sie auf eine Achse oder neigen Sie in 3D'}
              </p>
            </div>

            {/* Right: Master Barista Pairing Notes & Specs (5 Cols) */}
            <div className="md:col-span-5 space-y-6">
              
              <div>
                <span className="text-[11px] uppercase font-bold tracking-widest text-bordeaux">
                  {activePastry.badge || activePastry.category}
                </span>
                <h3 className="font-serif text-2xl font-bold text-espresso-deep">
                  {activePastry.name}
                </h3>
                <p className="text-xs text-patisserie-muted mt-2 leading-relaxed">
                  {activePastry.description[language]}
                </p>
              </div>

              {/* Master Beverage Pairing Box */}
              <div className="bg-creme-surface p-4 rounded-2xl border border-stone-200/90 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-espresso-deep">
                  <Coffee className="w-4 h-4 text-terracotta" />
                  <span>
                    {language === 'FR'
                      ? 'Accord Barista Recommandé :'
                      : language === 'EN'
                      ? 'Master Barista Pairing:'
                      : 'Empfohlene Barista-Kombination:'}
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed italic">
                  "{activePastry.pairingRecommendation[language]}"
                </p>
              </div>

              {/* Interactive Breakdown Score Bars */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setActiveAxisKey(activeAxisKey === 'butterLamination' ? null : 'butterLamination')}
                  className={`w-full flex justify-between text-xs font-semibold p-1.5 rounded-lg transition-colors text-left ${
                    activeAxisKey === 'butterLamination' ? 'bg-terracotta/10 text-terracotta' : 'hover:bg-stone-100 text-stone-600'
                  }`}
                >
                  <span>
                    {language === 'FR' ? 'Feuilletage Beurre AOP' : language === 'EN' ? 'AOP Butter Lamination' : 'AOP-Butterschichtung'}
                  </span>
                  <span className="font-mono font-bold">{activePastry.sensoryScores.butterLamination}/100</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAxisKey(activeAxisKey === 'crumbCrispness' ? null : 'crumbCrispness')}
                  className={`w-full flex justify-between text-xs font-semibold p-1.5 rounded-lg transition-colors text-left ${
                    activeAxisKey === 'crumbCrispness' ? 'bg-terracotta/10 text-terracotta' : 'hover:bg-stone-100 text-stone-600'
                  }`}
                >
                  <span>
                    {language === 'FR' ? 'Croustillant en Bouche' : language === 'EN' ? 'Palate Crispness' : 'Knusprigkeit'}
                  </span>
                  <span className="font-mono font-bold">{activePastry.sensoryScores.crumbCrispness}/100</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAxisKey(activeAxisKey === 'fermentationDepth' ? null : 'fermentationDepth')}
                  className={`w-full flex justify-between text-xs font-semibold p-1.5 rounded-lg transition-colors text-left ${
                    activeAxisKey === 'fermentationDepth' ? 'bg-terracotta/10 text-terracotta' : 'hover:bg-stone-100 text-stone-600'
                  }`}
                >
                  <span>
                    {language === 'FR' ? 'Profondeur Fermentation' : language === 'EN' ? 'Fermentation Depth' : 'Gärtiefe'}
                  </span>
                  <span className="font-mono font-bold">{activePastry.sensoryScores.fermentationDepth}/100</span>
                </button>
              </div>

              {/* Terroir Guarantee */}
              <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-[11px] text-patisserie-muted">
                <Award className="w-3.5 h-3.5 text-butter-gold shrink-0" />
                <span>
                  {language === 'FR'
                    ? 'Analysé selon les critères du Guide Michelin Pâtisserie'
                    : language === 'EN'
                    ? 'Profiled to Michelin Guide Patisserie Standards'
                    : 'Analysiert nach Michelin-Pâtisserie-Kriterien'}
                </span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default SensoryPairingWheel;
