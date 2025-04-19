
import { Candidate } from "../types";

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Generate a dynamic greeting based on candidate information
const generateGreeting = (candidate: Candidate): string => {
  const title = candidate.party === "Australian Greens" ? "Senator" : "Hon.";
  return `Dear ${title} ${candidate.name}`;
};

// Generate a subject line based on concern
const generateSubjectLine = (concern: string): string => {
  // Extract key topic for subject line
  const topics = {
    "climate": "Climate Action and Environmental Protection",
    "healthcare": "Healthcare Reform and Accessibility",
    "education": "Education Funding and Reform",
    "housing": "Housing Affordability Crisis",
    "immigration": "Immigration Policy Reform",
    "economy": "Economic Policy and Job Creation",
    "gender": "Gender Equality and Women's Rights",
    "violence": "Action Against Violence",
    "indigenous": "Indigenous Rights and Recognition",
    "disability": "Disability Support and Inclusion",
  };
  
  // Find matching topic or use generic subject
  const matchedTopic = Object.entries(topics).find(([key]) => 
    concern.toLowerCase().includes(key)
  );
  
  if (matchedTopic) {
    return `Re: ${matchedTopic[1]}`;
  }
  
  // If no specific match, create a generic subject from the concern
  const concernWords = concern.split(' ').slice(0, 3).join(' ');
  return `Re: Concerns regarding ${concernWords}...`;
};

// Generate different opening paragraphs based on tone and concern
const generateOpeningParagraph = (concern: string, tone: string, candidate: Candidate): string => {
  const openings = {
    formal: [
      `I am writing to express my concerns regarding ${concern}.`,
      `I wish to bring to your attention an important matter concerning ${concern}.`,
      `As a constituent in your electorate, I am reaching out regarding ${concern}.`
    ],
    passionate: [
      `I feel compelled to write to you about ${concern}, an issue that deeply affects our community.`,
      `As someone who cares deeply about ${concern}, I urgently seek your support on this critical matter.`,
      `The issue of ${concern} is one that I feel passionately about, and I'm writing to seek your action.`
    ],
    direct: [
      `${concern} requires immediate attention and action from our elected representatives like yourself.`,
      `I'm writing directly about ${concern} - this issue needs your attention now.`,
      `The situation regarding ${concern} has become untenable and requires your immediate intervention.`
    ],
    hopeful: [
      `I believe that together, we can make meaningful progress on ${concern}.`,
      `I'm writing with hope that you will champion action on ${concern} in Parliament.`,
      `With your support, I believe positive change is possible regarding ${concern}.`
    ]
  };
  
  // Select a random opening based on tone, or default to formal
  const toneKey = tone && openings[tone.toLowerCase()] 
    ? tone.toLowerCase() 
    : 'formal';
  
  const options = openings[toneKey];
  const selectedOpening = options[Math.floor(Math.random() * options.length)];
  
  // Add a personalized element based on candidate information
  let personalization = '';
  if (candidate.policies && candidate.policies.length > 0) {
    const relevantPolicy = candidate.policies.find(policy => 
      concern.toLowerCase().includes(policy.topic.toLowerCase())
    );
    
    if (relevantPolicy) {
      personalization = ` I'm aware of your position to ${relevantPolicy.stance} on related matters, and I hope you will consider the concerns I outline below.`;
    }
  }
  
  return selectedOpening + personalization;
};

