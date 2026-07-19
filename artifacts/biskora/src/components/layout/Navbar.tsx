import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { BiskoraLogo } from '@/components/ui/logo';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Our Cookies' },
    { href: '/about', label: 'Our Story' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Nav Links (Left) */}
        <nav className="hidden md:flex items-center gap-8 flex-1">
          {links.slice(0, 2).map((link) => (
            <Link key={link.href} href={link.href} className={`text-sm font-medium uppercase tracking-widest transition-colors hover:text-secondary ${location === link.href ? 'text-secondary' : 'text-primary'}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Logo */}
        <div className="flex-shrink-0 flex justify-center flex-1 md:flex-none">
          <Link href="/">
            <BiskoraLogo className="h-16 w-48" showTagline={false} />
          </Link>
        </div>

        {/* Desktop Nav Links (Right) */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-end">
          {links.slice(2).map((link) => (
            <Link key={link.href} href={link.href} className={`text-sm font-medium uppercase tracking-widest transition-colors hover:text-secondary ${location === link.href ? 'text-secondary' : 'text-primary'}`}>
              {link.label}
            </Link>
          ))}
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none px-6">
            ORDER NOW
          </Button>
        </nav>
        
        {/* Mobile Spacer to center logo */}
        <div className="w-10 md:hidden" />
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="flex flex-col px-4 py-6 space-y-4">
              {links.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-serif transition-colors ${location === link.href ? 'text-secondary' : 'text-primary'}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-border">
                <Button className="w-full bg-primary text-primary-foreground rounded-none">
                  ORDER NOW
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
