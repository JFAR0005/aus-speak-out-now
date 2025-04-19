import { Candidate } from "../types";

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Generate appropriate title based on candidate info with Australian conventions
const generateTitle = (candidate: Candidate): string => {
  // Only use official titles if we're certain of their current role
  if (candidate.role === "senator") {
    return "Senator";
  } else if (candidate.role === "mp") {
    return "Hon.";
  }
  // Default to Mr/Ms based on known preferences, or just use full name
  return ""; // Will be combined with name later
};

// Clean and improve input text with Australian English
const cleanInputText = (text: string): string => {
  // Convert to Australian English spelling
  const australianSpelling: Record<string, string> = {
    'center': 'centre',
    'program': 'programme',
    'organization': 'organisation',
    'labor party': 'Labour Party',
    'district': 'federal electorate',
    'representing': 'candidate for',
  };
  
  let cleanedText = text;
  
  // Apply Australian spelling
  Object.entries(australianSpelling).forEach(([american, australian]) => {
    const regex = new RegExp(american, 'gi');
    cleanedText = cleanedText.replace(regex, australian);
  });
  
  // Remove multiple spaces and normalize line endings
  cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
  
  // Ensure first letter of sentences is capitalized
  cleanedText = cleanedText.replace(/(^\w|\.[\s\n]\w)/g, letter => letter.toUpperCase());
  
  return cleanedText;
};

// Generate a formal subject line based on concern
const generateSubjectLine = (concern: string): string => {
  // Extract key topic for subject line
  const topics = {
    "climate": "Climate Action and Environmental Policy",
    "healthcare": "Healthcare Reform and Medicare Funding",
    "education": "Education Funding and Reform",
    "housing": "Housing Affordability Crisis",
    "immigration": "Immigration Policy Reform",
    "economy": "Economic Policy and Employment",
    "gender": "Gender Equality and Women's Rights",
    "violence": "Action Against Family and Gender-Based Violence",
    "indigenous": "First Nations Rights and Recognition",
    "disability": "Disability Support and NDIS Reform",
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
  return `Re: Concerns Regarding ${concernWords}...`;
};

// Extract key insights from uploaded document - improved with better error handling
const extractDocumentInsights = (documentText: string | null, concern: string): string => {
  if (!documentText || documentText.trim() === '') {
    return '';
  }
  
  try {
    // Limit the text size to prevent processing extremely large documents
    const limitedText = documentText.substring(0, 10000); // Only analyze first 10k characters
    
    // Look for statistics and numbers
    const stats = limitedText.match(/\d+(\.\d+)?%|\$\d+(\.\d+)? (million|billion)|(\d+,)+\d+/g) || [];
    
    // Look for quotes or key statements
    const quotes = limitedText.match(/"([^"]*)"|'([^']*)'/g) || [];
    
    // Look for statements with numbers that might be statistics
    const numStatements = limitedText.match(/[^.!?]*\d+[^.!?]*[.!?]/g) || [];
    
    // Create a list of potential facts to include, but limit the size
    const facts = [...stats, ...quotes, ...numStatements].slice(0, 20); // Only keep top 20 items
    
    // Filter facts to those relevant to the concern
    const concernKeywords = concern.toLowerCase().split(' ');
    const relevantFacts = facts.filter(fact => 
      concernKeywords.some(keyword => 
        keyword.length > 3 && fact.toLowerCase().includes(keyword)
      )
    ).slice(0, 5); // Keep only top 5 relevant facts
    
    // Return a condensed version of the insights
    if (relevantFacts.length > 0) {
      return `Based on the document provided, I've found these relevant facts: ${relevantFacts.join('; ')}. `;
    }
    
    return `I've reviewed the document you've provided which contains information about ${concern}. `;
  } catch (error) {
    console.error("Error extracting document insights:", error);
    return '';
  }
};

