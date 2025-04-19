
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Candidate } from "../types";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isSelected,
  onToggleSelect,
}) => {
  return (
    <Card className={`transition-all ${isSelected ? "border-aus-green ring-1 ring-aus-green" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              id={`select-${candidate.id}`}
              checked={isSelected}
              onCheckedChange={() => onToggleSelect(candidate.id)}
              className="h-5 w-5 data-[state=checked]:bg-aus-green data-[state=checked]:border-aus-green"
            />
            <div className="flex flex-col">
              <h3 className="font-semibold text-lg">{candidate.name}</h3>
              <Badge 
                variant="outline" 
                className={`w-fit ${
                  candidate.party === "Australian Labor Party" 
                    ? "bg-red-100 text-red-800 hover:bg-red-100" 
                    : candidate.party === "Liberal Party of Australia" 
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                    : candidate.party === "Australian Greens"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                }`}
              >
                {candidate.party}
              </Badge>
            </div>
          </div>
          {candidate.imageUrl && (
            <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src={candidate.imageUrl} 
                alt={candidate.name} 
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <h4 className="text-sm font-medium mb-2">Key Positions:</h4>
        <div className="grid grid-cols-1 gap-1">
          {candidate.policies.map((policy, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-700">{policy.topic}:</span>
              <span 
                className={`${
                  policy.stance === "Supportive" || policy.stance === "Strongly Supportive"
                    ? "text-green-600"
                    : policy.stance === "Opposed" || policy.stance === "Strongly Opposed"
                    ? "text-red-600"
                    : "text-amber-600"
                } font-medium`}
              >
                {policy.stance}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs w-full"
          onClick={() => window.open(`mailto:${candidate.email}`)}
        >
          <Mail className="mr-1 h-3 w-3" />
          {candidate.email}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
