
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, AlertCircle, Loader2, Info, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Electorate, ChamberType } from "../types";
import { useToast } from "@/hooks/use-toast";

interface PostcodeStepProps {
  chamberType: ChamberType | null;
  postcode: string;
  setPostcode: (postcode: string) => void;
  onContinue: (electorate: Electorate) => void;
  onPrevious: () => void;
}

const PostcodeStep: React.FC<PostcodeStepProps> = ({
  chamberType,
  postcode,
  setPostcode,
  onContinue,
  onPrevious,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [houseResults, setHouseResults] = useState<any[]>([]);
  const [senateResults, setSenateResults] = useState<any[]>([]);
  const [mappings, setMappings] = useState<any[]>([]);
  const { toast } = useToast();

  const getPlaceholderText = () => {
    if (chamberType === "senate") {
      return "Enter your postcode, suburb, or state";
    } else {
      return "Enter your postcode or suburb";
    }
  };

  const getPromptText = () => {
    if (chamberType === "senate") {
      return "Enter your location to find Senate candidates for your state";
    } else {
      return "Enter your location to find House of Representatives candidates for your electorate";
    }
  };

  const handleSearch = async () => {
    if (!postcode.trim()) {
      setError("Please enter a location to search");
      return;
    }

    setIsSearching(true);
    setError(null);
    setInfo(null);
    setHouseResults([]);
    setSenateResults([]);
    setMappings([]);

    try {
      console.log(`Searching for ${chamberType} candidates with input: ${postcode}`);
      
      // First, get all mappings for the input (postcode, suburb, or state)
      let mappingQuery = supabase.from('postcode_mappings').select('*');
      
      // Try to match with postcode first
      if (/^\d{4}$/.test(postcode)) {
        mappingQuery = mappingQuery.eq('postcode', postcode);
      } 
      // Then try a partial match with locality (suburb)
      else if (postcode.length >= 3) {
        // First try exact state match
        const stateAbbreviations = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'];
        const upperInput = postcode.toUpperCase();
        
        if (stateAbbreviations.includes(upperInput)) {
          mappingQuery = mappingQuery.eq('state', upperInput);
        } else {
          // Try partial match with locality
          mappingQuery = mappingQuery.ilike('locality', `%${postcode}%`);
        }
      }

      const { data: mappingData, error: mappingError } = await mappingQuery;

      if (mappingError) {
        console.error("Mapping error:", mappingError);
        throw mappingError;
      }

      if (!mappingData || mappingData.length === 0) {
        setError("We couldn't find any candidates based on that input. Please check your postcode, suburb, or try a nearby area.");
        setIsSearching(false);
        return;
      }

      setMappings(mappingData);
      console.log("Found mappings:", mappingData);

      // Get unique electorates and states from mappings
      const uniqueElectorates = [...new Set(mappingData.map(m => m.electorate))];
      const uniqueStates = [...new Set(mappingData.map(m => m.state))];
      
      console.log("Unique electorates:", uniqueElectorates);
      console.log("Unique states:", uniqueStates);

      let houseData: any[] = [];
      let senateData: any[] = [];

      // Fetch appropriate candidates based on chamber selection
      if (chamberType === "house" || chamberType === null) {
        // Fetch House of Representatives candidates for all matched electorates
        const { data: houseResults, error: houseError } = await supabase
          .from('House of Representatives Candidates')
          .select('*')
          .in('division', uniqueElectorates);

        if (houseError) {
          console.error("House candidates error:", houseError);
          throw houseError;
        }

        console.log("House candidates response:", houseResults);
        if (houseResults) houseData = houseResults;
      }

      if (chamberType === "senate" || chamberType === null) {
        // Fetch Senate candidates for the state(s)
        const { data: senateResults, error: senateError } = await supabase
          .from('Senate Candidates')
          .select('*')
          .in('state', uniqueStates);

        if (senateError) {
          console.error("Senate candidates error:", senateError);
          throw senateError;
        }

        console.log("Senate candidates response:", senateResults);
        if (senateResults) senateData = senateResults;
      }

      setHouseResults(houseData);
      setSenateResults(senateData);

      // Use the first mapping for the electorate object
      const primaryMapping = mappingData[0];
      
      // Create the electorate object with appropriate candidates
      const electorate: Electorate = {
        id: postcode,
        name: primaryMapping.electorate,
        state: primaryMapping.state,
        candidates: [
          ...(chamberType !== "senate" ? (houseData || []).map((candidate) => ({
            id: `house-${candidate.ballotPosition}`,
            name: `${candidate.ballotGivenName || ''} ${candidate.surname || ''}`.trim(),
            party: candidate.partyBallotName || 'Independent',
            email: "contact@example.com", // Placeholder email
            policies: [],
            chamber: "house" as ChamberType,
            division: candidate.division,
          })) : []),
          ...(chamberType !== "house" ? (senateData || []).map((candidate) => ({
            id: `senate-${candidate.ballotPosition}`,
            name: `${candidate.ballotGivenName || ''} ${candidate.surname || ''}`.trim(),
            party: candidate.partyBallotName || 'Independent',
            email: "contact@example.com", // Placeholder email
            policies: [],
            chamber: "senate" as ChamberType,
            state: candidate.state,
          })) : []),
        ],
      };

      const candidateCount = electorate.candidates.length;
      
      if (candidateCount === 0) {
        setInfo(`We found your location (${primaryMapping.electorate} in ${primaryMapping.state}), but no candidate data is available yet.`);
        toast({
          title: "No Candidates Found",
          description: `Found ${primaryMapping.electorate} in ${primaryMapping.state}, but no candidate data is available yet.`,
        });
      } else {
        const chamberText = chamberType === "senate" ? "Senate" : chamberType === "house" ? "House" : "House and Senate";
        const houseCount = chamberType !== "senate" ? houseData.length : 0;
        const senateCount = chamberType !== "house" ? senateData.length : 0;
        
        toast({
          title: "Found your representatives",
          description: `Found ${houseCount} House and ${senateCount} Senate candidates for ${primaryMapping.state}.`,
        });
        
        // Only continue if there are candidates
        onContinue(electorate);
      }

    } catch (err) {
      console.error("Error searching candidates:", err);
      setError("Error searching for candidates. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch candidate data. Please try again.",
      });
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
            {getPromptText()}
          </p>
        </div>

        <div className="flex space-x-2">
          <Input
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder={getPlaceholderText()}
            className="text-lg"
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
            <h3 className="font-semibold mb-2">Location Information:</h3>
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
            {houseResults.length > 0 && chamberType !== "senate" && (
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

            {senateResults.length > 0 && chamberType !== "house" && (
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
          <h3 className="font-medium text-sm text-muted-foreground">Search Tips</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {chamberType === "senate" 
              ? "Try entering a valid Australian postcode (e.g., 2000), a suburb name, or state abbreviation (e.g., NSW, VIC)"
              : "Try entering a valid Australian postcode (e.g., 2000) or a suburb name (e.g., Sydney)"}
          </p>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrevious}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostcodeStep;
