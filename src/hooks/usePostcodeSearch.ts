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
      
      let mappingQuery = supabase.from('postcode_mappings').select('*');
      
      if (/^\d{4}$/.test(postcode)) {
        // For numeric postcodes, convert to number for the query (exact match)
        const numericPostcode = Number(postcode);
        mappingQuery = mappingQuery.eq('postcode', numericPostcode);
        debugInfo.steps.push({ step: "Searching by exact postcode", query: postcode });
      } 
      else {
        const stateAbbreviations = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'];
        const upperInput = postcode.toUpperCase();
        
        if (stateAbbreviations.includes(upperInput)) {
          // Exact match for state abbreviation
          mappingQuery = mappingQuery.eq('state', upperInput);
          debugInfo.steps.push({ step: "Searching by exact state abbreviation", query: upperInput });
        } else {
          // Exact match for locality (case insensitive)
          const searchTerm = postcode.trim();
          debugInfo.steps.push({ 
            step: "Searching by exact locality match (case insensitive)", 
            query: searchTerm 
          });
          
          // Use ilike for case insensitivity but without wildcards for exact match
          mappingQuery = mappingQuery.ilike('locality', searchTerm);
        }
      }

      let { data: mappingData, error: mappingError } = await mappingQuery;

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

      // Perform a test query for "Sydney" to verify the database has records
      try {
        const { data: testSydneyResults, error: testSydneyError } = await supabase
          .from('House of Representatives Candidates')
          .select('*')
          .ilike('electorate', 'Sydney');
          
        if (!testSydneyError) {
          debugInfo.testQueryResults = testSydneyResults || [];
          debugInfo.steps.push({ 
            step: "Test query for 'Sydney'", 
            count: testSydneyResults?.length || 0,
            queryString: "Sydney"
          });
        }
      } catch (testError) {
        debugInfo.steps.push({ 
          step: "Error in test query", 
          error: testError
        });
      }

      if (chamberType === "house" || chamberType === null) {
        debugInfo.steps.push({ step: "Starting House candidate search", electorates: uniqueElectorates });
        console.log("Searching for House candidates in electorates:", uniqueElectorates);
        
        for (const electorateName of uniqueElectorates) {
          if (!electorateName) {
            debugInfo.steps.push({ 
              step: "Skipping empty electorate name", 
            });
            continue;
          }
          
          // Try exact match first (case insensitive)
          const { data: exactData, error: exactError } = await supabase
            .from('House of Representatives Candidates')
            .select('*')
            .ilike('electorate', electorateName);
          
          debugInfo.steps.push({ 
            step: `Querying for electorate "${electorateName}"`, 
            queryString: electorateName,
            error: exactError || null
          });
          
          if (exactError) {
            console.error(`Error querying for electorate ${electorateName}:`, exactError);
            continue;
          }
          
          if (exactData && exactData.length > 0) {
            debugInfo.steps.push({ 
              step: `Found House candidates with exact match for "${electorateName}"`, 
              count: exactData.length,
              queryString: electorateName
            });
            houseData = [...houseData, ...exactData];
            console.log(`Found ${exactData.length} House candidates for ${electorateName}`);
            continue;
          }
          
          // Try with a direct ilike search with wildcard
          const { data: partialData, error: partialError } = await supabase
            .from('House of Representatives Candidates')
            .select('*')
            .ilike('electorate', `%${electorateName}%`);
          
          debugInfo.steps.push({ 
            step: `Querying with wildcard for "${electorateName}"`, 
            queryString: `%${electorateName}%`,
            error: partialError || null
          });
          
          if (partialError) {
            console.error(`Error with wildcard query for ${electorateName}:`, partialError);
            continue;
          }
          
          if (partialData && partialData.length > 0) {
            debugInfo.steps.push({ 
              step: `Found House candidates with wildcard match for "${electorateName}"`, 
              count: partialData.length,
              queryString: `%${electorateName}%`
            });
            houseData = [...houseData, ...partialData];
            console.log(`Found ${partialData.length} House candidates with wildcard match for ${electorateName}`);
            continue;
          }
          
          // Try extra normalization (lowercase)
          const normalizedElectorate = electorateName.toLowerCase().trim();
          const { data: normalizedData, error: normalizedError } = await supabase
            .from('House of Representatives Candidates')
            .select('*')
            .ilike('electorate', normalizedElectorate);
          
          debugInfo.steps.push({ 
            step: `Querying with normalized string for "${electorateName}"`, 
            queryString: normalizedElectorate,
            error: normalizedError || null
          });
          
          if (normalizedError) {
            console.error(`Error with normalized query for ${electorateName}:`, normalizedError);
            continue;
          }
          
          if (normalizedData && normalizedData.length > 0) {
            debugInfo.steps.push({ 
              step: `Found House candidates with normalized match for "${electorateName}"`, 
              count: normalizedData.length,
              queryString: normalizedElectorate
            });
            houseData = [...houseData, ...normalizedData];
            console.log(`Found ${normalizedData.length} House candidates with normalized match for ${electorateName}`);
            continue;
          }
          
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
          
        if (houseData.length === 0 && uniqueElectorates.length > 0) {
          try {
            // Direct database query for debugging
            const { data: allCandidates, error: allError } = await supabase
              .from('House of Representatives Candidates')
              .select('*')
              .limit(10);
              
            if (!allError && allCandidates) {
              debugInfo.steps.push({
                step: "Direct database query for debugging",
                count: allCandidates.length,
                sampleCandidates: allCandidates.slice(0, 5)
              });
              
              const dbElectorates = [...new Set(allCandidates.map((c: any) => c.electorate))];
              debugInfo.steps.push({
                step: "Sample electorates in database",
                electorates: dbElectorates.slice(0, 10)
              });
            }
          } catch (queryError) {
            debugInfo.steps.push({
              step: "Error in direct database query",
              error: queryError
            });
          }
        }
      }

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

      const electorate: Electorate = {
        id: postcode,
        name: primaryMapping.electorate,
        state: primaryMapping.state,
        candidates: [
          ...(chamberType !== "senate" ? (houseData || []).map((candidate) => ({
            id: `house-${candidate.ballotPosition || Math.random().toString(36).substring(2, 9)}`,
            name: `${candidate.ballotGivenName || ''} ${candidate.surname || ''}`.trim(),
            party: candidate.partyBallotName || 'Independent',
            // updated to use the real email if available
            email: candidate.email && candidate.email.trim() ? candidate.email.trim() : "contact@example.com",
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
      setDebug(debugInfo);
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
    debug
  };
};
