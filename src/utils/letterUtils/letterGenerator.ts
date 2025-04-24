import { Candidate } from "../../types";
import { formatDate } from "./dateFormatter";
import { generateTitle } from "./titleGenerator";
import { cleanInputText, qualityCheck } from "./textCleaner";
import { generateSubjectLine } from "./subjectGenerator";
import { getRandomStatistic } from "./statisticsProvider";
import { getTopicContext } from "./topicIdentifier";

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
  
  // Determine appropriate role description
  let roleDescription = '';
  if (candidate.chamber === "house") {
    roleDescription = `prospective candidate for the federal seat of ${candidate.division || "your area"}`;
  } else if (candidate.chamber === "senate") {
    roleDescription = `Senate candidate for the state of ${candidate.state || "your state"}`;
  } else {
    roleDescription = `prospective candidate for ${candidate.division || candidate.state || "your area"}`;
  }
  
  // If candidate is a sitting MP or senator, adjust accordingly
  if (candidate.role === "mp") {
    roleDescription = `elected Member for ${candidate.division || "your area"}`;
  } else if (candidate.role === "senator") {
    roleDescription = `elected Senator for ${candidate.state || "your state"}`;
  }
  
  const letterDate = formatDate(new Date());
  const subject = generateSubjectLine(concern);
  const concernContext = cleanInputText(concern);
  const relevantStatistic = getRandomStatistic(concernContext);
  
  // Get topic-specific context to help frame the letter
  const topicContext = getTopicContext(concernContext);
  
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
  
  // Add statistical evidence, topic context and personal context
  mainBody = `${relevantStatistic}\n\n${topicContext}\n\nAs a ${roleDescription}${partyInfo}, your position on this matter is crucial for our community.`;
  
  if (documentInsights) {
    mainBody += `\n\nBased on research I've reviewed: ${documentInsights}`;
  }
  
  // Generate appropriate closing based on tone
  switch (tone) {
    case 'formal':
      closingParagraph = "I would appreciate if you could outline: your detailed position on these matters, what specific policies you intend to implement if elected, and your proposed timeline for implementing these changes. A clear understanding of your policy agenda and implementation strategy would greatly inform my voting decision.";
      break;
    case 'passionate':
      closingParagraph = "I urge you to take strong action on this critical issue that affects so many Australians. Please detail your position, the concrete policies you plan to implement if elected, and your timeline for delivering these changes. Our community needs to understand your concrete plans for action.";
      break;
    case 'direct':
      closingParagraph = "Please provide specific information about: 1) Your position on this issue, 2) The exact policies you will implement if elected, and 3) Your timeline for implementing these changes. Our electorate deserves clear commitments with concrete deadlines.";
      break;
    case 'hopeful':
      closingParagraph = "I believe that with the right leadership, we can make meaningful progress on this issue. Could you please share your position on this matter, outline the specific policies you plan to implement if elected, and provide a timeline for these changes? Understanding your detailed plan would help me make an informed decision.";
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
