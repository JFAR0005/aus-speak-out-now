export const getRandomStatistic = (concern: string): string => {
  const statistics = {
    "violence": [
      "According to recent data, 1 in 6 women have experienced physical or sexual violence by a current or former partner.",
      "Disturbingly, 20 women have been killed due to domestic violence in 2024 alone.",
      "Research shows that 16.9% of women have experienced violence from an intimate partner.",
      "Family and domestic violence causes more illness, disability and deaths than any other risk factor for women aged 25-44."
    ],
    "climate": [
      "Australia's temperatures have increased by an average of 1.44°C since 1910.",
      "Over 3 billion animals were killed or displaced in the 2019-2020 bushfires.",
      "Rising sea levels are projected to affect over 85% of Australians who live in coastal regions.",
      "Renewable energy now accounts for 32.5% of Australia's total electricity generation."
    ],
    "healthcare": [
      "Hospital emergency department waiting times have increased by 12% in the past five years.",
      "Mental health conditions affect nearly 4.2 million Australians each year.",
      "46% of Australians have one or more chronic conditions requiring ongoing care.",
      "Rural Australians are 1.5 times more likely to face barriers accessing healthcare services."
    ],
    "housing": [
      "House prices have increased by 25% in major Australian cities in the last two years.",
      "Over 116,000 Australians experience homelessness on any given night.",
      "The median house price is now 8.5 times the median annual household income.",
      "Rental vacancy rates in major cities have dropped below 1% in many areas."
    ],
    "education": [
      "Australian students' PISA rankings have declined in reading, mathematics and science over the past decade.",
      "Teacher shortages affect nearly 60% of Australian schools.",
      "University graduates now leave with an average HECS debt of $23,685.",
      "Only 84% of Australian schools have reliable internet access for digital learning."
    ]
  };
  
  for (const [topic, stats] of Object.entries(statistics)) {
    if (concern.toLowerCase().includes(topic)) {
      return stats[Math.floor(Math.random() * stats.length)];
    }
  }
  
  return "Recent studies show this issue affects a significant portion of our community.";
};
