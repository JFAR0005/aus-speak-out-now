
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
      return `Based on the document provided, I've found these relevant facts: ${relevantFacts.join('; ')}. `;
    }
    
    return `I've reviewed the document you've provided which contains information about ${concern}. `;
  } catch (error) {
    console.error("Error extracting document insights:", error);
    return '';
  }
};
