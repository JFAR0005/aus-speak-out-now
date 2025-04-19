
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
      
      // Fetch postcode mappings
      let mappingQuery = supabase.from('postcode_mappings').select('*');
      
      if (/^\d{4}$/.test(postcode)) {
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
        setError("We couldn't find any candidates based on that input. Please check your postcode, suburb, or try a nearby area.");
        setIsSearching(false);
        return;
      }

      setMappings(mappingData);
      console.log("Found mappings:", mappingData);

      // Extract unique electorates and states from postcode mappings
      const uniqueElectorates = [...new Set(mappingData.map(m => m.electorate.toLowerCase().trim()))];
      const uniqueStates = [...new Set(mappingData.map(m => m.state))];
      
      console.log("Unique electorates (lowercase and trimmed):", uniqueElectorates);
      console.log("Unique states:", uniqueStates);

      const primaryMapping = mappingData[0];
      let houseData: any[] = [];
      let senateData: any[] = [];

      if (chamberType === "house" || chamberType === null) {
        console.log("Searching for House candidates in electorates:", uniqueElectorates);
        
        // Fix: Use ilike filter for case-insensitive matching
        let houseQuery = supabase
          .from('House of Representatives Candidates')
          .select('*');
        
        // Use proper filter syntax for multiple values
        if (uniqueElectorates.length === 1) {
          // For a single electorate, use ilike for case-insensitive matching
          houseQuery = houseQuery.ilike('electorate', uniqueElectorates[0]);
        } else {
          // For multiple electorates, build a more complex query with or conditions
          const filters = uniqueElectorates.map((electorate, index) => {
            if (index === 0) return `electorate.ilike.${electorate}`;
            return `electorate.ilike.${electorate}`;
          });
          
          if (filters.length > 0) {
            houseQuery = houseQuery.or(filters.join(','));
          }
        }
        
        const { data: houseResults, error: houseError } = await houseQuery;

        if (houseError) {
          console.error("House candidates query error:", houseError);
          throw houseError;
        }
        
        console.log("House candidates found:", houseResults);
        
        if (houseResults && houseResults.length > 0) {
          houseData = houseResults;
        } else {
          console.log("No House candidates found from database for electorates:", uniqueElectorates);
          // No fallback candidates
        }
      }

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
        } else {
          console.log("No Senate candidates found from database for states:", uniqueStates);
          // No fallback candidates
        }
      }

      setHouseResults(houseData);
      setSenateResults(senateData);

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
            division: candidate.electorate, // Keep using division key for backward compatibility
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
