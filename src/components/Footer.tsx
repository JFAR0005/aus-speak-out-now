
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 px-6 border-t mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Australia Speak Out Now. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-2 md:mt-0">
            <Link to="/privacy-terms#privacy" className="hover:text-aus-green">Privacy Policy</Link>
            <Link to="/privacy-terms#terms" className="hover:text-aus-green">Terms of Use</Link>
            <Link to="/contact" className="hover:text-aus-green">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
