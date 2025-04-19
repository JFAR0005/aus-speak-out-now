
import { Candidate } from "../types";

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const generateLetter = async (
  candidates: Candidate[],
  concern: string
): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Process each candidate to generate individual letters
  return candidates.map(candidate => {
    const letter = `[Your Name]
[Your Contact Details]

${candidate.name}
${candidate.email}

${formatDate(new Date())}

Dear ${candidate.name},

Re: ${concern}

I am writing to express my concerns regarding ${concern} and to seek your support on this critical issue that affects our community.

${generateSpecificContent(concern, candidate)}

As my representative in Parliament, your voice carries significant weight in shaping policies that affect our community. I believe your support on this matter could make a real difference in addressing these concerns and creating positive change.

I would greatly appreciate the opportunity to discuss this matter further, either through a meeting or correspondence, to better understand your position on this issue and how we might work together to address these concerns.

Yours sincerely,
[YOUR NAME]`;

    return letter;
  }).join('\n\n---\n\n'); // Separate multiple letters with a divider
};

const generateSpecificContent = (concern: string, candidate: Candidate): string => {
  // Find relevant policy stance from candidate
  const relevantPolicy = candidate.policies.find(policy => 
    concern.toLowerCase().includes(policy.topic.toLowerCase())
  );

  const concerns: Record<string, (candidate: Candidate) => string> = {
    "climate change": (c) => `Climate change poses significant challenges to our nation's future. Australia needs strong leadership and concrete action to address this global crisis. Given your ${getStanceDescription(c, "climate")}, I urge you to support stronger climate action policies.

I am particularly concerned about:
• Rising temperatures and extreme weather events
• The impact on our agricultural sector
• The need for renewable energy transition
• Protection of our natural ecosystems`,
    
    "healthcare": (c) => `Access to quality healthcare is a fundamental right for all Australians. ${getStanceDescription(c, "healthcare")} I believe we must strengthen our healthcare system to ensure it remains accessible and effective for everyone.

Key areas requiring attention include:
• Hospital waiting times
• Medicare funding
• Mental health services
• Rural healthcare access`,

    "education": (c) => `Education is crucial for Australia's future prosperity. ${getStanceDescription(c, "education")} We need to ensure our education system provides quality learning opportunities for all students.

Specific areas of concern include:
• School funding
• Teacher support and resources
• Higher education accessibility
• Vocational training opportunities`,
  };

  // Search for matching concerns or use the relevant policy
  for (const [key, contentGenerator] of Object.entries(concerns)) {
    if (concern.toLowerCase().includes(key)) {
      return contentGenerator(candidate);
    }
  }

  // If we have a relevant policy but no template, use policy-based response
  if (relevantPolicy) {
    return `I understand that you have previously ${relevantPolicy.stance} regarding ${relevantPolicy.topic}. ${relevantPolicy.description}

This issue significantly impacts our community, and I believe we need thoughtful policy solutions that consider both immediate needs and long-term consequences. Your leadership on this matter could make a substantial difference in addressing these concerns.`;
  }

  // Default response if no specific concern matches
  return `This issue is of great importance to me and many other Australians in your electorate. We need strong leadership and concrete action to address these concerns effectively.

I believe we need thoughtful policy solutions that:
• Address immediate community needs
• Consider long-term impacts
• Ensure fair and equitable outcomes
• Strengthen our democratic institutions`;
};

const getStanceDescription = (candidate: Candidate, topic: string): string => {
  const policy = candidate.policies.find(p => 
    p.topic.toLowerCase().includes(topic.toLowerCase())
  );
  
  return policy 
    ? `I note your stance to ${policy.stance} on this issue.` 
    : "I would be interested in understanding your position on this issue.";
};
