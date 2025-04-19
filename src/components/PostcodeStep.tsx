
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
  const [houseResults, setHouseResults] = useState<any[]>([]);
  const [senateResults, setSenateResults] = useState<any[]>([]);

  const handleSearch = async () => {
    // Validate postcode
    if (!postcode.trim() || !/^\d{4}$/.test(postcode)) {
      setError("Please enter a valid 4-digit Australian postcode");
      return;
    }

    setIsSearching(true);
    setError(null);
    setHouseResults([]);
    setSenateResults([]);

    try {
      // Fetch House of Representatives candidates
      const { data: houseData, error: houseError } = await supabase
        .from('House of Representatives Candidates')
        .select('*')
        .eq('division', mapPostcodeToElectorate(postcode));

      if (houseError) throw houseError;

      // Fetch Senate candidates
      const { data: senateData, error: senateError } = await supabase
        .from('Senate Candidates')
        .select('*')
        .eq('state', mapPostcodeToState(postcode));

      if (senateError) throw senateError;

      setHouseResults(houseData || []);
      setSenateResults(senateData || []);

      if ((!houseData || houseData.length === 0) && (!senateData || senateData.length === 0)) {
        setError("No candidates found for this postcode");
        return;
      }

      // For compatibility with existing code, create an electorate object
      const electorate: Electorate = {
        id: "1",
        name: mapPostcodeToElectorate(postcode),
        state: mapPostcodeToState(postcode),
        candidates: [
          ...(houseData || []).map((candidate) => ({
            id: `house-${candidate.ballotPosition}`,
            name: `${candidate.ballotGivenName} ${candidate.surname}`,
            party: candidate.partyBallotName,
            email: "contact@example.com", // This would need to be added to the database
            policies: [], // This would need to be added to the database
          })),
        ],
      };

      onContinue(electorate);
    } catch (err) {
      console.error("Error searching candidates:", err);
      setError("Error searching for candidates. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // These functions would need to be replaced with actual mapping logic
  const mapPostcodeToElectorate = (postcode: string) => {
    // This is a placeholder mapping
    return "Melbourne";
  };

  const mapPostcodeToState = (postcode: string) => {
    // This is a placeholder mapping
    return "VIC";
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
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...
              </>
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

        {(houseResults.length > 0 || senateResults.length > 0) && (
          <div className="mt-6 space-y-4">
            {houseResults.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">House of Representatives Candidates</h3>
                <div className="bg-white rounded-lg shadow divide-y">
                  {houseResults.map((candidate) => (
                    <div key={candidate.ballotPosition} className="p-4">
                      <div className="font-medium">{candidate.ballotGivenName} {candidate.surname}</div>
                      <div className="text-sm text-gray-600">{candidate.partyBallotName}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {senateResults.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Senate Candidates</h3>
                <div className="bg-white rounded-lg shadow divide-y">
                  {senateResults.map((candidate) => (
                    <div key={candidate.ballotPosition} className="p-4">
                      <div className="font-medium">{candidate.ballotGivenName} {candidate.surname}</div>
                      <div className="text-sm text-gray-600">{candidate.partyBallotName}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
