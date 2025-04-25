import { Candidate } from "../types";
import { generateLetterForCandidate, generateLetterWithLegacyParams, StanceType, ToneType } from "../utils/letterUtils/letterGenerator";
import { extractDocumentInsights } from "../utils/letterUtils/documentProcessor";
import { qualityCheck } from "../utils/letterUtils/textCleaner";
import { supabase } from "@/integrations/supabase/client";

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

const logLetterGeneration = async (
  chamberType: string,
  electorate: string,
  numCandidates: number,
  concern?: string,
  tone?: ToneType,
  stance?: StanceType
) => {
  try {
    await supabase
      .from('letter_generation_logs')
      .insert({
        chamber_type: chamberType,
        electorate: electorate,
        num_candidates: numCandidates,
        concern_topic: concern,
        tone: tone,
        stance: stance
      });
  } catch (error) {
    console.error('Error logging letter generation:', error);
  }
};

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
  
  if (concern === "your previous concern" || !concern.trim()) {
    const storedConcern = sessionStorage.getItem('userLetterConcern');
    if (storedConcern) {
      processedConcern = storedConcern;
      console.log("Retrieved stored concern:", processedConcern);
    } else {
      processedConcern = "important policy matters affecting our community";
    }
  } else {
    sessionStorage.setItem('userLetterConcern', processedConcern);
    console.log("Stored user concern:", processedConcern);
  }
  
  try {
    if (candidates.length > 0) {
      await logLetterGeneration(
        candidates[0].chamber || 'unknown',
        candidates[0].electorate || 'unknown',
        candidates.length,
        processedConcern,
        tone,
        stance
      );
    }
    
    if (uploadedContent) {
      try {
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
                
                generatedLetter = qualityCheck(generatedLetter);
                
                letters[candidate.id] = generatedLetter;
              } catch (err) {
                console.error(`Error generating letter for ${candidate.name}:`, err);
                
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

export const generateLetter = async (
  candidates: Candidate[],
  concern: string,
  uploadedContent: string | null = null,
  tone: ToneType = 'formal'
): Promise<string> => {
  const letters = await generateLetters(candidates, { concern, uploadedContent, tone });
  return Object.values(letters).join('\n\n---\n\n');
};
