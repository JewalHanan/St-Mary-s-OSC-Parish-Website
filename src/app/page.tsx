'use client';

import { Suspense } from 'react';
import Hero from '@/components/home/Hero';
import Ticker from '@/components/home/Ticker';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import ImageSlider from '@/components/home/ImageSlider';
import { ParallaxSection } from '@/components/ui/ParallaxSection';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <>
      {/* Hero: church logo + name + center-stage event banner slider */}
      <Suspense fallback={<div style={{ height: '100vh' }} />}>
        <Hero />
      </Suspense>

      {/* Homepage admin slider — same center-stage style */}
      <ImageSlider />

      <Ticker />
      <UpcomingEvents />

      <ParallaxSection
        backgroundImage="https://images.unsplash.com/photo-1548625361-ecaa842cebb0?auto=format&fit=crop&w=1920&q=80"
        speed={0.6}
        overlayOpacity={0.7}
      >
        <h2 style={{ fontFamily: 'var(--font-heading-system)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-gold)', marginBottom: '1.5rem' }}>
          Welcome to Our Parish
        </h2>
        <p style={{ fontFamily: 'var(--font-body-system)', fontSize: '1.5rem', color: 'var(--color-ivory)', marginBottom: '2rem', maxWidth: '800px', margin: '0 auto 2rem' }}>
          St. Mary&apos;s Malankara Orthodox Church stands as a beacon of orthodox faith, continuing the rich heritage and traditions established by St. Thomas the Apostle.
        </p>
        <Button variant="primary">Learn More About Us</Button>
      </ParallaxSection>
    </>
  );
}
