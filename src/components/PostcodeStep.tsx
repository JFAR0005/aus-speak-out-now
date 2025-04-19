
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, AlertCircle } from "lucide-react";
import { lookupPostcode } from "../data/mockData";
import { Electorate } from "../types";

interface PostcodeStepProps {
  postcode: string;
  setPostcode: (postcode: string) => void;
  onContinue: (electorate: Electorate) => void;
}

const PostcodeStep: React.FC<PostcodeStepProps> = ({
  postcode,
  setPostcode,
  onContinue,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    // Validate postcode
    if (!postcode.trim() || !/^\d{4}$/.test(postcode)) {
      setError("Please enter a valid 4-digit Australian postcode");
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      const result = lookupPostcode(postcode);

      if (!result || result.electorates.length === 0) {
        setError("No electorates found for this postcode");
        return;
      }

      // For this demo, we'll just use the first electorate
      onContinue(result.electorates[0]);
    } catch (err) {
      setError("Error searching for postcode. Please try again.");
      console.error("Error searching postcode:", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Find Your Representatives</h2>
          <p className="text-gray-600 mt-2">
            Enter your postcode to find federal election candidates in your area
          </p>
        </div>

        <div className="flex space-x-2">
          <Input
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="Enter your postcode"
            className="text-lg"
            maxLength={4}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? (
              "Searching..."
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" /> Find
              </>
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium text-sm text-muted-foreground">Demo Postcodes</h3>
          <p className="text-xs text-muted-foreground mt-1">
            For demonstration, try these postcodes: 3000 (Melbourne), 2000 (Sydney), 4000 (Brisbane)
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostcodeStep;
