import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Sparkles,
  FileText,
  AlertCircle
} from "lucide-react";
import { Electorate, Candidate } from "../types";
import { generateLetters } from "../services/letterService";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import UserDetailsForm from "./UserDetailsForm";
import { useUserDetails } from "../hooks/useUserDetails";

interface MessageStepProps {
  electorate: Electorate;
  selectedCandidates: string[];
  userConcern: string;
  setUserConcern: (concern: string) => void;
  onGenerateLetter: (letter: string) => void;
  onGenerateMultipleLetters?: (letters: Record<string, string>) => void;
  onPrevious: () => void;
  onContinue: () => void;
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
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [letterTone, setLetterTone] = useState("formal");
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { userDetails, setUserDetails } = useUserDetails();

  const selectedCandidatesList = electorate.candidates.filter(c => 
    selectedCandidates.includes(c.id)
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    
    const readTimeout = setTimeout(() => {
      if (isProcessingFile) {
        reader.abort();
        setFileError("File processing timed out. The file might be too large or complex.");
        setIsProcessingFile(false);
        
        toast({
          variant: "destructive",
          title: "Processing timeout",
          description: "File processing took too long. Please try a smaller or simpler file.",
        });
      }
    }, 10000);

    reader.onload = (e) => {
      clearTimeout(readTimeout);
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
      clearTimeout(readTimeout);
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
  };

  const clearFile = () => {
    setUploadedFile(null);
    setFileContent(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUserDetailsChange = (field: string, value: string) => {
    setUserDetails(prev => ({
      ...prev,
      [field]: value
    }));
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

    if (userConcern.trim()) {
      sessionStorage.setItem('userLetterConcern', userConcern.trim());
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      const progressToast = toast({
        title: "Generating letters",
        description: "Creating personalized letters for each candidate...",
      });
      
      try {
        const letters = await generateLetters(
          selectedCandidatesList,
          userConcern,
          fileContent,
          letterTone,
          userDetails
        );
        
        if (Object.keys(letters).length === 0) {
          throw new Error("Failed to generate letters");
        }
        
        const combinedLetter = Object.values(letters).join('\n\n---\n\n');
        onGenerateLetter(combinedLetter);
        
        if (onGenerateMultipleLetters) {
          onGenerateMultipleLetters(letters);
        }
        
        onContinue();
      } catch (error) {
        console.error("Error generating letter:", error);
        toast({
          variant: "destructive",
          title: "Generation failed",
          description: "There was an error generating your letters. Please try again.",
        });
      } finally {
        setIsGenerating(false);
      }
    } catch (error) {
      console.error("Error generating letter:", error);
      setIsGenerating(false);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "There was an error generating your letter. Please try again.",
      });
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
            <UserDetailsForm
              firstName={userDetails.firstName}
              lastName={userDetails.lastName}
              phone={userDetails.phone}
              email={userDetails.email}
              onChange={handleUserDetailsChange}
            />

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
              <p className="text-xs text-gray-500 mt-1">
                Be specific about your concern. The AI will use your words to craft a personalized message.
              </p>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">
                Letter tone
              </label>
              <Select 
                value={letterTone} 
                onValueChange={setLetterTone}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="passionate">Passionate</SelectItem>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="hopeful">Hopeful</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Choose the tone for your letters - each will be uniquely written
              </p>
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
                Upload a document with facts or evidence
              </label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  className="relative overflow-hidden"
                  type="button"
                  disabled={isProcessingFile}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    disabled={isProcessingFile}
                  />
                  <Upload className="mr-2 h-4 w-4" /> {isProcessingFile ? "Processing..." : "Choose File"}
                </Button>
                {uploadedFile ? (
                  <div className="flex items-center ml-3">
                    <FileText className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">{uploadedFile.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFile} 
                      className="ml-2 h-6 p-0 text-xs text-gray-500"
                      disabled={isProcessingFile}
                    >
                      Clear
                    </Button>
                  </div>
                ) : (
                  <span className="ml-3 text-sm text-gray-500">
                    No file chosen
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, DOC, DOCX, TXT (max 5MB)
              </p>
              
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex gap-2 items-start">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    Note: We will attempt to include relevant statistics or information from any file you upload, 
                    but we do not guarantee accuracy or completeness. Please review and fact-check the generated 
                    letter carefully before sending.
                  </p>
                </div>
              </div>
              
              {fileError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{fileError}</AlertDescription>
                </Alert>
              )}
              
              {fileContent && !fileError && (
                <div className="mt-2 p-2 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-xs text-green-600">
                    <span className="font-semibold">✓ Content extracted</span> - insights from this document will be used in your letters
                  </p>
                </div>
              )}
            </div>
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
