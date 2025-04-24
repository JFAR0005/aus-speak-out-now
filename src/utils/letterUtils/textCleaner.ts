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
  
  // Don't return the enhanced text directly - we'll use it as a reference for paraphrasing
  
  // Extract key topics from the concern
  const climateTerms = /climate|environment|carbon|warming|emission/i.test(enhancedText);
  const healthTerms = /health|medicare|hospital|doctor/i.test(enhancedText);
  const educationTerms = /education|school|university|student/i.test(enhancedText);
  const indigenousTerms = /indig|aboriginal|first nation|native|torres/i.test(enhancedText);
  const genderTerms = /gender|women|domestic|violence|equality/i.test(enhancedText);
  const housingTerms = /hous|rent|afford|property|homeless/i.test(enhancedText);
  const economyTerms = /econom|job|unemploy|wage|inflation|cost of living/i.test(enhancedText);
  
  // Paraphrase by topic instead of directly inserting the user text
  if (climateTerms) {
    return "the urgent need for meaningful climate action and environmental protection";
  } else if (healthTerms) {
    return "improving our healthcare system and ensuring accessible medical services for all Australians";
  } else if (educationTerms) {
    return "strengthening our education system and expanding opportunities for students across Australia";
  } else if (indigenousTerms) {
    return "advancing First Nations rights, recognition, and achieving meaningful reconciliation";
  } else if (genderTerms) {
    return "addressing gender equality and eliminating violence against women in our communities";
  } else if (housingTerms) {
    return "the housing affordability crisis and improving access to secure housing for all Australians";
  } else if (economyTerms) {
    return "economic policies that address cost of living pressures and ensure fair wages for workers";
  } else {
    // For other topics, create a more generalized paraphrase
    const words = enhancedText.split(' ');
    const keyWords = words.filter(word => word.length > 4).slice(0, 3);
    
    // Form a natural sounding phrase based on key words
    if (keyWords.length > 0) {
      return `the important issues surrounding ${keyWords.join(' ')} and their impact on our community`;
    } else {
      return "important policy matters that affect our community's wellbeing and future";
    }
  }
};

// New function to check grammar and phrasing quality
export const qualityCheck = (text: string): string => {
  // Ensure proper spacing for signature with Australian formatting
  let improvedText = text
    // Add proper spacing for sign-off
    .replace(/\b(Regards|Sincerely|Yours sincerely|Thank you)\b,?\s*([A-Z][a-z]+(\s+[A-Z][a-z]+)*)/gi, 
      (match, signoff, name) => {
        // Ensure there's a paragraph break before signoff, then signoff on its own line, then name
        return `\n\n${signoff},\n\n${name}`;
      });
  
  // Remove redundant phrases and improve clarity
  improvedText = improvedText
    .replace(/\b(issue|matter|concern)\b.*?\b\1\b/gi, '$1')
    .replace(/\b(important|significant|critical)\b.*?\b\1\b/gi, '$1')
    .replace(/I am writing to (you )?regarding/gi, 'I am writing regarding')
    .replace(/I would like to express my concern/gi, 'I am concerned')
    .replace(/I would like to express my views/gi, 'I believe')
    .replace(/please do not hesitate to/gi, 'please');
  
  // Fix common grammar issues and ensure Australian English
  improvedText = improvedText
    .replace(/\bin regards to\b/gi, 'regarding')
    .replace(/\bas per\b/gi, 'according to')
    .replace(/\bbeing that\b/gi, 'because')
    .replace(/\bat this point in time\b/gi, 'now')
    .replace(/\bin order to\b/gi, 'to')
    .replace(/\bimpact on\b/gi, 'affect')
    .replace(/\butilise\b/gi, 'use')
    .replace(/\bprior to\b/gi, 'before')
    .replace(/\bsubsequent to\b/gi, 'after')
    .replace(/\bperiod of time\b/gi, 'period')
    .replace(/\bin excess of\b/gi, 'more than')
    .replace(/\bdespite the fact that\b/gi, 'although')
    .replace(/\bin the event that\b/gi, 'if');
  
  // Ensure Australian English spelling
  improvedText = improvedText
    .replace(/\bcolor\b/gi, 'colour')
    .replace(/\bcenter\b/gi, 'centre')
    .replace(/\borganization\b/gi, 'organisation')
    .replace(/\bspecialized\b/gi, 'specialised')
    .replace(/\bfavor\b/gi, 'favour')
    .replace(/\blabor party\b/gi, 'Labor Party') // Australian spelling exception
    .replace(/\bhonor\b/gi, 'honour')
    .replace(/\brealize\b/gi, 'realise')
    .replace(/\brecognize\b/gi, 'recognise');
  
  // Fix any repetitive sentences
  const sentences = improvedText.split(/(?<=[.!?])\s+/);
  const uniqueSentences = Array.from(new Set(sentences));
  improvedText = uniqueSentences.join(' ');
  
  return improvedText;
};
