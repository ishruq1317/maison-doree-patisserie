import React from 'react';
import { PatisserieProvider } from './context/PatisserieContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LiveBakeSchedule } from './components/LiveBakeSchedule';
import { PastryBoxCalculator } from './components/PastryBoxCalculator';
import { SensoryPairingWheel } from './components/SensoryPairingWheel';
import { LaminationComparer } from './components/LaminationComparer';
import { WalkingTrafficMapHub } from './components/WalkingTrafficMapHub';
import { ClickAndCollectDrawer } from './components/ClickAndCollectDrawer';
import { EuropeanCompliance } from './components/EuropeanCompliance';

export const App: React.FC = () => {
  return (
    <PatisserieProvider>
      <div className="relative min-h-screen bg-stone-ivory text-espresso-deep selection:bg-butter selection:text-espresso-deep overflow-x-hidden">
        {/* Sticky Glassmorphic Header */}
        <Navbar />

        {/* Main Content Area */}
        <main>
          {/* Hero Section */}
          <HeroSection />

          {/* Flagship Feature: Live Morning Deck Bake Schedule */}
          <LiveBakeSchedule />

          {/* Mandatory Interactive Calculator: Custom Patisserie Box & Event Tier Calculator */}
          <PastryBoxCalculator />

          {/* Flagship Interactive Feature: 6-Axis Flavor & Pairing Radar */}
          <SensoryPairingWheel />

          {/* Interactive Craft Comparer: Raw 27-Layer Tourage vs. Baked Golden Crumb */}
          <LaminationComparer />

          {/* Flagship Conversion Section: Foot-Traffic & Google Maps Hub */}
          <WalkingTrafficMapHub />
        </main>

        {/* European Compliance: Footer, GDPR Consent, Legal Modals & Floating Action Dock */}
        <EuropeanCompliance />

        {/* Slide-out Click-and-Collect Drawer with 3-Step Checkout */}
        <ClickAndCollectDrawer />
      </div>
    </PatisserieProvider>
  );
};

export default App;
