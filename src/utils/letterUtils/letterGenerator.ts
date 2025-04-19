
import { Candidate } from "../../types";
import { formatDate } from "./dateFormatter";
import { generateTitle } from "./titleGenerator";
import { cleanInputText } from "./textCleaner";
import { generateSubjectLine } from "./subjectGenerator";
import { getRandomStatistic } from "./statisticsProvider";

export const generateLetterForCandidate = (
  candidate: Candidate,
  concern: string,
  documentInsights: string,
  tone: string
): string => {
  const candidateTitle = generateTitle(candidate);
  const fullTitle = candidateTitle ? `${candidateTitle} ${candidate.name}` : candidate.name;
  const partyInfo = candidate.party ? ` for the ${candidate.party}` : '';
  
  let candidateRole = "prospective elected representative for the ";
  
  if (candidate.chamber === "house") {
    candidateRole += `federal seat of ${candidate.division || "your area"}`;
  } else if (candidate.chamber === "senate") {
    candidateRole += `state of ${candidate.state || "your state"}`;
  } else {
    candidateRole += candidate.electorate || 
                    (candidate.division ? `federal seat of ${candidate.division}` : 
                    (candidate.state ? `state of ${candidate.state}` : "your area"));
  }
  
  const greeting = `Dear ${fullTitle}`;
  const subject = generateSubjectLine(concern);
  
  let cleanedConcern = cleanInputText(concern);
  
  let opening = '';
  switch (tone) {
    case 'formal':
      opening = `I am writing to express my concerns regarding ${cleanedConcern}. ${documentInsights}`;
      break;
    case 'passionate':
      opening = `As a deeply concerned member of our community, I must address the urgent matter of ${cleanedConcern}. ${documentInsights}`;
      break;
    case 'direct':
      opening = `I am seeking your position on ${cleanedConcern}. ${documentInsights}`;
      break;
    case 'hopeful':
      opening = `I believe that as our ${candidateRole}, you can make a real difference regarding ${cleanedConcern}. ${documentInsights}`;
      break;
  }
  
  const body = candidate.party
    ? `As a ${candidateRole}${partyInfo}, your stance on this issue is crucial. ${getRandomStatistic(concern)}\n\nThe impact of this issue on our community is significant, and your leadership could make a meaningful difference.`
    : `As a ${candidateRole}, you have a unique opportunity to address this important issue. ${getRandomStatistic(concern)}\n\nOur community looks to its leaders for meaningful action on this matter.`;
  
  let closing = '';
  switch (tone) {
    case 'formal':
      closing = `I would welcome your response outlining your position and proposed policies on this matter. Would you be available to discuss this issue in more detail?`;
      break;
    case 'passionate':
      closing = `Please share your detailed position and specific policy commitments on this issue. What concrete steps would you take if elected?`;
      break;
    case 'direct':
      closing = `I request that you: 1) Clarify your position on this issue, 2) Detail your proposed actions, and 3) Provide a timeline for implementation.`;
      break;
    case 'hopeful':
      closing = `I would welcome the opportunity to discuss how we might work together to address this important issue for our community.`;
      break;
  }
  
  const signOff = tone === 'formal' ? 'Yours faithfully,' : 
                 tone === 'passionate' ? 'Kind regards,' :
                 tone === 'direct' ? 'Regards,' : 'Best regards,';
  
  return `[Your Name]
[Your Address]
[Your Email]
[Your Phone]

${formatDate(new Date())}

${fullTitle}
${candidate.email}

${greeting},

${subject}

${opening}

${body}

${closing}

${signOff}
[YOUR NAME]`;
};
