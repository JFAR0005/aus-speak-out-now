
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Terms from "@/components/Terms";
import Privacy from "@/components/Privacy";

const PrivacyAndTerms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto py-8 px-4">
        <Button variant="outline" asChild className="mb-8">
          <Link to="/">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-12 text-aus-green">
            Privacy Policy & Terms of Use
          </h1>
          
          <Terms />
          <Privacy />

          <p className="text-sm text-muted-foreground text-center mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyAndTerms;
