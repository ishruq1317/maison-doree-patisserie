import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { PatisserieProvider, usePatisserie } from '../context/PatisserieContext';
import { PastryBoxCalculator } from '../components/PastryBoxCalculator';
import { ClickAndCollectDrawer } from '../components/ClickAndCollectDrawer';
import { Navbar } from '../components/Navbar';
import { LaminationComparer } from '../components/LaminationComparer';
import { SensoryPairingWheel } from '../components/SensoryPairingWheel';
import { EuropeanCompliance } from '../components/EuropeanCompliance';
import { SIGNATURE_PASTRIES } from '../data/patisserieData';

describe('Interactive Boutique Components Integration', () => {
  it('renders navbar brand and allows changing currency and language', () => {
    render(
      <PatisserieProvider>
        <Navbar />
      </PatisserieProvider>
    );

    expect(screen.getByText('MAISON DORÉE')).toBeTruthy();
    expect(screen.getByText(/FOUR EN DIRECT/i)).toBeTruthy();

    // Open currency dropdown
    const currBtn = screen.getByLabelText('Select Currency');
    fireEvent.click(currBtn);
    expect(screen.getByText('GBP (£)')).toBeTruthy();

    // Switch to GBP
    fireEvent.click(screen.getByText('GBP (£)'));
    expect(screen.getByText('GBP')).toBeTruthy();

    // Open language dropdown
    const langBtn = screen.getByLabelText('Select Language');
    fireEvent.click(langBtn);
    expect(screen.getByText('English')).toBeTruthy();

    // Switch to EN
    fireEvent.click(screen.getByText('English'));
    expect(screen.getByText(/OVEN LIVE/i)).toBeTruthy();
  });

  it('renders pastry box calculator, enforces box-full validation, and tracks item addition', () => {
    render(
      <PatisserieProvider>
        <PastryBoxCalculator />
      </PatisserieProvider>
    );

    expect(screen.getByText(/6\s*Pièces/)).toBeTruthy();
    expect(screen.getByText(/12\s*Pièces/)).toBeTruthy();
    expect(screen.getByText(/24\s*Pièces/)).toBeTruthy();

    // Initially box is empty, Add to Bag button should be disabled and show 6 needed
    const addBtn = screen.getByRole('button', { name: /Ajoutez encore 6/i });
    expect(addBtn).toBeDefined();
    expect((addBtn as HTMLButtonElement).disabled).toBe(true);

    // Increase quantity of first pastry
    const plusButtons = screen.getAllByLabelText('Augmenter quantité');
    expect(plusButtons.length).toBeGreaterThan(0);

    // Add 6 items
    for (let i = 0; i < 6; i++) {
      fireEvent.click(plusButtons[0]);
    }

    // Now box should be full and button enabled with "Ajouter l’Écrin au Panier"
    const fullBtn = screen.getByRole('button', { name: /Ajouter l’Écrin au Panier/i });
    expect(fullBtn).toBeDefined();
    expect((fullBtn as HTMLButtonElement).disabled).toBe(false);
  });

  it('LaminationComparer renders slider with keyboard accessibility', () => {
    render(
      <PatisserieProvider>
        <LaminationComparer />
      </PatisserieProvider>
    );

    const slider = screen.getByRole('slider');
    expect(slider).toBeTruthy();
    expect(slider.getAttribute('aria-valuenow')).toBe('50');

    // Press ArrowRight to advance
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(slider.getAttribute('aria-valuenow')).toBe('55');

    // Press ArrowLeft to decrease
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(slider.getAttribute('aria-valuenow')).toBe('50');
  });

  it('SensoryPairingWheel renders 6-axis SVG and allows tab switching', () => {
    render(
      <PatisserieProvider>
        <SensoryPairingWheel />
      </PatisserieProvider>
    );

    // Check presence of axis labels
    expect(screen.getByText('Feuilletage')).toBeTruthy();
    expect(screen.getByText('Douceur')).toBeTruthy();

    // Click on another pastry tab (e.g. Baguette)
    const baguetteTab = screen.getByRole('button', { name: /Baguette/i });
    fireEvent.click(baguetteTab);

    // Pastry name should update
    expect(screen.getByText(/Baguette de Tradition/i)).toBeTruthy();
  });

  it('tests full 3-step Click & Collect drawer flow and backward navigation', () => {
    // Helper component to interact with drawer
    const TestBed = () => {
      const { addToCart, openDrawer } = usePatisserie();
      return (
        <div>
          <button
            onClick={() => {
              addToCart({
                pastryId: 'croissant-isigny',
                name: "Croissant au Beurre d'Isigny AOP",
                priceEUR: 2.40,
                quantity: 2,
                image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
              });
              openDrawer();
            }}
          >
            Add & Open
          </button>
          <ClickAndCollectDrawer />
        </div>
      );
    };

    render(
      <PatisserieProvider>
        <TestBed />
      </PatisserieProvider>
    );

    // Click trigger to add item and open drawer
    fireEvent.click(screen.getByText('Add & Open'));

    // Step 1: Cart review
    expect(screen.getByText("Croissant au Beurre d'Isigny AOP")).toBeTruthy();
    expect(screen.getAllByText(/4\.80\s*€/).length).toBeGreaterThanOrEqual(1);

    // Click "Choisir l'heure de retrait" to advance to Step 2
    const step2Btn = screen.getByRole('button', { name: /Choisir l'heure de retrait/i });
    fireEvent.click(step2Btn);

    // Step 2: Pickup details and contact form
    expect(screen.getByText(/Choisissez votre créneau de retrait prioritaire/i)).toBeTruthy();

    // Test backward navigation: click "Retour au panier"
    const backBtn = screen.getByText(/Retour au panier/i);
    fireEvent.click(backBtn);

    // Back in Step 1
    expect(screen.getByRole('button', { name: /Choisir l'heure de retrait/i })).toBeTruthy();

    // Return to Step 2
    fireEvent.click(screen.getByRole('button', { name: /Choisir l'heure de retrait/i }));

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('e.g. Jean-Luc Moreau'), {
      target: { value: 'Antoine De Saint-Exupéry' },
    });
    fireEvent.change(screen.getByPlaceholderText('jeanluc@gmail.com'), {
      target: { value: 'antoine@boulangerie.fr' },
    });
    fireEvent.change(screen.getByPlaceholderText('+33 6 12 34 56 78'), {
      target: { value: '+33 6 99 88 77 66' },
    });

    // Submit Step 2 form
    const confirmBtn = screen.getByRole('button', { name: /Confirmer la Réservation Coupe-File/i });
    fireEvent.click(confirmBtn);

    // Step 3: Confirmation and Skip-the-Line Pass
    expect(screen.getByText(/Votre Fournée est Réservée !/i)).toBeTruthy();
    expect(screen.getByText(/Pass Prioritaire Coupe-File/i)).toBeTruthy();
    expect(screen.getByText('Antoine De Saint-Exupéry')).toBeTruthy();
    expect(screen.getByText(/#MD-\d+/)).toBeTruthy();
    expect(screen.getByRole('link', { name: /Lancer l’itinéraire piéton/i })).toBeTruthy();
  });

  it('EuropeanCompliance renders legal footer and allows opening Impressum modal', () => {
    render(
      <PatisserieProvider>
        <EuropeanCompliance />
      </PatisserieProvider>
    );

    // Find and click Impressum link
    const impressumBtn = screen.getByText(/Mentions Légales & Impressum \(DACH\/EU\)/i);
    fireEvent.click(impressumBtn);

    // Impressum modal should be visible
    expect(screen.getByText(/Société par Actions Simplifiée au capital de 50 000 €/i)).toBeTruthy();
    expect(screen.getByText(/Alexandre Dorée/i)).toBeTruthy();

    // Close modal
    const closeBtn = screen.getByRole('button', { name: /Fermer/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByText(/Société par Actions Simplifiée au capital de 50 000 €/i)).toBeNull();
  });
});
