
// This file generates appropriate subject lines for constituent letters based on the concern topic

/**
 * Generates a contextual subject line for a letter based on the user's concern
 * @param concern The user's concern or issue
 * @returns Formatted subject line
 */
export const generateSubjectLine = (concern: string): string => {
  // Extended topics dictionary with Australian federal election context
  const topics = {
    "climate": "Urgent Action Required on Climate Change and Environmental Policy",
    "renewable": "Supporting Renewable Energy Transition and Jobs",
    "healthcare": "Healthcare Reform and Medicare Funding Priorities",
    "education": "Education Funding and Reform Initiatives",
    "housing": "Addressing the Housing Affordability Crisis",
    "immigration": "Immigration Policy Reform and Community Integration",
    "economy": "Economic Policy, Employment, and Cost of Living",
    "gender": "Gender Equality and Women's Rights in Australia",
    "violence": "Addressing Family and Gender-Based Violence",
    "indigenous": "First Nations Rights, Recognition, and Voice to Parliament",
    "aboriginal": "Aboriginal and Torres Strait Islander Priorities",
    "disability": "Disability Support, NDIS Reform, and Inclusive Communities",
    "welfare": "Social Welfare, Income Support, and Inequality",
    "transport": "Public Transport Infrastructure and Sustainability",
    "energy": "Energy Policy, Renewables, and Future Planning",
    "mental": "Mental Health Support and Healthcare Integration",
    "agriculture": "Agricultural Policy and Regional Development",
    "water": "Water Management and Murray-Darling Basin Protection",
    "employment": "Job Creation and Employment Security Measures",
    "taxation": "Tax Reform and Economic Fairness",
    "infrastructure": "Infrastructure Development and Community Planning",
    "technology": "Digital Innovation and Technology Policy",
    "defence": "National Defence Strategy and Security",
    "foreign": "Foreign Affairs and International Relations",
    "aged": "Aged Care Reform and Elder Support",
    "childcare": "Childcare Accessibility and Affordability",
    "election": "Electoral Reform and Democratic Processes",
    "corruption": "Government Accountability and Anti-Corruption Measures",
    "environment": "Environmental Conservation and Biodiversity Protection",
    "wage": "Wage Growth and Fair Work Conditions",
    "rental": "Affordable Housing and Rental Market Reform",
    "media": "Media Diversity and Public Broadcasting",
    "gambling": "Gambling Reform and Harm Reduction Measures",
    "lgbtq": "LGBTQIA+ Rights and Protections",
    "refugee": "Refugee Policy and Humanitarian Programs",
    "security": "National Security and Cybersecurity Concerns",
    "small business": "Small Business Support and Regulatory Reform",
    "youth": "Youth Services and Future Generations",
    "animal": "Animal Welfare and Protection Standards",
    "police": "Justice System Reform and Community Safety",
    "data": "Digital Rights and Data Privacy Protections",
  };
  
  // Function to extract meaningful keywords from concern text
  const extractKeywords = (text: string): string[] => {
    // Remove common filler words
    const fillerWords = ['i', 'am', 'is', 'are', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'about', 'of', 'by', 'as', 'what', 'when', 'where', 'who', 'why', 'how', 'this', 'that', 'these', 'those'];
    
    // Split the text into words, convert to lowercase, remove punctuation
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !fillerWords.includes(word));
  };
  
  // Check for direct topic matches in the concern text
  for (const [key, title] of Object.entries(topics)) {
    if (concern.toLowerCase().includes(key)) {
      return `Re: ${title}`;
    }
  }
  
  // Extract keywords from the concern
  const keywords = extractKeywords(concern);
  
  // If we have keywords, use them to build a subject
  if (keywords.length > 0) {
    // Get the 3 most significant words (assuming longer words are more significant)
    const significantWords = keywords
      .sort((a, b) => b.length - a.length)
      .slice(0, 3);
    
    // Capitalize first letter of each word
    const capitalizedWords = significantWords.map(
      word => word.charAt(0).toUpperCase() + word.slice(1)
    );
    
    return `Re: Policy Position on ${capitalizedWords.join(' ')}`;
  }
  
  // For short or unprocessable concerns, create a more generic but still relevant subject
  const concernWords = concern.split(' ');
  
  // For very short concerns, use a direct approach
  if (concernWords.length <= 5) {
    return `Re: Constituent Outreach on ${concern}`;
  }
  
  // For longer concerns, extract a meaningful phrase
  const keyPhrase = concernWords.slice(0, Math.min(5, concernWords.length)).join(' ');
  return `Re: Policy Position on ${keyPhrase}`;
};
