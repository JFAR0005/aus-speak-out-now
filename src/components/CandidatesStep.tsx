
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
  // Separate House and Senate candidates
  const houseRepresentatives = electorate.candidates.filter(c => c.chamber === "house");
  const senateCandidates = electorate.candidates.filter(c => c.chamber === "senate");

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Select Representatives to Contact
          </h2>
          <p className="text-gray-600 mt-2">
            {electorate.state && `These are the representatives for ${electorate.state}.`}
            {electorate.name && electorate.name !== electorate.state && ` ${electorate.name} electorate in ${electorate.state}.`}
            <br />Select who you'd like to contact.
          </p>
        </div>

        {houseRepresentatives.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-3">House of Representatives</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {houseRepresentatives.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  isSelected={selectedCandidates.includes(candidate.id)}
                  onToggleSelect={onSelectCandidate}
                />
              ))}
            </div>
          </div>
        )}

        {senateCandidates.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Senate</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {senateCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  isSelected={selectedCandidates.includes(candidate.id)}
                  onToggleSelect={onSelectCandidate}
                />
              ))}
            </div>
          </div>
        )}

        {electorate.candidates.length === 0 && (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-700">No candidates available for this location in our database.</p>
          </div>
        )}

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
