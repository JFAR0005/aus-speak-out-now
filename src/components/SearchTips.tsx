
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
        {chamberType === "senate" 
          ? "Try entering a valid Australian postcode (e.g., 2000), a suburb name, or state abbreviation (e.g., NSW, VIC)"
          : "Try entering a valid Australian postcode (e.g., 2000) or a suburb name (e.g., Sydney)"}
      </p>
    </div>
  );
};

export default SearchTips;
