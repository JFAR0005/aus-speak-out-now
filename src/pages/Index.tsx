import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StepIndicator from "../components/StepIndicator";
import ChamberSelectionStep from "../components/ChamberSelectionStep";
import PostcodeStep from "../components/PostcodeStep";
import CandidatesStep from "../components/CandidatesStep";
import MessageStep from "../components/MessageStep";
import ReviewStep from "../components/ReviewStep";
import { Electorate, ChamberType } from "../types";
import { StanceType, ToneType } from "../utils/letterUtils/letterGenerator";

const steps = [
  "Select Chamber",
  "Find Representatives",
  "Select Candidates",
  "Draft Message",
  "Review & Send",
];

const Index = () => {
  // Application state
  const [currentStep, setCurrentStep] = useState(1);
  const [chamberType, setChamberType] = useState<ChamberType | null>(null);
  const [postcode, setPostcode] = useState("");
  const [selectedElectorate, setSelectedElectorate] = useState<Electorate | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [userConcern, setUserConcern] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [individualLetters, setIndividualLetters] = useState<Record<string, string>>({});

  // Step navigation handlers
  const handleChamberSelection = (chamber: ChamberType) => {
    setChamberType(chamber);
    setCurrentStep(2);
  };

  const handleContinueToStep3 = (electorate: Electorate) => {
    setSelectedElectorate(electorate);
    setCurrentStep(3);
  };

  const handleContinueToStep4 = () => {
    setCurrentStep(4);
  };

  const handleContinueToStep5 = () => {
    setCurrentStep(5);
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleBackToStep2 = () => {
    setCurrentStep(2);
  };

  const handleBackToStep3 = () => {
    setCurrentStep(3);
  };

  const handleBackToStep4 = () => {
    setCurrentStep(4);
  };

  // Candidate selection handler
  const handleToggleCandidate = (candidateId: string) => {
    console.log('Index: Toggle candidate', {
      candidateId,
      currentSelection: selectedCandidates,
      action: selectedCandidates.includes(candidateId) ? 'remove' : 'add',
      timestamp: new Date().toISOString()
    });

    setSelectedCandidates((prev) => {
      const isSelected = prev.includes(candidateId);
      const newSelection = isSelected
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId];
      
      console.log('Index: Updated selection', {
        previous: prev,
        new: newSelection,
        changed: candidateId
      });
      
      return newSelection;
    });
  };

  // Letter generation handlers
  const handleGenerateLetter = (letter: string) => {
    setGeneratedLetter(letter);
  };

  const handleGenerateMultipleLetters = (letters: Record<string, string>) => {
    setIndividualLetters(letters);
  };

  // Update individual letters
  const handleUpdateIndividualLetters = (letters: Record<string, string>) => {
    setIndividualLetters(letters);
  };

  // Regenerate letter handler
  const handleRegenerateLetter = () => {
    // Go back to message step
    setCurrentStep(4);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto mb-8">
          <StepIndicator currentStep={currentStep} steps={steps} />
        </div>

        <div className="container mx-auto">
          {currentStep === 1 && (
            <ChamberSelectionStep onChamberSelect={handleChamberSelection} />
          )}

          {currentStep === 2 && (
            <PostcodeStep
              chamberType={chamberType}
              postcode={postcode}
              setPostcode={setPostcode}
              onContinue={handleContinueToStep3}
              onPrevious={handleBackToStep1}
            />
          )}

          {currentStep === 3 && selectedElectorate && (
            <CandidatesStep
              electorate={selectedElectorate}
              selectedCandidates={selectedCandidates}
              onSelectCandidate={handleToggleCandidate}
              onPrevious={handleBackToStep2}
              onContinue={handleContinueToStep4}
            />
          )}

          {currentStep === 4 && selectedElectorate && (
            <MessageStep
              electorate={selectedElectorate}
              selectedCandidates={selectedCandidates}
              userConcern={userConcern}
              setUserConcern={setUserConcern}
              onGenerateLetter={handleGenerateLetter}
              onGenerateMultipleLetters={handleGenerateMultipleLetters}
              onPrevious={handleBackToStep3}
              onContinue={handleContinueToStep5}
            />
          )}

          {currentStep === 5 && selectedElectorate && (
            <ReviewStep
              electorate={selectedElectorate}
              selectedCandidates={selectedCandidates}
              generatedLetter={generatedLetter}
              individualLetters={individualLetters}
              onEditLetter={setGeneratedLetter}
              onUpdateIndividualLetters={handleUpdateIndividualLetters}
              onRegenerateLetter={handleRegenerateLetter}
              onPrevious={handleBackToStep4}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
