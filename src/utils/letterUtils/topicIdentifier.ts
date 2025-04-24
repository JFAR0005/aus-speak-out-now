
// Map of topics and their relevant context for letter generation
const topicMap: Record<string, { 
  keywords: string[],
  context: string
}> = {
  "cost_of_living": {
    keywords: ["cost of living", "inflation", "prices", "wages", "bills", "groceries", "fuel", "petrol", "rent", "mortgage", "interest rates"],
    context: "The rising cost of living is impacting families across Australia. Many households are struggling with basic expenses while wages have not kept pace with inflation."
  },
  "climate_change": {
    keywords: ["climate", "emissions", "carbon", "renewables", "solar", "wind", "coal", "gas", "fossil fuels", "net zero", "environment", "biodiversity"],
    context: "Climate change presents one of the most significant challenges of our time, with Australia particularly vulnerable to extreme weather events, bushfires, and coastal erosion."
  },
  "healthcare": {
    keywords: ["health", "medicare", "hospital", "doctor", "gp", "bulk billing", "mental health", "prescription", "medical", "ambulance", "aged care"],
    context: "A strong healthcare system is essential for all Australians. Many are concerned about access to affordable care, bulk billing availability, and wait times for essential services."
  },
  "education": {
    keywords: ["education", "school", "university", "tafe", "teacher", "student", "childcare", "curriculum", "hecs", "help debt", "fee"],
    context: "Quality education underpins our nation's future. From early childhood through to higher education, funding and accessibility remain critical concerns for many Australians."
  },
  "housing": {
    keywords: ["housing", "rent", "mortgage", "first home buyer", "homelessness", "property", "real estate", "rental", "landlord", "tenant", "affordable housing"],
    context: "The housing affordability crisis affects Australians of all ages. Many young people feel that home ownership is increasingly out of reach, while renters face insecurity and rising costs."
  },
  "tax": {
    keywords: ["tax", "budget", "revenue", "spending", "deficit", "surplus", "economic", "negative gearing", "superannuation", "income tax", "gst", "welfare"],
    context: "Tax policy shapes our economy and determines what public services can be funded. Many Australians are concerned about fairness in the tax system and how revenue is allocated."
  },
  "indigenous": {
    keywords: ["indigenous", "aboriginal", "first nations", "voice", "treaty", "reconciliation", "closing the gap", "uluru statement", "sovereignty", "native title"],
    context: "First Nations perspectives and rights remain a fundamental part of Australian political discourse, with many calling for meaningful action on reconciliation and representation."
  },
  "immigration": {
    keywords: ["immigration", "migrant", "refugee", "asylum", "visa", "borders", "detention", "multicultural", "citizenship", "population"],
    context: "Immigration policy shapes Australia's identity and future. Many believe we need a system that is both orderly and compassionate, reflecting our values as a diverse nation."
  },
  "security": {
    keywords: ["defence", "security", "military", "aukus", "alliance", "china", "terrorism", "cyber", "intelligence", "foreign affairs", "diplomacy"],
    context: "In an increasingly complex global environment, Australia's security and international relationships require careful consideration and strategic planning."
  },
  "gender_equality": {
    keywords: ["gender", "women", "equal pay", "domestic violence", "sexual harassment", "feminism", "maternity", "paternity", "childcare"],
    context: "Gender equality remains unfinished business in Australia. From workplace equity to safety from violence, many are calling for stronger action to address systemic issues."
  },
  "lgbtqia": {
    keywords: ["lgbtiq", "gay", "lesbian", "transgender", "queer", "sexuality", "discrimination", "marriage equality", "pride"],
    context: "LGBTQIA+ Australians continue to advocate for protection from discrimination and respect for their identities and relationships in all aspects of society."
  },
  "racial_equity": {
    keywords: ["racism", "discrimination", "diversity", "inclusion", "multiculturalism", "hate speech", "vilification", "cultural"],
    context: "Australia's strength lies in its diversity, yet many communities still face racism and discrimination. Policies that promote inclusion and respect are essential for social cohesion."
  },
  "media": {
    keywords: ["media", "journalism", "abc", "sbs", "news", "social media", "misinformation", "free speech", "censorship", "press freedom"],
    context: "A healthy democracy requires diverse media sources and protection for press freedom, yet concerns about misinformation and media concentration continue to grow."
  },
  "youth": {
    keywords: ["youth", "young people", "future generations", "intergenerational", "students", "graduates", "millennials", "gen z"],
    context: "Young Australians face unique challenges, from education and employment to housing affordability and climate change. Their perspectives are vital in shaping policy."
  },
  "animal_welfare": {
    keywords: ["animal", "welfare", "wildlife", "livestock", "farming", "live export", "vegan", "vegetarian", "cruelty", "protection"],
    context: "Animal welfare standards reflect our values as a society, with growing community expectations for ethical treatment across agriculture, research, and companion animals."
  },
  "justice": {
    keywords: ["justice", "crime", "police", "prison", "court", "legal aid", "sentencing", "rehabilitation", "incarceration", "law enforcement"],
    context: "An effective justice system must balance community safety with rehabilitation and support. Many are concerned about addressing the root causes of crime."
  },
  "digital_rights": {
    keywords: ["digital", "privacy", "data", "surveillance", "encryption", "internet", "online", "technology", "cyber", "ai", "artificial intelligence"],
    context: "As technology transforms our lives, issues of data privacy, digital rights, and technological regulation have become increasingly important public policy concerns."
  },
  "transport": {
    keywords: ["transport", "infrastructure", "roads", "rail", "public transport", "traffic", "congestion", "ev", "electric vehicles", "cycling"],
    context: "Effective transport infrastructure is essential for productivity and quality of life. Many communities seek better public transport options and reduced congestion."
  },
  "gambling": {
    keywords: ["gambling", "pokies", "betting", "casinos", "lottery", "addiction", "harm minimisation", "sports betting"],
    context: "Gambling harm affects many Australian communities, with growing calls for stronger regulations around advertising, access, and consumer protections."
  },
  "small_business": {
    keywords: ["business", "small business", "entrepreneur", "start-up", "regulation", "red tape", "jobs", "employment", "workplace"],
    context: "Small businesses are the backbone of local economies across Australia. Many seek reduced regulatory burdens and better support to drive innovation and job creation."
  },
  "default": {
    keywords: [],
    context: "This is an important issue that deserves careful consideration from all candidates in the upcoming election."
  }
};

/**
 * Identifies the most relevant topic from a user's concern and returns appropriate context
 * @param concern The user's concern or issue
 * @returns Contextual information about the topic
 */
export const getTopicContext = (concern: string): string => {
  const lowerConcern = concern.toLowerCase();
  
  // Find the topic with the most keyword matches
  let bestMatch = "default";
  let maxMatches = 0;
  
  Object.entries(topicMap).forEach(([topic, data]) => {
    if (topic === "default") return;
    
    const matches = data.keywords.filter(keyword => lowerConcern.includes(keyword.toLowerCase())).length;
    
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = topic;
    }
  });
  
  return topicMap[bestMatch].context;
};

/**
 * Returns a list of all supported topics for UI display
 */
export const getAllTopics = (): string[] => {
  return Object.keys(topicMap)
    .filter(topic => topic !== "default")
    .map(topic => topic.replace('_', ' '));
};
