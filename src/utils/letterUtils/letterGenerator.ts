
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
  
  let opening = '';
  let mainBody = '';
  let closingParagraph = '';
  
  // Generate contextual opening based on tone
  switch (tone) {
    case 'formal':
      opening = `I am writing as a constituent regarding ${concernContext}.`;
      break;
    case 'passionate':
      opening = `I am writing to express my deep concern about ${concernContext}.`;
      break;
    case 'direct':
      opening = `I am writing to understand your position on ${concernContext}.`;
      break;
    case 'hopeful':
      opening = `I am writing to discuss how we can work together on ${concernContext}.`;
      break;
  }
  
  // Add statistical evidence and personal context
  mainBody = `${relevantStatistic}\n\nAs a ${roleDescription}${partyInfo}, your position on this matter is crucial for our community.`;
  
  if (documentInsights) {
    mainBody += `\n\n${documentInsights}`;
  }
  
  // Generate appropriate closing based on tone
  switch (tone) {
    case 'formal':
      closingParagraph = "I look forward to your detailed response on these matters.";
      break;
    case 'passionate':
      closingParagraph = "I urge you to take strong action on this critical issue.";
      break;
    case 'direct':
      closingParagraph = "Please outline your specific plans to address these concerns.";
      break;
    case 'hopeful':
      closingParagraph = "I believe together we can make meaningful progress on this issue.";
      break;
  }
  
  // Assemble the letter with proper spacing and Australian formatting
  let letterText = `${formattedUserDetails}
${formattedUserEmail}
${formattedUserPhone}

${letterDate}

${fullName}
${candidate.email}

Dear ${fullName},

${subject}

${opening}

${mainBody}

${closingParagraph}

Yours sincerely,

${formattedUserDetails}`;

  // Apply quality checks and Australian English fixes
  return qualityCheck(letterText);
};

