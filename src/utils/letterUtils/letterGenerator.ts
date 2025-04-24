
import { Candidate } from "../../types";
import { formatDate } from "./dateFormatter";
import { generateTitle } from "./titleGenerator";
import { cleanInputText, qualityCheck } from "./textCleaner";
import { generateSubjectLine } from "./subjectGenerator";
import { getRandomStatistic } from "./statisticsProvider";
import { getTopicContext } from "./topicIdentifier";

// Define types for our schema
export type StanceType = "support" | "oppose" | "neutral" | "concerned";
export type ToneType = "formal" | "passionate" | "direct" | "hopeful" | "empathetic" | "optimistic";

interface UserDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface LetterInputs {
  concern: string;
  documentInsights?: string;
  stance: StanceType;
  personalExperience?: string;
  policyIdeas?: string;
  tone: ToneType;
  userDetails?: UserDetails;
}

// Modular letter components
const generateGreeting = (candidateName: string, candidateTitle?: string): string => {
  const fullName = candidateTitle ? `${candidateTitle} ${candidateName}` : candidateName;
  return `Dear ${fullName},`;
};

const generateIntroduction = (concern: string, stance: StanceType, tone: ToneType): string => {
  const cleanConcern = cleanInputText(concern);
  
  // Base intros by stance
  const stanceIntros = {
    support: {
      formal: `I am writing to express my support for ${cleanConcern}.`,
      passionate: `I am writing as a passionate advocate for ${cleanConcern}.`,
      direct: `I strongly support ${cleanConcern} and am writing to understand your position on this matter.`,
      hopeful: `I believe in the importance of ${cleanConcern} and am writing to discuss how we might work together on this issue.`,
      empathetic: `I understand the complexities surrounding ${cleanConcern}, and I am writing to express my support for meaningful action in this area.`,
      optimistic: `I see great potential for positive change regarding ${cleanConcern} and am keen to learn about your position.`
    },
    oppose: {
      formal: `I am writing to express my concerns regarding ${cleanConcern}.`,
      passionate: `I am writing to voice my strong opposition to ${cleanConcern}.`,
      direct: `I oppose ${cleanConcern} and am writing to understand your position on this matter.`,
      hopeful: `I have serious reservations about ${cleanConcern} and hope we can discuss alternative approaches.`,
      empathetic: `While I understand there are different perspectives on ${cleanConcern}, I have significant concerns that I would like to share.`,
      optimistic: `I believe we can find better alternatives to ${cleanConcern} and am writing to discuss this important matter.`
    },
    neutral: {
      formal: `I am writing regarding ${cleanConcern}, on which I seek further information.`,
      passionate: `I am deeply interested in understanding more about ${cleanConcern}.`,
      direct: `I am writing to inquire about your position on ${cleanConcern}.`,
      hopeful: `I am writing to discuss ${cleanConcern} and hope to learn more about your perspective.`,
      empathetic: `I recognize the nuanced nature of ${cleanConcern} and would value hearing your thoughts on this matter.`,
      optimistic: `I am optimistic that through dialogue we can address the complexities of ${cleanConcern}.`
    },
    concerned: {
      formal: `I am writing to express my concern regarding ${cleanConcern}.`,
      passionate: `I am deeply concerned about ${cleanConcern} and its implications for our community.`,
      direct: `I have significant concerns about ${cleanConcern} and am writing to understand your position.`,
      hopeful: `I have concerns about ${cleanConcern}, but I'm hopeful that with proper leadership we can address these issues.`,
      empathetic: `I understand the challenges involved in addressing ${cleanConcern}, but I remain concerned about its impacts.`,
      optimistic: `While I have concerns about ${cleanConcern}, I believe with the right approach we can find effective solutions.`
    }
  };
  
  // Default to formal tone if specific tone not available
  const toneToUse = stanceIntros[stance][tone] ? tone : "formal";
  return stanceIntros[stance][toneToUse];
};

const generateFirstArgument = (concern: string, relevantStatistic: string): string => {
  return relevantStatistic;
};

const generateSecondArgument = (
  concern: string, 
  topicContext: string, 
  personalExperience?: string
): string => {
  if (personalExperience) {
    return `${topicContext}\n\n${personalExperience}`;
  }
  return topicContext;
};

