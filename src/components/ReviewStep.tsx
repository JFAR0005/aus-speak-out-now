
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Copy, Mail, RefreshCw, CheckCircle2 } from "lucide-react";
import { Electorate, Candidate } from "../types";
import { useToast } from "@/hooks/use-toast";

interface ReviewStepProps {
  electorate: Electorate;
  selectedCandidates: string[];
  generatedLetter: string;
  onEditLetter: (letter: string) => void;
  onRegenerateLetter: () => void;
  onPrevious: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  electorate,
  selectedCandidates,
  generatedLetter,
  onEditLetter,
  onRegenerateLetter,
  onPrevious,
}) => {
  const [letter, setLetter] = useState(generatedLetter);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const selectedCandidatesList = electorate.candidates.filter((c) =>
    selectedCandidates.includes(c.id)
  );

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    toast({
      title: "Letter copied",
      description: "The letter has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCopyEmails = () => {
    const emails = selectedCandidatesList.map((c) => c.email).join(", ");
    navigator.clipboard.writeText(emails);
    toast({
      title: "Emails copied",
      description: "All email addresses have been copied to your clipboard.",
    });
  };

  const handleSendEmail = () => {
    const emails = selectedCandidatesList.map((c) => c.email).join(";");
    const subject = "Constituent Outreach: Your Attention Required";
    const body = encodeURIComponent(letter);
    window.open(`mailto:${emails}?subject=${subject}&body=${body}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Review & Send Your Letter</h2>
          <p className="text-gray-600 mt-2">
            Edit your letter if needed, then send it or copy it to your clipboard
          </p>
        </div>

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
              <label className="block mb-2 font-medium">Your Letter</label>
              <Textarea
                value={letter}
                onChange={(e) => {
                  setLetter(e.target.value);
                  onEditLetter(e.target.value);
                }}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={onRegenerateLetter}
                className="text-sm"
              >
                <RefreshCw className="mr-2 h-3 w-3" /> Regenerate
              </Button>
            </div>

            <Alert className="bg-muted/70 border-muted">
              <AlertDescription className="text-xs text-muted-foreground">
                By sending this email, you acknowledge that the message will be sent from your email address. 
                We do not store or retain your personal information.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <Button variant="outline" onClick={onPrevious} className="sm:w-auto w-full">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={handleCopyLetter}
                  className="sm:w-auto w-full"
                >
                  {copied ? (
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
                
                <Button onClick={handleSendEmail} className="sm:w-auto w-full">
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
