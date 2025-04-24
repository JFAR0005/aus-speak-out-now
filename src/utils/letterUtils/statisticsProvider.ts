
/**
 * Provides relevant statistics based on the topic of concern
 */

// Expanded statistics database with more topics and recent figures
const statistics = {
  climate: [
    "According to the CSIRO, Australia has warmed by approximately 1.4°C since 1910, leading to increased frequency of extreme heat events.",
    "Australia's annual emissions are around 494 million tonnes of CO₂ equivalent, according to recent government data.",
    "Renewable energy sources now account for over 30% of Australia's electricity generation, representing significant growth in the past decade.",
    "The Climate Council reports that Australia has the highest per capita greenhouse gas emissions among developed nations.",
    "The 2023 State of the Climate report indicates that Australia is experiencing more frequent and intense extreme weather events due to climate change."
  ],
  healthcare: [
    "Medicare statistics show that GP bulk billing rates have declined in recent years, particularly in regional areas.",
    "The Australian Medical Association reports that public hospital waiting times have increased by 14% over the last five years.",
    "Mental health conditions affect approximately 1 in 5 Australians in any given year, according to the National Mental Health Commission.",
    "Healthcare spending accounts for nearly 10% of Australia's GDP, yet many Australians report difficulty accessing affordable care.",
    "Rural and regional Australians face healthcare access challenges with 33% fewer GPs per capita than metropolitan areas."
  ],
  housing: [
    "CoreLogic data shows Australian housing prices have increased by over 25% in major cities during the past two years.",
    "Homelessness has increased by approximately 14% over the past five years according to the Australian Bureau of Statistics.",
    "The average first home buyer now needs over 10 years to save for a deposit in major Australian cities.",
    "Rental vacancy rates in major Australian cities have fallen below 1%, creating significant pressure on rental affordability.",
    "The ratio of housing costs to household income has reached its highest level in three decades, according to recent economic analysis."
  ],
  education: [
    "Australian teachers work some of the longest hours in the OECD while real wages have declined over the past decade.",
    "University fees have increased by over 15% in the past five years, while government funding per student has declined.",
    "NAPLAN results show significant educational outcome gaps between metropolitan and regional schools.",
    "Early childhood educators in Australia are among the lowest paid professionals despite the critical importance of early years education.",
    "According to the Department of Education, 42% of Australian schools report teacher shortages affecting educational outcomes."
  ],
  economy: [
    "The Reserve Bank of Australia reports that wages have grown at less than half the rate of productivity over the past decade.",
    "Income inequality in Australia has reached its highest level in 70 years according to analysis of ABS data.",
    "Small businesses employ over 40% of Australia's workforce but have faced increasing challenges with rising costs.",
    "The cost of essential services like electricity, healthcare, and education has risen faster than CPI over the past decade.",
    "Recent Treasury analysis shows that households in the lowest income quintile spend over 30% more of their income on essential items than five years ago."
  ],
  cost_of_living: [
    "Food prices have increased by 14.9% in the past year according to the Consumer Price Index.",
    "Average electricity bills have risen by 28% in the past three years according to the Australian Energy Market Commission.",
    "The average Australian family spends 35% of their household income on housing costs, up from 27% a decade ago.",
    "Childcare costs have risen at more than twice the rate of inflation over the past five years.",
    "Petrol prices have fluctuated dramatically, with average increases of 22% compared to pre-pandemic levels."
  ],
  wages: [
    "Real wages in Australia have declined by 4.5% over the past three years, according to ABS wage price index data.",
    "The gender pay gap remains at 14.1%, meaning women earn on average $15,200 less per year than men.",
    "Nearly 25% of Australian workers are in casual employment with limited job security and benefits.",
    "Wage growth has consistently fallen below inflation for 11 consecutive quarters.",
    "The minimum wage in Australia has increased by just 2.8% annually on average over the past decade, while executive compensation has grown by 11.4%."
  ],
  indigenous: [
    "The Closing the Gap report shows little progress on key indicators including life expectancy and incarceration rates.",
    "First Nations Australians are 10 times more likely to be incarcerated than non-Indigenous Australians.",
    "Indigenous children are nearly twice as likely to be developmentally vulnerable when starting school compared to non-Indigenous children.",
    "Despite representing 3.3% of the population, Aboriginal and Torres Strait Islander people receive less than 1% of total government procurement contracts.",
    "The life expectancy gap between Indigenous and non-Indigenous Australians remains at approximately 8 years."
  ],
  immigration: [
    "Migration accounts for approximately 60% of Australia's population growth according to the Australian Bureau of Statistics.",
    "Skilled migrants contribute approximately $6 billion annually to the Australian economy according to Treasury analysis.",
    "Australia's humanitarian intake has decreased significantly in recent years despite global refugee numbers reaching record highs.",
    "Regional visa programs have struggled to maintain settlement rates, with many migrants eventually relocating to major cities.",
    "Temporary visa holders make up nearly 5% of Australia's workforce but face significant barriers to permanent residency."
  ],
  gender: [
    "The gender pay gap in Australia remains at approximately 14%, according to the Workplace Gender Equality Agency.",
    "Women retire with approximately 40% less superannuation than men according to industry analysis.",
    "Domestic violence affects one in six Australian women and is the leading cause of homelessness for women.",
    "Despite making up half the population, women hold less than 40% of management positions across Australian organisations.",
    "The cost of unpaid care work, primarily performed by women, is estimated to be worth over $650 billion annually to the Australian economy."
  ],
  national_security: [
    "Defence spending has increased to 2.1% of GDP, representing the highest allocation in decades.",
    "Cybersecurity incidents affecting Australian businesses have risen by 75% in the past two years.",
    "Australia's intelligence agencies have reported a significant increase in foreign interference activities.",
    "The AUKUS security pact represents Australia's largest defence acquisition program in history.",
    "Nearly 60% of critical infrastructure in Australia requires significant security upgrades according to recent security assessments."
  ],
  foreign_policy: [
    "Australia's diplomatic footprint has shrunk by 30% relative to GDP over the past two decades.",
    "Foreign aid has been reduced to 0.21% of GNI, the lowest level in Australia's history.",
    "Trade with Pacific nations represents less than 5% of Australia's total trade despite stated strategic priorities.",
    "Australia's relationship with China encompasses $250 billion in two-way trade despite diplomatic tensions.",
    "Australia ranks 19th out of 29 OECD countries for diplomatic influence relative to economic size."
  ],
  lgbtq: [
    "LGBTQIA+ young people experience depression and anxiety at more than three times the rate of their peers.",
    "Transgender Australians report significant barriers to healthcare, with over 60% experiencing discrimination when accessing services.",
    "Despite marriage equality, LGBTQIA+ Australians continue to face workplace discrimination and harassment.",
    "Conversion practices remain legal in several Australian states despite being condemned by health organisations.",
    "LGBTQIA+ students in schools without inclusive policies report 50% higher rates of bullying and isolation."
  ]
};

