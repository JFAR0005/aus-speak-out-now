
import React from "react";
import { Button } from "@/components/ui/button";
import { ChamberType } from "../types";
import { UserRound, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ChamberSelectionStepProps {
  onChamberSelect: (chamber: ChamberType) => void;
}

const ChamberSelectionStep: React.FC<ChamberSelectionStepProps> = ({
  onChamberSelect,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Select Chamber of Parliament
          </h2>
          <p className="text-gray-600 mt-2">
            Would you like to write to candidates for the House of Representatives or the Senate?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card 
            className="flex flex-col p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-aus-green"
            onClick={() => onChamberSelect("house")}
          >
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-aus-green mx-auto mb-4">
              <UserRound className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-3">House of Representatives</h3>
            <p className="text-gray-600 text-center flex-grow">
              Represents your local electorate. Focuses on local community concerns, introduces and debates new laws.
            </p>
            <Button 
              className="w-full mt-4" 
              onClick={() => onChamberSelect("house")}
            >
              Choose House
            </Button>
          </Card>

          <Card 
            className="flex flex-col p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-aus-green"
            onClick={() => onChamberSelect("senate")}
          >
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-aus-green mx-auto mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-3">Senate</h3>
            <p className="text-gray-600 text-center flex-grow">
              Represents your entire state or territory. Reviews legislation, acts as a house of review, and advocates for statewide issues.
            </p>
            <Button 
              className="w-full mt-4" 
              onClick={() => onChamberSelect("senate")}
            >
              Choose Senate
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChamberSelectionStep;
