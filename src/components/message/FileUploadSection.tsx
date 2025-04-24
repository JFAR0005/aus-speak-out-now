
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface FileUploadSectionProps {
  isProcessingFile: boolean;
  uploadedFile: File | null;
  fileError: string | null;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFile: () => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  isProcessingFile,
  uploadedFile,
  fileError,
  onFileUpload,
  onClearFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
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
            onChange={onFileUpload}
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
              onClick={onClearFile} 
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
        Supported formats: PDF, DOC, DOCX, TXT (max 5MB). Attach documents to include stats or key points.
      </p>
      
      <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
        <div className="flex gap-2 items-start">
          <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
          <p className="text-xs text-amber-700">
            We'll include information based on your upload, but please fact-check for accuracy before sending.
            Any statistics or key points extracted will be incorporated into your letter where relevant.
          </p>
        </div>
      </div>
      
      {fileError && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{fileError}</AlertDescription>
        </Alert>
      )}
      
      {uploadedFile && !fileError && (
        <div className="mt-2 p-2 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-xs text-green-600">
            <span className="font-semibold">✓ Content extracted</span> - insights from this document will be used in your letters
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
