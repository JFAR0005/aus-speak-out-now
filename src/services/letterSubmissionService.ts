
import { supabase } from "@/integrations/supabase/client";
import { StanceType, ToneType } from "@/utils/letterUtils/letterGenerator";

interface LetterSubmissionData {
  senderName?: string;
  senderEmail?: string;
  senderPhone?: string;
  concern: string;
  stance?: StanceType;
  tone?: ToneType;
  personalExperience?: string;
  policyIdeas?: string;
  uploadedContent?: string;
  documentInsights?: string;
}

export const saveLetterSubmission = async (
  submissionData: LetterSubmissionData,
  letters: Record<string, { content: string; candidate: { id: string; name: string; email: string; party?: string; chamber?: string; } }>
) => {
  try {
    // First, insert the submission record
    const { data: submission, error: submissionError } = await supabase
      .from('letter_submissions')
      .insert({
        sender_name: submissionData.senderName,
        sender_email: submissionData.senderEmail,
        sender_phone: submissionData.senderPhone,
        concern: submissionData.concern,
        stance: submissionData.stance,
        tone: submissionData.tone,
        personal_experience: submissionData.personalExperience,
        policy_ideas: submissionData.policyIdeas,
        uploaded_content: submissionData.uploadedContent,
        document_insights: submissionData.documentInsights
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Error saving submission:', submissionError);
      return { success: false, error: submissionError };
    }

    // Then, insert records for each sent letter
    const sentLettersData = Object.entries(letters).map(([candidateId, { content, candidate }]) => ({
      submission_id: submission.id,
      candidate_id: candidate.id,
      candidate_name: candidate.name,
      candidate_email: candidate.email,
      candidate_party: candidate.party,
      candidate_chamber: candidate.chamber,
      letter_content: content
    }));

    const { error: lettersError } = await supabase
      .from('sent_letters')
      .insert(sentLettersData);

    if (lettersError) {
      console.error('Error saving sent letters:', lettersError);
      return { success: false, error: lettersError };
    }

    return { success: true, submissionId: submission.id };
  } catch (error) {
    // Log the error but don't prevent the email client from opening
    console.error('Error saving letter submission:', error);
    return { success: false, error };
  }
};
