
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, ChevronLeft, Upload, Sparkles } from "lucide-react";
import { Electorate, Candidate } from "../types";
import { generateLetter } from "../services/letterService";
import { useToast } from "@/hooks/use-toast";

interface MessageStepProps {
  electorate: Electorate;
  selectedCandidates: string[];
  userConcern: string;
  setUserConcern: (concern: string) => void;
  onGenerateLetter: (letter: string) => void;
  onPrevious: () => void;
  onContinue: () => void;
}

const MessageStep: React.FC<MessageStepProps> = ({
  electorate,
  selectedCandidates,
  userConcern,
  setUserConcern,
  onGenerateLetter,
  onPrevious,
  onContinue,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const selectedCandidatesList = electorate.candidates.filter(c => 
    selectedCandidates.includes(c.id)
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // In a real app, we would process the file and extract text
    // For this demo, we'll just store the file and update the UI
    setUploadedFile(file);
    toast({
      title: "File uploaded",
      description: `${file.name} has been uploaded and will be processed.`,
    });
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

    setIsGenerating(true);
    try {
      const letter = await generateLetter(
        selectedCandidatesList,
        userConcern || `the issues mentioned in my uploaded file: ${uploadedFile?.name}`
      );
      onGenerateLetter(letter);
      onContinue();
    } catch (error) {
      console.error("Error generating letter:", error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "There was an error generating your letter. Please try again.",
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
            Describe your concern or upload relevant material and we'll help draft a personalized letter
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
          <h3 className="font-medium text-lg mb-4">
            Your selected candidates ({selectedCandidatesList.length}):
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCandidatesList.map((candidate) => (
              <div 
                key={candidate.id}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center"
              >
                <span>{candidate.name}</span>
                <span className="mx-1 text-gray-400">•</span>
                <span className="text-gray-500 text-xs">{candidate.party}</span>
              </div>
            ))}
          </div>
          
          <Separator className="my-4" />

          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">
                What issue or concern would you like to address?
              </label>
              <Textarea
                placeholder="e.g., I'm concerned about climate change policies and their impact on..."
                value={userConcern}
                onChange={(e) => setUserConcern(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div className="flex items-center">
              <div className="flex-grow">
                <Separator />
              </div>
              <div className="px-3 text-sm text-gray-500">OR</div>
              <div className="flex-grow">
                <Separator />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Upload a relevant document
              </label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  className="relative overflow-hidden"
                  type="button"
                >
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                  />
                  <Upload className="mr-2 h-4 w-4" /> Choose File
                </Button>
                <span className="ml-3 text-sm text-gray-500">
                  {uploadedFile ? uploadedFile.name : "No file chosen"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, DOC, DOCX, TXT (max 5MB)
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrevious}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button onClick={handleGenerateLetter} disabled={isGenerating}>
            {isGenerating ? (
              "Generating..."
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Generate Letter
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageStep;
