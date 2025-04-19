
import React from "react";
import { MapPin } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="bg-aus-green text-white w-full py-4 px-6 md:px-8 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="h-6 w-6 text-aus-gold" />
          <h1 className="text-xl md:text-2xl font-bold">Activate Australia</h1>
        </div>
        <p className="hidden md:block text-sm">Politician Contact Tool</p>
      </div>
    </header>
  );
};

export default Header;
