
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
  
  // Return the enhanced text directly for more authentic user voice
  return enhancedText;
};

// Check grammar and phrasing quality
export const qualityCheck = (text: string): string => {
  // Ensure proper spacing for signature with Australian formatting
  let improvedText = text
    // Add proper spacing for sign-off 
    // This ensures "Yours sincerely," is on its own line with blank lines before and after
    .replace(/(\w)(\s*\n\s*)(Yours sincerely,)(\s*\n\s*)(\w)/g, 
      "$1\n\n$3\n\n$5");
  
  // Make sure "Yours sincerely," is followed by a line break if it's not already
  improvedText = improvedText.replace(/(Yours sincerely,)(?!\n\n)/g, "$1\n\n");
  
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
    .replace(/\brecognize\b/gi, 'recognise')
    .replace(/\banalyze\b/gi, 'analyse')
    .replace(/\bprioritize\b/gi, 'prioritise')
    .replace(/\bmemorize\b/gi, 'memorise')
    .replace(/\bauthorize\b/gi, 'authorise')
    .replace(/\bcriticize\b/gi, 'criticise')
    .replace(/\bfinaliz(e|ing)\b/gi, (match) => 
      match.endsWith('e') ? 'finalise' : 'finalising')
    .replace(/\bprogram(s?)\b/gi, (match) => 
      match.endsWith('s') ? 'programmes' : 'programme')
    .replace(/\bgray\b/gi, 'grey')
    .replace(/\btire(d|s)?\b/gi, (match) => {
      if (match === 'tire') return 'tyre';
      if (match === 'tires') return 'tyres';
      return match; // keep 'tired' as is
    });
  
  // Fix any repetitive sentences
  const sentences = improvedText.split(/(?<=[.!?])\s+/);
  const uniqueSentences = Array.from(new Set(sentences));
  improvedText = uniqueSentences.join(' ');
  
  // Ensure proper paragraph breaks for readability
  improvedText = improvedText.replace(/([.!?])\s+([A-Z])/g, "$1\n\n$2");
  
  return improvedText;
};
