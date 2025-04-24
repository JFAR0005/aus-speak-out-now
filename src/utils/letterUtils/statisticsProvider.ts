
/**
 * Provides relevant statistics based on the topic of concern
 */

const statistics = {
  climate: [
    "According to the CSIRO, Australia has warmed by approximately 1.4°C since 1910, leading to increased frequency of extreme heat events.",
    "Australia's annual emissions are around 494 million tonnes of CO₂ equivalent, according to recent government data.",
    "Renewable energy sources now account for over 30% of Australia's electricity generation, representing significant growth in the past decade.",
    "The Climate Council reports that Australia has the highest per capita greenhouse gas emissions among developed nations."
  ],
  healthcare: [
    "Medicare statistics show that GP bulk billing rates have declined in recent years, particularly in regional areas.",
    "The Australian Medical Association reports that public hospital waiting times have increased by 14% over the last five years.",
    "Mental health conditions affect approximately 1 in 5 Australians in any given year, according to the National Mental Health Commission.",
    "Healthcare spending accounts for nearly 10% of Australia's GDP, yet many Australians report difficulty accessing affordable care."
  ],
  housing: [
    "CoreLogic data shows Australian housing prices have increased by over 25% in major cities during the past two years.",
    "Homelessness has increased by approximately 14% over the past five years according to the Australian Bureau of Statistics.",
    "The average first home buyer now needs over 10 years to save for a deposit in major Australian cities.",
    "Rental vacancy rates in major Australian cities have fallen below 1%, creating significant pressure on rental affordability."
  ],
  education: [
    "Australian teachers work some of the longest hours in the OECD while real wages have declined over the past decade.",
    "University fees have increased by over 15% in the past five years, while government funding per student has declined.",
    "NAPLAN results show significant educational outcome gaps between metropolitan and regional schools.",
    "Early childhood educators in Australia are among the lowest paid professionals despite the critical importance of early years education."
  ],
  economy: [
    "The Reserve Bank of Australia reports that wages have grown at less than half the rate of productivity over the past decade.",
    "Income inequality in Australia has reached its highest level in 70 years according to analysis of ABS data.",
    "Small businesses employ over 40% of Australia's workforce but have faced increasing challenges with rising costs.",
    "The cost of essential services like electricity, healthcare, and education has risen faster than CPI over the past decade."
  ],
  indigenous: [
    "The Closing the Gap report shows little progress on key indicators including life expectancy and incarceration rates.",
    "First Nations Australians are 10 times more likely to be incarcerated than non-Indigenous Australians.",
    "Indigenous children are nearly twice as likely to be developmentally vulnerable when starting school compared to non-Indigenous children.",
    "Despite representing 3.3% of the population, Aboriginal and Torres Strait Islander people receive less than 1% of total government procurement contracts."
  ],
  immigration: [
    "Migration accounts for approximately 60% of Australia's population growth according to the Australian Bureau of Statistics.",
    "Skilled migrants contribute approximately $6 billion annually to the Australian economy according to Treasury analysis.",
    "Australia's humanitarian intake has decreased significantly in recent years despite global refugee numbers reaching record highs.",
    "Regional visa programs have struggled to maintain settlement rates, with many migrants eventually relocating to major cities."
  ],
  gender: [
    "The gender pay gap in Australia remains at approximately 14%, according to the Workplace Gender Equality Agency.",
    "Women retire with approximately 40% less superannuation than men according to industry analysis.",
    "Domestic violence affects one in six Australian women and is the leading cause of homelessness for women.",
    "Despite making up half the population, women hold less than 40% of management positions across Australian organisations."
  ],
  taxation: [
    "Australia's tax-to-GDP ratio is below the OECD average, limiting funding for essential services.",
    "Tax concessions for property investment and superannuation disproportionately benefit higher-income earners.",
    "Corporate tax avoidance costs Australia an estimated $8 billion annually according to Tax Justice Network analysis.",
    "The effective tax rate paid by Australia's largest companies is significantly below the statutory corporate tax rate."
  ],
  transport: [
    "Infrastructure Australia estimates that congestion costs the economy over $19 billion annually in lost productivity.",
    "Public transport usage in major cities remains below pre-pandemic levels, increasing pressure on road systems.",
    "Electric vehicles make up less than 2% of new car sales in Australia, significantly behind comparable nations.",
    "Regional communities spend up to 35% more on transport costs than metropolitan areas according to RACV analysis."
  ],
  lgbtq: [
    "LGBTQIA+ young people experience depression and anxiety at more than three times the rate of their peers.",
    "Transgender Australians report significant barriers to healthcare, with over 60% experiencing discrimination when accessing services.",
    "Despite marriage equality, LGBTQIA+ Australians continue to face workplace discrimination and harassment.",
    "Conversion practices remain legal in several Australian states despite being condemned by health organisations."
  ],
  youth: [
    "Youth unemployment remains at approximately twice the national average according to ABS labour force data.",
    "Young Australians face the prospect of being the first generation worse off financially than their parents.",
    "Mental health is the most significant health issue facing young Australians, with concerns increasing post-pandemic.",
    "Youth homelessness has increased by 26% in the past five years according to social service providers."
  ],
  security: [
    "Australia's defence spending is approaching 2% of GDP in response to changing regional security dynamics.",
    "Cybersecurity incidents affecting Australian businesses increased by over 25% in the past year according to the ACSC.",
    "Critical infrastructure protection has become a key national security priority following recent international developments.",
    "Australia's intelligence agencies are facing unprecedented challenges from foreign interference and espionage."
  ]
};

// Default statistics to use if no topic match is found
const defaultStatistics = [
  "Recent polling shows that over 70% of Australians want their elected representatives to focus more on long-term policy solutions.",
  "Community consultation research indicates that constituents feel disconnected from the political process, with only 23% believing their concerns are adequately addressed.",
  "Trust in government institutions has declined over the past decade, with only 37% of Australians reporting confidence in federal government according to recent surveys.",
  "Independent analysis suggests that bipartisan approaches to major policy challenges lead to more effective and enduring outcomes."
];

/**
 * Returns a relevant statistic based on the concern topic
 * @param concern The user's concern or issue
 * @returns A relevant statistic as a string
 */
export const getRandomStatistic = (concern: string): string => {
  const lowerConcern = concern.toLowerCase();
  
  // Find relevant topic
  let topicStats = defaultStatistics;
  
  for (const [topic, stats] of Object.entries(statistics)) {
    if (lowerConcern.includes(topic)) {
      topicStats = stats;
      break;
    }
  }
  
  // Select a random statistic from the chosen topic
  const randomIndex = Math.floor(Math.random() * topicStats.length);
  return topicStats[randomIndex];
};
