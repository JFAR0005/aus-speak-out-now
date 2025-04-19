
import { PostcodeData, Candidate, Electorate } from "../types";

// Mock candidate data
const candidates: Record<string, Candidate> = {
  "c1": {
    id: "c1",
    name: "Sarah Johnson",
    party: "Australian Labor Party",
    email: "sarah.johnson@example.com",
    imageUrl: "https://randomuser.me/api/portraits/women/42.jpg",
    chamber: "house",
    policies: [
      {
        topic: "Climate Change",
        stance: "Supportive",
        description: "Committed to net zero emissions by 2050 and increasing renewable energy investment."
      },
      {
        topic: "Healthcare",
        stance: "Supportive",
        description: "Advocates for strengthening Medicare and increasing hospital funding."
      },
      {
        topic: "Education",
        stance: "Supportive",
        description: "Supports increased education funding across all levels."
      }
    ]
  },
  "c2": {
    id: "c2",
    name: "Michael Thompson",
    party: "Liberal Party of Australia",
    email: "michael.thompson@example.com",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    chamber: "house",
    policies: [
      {
        topic: "Economy",
        stance: "Supportive",
        description: "Focuses on economic growth through tax cuts and business incentives."
      },
      {
        topic: "National Security",
        stance: "Supportive",
        description: "Advocates for increased defense spending and border security."
      },
      {
        topic: "Climate Change",
        stance: "Mixed",
        description: "Supports technology-driven solutions but opposes carbon taxes."
      }
    ]
  },
  "c3": {
    id: "c3",
    name: "Jessica Lee",
    party: "Australian Greens",
    email: "jessica.lee@example.com",
    imageUrl: "https://randomuser.me/api/portraits/women/65.jpg",
    chamber: "senate",
    policies: [
      {
        topic: "Climate Change",
        stance: "Strongly Supportive",
        description: "Advocates for rapid transition to 100% renewable energy and end to fossil fuels."
      },
      {
        topic: "Social Justice",
        stance: "Supportive",
        description: "Supports increasing welfare payments and affordable housing initiatives."
      },
      {
        topic: "Environment",
        stance: "Supportive",
        description: "Prioritizes biodiversity conservation and protection of natural habitats."
      }
    ]
  },
  "c4": {
    id: "c4",
    name: "Robert Wilson",
    party: "Independent",
    email: "robert.wilson@example.com",
    imageUrl: "https://randomuser.me/api/portraits/men/52.jpg",
    chamber: "senate",
    policies: [
      {
        topic: "Local Infrastructure",
        stance: "Supportive",
        description: "Focuses on improving local roads, public transport, and community facilities."
      },
      {
        topic: "Government Transparency",
        stance: "Supportive",
        description: "Advocates for increased accountability in government spending and decision-making."
      },
      {
        topic: "Small Business",
        stance: "Supportive",
        description: "Supports reducing red tape and providing assistance to local businesses."
      }
    ]
  }
};

// Mock electorate data
const electorates: Record<string, Electorate> = {
  "e1": {
    id: "e1",
    name: "Melbourne",
    state: "VIC",
    candidates: [candidates.c1, candidates.c3]
  },
  "e2": {
    id: "e2",
    name: "Sydney",
    state: "NSW",
    candidates: [candidates.c2, candidates.c3, candidates.c4]
  },
  "e3": {
    id: "e3",
    name: "Brisbane",
    state: "QLD",
    candidates: [candidates.c1, candidates.c2]
  }
};

// Mock postcode data
export const postcodeData: Record<string, PostcodeData> = {
  "3000": {
    postcode: "3000",
    electorates: [electorates.e1]
  },
  "2000": {
    postcode: "2000",
    electorates: [electorates.e2]
  },
  "4000": {
    postcode: "4000",
    electorates: [electorates.e3]
  }
};

// Function to lookup postcode
export const lookupPostcode = (postcode: string): PostcodeData | null => {
  return postcodeData[postcode] || null;
};
