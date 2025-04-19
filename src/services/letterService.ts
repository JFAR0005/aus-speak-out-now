
import { Candidate } from "../types";

// This would be replaced with actual API call to OpenAI or other AI services
export const generateLetter = async (
  candidates: Candidate[],
  concern: string
): Promise<string> => {
  // In a real implementation, this would call an API
  
  // For demo purposes, we'll generate a mock response
  const candidateNames = candidates.map(c => c.name).join(", ");
  const parties = [...new Set(candidates.map(c => c.party))].join(", ");
  
  // Simple template for mock letter
  const letter = `Dear ${candidateNames},

I am writing to you as a constituent in your electorate regarding my concerns about ${concern}.

As representatives from the ${parties}, I believe you have the power to make meaningful change on this issue. 

${generateSpecificContent(concern)}

I would appreciate your thoughts on this matter and what actions you plan to take to address these concerns.

Thank you for your time and consideration.

Sincerely,
[Your Name]
[Your Address]
[Your Contact Information]`;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return letter;
};

// Helper function to generate specific content based on concern
const generateSpecificContent = (concern: string): string => {
  const concerns: Record<string, string> = {
    "climate change": "Australia is particularly vulnerable to the effects of climate change, including more frequent and severe bushfires, droughts, and coastal flooding. We need strong policy action to reduce emissions and prepare our communities for the changes ahead.",
    
    "healthcare": "Access to quality healthcare is a fundamental right. I am concerned about waiting times, out-of-pocket costs, and ensuring that our healthcare system remains accessible to all Australians regardless of their income or location.",
    
    "education": "Education is the foundation of our society and economy. I believe we need to ensure adequate funding for schools, support for teachers, and affordable access to higher education and vocational training.",
    
    "economy": "Economic policies should benefit all Australians, not just the wealthy. I am concerned about job security, wage growth, and the rising cost of living that is making it harder for many families to make ends meet.",
    
    "housing": "Housing affordability is a growing crisis in Australia. More Australians are finding it difficult to buy their first home or even afford rent in many areas. We need policies that address both housing supply and demand issues.",
  };
  
  // Search for matching concerns
  for (const [key, content] of Object.entries(concerns)) {
    if (concern.toLowerCase().includes(key)) {
      return content;
    }
  }
  
  // Default response if no specific concern matches
  return `This issue is important to me and many other Australians. I believe we need thoughtful policy solutions that consider the long-term impacts on our communities and future generations.`;
};
