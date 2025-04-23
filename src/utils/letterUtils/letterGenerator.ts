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
  
  const concernContext = cleanInputText(concern);
  
  const subject = generateSubjectLine(concernContext);
  
  let opening = '';
  switch (tone) {
    case 'formal':
      opening = `I am writing to address an important matter concerning ${concernContext}.\n\n${documentInsights}I believe this issue requires careful consideration and meaningful action.`;
      break;
    case 'passionate':
      opening = `I am deeply concerned about ${concernContext} and feel compelled to bring this critical issue to your attention.\n\n${documentInsights}The potential impact on our community cannot be overstated.`;
      break;
    case 'direct':
      opening = `I am writing to discuss ${concernContext} and understand your proposed approach to addressing this matter.\n\n${documentInsights}Your position on this issue will significantly influence my perspective.`;
      break;
    case 'hopeful':
      opening = `As a constituent, I am reaching out to discuss ${concernContext} and the potential for positive change.\n\n${documentInsights}I believe that meaningful dialogue can lead to effective solutions.`;
      break;
  }
  
  const relevantStatistic = getRandomStatistic(concernContext);
  const body = `As a candidate${partyInfo} for the ${candidateRole}, you play a crucial role in addressing community concerns.\n\n${relevantStatistic}\n\nThe implications of this issue extend beyond simple policy – they directly impact the lives of constituents like myself.\n\nI am seeking a representative who will not just listen, but take concrete, meaningful action to address these challenges.`;
  
  let closing = '';
  switch (tone) {
    case 'formal':
      closing = `I would appreciate the opportunity to discuss this matter further and understand your perspective.\n\nPlease provide insight into how you intend to approach and resolve these critical concerns.`;
      break;
    case 'passionate':
      closing = `I am eager to hear your specific commitments and actionable plans for addressing this issue.\n\nWhat concrete steps will you take to make a meaningful difference?`;
      break;
    case 'direct':
      closing = `I request a clear, detailed response that outlines:\n\n1. Your specific position on this issue\n2. Proposed policy actions\n3. Measurable outcomes you aim to achieve\n\nYour transparency will be crucial in earning my support.`;
      break;
    case 'hopeful':
      closing = `I look forward to the possibility of constructive dialogue and collaborative problem-solving.\n\nTogether, we can work towards meaningful progress for our community.`;
      break;
  }
  
  const signOff = tone === 'formal' ? 'Yours faithfully,' : 
                 tone === 'passionate' ? 'Kind regards,' :
                 tone === 'direct' ? 'Regards,' : 'Best regards,';
  
  let letterText = `[Your Name]
[Your Address]
[Your Email]
[Your Phone]

${formatDate(new Date())}

${fullTitle}
${candidate.email}

${greeting}

${subject}

${opening}

${body}

${closing}

${signOff}
[YOUR NAME]`;

  return qualityCheck(letterText);
};
