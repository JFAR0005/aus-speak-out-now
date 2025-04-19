
import { Candidate } from "../../types";
import { formatDate } from "./dateFormatter";
import { generateTitle } from "./titleGenerator";
import { cleanInputText, qualityCheck } from "./textCleaner";
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
  
  // Process the user's concern through our cleaning system
  // This will paraphrase rather than using verbatim text
  const concernContext = cleanInputText(concern);
  
  // Generate an appropriate subject line based on the context
  const subject = generateSubjectLine(concernContext);
  
  // More sophisticated opening by tone with natural language
  let opening = '';
  switch (tone) {
    case 'formal':
      opening = `I am writing regarding ${concernContext}. This matter warrants serious consideration from our elected representatives. ${documentInsights}`;
      break;
    case 'passionate':
      opening = `I am deeply concerned about ${concernContext} and believe that urgent action is required. ${documentInsights}`;
      break;
    case 'direct':
      opening = `I wish to understand your position on ${concernContext} as this will influence my voting decision. ${documentInsights}`;
      break;
    case 'hopeful':
      opening = `I believe that as our ${candidateRole}, you can make a meaningful difference regarding ${concernContext}. ${documentInsights}`;
      break;
  }
  
  // More varied and natural body text with context-specific statistics
  const relevantStatistic = getRandomStatistic(concernContext);
  const body = candidate.party
    ? `As a candidate ${partyInfo} for the ${candidateRole}, your position on this matter is particularly significant. ${relevantStatistic}\n\nThe consequences for our community are substantial, and decisive leadership could yield meaningful improvements in this area.`
    : `As a candidate for the ${candidateRole}, you have a unique opportunity to address this critical issue. ${relevantStatistic}\n\nVoters are seeking representatives who will take meaningful action on matters that affect their daily lives.`;
  
  // More specific and action-oriented closing statements
  let closing = '';
  switch (tone) {
    case 'formal':
      closing = `I would appreciate your response outlining your position and proposed approach to this issue. Would it be possible to discuss this matter in more detail?`;
      break;
    case 'passionate':
      closing = `Please share your detailed position and specific commitments on this issue. What concrete steps would you implement if elected?`;
      break;
    case 'direct':
      closing = `I specifically request: 1) Your position on this issue, 2) Your proposed policy actions, and 3) How you would measure success in addressing this concern.`;
      break;
    case 'hopeful':
      closing = `I would welcome an opportunity to discuss how we might work together on practical solutions to address this important issue for our community.`;
      break;
  }
  
  const signOff = tone === 'formal' ? 'Yours faithfully,' : 
                 tone === 'passionate' ? 'Kind regards,' :
                 tone === 'direct' ? 'Regards,' : 'Best regards,';
  
  // Construct the initial letter
  let letterText = `[Your Name]
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

  // Apply quality check to improve phrasing and grammar
  return qualityCheck(letterText);
};

