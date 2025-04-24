import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, ChevronLeft, Sparkles, X } from "lucide-react";
import { Electorate } from "../types";
import { generateLetters, LetterGenerationOptions } from "../services/letterService";
import { useToast } from "@/hooks/use-toast";
import UserDetailsForm from "./UserDetailsForm";
import { useUserDetails } from "../hooks/useUserDetails";
import { StanceType, ToneType } from "../utils/letterUtils/letterGenerator";
import FileUploadSection from "./message/FileUploadSection";
import MessageOptions from "./message/MessageOptions";
import TextInputField from "./message/TextInputField";

interface MessageStepProps {
  electorate: Electorate;
  selectedCandidates: string[];
  userConcern: string;
  setUserConcern: (concern: string) => void;
  onGenerateLetter: (letter: string) => void;
  onGenerateMultipleLetters?: (letters: Record<string, string>) => void;
  onPrevious: () => void;
  onContinue: () => void;
  onSelectCandidate: (id: string) => void;
}

const MessageStep: React.FC<MessageStepProps> = ({
  electorate,
  selectedCandidates,
  userConcern,
  setUserConcern,
  onGenerateLetter,
  onGenerateMultipleLetters,
  onPrevious,
  onContinue,
  onSelectCandidate,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [letterTone, setLetterTone] = useState<ToneType>("formal");
  const [stance, setStance] = useState<StanceType>("concerned");
  const [personalExperience, setPersonalExperience] = useState("");
  const [policyIdeas, setPolicyIdeas] = useState("");
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const { toast } = useToast();
  const { userDetails, updateUserDetail } = useUserDetails();

  const handleRemoveCandidate = (candidateId: string) => {
    const updatedCandidates = selectedCandidates.filter(id => id !== candidateId);
    if (updatedCandidates.length === 0) {
      toast({
        variant: "destructive",
        title: "Cannot remove all candidates",
        description: "You must have at least one candidate selected.",
      });
      return;
    }
    onSelectCandidate(candidateId); // This will toggle/remove the candidate
  };

  const selectedCandidatesList = electorate.candidates.filter(c => 
    selectedCandidates.includes(c.id)
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      
      setUploadedFile(file);
      setFileError(null);
      setIsProcessingFile(true);
      
      if (file.size > 5 * 1024 * 1024) {
        setFileError("File too large. Maximum size is 5MB.");
        setIsProcessingFile(false);
        return;
      }
      
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!validTypes.includes(file.type)) {
        setFileError("Invalid file type. Please upload PDF, DOC, DOCX, or TXT files only.");
        setIsProcessingFile(false);
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const limitedText = text.substring(0, 20000);
          setFileContent(limitedText);
          setIsProcessingFile(false);
          
          toast({
            title: "File processed",
            description: `${file.name} has been processed. Any relevant insights will be included in your letters.`,
          });
        } catch (error) {
          console.error("Error reading file:", error);
          setFileError("Could not extract content from the file.");
          setIsProcessingFile(false);
          
          toast({
            variant: "destructive",
            title: "Processing failed",
            description: "Could not extract content from the file.",
          });
        }
      };
      
      reader.onerror = () => {
        setFileError("There was an error reading the file.");
        setIsProcessingFile(false);
        
        toast({
          variant: "destructive",
          title: "File error",
          description: "There was an error reading the file.",
        });
      };
      
      if (file.type === "text/plain") {
        reader.readAsText(file);
      } else {
        reader.readAsText(file);
      }
    } catch (error) {
      console.error("File upload error:", error);
      setFileError("An unexpected error occurred while processing the file.");
      setIsProcessingFile(false);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setFileContent(null);
    setFileError(null);
  };

  const handleGenerateLetter = async () => {
    if (!userConcern.trim() && !uploadedFile) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please describe your concern or upload a file.",
      });
      return;
    }

    if (!selectedCandidates.length) {
      toast({
        variant: "destructive",
        title: "No candidates selected",
        description: "Please select at least one candidate to generate letters.",
      });
      return;
    }

    if (userConcern.trim()) {
      sessionStorage.setItem('userLetterConcern', userConcern.trim());
    }

    setIsGenerating(true);
    
    try {
      const progressToast = toast({
        title: "Generating letters",
        description: "Creating personalized letters for each candidate...",
      });
      
      try {
        const options: LetterGenerationOptions = {
          concern: userConcern,
          uploadedContent: fileContent,
          tone: letterTone,
          stance,
          personalExperience,
          policyIdeas,
          userDetails
        };
        
        const letters = await generateLetters(selectedCandidatesList, options);
        
        if (!letters || Object.keys(letters).length === 0) {
          throw new Error("Failed to generate letters");
        }
        
        const combinedLetter = Object.values(letters).join('\n\n---\n\n');
        onGenerateLetter(combinedLetter);
        
        if (onGenerateMultipleLetters) {
          onGenerateMultipleLetters(letters);
        }
        
        sessionStorage.setItem('letterGenerationOptions', JSON.stringify({
          tone: letterTone,
          stance,
          personalExperience,
          policyIdeas,
        }));
        
        onContinue();
      } catch (error) {
        console.error("Error generating letter:", error);
        toast({
          variant: "destructive",
          title: "Generation failed",
          description: "There was an error generating your letters. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error in letter generation process:", error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Draft Your Message</h2>
          <p className="text-gray-600 mt-2">
            Describe your concern or upload relevant material and we'll help draft a personalized letter for each representative
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
          <h3 className="font-medium text-lg mb-4">Selected candidates:</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCandidatesList.map((candidate) => (
              <div 
                key={candidate.id}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center group"
              >
                <span>{candidate.name}</span>
                <span className="mx-1 text-gray-400">•</span>
                <span className="text-gray-500 text-xs">{candidate.party}</span>
                <button
                  onClick={() => handleRemoveCandidate(candidate.id)}
                  className="ml-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label={`Remove ${candidate.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          
          <Separator className="my-4" />

          <div className="space-y-4">
            <UserDetailsForm
              firstName={userDetails.firstName}
              lastName={userDetails.lastName}
              phone={userDetails.phone}
              email={userDetails.email}
              onChange={updateUserDetail}
            />

            <TextInputField
              label="What issue or concern would you like to address?"
              value={userConcern}
              onChange={setUserConcern}
              placeholder="e.g., I'm concerned about climate change policies and their impact on..."
              example={{
                title: "Example of a high-quality concern:",
                content: "I'm deeply concerned about the impact of climate change on our agricultural sector. Recent CSIRO reports indicate that changing rainfall patterns and increasing temperatures are already affecting crop yields in my region. As a resident of a farming community, I'm particularly interested in policies that support sustainable farming practices and help farmers adapt to these challenges."
              }}
            />
            
            <MessageOptions
              stance={stance}
              setStance={setStance}
              letterTone={letterTone}
              setLetterTone={setLetterTone}
            />
            
            <TextInputField
              label="Personal experience or context (optional)"
              value={personalExperience}
              onChange={setPersonalExperience}
              placeholder="Share a personal story or experience related to this issue..."
              example={{
                title: "Example of impactful personal context:",
                content: "As a small business owner in the renewable energy sector, I've witnessed firsthand how policy uncertainty affects investment decisions. Last year, we had to postpone hiring three new employees because of unclear renewable energy targets. This directly impacts local job creation and our ability to contribute to the clean energy transition."
              }}
            />
            
            <TextInputField
              label="Policy suggestions (optional)"
              value={policyIdeas}
              onChange={setPolicyIdeas}
              placeholder="Suggest specific policy ideas you'd like the candidate to consider..."
              example={{
                title: "Example of well-structured policy suggestions:",
                content: "1. Implement a 5-year tax incentive for businesses investing in renewable energy infrastructure\n2. Create a national framework for standardizing building energy efficiency requirements\n3. Establish a dedicated fund for supporting research into drought-resistant crop varieties\n4. Develop clear guidelines for carbon credit trading to benefit agricultural communities"
              }}
            />

            <div className="flex items-center">
              <div className="flex-grow">
                <Separator />
              </div>
              <div className="px-3 text-sm text-gray-500">OR</div>
              <div className="flex-grow">
                <Separator />
              </div>
            </div>

            <FileUploadSection
              isProcessingFile={isProcessingFile}
              uploadedFile={uploadedFile}
              fileError={fileError}
              onFileUpload={handleFileUpload}
              onClearFile={clearFile}
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrevious}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button 
            onClick={handleGenerateLetter} 
            disabled={isGenerating || isProcessingFile}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Generate Letters
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageStep;
