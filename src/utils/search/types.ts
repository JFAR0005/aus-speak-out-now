
import { ChamberType, Electorate } from "@/types";

export interface SearchDebugStep {
  step: string;
  query?: string;
  found?: number;
  hasError?: boolean;
  error?: any;
  mappings?: any[];
  count?: number;
  electorates?: string;
  description?: string;
  exactMatches?: any[];
  originalMatches?: any[];
  houseCount?: number;
  senateCount?: number;
}

export interface SearchDebugInfo {
  input: string;
  chamberType: ChamberType | null;
  steps: SearchDebugStep[];
  testQueryResults?: any[];
}

export interface SearchState {
  error: string | null;
  info: string | null;
  isSearching: boolean;
  mappings: any[];
  houseResults: any[];
  senateResults: any[];
  debug: SearchDebugInfo | null;
}

export interface PostcodeMapping {
  electorate: string;
  state: string;
  postcode: number;
  locality?: string | null;
}

export interface CandidateSearchProps {
  chamberType: ChamberType | null;
  postcode: string;
  onContinue: (electorate: Electorate) => void;
}

