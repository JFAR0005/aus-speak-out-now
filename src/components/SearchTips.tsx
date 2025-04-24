
import React from "react";
import { ChamberType } from "../types";

interface SearchTipsProps {
  chamberType: ChamberType | null;
}

const SearchTips: React.FC<SearchTipsProps> = ({ chamberType }) => {
  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <h3 className="font-medium text-sm text-muted-foreground">Search Tips</h3>
      <p className="text-xs text-muted-foreground mt-1">
        Enter a valid Australian postcode (e.g., 2000) to find your representatives
      </p>
    </div>
  );
};

export default SearchTips;
