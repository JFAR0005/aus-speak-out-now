import React, { useState } from "react";
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
  Sparkles
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
  const [activeTab, setActiveTab] = useState("all");
  const [regenerateTone, setRegenerateTone] = useState("formal");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [editableLetters, setEditableLetters] = useState<Record<string, string>>(
    Object.keys(individualLetters).length > 0 
      ? individualLetters 
      : { all: generatedLetter }
  );
  const [copiedState, setCopiedState] = useState<Record<string, boolean>>({});
  
  const { toast } = useToast();

  const selectedCandidatesList = electorate.candidates.filter((c) =>
    selectedCandidates.includes(c.id)
  );

  const handleEditLetter = (candidateId: string, newText: string) => {
    setEditableLetters(prev => ({
      ...prev,
      [candidateId]: newText
    }));
    
    if (candidateId === "all") {
      onEditLetter(newText);
    } else if (onUpdateIndividualLetters) {
      const updatedLetters = { ...editableLetters, [candidateId]: newText };
      delete updatedLetters.all;
      onUpdateIndividualLetters(updatedLetters);
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
    const allLettersText = selectedCandidatesList
      .map(candidate => editableLetters[candidate.id] || "")
      .filter(Boolean)
      .join("\n\n----------\n\n");
    
    navigator.clipboard.writeText(allLettersText);
    
    toast({
      title: "All letters copied",
      description: "All letters have been copied to your clipboard.",
    });
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
        const subject = "Constituent Outreach: Your Attention Required";
        const body = encodeURIComponent(editableLetters[candidateId] || "");
        window.open(`mailto:${candidate.email}?subject=${subject}&body=${body}`);
      }
    } else {
      const emails = selectedCandidatesList.map((c) => c.email).join(";");
      const subject = "Constituent Outreach: Your Attention Required";
      const body = encodeURIComponent(generatedLetter);
      window.open(`mailto:${emails}?subject=${subject}&body=${body}`);
    }
  };

  const handleRegenerateLetter = async (candidateId?: string) => {
    setIsRegenerating(true);
    
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
            description: `Letter for ${candidate.name} has been regenerated.`,
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
      setIsRegenerating(false);
    }
  };

  const renderCandidateTab = (candidate: Candidate) => {
    const candidateId = candidate.id;
    return (
      <TabsContent key={candidateId} value={candidateId} className="mt-4">
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-medium text-lg">{candidate.name}</h3>
                <p className="text-sm text-gray-500">{candidate.email}</p>
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
                  disabled={isRegenerating}
                  className="text-sm"
                >
                  <Sparkles className="mr-2 h-3 w-3" /> Regenerate
                </Button>
              </div>
            </div>

            <Textarea
              value={editableLetters[candidateId] || ""}
              onChange={(e) => handleEditLetter(candidateId, e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />

            <div className="flex justify-end mt-4 space-x-2">
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

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Review & Send Your Letter</h2>
          <p className="text-gray-600 mt-2">
            Edit your letter if needed, then send it or copy it to your clipboard
          </p>
        </div>

        {hasIndividualLetters ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger value="all">All Letters</TabsTrigger>
              {selectedCandidatesList.map((candidate) => (
                <TabsTrigger key={candidate.id} value={candidate.id}>
                  {candidate.name.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all">
              <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                <h3 className="font-medium text-lg mb-4">Recipients:</h3>
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
                    <label className="block mb-2 font-medium">Combined View</label>
                    <p className="text-sm text-gray-500 mb-4">
                      This view shows all letters combined. Switch to individual tabs above to edit each letter separately.
                    </p>
                    <Textarea
                      value={generatedLetter}
                      onChange={(e) => onEditLetter(e.target.value)}
                      className="min-h-[300px] font-mono text-sm"
                      readOnly
                    />
                  </div>

                  <Alert className="bg-muted/70 border-muted">
                    <AlertDescription className="text-xs text-muted-foreground">
                      By sending this email, you acknowledge that the message will be sent from your email address. 
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
            <h3 className="font-medium text-lg mb-4">Recipients:</h3>
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
                    className="text-sm"
                  >
                    <RefreshCw className="mr-2 h-3 w-3" /> Regenerate
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