// Generate body content based on concern and document facts
const generateBodyContent = (
  concern: string, 
  candidate: Candidate, 
  uploadedContent: string | null,
  tone: string = 'formal'
): string => {
  // Extract relevant policy stance from candidate
  const relevantPolicy = candidate.policies.find(policy => 
    concern.toLowerCase().includes(policy.topic.toLowerCase())
  );
  
  // Base content on concern topic
  let bodyContent = '';
  
  // Add uploaded document insights if available
  if (uploadedContent) {
    bodyContent += `Based on information I've reviewed, ${uploadedContent}\n\n`;
  }
  
  // Add concern-specific content
  const concerns: Record<string, (candidate: Candidate, tone: string) => string> = {
    "climate change": (c, t) => {
      if (t === 'passionate') {
        return `The climate crisis demands bold, immediate action. Rising temperatures, extreme weather events, and ecosystem collapse threaten not just our environment but our very way of life. As Australians, we're already witnessing devastating bushfires and floods intensifying year after year.\n\nI urge you to support stronger climate policies that rapidly transition our economy to renewable energy, protect biodiversity, and ensure climate justice for vulnerable communities.`;
      } else if (t === 'direct') {
        return `Climate change requires your immediate action. The science is clear: we need to cut emissions drastically and transition to renewable energy this decade, not in some distant future. Australia must stop approving new fossil fuel projects and implement a just transition for affected workers and communities.`;
      } else if (t === 'hopeful') {
        return `I believe Australia has the potential to become a renewable energy superpower. With our abundant sun, wind, and critical minerals, we can create sustainable jobs while protecting our precious natural heritage. I'm hopeful that with leadership from representatives like yourself, we can implement climate solutions that benefit all Australians.`;
      } else {
        return `Climate change poses significant challenges to our nation's future. Australia needs strong leadership and concrete action to address this global crisis. Given your ${getStanceDescription(c, "climate")}, I urge you to support stronger climate action policies.\n\nI am particularly concerned about:\n• Rising temperatures and extreme weather events\n• The impact on our agricultural sector\n• The need for renewable energy transition\n• Protection of our natural ecosystems`;
      }
    },
    
    "healthcare": (c, t) => {
      if (t === 'passionate') {
        return `Healthcare is not just a policy issue—it's about human dignity and wellbeing. Every Australian deserves access to quality, affordable healthcare regardless of their income or where they live. The growing inequality in our healthcare system breaks my heart and demands urgent attention.`;
      } else if (t === 'direct') {
        return `Our healthcare system is under immense pressure. Hospital waiting times are increasing, mental health services are insufficient, and rural communities lack basic medical access. These problems need immediate solutions, not just election promises.`;
      } else if (t === 'hopeful') {
        return `I believe Australia can have one of the best healthcare systems in the world. By properly funding Medicare, supporting our healthcare workers, and embracing innovations in telehealth and preventative care, we can ensure all Australians receive the quality care they deserve.`;
      } else {
        return `Access to quality healthcare is a fundamental right for all Australians. ${getStanceDescription(c, "healthcare")} I believe we must strengthen our healthcare system to ensure it remains accessible and effective for everyone.\n\nKey areas requiring attention include:\n• Hospital waiting times\n• Medicare funding\n• Mental health services\n• Rural healthcare access`;
      }
    },
    
    "education": (c, t) => {
      if (t === 'passionate') {
        return `Education is the cornerstone of a fair and prosperous society. Every child deserves the opportunity to reach their full potential regardless of their background or circumstances. I'm deeply concerned about growing inequality in our education system and the impact this has on our children's futures.`;
      } else if (t === 'direct') {
        return `Our education system needs immediate reform. Schools in disadvantaged areas are under-resourced, teachers are overworked and underpaid, and university students are graduating with crippling debt. These issues demand your immediate attention and action.`;
      } else if (t === 'hopeful') {
        return `I believe that with proper investment and reform, Australia's education system can be truly world-class. By valuing our teachers, ensuring fair funding across all schools, and making higher education accessible, we can create opportunities for all young Australians to thrive.`;
      } else {
        return `Education is crucial for Australia's future prosperity. ${getStanceDescription(c, "education")} We need to ensure our education system provides quality learning opportunities for all students.\n\nSpecific areas of concern include:\n• School funding\n• Teacher support and resources\n• Higher education accessibility\n• Vocational training opportunities`;
      }
    },
    
    "housing": (c, t) => {
      if (t === 'passionate') {
        return `The housing crisis is causing immense suffering across Australia. Young people have lost hope of ever owning a home, renters face insecurity and rising costs, and homelessness is increasing. This is not just an economic issue but a moral one that strikes at the heart of what kind of society we want to be.`;
      } else if (t === 'direct') {
        return `The housing affordability crisis requires immediate action. Tax policies that favor investors, insufficient social housing, and inadequate renters' rights have created an unsustainable situation that is harming Australians. These problems need concrete solutions now.`;
      } else if (t === 'hopeful') {
        return `I believe that with the right policies, we can create a housing system that works for everyone. By balancing the needs of first home buyers, implementing compassionate solutions for homelessness, and ensuring rental affordability, we can build communities where all Australians have a secure place to call home.`;
      } else {
        return `Housing affordability has reached crisis levels in Australia. Many Australians are struggling to find adequate and affordable housing, which impacts their wellbeing and financial security.\n\nKey housing issues that need addressing include:\n• Affordable housing supply\n• First home buyer support\n• Rental affordability and security\n• Social and community housing`;
      }
    },
    
    "gender": (c, t) => {
      if (t === 'passionate') {
        return `Gender equality is not just a women's issue—it's a fundamental human rights issue that affects us all. The persistent gender pay gap, underrepresentation in leadership positions, and ongoing discrimination and harassment in workplaces cannot be tolerated in a society that values fairness and justice.`;
      } else if (t === 'direct') {
        return `Gender inequality persists in Australia and requires decisive action. Women continue to face workplace discrimination, shoulder disproportionate caring responsibilities, and experience alarming rates of violence. These issues need concrete policy solutions, not just symbolic gestures.`;
      } else if (t === 'hopeful') {
        return `I believe Australia can be a global leader in gender equality. By implementing policies that promote women's economic security, ensuring equal representation in leadership, and creating genuinely safe workplaces, we can build a fairer society where everyone can thrive regardless of gender.`;
      } else {
        return `Gender equality remains an important issue in Australia despite progress made over recent decades. There are several areas where policy interventions could make a significant difference.\n\nKey concerns include:\n• The gender pay gap\n• Women's safety and violence prevention\n• Workplace discrimination\n• Leadership representation`;
      }
    },
    
    "violence": (c, t) => {
      if (t === 'passionate') {
        return `The epidemic of violence in our communities is heartbreaking. Every incident represents a failure of our society to protect vulnerable people, particularly women and children. The trauma inflicted has generational impacts that demand our collective action and commitment.`;
      } else if (t === 'direct') {
        return `Violence prevention requires immediate action and proper funding. Current approaches are failing to stem the crisis, particularly regarding domestic violence. We need comprehensive education programs, properly funded support services, and justice system reforms without delay.`;
      } else if (t === 'hopeful') {
        return `I believe we can create communities free from violence through education, support, and cultural change. By implementing evidence-based prevention programs, ensuring survivors have the support they need, and holding perpetrators accountable, we can build a safer Australia for everyone.`;
      } else {
        return `Violence prevention is a critical issue that requires sustained attention and investment. We need comprehensive approaches that address root causes while supporting those affected.\n\nKey areas for action include:\n• Domestic and family violence prevention\n• Support services for survivors\n• Early intervention programs\n• Justice system reforms`;
      }
    }
  };
  
  // Find matching concern or use default content
  for (const [key, contentGenerator] of Object.entries(concerns)) {
    if (concern.toLowerCase().includes(key)) {
      bodyContent += contentGenerator(candidate, tone || 'formal');
      return bodyContent;
    }
  }
  
  // If we have a relevant policy but no template, use policy-based response
  if (relevantPolicy) {
    return `${bodyContent}I understand that you have previously ${relevantPolicy.stance} regarding ${relevantPolicy.topic}. ${relevantPolicy.description}\n\nThis issue significantly impacts our community, and I believe we need thoughtful policy solutions that consider both immediate needs and long-term consequences. Your leadership on this matter could make a substantial difference in addressing these concerns.`;
  }

  // Default response if no specific concern matches
  return `${bodyContent}This issue is of great importance to me and many other Australians in your electorate. We need strong leadership and concrete action to address these concerns effectively.\n\nI believe we need thoughtful policy solutions that:\n• Address immediate community needs\n• Consider long-term impacts\n• Ensure fair and equitable outcomes\n• Strengthen our democratic institutions`;
};

