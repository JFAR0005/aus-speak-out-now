
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, AlertCircle, Loader2, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Electorate } from "../types";
import { useToast } from "@/hooks/use-toast";

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
  const [info, setInfo] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [houseResults, setHouseResults] = useState<any[]>([]);
  const [senateResults, setSenateResults] = useState<any[]>([]);
  const [mappings, setMappings] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    // Validate postcode
    if (!postcode.trim() || !/^\d{4}$/.test(postcode)) {
      setError("Please enter a valid 4-digit Australian postcode");
      return;
    }

    setIsSearching(true);
    setError(null);
    setInfo(null);
    setHouseResults([]);
    setSenateResults([]);
    setMappings([]);

    try {
      // First, get all mappings for the postcode
      const { data: mappingData, error: mappingError } = await supabase
        .from('postcode_mappings')
        .select('*')
        .eq('postcode', postcode);

      if (mappingError) throw mappingError;

      if (!mappingData || mappingData.length === 0) {
        setError("This postcode is not in our database. Please try another postcode.");
        setIsSearching(false);
        return;
      }

      setMappings(mappingData);
      console.log("Found mappings:", mappingData);

      // Fetch House of Representatives candidates for all electorates in the postcode
      const electorates = mappingData.map(m => m.electorate);
      const { data: houseData, error: houseError } = await supabase
        .from('House of Representatives Candidates')
        .select('*')
        .in('division', electorates);

      if (houseError) {
        console.error("House candidates error:", houseError);
        throw houseError;
      }

      console.log("House candidates response:", houseData);

      // Fetch Senate candidates for the state(s)
      const states = [...new Set(mappingData.map(m => m.state))];
      const { data: senateData, error: senateError } = await supabase
        .from('Senate Candidates')
        .select('*')
        .in('state', states);

      if (senateError) {
        console.error("Senate candidates error:", senateError);
        throw senateError;
      }

      console.log("Senate candidates response:", senateData);

      setHouseResults(houseData || []);
      setSenateResults(senateData || []);

      if ((!houseData || houseData.length === 0) && (!senateData || senateData.length === 0)) {
        setInfo("We've found your electorate, but no candidates are currently available in our database. This may be because the election data hasn't been loaded yet.");
      } else {
        // Show success toast
        toast({
          title: "Found your electorate",
          description: `We found ${houseData?.length || 0} House candidates and ${senateData?.length || 0} Senate candidates.`,
        });
      }

      // Use the first mapping for now (we can add selection if multiple)
      const primaryMapping = mappingData[0];
      const electorate: Electorate = {
        id: postcode,
        name: primaryMapping.electorate,
        state: primaryMapping.state,
        candidates: [
          ...(houseData || [])
            .filter(c => c.division === primaryMapping.electorate)
            .map((candidate) => ({
              id: `house-${candidate.ballotPosition}`,
              name: `${candidate.ballotGivenName || ''} ${candidate.surname || ''}`.trim(),
              party: candidate.partyBallotName || 'Independent',
              email: "contact@example.com", // Placeholder email
              policies: [],
            })),
          ...(senateData || [])
            .filter(c => c.state === primaryMapping.state)
            .map((candidate) => ({
              id: `senate-${candidate.ballotPosition}`,
              name: `${candidate.ballotGivenName || ''} ${candidate.surname || ''}`.trim(),
              party: candidate.partyBallotName || 'Independent',
              email: "contact@example.com", // Placeholder email
              policies: [],
              isSenate: true,
            })),
        ],
      };

      if (electorate.candidates.length > 0) {
        onContinue(electorate);
      } else if (mappingData.length > 0) {
        setInfo("We found your electorate information, but no candidate data is available. Please try another postcode or continue with the electorate information we found.");
        
        // Create a minimal electorate object to continue with
        const minimalElectorate: Electorate = {
          id: postcode,
          name: primaryMapping.electorate,
          state: primaryMapping.state,
          candidates: [{
            id: "placeholder",
            name: "Representative for " + primaryMapping.electorate,
            party: "Placeholder",
            email: "contact@example.com",
            policies: []
          }]
        };
        
        // Option to continue with just the electorate info
        toast({
          title: "Limited Data Available",
          description: "You can continue with basic electorate information or try another postcode.",
          action: (
            <Button 
              variant="outline" 
              onClick={() => onContinue(minimalElectorate)}
              className="bg-aus-green text-white hover:bg-aus-green/90"
            >
              Continue Anyway
            </Button>
          ),
        });
      }
    } catch (err) {
      console.error("Error searching candidates:", err);
      setError("Error searching for candidates. Please try again.");
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

        {info && (
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700">{info}</AlertDescription>
          </Alert>
        )}

        {mappings.length > 0 && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Postcode Information:</h3>
            {mappings.map((mapping, index) => (
              <div key={index} className="mb-2 last:mb-0 p-2 bg-white rounded border">
                <p><span className="font-medium">Electorate:</span> {mapping.electorate}</p>
                <p><span className="font-medium">State:</span> {mapping.state}</p>
                {mapping.locality && (
                  <p><span className="font-medium">Locality:</span> {mapping.locality}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {(houseResults.length > 0 || senateResults.length > 0) && (
          <div className="mt-6 space-y-4">
            {houseResults.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">House of Representatives Candidates</h3>
                <div className="bg-white rounded-lg shadow divide-y">
                  {houseResults.map((candidate, index) => (
                    <div key={index} className="p-4">
                      <div className="font-medium">
                        {candidate.ballotGivenName || ''} {candidate.surname || ''}
                      </div>
                      <div className="text-sm text-gray-600">{candidate.partyBallotName || 'Independent'}</div>
                      <div className="text-sm text-gray-500">Division: {candidate.division}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {senateResults.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Senate Candidates</h3>
                <div className="bg-white rounded-lg shadow divide-y">
                  {senateResults.map((candidate, index) => (
                    <div key={index} className="p-4">
                      <div className="font-medium">
                        {candidate.ballotGivenName || ''} {candidate.surname || ''}
                      </div>
                      <div className="text-sm text-gray-600">{candidate.partyBallotName || 'Independent'}</div>
                      <div className="text-sm text-gray-500">State: {candidate.state}</div>
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
            Try entering a valid Australian postcode (e.g., 2000, 3000, 2600, 3132) to see your local representatives
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostcodeStep;
