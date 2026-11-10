import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PatisserieProvider } from '../context/PatisserieContext';
import { BakingCroissantExperience } from '../components/BakingCroissantExperience';
import { HeroSection } from '../components/HeroSection';
import { EuropeanCompliance } from '../components/EuropeanCompliance';
import { LiveBakeSchedule } from '../components/LiveBakeSchedule';

describe('New Interactive Features & UI Refinements', () => {
  it('renders BakingCroissantExperience with live stages, temp, and interactive controls', () => {
    render(
      <PatisserieProvider>
        <BakingCroissantExperience />
      </PatisserieProvider>
    );

    // Initial stage info
    expect(screen.getAllByText(/Tourage & Façonnage/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/18°C/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/100% Vol/i)).toBeTruthy();

    // Click on Stage 4 (Sortie du four croustillante)
    const stage4Btn = screen.getByRole('button', { name: /Sortie du Four Croustillante/i });
    fireEvent.click(stage4Btn);

    // Should update temp and volume
    expect(screen.getAllByText(/215°C/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/240% Vol/i)).toBeTruthy();
    expect(screen.getByText(/Croustillant absolu sous la dent/i)).toBeTruthy();

    // After stage click, animation is paused; clicking resumes play
    const playBtn = screen.getByLabelText(/^Play$/i);
    expect(playBtn).toBeTruthy();
    fireEvent.click(playBtn);
    expect(screen.getByLabelText(/^Pause$/i)).toBeTruthy();

    // Test View Mode toggle to Photo
    const photoBtn = screen.getByRole('button', { name: /Photo/i });
    fireEvent.click(photoBtn);
    expect(screen.getByAltText(/Croissant au Beurre d'Isigny/i)).toBeTruthy();

    // Switch back to Animation
    const animBtn = screen.getByRole('button', { name: /Cuisson Live/i });
    fireEvent.click(animBtn);
    expect(screen.getByLabelText(/Progresser dans la cuisson du croissant/i)).toBeTruthy();
  });

  it('HeroSection limits Book Now options and directs to live schedule', () => {
    render(
      <PatisserieProvider>
        <HeroSection />
      </PatisserieProvider>
    );

    // Primary CTA now invites exploring hearth bakes instead of premature direct reservation
    expect(screen.getAllByText(/Voir le Carnet des Fournées/i).length).toBeGreaterThanOrEqual(1);

    // The hero croissant card no longer contains a duplicate quick-reserve button;
    // instead it has the interactive baking experience and link to schedule
    expect(screen.queryByRole('button', { name: /^Réserver$/i })).toBeNull();
  });

  it('LiveBakeSchedule retains Reserve buttons where they belong and provides interactive craft dossiers', () => {
    render(
      <PatisserieProvider>
        <LiveBakeSchedule />
      </PatisserieProvider>
    );

    // Reserve buttons exist on pastry cards
    const reserveButtons = screen.getAllByRole('button', { name: /Réserver/i });
    expect(reserveButtons.length).toBeGreaterThan(0);

    // Interactive craft dossier expand button
    const dossierButtons = screen.getAllByRole('button', { name: /Fiche Fournil \+/i });
    expect(dossierButtons.length).toBeGreaterThan(0);

    // Click first dossier button to expand
    fireEvent.click(dossierButtons[0]);
    expect(screen.getByText(/Farine & Eau :/i)).toBeTruthy();
    expect(screen.getByText(/Four à sol :/i)).toBeTruthy();
  });

  it('EuropeanCompliance renders compact footer with only essential info and functioning legal modals', () => {
    render(
      <PatisserieProvider>
        <EuropeanCompliance />
      </PatisserieProvider>
    );

    // Footer brand & contact
    expect(screen.getByText('MAISON DORÉE')).toBeTruthy();
    expect(screen.getByText(/14 Rue de Grenelle, 75007 Paris/i)).toBeTruthy();

    // Essential legal links
    const impressumBtn = screen.getByText(/Mentions Légales & Impressum \(DACH\/EU\)/i);
    expect(impressumBtn).toBeTruthy();
    const privacyBtn = screen.getByText(/Protection des Données \(RGPD\)/i);
    expect(privacyBtn).toBeTruthy();
    const cgvBtn = screen.getByText('CGV');
    expect(cgvBtn).toBeTruthy();

    // Privacy modal works
    fireEvent.click(privacyBtn);
    expect(screen.getByText(/1\. Responsable de Traitement/i)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Fermer/i }));
    expect(screen.queryByText(/1\. Responsable de Traitement/i)).toBeNull();

    // CGV modal works
    fireEvent.click(cgvBtn);
    expect(screen.getByText(/1\. Produits Frais Artisanaux/i)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Fermer/i }));
    expect(screen.queryByText(/1\. Produits Frais Artisanaux/i)).toBeNull();
  });

  it('supports interactive steam injection and tap-to-crack crust feedback in BakingCroissantExperience', () => {
    render(
      <PatisserieProvider>
        <BakingCroissantExperience />
      </PatisserieProvider>
    );

    // Steam injection button (Coup de buée)
    const steamBtn = screen.getByTitle(/Injecter un coup de buée/i);
    expect(steamBtn).toBeTruthy();
    fireEvent.click(steamBtn);

    // Steam overlay appears
    expect(screen.getByText(/Buée Fournil Injectée à 215°C/i)).toBeTruthy();

    // Tap to crack the crust on the oven canvas
    const canvas = screen.getByTitle(/Touchez le croissant/i);
    expect(canvas).toBeTruthy();
    fireEvent.click(canvas);

    // Sensory feedback toast appears
    expect(screen.getByText(/Croûte ultra-croustillante & cœur fondant/i)).toBeTruthy();
  });
});
