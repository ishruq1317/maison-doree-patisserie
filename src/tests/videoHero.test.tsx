import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PatisserieProvider } from '../context/PatisserieContext';
import { HeroSection } from '../components/HeroSection';
import { FullScreenHeroVideo } from '../components/FullScreenHeroVideo';
import { LiveBakeSchedule } from '../components/LiveBakeSchedule';
import { PastryBoxCalculator } from '../components/PastryBoxCalculator';

describe('16:9 Cinematic Video Showcase & Gourmand Background Fade', () => {
  it('renders the exact specified headline: The Quintessence of Parisian Puff Pastry & Living Sourdough.', () => {
    render(
      <PatisserieProvider>
        <HeroSection />
      </PatisserieProvider>
    );

    // Verifies headline is written in the DOM
    const headline = screen.getByRole('heading', { level: 1 });
    expect(headline).toBeDefined();
    expect(headline.textContent).toContain('The Quintessence of Parisian Puff Pastry & Living Sourdough.');
  });

  it('renders 16:9 cinematic widescreen video with loop, autoplay, muted (soundless), playsInline, and NO pause button', () => {
    const { container } = render(
      <PatisserieProvider>
        <FullScreenHeroVideo />
      </PatisserieProvider>
    );

    // Verify video elements exist and point to original asset
    const videos = document.querySelectorAll('video');
    expect(videos.length).toBeGreaterThan(0);
    const mainVideo = videos[videos.length - 1];
    expect(mainVideo).toBeDefined();
    expect(mainVideo.src).toContain('/videos/artisan-baking.mp4');

    // Attributes for seamless web compliance & infinite soundless looping
    expect(mainVideo.hasAttribute('loop')).toBe(true);
    expect(mainVideo.hasAttribute('autoplay')).toBe(true);
    expect(mainVideo.hasAttribute('playsinline')).toBe(true);
    expect(mainVideo.muted).toBe(true);

    // STRICT REQUIREMENT: "there wont be any button for pausing the video"
    expect(screen.queryByRole('button', { name: /^pause$/i })).toBeNull();
    expect(screen.queryByLabelText(/^pause$/i)).toBeNull();
    expect(screen.queryByTitle(/^pause$/i)).toBeNull();

    // Verify 16:9 cinematic widescreen ratio container
    const widescreenContainer = container.querySelector('.aspect-video, .aspect-\\[16\\/9\\]');
    expect(widescreenContainer).toBeTruthy();

    // Verify pointer-events-none on video to lock out click-to-pause
    expect(mainVideo.className).toContain('pointer-events-none');
  });

  it('fades smoothly into the background with multi-layer edge and radial gradient overlays', () => {
    const { container } = render(
      <PatisserieProvider>
        <FullScreenHeroVideo />
      </PatisserieProvider>
    );

    // Fade overlays: top, bottom, left, right, and radial vignette
    const topFade = container.querySelector('.bg-gradient-to-b');
    const bottomFade = container.querySelector('.bg-gradient-to-t');
    const leftFade = container.querySelector('.bg-gradient-to-r');
    const rightFade = container.querySelector('.bg-gradient-to-l');
    const radialFade = container.querySelector('[class*="radial-gradient"]');

    expect(topFade).toBeTruthy();
    expect(bottomFade).toBeTruthy();
    expect(leftFade).toBeTruthy();
    expect(rightFade).toBeTruthy();
    expect(radialFade).toBeTruthy();
  });

  it('enforces clean presentation: soundless video with NO overlay buttons, NO sound toggle, NO HUD, and NO badges by default', () => {
    render(
      <PatisserieProvider>
        <FullScreenHeroVideo />
      </PatisserieProvider>
    );

    // STRICT REQUIREMENT: "in there will be just the video soundless no other option or nothing"
    // No sound toggle button
    expect(screen.queryByRole('button', { name: /son/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /mute/i })).toBeNull();

    // No fullscreen button on video
    expect(screen.queryByRole('button', { name: /plein écran/i })).toBeNull();

    // No feasibility or tech info toggle on video
    expect(screen.queryByLabelText(/comment intégrer/i)).toBeNull();
    expect(screen.queryByText(/feasibility/i)).toBeNull();

    // No loop badges or telemetry HUD boxes overlaying the video
    expect(screen.queryByText(/screen observer/i)).toBeNull();
    expect(screen.queryByText(/boucle continue/i)).toBeNull();
  });

  it('protects continuous playback against spacebar / keyboard pause triggers', () => {
    render(
      <PatisserieProvider>
        <FullScreenHeroVideo />
      </PatisserieProvider>
    );

    const section = screen.getByLabelText(/Artisan Bakery Full Screen Video Showcase/i);
    expect(section).toBeTruthy();

    // Press spacebar on the showcase
    fireEvent.keyDown(section, { code: 'Space', key: ' ' });
    // Still zero pause buttons
    expect(screen.queryByRole('button', { name: /^pause$/i })).toBeNull();
  });

  it('HeroSection positions the full-screen 16:9 cinematic video immediately after the headline', () => {
    render(
      <PatisserieProvider>
        <HeroSection />
      </PatisserieProvider>
    );

    // Headline exists
    const headline = screen.getByRole('heading', { level: 1 });
    expect(headline).toBeDefined();

    // Video exists
    const videoSection = screen.getByLabelText(/Artisan Bakery Full Screen Video Showcase/i);
    expect(videoSection).toBeDefined();

    // Ensure videoSection appears after headline in the DOM
    expect(headline.compareDocumentPosition(videoSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    // View Schedule CTAs exist
    expect(screen.getAllByText(/Voir le Carnet des Fournées/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Composer ma Boîte Écrin/i)).toBeTruthy();

    // Companion masterclass can be expanded
    const toggleSimulationBtn = screen.getByRole('button', { name: /Ouvrir la simulation 4 étapes/i });
    expect(toggleSimulationBtn).toBeTruthy();

    fireEvent.click(toggleSimulationBtn);
    expect(screen.getByText(/Masquer la simulation/i)).toBeTruthy();
  });

  it('renders optional developer diagnostic inspector tools when showInspectorTools=true', () => {
    render(
      <PatisserieProvider>
        <FullScreenHeroVideo showInspectorTools={true} />
      </PatisserieProvider>
    );

    // In inspector mode, telemetry and loop indicators are displayed
    expect(screen.getByText(/Screen Observer :/i)).toBeTruthy();
    expect(screen.getByText(/Boucle Continue \(Sans Pause\)/i)).toBeTruthy();

    // Audio toggle in inspector
    const audioBtn = screen.getByRole('button', { name: /Activer le son/i });
    expect(audioBtn).toBeTruthy();
    fireEvent.click(audioBtn);
    expect(screen.getByRole('button', { name: /Couper le son/i })).toBeTruthy();

    // Feasibility guide in inspector
    const infoBtn = screen.getByLabelText(/Comment intégrer cette vidéo/i);
    expect(infoBtn).toBeTruthy();
    fireEvent.click(infoBtn);
    expect(screen.getByText(/Spécifications & Optimisations 16:9 Cinématique/i)).toBeTruthy();
    fireEvent.click(screen.getByText(/Fermer l'encadré/i));
    expect(screen.queryByText(/Spécifications & Optimisations 16:9 Cinématique/i)).toBeNull();
  });

  it('verifies pastry card price tags render in high-contrast espresso/butter styling without white-on-white occlusion', () => {
    const { container } = render(
      <PatisserieProvider>
        <LiveBakeSchedule />
      </PatisserieProvider>
    );

    // Ensure price badges use high-contrast dark espresso backdrop instead of washed out bg-white/95
    const pricePills = container.querySelectorAll('.absolute.top-3.right-3');
    expect(pricePills.length).toBeGreaterThan(0);
    pricePills.forEach((pill) => {
      expect(pill.className).toContain('bg-espresso-deep');
      expect(pill.className).not.toContain('bg-white/95');
      expect(pill.textContent).toMatch(/[\d,.]+\s*€/);
    });
  });

  it('HeroSection features ambient gourmand glow without disjointed polka-dot grids', () => {
    const { container } = render(
      <PatisserieProvider>
        <HeroSection />
      </PatisserieProvider>
    );

    // Dotted pattern removed in favor of warm ambient gourmet glow
    expect(container.querySelector('[class*="radial-gradient(#BE4D28_1px"]')).toBeNull();
    const ambientGlow = container.querySelector('[class*="radial-gradient(ellipse_at_top"]');
    expect(ambientGlow).toBeTruthy();
  });

  it('PastryBoxCalculator features high-contrast praline tactile quantity counters', () => {
    const { container } = render(
      <PatisserieProvider>
        <PastryBoxCalculator />
      </PatisserieProvider>
    );

    // Quantity counters should not use light-theme bg-stone-50
    const counterWrappers = container.querySelectorAll('.flex.items-center.gap-1\\.5.rounded-xl');
    expect(counterWrappers.length).toBeGreaterThan(0);
    counterWrappers.forEach((wrapper) => {
      expect(wrapper.className).toContain('bg-[#24160E]');
      expect(wrapper.className).not.toContain('bg-stone-50');
    });
  });
});
