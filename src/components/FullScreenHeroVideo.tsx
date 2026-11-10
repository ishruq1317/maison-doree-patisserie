import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useScreenObserver } from '../hooks/useScreenObserver';
import {
  Volume2,
  VolumeX,
  Flame,
  Info,
  Repeat,
  Maximize2,
  Minimize2,
} from 'lucide-react';

export interface FullScreenHeroVideoProps {
  onExploreBakes?: () => void;
  onComposeBox?: () => void;
  /**
   * Diagnostic / developer mode flag.
   * Default is false: completely clean, soundless video in 16:9 cinematic ratio
   * with zero overlays, zero buttons, and smooth multi-layer background fade.
   */
  showInspectorTools?: boolean;
}

export const FullScreenHeroVideo: React.FC<FullScreenHeroVideoProps> = ({
  onExploreBakes,
  onComposeBox,
  showInspectorTools = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ambientVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const screen = useScreenObserver();
  const [isMuted, setIsMuted] = useState(true);
  const [showTechInfo, setShowTechInfo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Safe playback helper robust across real browsers, headless runners, and JSDOM
  const safePlay = useCallback((video: HTMLVideoElement | null) => {
    if (!video) return;
    try {
      if (video.paused) {
        const promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(() => {
            // Browser autoplay policy catch
          });
        }
      }
    } catch {
      // Fallback for non-media environments
    }
  }, []);

  // Listen to native fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Guarantee continuous playback in infinite loop with NO pause allowed
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    safePlay(video);

    const handlePause = () => {
      safePlay(video);
    };

    const handleEnded = () => {
      video.currentTime = 0;
      safePlay(video);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        safePlay(video);
      }
    };

    const handleWindowFocus = () => {
      safePlay(video);
    };

    const handleFirstGesture = () => {
      safePlay(video);
    };

    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('click', handleFirstGesture, { once: true, passive: true });

    return () => {
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
    };
  }, [safePlay]);

  // Synchronize ambient reflection video for warm gourmet depth
  useEffect(() => {
    const ambient = ambientVideoRef.current;
    if (!ambient) return;

    safePlay(ambient);

    const handleEnded = () => {
      try {
        ambient.currentTime = 0;
        safePlay(ambient);
      } catch {}
    };

    ambient.addEventListener('ended', handleEnded);
    return () => {
      ambient.removeEventListener('ended', handleEnded);
    };
  }, [safePlay]);

  // Prevent keyboard spacebar or 'k' shortcut from pausing playback
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Space' || e.key === ' ' || e.key.toLowerCase() === 'k') {
      e.preventDefault();
      safePlay(videoRef.current);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch {
      // Fullscreen not supported or blocked
    }
  };

  return (
    <section
      aria-label="Artisan Bakery Full Screen Video Showcase"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative w-full overflow-hidden transition-all duration-500 focus:outline-none bg-transparent ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen bg-[#130B07]' : ''
      }`}
    >
      {/* 
        16:9 Cinematic Widescreen Container
        Smoothly fades into the rich greedy background (#130B07)
      */}
      <div
        ref={containerRef}
        className={`relative w-full aspect-video sm:aspect-[16/9] max-h-[86vh] mx-auto flex items-center justify-center overflow-hidden bg-[#130B07] transition-all duration-500 ${
          isFullscreen ? 'h-screen w-screen max-h-none' : ''
        }`}
        onClick={() => {
          // Continuous loop guarantee on container click without pause
          safePlay(videoRef.current);
        }}
      >
        {/* Layer 1: Ambient Reflection Video for Warm Atmospheric Bloom */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25 select-none filter blur-3xl scale-110">
          <video
            ref={ambientVideoRef}
            src="/videos/artisan-baking.mp4"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 
          Layer 2: Pristine 16:9 Cinematic Video (Soundless, Autoplay, Infinite Loop)
          Strictly:
          - 16:9 widescreen cinematic ratio
          - autoPlay: plays automatically
          - loop: infinite loop
          - muted: soundless by design
          - playsInline: prevents iOS full-screen takeover with controls
          - controls={false}: NO PAUSE BUTTON
          - pointer-events-none on video so clicking cannot pause
        */}
        <video
          ref={videoRef}
          src="/videos/artisan-baking.mp4"
          poster="/videos/artisan-baking-poster.jpg"
          autoPlay
          loop
          muted={true}
          playsInline
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          aria-label="Vidéo cinématographique 16:9 en boucle continue de découpe du croissant au fournil"
          onContextMenu={(e) => e.preventDefault()}
          className="relative z-0 w-full h-full object-cover object-center pointer-events-none select-none transition-all duration-700"
        >
          <source src="/videos/artisan-baking.mp4" type="video/mp4" />
          Votre navigateur ne prend pas en charge la balise vidéo.
        </video>

        {/* 
          Layer 3: Seamless Background Fade Gradients
          Feathers all 4 edges and radial perimeter into the dark roasted espresso/chocolate background (#130B07)
        */}
        {/* Top Edge Fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-16 sm:h-28 lg:h-44 bg-gradient-to-b from-[#130B07] via-[#130B07]/60 to-transparent z-10"
        />

        {/* Bottom Edge Fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 sm:h-36 lg:h-56 bg-gradient-to-t from-[#130B07] via-[#130B07]/75 to-transparent z-10"
        />

        {/* Left Edge Fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-28 lg:w-48 bg-gradient-to-r from-[#130B07] via-[#130B07]/60 to-transparent z-10"
        />

        {/* Right Edge Fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-28 lg:w-48 bg-gradient-to-l from-[#130B07] via-[#130B07]/60 to-transparent z-10"
        />

        {/* Radial Vignette Feathering */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(19,11,7,0.38)_65%,rgba(19,11,7,0.88)_88%,#130B07_100%)]"
        />

        {/* 
          OPTIONAL: Developer Diagnostic Inspector Tools
          Rendered ONLY when explicitly requested via showInspectorTools=true.
          By default, clean soundless 16:9 video with zero overlay options or buttons.
        */}
        {showInspectorTools && (
          <>
            {/* Top-Left Diagnostic Badge */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-espresso-deep/85 backdrop-blur-md border border-butter/30 text-butter-light text-xs font-semibold shadow-lg">
                <Flame className="w-3.5 h-3.5 text-terracotta" />
                <span>FOURNIL EN DIRECT</span>
                <span className="text-stone-400">•</span>
                <span className="font-serif italic text-butter">16:9 Cinematic</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-espresso-deep/80 backdrop-blur-md border border-white/10 text-[11px] font-medium text-stone-200">
                <Repeat className="w-3 h-3 text-terracotta animate-spin [animation-duration:8s]" />
                <span>Boucle Continue (Sans Pause)</span>
              </div>
            </div>

            {/* Top-Right Diagnostic Controls */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
                className="p-2.5 rounded-full bg-espresso-deep/80 hover:bg-espresso-deep backdrop-blur-md border border-white/20 text-butter-light hover:text-white transition-all shadow-md"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
                className="p-2.5 rounded-full bg-espresso-deep/80 hover:bg-espresso-deep backdrop-blur-md border border-white/20 text-butter-light hover:text-white transition-all shadow-md"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4 text-butter" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setShowTechInfo(!showTechInfo)}
                aria-label="Comment intégrer cette vidéo sur un site réel (Spécifications & Optimisations)"
                className="p-2.5 rounded-full bg-espresso-deep/80 hover:bg-espresso-deep backdrop-blur-md border border-white/20 text-butter-light hover:text-white transition-all shadow-md flex items-center gap-1.5 text-xs font-semibold"
              >
                <Info className="w-4 h-4 text-butter" />
                <span className="hidden md:inline">Feasibility & Real-World Stack</span>
              </button>
            </div>

            {/* Bottom-Left Screen Observer Telemetry */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-auto bg-espresso-deep/90 backdrop-blur-md border border-stone-400/30 p-3 sm:p-4 rounded-xl shadow-2xl max-w-sm text-white text-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-butter mb-1">
                <span className="uppercase tracking-wider">
                  Screen Observer : {screen.deviceType.toUpperCase()} ({screen.width} × {screen.height}px)
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                16:9 Format Cinématique Widescreen • Ratio {screen.aspectRatioLabel}
              </p>
            </div>
          </>
        )}
      </div>

      {showInspectorTools && showTechInfo && (
        <div className="bg-stone-900 border-t border-stone-800 p-6 text-white text-xs space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <span className="font-bold text-butter">Spécifications & Optimisations 16:9 Cinématique</span>
            <button
              type="button"
              onClick={() => setShowTechInfo(false)}
              className="text-stone-400 hover:text-white underline text-xs"
            >
              Fermer l'encadré
            </button>
          </div>
          <p className="text-stone-300 leading-relaxed text-[11px]">
            La vidéo est présentée en ratio panoramique 16:9 cinématique avec dégradés progressifs (haut, bas, côtés et vignette radiale) fusionnant dans le fond gourmand (#130B07) de la maison.
          </p>
        </div>
      )}
    </section>
  );
};

export default FullScreenHeroVideo;
