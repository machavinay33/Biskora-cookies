import React from 'react';
import { Link } from 'wouter';
import { BiskoraLogo } from '../ui/logo';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#4A2912] text-[#FDF6EC] py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1 flex flex-col items-start">
            <BiskoraLogo className="h-20 w-48 mb-6 filter brightness-0 invert opacity-90" />
            <p className="text-[#FDF6EC]/80 font-sans text-sm leading-relaxed max-w-xs">
              Handcrafted premium cookies and dry cakes from New Delhi. Baked with love, passion, and the finest ingredients.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 text-[#B86BB5]">Explore</h4>
            <ul className="space-y-4 font-sans text-sm text-[#FDF6EC]/80">
              <li><Link href="/products" className="hover:text-white transition-colors">Our Collection</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Brand Story</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Wholesale & B2B</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 text-[#B86BB5]">Categories</h4>
            <ul className="space-y-4 font-sans text-sm text-[#FDF6EC]/80">
              <li><Link href="/products?category=Traditional" className="hover:text-white transition-colors">Traditional Flavors</Link></li>
              <li><Link href="/products?category=Healthy" className="hover:text-white transition-colors">Healthy & Sugar-Free</Link></li>
              <li><Link href="/products?category=Gourmet" className="hover:text-white transition-colors">Gourmet Selection</Link></li>
              <li><Link href="/products?category=Classic" className="hover:text-white transition-colors">Classic Favorites</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 text-[#B86BB5]">Connect</h4>
            <ul className="space-y-4 font-sans text-sm text-[#FDF6EC]/80">
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#B86BB5]" />
                <span>New Delhi, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#B86BB5]" />
                <a href="tel:+918076329675" className="hover:text-white transition-colors">+91 80763 29675</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#B86BB5]" />
                <a href="mailto:info@biskora.com" className="hover:text-white transition-colors">info@biskora.com</a>
              </li>
              <li className="flex items-center gap-3 pt-2">
                <a href="https://instagram.com/biskoraofficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5 text-[#B86BB5]" />
                  <span>@biskoraofficial</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#FDF6EC]/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans text-[#FDF6EC]/60">
          <p>&copy; {new Date().getFullYear()} BisKora Cookies. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/admin/login" className="hover:text-white transition-colors">Admin Login</Link>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
