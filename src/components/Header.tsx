
import React from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleHomeClick = () => {
    // Reset the local storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Navigate to home and refresh the page to ensure a complete reset
    window.location.href = "/";
    
    // Show confirmation toast
    toast({
      title: "Starting Fresh",
      description: "Your selections have been cleared. You can start a new letter.",
    });
  };

  return (
    <header className="bg-aus-green text-white w-full py-4 px-6 md:px-8 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img 
            src="/lovable-uploads/1c95a376-5397-442f-8c2a-7ceaccdb900f.png" 
            alt="Australia Speak Out Now Logo" 
            className="h-16 w-auto"
          />
        </div>
        <div className="flex items-center gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="bg-white text-aus-green hover:bg-gray-100">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Going back to home will clear all your current selections and progress. You'll start fresh.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleHomeClick}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <p className="hidden md:block text-sm">Free Political Action Platform</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