const generatePolicyRequest = (
  roleDescription: string, 
  partyInfo: string,
  policyIdeas?: string
): string => {
  const baseRequest = `As a ${roleDescription}${partyInfo}, your position on this matter is crucial for our community.`;
  
  if (policyIdeas) {
    return `${baseRequest}\n\nI would like to suggest the following policy considerations: ${policyIdeas}`;
  }
  
  return baseRequest;
};

const generateDocumentInsightsSection = (documentInsights?: string): string => {
  if (!documentInsights) return '';
  
  return `\n\nBased on research I've reviewed: ${documentInsights}`;
};

const generateConclusion = (tone: ToneType): string => {
  const conclusions = {
    formal: "I would appreciate if you could outline: your detailed position on these matters, what specific policies you intend to implement if elected, and your proposed timeline for implementing these changes. A clear understanding of your policy agenda and implementation strategy would greatly inform my voting decision.",
    passionate: "I urge you to take strong action on this critical issue that affects so many Australians. Please detail your position, the concrete policies you plan to implement if elected, and your timeline for delivering these changes. Our community needs to understand your concrete plans for action.",
    direct: "Please provide specific information about: 1) Your position on this issue, 2) The exact policies you will implement if elected, and 3) Your timeline for implementing these changes. Our electorate deserves clear commitments with concrete deadlines.",
    hopeful: "I believe that with the right leadership, we can make meaningful progress on this issue. Could you please share your position on this matter, outline the specific policies you plan to implement if elected, and provide a timeline for these changes? Understanding your detailed plan would help me make an informed decision.",
    empathetic: "I understand the challenges of developing comprehensive policies on complex issues. However, I would greatly appreciate if you could share your position on this matter, outline any policies you plan to implement if elected, and provide an approximate timeline for these changes. This information would be valuable in helping me make an informed decision.",
    optimistic: "I'm optimistic that with thoughtful leadership, we can address this important issue effectively. I would value knowing your position on this matter, the specific policies you plan to implement if elected, and your proposed timeline for these changes. Your vision for addressing this issue will be an important factor in my voting decision."
  };
  
  return conclusions[tone] || conclusions.formal;
};

export const generateLetterForCandidate = (
  candidate: Candidate,
  inputs: LetterInputs
): string => {
  const {
    concern,
    documentInsights = '',
    stance = "concerned",
    personalExperience = '',
    policyIdeas = '',
    tone = "formal",
    userDetails
  } = inputs;
  
  // Format candidate information
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
  
  // Generate letter components
  const letterDate = formatDate(new Date());
  const subject = generateSubjectLine(concern);
  const concernContext = cleanInputText(concern);
  const relevantStatistic = getRandomStatistic(concernContext);
  const topicContext = getTopicContext(concernContext);
  
  // Assemble the letter sections
  const greeting = generateGreeting(fullName);
  const introduction = generateIntroduction(concern, stance, tone);
  const firstArgument = generateFirstArgument(concern, relevantStatistic);
  const secondArgument = generateSecondArgument(concern, topicContext, personalExperience);
  const policyRequest = generatePolicyRequest(roleDescription, partyInfo, policyIdeas);
  const documentInfo = generateDocumentInsightsSection(documentInsights);
  const conclusion = generateConclusion(tone);
  
  // Assemble the letter with proper spacing and Australian formatting
  let letterText = `${formattedUserDetails}
${formattedUserEmail}
${formattedUserPhone}

${letterDate}

${fullName}
${candidate.email}

${greeting}

${subject}

${introduction}

${firstArgument}

${secondArgument}

${policyRequest}${documentInfo}

${conclusion}

Yours sincerely,

${formattedUserDetails}`;

  // Apply quality checks and Australian English fixes
  return qualityCheck(letterText);
};

// For updating the service layer to use the new schema
export const generateLetterWithLegacyParams = (
  candidate: Candidate,
  concern: string,
  documentInsights: string | null = null,
  tone: ToneType = 'formal',
  userDetails?: UserDetails,
  stance: StanceType = "concerned",
  personalExperience: string = '',
  policyIdeas: string = ''
): string => {
  return generateLetterForCandidate(candidate, {
    concern,
    documentInsights: documentInsights || undefined,
    stance,
    personalExperience,
    policyIdeas,
    tone,
    userDetails
  });
};
