import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePatisserie } from '../context/PatisserieContext';
import { UI_TRANSLATIONS, formatPrice, SIGNATURE_PASTRIES } from '../data/patisserieData';
import { ResponsiveImage } from './ResponsiveImage';
import {
  Flame,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ArrowRight,
  Camera,
  Layers,
  Wind,
  Award,
} from 'lucide-react';

interface BakingCroissantExperienceProps {
  onExploreBakes?: () => void;
}

// Color interpolation helper
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(c1: [number, number, number], c2: [number, number, number], t: number): string {
  const r = Math.round(lerp(c1[0], c2[0], t));
  const g = Math.round(lerp(c1[1], c2[1], t));
  const b = Math.round(lerp(c1[2], c2[2], t));
  return `rgb(${r}, ${g}, ${b})`;
}

export const BakingCroissantExperience: React.FC<BakingCroissantExperienceProps> = ({
  onExploreBakes,
}) => {
  const { language, currency } = usePatisserie();
  const t = UI_TRANSLATIONS[language];
  const heroCroissant = SIGNATURE_PASTRIES[0];

  // Baking progress: 0 to 100
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [viewMode, setViewMode] = useState<'animation' | 'photo'>('animation');
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  // Interactive micro-interactions
  const [isSteamActive, setIsSteamActive] = useState(false);
  const [crustFlakes, setCrustFlakes] = useState<{ id: number; x: number; y: number }[]>([]);
  const [flakyToast, setFlakyToast] = useState(false);

  // Audio context ref for synthesized oven sound & crisp crackle
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Four distinct artisan baking stages
  const stages = [
    {
      percent: 0,
      time: '00:00',
      temp: '18°C',
      volume: '100%',
      title: {
        FR: '01. Tourage & Façonnage à Froid',
        EN: '01. Cold Lamination & Shaping',
        DE: '01. Kaltes Tourieren & Formen',
      },
      tagline: {
        FR: '27 couches de beurre AOP d’Isigny 84% & farine de meule T65.',
        EN: '27 hand-laminated layers of AOP Isigny 84% butter & stone-milled flour.',
        DE: '27 laminierte Schichten aus AOP Isigny-Butter & Steinmühlenmehl.',
      },
      sensory: {
        FR: 'Pâte crue fraîche, arôme délicat de crème normande et levain doux.',
        EN: 'Chilled raw dough, delicate aroma of cultured sweet cream butter.',
        DE: 'Gekühlter Rohteig, feines Aroma frischer normannischer Sauerrahmbutter.',
      },
    },
    {
      percent: 33,
      time: '06:00',
      temp: '185°C',
      volume: '150%',
      title: {
        FR: '02. Levée au Fournil & Buée',
        EN: '02. Steam Oven Bloom',
        DE: '02. Ofentrieb & Dampfstoß',
      },
      tagline: {
        FR: 'Choc thermique à 185°C : l’eau du beurre s’évapore et gonfle les feuillets.',
        EN: '185°C thermal surge: butter moisture vaporizes, expanding every fold.',
        DE: 'Hitzestoß bei 185°C: Butterfeuchte verdampft und bläht die Schichten auf.',
      },
      sensory: {
        FR: 'Le beurre commence à fondre dans chaque alvéole. Une tiédeur gourmande s’élève.',
        EN: 'Butter melts deep into every cell. A mouthwatering warmth fills the hearth.',
        DE: 'Butter schmilzt in jeder Pore. Verführerische Ofenwärme steigt auf.',
      },
    },
    {
      percent: 66,
      time: '12:00',
      temp: '215°C',
      volume: '200%',
      title: {
        FR: '03. Caramélisation Maillard Dorée',
        EN: '03. Golden Maillard Glaze',
        DE: '03. Goldbraune Maillard-Karamellisierung',
      },
      tagline: {
        FR: 'Le feuilletage prend sa teinte ambrée sous le bouillonnement du beurre.',
        EN: 'Rich golden amber crust develops as melted butter caramelizes on ridges.',
        DE: 'Bernsteinfarbene Kruste entsteht durch zart kochende Butterschichten.',
      },
      sensory: {
        FR: 'Parfum intense de beurre noisette rôti et sucre caramélisé qui donne faim !',
        EN: 'Intense hazelnut butter and caramelized notes that trigger pure craving!',
        DE: 'Intensiver Duft nach gebräunter Nussbutter und Karamell macht Appetit!',
      },
    },
    {
      percent: 100,
      time: '18:00',
      temp: '215°C',
      volume: '240%',
      title: {
        FR: '04. Sortie du Four Croustillante !',
        EN: '04. Fresh Out of the Oven!',
        DE: '04. Ofenfrisch & Knusprig!',
      },
      tagline: {
        FR: 'Alvéoles ultra-aérées, croûte dorée qui crépite, cœur fondant au beurre.',
        EN: 'Honeycomb crumb, singing crisp flaky crust, melt-in-the-mouth butter heart.',
        DE: 'Luftiges Wabenmuster, herrlich splitternde Kruste, buttriger Kern.',
      },
      sensory: {
        FR: 'Croustillant absolu sous la dent. Impossible d’y résister !',
        EN: 'Unrivaled flaky crunch. Completely irresistible fresh warmth!',
        DE: 'Unvergleichlicher Knusperbiss. Absolut unwiderstehlich!',
      },
    },
  ];

  const currentStage = stages[activeStageIndex];

  // Auto-play loop with savoring pause at 100%
  useEffect(() => {
    if (!isPlaying || viewMode === 'photo') return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Pause briefly at 100% to savor the finished golden croissant
          clearInterval(interval);
          timeoutId = setTimeout(() => {
            setProgress(0);
          }, 2600);
          return 100;
        }
        return Math.min(100, prev + 1.25);
      });
    }, 100);

    return () => {
      clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isPlaying, viewMode, progress >= 100]);

  // Sync active stage with progress
  useEffect(() => {
    if (progress < 25) {
      setActiveStageIndex(0);
    } else if (progress < 55) {
      setActiveStageIndex(1);
    } else if (progress < 85) {
      setActiveStageIndex(2);
    } else {
      setActiveStageIndex(3);
    }
  }, [progress]);

  // Synthesized Web Audio crackle / sizzle sound
  const playSizzleSound = useCallback(() => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2400;
      filter.Q.value = 3.0;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.34);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {
      // Audio not supported
    }
  }, [isMuted]);

  // Synthesized Steam Injection sound (Coup de buée)
  const playSteamSound = useCallback(() => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const bufferSize = ctx.sampleRate * 0.75;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.5));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.7);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.72);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch {
      // Audio not supported
    }
  }, [isMuted]);

  // Synthesized Flaky Crust Crunch sound
  const playCrustCrunch = useCallback(() => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      for (let j = 0; j < 4; j++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(900 + Math.random() * 1100, ctx.currentTime + j * 0.035);
        gain.gain.setValueAtTime(0.07, ctx.currentTime + j * 0.035);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + j * 0.035 + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + j * 0.035);
        osc.stop(ctx.currentTime + j * 0.035 + 0.035);
      }
    } catch {
      // Audio not supported
    }
  }, [isMuted]);

  // Inject steam action
  const handleInjectSteam = () => {
    setIsSteamActive(true);
    playSteamSound();
    setTimeout(() => {
      setIsSteamActive(false);
    }, 2400);
  };

  // Tap croissant to crack the crust
  const handleCroissantTap = (e: React.MouseEvent<HTMLDivElement>) => {
    playCrustCrunch();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newFlakes = Array.from({ length: 7 }).map((_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() * 60 - 30),
      y: y + (Math.random() * 60 - 30),
    }));

    setCrustFlakes(newFlakes);
    setFlakyToast(true);

    setTimeout(() => {
      setCrustFlakes([]);
    }, 1200);

    setTimeout(() => {
      setFlakyToast(false);
    }, 2200);
  };

  const handleStageClick = (idx: number) => {
    setActiveStageIndex(idx);
    setProgress(stages[idx].percent);
    setIsPlaying(false);
    playSizzleSound();
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setProgress(val);
    setIsPlaying(false);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      playSizzleSound();
    }
  };

  const scrollToSchedule = () => {
    if (onExploreBakes) {
      onExploreBakes();
    } else {
      const el = document.getElementById('live-schedule');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Interpolated rendering parameters
  const tNorm = progress / 100;
  // Volume Expansion: scale from 0.76 (flat dough) to 1.08 (puffed croissant)
  const scaleY = 0.76 + tNorm * 0.32;
  const scaleX = 0.88 + tNorm * 0.16;

  // Keyframe colors: [R, G, B]
  // Stage 0 (0%): Raw chilled dough
  const colorRawBase: [number, number, number] = [251, 246, 235];
  const colorRawRidge: [number, number, number] = [227, 215, 193];
  const colorRawCrevice: [number, number, number] = [215, 203, 180];

  // Stage 1 (33%): Early bloom & steam
  const colorBloomBase: [number, number, number] = [246, 226, 175];
  const colorBloomRidge: [number, number, number] = [221, 174, 77];
  const colorBloomCrevice: [number, number, number] = [207, 158, 60];

  // Stage 2 (66%): Maillard caramelization
  const colorMaillardBase: [number, number, number] = [232, 162, 56];
  const colorMaillardRidge: [number, number, number] = [181, 72, 15];
  const colorMaillardCrevice: [number, number, number] = [135, 46, 7];

  // Stage 3 (100%): Golden crusty perfection
  const colorBakedBase: [number, number, number] = [200, 102, 22];
  const colorBakedRidge: [number, number, number] = [122, 37, 3];
  const colorBakedCrevice: [number, number, number] = [80, 24, 2];

  // Smooth piece-wise color interpolation without jumps
  let doughBaseColor: string;
  let ridgeColor: string;
  let creviceColor: string;

  if (tNorm < 0.33) {
    const localT = tNorm / 0.33;
    doughBaseColor = lerpColor(colorRawBase, colorBloomBase, localT);
    ridgeColor = lerpColor(colorRawRidge, colorBloomRidge, localT);
    creviceColor = lerpColor(colorRawCrevice, colorBloomCrevice, localT);
  } else if (tNorm < 0.66) {
    const localT = (tNorm - 0.33) / 0.33;
    doughBaseColor = lerpColor(colorBloomBase, colorMaillardBase, localT);
    ridgeColor = lerpColor(colorBloomRidge, colorMaillardRidge, localT);
    creviceColor = lerpColor(colorBloomCrevice, colorMaillardCrevice, localT);
  } else {
    const localT = (tNorm - 0.66) / 0.34;
    doughBaseColor = lerpColor(colorMaillardBase, colorBakedBase, localT);
    ridgeColor = lerpColor(colorMaillardRidge, colorBakedRidge, localT);
    creviceColor = lerpColor(colorMaillardCrevice, colorBakedCrevice, localT);
  }

  const highlightGlazeOpacity = Math.min(0.9, Math.max(0.04, (progress - 15) / 80));
  const ovenGlowOpacity = Math.min(0.95, Math.max(0.25, (progress + 15) / 100));

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-stone-200/90 bg-white group select-none">
      
      {/* Top Controls Bar: Live Status & View Switcher */}
      <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between gap-2">
        {/* Oven Temp / Live Indicator */}
        <div className="glass-dark text-butter px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
          <Flame className="w-3.5 h-3.5 text-terracotta animate-pulse" />
          <span className="font-mono text-[11px] tracking-wide">
            {currentStage.temp} • {viewMode === 'animation' ? t.statusInDeck : heroCroissant.statusText[language]}
          </span>
        </div>

        {/* View Mode Toggle & Sound */}
        <div className="flex items-center gap-1.5 bg-espresso-deep/85 backdrop-blur-md p-1 rounded-full border border-white/20 shadow-md">
          {viewMode === 'animation' && (
            <button
              type="button"
              onClick={toggleMute}
              className={`p-1.5 rounded-full transition-colors ${
                isMuted ? 'text-stone-400 hover:text-white' : 'text-butter bg-white/10'
              }`}
              title={isMuted ? 'Activer le son du fournil' : 'Couper le son'}
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            type="button"
            onClick={() => setViewMode('animation')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1 ${
              viewMode === 'animation'
                ? 'bg-terracotta text-white shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span className="hidden sm:inline">Cuisson Live</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('photo')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1 ${
              viewMode === 'photo'
                ? 'bg-terracotta text-white shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Camera className="w-3 h-3" />
            <span className="hidden sm:inline">Photo</span>
          </button>
        </div>
      </div>

      {/* Main Visual Viewport */}
      {viewMode === 'photo' ? (
        <div className="relative">
          <ResponsiveImage
            src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80"
            alt="Croissant au Beurre d'Isigny AOP out of oven"
            aspectRatio="4/3"
            priority={true}
            className="w-full"
          />
          <div className="absolute top-14 right-4 bg-espresso-deep/90 text-white font-serif font-bold text-base px-3.5 py-1 rounded-full shadow-md">
            {formatPrice(heroCroissant.priceEUR, currency)}
          </div>
        </div>
      ) : (
        /* ANIMATED OVEN CANVAS */
        <div
          onClick={handleCroissantTap}
          className="relative w-full aspect-[4/3] bg-[#160E09] overflow-hidden flex items-center justify-center cursor-pointer"
          title="Touchez le croissant pour tester son croustillant !"
        >
          {/* Subtle Oven Brick Grid Texture */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#F5A623_1px,transparent_1px)] [background-size:22px_22px]" />

          {/* Top Radiant Heating Resistance Element */}
          <div className="absolute top-0 inset-x-0 h-5 bg-gradient-to-b from-amber-600/40 to-transparent flex justify-around px-8 pointer-events-none">
            <div
              className="w-full h-1.5 rounded-full bg-gradient-to-r from-amber-800 via-orange-500 to-amber-800 transition-opacity duration-700"
              style={{
                opacity: 0.5 + ovenGlowOpacity * 0.5,
                boxShadow: `0 0 ${16 + tNorm * 18}px rgba(245, 110, 30, ${ovenGlowOpacity})`,
              }}
            />
          </div>

          {/* Bottom Stone Hearth Radiant Thermal Glow */}
          <div
            className="absolute bottom-0 inset-x-0 h-32 pointer-events-none transition-opacity duration-500"
            style={{
              background: `radial-gradient(ellipse at bottom, rgba(235, 95, 25, ${ovenGlowOpacity * 0.5}) 0%, rgba(22, 14, 9, 0) 75%)`,
            }}
          />

          {/* Fragrant Steam Wisps rising above croissant */}
          {progress > 38 && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              {[0, 1, 2, 3, 4].map((sIdx) => (
                <motion.div
                  key={sIdx}
                  initial={{ opacity: 0, y: 15, scale: 0.8 }}
                  animate={{
                    opacity: [0, 0.48, 0],
                    y: [-15, -65 - sIdx * 12],
                    scale: [0.8, 1.4, 1.8],
                    x: [(sIdx - 2) * 16, (sIdx - 2) * 32 + (sIdx % 2 === 0 ? 12 : -12)],
                  }}
                  transition={{
                    duration: 2.2 + sIdx * 0.45,
                    repeat: Infinity,
                    delay: sIdx * 0.5,
                    ease: 'easeOut',
                  }}
                  className="absolute bottom-24 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white/20 blur-md"
                />
              ))}
            </div>
          )}

          {/* Interactive Steam Injection Overlay (Coup de Buée) */}
          <AnimatePresence>
            {isSteamActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.75 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-25 pointer-events-none bg-gradient-to-t from-white/35 via-white/20 to-white/10 backdrop-blur-[2px] flex items-center justify-center"
              >
                <div className="text-white text-xs font-serif font-bold tracking-widest uppercase bg-espresso-deep/80 px-4 py-2 rounded-full border border-white/30 shadow-lg">
                  💨 {language === 'FR' ? 'Buée Fournil Injectée à 215°C' : language === 'EN' ? 'Steam Blast Injected at 215°C' : 'Dampfstoß bei 215°C'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated Flakes when tapped */}
          {crustFlakes.map((flake) => (
            <motion.div
              key={flake.id}
              initial={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              animate={{
                opacity: 0,
                scale: 1.6,
                y: -30 + Math.random() * 20,
                x: (Math.random() - 0.5) * 40,
                rotate: Math.random() * 90 - 45,
              }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute z-35 w-2 h-2 rounded-sm bg-gradient-to-tr from-amber-600 to-butter pointer-events-none shadow-sm"
              style={{ left: flake.x, top: flake.y }}
            />
          ))}

          {/* Floating Tap Feedback Toast */}
          <AnimatePresence>
            {flakyToast && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-16 left-1/2 -translate-x-1/2 z-35 bg-espresso-deep/95 text-butter border border-butter/30 px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-xl pointer-events-none flex items-center gap-1.5"
              >
                <span>🥐</span>
                <span>
                  {language === 'FR'
                    ? 'Croûte ultra-croustillante & cœur fondant !'
                    : language === 'EN'
                    ? 'Singing crisp flaky crust & butter heart!'
                    : 'Herrlich splitternde Kruste & Butterschmelz!'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dynamic 27-Layer Artisan Croissant SVG */}
          <div
            className="relative z-10 w-full max-w-[360px] px-4 transition-transform duration-300 ease-out"
            style={{
              transform: `scale(${scaleX}, ${scaleY})`,
            }}
          >
            <svg
              viewBox="0 0 460 280"
              className="w-full h-auto drop-shadow-[0_20px_25px_rgba(0,0,0,0.65)] overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Dynamic Main Body Gradient */}
                <radialGradient id="croissantGlow" cx="50%" cy="35%" r="65%">
                  <stop offset="0%" stopColor={doughBaseColor} />
                  <stop offset="60%" stopColor={ridgeColor} />
                  <stop offset="100%" stopColor={creviceColor} />
                </radialGradient>

                {/* Golden Butter Egg-Wash Sheen Gradient */}
                <linearGradient id="butterGlazeGrad" x1="20%" y1="0%" x2="80%" y2="100%">
                  <stop offset="0%" stopColor="#FFF9E5" stopOpacity={highlightGlazeOpacity} />
                  <stop offset="40%" stopColor="#FED766" stopOpacity={highlightGlazeOpacity * 0.65} />
                  <stop offset="100%" stopColor="#B3470E" stopOpacity="0" />
                </linearGradient>

                {/* Hearth Baking Stone Shadow */}
                <radialGradient id="hearthShadow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.85)" />
                  <stop offset="60%" stopColor="rgba(0,0,0,0.4)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>

                {/* Sizzling butter bubble filter */}
                <filter id="butterGlint" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Baking Stone Hearth Shadow */}
              <ellipse cx="230" cy="245" rx="195" ry="26" fill="url(#hearthShadow)" />

              {/* Stone Hearth Plate Rim */}
              <path
                d="M 45,245 Q 230,268 415,245 Q 230,234 45,245 Z"
                fill="#271912"
                opacity="0.9"
              />

              {/* 1. Base Back Foundation */}
              <path
                d="M 60,210 C 70,135 150,75 230,75 C 310,75 390,135 400,210 C 375,228 305,198 230,198 C 155,198 85,228 60,210 Z"
                fill="url(#croissantGlow)"
                stroke={creviceColor}
                strokeWidth="2.5"
              />

              {/* 2. Left Horn Fold (Tapered outer left crescent tip) */}
              <path
                d="M 60,210 C 50,178 78,154 110,140 C 122,172 105,210 60,210 Z"
                fill="url(#croissantGlow)"
                stroke={ridgeColor}
                strokeWidth="2.5"
              />

              {/* 3. Right Horn Fold (Tapered outer right crescent tip) */}
              <path
                d="M 400,210 C 410,178 382,154 350,140 C 338,172 355,210 400,210 Z"
                fill="url(#croissantGlow)"
                stroke={ridgeColor}
                strokeWidth="2.5"
              />

              {/* 4. Left Crescent Shoulder */}
              <path
                d="M 100,175 C 112,120 168,95 192,102 C 204,138 170,192 130,198 C 112,192 100,186 100,175 Z"
                fill="url(#croissantGlow)"
                stroke={ridgeColor}
                strokeWidth="2.8"
              />

              {/* 5. Right Crescent Shoulder */}
              <path
                d="M 360,175 C 348,120 292,95 268,102 C 256,138 290,192 330,198 C 348,192 360,186 360,175 Z"
                fill="url(#croissantGlow)"
                stroke={ridgeColor}
                strokeWidth="2.8"
              />

              {/* 6. Central Belly Roll (Flagship artisan swollen ring) */}
              <path
                d="M 160,128 C 185,80 275,80 300,128 C 312,165 282,212 230,212 C 178,212 148,165 160,128 Z"
                fill="url(#croissantGlow)"
                stroke={ridgeColor}
                strokeWidth="3.5"
              />

              {/* 7. Inner Lamination Wrap Band */}
              <path
                d="M 184,116 C 206,88 254,88 276,116 C 286,144 262,182 230,182 C 198,182 174,144 184,116 Z"
                fill="url(#croissantGlow)"
                stroke={ridgeColor}
                strokeWidth="2.5"
              />

              {/* 8. The Signature Folded Tongue / Tip on Crest */}
              <path
                d="M 206,116 C 218,98 242,98 254,116 C 258,134 244,158 230,158 C 216,158 202,134 206,116 Z"
                fill={doughBaseColor}
                stroke={ridgeColor}
                strokeWidth="2"
              />

              {/* 9. Lamination Feuillets (Fine 27-Layer Alveoli Lines) */}
              <path
                d="M 178,140 Q 230,152 282,140"
                stroke={creviceColor}
                strokeWidth="2"
                strokeDasharray="5 3"
                fill="none"
                opacity={0.6}
              />
              <path
                d="M 132,166 Q 172,178 208,170"
                stroke={creviceColor}
                strokeWidth="1.8"
                fill="none"
                opacity={0.5}
              />
              <path
                d="M 328,166 Q 288,178 252,170"
                stroke={creviceColor}
                strokeWidth="1.8"
                fill="none"
                opacity={0.5}
              />

              {/* 10. Golden Egg-Wash Glaze & Butter Sheen Overlay */}
              <path
                d="M 166,120 C 190,85 270,85 294,120 C 282,142 260,124 230,124 C 200,124 178,142 166,120 Z"
                fill="url(#butterGlazeGrad)"
              />
              <path
                d="M 110,156 C 128,120 174,108 186,120 C 174,144 140,162 110,156 Z"
                fill="url(#butterGlazeGrad)"
              />
              <path
                d="M 350,156 C 332,120 286,108 274,120 C 286,144 320,162 350,156 Z"
                fill="url(#butterGlazeGrad)"
              />

              {/* 11. Sizzling Butter Micro-Pearls at High Deck Temp (> 50% progress) */}
              {progress > 45 && (
                <g fill="#FFEFA6" opacity={highlightGlazeOpacity} filter="url(#butterGlint)">
                  <circle cx="202" cy="132" r="2.4" />
                  <circle cx="251" cy="138" r="2.0" />
                  <circle cx="225" cy="168" r="2.8" />
                  <circle cx="150" cy="162" r="1.8" />
                  <circle cx="310" cy="165" r="2.2" />
                  <circle cx="230" cy="108" r="1.7" />
                  <circle cx="180" cy="150" r="1.5" />
                  <circle cx="280" cy="150" r="1.5" />
                </g>
              )}
            </svg>
          </div>

          {/* Stage badge in oven */}
          <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-butter text-xs font-serif font-bold tracking-wider">
              {currentStage.time} • {currentStage.volume} Vol.
            </span>
          </div>

          {/* Tap-me hint pill */}
          <div className="absolute bottom-3 right-4 z-20 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-espresso-deep/80 text-[10px] text-stone-300 border border-white/10">
            <span>🥐</span>
            <span>{language === 'FR' ? 'Touchez pour croustiller' : language === 'EN' ? 'Tap to crack crust' : 'Klicken für Knusperbiss'}</span>
          </div>

          {/* Floating Price Pill */}
          <div className="absolute top-14 right-4 z-20 bg-espresso-deep/90 text-white font-serif font-bold text-sm sm:text-base px-3 sm:px-3.5 py-1 rounded-full shadow-md border border-butter/30">
            {formatPrice(heroCroissant.priceEUR, currency)}
          </div>
        </div>
      )}

      {/* Interactive Baking Control Deck & Sensory Story */}
      <div className="p-5 sm:p-6 bg-stone-ivory/95 space-y-4 border-t border-stone-200">
        
        {/* Interactive Baking Stages Stepper */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {stages.map((stg, sIdx) => {
            const isSelected = activeStageIndex === sIdx;
            return (
              <button
                key={sIdx}
                type="button"
                onClick={() => handleStageClick(sIdx)}
                className={`p-2 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-espresso-deep text-butter border-espresso-deep shadow-md scale-[1.02]'
                    : 'bg-white hover:bg-creme-surface text-espresso-deep border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] mb-0.5">
                  <span className={isSelected ? 'text-butter font-bold' : 'text-stone-400'}>
                    {stg.time}
                  </span>
                  <span className={`text-[9px] font-bold ${isSelected ? 'text-terracotta' : 'text-stone-400'}`}>
                    {stg.temp}
                  </span>
                </div>
                <p className={`text-[11px] font-bold truncate leading-tight ${isSelected ? 'text-white' : 'text-espresso-deep'}`}>
                  {stg.title[language].split('.')[1] || stg.title[language]}
                </p>
              </button>
            );
          })}
        </div>

        {/* Live Interactive Scrubber & Controls */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              setIsPlaying(!isPlaying);
              playSizzleSound();
            }}
            className="w-8 h-8 rounded-full bg-espresso-deep text-butter hover:bg-terracotta hover:text-white transition-colors flex items-center justify-center shrink-0 shadow-sm"
            title={isPlaying ? 'Pause' : 'Reprendre la cuisson'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          {/* Interactive Scrub Slider */}
          <div className="flex-1 relative flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSliderChange}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-terracotta"
              aria-label="Progresser dans la cuisson du croissant"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setProgress(0);
              setIsPlaying(true);
              playSizzleSound();
            }}
            className="p-1.5 text-stone-400 hover:text-espresso-deep rounded-full transition-colors shrink-0"
            title="Rejouer la cuisson depuis le début"
            aria-label="Replay"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Coup de Buée (Steam Blast) Trigger */}
          <button
            type="button"
            onClick={handleInjectSteam}
            className="px-2.5 py-1.5 rounded-full bg-stone-200 hover:bg-terracotta hover:text-white text-espresso-deep text-[11px] font-bold flex items-center gap-1 transition-colors shrink-0 shadow-sm"
            title="Injecter un coup de buée dans le four"
          >
            <Wind className="w-3.5 h-3.5 text-terracotta group-hover:text-white" />
            <span className="hidden sm:inline">{language === 'FR' ? 'Buée' : language === 'EN' ? 'Steam' : 'Dampf'}</span>
          </button>
        </div>

        {/* Sensory Appetite Description */}
        <div className="bg-creme-surface/90 p-3.5 rounded-2xl border border-stone-200/80 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-terracotta">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              <span>{currentStage.title[language]}</span>
            </span>
            <span className="text-[11px] font-mono text-patisserie-muted">{currentStage.volume} de volume</span>
          </div>
          <p className="text-xs text-espresso-deep font-medium leading-relaxed">
            {currentStage.sensory[language]}
          </p>
          <p className="text-[11px] text-patisserie-muted leading-snug">
            {currentStage.tagline[language]}
          </p>
        </div>

        {/* Navigation to Fresh Batches */}
        <div className="pt-1 flex items-center justify-between border-t border-stone-200/80">
          <div className="text-[11px] text-patisserie-muted font-medium">
            <span>{t.morningStockLabel} </span>
            <strong className="text-terracotta font-bold">
              {heroCroissant.stockLeft} {t.piecesRemaining}
            </strong>
          </div>
          
          <button
            type="button"
            onClick={scrollToSchedule}
            className="btn-magnetic bg-espresso-deep hover:bg-terracotta text-butter-light text-xs font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>{t.viewSchedule || 'Consulter les Fournées'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default BakingCroissantExperience;
