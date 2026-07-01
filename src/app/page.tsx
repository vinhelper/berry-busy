import { SiteHeader } from '@/components/landing/site-header';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { Changelog } from '@/components/landing/changelog';
import { SiteFooter } from '@/components/landing/site-footer';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Features />
        <Changelog />
      </main>
      <SiteFooter />
    </div>
  );
}
