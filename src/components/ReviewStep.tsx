
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, 
  Copy, 
  Mail, 
  RefreshCw, 
  CheckCircle2, 
  Download,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { Electorate, Candidate } from "../types";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateLetters } from "../services/letterService";

interface ReviewStepProps {
  electorate: Electorate;
  selectedCandidates: string[];
  generatedLetter: string;
  individualLetters?: Record<string, string>;
  onEditLetter: (letter: string) => void;
  onRegenerateLetter: () => void;
  onUpdateIndividualLetters?: (letters: Record<string, string>) => void;
  onPrevious: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  electorate,
  selectedCandidates,
  generatedLetter,
  individualLetters = {},
  onEditLetter,
  onRegenerateLetter,
  onUpdateIndividualLetters,
  onPrevious,
}) => {
  // Initialize active tab and make sure it exists in selected candidates
  const [activeTab, setActiveTab] = useState<string>("");
  const [regenerateTone, setRegenerateTone] = useState("formal");
  const [isRegenerating, setIsRegenerating] = useState<Record<string, boolean>>({});
  const [editableLetters, setEditableLetters] = useState<Record<string, string>>({});
  const [copiedState, setCopiedState] = useState<Record<string, boolean>>({});
  
  const { toast } = useToast();

  const selectedCandidatesList = electorate.candidates.filter((c) =>
    selectedCandidates.includes(c.id)
  );
  
  // Set initial state based on props - moved to useEffect to avoid render blocking
  useEffect(() => {
    // Initialize editableLetters
    if (Object.keys(individualLetters).length > 0) {
      setEditableLetters(individualLetters);
    } else {
      setEditableLetters({ all: generatedLetter });
    }
    
    // Initialize activeTab to either the first candidate or "all"
    setActiveTab(selectedCandidates[0] || "all");
  }, [individualLetters, generatedLetter, selectedCandidates]);

  const handleEditLetter = (candidateId: string, newText: string) => {
    setEditableLetters(prev => ({
      ...prev,
      [candidateId]: newText
    }));
    
    if (candidateId === "all") {
      onEditLetter(newText);
    } else if (onUpdateIndividualLetters) {
      // Use setTimeout to prevent UI blocking
      setTimeout(() => {
        const updatedLetters = { ...editableLetters, [candidateId]: newText };
        delete updatedLetters.all;
        onUpdateIndividualLetters(updatedLetters);
      }, 0);
    }
  };

  const handleCopyLetter = (candidateId: string) => {
    navigator.clipboard.writeText(editableLetters[candidateId] || "");
    
    setCopiedState(prev => ({
      ...prev,
      [candidateId]: true
    }));
    
    toast({
      title: "Letter copied",
      description: "The letter has been copied to your clipboard.",
    });
    
    setTimeout(() => {
      setCopiedState(prev => ({
        ...prev,
        [candidateId]: false
      }));
    }, 3000);
  };

  const handleCopyAllLetters = () => {
    // Prepare text in a non-blocking way
    setTimeout(() => {
      const allLettersText = selectedCandidatesList
        .map(candidate => {
          const letterText = editableLetters[candidate.id] || "";
          return `---- LETTER TO ${candidate.name.toUpperCase()} (${candidate.party}) ----\n\n${letterText}\n\n`;
        })
        .filter(Boolean)
        .join("\n\n----------\n\n");
      
      navigator.clipboard.writeText(allLettersText);
      
      toast({
        title: "All letters copied",
        description: "All letters have been copied to your clipboard.",
      });
    }, 0);
  };

  const handleCopyEmails = () => {
    const emails = selectedCandidatesList.map((c) => c.email).join(", ");
    navigator.clipboard.writeText(emails);
    toast({
      title: "Emails copied",
      description: "All email addresses have been copied to your clipboard.",
    });
  };

  const handleSendEmail = (candidateId?: string) => {
    if (candidateId && candidateId !== "all") {
      const candidate = selectedCandidatesList.find(c => c.id === candidateId);
      if (candidate) {
        // Create a subject line based on content
        const letterText = editableLetters[candidateId] || "";
        const subjectMatch = letterText.match(/Re: (.*?)(?:\n|$)/);
        const subject = subjectMatch ? subjectMatch[1] : "Constituent Outreach: Your Attention Required";
        
        const body = encodeURIComponent(letterText);
        window.open(`mailto:${candidate.email}?subject=${subject}&body=${body}`);
        
        toast({
          title: "Email client opened",
          description: `Preparing to send email to ${candidate.name}.`,
        });
      }
    } else if (candidateId === "all") {
      // Send to all candidates
      const emails = selectedCandidatesList.map((c) => c.email).join(";");
      const subject = "Constituent Outreach: Your Attention Required";
      const body = encodeURIComponent(generatedLetter);
      window.open(`mailto:${emails}?subject=${subject}&body=${body}`);
      
      toast({
        title: "Email client opened",
        description: `Preparing to send email to all ${selectedCandidatesList.length} recipients.`,
      });
    } else {
      // Use the current active tab
      handleSendEmail(activeTab);
    }
  };

  const handleRegenerateLetter = async (candidateId?: string) => {
    // Set regenerating state for specific candidate
    setIsRegenerating(prev => ({
      ...prev,
      [candidateId || "all"]: true
    }));
    
    try {
      // Use setTimeout to prevent UI blocking
      setTimeout(async () => {
        try {
          if (candidateId && candidateId !== "all") {
            const candidate = selectedCandidatesList.find(c => c.id === candidateId);
            if (candidate) {
              const letters = await generateLetters(
                [candidate],
                "your previous concern",
                null,
                regenerateTone
              );
              
              setEditableLetters(prev => ({
                ...prev,
                [candidateId]: letters[candidate.id]
              }));
              
              if (onUpdateIndividualLetters) {
                const updatedLetters = { 
                  ...editableLetters, 
                  [candidateId]: letters[candidate.id] 
                };
                delete updatedLetters.all;
                onUpdateIndividualLetters(updatedLetters);
              }
              
              toast({
                title: "Letter regenerated",
                description: `Letter for ${candidate.name} has been regenerated with a ${regenerateTone} tone.`,
              });
            }
          } else {
            onRegenerateLetter();
          }
        } catch (error) {
          console.error("Error regenerating letter:", error);
          toast({
            variant: "destructive",
            title: "Regeneration failed",
            description: "There was an error regenerating the letter. Please try again.",
          });
        } finally {
          setIsRegenerating(prev => ({
            ...prev,
            [candidateId || "all"]: false
          }));
        }
      }, 0);
    } catch (error) {
      console.error("Error preparing to regenerate letter:", error);
      setIsRegenerating(prev => ({
        ...prev,
        [candidateId || "all"]: false
      }));
      toast({
        variant: "destructive",
        title: "Regeneration failed",
        description: "There was an error regenerating the letter. Please try again.",
      });
    }
  };

  const renderCandidateTab = (candidate: Candidate) => {
    const candidateId = candidate.id;
    return (
      <TabsContent key={candidateId} value={candidateId} className="mt-4">
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-2">
              <div>
                <h3 className="font-medium text-lg">{candidate.name}</h3>
                <p className="text-sm text-gray-500">{candidate.email}</p>
                <p className="text-xs text-gray-500">{candidate.party}</p>
              </div>
              <div className="flex gap-2">
                <Select 
                  value={regenerateTone} 
                  onValueChange={setRegenerateTone}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="passionate">Passionate</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="hopeful">Hopeful</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRegenerateLetter(candidateId)}
                  disabled={isRegenerating[candidateId]}
                  className="text-sm"
                >
                  {isRegenerating[candidateId] ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Regenerating...
                    </span>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-3 w-3" /> Regenerate
                    </>
                  )}
                </Button>
              </div>
            </div>

            <Textarea
              value={editableLetters[candidateId] || ""}
              onChange={(e) => handleEditLetter(candidateId, e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />

            <div className="flex flex-wrap justify-end mt-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyLetter(candidateId)}
                className="text-sm"
              >
                {copiedState[candidateId] ? (
                  <>
                    <CheckCircle2 className="mr-2 h-3 w-3 text-green-600" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-3 w-3" /> Copy
                  </>
                )}
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={() => handleSendEmail(candidateId)}
                className="text-sm"
              >
                <Mail className="mr-2 h-3 w-3" /> Email
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    );
  };

  const hasIndividualLetters = Object.keys(individualLetters).length > 0 || selectedCandidatesList.length > 1;

  // Ensure activeTab is valid
  useEffect(() => {
    if (activeTab && !selectedCandidates.includes(activeTab) && activeTab !== "all") {
      setActiveTab(selectedCandidates[0] || "all");
    }
  }, [selectedCandidates, activeTab]);

  // Prevent rendering until we have a valid activeTab
  if (!activeTab) {
    return <div className="flex justify-center p-8">Loading letters...</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Review & Send Your Letters</h2>
          <p className="text-gray-600 mt-2">
            Each letter is uniquely written for each recipient. You can edit, regenerate, or send them individually.
          </p>
        </div>

        {hasIndividualLetters ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 w-full justify-start overflow-x-auto">
              {selectedCandidatesList.map((candidate) => (
                <TabsTrigger key={candidate.id} value={candidate.id} className="whitespace-nowrap">
                  {candidate.name.split(' ')[0]}
                </TabsTrigger>
              ))}
              <TabsTrigger value="all">View All</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                <h3 className="font-medium text-lg mb-4">All Recipients:</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedCandidatesList.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      <span>{candidate.name}</span>
                      <span className="mx-1 text-gray-400">•</span>
                      <span className="text-gray-500 text-xs">{candidate.email}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <label className="font-medium">Combined View (Read Only)</label>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      This view shows a preview of all letters. Each letter is uniquely written for its recipient.
                      Switch to individual tabs above to edit each letter separately.
                    </p>
                    
                    {selectedCandidatesList.map((candidate) => (
                      <div key={candidate.id} className="mb-6">
                        <h4 className="font-medium text-sm mb-2 bg-gray-100 p-2 rounded">
                          Letter to {candidate.name} ({candidate.party})
                        </h4>
                        <Textarea
                          value={editableLetters[candidate.id] || ""}
                          className="min-h-[200px] font-mono text-sm mb-4"
                          readOnly
                        />
                        <Separator className="mb-4" />
                      </div>
                    ))}
                  </div>

                  <Alert className="bg-muted/70 border-muted">
                    <AlertDescription className="text-xs text-muted-foreground">
                      By sending these emails, you acknowledge that the messages will be sent from your email address. 
                      We do not store or retain your personal information.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </TabsContent>
            
            {selectedCandidatesList.map(renderCandidateTab)}
          </Tabs>
        ) : (
          <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
            <h3 className="font-medium text-lg mb-4">Recipient:</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCandidatesList.map((candidate) => (
                <div
                  key={candidate.id}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  <span>{candidate.name}</span>
                  <span className="mx-1 text-gray-400">•</span>
                  <span className="text-gray-500 text-xs">{candidate.email}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block font-medium">Your Letter</label>
                <div className="flex gap-2">
                  <Select 
                    value={regenerateTone} 
                    onValueChange={setRegenerateTone}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="passionate">Passionate</SelectItem>
                      <SelectItem value="direct">Direct</SelectItem>
                      <SelectItem value="hopeful">Hopeful</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRegenerateLetter()}
                    disabled={isRegenerating["all"]}
                    className="text-sm"
                  >
                    {isRegenerating["all"] ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Regenerating...
                      </span>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-3 w-3" /> Regenerate
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={generatedLetter}
                onChange={(e) => onEditLetter(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />

              <Alert className="bg-muted/70 border-muted">
                <AlertDescription className="text-xs text-muted-foreground">
                  By sending this email, you acknowledge that the message will be sent from your email address. 
                  We do not store or retain your personal information.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <Button variant="outline" onClick={onPrevious} className="sm:w-auto w-full">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {hasIndividualLetters && (
                  <Button
                    variant="outline"
                    onClick={handleCopyAllLetters}
                    className="sm:w-auto w-full"
                  >
                    <Copy className="mr-2 h-4 w-4" /> Copy All Letters
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => handleCopyLetter(activeTab)}
                  className="sm:w-auto w-full"
                >
                  {copiedState[activeTab] ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" /> Copy Letter
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleCopyEmails}
                  className="sm:w-auto w-full"
                >
                  <Copy className="mr-2 h-4 w-4" /> Copy Emails
                </Button>
                
                <Button 
                  onClick={() => handleSendEmail(activeTab)} 
                  className="sm:w-auto w-full"
                >
                  <Mail className="mr-2 h-4 w-4" /> Send Email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReviewStep;
