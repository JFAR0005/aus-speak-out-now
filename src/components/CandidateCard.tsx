
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
import { Mail, UserRound, Users } from "lucide-react";

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
  const handleToggleSelect = (event: React.MouseEvent | React.ChangeEvent) => {
    // Stop propagation to prevent double selection
    event.stopPropagation();
    onToggleSelect(candidate.id);
  };

  return (
    <Card className={`transition-all ${isSelected ? "border-aus-green ring-1 ring-aus-green" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              id={`select-${candidate.id}`}
              checked={isSelected}
              onCheckedChange={handleToggleSelect}
              className="h-5 w-5 data-[state=checked]:bg-aus-green data-[state=checked]:border-aus-green"
            />
            <div className="flex flex-col">
              <h3 className="font-semibold text-lg">{candidate.name}</h3>
              <div className="flex items-center space-x-2">
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
                <Badge 
                  variant="outline" 
                  className="bg-slate-100 text-slate-800"
                >
                  {candidate.chamber === "house" ? (
                    <div className="flex items-center">
                      <UserRound className="h-3 w-3 mr-1" /> House
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" /> Senate
                    </div>
                  )}
                </Badge>
              </div>
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
        {candidate.chamber === "house" && candidate.division && (
          <div className="text-sm mb-2">
            <span className="font-medium">Electorate:</span> {candidate.division}
          </div>
        )}
        {candidate.chamber === "senate" && candidate.state && (
          <div className="text-sm mb-2">
            <span className="font-medium">State:</span> {candidate.state}
          </div>
        )}
        {candidate.policies && candidate.policies.length > 0 && (
          <>
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
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs w-full"
          onClick={(e) => {
            e.stopPropagation();
            window.open(`mailto:${candidate.email}`);
          }}
        >
          <Mail className="mr-1 h-3 w-3" />
          {candidate.email}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
