
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StepIndicator from "../components/StepIndicator";
import PostcodeStep from "../components/PostcodeStep";
import CandidatesStep from "../components/CandidatesStep";
import MessageStep from "../components/MessageStep";
import ReviewStep from "../components/ReviewStep";
import { Electorate } from "../types";

const steps = [
  "Find Representatives",
  "Select Candidates",
  "Draft Message",
  "Review & Send",
];

const Index = () => {
  // Application state
  const [currentStep, setCurrentStep] = useState(1);
  const [postcode, setPostcode] = useState("");
  const [selectedElectorate, setSelectedElectorate] = useState<Electorate | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [userConcern, setUserConcern] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState("");

  // Step navigation handlers
  const handleContinueToStep2 = (electorate: Electorate) => {
    setSelectedElectorate(electorate);
    setCurrentStep(2);
  };

  const handleContinueToStep3 = () => {
    setCurrentStep(3);
  };

  const handleContinueToStep4 = () => {
    setCurrentStep(4);
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

  // Candidate selection handler
  const handleToggleCandidate = (candidateId: string) => {
    setSelectedCandidates((prev) => {
      if (prev.includes(candidateId)) {
        return prev.filter((id) => id !== candidateId);
      } else {
        return [...prev, candidateId];
      }
    });
  };

  // Letter generation handler
  const handleGenerateLetter = (letter: string) => {
    setGeneratedLetter(letter);
  };

  // Regenerate letter handler
  const handleRegenerateLetter = () => {
    // Go back to message step
    setCurrentStep(3);
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
            <PostcodeStep
              postcode={postcode}
              setPostcode={setPostcode}
              onContinue={handleContinueToStep2}
            />
          )}

          {currentStep === 2 && selectedElectorate && (
            <CandidatesStep
              electorate={selectedElectorate}
              selectedCandidates={selectedCandidates}
              onSelectCandidate={handleToggleCandidate}
              onPrevious={handleBackToStep1}
              onContinue={handleContinueToStep3}
            />
          )}

          {currentStep === 3 && selectedElectorate && (
            <MessageStep
              electorate={selectedElectorate}
              selectedCandidates={selectedCandidates}
              userConcern={userConcern}
              setUserConcern={setUserConcern}
              onGenerateLetter={handleGenerateLetter}
              onPrevious={handleBackToStep2}
              onContinue={handleContinueToStep4}
            />
          )}

          {currentStep === 4 && selectedElectorate && (
            <ReviewStep
              electorate={selectedElectorate}
              selectedCandidates={selectedCandidates}
              generatedLetter={generatedLetter}
              onEditLetter={setGeneratedLetter}
              onRegenerateLetter={handleRegenerateLetter}
              onPrevious={handleBackToStep3}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