// Generate closing paragraph with specific ask
const generateClosingParagraph = (concern: string, tone: string): string => {
  const closings = {
    formal: [
      `I would appreciate your response outlining your position on this issue and what actions you intend to take. Would it be possible to arrange a meeting to discuss this matter further?`,
      `As my elected representative, I respectfully request that you consider these concerns and provide your position on this important issue.`,
      `I look forward to hearing your thoughts on this matter and what steps you might take to address these concerns.`
    ],
    passionate: [
      `This issue deeply matters to your constituents. Please let me know how you plan to champion this cause and what meaningful actions you will take in Parliament.`,
      `I care deeply about this issue and would value the opportunity to discuss it with you or your staff. Could we arrange a meeting in the coming weeks?`,
      `Your leadership on this issue could make a real difference. Will you commit to taking concrete action to address these urgent concerns?`
    ],
    direct: [
      `I specifically request that you: 1) Clarify your position on this issue, 2) Detail what actions you will take, and 3) Commit to a timeline for these actions.`,
      `Please provide a direct response to the concerns raised in this letter, including specific actions you intend to take and when.`,
      `As a taxpayer and voter in your electorate, I expect a clear response outlining your position and planned actions on this issue.`
    ],
    hopeful: [
      `I believe your support on this issue could make a meaningful difference. Would you be willing to meet with me to discuss how we might work together toward positive solutions?`,
      `I remain hopeful that with your leadership, we can make progress on this important issue. Please let me know how you plan to address these concerns.`,
      `Together, I believe we can create positive change on this issue. I would welcome the opportunity to discuss constructive approaches with you or your staff.`
    ]
  };
  
  // Select a random closing based on tone, or default to formal
  const toneKey = tone && closings[tone.toLowerCase()] 
    ? tone.toLowerCase() 
    : 'formal';
  
  const options = closings[toneKey];
  return options[Math.floor(Math.random() * options.length)];
};

