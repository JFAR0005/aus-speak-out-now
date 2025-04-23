
export const extractDocumentInsights = (documentText: string | null, concern: string): string => {
  if (!documentText?.trim()) {
    return '';
  }
  
  try {
    const limitedText = documentText.substring(0, 10000);
    const stats = limitedText.match(/\d+(\.\d+)?%|\$\d+(\.\d+)? (million|billion)|(\d+,)+\d+/g) || [];
    const quotes = limitedText.match(/"([^"]*)"|'([^']*)'/g) || [];
    const numStatements = limitedText.match(/[^.!?]*\d+[^.!?]*[.!?]/g) || [];
    
    const facts = [...stats, ...quotes, ...numStatements].slice(0, 20);
    const concernKeywords = concern.toLowerCase().split(' ');
    const relevantFacts = facts
      .filter(fact => 
        concernKeywords.some(keyword => 
          keyword.length > 3 && fact.toLowerCase().includes(keyword)
        )
      ).slice(0, 5);
    
    if (relevantFacts.length > 0) {
      return `Here are some relevant facts about this issue: ${relevantFacts.join('; ')}.\n\n`;
    }
    
    return '';
  } catch (error) {
    console.error("Error extracting document insights:", error);
    return '';
  }
};
