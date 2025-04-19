
export const generateSubjectLine = (concern: string): string => {
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
  
  const matchedTopic = Object.entries(topics).find(([key]) => 
    concern.toLowerCase().includes(key)
  );
  
  if (matchedTopic) {
    return `Re: ${matchedTopic[1]}`;
  }
  
  const concernWords = concern.split(' ').slice(0, 5).join(' ');
  return `Re: Concerns Regarding ${concernWords}...`;
};
