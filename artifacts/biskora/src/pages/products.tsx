import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ProductsGrid } from '@/components/products/ProductsGrid';

export default function ProductsPage() {
  return (
    <PageLayout>
      <div className="bg-background py-16 md:py-24 border-b border-border/50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary mb-6">
            Our Collection
          </h1>
          <p className="text-lg text-muted-foreground font-sans">
            Explore our curated selection of artisanal cookies and biscuits. Baked fresh in New Delhi with premium ingredients and traditional recipes.
          </p>
        </div>
      </div>
      
      <div className="bg-card/30 py-16">
        <div className="container mx-auto px-4">
          <ProductsGrid />
        </div>
      </div>
    </PageLayout>
  );
}
