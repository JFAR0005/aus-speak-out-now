
import { Candidate } from "../types";
import { generateLetterForCandidate, generateLetterWithLegacyParams, StanceType, ToneType } from "../utils/letterUtils/letterGenerator";
import { extractDocumentInsights } from "../utils/letterUtils/documentProcessor";
import { qualityCheck } from "../utils/letterUtils/textCleaner";

export interface LetterGenerationOptions {
  concern: string;
  uploadedContent?: string | null;
  tone?: ToneType;
  stance?: StanceType;
  personalExperience?: string;
  policyIdeas?: string;
  userDetails?: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
}

export const generateLetters = async (
  candidates: Candidate[],
  options: LetterGenerationOptions
): Promise<Record<string, string>> => {
  const {
    concern,
    uploadedContent = null,
    tone = 'formal',
    stance = 'concerned',
    personalExperience = '',
    policyIdeas = '',
    userDetails
  } = options;
  
  let processedConcern = concern;
  let documentInsights = '';
  
  // If we're getting a placeholder like "your previous concern", use a meaningful default
  // This prevents generic empty letters during regeneration
  if (concern === "your previous concern" || !concern.trim()) {
    // Check if we have a stored concern in sessionStorage
    const storedConcern = sessionStorage.getItem('userLetterConcern');
    if (storedConcern) {
      processedConcern = storedConcern;
      console.log("Retrieved stored concern:", processedConcern);
    } else {
      processedConcern = "important policy matters affecting our community";
    }
  } else {
    // Store valid concerns for future regenerations
    sessionStorage.setItem('userLetterConcern', processedConcern);
    console.log("Stored user concern:", processedConcern);
  }
  
  try {
    // Process document insights first, with better error handling
    if (uploadedContent) {
      try {
        // Process document insights without referencing the file directly
        documentInsights = extractDocumentInsights(uploadedContent, processedConcern);
        console.log("Document insights extracted:", documentInsights ? "Yes" : "No");
      } catch (error) {
        console.error("Error processing document:", error);
        documentInsights = '';
      }
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const letters: Record<string, string> = {};
          
          const batchSize = 1;
          const totalCandidates = candidates.length;
          
          for (let i = 0; i < totalCandidates; i += batchSize) {
            const batch = candidates.slice(i, i + batchSize);
            
            for (const candidate of batch) {
              try {
                // Use the new letter generator with full options
                let generatedLetter = generateLetterForCandidate(
                  candidate,
                  {
                    concern: processedConcern,
                    documentInsights: documentInsights || undefined,
                    stance,
                    personalExperience,
                    policyIdeas,
                    tone,
                    userDetails
                  }
                );
                
                // Apply quality check and Australian English fixes
                generatedLetter = qualityCheck(generatedLetter);
                
                letters[candidate.id] = generatedLetter;
              } catch (err) {
                console.error(`Error generating letter for ${candidate.name}:`, err);
                
                // Fallback to legacy method if needed
                try {
                  const fallbackLetter = generateLetterWithLegacyParams(
                    candidate,
                    processedConcern,
                    documentInsights,
                    tone,
                    userDetails
                  );
                  letters[candidate.id] = fallbackLetter;
                } catch (fallbackErr) {
                  console.error(`Fallback also failed for ${candidate.name}:`, fallbackErr);
                  letters[candidate.id] = `Error generating letter for ${candidate.name}. Please try again.`;
                }
              }
            }
          }
          
          resolve(letters);
        } catch (error) {
          console.error("Error in letter generation process:", error);
          resolve({});
        }
      }, 10);
    });
  } catch (error) {
    console.error("Fatal error in generateLetters:", error);
    return {};
  }
};

// For backward compatibility
export const generateLetter = async (
  candidates: Candidate[],
  concern: string,
  uploadedContent: string | null = null,
  tone: ToneType = 'formal'
): Promise<string> => {
  const letters = await generateLetters(candidates, { concern, uploadedContent, tone });
  return Object.values(letters).join('\n\n---\n\n');
};
