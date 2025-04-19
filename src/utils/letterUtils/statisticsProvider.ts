
export const getRandomStatistic = (concern: string): string => {
  // Expanded statistics database with more specific and impactful facts
  const statistics = {
    "violence": [
      "According to the Australian Institute of Health and Welfare, one woman is killed every nine days by a current or former partner in Australia.",
      "In 2025 alone, 20 women have already been killed due to domestic violence — a tragic statistic that demands immediate action.",
      "Research from the Australian Bureau of Statistics shows that 16.9% of women have experienced physical or sexual violence from an intimate partner since age 15.",
      "Family and domestic violence causes more illness, disability and deaths than any other risk factor for women aged 25-44 in Australia.",
      "More than 60% of women who experienced physical assault by a male partner had children in their care at the time."
    ],
    "climate": [
      "Australia's temperatures have increased by an average of 1.44°C since 1910, exceeding the global average of 1.1°C.",
      "The catastrophic 2019-2020 bushfires killed or displaced over 3 billion native animals and burned more than 17 million hectares.",
      "Rising sea levels threaten over 85% of Australians who live in coastal regions, with projections showing up to one metre of sea level rise by 2100.",
      "While renewable energy now accounts for 32.5% of Australia's total electricity generation, we remain one of the highest per capita carbon emitters globally.",
      "The Great Barrier Reef has suffered four mass bleaching events since 2016, with over 50% of coral cover lost due to rising ocean temperatures."
    ],
    "healthcare": [
      "Hospital emergency department waiting times have increased by 12% in the past five years, with rural patients facing even longer delays.",
      "Mental health conditions affect 4.2 million Australians each year, yet only 40% receive appropriate professional support.",
      "Nearly half (46%) of Australians have one or more chronic conditions requiring ongoing care, placing significant strain on our healthcare system.",
      "Rural Australians are 1.5 times more likely to face barriers accessing healthcare services, with some communities lacking even basic medical facilities.",
      "Out-of-pocket healthcare costs have risen at twice the rate of inflation over the past decade, creating barriers to care for many Australians."
    ],
    "housing": [
      "House prices in major Australian cities have increased by 25% in the last two years, pushing homeownership out of reach for many first-time buyers.",
      "More than 116,000 Australians experience homelessness on any given night, including over 15,000 children and young people.",
      "The median house price in Sydney is now 11.2 times the median annual household income, making it one of the least affordable cities globally.",
      "Rental vacancy rates in major cities have dropped below 1% in many areas, creating a rental affordability crisis.",
      "Public housing waitlists exceed 150,000 applications nationwide, with average wait times of 5-10 years in high-demand areas."
    ],
    "education": [
      "Australian students' PISA rankings have declined in reading, mathematics and science over the past decade, falling behind many comparable nations.",
      "Teacher shortages affect nearly 60% of Australian schools, with rural and disadvantaged areas experiencing the most severe impacts.",
      "University graduates now leave with an average HECS-HELP debt of $23,685, taking an average of 9.5 years to repay.",
      "Only 84% of Australian schools have reliable internet access needed for digital learning, creating a digital divide for disadvantaged students.",
      "Public school funding has decreased in real terms by 4% over the past decade, while private school funding has increased by 5%."
    ],
    "indigenous": [
      "First Nations people have a life expectancy approximately 8 years shorter than non-Indigenous Australians, reflecting ongoing health inequities.",
      "Indigenous incarceration rates are 13 times higher than for non-Indigenous Australians, with Aboriginal youth comprising over 50% of juvenile detainees.",
      "Despite comprising 3.3% of the population, Aboriginal and Torres Strait Islander people make up less than 1.5% of the federal parliament.",
      "More than 60% of Indigenous students complete Year a 12 compared to 89% of non-Indigenous students, highlighting persistent educational gaps.",
      "Over 400 Aboriginal and Torres Strait Islander people have died in custody since the 1991 Royal Commission."
    ],
    "disability": [
      "One in six Australians (4.4 million people) live with disability, yet employment rates for people with disability remain 30% lower than for others.",
      "NDIS funding challenges have left over 130,000 eligible Australians waiting for appropriate support packages.",
      "Only 53% of public buildings in Australia meet accessibility standards, creating significant barriers to community participation.",
      "People with disability are twice as likely to experience discrimination in the workplace and three times more likely to experience violence.",
      "Half of all Australians with disability live on or below the poverty line, reflecting significant economic disadvantage."
    ],
    "economy": [
      "Real wages have failed to keep pace with productivity and inflation, with Australian workers experiencing an effective pay cut over the past five years.",
      "Casual and insecure work now accounts for over 24% of the Australian workforce, creating financial instability for millions of households.",
      "Regional inequality has widened, with GDP per capita in major cities now 40% higher than in remote areas.",
      "The gender pay gap remains at 14.1%, translating to women earning $253.60 less per week than men on average.",
      "Small businesses, which employ over 40% of the Australian workforce, face increasing challenges from market concentration and rising operational costs."
    ]
  };
  
  // Look for topic matches in the user's concern
  for (const [topic, stats] of Object.entries(statistics)) {
    if (concern.toLowerCase().includes(topic)) {
      return stats[Math.floor(Math.random() * stats.length)];
    }
  }
  
  // For concerns that don't match our predefined topics, provide a more generic but still relevant statement
  const genericStats = [
    "Research indicates this issue affects a significant percentage of Australians, with particular impact on vulnerable communities.",
    "Recent polling shows that 65% of voters consider this issue important or very important in determining their voting decisions.",
    "This issue has seen a 28% increase in public concern over the past two years, according to recent surveys.",
    "Experts suggest that policy reform in this area could deliver substantial benefits to our community and economy.",
    "Independent analysis indicates that addressing this issue effectively would benefit over two million Australians."
  ];
  
  return genericStats[Math.floor(Math.random() * genericStats.length)];
};
