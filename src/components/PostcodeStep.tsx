
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, ChevronLeft } from "lucide-react";
import { usePostcodeSearch } from "@/hooks/usePostcodeSearch";
import PostcodeSearchResults from "./PostcodeSearchResults";
import SearchTips from "./SearchTips";
import Disclaimer from "./Disclaimer";
import SuburbSelector from "./SuburbSelector";
import { ChamberType, Electorate } from "../types";
import { PostcodeMapping } from "@/utils/search/types";

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
  const {
    error,
    info,
    isSearching,
    mappings,
    houseResults,
    senateResults,
    handleSearch,
    handleSuburbSelect,
    debug,
    showSuburbSelector
  } = usePostcodeSearch(chamberType, postcode, onContinue);

  const getPlaceholderText = () => {
    return "Enter your postcode";
  };

  const getPromptText = () => {
    if (chamberType === "senate") {
      return "Enter your postcode to find Senate candidates in your state";
    } else {
      return "Enter your postcode to find House of Representatives candidates for your electorate";
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Find Your Candidates</h2>
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

        {showSuburbSelector && mappings.length > 0 && (
          <SuburbSelector 
            mappings={mappings} 
            onSuburbSelect={handleSuburbSelect} 
          />
        )}

        {!showSuburbSelector && (
          <PostcodeSearchResults
            error={error}
            info={info}
            mappings={mappings}
            houseResults={houseResults}
            senateResults={senateResults}
            chamberType={chamberType}
            debug={debug}
          />
        )}

        <SearchTips chamberType={chamberType} />

        <Disclaimer />

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
