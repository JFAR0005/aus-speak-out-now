
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
    "violence": "Action Against Violence and Safety Measures",
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
  const concernWords = concern.split(' ').slice(0, 5).join(' ');
  return `Re: Concerns regarding ${concernWords}...`;
};

// Extract key insights from uploaded document
const extractDocumentInsights = (documentText: string, concern: string): string => {
  if (!documentText || documentText.trim() === '') {
    return '';
  }
  
  // Look for statistics and numbers
  const stats = documentText.match(/\d+(\.\d+)?%|\$\d+(\.\d+)? (million|billion)|(\d+,)+\d+/g) || [];
  
  // Look for quotes or key statements
  const quotes = documentText.match(/"([^"]*)"|'([^']*)'/g) || [];
  
  // Look for statements with numbers that might be statistics
  const numStatements = documentText.match(/[^.!?]*\d+[^.!?]*[.!?]/g) || [];
  
  // Create a list of potential facts to include
  const facts = [...stats, ...quotes, ...numStatements];
  
  // Filter facts to those relevant to the concern
  const concernKeywords = concern.toLowerCase().split(' ');
  const relevantFacts = facts.filter(fact => 
    concernKeywords.some(keyword => 
      keyword.length > 3 && fact.toLowerCase().includes(keyword)
    )
  );
  
  // Return a condensed version of the insights
  if (relevantFacts.length > 0) {
    return `Based on the document provided, I've found these relevant facts: ${relevantFacts.slice(0, 5).join('; ')}. `;
  }
  
  return `I've reviewed the document you've provided which contains information about ${concern}. `;
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
  let documentInsights = '';
  if (uploadedContent) {
    documentInsights = extractDocumentInsights(uploadedContent, concern);
  }
  
  // Generate individual letters for each candidate
  const letters: Record<string, string> = {};
  
  // Use GPT-like prompt structure for generating each letter
  const generateLetterWithPrompt = (candidate: Candidate) => {
    // Get candidate-specific information
    const partyInfo = candidate.party ? ` of the ${candidate.party}` : '';
    const candidateTitle = candidate.chamber === 'senate' ? 'Senator' : 'MP';
    
    // Create a prompt-like structure that would guide an AI to write a unique letter
    const prompt = `
I need to write a formal political letter to ${candidate.name}${partyInfo}, addressing their title and position.

The main concern is: "${concern}"

${documentInsights ? `Additional context from provided documents: ${documentInsights}` : ''}

This letter should:
- Use a ${tone} tone
- Introduce the concern clearly 
- Reference relevant facts or statistics
- End with a request for action or response
- Be uniquely written for this specific recipient
`;
    
    // Now "execute" this prompt to create a unique letter
    // In a real implementation with OpenAI, this would be the API call
    // For now, we'll simulate the response with our own letter generation
    
    // Generate the letter parts based on the prompt
    const greeting = `Dear ${candidateTitle} ${candidate.name}`;
    const subject = generateSubjectLine(concern);
    
    // Generate different opening paragraphs based on tone and concern
    let opening = '';
    if (tone === 'formal') {
      opening = `I am writing to express my concerns regarding ${concern}. ${documentInsights}`;
    } else if (tone === 'passionate') {
      opening = `I feel compelled to write to you about ${concern}, an issue that deeply affects our community. ${documentInsights}`;
    } else if (tone === 'direct') {
      opening = `${concern} requires immediate attention and action from our elected representatives like yourself. ${documentInsights}`;
    } else if (tone === 'hopeful') {
      opening = `I believe that together, we can make meaningful progress on ${concern}. ${documentInsights}`;
    }
    
    // Create a body that varies by candidate's party and the issue
    let body = '';
    
    // Vary the body based on candidate party
    if (candidate.party?.includes('Labor')) {
      body = `As a member of the Labor Party with its historic commitment to social justice, I believe you are well-positioned to address these concerns. ${getRandomStatistic(concern)}\n\nThe impact of this issue on our community cannot be overstated. Many families in your electorate are directly affected, and they are looking to you for leadership.`;
    } else if (candidate.party?.includes('Liberal')) {
      body = `As a member of the Liberal Party with its commitment to individual freedom and responsibility, I believe you can take a strong stance on this issue. ${getRandomStatistic(concern)}\n\nYour constituents are concerned about the economic and social impacts this issue is having on our community, and we need sensible policy solutions.`;
    } else if (candidate.party?.includes('Greens')) {
      body = `As a representative of the Greens with your strong stance on social and environmental justice, I believe you can champion this cause. ${getRandomStatistic(concern)}\n\nThis issue aligns with your party's values of sustainability and equality, and your voice on this matter would be significant.`;
    } else {
      body = `As our elected representative, you have a unique opportunity to address this important issue. ${getRandomStatistic(concern)}\n\nMany in our community are directly impacted by this issue, and we are looking to you for leadership and action.`;
    }
    
    // Create a closing that asks for specific action
    let closing = '';
    if (tone === 'formal') {
      closing = `I respectfully request that you consider these concerns and provide your position on this issue. Would it be possible to arrange a meeting to discuss this matter further?`;
    } else if (tone === 'passionate') {
      closing = `This issue deeply matters to your constituents. Please let me know how you plan to champion this cause and what meaningful actions you will take in Parliament.`;
    } else if (tone === 'direct') {
      closing = `I specifically request that you: 1) Clarify your position on this issue, 2) Detail what actions you will take, and 3) Commit to a timeline for these actions.`;
    } else if (tone === 'hopeful') {
      closing = `I believe your support on this issue could make a meaningful difference. Would you be willing to meet with me to discuss how we might work together toward positive solutions?`;
    }
    
    // Generate sign-off
    const signOff = tone === 'formal' ? 'Yours sincerely,' : 
                   tone === 'passionate' ? 'With sincere appreciation,' :
                   tone === 'direct' ? 'Regards,' : 'Yours faithfully,';
    
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

    return letter;
  };
  
  // Helper function to simulate varied statistics based on concern
  function getRandomStatistic(concern: string): string {
    // Collection of statistics by topic
    const statistics = {
      "violence": [
        "According to recent data, 1 in 6 women have experienced physical or sexual violence by a current or former partner.",
        "Disturbingly, 20 women have been killed due to domestic violence in 2024 alone.",
        "Research shows that 16.9% of women have experienced violence from an intimate partner.",
        "Family and domestic violence causes more illness, disability and deaths than any other risk factor for women aged 25-44."
      ],
      "climate": [
        "Australia's temperatures have increased by an average of 1.44°C since 1910.",
        "Over 3 billion animals were killed or displaced in the 2019-2020 bushfires.",
        "Rising sea levels are projected to affect over 85% of Australians who live in coastal regions.",
        "Renewable energy now accounts for 32.5% of Australia's total electricity generation."
      ],
      "healthcare": [
        "Hospital emergency department waiting times have increased by 12% in the past five years.",
        "Mental health conditions affect nearly 4.2 million Australians each year.",
        "46% of Australians have one or more chronic conditions requiring ongoing care.",
        "Rural Australians are 1.5 times more likely to face barriers accessing healthcare services."
      ],
      "housing": [
        "House prices have increased by 25% in major Australian cities in the last two years.",
        "Over 116,000 Australians experience homelessness on any given night.",
        "The median house price is now 8.5 times the median annual household income.",
        "Rental vacancy rates in major cities have dropped below 1% in many areas."
      ],
      "education": [
        "Australian students' PISA rankings have declined in reading, mathematics and science over the past decade.",
        "Teacher shortages affect nearly 60% of Australian schools.",
        "University graduates now leave with an average HECS debt of $23,685.",
        "Only 84% of Australian schools have reliable internet access for digital learning."
      ]
    };
    
    // Find relevant statistics or use generic ones
    for (const [topic, stats] of Object.entries(statistics)) {
      if (concern.toLowerCase().includes(topic)) {
        return stats[Math.floor(Math.random() * stats.length)];
      }
    }
    
    // Default statistic if no relevant ones found
    return "Recent studies show this issue affects a significant portion of our community.";
  }
  
  // Generate a letter for each candidate
  candidates.forEach(candidate => {
    letters[candidate.id] = generateLetterWithPrompt(candidate);
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