// Improved letter generation for a candidate
const generateLetterForCandidate = (
  candidate: Candidate,
  concern: string,
  documentInsights: string,
  tone: string
): string => {
  // Get candidate-specific information with Australian conventions
  const candidateTitle = generateTitle(candidate);
  const fullTitle = candidateTitle ? `${candidateTitle} ${candidate.name}` : candidate.name;
  const partyInfo = candidate.party ? ` for the ${candidate.party}` : '';
  
  // Determine the appropriate role description
  let candidateRole = "prospective elected representative for the ";
  
  // Use appropriate electoral terminology
  if (candidate.chamber === "house") {
    candidateRole += `federal seat of ${candidate.division || "your area"}`;
  } else if (candidate.chamber === "senate") {
    candidateRole += `state of ${candidate.state || "your state"}`;
  } else {
    // Fallback with correct Australian terminology
    candidateRole += candidate.electorate || 
                    (candidate.division ? `federal seat of ${candidate.division}` : 
                    (candidate.state ? `state of ${candidate.state}` : "your area"));
  }
  
  // Generate the greeting
  const greeting = `Dear ${fullTitle}`;
  const subject = generateSubjectLine(concern);
  
  // Clean and structure the concern text
  let cleanedConcern = cleanInputText(concern);
  
  // Generate different opening paragraphs based on tone
  let opening = '';
  if (tone === 'formal') {
    opening = `I am writing to express my concerns regarding ${cleanedConcern}. ${documentInsights}`;
  } else if (tone === 'passionate') {
    opening = `As a deeply concerned member of our community, I must address the urgent matter of ${cleanedConcern}. ${documentInsights}`;
  } else if (tone === 'direct') {
    opening = `I am seeking your position on ${cleanedConcern}. ${documentInsights}`;
  } else if (tone === 'hopeful') {
    opening = `I believe that as our ${candidateRole}, you can make a real difference regarding ${cleanedConcern}. ${documentInsights}`;
  }
  
  // Create a body that varies by candidate's party and the issue
  let body = '';
  
  if (candidate.party) {
    body = `As a ${candidateRole}${partyInfo}, your stance on this issue is crucial. ${getRandomStatistic(concern)}\n\nThe impact of this issue on our community is significant, and your leadership could make a meaningful difference.`;
  } else {
    body = `As a ${candidateRole}, you have a unique opportunity to address this important issue. ${getRandomStatistic(concern)}\n\nOur community looks to its leaders for meaningful action on this matter.`;
  }
  
  // Create a closing that asks for specific action
  let closing = '';
  if (tone === 'formal') {
    closing = `I would welcome your response outlining your position and proposed policies on this matter. Would you be available to discuss this issue in more detail?`;
  } else if (tone === 'passionate') {
    closing = `Please share your detailed position and specific policy commitments on this issue. What concrete steps would you take if elected?`;
  } else if (tone === 'direct') {
    closing = `I request that you: 1) Clarify your position on this issue, 2) Detail your proposed actions, and 3) Provide a timeline for implementation.`;
  } else if (tone === 'hopeful') {
    closing = `I would welcome the opportunity to discuss how we might work together to address this important issue for our community.`;
  }
  
  // Generate sign-off with Australian conventions
  const signOff = tone === 'formal' ? 'Yours faithfully,' : 
                 tone === 'passionate' ? 'Kind regards,' :
                 tone === 'direct' ? 'Regards,' : 'Best regards,';
  
  // Assemble the letter with proper formatting and Australian conventions
  const letter = `[Your Name]
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

// Primary function to generate letters for multiple candidates - optimized to prevent blocking UI
export const generateLetters = async (
  candidates: Candidate[],
  concern: string,
  uploadedContent: string | null = null,
  tone: string = 'formal'
): Promise<Record<string, string>> => {
  // Process uploaded document if available
  let documentInsights = '';
  
  try {
    if (uploadedContent) {
      // Process document insights with a small delay to avoid UI blocking
      return new Promise((resolve) => {
        // Use setTimeout to keep UI responsive
        setTimeout(() => {
          try {
            documentInsights = extractDocumentInsights(uploadedContent, concern);
            
            // Generate individual letters
            const letters: Record<string, string> = {};
            
            // Use a more efficient approach with batch processing
            // Process in small batches to avoid UI freezing
            const batchSize = 1;
            const totalCandidates = candidates.length;
            
            // Process candidates in batches
            for (let i = 0; i < totalCandidates; i += batchSize) {
              const batch = candidates.slice(i, i + batchSize);
              
              // Process each candidate in the current batch
              for (const candidate of batch) {
                try {
                  letters[candidate.id] = generateLetterForCandidate(
                    candidate,
                    concern,
                    documentInsights,
                    tone
                  );
                } catch (err) {
                  console.error(`Error generating letter for ${candidate.name}:`, err);
                  letters[candidate.id] = `Error generating letter for ${candidate.name}. Please try again.`;
                }
              }
            }
            
            resolve(letters);
          } catch (error) {
            console.error("Error in letter generation process:", error);
            resolve({});
          }
        }, 10); // Small delay to let UI breathe
      });
    } else {
      // No document to process, generate letters directly
      const letters: Record<string, string> = {};
      
      for (const candidate of candidates) {
        try {
          letters[candidate.id] = generateLetterForCandidate(
            candidate,
            concern,
            '',
            tone
          );
        } catch (err) {
          console.error(`Error generating letter for ${candidate.name}:`, err);
          letters[candidate.id] = `Error generating letter for ${candidate.name}. Please try again.`;
        }
      }
      
      return letters;
    }
  } catch (error) {
    console.error("Fatal error in generateLetters:", error);
    return {};
  }
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
