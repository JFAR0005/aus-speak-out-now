
// Clean and improve input text with Australian English
export const cleanInputText = (text: string): string => {
  const australianSpelling: Record<string, string> = {
    'center': 'centre',
    'program': 'programme',
    'organization': 'organisation',
    'labor party': 'Labour Party',
    'district': 'federal electorate',
    'representing': 'candidate for',
  };
  
  let cleanedText = text;
  
  Object.entries(australianSpelling).forEach(([american, australian]) => {
    const regex = new RegExp(american, 'gi');
    cleanedText = cleanedText.replace(regex, australian);
  });
  
  cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
  cleanedText = cleanedText.replace(/(^\w|\.[\s\n]\w)/g, letter => letter.toUpperCase());
  
  return cleanedText;
};
