<div align="center">

# 🥐 MAISON DORÉE
### *Boulangerie & Haute Pâtisserie Artisanale — Paris VIIe*

[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.15-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Vitest](https://img.shields.io/badge/Vitest-28_Passed-729B1B?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-EAA92B?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>An ultra-luxury, high-converting digital storefront engineered for a Parisian Haute Boulangerie boutique.</strong><br />
  Featuring an ambient 16:9 cinematic video hero, live deck bake wave schedule, custom gift box tier calculator, 6-axis 3D flavor radar, drag-to-slide lamination comparer, and seamless Click-and-Collect checkout.
</p>

[✨ Live Demo](#-live-preview--deployment) • [🎯 Key Features](#-key-features) • [⚙️ Artisan Craft & Gear](#️-artisan-craft--fournil-gear) • [🎨 Gourmand Palette](#-the-gourmand-design-system) • [🚀 Quick Start](#-quick-start)

---

</div>

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Artisan Craft & Fournil Gear](#️-artisan-craft--fournil-gear)
- [The Gourmand Design System](#-the-gourmand-design-system)
- [Component Architecture](#-component-architecture)
- [GitHub "About" Gear Metadata](#-github-about-gear-metadata-fill-in-guide)
- [Quick Start & Local Setup](#-quick-start)
- [Testing & Production Build](#-testing--quality-assurance)
- [Deployment on Vercel](#-deployment-on-vercel)

---

## 🏛️ Overview

**Maison Dorée** is a flagship client-acquisition web application crafted for European artisanal bakeries and haute pâtisserie houses. Moving away from cookie-cutter SaaS layouts and generic templates, it delivers an editorial, tactile, and appetizing experience that reflects the prestige of a €15,000 bespoke boutique build.

- **Brand Essence:** Pure AOP Isigny butter viennoiserie, 48-hour wild sourdough levain, and seasonal Parisian haute pâtisserie creations.
- **Audience:** Discerning food lovers, Saint-Germain-des-Prés locals, morning commuters, and corporate catering clients.
- **Conversion Strategy:** Instant live-bake status alerts, frictionless Click-and-Collect reservation with express skip-the-line passes, and multi-currency/multi-language support (`FR | EN | DE` and `€ | £ | CHF`).

---

## 🎯 Key Features

### 🎬 1. 16:9 Cinematic Video Hero & Ambient Fading
- Full-bleed **16:9 cinematic widescreen video** with soft multi-layer gradient edge feathering dissolving into the dark chocolate background.
- **Continuous soundless loop** (`autoPlay`, `muted`, `loop`, `playsInline`, `controls={false}`, `pointer-events-none`) with zero UI button clutter.
- Fast-start MP4 with `moov` atom at byte 0 and instant high-res fallback poster frame (`CLS = 0.00`).
- Dynamic **Screen Size Observer** tracking screen resolution, aspect ratio, and device tier (`Mobile`, `Tablet`, `PC`, `Ultrawide`).

### 🥐 2. Interactive 4-Stage Baking Masterclass Simulation
- Stage-by-stage visual progression through the authentic baking process:
  1. *Tourage & Façonnage (Chilled 27-layer dough)*
  2. *Pousse au Four & Buée (Oven bloom & expansion)*
  3. *Réaction de Maillard (Caramelizing honey crust)*
  4. *Sortie du Four Croustillante (Golden mahogany perfection)*
- Interactive **"Coup de Buée"** (215°C steam injection blast) and **"Tester le Croustillant"** (tap to crack crust with flying golden flakes and crackle audio synthesis).

### 🥖 3. Live Deck Bake Schedule & Real-Time Waves
- Interactive schedule displaying live morning status badges:
  - `Just Out of the Oven — Warm` (pulsing terracotta ember)
  - `Cooling on Rack` (caramel amber)
  - `In Deck Oven — Ready at 10:30`
  - `Limited Batch — 4 Left` (real-time dynamic stock decrements)
  - `Sold Out for Today`
- Instant **"Réserver ce Lot"** one-click batch reservation.

### 🎁 4. Custom Pastry Box & Event Tier Calculator
- Interactive box builder with automatic volume discounts:
  - **6-Piece Box:** Save 8%
  - **12-Piece Box:** Save 15%
  - **24-Piece Event & Office Écrin:** Save 22%
- **Interactive Visual Compartment Grid:** Velvet box slots (6, 12, or 24 alvéoles) that visually populate with pastry thumbnails as items are added.
- Dietary allergen filter bar (*Nut-Free*, *Vegetarian*, *Vegan Sourdough*, *Low-Gluten Long Ferment*).

### 🧭 5. 6-Axis 3D Sensory Flavor & Pairing Radar
- Interactive SVG polygon radar evaluating:
  *Feuilletage (Butter Lamination)* • *Douceur (Sweetness)* • *Acidité Fruitée (Fruit Acidity)* • *Praliné Torréfié (Roasted Praline)* • *Croustillant (Crumb Crispness)* • *Fermentation (Fermentation Depth)*
- Physics-based **3D perspective tilt card** (`rotateX`, `rotateY`) on mouse hover.
- Sommelier pairing recommendations for specialty coffees, grand cru teas, and champagnes.

### 🔬 6. Drag-to-Slide Lamination Comparer
- W3C pointer-captured slider comparing raw **27-layer Isigny AOP butter tourage** against the **golden honeycomb alveoli crumb structure**.
- WCAG keyboard slider accessibility (`ArrowLeft`, `ArrowRight`).
- Technical deck specs: *58%–82% hydration, 36h–48h levain fermentation, 215°C deck heat, 84% butterfat*.

### 🗺️ 7. Foot-Traffic & Walking Directions Hub
- Real-time queue indicator (*"Under 3 mins wait"*).
- Walking distance from nearby Paris Métro stations (*Sèvres-Babylone: 3 min*, *Rue du Bac: 5 min*).
- Outdoor heated terrace seating and dog-friendly credentials.
- Interactive toggle between storefront architecture photo and Google Maps navigation route.

### 🛍️ 8. Click & Collect Drawer with Express Priority Pass
- **Step 1:** Review reserved items and custom gift boxes.
- **Step 2:** Tactile morning pickup window selector (`07:30–08:00`, `08:30–09:00`, etc.), customer details, and custom gift ribbon calligraphy note.
- **Step 3:** Instant skip-the-line digital pass with unique order code `#MD-xxx`, QR barcode mockup, and one-click Google Maps walking directions.

### ⚖️ 9. European Compliance & Privacy
- **GDPR / RGPD Cookie Consent Banner** with category toggles (Necessary, Analytics, Concierge) persisted in `localStorage`.
- Fully working legal modals:
  - **Impressum / Mentions Légales** (EU / DACH compliant, RCS Paris, SIRET, TVA)
  - **Privacy Policy (RGPD)**
  - **Terms of Service (CGV / AGB)**

---

## ⚙️ Artisan Craft & Fournil Gear

In traditional French haute boulangerie, craftsmanship relies heavily on high-precision artisanal gear and ancestral raw materials:

| Equipment / Raw Ingredient | Role & Specification | Impact on Texture & Flavor |
| :--- | :--- | :--- |
| **Four à Sole Bongard Cervap** | Multi-deck steam-tube hearth baking oven heated to 215°C–240°C with volcanic stone hearth plates. | Produces a thin, blistered, caramelized crust (*réaction de Maillard*) with gentle conduction heat. |
| **Laminoir Rondo Rondomat** | Precision motorized reverser dough sheeter with calibrated thickness rollers down to 1.8mm. | Creates uniform 27-layer micro-lamination without shearing or melting butter blocks. |
| **Chambre de Fermentation Pousse Lente** | Temperature-controlled retardation proofer at 12°C–14°C with 82% ambient humidity. | Slow 36h–48h fermentation yields deep lactic aromas, wild honey notes, and high digestibility. |
| **Beurre d'Isigny AOP (84% MG)** | Protected Designation of Origin French butter churned in Normandy from summer pastures. | Exceptional plasticity, distinct hazelnut notes, and optimal melting point (32°C). |
| **Farines sur Meule T65 & T80** | Ancient heritage grains stone-ground by Moulin de Brasseuil (Label Rouge & Bio). | Retains wheat germ oil and natural enzymes, creating rich amber honeycomb alveoli. |
| **Levain-Chef Vivant (1924)** | 100-year-old sourdough starter refreshed daily with rainwater and whole rye flour. | Gentle acetic-lactic balance, natural keeping quality, and complex sourdough acidity. |

---

## 🎨 The Gourmand Design System

The visual language draws inspiration from warm oven embers, rich dark chocolate ganache, and melted Normandy butter:

```css
:root {
  /* Rich, mouth-watering French Haute Pâtisserie Palette */
  --bg-stone-ivory:       #130B07; /* Deep roasted espresso & dark chocolate ganache */
  --bg-creme-surface:     #1E120B; /* Warm caramelized crust & praline card surface */
  --surface-espresso-deep:#0D0704; /* Deepest roast chocolate base */
  --surface-espresso-warm:#28170F; /* Roasted coffee bean borders */
  --accent-butter:        #F5B338; /* Molten golden Isigny butter */
  --accent-butter-gold:   #E59B24; /* Caramelized amber honey */
  --accent-butter-light:  #FDF7EE; /* Chantilly whipped cream */
  --accent-terracotta:    #D95A2B; /* Crispy baked 215°C puff pastry crust */
  --accent-bordeaux:      #731726; /* Dark ruby berry ganache */
  --text-primary:         #FAF3EA; /* Warm chantilly cream text */
  --text-muted:           #C4AEA0; /* Café crème / toasted almond secondary text */
}
```

### Typography Hierarchy
- **Editorial Headings:** `Playfair Display` (weights 600, 700, italic accents) loaded via Google Fonts preconnect.
- **UI & Numerical Data:** `Plus Jakarta Sans` (weights 400, 500, 600, 700) with fluid `clamp()` responsive scaling.

---

## 📂 Component Architecture

Every section is strictly separated into its own modular component for maintainability:

```text
src/
├── types/
│   └── patisserie.ts                # TypeScript interfaces (pastries, box tiers, schedule, currencies)
├── data/
│   └── patisserieData.ts            # Signature creations, bake waves, sensory scores, FR/EN/DE translations
├── context/
│   └── PatisserieContext.tsx        # Global state (Cart, Box builder, Allergens, Currency, Language, GDPR)
├── hooks/
│   ├── useScreenObserver.ts         # Viewport dimensions, aspect ratio, orientation, device detection
│   └── useTypewriter.ts             # Accessible editorial typewriter with reduced-motion support
├── components/
│   ├── Navbar.tsx                   # Glassmorphic header, language/currency selectors, oven status pill
│   ├── HeroSection.tsx              # Magazine hero with typewriter headline & ambient glow
│   ├── FullScreenHeroVideo.tsx      # 16:9 cinematic widescreen video with multi-layer background fade
│   ├── BakingCroissantExperience.tsx# Interactive 4-stage masterclass with steam injection & crust crackle
│   ├── LiveBakeSchedule.tsx         # Real-time deck oven schedule with stock counts & batch reservation
│   ├── PastryBoxCalculator.tsx      # 6/12/24 box builder with visual velvet compartment grid
│   ├── SensoryPairingWheel.tsx      # 6-axis SVG radar polygon with 3D perspective mouse tilt
│   ├── LaminationComparer.tsx       # Pointer-captured Before/After tourage vs crumb slider
│   ├── WalkingTrafficMapHub.tsx     # Foot-traffic hub, métro walk times, terrace status, Google Maps
│   ├── ClickAndCollectDrawer.tsx    # Slide-out 3-step checkout with instant #MD-xxx priority pass
│   ├── EuropeanCompliance.tsx       # Compact legal footer, GDPR banner, Impressum/Privacy/CGV modals
│   └── ResponsiveImage.tsx          # Zero-CLS image wrapper with shimmer skeleton fallback
├── tests/
│   ├── patisserie.test.tsx          # Unit tests for pricing, currencies, discounts, and allergens
│   ├── components.test.tsx          # Integration tests for drawer checkout, navbar, and legal modals
│   ├── improvements.test.tsx        # Tests for steam injection, crust sound synthesis, and stage clicks
│   └── videoHero.test.tsx           # Tests for 16:9 ratio, soundless playback, and contrast verification
├── App.tsx                          # Application root layout
├── index.css                        # Tailwind directives and custom gourmand design tokens
└── main.tsx                         # React 18 DOM mount point
```

---

## ⚙️ GitHub "About" Gear Metadata (Fill-in Guide)

When configuring the **About** section on your GitHub repository (click the ⚙️ gear icon at the top right of your GitHub repository page):

### 📝 1. Description
```text
🥐 Maison Dorée — Haute boulangerie & pâtisserie artisanale. Featuring 16:9 cinematic looping video, live morning deck schedule, interactive box tier calculator, 3D flavor radar, and Click & Collect checkout. Built with Vite, React, TypeScript & Tailwind CSS.
```

### 🌐 2. Website URL
```text
https://maison-doree-patisserie.vercel.app
```
*(or your custom domain)*

### 🏷️ 3. Topics (Keywords / Tags)
Copy and paste these tags into the **Topics** field:
```text
react, typescript, vite, tailwindcss, framer-motion, patisserie, bakery, boulangerie, ecommerce, luxury-design, click-and-collect, responsive-design, vitest, web-audio-api, glassmorphism
```

### ☑️ 4. Include in home page
- [x] **Releases**
- [ ] **Packages**
- [x] **Environments**

---

## 🚀 Quick Start

### Prerequisites
- **Node.js:** v18.0.0 or later (v20+ recommended)
- **Package Manager:** `npm`, `pnpm`, or `yarn`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ishruq1317/maison-doree-patisserie.git

# 2. Enter project folder
cd maison-doree-patisserie

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open your browser at: **`http://localhost:5173`** (or the port displayed in your terminal).

---

## 🧪 Testing & Quality Assurance

The codebase includes **28 automated unit and integration tests** built with Vitest and React Testing Library:

```bash
# Run automated test suites
npm test

# Run production build & verify TypeScript compilation
npm run build

# Preview production build locally
npm run preview
```

### Test Coverage Highlights:
- **Pricing & Currency Engine:** Accurate exchange calculations across `EUR (€)`, `GBP (£)`, and `CHF`.
- **Volume Tier Discounts:** Validation of 8%, 15%, and 22% tier savings and box-full enforcement.
- **Accessible Slider Controls:** Keyboard slider navigation (`ArrowLeft`/`ArrowRight`) and pointer capture.
- **3-Step Checkout Flow:** Cart accumulation, pickup window selection, and priority pass generation with `#MD-xxx` order codes.
- **Cinematic Video Verification:** Verification of `aspect-video` (16:9), `autoPlay`, `muted={true}`, and absence of pause controls.
- **Legal Compliance:** Functional verification of Impressum, RGPD, and CGV modal dialogs.

---

## 🌐 Deployment on Vercel

The application is pre-configured for zero-configuration deployment on **Vercel**:

1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and import the **`ishruq1317/maison-doree-patisserie`** repository.
3. Vercel will automatically recognize the Vite setup:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**.

---

## 📄 License & Credits

Distributed under the **MIT License**.

- **Art Direction & Engineering:** Maison Dorée Creative Frontend Team
- **Photography & Assets:** Authentic French boulangerie photography via Unsplash (AOP Isigny, Valrhona, Bronte Pistachio)
- **Typography:** `Playfair Display` by Claus Eggers Sørensen & `Plus Jakarta Sans` by Tokotype

<div align="center">
  <sub>Fait avec passion et levain vivant au cœur de Paris.</sub>
</div>
