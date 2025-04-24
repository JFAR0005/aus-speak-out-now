import { Candidate } from "../../types";
import { formatDate } from "./dateFormatter";
import { generateTitle } from "./titleGenerator";
import { cleanInputText, qualityCheck } from "./textCleaner";
import { generateSubjectLine } from "./subjectGenerator";
import { getRandomStatistic } from "./statisticsProvider";

interface UserDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export const generateLetterForCandidate = (
  candidate: Candidate,
  concern: string,
  documentInsights: string,
  tone: string,
  userDetails?: UserDetails
): string => {
  const candidateTitle = generateTitle(candidate);
  const fullName = candidateTitle ? `${candidateTitle} ${candidate.name}` : candidate.name;
  const partyInfo = candidate.party ? ` for the ${candidate.party}` : '';
  
  // Format user details section
  const formattedUserDetails = userDetails && (userDetails.firstName || userDetails.lastName) ? 
    `${userDetails.firstName} ${userDetails.lastName}`.trim() : '[Your Name]';
  const formattedUserPhone = userDetails?.phone || '[Your Phone]';
  const formattedUserEmail = userDetails?.email || '[Your Email]';
  
  let roleDescription = '';
  if (candidate.chamber === "house") {
    roleDescription = `prospective elected representative for the federal seat of ${candidate.division || "your area"}`;
  } else if (candidate.chamber === "senate") {
    roleDescription = `Senate candidate for the state of ${candidate.state || "your state"}`;
  } else {
    roleDescription = `prospective elected representative for ${candidate.division || candidate.state || "your area"}`;
  }
  
  const letterDate = formatDate(new Date());
  const subject = generateSubjectLine(concern);
  const concernContext = cleanInputText(concern);
  const relevantStatistic = getRandomStatistic(concernContext);
  
  // Generate appropriate opening based on tone
  let opening = '';
  let body = '';
  let questions = '';
  
  switch (tone) {
    case 'formal':
      opening = `I am writing to you as a constituent to address ${concernContext}.`;
      break;
    case 'passionate':
      opening = `I am writing as a deeply concerned constituent regarding ${concernContext}.`;
      break;
    case 'direct':
      opening = `I am writing to understand your position on ${concernContext}.`;
      break;
    case 'hopeful':
      opening = `I am writing to discuss ${concernContext} and the potential for positive change.`;
      break;
  }
  
  // Format document insights if available
  const insightsSection = documentInsights ? `${documentInsights}\n` : '';
  
  // Add relevant statistic
  body = `${relevantStatistic}\n\nAs a ${roleDescription}${partyInfo}, your position on this issue is of great importance to constituents like myself.`;
  
  // Generate questions based on tone
  switch (tone) {
    case 'formal':
      questions = `1. What specific policies or measures do you propose to address this issue?\n2. How will you ensure effective implementation if elected?\n3. What timeline do you envision for making meaningful progress?`;
      break;
    case 'passionate':
      questions = `1. What immediate actions will you take to address this urgent issue?\n2. How will you ensure community voices are heard in the decision-making process?\n3. Will you commit to making this a priority in your first term?`;
      break;
    case 'direct':
      questions = `1. What is your specific position on this issue?\n2. What concrete steps will you take if elected?\n3. How will you measure and report on progress?`;
      break;
    case 'hopeful':
      questions = `1. What positive changes do you envision for our community?\n2. How can constituents participate in shaping these solutions?\n3. What resources will you commit to this cause?`;
      break;
  }
  
  // Assemble the letter with proper spacing and formatting
  let letterText = `${formattedUserDetails}
${formattedUserEmail}
${formattedUserPhone}

${letterDate}

${fullName}
${candidate.email}

Dear ${fullName},

${subject}

${opening}

${insightsSection}${body}

I would appreciate your response to the following questions:

${questions}

I look forward to your response.

Yours sincerely,

${formattedUserDetails}`;

  return qualityCheck(letterText);
};
