
import React from "react";
import { Button } from "@/components/ui/button";
import { Electorate, Candidate } from "../types";
import CandidateCard from "./CandidateCard";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface CandidatesStepProps {
  electorate: Electorate;
  selectedCandidates: string[];
  onSelectCandidate: (id: string) => void;
  onPrevious: () => void;
  onContinue: () => void;
}

const CandidatesStep: React.FC<CandidatesStepProps> = ({
  electorate,
  selectedCandidates,
  onSelectCandidate,
  onPrevious,
  onContinue,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Select Representatives to Contact
          </h2>
          <p className="text-gray-600 mt-2">
            These are the candidates for the {electorate.name} electorate in {electorate.state}. 
            Select who you'd like to contact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {electorate.candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isSelected={selectedCandidates.includes(candidate.id)}
              onToggleSelect={onSelectCandidate}
            />
          ))}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrevious}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            onClick={onContinue}
            disabled={selectedCandidates.length === 0}
          >
            Continue <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CandidatesStep;
