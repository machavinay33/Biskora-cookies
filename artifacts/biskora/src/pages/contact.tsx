import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { MapPin, Phone, Mail, Instagram } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateOrder } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '', orderType: 'General Inquiry' });
  const { toast } = useToast();
  const createOrder = useCreateOrder();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createOrder.mutate(
      { data: formData },
      {
        onSuccess: () => {
          toast({
            title: "Message Sent",
            description: "Thank you for reaching out. We will get back to you soon.",
          });
          setFormData({ name: '', email: '', phone: '', message: '', orderType: 'General Inquiry' });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to send message. Please try again or call us directly.",
            variant: "destructive"
          });
        }
      }
    );
  };

  return (
    <PageLayout>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-serif text-primary mb-6">Get in Touch</h1>
            <p className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto">
              Whether you have a question about our ingredients, want to place a custom order, or just want to say hello—we'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h3 className="font-serif text-2xl text-primary mb-8">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-secondary shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-sm uppercase tracking-wider text-primary mb-1">Phone</h4>
                      <a href="tel:+918076329675" className="text-muted-foreground hover:text-secondary transition-colors">+91 80763 29675</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-secondary shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-sm uppercase tracking-wider text-primary mb-1">Email</h4>
                      <a href="mailto:info@biskora.com" className="text-muted-foreground hover:text-secondary transition-colors">info@biskora.com</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-secondary shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-sm uppercase tracking-wider text-primary mb-1">Location</h4>
                      <p className="text-muted-foreground leading-relaxed">New Delhi, India<br/>(Delivery across India)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-secondary shrink-0">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-sm uppercase tracking-wider text-primary mb-1">Instagram</h4>
                      <a href="https://instagram.com/biskoraofficial" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-secondary transition-colors">@biskoraofficial</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3 bg-card p-8 md:p-12 border border-border">
              <h3 className="font-serif text-2xl text-primary mb-8">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-primary font-sans text-xs uppercase tracking-wider">Full Name</Label>
                    <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-background border-border rounded-none h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-primary font-sans text-xs uppercase tracking-wider">Phone Number</Label>
                    <Input id="phone" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-background border-border rounded-none h-12" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-primary font-sans text-xs uppercase tracking-wider">Email Address</Label>
                  <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-background border-border rounded-none h-12" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-primary font-sans text-xs uppercase tracking-wider">Inquiry Type</Label>
                  <Select value={formData.orderType} onValueChange={v => setFormData({...formData, orderType: v})}>
                    <SelectTrigger className="bg-background border-border rounded-none h-12">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-border">
                      <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                      <SelectItem value="Custom Order">Custom Order</SelectItem>
                      <SelectItem value="Corporate Gifting">Corporate Gifting</SelectItem>
                      <SelectItem value="Wholesale">Wholesale</SelectItem>
                      <SelectItem value="Feedback">Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-primary font-sans text-xs uppercase tracking-wider">Message</Label>
                  <Textarea id="message" required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="bg-background border-border rounded-none min-h-[150px] resize-none" />
                </div>
                
                <Button type="submit" disabled={createOrder.isPending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-widest text-sm py-6 mt-4">
                  {createOrder.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Message"}
                </Button>

              </form>
            </div>

          </div>
        </div>
      </section>
    </PageLayout>
  );
}
