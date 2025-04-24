
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Electorate, Candidate } from "../types";
import CandidateCard from "./CandidateCard";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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
  const houseRepresentatives = electorate.candidates.filter(c => c.chamber === "house");
  const senateCandidates = electorate.candidates.filter(c => c.chamber === "senate");

  const handleToggleCandidate = useCallback((candidateId: string) => {
    console.log('CandidatesStep: Processing selection', {
      candidateId,
      chamber: electorate.candidates.find(c => c.id === candidateId)?.chamber,
      currentlySelected: selectedCandidates,
      willBeSelected: !selectedCandidates.includes(candidateId),
      totalSelected: selectedCandidates.length,
      selectionTime: new Date().toISOString()
    });
    
    onSelectCandidate(candidateId);
  }, [electorate.candidates, selectedCandidates, onSelectCandidate]);

  const handleSelectAllHouse = () => {
    houseRepresentatives.forEach(candidate => {
      if (!selectedCandidates.includes(candidate.id)) {
        onSelectCandidate(candidate.id);
      }
    });
  };

  const handleSelectAllSenate = () => {
    senateCandidates.forEach(candidate => {
      if (!selectedCandidates.includes(candidate.id)) {
        onSelectCandidate(candidate.id);
      }
    });
  };

  const areAllHouseSelected = houseRepresentatives.length > 0 && 
    houseRepresentatives.every(candidate => selectedCandidates.includes(candidate.id));
  
  const areAllSenateSelected = senateCandidates.length > 0 && 
    senateCandidates.every(candidate => selectedCandidates.includes(candidate.id));

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
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold">House of Representatives</h3>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="selectAllHouse"
                  checked={areAllHouseSelected}
                  onCheckedChange={() => handleSelectAllHouse()}
                />
                <label 
                  htmlFor="selectAllHouse" 
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Select All
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {houseRepresentatives.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  isSelected={selectedCandidates.includes(candidate.id)}
                  onToggleSelect={handleToggleCandidate}
                />
              ))}
            </div>
          </div>
        )}

        {senateCandidates.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold">Senate</h3>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="selectAllSenate"
                  checked={areAllSenateSelected}
                  onCheckedChange={() => handleSelectAllSenate()}
                />
                <label 
                  htmlFor="selectAllSenate" 
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Select All
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {senateCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  isSelected={selectedCandidates.includes(candidate.id)}
                  onToggleSelect={handleToggleCandidate}
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
