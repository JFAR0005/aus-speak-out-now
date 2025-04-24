
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
    // Only include fields that have content
    const submissionRecord: any = {
      concern: submissionData.concern,
    };
    
    // Only add fields that have actual content - use trim to check for whitespace-only values
    if (submissionData.senderName && submissionData.senderName.trim() !== "") {
      submissionRecord.sender_name = submissionData.senderName.trim();
    }
    
    if (submissionData.senderEmail && submissionData.senderEmail.trim() !== "") {
      submissionRecord.sender_email = submissionData.senderEmail.trim();
    }
    
    if (submissionData.senderPhone && submissionData.senderPhone.trim() !== "") {
      submissionRecord.sender_phone = submissionData.senderPhone.trim();
    }
    
    if (submissionData.stance) {
      submissionRecord.stance = submissionData.stance;
    }
    
    if (submissionData.tone) {
      submissionRecord.tone = submissionData.tone;
    }
    
    if (submissionData.personalExperience && submissionData.personalExperience.trim() !== "") {
      submissionRecord.personal_experience = submissionData.personalExperience.trim();
    }
    
    if (submissionData.policyIdeas && submissionData.policyIdeas.trim() !== "") {
      submissionRecord.policy_ideas = submissionData.policyIdeas.trim();
    }
    
    if (submissionData.uploadedContent && typeof submissionData.uploadedContent === 'string') {
      submissionRecord.uploaded_content = submissionData.uploadedContent;
    }
    
    if (submissionData.documentInsights && typeof submissionData.documentInsights === 'string') {
      submissionRecord.document_insights = submissionData.documentInsights;
    }

    // First, insert the submission record
    const { data: submission, error: submissionError } = await supabase
      .from('letter_submissions')
      .insert(submissionRecord)
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
