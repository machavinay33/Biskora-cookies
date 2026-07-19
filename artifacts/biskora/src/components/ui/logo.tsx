import React from 'react';

export function BiskoraLogo({ className, showTagline = true }: { className?: string, showTagline?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className || ''}`}>
      <svg 
        viewBox="0 0 400 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <text 
          x="200" 
          y="75" 
          fontFamily="'Playfair Display', serif" 
          fontWeight="800" 
          fontSize="72" 
          textAnchor="middle"
        >
          <tspan fill="#5C3317">Bis</tspan>
          <tspan fill="#B86BB5">K</tspan>
          <tspan fill="#5C3317">ora</tspan>
          <tspan fill="#B86BB5" fontSize="72">..</tspan>
          <tspan fill="#5C3317" fontSize="24" dy="-35" dx="5">™</tspan>
        </text>
        
        {showTagline && (
          <text 
            x="200" 
            y="110" 
            fontFamily="'DM Sans', sans-serif" 
            fontWeight="600" 
            fontSize="14" 
            letterSpacing="6" 
            fill="#5C3317" 
            textAnchor="middle"
          >
            YOUR TASTY BITES.
          </text>
        )}
      </svg>
    </div>
  );
}
