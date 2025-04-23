
export const extractDocumentInsights = (documentText: string | null, concern: string): string => {
  if (!documentText?.trim()) {
    return '';
  }
  
  try {
    // Clean up potential PDF metadata or binary content
    const cleanedText = documentText
      .replace(/\%PDF.*?\%EOF/gs, '') // Remove PDF header/footer markers
      .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\xFF]/g, '') // Remove binary/control characters
      .replace(/\d+ \d+ obj.*?endobj/gs, '') // Remove PDF object markers
      .replace(/xref.*?startxref/gs, '') // Remove xref tables
      .replace(/trailer.*?\/\>\>/gs, '') // Remove trailer sections
      .replace(/[^\x20-\x7E\s]/g, '') // Keep only printable ASCII and whitespace
      .trim();
    
    // Limit text size to prevent processing issues
    const limitedText = cleanedText.substring(0, 10000);
    
    // Extract meaningful statistics and statements
    const stats = limitedText.match(/\d+(\.\d+)?%|\$\d+(\.\d+)? (million|billion)|(\d+,)+\d+/g) || [];
    const quotes = limitedText.match(/"([^"]*)"|'([^']*)'/g) || [];
    const numStatements = limitedText.match(/[^.!?]*\d+[^.!?]*[.!?]/g) || [];
    
    // Filter out obviously corrupted content (very short fragments, hex sequences)
    const isValidContent = (text: string) => {
      return text.length > 5 && 
             text.length < 300 &&
             !/^[0-9a-f\s]+$/i.test(text) && // Not just hex values
             !/obj|endobj|xref|startxref|trailer/i.test(text); // Not PDF structural elements
    };
    
    const facts = [...stats, ...quotes, ...numStatements]
      .filter(isValidContent)
      .slice(0, 20);
    
    // Find content relevant to the user's concern
    const concernKeywords = concern.toLowerCase().split(' ');
    const relevantFacts = facts
      .filter(fact => 
        concernKeywords.some(keyword => 
          keyword.length > 3 && fact.toLowerCase().includes(keyword)
        )
      ).slice(0, 5);
    
    // Format insights with proper sentence structure
    if (relevantFacts.length > 0) {
      return `Based on research data, some key insights relevant to this topic include:\n\n${relevantFacts.map(fact => `• ${fact.trim()}`).join('\n\n')}\n\n`;
    }
    
    return '';
  } catch (error) {
    console.error("Error extracting document insights:", error);
    return '';
  }
};