// Generate a sign-off based on tone
const generateSignOff = (tone: string): string => {
  if (tone === 'formal') {
    return 'Yours sincerely,';
  } else if (tone === 'passionate' || tone === 'hopeful') {
    return 'With sincere appreciation,';
  } else if (tone === 'direct') {
    return 'Regards,';
  } else {
    return 'Yours faithfully,';
  }
};

// Helper function to get stance description
const getStanceDescription = (candidate: Candidate, topic: string): string => {
  const policy = candidate.policies.find(p => 
    p.topic.toLowerCase().includes(topic.toLowerCase())
  );
  
  return policy 
    ? `stance to ${policy.stance} on this issue` 
    : "position on this issue";
};

// Extract key insights from uploaded document
const extractDocumentInsights = (documentText: string): string => {
  // In a real implementation, this would use NLP to extract insights
  // For this demo, we'll simulate with some basic pattern matching

  // Extract statistics (simple number pattern matching)
  const stats = documentText.match(/\d+(\.\d+)?%|\$\d+(\.\d+)? (million|billion)|(\d+,)+\d+/g) || [];
  
  // Extract quotes (text between quotation marks)
  const quotes = documentText.match(/"([^"]*)"|'([^']*)'/g) || [];
  
  // Generate insights text
  let insights = '';
  if (stats.length > 0) {
    insights += `key statistics indicate ${stats.slice(0, 3).join(', ')}. `;
  }
  if (quotes.length > 0) {
    insights += `Important points include ${quotes.slice(0, 2).join(', ')}. `;
  }
  
  return insights || 'the document provides valuable context for this discussion. ';
};

// Primary function to generate letters for multiple candidates
export const generateLetters = async (
  candidates: Candidate[],
  concern: string,
  uploadedContent: string | null = null,
  tone: string = 'formal'
): Promise<Record<string, string>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Process uploaded document if available
  let documentInsights = null;
  if (uploadedContent) {
    documentInsights = extractDocumentInsights(uploadedContent);
  }
  
  // Generate individual letters for each candidate
  const letters: Record<string, string> = {};
  
  candidates.forEach(candidate => {
    // Create unique variations for each candidate
    const greeting = generateGreeting(candidate);
    const subject = generateSubjectLine(concern);
    const opening = generateOpeningParagraph(concern, tone, candidate);
    const body = generateBodyContent(concern, candidate, documentInsights, tone);
    const closing = generateClosingParagraph(concern, tone);
    const signOff = generateSignOff(tone);
    
    // Assemble the letter with proper formatting
    const letter = `[Your Name]
[Your Address]
[Your Email]
[Your Phone]

${candidate.name}
${candidate.email}

${formatDate(new Date())}

${greeting},

${subject}

${opening}

${body}

${closing}

${signOff}
[YOUR NAME]`;

    // Store the letter with the candidate's ID as key
    letters[candidate.id] = letter;
  });
  
  return letters;
};

// For backward compatibility
export const generateLetter = async (
  candidates: Candidate[],
  concern: string,
  uploadedContent: string | null = null,
  tone: string = 'formal'
): Promise<string> => {
  const letters = await generateLetters(candidates, concern, uploadedContent, tone);
  // Join all letters with a separator for backward compatibility
  return Object.values(letters).join('\n\n---\n\n');
};
