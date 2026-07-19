import React, { useState } from 'react';
import { useGetProducts } from '@workspace/api-client-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateOrder } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const CATEGORIES = ['All', 'Traditional', 'Healthy', 'Classic', 'Spiced', 'Gourmet', 'Tropical', 'Premium'];

// Map image summaries to local assets
const getLocalImage = (url: string) => {
  if (url.includes('Ghee')) return '/attached_assets/images/product-1-desi-ghee.jpg';
  if (url.includes('Honey')) return '/attached_assets/images/product-2-honey-oats.jpg';
  if (url.includes('Butter')) return '/attached_assets/images/product-3-butter.jpg';
  if (url.includes('Elaichi')) return '/attached_assets/images/product-4-elaichi.jpg';
  if (url.includes('Ragi')) return '/attached_assets/images/product-5-ragi.jpg';
  if (url.includes('Choco')) return '/attached_assets/images/product-6-choco-vanilla.jpg';
  if (url.includes('Coconut')) return '/attached_assets/images/product-7-coconut.jpg';
  if (url.includes('Dry')) return '/attached_assets/images/product-8-dry-fruit.jpg';
  if (url.includes('Sugar')) return '/attached_assets/images/product-9-sugar-free.jpg';
  if (url.includes('Multi')) return '/attached_assets/images/product-10-multigrain.jpg';
  return url;
};

export function ProductsGrid({ defaultCategory = 'All' }: { defaultCategory?: string }) {
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  
  const { data: products, isLoading } = useGetProducts(
    activeCategory !== 'All' ? { category: activeCategory } : undefined,
    { query: { queryKey: ['products', activeCategory] } }
  );

  const [inquireProduct, setInquireProduct] = useState<any | null>(null);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 text-sm font-sans tracking-widest uppercase transition-all duration-300 rounded-full border ${
              activeCategory === category 
                ? 'bg-primary border-primary text-primary-foreground' 
                : 'bg-transparent border-border text-muted-foreground hover:border-primary hover:text-primary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {products?.map((product) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={product.id}
              className="group bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img 
                  src={getLocalImage(product.imageUrl)} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {!product.isAvailable && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="font-sans font-bold tracking-widest uppercase text-sm text-primary px-4 py-2 bg-background border border-primary">
                      Out of Stock
                    </span>
                  </div>
                )}
                {product.isAvailable && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-secondary text-white hover:bg-secondary/90 font-sans rounded-sm px-3 py-1">
                      {product.category}
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-serif text-xl text-primary mb-2 line-clamp-1">{product.name}</h3>
                <p className="font-sans text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                  {product.highlights?.slice(0,3).map((highlight: string, i: number) => (
                    <span key={i} className="text-xs font-sans text-primary/70 bg-primary/5 px-2 py-1 rounded-md">
                      {highlight}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <span className="font-serif text-xl text-primary font-medium">
                    {formatPrice(product.price)}
                  </span>
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-6"
                    disabled={!product.isAvailable}
                    onClick={() => setInquireProduct(product)}
                  >
                    Inquire
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {products?.length === 0 && (
        <div className="text-center py-20">
          <p className="font-serif text-2xl text-muted-foreground">No cookies found in this category.</p>
        </div>
      )}

      {/* Inquiry Dialog */}
      <InquiryDialog product={inquireProduct} onClose={() => setInquireProduct(null)} />
    </div>
  );
}

function InquiryDialog({ product, onClose }: { product: any, onClose: () => void }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const { toast } = useToast();
  
  const createOrder = useCreateOrder();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    createOrder.mutate(
      { 
        data: { 
          ...formData, 
          orderType: `Inquiry: ${product.name}`,
        } 
      },
      {
        onSuccess: () => {
          toast({
            title: "Inquiry Sent",
            description: "We'll get back to you shortly about this product.",
          });
          onClose();
          setFormData({ name: '', email: '', phone: '', message: '' });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to send inquiry. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  };

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border rounded-xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-primary">Inquire About</DialogTitle>
          <DialogDescription className="font-sans text-muted-foreground">
            {product?.name} - {product && formatPrice(product.price)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-primary font-sans text-xs uppercase tracking-wider">Name</Label>
            <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-background border-border focus-visible:ring-secondary rounded-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-primary font-sans text-xs uppercase tracking-wider">Email</Label>
            <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-background border-border focus-visible:ring-secondary rounded-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-primary font-sans text-xs uppercase tracking-wider">Phone</Label>
            <Input id="phone" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-background border-border focus-visible:ring-secondary rounded-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-primary font-sans text-xs uppercase tracking-wider">Quantity / Special Requests</Label>
            <Textarea id="message" required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="bg-background border-border focus-visible:ring-secondary rounded-none min-h-[100px]" />
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={createOrder.isPending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-widest text-sm py-6">
              {createOrder.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Inquiry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
