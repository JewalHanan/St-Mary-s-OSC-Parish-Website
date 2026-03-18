'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import Hero from '@/components/home/Hero';
import Ticker from '@/components/home/Ticker';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import ImageSlider from '@/components/home/ImageSlider';
import { ParallaxSection } from '@/components/ui/ParallaxSection';
import { Button } from '@/components/ui/Button';

import MainCountdown from '@/components/home/MainCountdown';

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
      <MainCountdown />

      <section style={{ 
        width: '100%', 
        padding: '6rem 2rem', 
        background: 'var(--bg-primary)', 
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
          <h2 className="text-3d" style={{ fontFamily: 'var(--font-heading-system)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--text-accent)', marginBottom: '1.5rem' }}>
            Welcome to Our Parish
          </h2>
          <p style={{ fontFamily: 'var(--font-body-system)', fontSize: '1.5rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            St. Mary&apos;s Malankara Orthodox Syrian Church stands as a beacon of orthodox faith, continuing the rich heritage and traditions established by St. Thomas the Apostle.
          </p>
          <Link href="/history">
            <Button variant="primary">Learn More About Us</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
