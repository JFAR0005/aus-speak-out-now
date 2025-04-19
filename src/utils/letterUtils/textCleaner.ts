
// Clean, improve, and enhance input text with proper Australian English
export const cleanInputText = (text: string): string => {
  // Australian spelling conversion dictionary
  const australianSpelling: Record<string, string> = {
    'center': 'centre',
    'program': 'programme',
    'organization': 'organisation',
    'labor party': 'Labor Party', // Note: The Australian Labor Party uses 'Labor' not 'Labour'
    'district': 'federal electorate',
    'representing': 'candidate for',
    'color': 'colour',
    'theater': 'theatre',
    'defense': 'defence',
    'license': 'licence',
    'practice': 'practise', // verb form
    'aging': 'ageing',
    'analog': 'analogue',
    'catalog': 'catalogue',
    'check': 'cheque', // the payment method
    'councilor': 'councillor',
    'enrollment': 'enrolment',
    'fulfill': 'fulfil',
    'jail': 'gaol',
    'judgment': 'judgement',
    'pediatric': 'paediatric',
    'plow': 'plough',
    'skeptic': 'sceptic',
    'traveled': 'travelled',
  };
  
  // Enhanced concern transformation
  if (!text || text.trim() === '') {
    return "important policy matters affecting our community";
  }
  
  // Start by correcting Australian spelling
  let enhancedText = text.trim();
  
  Object.entries(australianSpelling).forEach(([american, australian]) => {
    const regex = new RegExp('\\b' + american + '\\b', 'gi');
    enhancedText = enhancedText.replace(regex, australian);
  });
  
  // Clean up spaces and formatting
  enhancedText = enhancedText.replace(/\s+/g, ' ').trim();
  
  // Capitalize first letter of sentences
  enhancedText = enhancedText.replace(/(^\w|\.[\s\n]\w)/g, letter => letter.toUpperCase());
  
  // Enhance concern phrasing if it's too short or simple
  if (enhancedText.split(' ').length <= 3) {
    enhancedText = `the critical issue of ${enhancedText} and its impact on our community`;
  }
  
  // Add contextual enhancements based on key topics
  if (/climate|environment|carbon|warming|emission/i.test(enhancedText)) {
    if (!enhancedText.includes("future generations")) {
      enhancedText += " and its implications for future generations";
    }
  }
  
  if (/health|medicare|hospital|doctor/i.test(enhancedText)) {
    if (!enhancedText.includes("healthcare system")) {
      enhancedText += " within our healthcare system";
    }
  }
  
  if (/education|school|university|student/i.test(enhancedText)) {
    if (!enhancedText.includes("educational opportunities")) {
      enhancedText += " and its effect on educational opportunities";
    }
  }
  
  if (/indig|aboriginal|first nation|native|torres/i.test(enhancedText)) {
    if (!enhancedText.includes("reconciliation")) {
      enhancedText += " in the context of meaningful reconciliation";
    }
  }
  
  // Final polish for formal tone
  enhancedText = enhancedText
    .replace(/i'm concerned about/i, "I have significant concerns regarding")
    .replace(/i worry/i, "I am deeply concerned")
    .replace(/i think/i, "I believe")
    .replace(/i want/i, "I am seeking")
    .replace(/fix this/i, "address this important issue")
    .replace(/what will you do/i, "what measures you plan to implement");
  
  return enhancedText;
};
