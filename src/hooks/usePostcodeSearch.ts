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
  const [debug, setDebug] = useState<any>(null);
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
    
    const debugInfo: any = {
      input: postcode,
      chamberType,
      steps: []
    };

    try {
      console.log(`Searching for ${chamberType} candidates with input: ${postcode}`);
      
      // Step 1: Fetch postcode mappings
      let mappingQuery = supabase.from('postcode_mappings').select('*');
      
      if (/^\d{4}$/.test(postcode)) {
        // If input is a 4-digit postcode
        mappingQuery = mappingQuery.eq('postcode', postcode);
        debugInfo.steps.push({ step: "Searching by exact postcode", query: postcode });
      } 
      else if (postcode.length >= 3) {
        const stateAbbreviations = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'];
        const upperInput = postcode.toUpperCase();
        
        if (stateAbbreviations.includes(upperInput)) {
          mappingQuery = mappingQuery.eq('state', upperInput);
          debugInfo.steps.push({ step: "Searching by state abbreviation", query: upperInput });
        } else {
          mappingQuery = mappingQuery.ilike('locality', `%${postcode}%`);
          debugInfo.steps.push({ step: "Searching by locality", query: postcode });
        }
      }

      const { data: mappingData, error: mappingError } = await mappingQuery;

      if (mappingError) {
        console.error("Mapping error:", mappingError);
        debugInfo.steps.push({ step: "Mapping error", error: mappingError });
        throw mappingError;
      }

      if (!mappingData || mappingData.length === 0) {
        setError("We couldn't find any location based on that input. Please check your postcode, suburb, or try a nearby area.");
        debugInfo.steps.push({ step: "No mappings found" });
        setDebug(debugInfo);
        setIsSearching(false);
        return;
      }

      setMappings(mappingData);
      debugInfo.steps.push({ step: "Found mappings", count: mappingData.length, mappings: mappingData });
      console.log("Found mappings:", mappingData);

      // Step 2: Extract unique electorates and states from postcode mappings
      const uniqueElectorates = [...new Set(mappingData.map(m => m.electorate))];
      const uniqueStates = [...new Set(mappingData.map(m => m.state))];
      
      debugInfo.steps.push({ 
        step: "Extracted unique values", 
        uniqueElectorates, 
        uniqueStates 
      });
      
      console.log("Unique electorates:", uniqueElectorates);
      console.log("Unique states:", uniqueStates);

      const primaryMapping = mappingData[0];
      let houseData: any[] = [];
      let senateData: any[] = [];

      // Step 3: If we're searching for House candidates, look them up by electorate
      if (chamberType === "house" || chamberType === null) {
        debugInfo.steps.push({ step: "Starting House candidate search", electorates: uniqueElectorates });
        console.log("Searching for House candidates in electorates:", uniqueElectorates);
        
        // CRITICAL FIX: Try multiple query approaches to find candidates
        for (const electorateName of uniqueElectorates) {
          // Try exact match first (case insensitive)
          const { data: exactData, error: exactError } = await supabase
            .from('House of Representatives Candidates')
            .select('*')
            .ilike('electorate', electorateName);
          
          if (exactError) {
            console.error(`Error querying for electorate ${electorateName}:`, exactError);
            debugInfo.steps.push({ 
              step: `Error querying for House candidates in electorate "${electorateName}"`, 
              error: exactError 
            });
            continue;
          }
          
          if (exactData && exactData.length > 0) {
            debugInfo.steps.push({ 
              step: `Found House candidates with exact match for "${electorateName}"`, 
              count: exactData.length,
              results: exactData
            });
            houseData = [...houseData, ...exactData];
            console.log(`Found ${exactData.length} House candidates for ${electorateName}`);
            continue;
          }
          
          // Try direct SQL query if Supabase query doesn't yield results
          console.log(`No results with direct match, trying additional queries for "${electorateName}"`);
          
          // Try with LOWER and TRIM
          const { data: lowercaseData, error: lowercaseError } = await supabase
            .from('House of Representatives Candidates')
            .select('*')
            .filter('electorate', 'ilike', `%${electorateName.toLowerCase().trim()}%`);
          
          if (!lowercaseError && lowercaseData && lowercaseData.length > 0) {
            debugInfo.steps.push({ 
              step: `Found House candidates with lowercase match for "${electorateName}"`, 
              count: lowercaseData.length,
              results: lowercaseData
            });
            houseData = [...houseData, ...lowercaseData];
            console.log(`Found ${lowercaseData.length} House candidates with lowercase match for ${electorateName}`);
            continue;
          }
          
          // Try with partial match
          const { data: partialData, error: partialError } = await supabase
            .from('House of Representatives Candidates')
            .select('*')
            .filter('electorate', 'ilike', `%${electorateName}%`);
          
          if (!partialError && partialData && partialData.length > 0) {
            debugInfo.steps.push({ 
              step: `Found House candidates with partial match for "${electorateName}"`, 
              count: partialData.length,
              results: partialData
            });
            houseData = [...houseData, ...partialData];
            console.log(`Found ${partialData.length} House candidates with partial match for ${electorateName}`);
            continue;
          }
          
          // Log if no candidates found for this electorate
          debugInfo.steps.push({ 
            step: `No House candidates found for "${electorateName}" after multiple query attempts`, 
            electorate: electorateName
          });
          console.log(`No House candidates found for "${electorateName}" after multiple query attempts`);
        }
        
        debugInfo.steps.push({ 
          step: "Final House candidates results", 
          count: houseData.length,
          houseData
        });
        
        console.log("Final House candidates:", houseData);
        setHouseResults(houseData);
          
        // If no candidates found using our query strategies, try one more approach
        if (houseData.length === 0 && uniqueElectorates.length > 0) {
          // Get all candidates as a fallback to see what's in the database
          const { data: allCandidates, error: allError } = await supabase
            .from('House of Representatives Candidates')
            .select('*')
            .limit(20);
            
          if (!allError && allCandidates) {
            debugInfo.steps.push({
              step: "Fallback query - sample candidates in database",
              count: allCandidates.length,
              sampleCandidates: allCandidates.slice(0, 5)
            });
            
            // Get distinct electorates in the database for comparison
            const dbElectorates = [...new Set(allCandidates.map(c => c.electorate))];
            debugInfo.steps.push({
              step: "Sample electorates in database",
              electorates: dbElectorates.slice(0, 10)
            });
          }
        }
      }

      // Step 4: If we're searching for Senate candidates, look them up by state
      if (chamberType === "senate" || chamberType === null) {
        debugInfo.steps.push({ step: "Starting Senate candidate search", states: uniqueStates });
        console.log("Searching for Senate candidates in states:", uniqueStates);
        
        const { data: senateResults, error: senateError } = await supabase
          .from('Senate Candidates')
          .select('*')
          .in('state', uniqueStates);

        if (senateError) {
          console.error("Senate candidates query error:", senateError);
          debugInfo.steps.push({ 
            step: "Error querying for Senate candidates", 
            error: senateError 
          });
          throw senateError;
        }
        
        debugInfo.steps.push({ 
          step: "Senate candidates found", 
          count: senateResults?.length || 0,
          results: senateResults
        });
        
        console.log("Senate candidates found:", senateResults);
        
        if (senateResults && senateResults.length > 0) {
          senateData = senateResults;
          setSenateResults(senateData);
        }
      }

      // Step A: Add a raw SQL query for additional debugging if no candidates were found
      if ((chamberType === "house" || chamberType === null) && houseData.length === 0) {
        const targetElectorate = uniqueElectorates[0];
        const { data: rawQueryData, error: rawQueryError } = await supabase
          .rpc('debug_house_candidates', { electorate_param: targetElectorate });
          
        if (!rawQueryError) {
          debugInfo.steps.push({
            step: "Raw SQL query for debugging",
            targetElectorate,
            results: rawQueryData
          });
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

      debugInfo.steps.push({ 
        step: "Created electorate object", 
        candidateCount: electorate.candidates.length,
        electorate
      });

      const candidateCount = electorate.candidates.length;
      
      // Step 6: Provide feedback based on search results
      if (candidateCount === 0) {
        if (chamberType === "house") {
          setInfo(`We found your electorate (${primaryMapping.electorate} in ${primaryMapping.state}), but no House candidate data is available yet.`);
          toast({
            title: "No Candidates Found",
            description: `Found ${primaryMapping.electorate} in ${primaryMapping.state}, but no House candidate data is available yet.`,
          });
          debugInfo.steps.push({ 
            step: "No House candidates found despite finding electorate", 
            electorate: primaryMapping.electorate
          });
        } else if (chamberType === "senate") {
          setInfo(`We found your state (${primaryMapping.state}), but no Senate candidate data is available yet.`);
          toast({
            title: "No Candidates Found",
            description: `Found your location in ${primaryMapping.state}, but no Senate candidate data is available yet.`,
          });
          debugInfo.steps.push({ 
            step: "No Senate candidates found despite finding state", 
            state: primaryMapping.state
          });
        } else {
          setInfo(`We found your location (${primaryMapping.electorate} in ${primaryMapping.state}), but no candidate data is available yet.`);
          toast({
            title: "No Candidates Found",
            description: `Found ${primaryMapping.electorate} in ${primaryMapping.state}, but no candidate data is available yet.`,
          });
          debugInfo.steps.push({ 
            step: "No candidates found despite finding location", 
            electorate: primaryMapping.electorate,
            state: primaryMapping.state
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
        
        debugInfo.steps.push({ 
          step: "Found candidates successfully", 
          houseCount,
          senateCount,
          description
        });
        
        onContinue(electorate);
      }

    } catch (err) {
      console.error("Error searching candidates:", err);
      setError("Error searching for candidates. Please try again.");
      debugInfo.steps.push({ 
        step: "Error in search process", 
        error: err
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch candidate data. Please try again.",
      });
    } finally {
      setDebug(debugInfo);  // Always set debug info
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
    debug  // Return debug info
  };
};
