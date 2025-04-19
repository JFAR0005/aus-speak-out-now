
export const generateSubjectLine = (concern: string): string => {
  const topics = {
    "climate": "Urgent Action Required on Climate Change and Environmental Policy",
    "healthcare": "Healthcare Reform and Medicare Funding Priorities",
    "education": "Education Funding and Reform Initiatives",
    "housing": "Addressing the Housing Affordability Crisis",
    "immigration": "Immigration Policy Reform and Community Integration",
    "economy": "Economic Policy, Employment, and Cost of Living",
    "gender": "Gender Equality and Women's Rights in Australia",
    "violence": "Addressing Family and Gender-Based Violence",
    "indigenous": "First Nations Rights, Recognition, and Voice to Parliament",
    "disability": "Disability Support, NDIS Reform, and Inclusive Communities",
    "welfare": "Social Welfare, Income Support, and Inequality",
    "transport": "Public Transport Infrastructure and Sustainability",
    "energy": "Energy Policy, Renewables, and Future Planning",
    "mental": "Mental Health Support and Healthcare Integration",
    "agriculture": "Agricultural Policy and Regional Development",
    "water": "Water Management and Environmental Protection",
  };
  
  // Check for topic matches in the concern text
  for (const [key, title] of Object.entries(topics)) {
    if (concern.toLowerCase().includes(key)) {
      return `Re: ${title}`;
    }
  }
  
  // If no specific topic matches, create a more meaningful subject
  // by extracting key phrases from the concern
  const concernWords = concern.split(' ');
  
  // Try to find a meaningful phrase of 3-5 words if the concern is long enough
  if (concernWords.length >= 5) {
    const keyPhrase = concernWords.slice(0, Math.min(5, concernWords.length)).join(' ');
    return `Re: Policy Position on ${keyPhrase}`;
  }
  
  // For short concerns, use the entire concern
  return `Re: Policy Position on ${concern}`;
};
