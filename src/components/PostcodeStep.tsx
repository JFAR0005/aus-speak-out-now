
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, ChevronLeft } from "lucide-react";
import { usePostcodeSearch } from "@/hooks/usePostcodeSearch";
import PostcodeSearchResults from "./PostcodeSearchResults";
import SearchTips from "./SearchTips";
import { ChamberType, Electorate } from "../types";

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
    debug
  } = usePostcodeSearch(chamberType, postcode, onContinue);

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

        <PostcodeSearchResults
          error={error}
          info={info}
          mappings={mappings}
          houseResults={houseResults}
          senateResults={senateResults}
          chamberType={chamberType}
          debug={debug}
        />

        <SearchTips chamberType={chamberType} />

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