// More comprehensive default statistics
const defaultStatistics = [
  "Recent polling shows that over 70% of Australians want their elected representatives to focus more on long-term policy solutions.",
  "Community consultation research indicates that constituents feel disconnected from the political process, with only 23% believing their concerns are adequately addressed.",
  "Trust in government institutions has declined over the past decade, with only 37% of Australians reporting confidence in federal government according to recent surveys.",
  "Independent analysis suggests that bipartisan approaches to major policy challenges lead to more effective and enduring outcomes.",
  "Civic participation has declined by 15% over the past decade, with fewer Australians engaging directly with their elected representatives.",
  "A recent Democracy Index placed Australia 9th globally, with declining scores in political participation and governmental transparency."
];

/**
 * Returns a relevant statistic based on the concern topic
 * @param concern The user's concern or issue
 * @returns A relevant statistic as a string
 */
export const getRandomStatistic = (concern: string): string => {
  const lowerConcern = concern.toLowerCase();
  
  // Find relevant topic with expanded keyword matching
  let topicStats = defaultStatistics;
  
  const topicKeywords = {
    climate: ["climate", "carbon", "emissions", "renewable", "environmental", "sustainability", "green energy"],
    healthcare: ["health", "medicare", "hospital", "doctor", "medical", "mental health", "aged care"],
    housing: ["housing", "rent", "mortgage", "home", "property", "homelessness", "affordable housing"],
    education: ["education", "school", "university", "student", "teacher", "tafe", "childcare"],
    economy: ["economy", "economic", "budget", "debt", "deficit", "industry", "jobs", "employment"],
    cost_of_living: ["cost of living", "inflation", "prices", "bills", "expenses", "groceries", "petrol"],
    wages: ["wage", "salary", "income", "pay", "worker", "industrial relations", "fair work"],
    indigenous: ["indigenous", "aboriginal", "first nations", "torres strait", "reconciliation", "voice", "treaty"],
    immigration: ["immigration", "migrant", "refugee", "visa", "border", "asylum", "multicultural"],
    gender: ["gender", "women", "equality", "feminist", "sexism", "discrimination", "domestic violence"],
    national_security: ["security", "defence", "military", "aukus", "terrorism", "intelligence", "cybersecurity"],
    foreign_policy: ["foreign policy", "international", "diplomatic", "china", "alliance", "asia", "pacific"],
    lgbtq: ["lgbtq", "gay", "lesbian", "transgender", "queer", "rainbow", "sexuality", "gender identity"]
  };
  
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => lowerConcern.includes(keyword))) {
      topicStats = statistics[topic] || defaultStatistics;
      break;
    }
  }
  
  // Select a random statistic from the chosen topic
  const randomIndex = Math.floor(Math.random() * topicStats.length);
  return topicStats[randomIndex];
};
