
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Electorate, ChamberType } from "../types";
import { useToast } from "@/hooks/use-toast";

export const usePostcodeSearch = (
  chamberType: ChamberType | null,
  postcode: string,
  onContinue: (electorate: Electorate) => void
) => {
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [houseResults, setHouseResults] = useState<any[]>([]);
  const [senateResults, setSenateResults] = useState<any[]>([]);
  const [mappings, setMappings] = useState<any[]>([]);
  const { toast } = useToast();

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
      
      // Step 1: Fetch postcode mappings
      let mappingQuery = supabase.from('postcode_mappings').select('*');
      
      if (/^\d{4}$/.test(postcode)) {
        // If input is a 4-digit postcode
        mappingQuery = mappingQuery.eq('postcode', postcode);
      } 
      else if (postcode.length >= 3) {
        const stateAbbreviations = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'];
        const upperInput = postcode.toUpperCase();
        
        if (stateAbbreviations.includes(upperInput)) {
          mappingQuery = mappingQuery.eq('state', upperInput);
        } else {
          mappingQuery = mappingQuery.ilike('locality', `%${postcode}%`);
        }
      }

      const { data: mappingData, error: mappingError } = await mappingQuery;

      if (mappingError) {
        console.error("Mapping error:", mappingError);
        throw mappingError;
      }

      if (!mappingData || mappingData.length === 0) {
        setError("We couldn't find any location based on that input. Please check your postcode, suburb, or try a nearby area.");
        setIsSearching(false);
        return;
      }

      setMappings(mappingData);
      console.log("Found mappings:", mappingData);

      // Step 2: Extract unique electorates and states from postcode mappings
      const uniqueElectorates = [...new Set(mappingData.map(m => m.electorate))];
      const uniqueStates = [...new Set(mappingData.map(m => m.state))];
      
      console.log("Unique electorates:", uniqueElectorates);
      console.log("Unique states:", uniqueStates);

      const primaryMapping = mappingData[0];
      let houseData: any[] = [];
      let senateData: any[] = [];

      // Step 3: If we're searching for House candidates, look them up by electorate
      if (chamberType === "house" || chamberType === null) {
        console.log("Searching for House candidates in electorates:", uniqueElectorates);
        
        // For each electorate, perform a query with case-insensitive matching
        const housePromises = uniqueElectorates.map(async (electorate) => {
          console.log(`Querying for House candidates in electorate: "${electorate}"`);
          const { data, error } = await supabase
            .from('House of Representatives Candidates')
            .select('*')
            .ilike('electorate', electorate);
          
          if (error) {
            console.error(`Error querying for electorate ${electorate}:`, error);
            return [];
          }
          
          console.log(`Results for electorate ${electorate}:`, data);
          return data || [];
        });
        
        // Wait for all queries to complete
        const results = await Promise.all(housePromises);
        
        // Merge all results
        houseData = results.flat();
        console.log("Combined House candidates:", houseData);
        setHouseResults(houseData);
      }

      // Step 4: If we're searching for Senate candidates, look them up by state
      if (chamberType === "senate" || chamberType === null) {
        console.log("Searching for Senate candidates in states:", uniqueStates);
        const { data: senateResults, error: senateError } = await supabase
          .from('Senate Candidates')
          .select('*')
          .in('state', uniqueStates);

        if (senateError) {
          console.error("Senate candidates query error:", senateError);
          throw senateError;
        }
        
        console.log("Senate candidates found:", senateResults);
        
        if (senateResults && senateResults.length > 0) {
          senateData = senateResults;
          setSenateResults(senateData);
        }
      }

      // Step 5: Create the electorate object with candidate data
      const electorate: Electorate = {
        id: postcode,
        name: primaryMapping.electorate,
        state: primaryMapping.state,
        candidates: [
          ...(chamberType !== "senate" ? (houseData || []).map((candidate) => ({
            id: `house-${candidate.ballotPosition || Math.random().toString(36).substring(2, 9)}`,
            name: `${candidate.ballotGivenName || ''} ${candidate.surname || ''}`.trim(),
            party: candidate.partyBallotName || 'Independent',
            email: "contact@example.com", 
            policies: [],
            chamber: "house" as ChamberType,
            division: candidate.electorate,
          })) : []),
          ...(chamberType !== "house" ? (senateData || []).map((candidate) => ({
            id: `senate-${candidate.ballotPosition || Math.random().toString(36).substring(2, 9)}`,
            name: `${candidate.ballotGivenName || ''} ${candidate.surname || ''}`.trim(),
            party: candidate.partyBallotName || 'Independent',
            email: "contact@example.com",
            policies: [],
            chamber: "senate" as ChamberType,
            state: candidate.state,
          })) : []),
        ],
      };

      const candidateCount = electorate.candidates.length;
      
      // Step 6: Provide feedback based on search results
      if (candidateCount === 0) {
        if (chamberType === "house") {
          setInfo(`We found your electorate (${primaryMapping.electorate} in ${primaryMapping.state}), but no House candidate data is available yet.`);
          toast({
            title: "No Candidates Found",
            description: `Found ${primaryMapping.electorate} in ${primaryMapping.state}, but no House candidate data is available yet.`,
          });
        } else if (chamberType === "senate") {
          setInfo(`We found your state (${primaryMapping.state}), but no Senate candidate data is available yet.`);
          toast({
            title: "No Candidates Found",
            description: `Found your location in ${primaryMapping.state}, but no Senate candidate data is available yet.`,
          });
        } else {
          setInfo(`We found your location (${primaryMapping.electorate} in ${primaryMapping.state}), but no candidate data is available yet.`);
          toast({
            title: "No Candidates Found",
            description: `Found ${primaryMapping.electorate} in ${primaryMapping.state}, but no candidate data is available yet.`,
          });
        }
      } else {
        const houseCount = chamberType !== "senate" ? houseData.length : 0;
        const senateCount = chamberType !== "house" ? senateData.length : 0;
        
        let description = "";
        if (chamberType === "house") {
          description = `Found ${houseCount} House candidates for ${primaryMapping.electorate} in ${primaryMapping.state}.`;
        } else if (chamberType === "senate") {
          description = `Found ${senateCount} Senate candidates for ${primaryMapping.state}.`;
        } else {
          description = `Found ${houseCount} House and ${senateCount} Senate candidates for ${primaryMapping.state}.`;
        }
        
        toast({
          title: "Found your representatives",
          description: description,
        });
        
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

  return {
    error,
    info,
    isSearching,
    mappings,
    houseResults,
    senateResults,
    handleSearch,
  };
};
