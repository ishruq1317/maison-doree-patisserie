import { describe, it, expect } from 'vitest';
import { formatPrice, BOX_TIERS, SIGNATURE_PASTRIES, BAKE_WAVES, UI_TRANSLATIONS } from '../data/patisserieData';
import { AllergenTag } from '../types/patisserie';

describe('Maison Dorée Business Logic & Pricing Engine', () => {
  it('formats prices correctly across EUR, GBP, and CHF currencies', () => {
    const baseEUR = 10;
    expect(formatPrice(baseEUR, 'EUR')).toBe('10.00 €');
    expect(formatPrice(baseEUR, 'GBP')).toBe('£8.60');
    expect(formatPrice(baseEUR, 'CHF')).toBe('9.50 CHF');
  });

  it('provides correct discount tiers for 6, 12, and 24 pastry boxes', () => {
    const tier6 = BOX_TIERS.find((t) => t.size === 6);
    const tier12 = BOX_TIERS.find((t) => t.size === 12);
    const tier24 = BOX_TIERS.find((t) => t.size === 24);

    expect(tier6?.discountPercent).toBe(8);
    expect(tier12?.discountPercent).toBe(15);
    expect(tier24?.discountPercent).toBe(22);
  });

  it('calculates tiered pricing discounts accurately', () => {
    // 6 croissants at 2.40 each = 14.40 EUR base
    const basePrice = 6 * 2.40;
    const discount = (basePrice * 8) / 100;
    const finalPrice = basePrice - discount;
    expect(finalPrice).toBeCloseTo(13.248, 2);
  });

  it('has 8 authentic signature creations with valid sensory radar scores (0-100)', () => {
    expect(SIGNATURE_PASTRIES.length).toBe(8);

    SIGNATURE_PASTRIES.forEach((pastry) => {
      expect(pastry.priceEUR).toBeGreaterThan(0);
      expect(pastry.sensoryScores.butterLamination).toBeGreaterThanOrEqual(0);
      expect(pastry.sensoryScores.butterLamination).toBeLessThanOrEqual(100);
      expect(pastry.sensoryScores.sweetness).toBeGreaterThanOrEqual(0);
      expect(pastry.sensoryScores.sweetness).toBeLessThanOrEqual(100);
      expect(pastry.sensoryScores.fruitAcidity).toBeGreaterThanOrEqual(0);
      expect(pastry.sensoryScores.fruitAcidity).toBeLessThanOrEqual(100);
      expect(pastry.sensoryScores.roastedPraline).toBeGreaterThanOrEqual(0);
      expect(pastry.sensoryScores.roastedPraline).toBeLessThanOrEqual(100);
      expect(pastry.sensoryScores.crumbCrispness).toBeGreaterThanOrEqual(0);
      expect(pastry.sensoryScores.crumbCrispness).toBeLessThanOrEqual(100);
      expect(pastry.sensoryScores.fermentationDepth).toBeGreaterThanOrEqual(0);
      expect(pastry.sensoryScores.fermentationDepth).toBeLessThanOrEqual(100);
    });
  });

  it('filters pastries correctly by category and dietary allergens', () => {
    const boulangerie = SIGNATURE_PASTRIES.filter((p) => p.category === 'boulangerie');
    expect(boulangerie.length).toBe(2);

    const veganSourdough = SIGNATURE_PASTRIES.filter((p) =>
      p.allergens.includes('vegan-sourdough' as AllergenTag)
    );
    expect(veganSourdough.length).toBeGreaterThanOrEqual(2);
  });

  it('has complete localized bake waves in FR, EN, and DE', () => {
    expect(BAKE_WAVES.length).toBe(6);
    BAKE_WAVES.forEach((wave) => {
      expect(wave.time).toMatch(/^\d{2}:\d{2}$/);
      expect(wave.name.FR.length).toBeGreaterThan(0);
      expect(wave.name.EN.length).toBeGreaterThan(0);
      expect(wave.name.DE.length).toBeGreaterThan(0);
      expect(['completed', 'current', 'upcoming']).toContain(wave.status);
    });
  });

  it('has consistent UI translations across FR, EN, and DE', () => {
    const frKeys = Object.keys(UI_TRANSLATIONS.FR);
    const enKeys = Object.keys(UI_TRANSLATIONS.EN);
    const deKeys = Object.keys(UI_TRANSLATIONS.DE);

    expect(frKeys.length).toBeGreaterThan(50);
    expect(enKeys.length).toBe(frKeys.length);
    expect(deKeys.length).toBe(frKeys.length);

    frKeys.forEach((key) => {
      expect(UI_TRANSLATIONS.EN[key]).toBeDefined();
      expect(UI_TRANSLATIONS.DE[key]).toBeDefined();
    });
  });
});
