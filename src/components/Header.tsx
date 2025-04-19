
import React, { useState, useRef, useEffect } from "react";
import { processLogo } from "../utils/imageUtils";

const Header: React.FC = () => {
  const [isProcessingLogo, setIsProcessingLogo] = useState(false);
  const logoRef = useRef<HTMLImageElement>(null);
  const [processedLogoUrl, setProcessedLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const processExistingLogo = async () => {
      if (logoRef.current && logoRef.current.complete) {
        try {
          setIsProcessingLogo(true);
          
          // Fetch the image as a blob
          const response = await fetch(logoRef.current.src);
          const blob = await response.blob();
          
          // Process the logo
          const processedLogo = await processLogo(blob);
          
          // Create URL for processed logo
          const processedUrl = URL.createObjectURL(processedLogo);
          setProcessedLogoUrl(processedUrl);
          
        } catch (error) {
          console.error("Error processing logo:", error);
        } finally {
          setIsProcessingLogo(false);
        }
      }
    };
    
    // Process the logo when component mounts
    if (logoRef.current) {
      // Add load event listener if image is not yet loaded
      if (!logoRef.current.complete) {
        logoRef.current.onload = processExistingLogo;
      } else {
        processExistingLogo();
      }
    }
    
    // Clean up object URLs on unmount
    return () => {
      if (processedLogoUrl) {
        URL.revokeObjectURL(processedLogoUrl);
      }
    };
  }, []);

  return (
    <header className="bg-aus-green text-white w-full py-4 px-6 md:px-8 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {isProcessingLogo ? (
            <div className="h-12 w-12 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          ) : (
            <img 
              ref={logoRef}
              src={processedLogoUrl || "/lovable-uploads/1c95a376-5397-442f-8c2a-7ceaccdb900f.png"}
              alt="Australia Speak Out Now Logo" 
              className="h-12 w-auto"
            />
          )}
          <h1 className="text-lg font-bold">Australia Speak Out Now</h1>
        </div>
        <p className="hidden md:block text-sm">Free Political Action Platform</p>
      </div>
    </header>
  );
};

export default Header;
