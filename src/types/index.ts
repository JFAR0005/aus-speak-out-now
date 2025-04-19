
export type ChamberType = "house" | "senate";

export interface Candidate {
  id: string;
  name: string;
  party: string;
  email: string;
  policies: Policy[];
  imageUrl?: string;
  chamber: ChamberType;
  division?: string; // For house representatives
  state?: string;    // For senate representatives
}

export interface Policy {
  topic: string;
  stance: string;
  description: string;
}

export interface Electorate {
  id: string;
  name: string;
  state: string;
  candidates: Candidate[];
}

export interface PostcodeData {
  postcode: string;
  electorates: Electorate[];
}

export interface AppState {
  currentStep: number;
  postcode: string;
  selectedElectorate?: Electorate;
  selectedCandidates: string[];
  userConcern: string;
  generatedLetter: string;
}
