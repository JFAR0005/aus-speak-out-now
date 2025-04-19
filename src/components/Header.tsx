
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-aus-green text-white w-full py-4 px-6 md:px-8 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img 
            src="/lovable-uploads/1c95a376-5397-442f-8c2a-7ceaccdb900f.png" 
            alt="Australia Speak Out Now Logo" 
            className="h-16 w-auto" // Increased from h-12 to h-16
          />
        </div>
        <p className="hidden md:block text-sm">Free Political Action Platform</p>
      </div>
    </header>
  );
};

export default Header;
