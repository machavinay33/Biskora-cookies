import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Package, Store, Factory, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateOrder } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import servicesImage from '@assets/images/services-wholesale.jpg';

export default function ServicesPage() {
  const [inquireType, setInquireType] = useState<string | null>(null);

  return (
    <PageLayout>
      {/* Header */}
      <section className="bg-card py-20 border-b border-border">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-serif text-primary mb-6">Partner With Us</h1>
          <p className="text-lg text-muted-foreground font-sans">
            Beyond our retail collection, BisKora offers comprehensive B2B services. From supplying your cafe to creating your own brand of premium cookies.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
            
            <ServiceBlock 
              icon={<Store />}
              title="Wholesale Supply"
              description="Perfect for cafes, specialty food stores, and hotels. Stock our premium BisKora collection to delight your customers with authentic, artisanal bakes. We offer attractive margins and consistent quality."
              onInquire={() => setInquireType("Wholesale")}
            />
            
            <ServiceBlock 
              icon={<Package />}
              title="Bulk Orders & Corporate Gifting"
              description="Celebrate milestones, festivals, and corporate events with bespoke cookie boxes. Custom packaging options available to include your company branding alongside our premium treats."
              onInquire={() => setInquireType("Bulk Orders")}
            />
            
            <ServiceBlock 
              icon={<Factory />}
              title="Contract Manufacturing"
              description="Leverage our state-of-the-art facility and expert bakers to scale your production. We follow stringent quality controls to manufacture baked goods to your exact specifications."
              onInquire={() => setInquireType("Contract Manufacturing")}
            />
            
            <ServiceBlock 
              icon={<Tag />}
              title="Private Label"
              description="Launch your own brand of premium cookies without the overhead of a bakery. Choose from our proven recipes or let us develop a custom recipe exclusive to your brand."
              onInquire={() => setInquireType("Private Label")}
            />

          </div>

          <div className="w-full relative h-[400px] overflow-hidden rounded-sm">
            <img src={servicesImage} alt="Wholesale boxes" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-primary/20"></div>
          </div>
        </div>
      </section>

      {/* Inquiry Form Modal */}
      <B2BInquiryDialog 
        type={inquireType} 
        onClose={() => setInquireType(null)} 
      />
    </PageLayout>
  );
}

function ServiceBlock({ icon, title, description, onInquire }: { icon: React.ReactNode, title: string, description: string, onInquire: () => void }) {
  return (
    <div className="flex flex-col items-start bg-card p-10 border border-border hover:border-secondary transition-colors duration-300">
      <div className="w-14 h-14 rounded-none bg-primary flex items-center justify-center text-primary-foreground mb-8">
        {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
      </div>
      <h3 className="font-serif text-3xl text-primary mb-4">{title}</h3>
      <p className="font-sans text-muted-foreground leading-relaxed mb-8 flex-1">
        {description}
      </p>
      <Button 
        variant="outline" 
        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none uppercase tracking-widest text-xs px-8"
        onClick={onInquire}
      >
        Inquire Now
      </Button>
    </div>
  );
}

function B2BInquiryDialog({ type, onClose }: { type: string | null, onClose: () => void }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '', company: '' });
  const { toast } = useToast();
  const createOrder = useCreateOrder();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) return;
    
    createOrder.mutate(
      { 
        data: { 
          name: formData.name, 
          email: formData.email, 
          phone: formData.phone, 
          message: `Company: ${formData.company}\n\n${formData.message}`,
          orderType: `B2B: ${type}`,
        } 
      },
      {
        onSuccess: () => {
          toast({
            title: "Inquiry Sent",
            description: "Our B2B team will contact you within 24 hours.",
          });
          onClose();
          setFormData({ name: '', email: '', phone: '', message: '', company: '' });
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
    <Dialog open={!!type} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border rounded-none">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-primary">Inquire: {type}</DialogTitle>
          <DialogDescription className="font-sans text-muted-foreground">
            Provide your business details and we'll be in touch to discuss a partnership.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-primary font-sans text-xs uppercase tracking-wider">Contact Name</Label>
              <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-background border-border rounded-none" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-primary font-sans text-xs uppercase tracking-wider">Company Name</Label>
              <Input id="company" required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="bg-background border-border rounded-none" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-primary font-sans text-xs uppercase tracking-wider">Work Email</Label>
            <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-background border-border rounded-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-primary font-sans text-xs uppercase tracking-wider">Phone</Label>
            <Input id="phone" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-background border-border rounded-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-primary font-sans text-xs uppercase tracking-wider">Project Details / Requirements</Label>
            <Textarea id="message" required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="bg-background border-border rounded-none min-h-[100px]" />
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={createOrder.isPending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-widest text-sm py-6">
              {createOrder.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Inquiry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
