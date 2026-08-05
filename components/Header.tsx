
import React from 'react';

export const Header: React.FC = () => (
  <header className="bg-gradient-to-r from-[#134a22] to-[#1a6b2f] shadow-lg">
    <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center text-center">
      <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
        Patitour Turismo Pedagógico
      </h1>
      <p className="mt-2 text-green-100/80 text-sm md:text-base font-medium">
        Viagens que educam, momentos que marcam, experiências que transformam.
      </p>
    </div>
  </header>
);
