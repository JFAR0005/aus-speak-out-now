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
import type { SearchState, SearchDebugInfo, CandidateSearchProps, PostcodeMapping } from "@/utils/search/types";

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

  const [showSuburbSelector, setShowSuburbSelector] = useState(false);
  
  const { toast } = useToast();

  const handleSuburbSelect = async (selectedMapping: PostcodeMapping) => {
    setShowSuburbSelector(false);
    
    const debugInfo: SearchDebugInfo = {
      input: postcode,
      chamberType,
      steps: []
    };

    try {
      let houseData: any[] = [];
      let senateData: any[] = [];

      if (chamberType === "house" || chamberType === null) {
        houseData = await fetchHouseCandidates([selectedMapping.electorate]);
      }

      if (chamberType === "senate" || chamberType === null) {
        senateData = await fetchSenateCandidates([selectedMapping.state]);
      }

      const candidateData = formatCandidateData(houseData, senateData, chamberType, selectedMapping);

      setState(prev => ({
        ...prev,
        mappings: [selectedMapping],
        houseResults: houseData,
        senateResults: senateData,
        isSearching: false,
        debug: debugInfo
      }));

      if (houseData.length === 0 && senateData.length === 0) {
        toast({
          title: "No Candidates Found",
          description: `No candidates found for ${selectedMapping.electorate} in ${selectedMapping.state}`,
        });
      } else {
        handleSearchSuccess(
          toast,
          houseData.length,
          senateData.length,
          chamberType,
          selectedMapping
        );
        onContinue(candidateData);
      }

    } catch (err) {
      console.error("Error processing suburb selection:", err);
      setState(prev => ({
        ...prev,
        error: "Error processing your selection. Please try again.",
        isSearching: false
      }));
      handleSearchError(toast);
    }
  };

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

      // Check if we need to show suburb selector
      const hasMultipleLocalities = mappingData.some(m => m.locality) && 
                                  new Set(mappingData.map(m => m.locality)).size > 1;

      if (hasMultipleLocalities) {
        setState(prev => ({ 
          ...prev, 
          mappings: mappingData,
          isSearching: false
        }));
        setShowSuburbSelector(true);
        return;
      }

      // If only one mapping or no localities, proceed with first mapping
      const mapping = mappingData[0];
      await handleSuburbSelect(mapping);

    } catch (err) {
      console.error("Error searching candidates:", err);
      setState(prev => ({
        ...prev,
        error: "Error searching for candidates. Please try again.",
        isSearching: false
      }));
      handleSearchError(toast);
    }
  };

  return {
    ...state,
    handleSearch,
    handleSuburbSelect,
    showSuburbSelector
  };
};
