
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { validatePostcodeInput } from "@/utils/search/postcodeValidator";
import { fetchPostcodeMappings } from "@/utils/search/mappingService";
import { 
  fetchHouseCandidates, 
  fetchSenateCandidates, 
  formatCandidateData 
} from "@/utils/search/candidateService";
import { handleSearchSuccess, handleSearchError } from "@/utils/search/notificationService";
import type { SearchState, SearchDebugInfo, CandidateSearchProps } from "@/utils/search/types";

export const usePostcodeSearch = (
  chamberType: CandidateSearchProps["chamberType"],
  postcode: string,
  onContinue: CandidateSearchProps["onContinue"]
) => {
  const [state, setState] = useState<SearchState>({
    error: null,
    info: null,
    isSearching: false,
    mappings: [],
    houseResults: [],
    senateResults: [],
    debug: null
  });
  
  const { toast } = useToast();

  const handleSearch = async () => {
    // Validate input
    const validationError = validatePostcodeInput(postcode);
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isSearching: true,
      error: null,
      info: null,
      mappings: [],
      houseResults: [],
      senateResults: []
    }));

    const debugInfo: SearchDebugInfo = {
      input: postcode,
      chamberType,
      steps: []
    };

    try {
      const numericPostcode = Number(postcode);
      const { data: mappingData, error: mappingError } = await fetchPostcodeMappings(numericPostcode);

      if (mappingError) {
        throw mappingError;
      }

      if (!mappingData || mappingData.length === 0) {
        setState(prev => ({
          ...prev,
          error: "We couldn't find any location based on that postcode. Please check your postcode or try a nearby area.",
          isSearching: false
        }));
        return;
      }

      setState(prev => ({ ...prev, mappings: mappingData }));

      const uniqueElectorates = [...new Set(mappingData.map(m => m.electorate))];
      const uniqueStates = [...new Set(mappingData.map(m => m.state))];
      
      let houseData: any[] = [];
      let senateData: any[] = [];

      if (chamberType === "house" || chamberType === null) {
        houseData = await fetchHouseCandidates(uniqueElectorates);
      }

      if (chamberType === "senate" || chamberType === null) {
        senateData = await fetchSenateCandidates(uniqueStates);
      }

      const candidateData = formatCandidateData(houseData, senateData, chamberType, mappingData[0]);

      if (houseData.length === 0 && senateData.length === 0) {
        setState(prev => ({
          ...prev,
          info: getCandidateNotFoundMessage(chamberType, mappingData[0]),
          isSearching: false,
          debug: debugInfo
        }));
        
        toast({
          title: "No Candidates Found",
          description: getNoCandidatesMessage(chamberType, mappingData[0]),
        });
      } else {
        handleSearchSuccess(
          toast,
          houseData.length,
          senateData.length,
          chamberType,
          mappingData[0]
        );
        onContinue(candidateData);
      }

      setState(prev => ({
        ...prev,
        houseResults: houseData,
        senateResults: senateData,
        isSearching: false,
        debug: debugInfo
      }));

    } catch (err) {
      console.error("Error searching candidates:", err);
      setState(prev => ({
        ...prev,
        error: "Error searching for candidates. Please try again.",
        isSearching: false,
        debug: debugInfo
      }));
      handleSearchError(toast);
    }
  };

  return {
    ...state,
    handleSearch
  };
};

const getCandidateNotFoundMessage = (
  chamberType: "house" | "senate" | null,
  mapping: any
) => {
  if (chamberType === "house") {
    return `We found your electorate (${mapping.electorate} in ${mapping.state}), but no House candidate data is available yet.`;
  } else if (chamberType === "senate") {
    return `We found your state (${mapping.state}), but no Senate candidate data is available yet.`;
  } else {
    return `We found your location (${mapping.electorate} in ${mapping.state}), but no candidate data is available yet.`;
  }
};

const getNoCandidatesMessage = (
  chamberType: "house" | "senate" | null,
  mapping: any
) => {
  if (chamberType === "house") {
    return `Found ${mapping.electorate} in ${mapping.state}, but no House candidate data is available yet.`;
  } else if (chamberType === "senate") {
    return `Found your location in ${mapping.state}, but no Senate candidate data is available yet.`;
  } else {
    return `Found ${mapping.electorate} in ${mapping.state}, but no candidate data is available yet.`;
  }
};

