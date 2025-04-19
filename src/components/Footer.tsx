
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 px-6 border-t mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Australia Speak Out Now. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-2 md:mt-0">
            <a href="#" className="hover:text-aus-green">Privacy Policy</a>
            <a href="#" className="hover:text-aus-green">Terms of Use</a>
            <a href="#" className="hover:text-aus-green">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
