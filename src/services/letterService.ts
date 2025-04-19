
import { Candidate } from "../types";
import { generateLetterForCandidate } from "../utils/letterUtils/letterGenerator";
import { extractDocumentInsights } from "../utils/letterUtils/documentProcessor";

export const generateLetters = async (
  candidates: Candidate[],
  concern: string,
  uploadedContent: string | null = null,
  tone: string = 'formal'
): Promise<Record<string, string>> => {
  let documentInsights = '';
  
  try {
    if (uploadedContent) {
      return new Promise((resolve) => {
        setTimeout(() => {
          try {
            documentInsights = extractDocumentInsights(uploadedContent, concern);
            const letters: Record<string, string> = {};
            
            const batchSize = 1;
            const totalCandidates = candidates.length;
            
            for (let i = 0; i < totalCandidates; i += batchSize) {
              const batch = candidates.slice(i, i + batchSize);
              
              for (const candidate of batch) {
                try {
                  letters[candidate.id] = generateLetterForCandidate(
                    candidate,
                    concern,
                    documentInsights,
                    tone
                  );
                } catch (err) {
                  console.error(`Error generating letter for ${candidate.name}:`, err);
                  letters[candidate.id] = `Error generating letter for ${candidate.name}. Please try again.`;
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
    } else {
      const letters: Record<string, string> = {};
      
      for (const candidate of candidates) {
        try {
          letters[candidate.id] = generateLetterForCandidate(
            candidate,
            concern,
            '',
            tone
          );
        } catch (err) {
          console.error(`Error generating letter for ${candidate.name}:`, err);
          letters[candidate.id] = `Error generating letter for ${candidate.name}. Please try again.`;
        }
      }
      
      return letters;
    }
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
  tone: string = 'formal'
): Promise<string> => {
  const letters = await generateLetters(candidates, concern, uploadedContent, tone);
  return Object.values(letters).join('\n\n---\n\n');
};
