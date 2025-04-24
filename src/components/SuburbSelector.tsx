
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostcodeMapping } from "@/utils/search/types";

interface SuburbSelectorProps {
  mappings: PostcodeMapping[];
  onSuburbSelect: (mapping: PostcodeMapping) => void;
}

const SuburbSelector: React.FC<SuburbSelectorProps> = ({ mappings, onSuburbSelect }) => {
  const uniqueSuburbs = mappings.filter(m => m.locality).map(m => ({
    locality: m.locality as string,
    electorate: m.electorate,
    state: m.state,
    postcode: m.postcode,
  }));

  return (
    <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 className="font-medium text-blue-800">Multiple locations found</h4>
      <p className="text-sm text-blue-700">
        This postcode covers multiple areas. Please select your suburb to find the correct representatives.
      </p>
      <Select onValueChange={(value) => {
        const selected = mappings.find(m => m.locality === value);
        if (selected) {
          onSuburbSelect(selected);
        }
      }}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select your suburb" />
        </SelectTrigger>
        <SelectContent>
          {uniqueSuburbs.map((suburb) => (
            <SelectItem key={suburb.locality} value={suburb.locality}>
              {suburb.locality} ({suburb.electorate})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SuburbSelector;
