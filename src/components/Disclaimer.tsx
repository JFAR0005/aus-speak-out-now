
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Disclaimer = () => {
  const handleEmailClick = () => {
    window.location.href = "mailto:ausspeakoutnow@gmail.com?subject=Data Correction Request";
  };

  return (
    <div className="space-y-4">
      <Alert className="bg-amber-50 border-amber-200">
        <Info className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-amber-800">
          This project was developed by a single volunteer. While we strive for accuracy,
          we cannot guarantee all contact and party information is completely up to date.
        </AlertDescription>
      </Alert>
      
      <div className="text-sm text-gray-600">
        Found an error? Please{" "}
        <button 
          onClick={handleEmailClick}
          className="text-blue-600 hover:underline focus:outline-none"
        >
          email us
        </button>
        {" "}with the correct information.
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
        <p className="text-gray-600 mb-3">
          For any questions, corrections, or feedback, please reach out to us:
        </p>
        <Button
          variant="outline"
          onClick={handleEmailClick}
          className="inline-flex items-center"
        >
          <Mail className="mr-2 h-4 w-4" />
          ausspeakoutnow@gmail.com
        </Button>
      </div>
    </div>
  );
};

export default Disclaimer;
