import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Star, Leaf, Award, Heart } from 'lucide-react';
import aboutImage from '@assets/images/about-story.jpg';

export default function AboutPage() {
  return (
    <PageLayout>
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="font-sans font-bold tracking-[0.3em] uppercase text-sm mb-6 block text-secondary">
            Our Heritage
          </span>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 max-w-4xl mx-auto leading-tight">
            Baked with Love in <br/> New Delhi
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 lg:pr-12">
              <h2 className="text-4xl font-serif text-primary mb-8">The BisKora Story</h2>
              <div className="space-y-6 text-lg text-muted-foreground font-sans leading-relaxed">
                <p>
                  BisKora began with a simple belief: that a cookie should be more than just a sweet treat. It should be a moment of comfort, a nostalgic memory, and a testament to artisanal craftsmanship.
                </p>
                <p>
                  Based in the heart of New Delhi, our bakery is a haven for those who appreciate the finer things. We blend traditional Indian flavor profiles like Elaichi, Desi Ghee, and Ragi with classic bakery techniques to create something truly unique.
                </p>
                <p>
                  Every batch is mixed, rolled, and baked by hands that care. We never use artificial preservatives or compromises. From our kitchen to your home, "YOUR TASTY BITES" isn't just a tagline—it's our promise.
                </p>
              </div>
            </div>
            <div className="flex-1 w-full relative">
              <div className="aspect-[4/5] overflow-hidden rounded-sm relative">
                <img 
                  src={aboutImage} 
                  alt="Artisan baking" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative block */}
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-secondary/10 -z-10 rounded-sm"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-primary mb-4">Our Core Values</h2>
            <div className="w-16 h-[1px] bg-secondary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <ValueCard 
              icon={<Star />}
              title="Purity"
              description="We use unadulterated ingredients. Real butter, pure desi ghee, and natural sweeteners."
            />
            <ValueCard 
              icon={<Award />}
              title="Craftsmanship"
              description="Artisanal methods over mass production. Every cookie is crafted with meticulous attention to detail."
            />
            <ValueCard 
              icon={<Heart />}
              title="Quality"
              description="Rigorous standards ensure that every bite you take is consistently perfect."
            />
            <ValueCard 
              icon={<Leaf />}
              title="Indulgence"
              description="Wholesome doesn't mean boring. Our bakes are rich, flavorful, and deeply satisfying."
            />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center text-secondary mb-6">
        {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
      </div>
      <h3 className="font-serif text-2xl text-primary mb-4">{title}</h3>
      <p className="font-sans text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
