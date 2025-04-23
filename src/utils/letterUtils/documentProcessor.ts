
export const extractDocumentInsights = (documentText: string | null, concern: string): string => {
  if (!documentText?.trim()) {
    return '';
  }
  
  try {
    // Clean up potential PDF metadata or binary content
    const cleanedText = documentText
      .replace(/\%PDF.*?\%EOF/gs, '')
      .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\xFF]/g, '')
      .replace(/\d+ \d+ obj.*?endobj/gs, '')
      .replace(/xref.*?startxref/gs, '')
      .replace(/trailer.*?\/\>\>/gs, '')
      .replace(/[^\x20-\x7E\s]/g, '')
      .trim();
    
    // Extract meaningful statistics and statements
    const stats = cleanedText.match(/\d+(\.\d+)?%|\$\d+(\.\d+)? (million|billion)|(\d+,)+\d+/g) || [];
    const quotes = cleanedText.match(/"([^"]*)"|'([^']*)'/g) || [];
    const numStatements = cleanedText.match(/[^.!?]*\d+[^.!?]*[.!?]/g) || [];
    
    // Filter out corrupted content and PDF artifacts
    const isValidContent = (text: string) => {
      return text.length > 5 && 
             text.length < 300 &&
             !/^[0-9a-f\s]+$/i.test(text) &&
             !/obj|endobj|xref|startxref|trailer|\%PDF|\%EOF/i.test(text);
    };
    
    const facts = [...stats, ...quotes, ...numStatements]
      .filter(isValidContent)
      .map(fact => fact.trim())
      .filter(fact => fact.length > 0)
      .slice(0, 5);
    
    // Find content relevant to the user's concern
    const concernKeywords = concern.toLowerCase().split(' ');
    const relevantFacts = facts
      .filter(fact => 
        concernKeywords.some(keyword => 
          keyword.length > 3 && fact.toLowerCase().includes(keyword)
        )
      )
      .slice(0, 3);
    
    // Format insights as bullet points
    if (relevantFacts.length > 0) {
      return `Based on the provided research:\n\n${relevantFacts.map(fact => `• ${fact}`).join('\n')}\n\n`;
    }
    
    return '';
  } catch (error) {
    console.error("Error extracting document insights:", error);
    return '';
  }
};
