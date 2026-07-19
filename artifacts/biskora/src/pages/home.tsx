import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ProductsGrid } from '@/components/products/ProductsGrid';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Leaf, Heart } from 'lucide-react';
import heroBg from '@assets/images/hero-bg.jpg';

export default function Home() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        {/* Background image & overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Artisan bakery table" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background"></div>
        </div>

        {/* Content */}
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto flex flex-col items-center"
          >
            <span className="text-secondary font-sans font-bold tracking-[0.3em] uppercase text-sm mb-6 block drop-shadow-md">
              From New Delhi, With Love
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-tight drop-shadow-lg">
              The Art of<br />
              <span className="italic text-[#FDF6EC]">Fine Baking</span>
            </h1>
            <p className="text-lg md:text-xl text-[#FDF6EC]/90 font-sans mb-10 max-w-xl mx-auto drop-shadow-md">
              Handcrafted premium cookies & dry cakes. Baked in small batches with pure ingredients and absolute passion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-8 py-6 text-sm tracking-widest uppercase h-auto"
                onClick={() => {
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Collection
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary rounded-none px-8 py-6 text-sm tracking-widest uppercase h-auto backdrop-blur-sm bg-black/10"
              >
                Our Story
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/80"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-xs uppercase tracking-widest font-sans">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/80 to-transparent"></div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center text-secondary">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-primary">Premium Quality</h3>
              <p className="font-sans text-muted-foreground text-sm leading-relaxed">
                We source only the finest ingredients, never compromising on the purity of our bakes.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center text-secondary">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-primary">Handcrafted</h3>
              <p className="font-sans text-muted-foreground text-sm leading-relaxed">
                Every cookie is made in small batches by artisan bakers who take pride in their craft.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center text-secondary">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-primary">Wholesome</h3>
              <p className="font-sans text-muted-foreground text-sm leading-relaxed">
                From Desi Ghee to Multi-grains, we bake treats that nourish as much as they indulge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products-section" className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-secondary font-sans font-bold tracking-widest uppercase text-xs mb-4 block">
              Our Bakes
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6">
              The Artisan Collection
            </h2>
            <div className="w-24 h-[1px] bg-secondary mx-auto"></div>
          </div>
          
          <ProductsGrid />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">Want to stock our cookies?</h2>
          <p className="text-lg text-primary-foreground/80 font-sans mb-10">
            We offer wholesale pricing, bulk orders for events, and contract manufacturing for cafes and premium retail stores.
          </p>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary rounded-none px-8 py-6 text-sm tracking-widest uppercase h-auto group"
            onClick={() => window.location.href = '/services'}
          >
            Explore B2B Services
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}
