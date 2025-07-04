import { supabase } from "@/integrations/supabase/client";
import { ChamberType } from "@/types";

export const fetchHouseCandidates = async (electorates: string[]): Promise<any[]> => {
  if (!electorates.length) return [];
  
  const { data, error } = await supabase
    .from('House of Representatives Candidates')
    .select('*')
    .in('electorate', electorates);
    
  if (error) {
    console.error("Error fetching House candidates:", error);
    throw error;
  }
  
  return data || [];
};

export const fetchSenateCandidates = async (states: string[]): Promise<any[]> => {
  if (!states.length) return [];
  
  const { data, error } = await supabase
    .from('Senate Candidates')
    .select('*')
    .in('state', states);
    
  if (error) {
    console.error("Error fetching Senate candidates:", error);
    throw error;
  }
  
  return data || [];
};

const generateUniqueId = (prefix: string, candidate: any): string => {
  const uniqueElements = [
    prefix,
    candidate.state,
    candidate.ballotPosition,
    candidate.surname,
    candidate.ballotGivenName
  ].filter(Boolean);
  
  return uniqueElements.join('-').toLowerCase().replace(/\s+/g, '-');
};

const formatHouseCandidates = (candidates: any[]) => {
  return candidates.map((candidate) => ({
    id: generateUniqueId('house', candidate),
    name: `${candidate.ballotGivenName || ''} ${candidate.surname || ''}`.trim(),
    party: candidate.partyBallotName || 'Independent',
    email: candidate.email && candidate.email.trim() ? candidate.email.trim() : "contact@example.com",
    policies: [],
    chamber: "house" as ChamberType,
    division: candidate.electorate,
  }));
};

const formatSenateCandidates = (candidates: any[]) => {
  return candidates.map((candidate) => ({
    id: generateUniqueId('senate', candidate),
    name: `${candidate.ballotGivenName || ''} ${candidate.surname || ''}`.trim(),
    party: candidate.partyBallotName || 'Independent',
    email: candidate.email && candidate.email.trim() ? candidate.email.trim() : "contact@example.com",
    policies: [],
    chamber: "senate" as ChamberType,
    state: candidate.state,
  }));
};

export const formatCandidateData = (
  houseData: any[],
  senateData: any[],
  chamberType: ChamberType | null,
  primaryMapping: any
) => {
  return {
    id: primaryMapping.postcode.toString(),
    name: primaryMapping.electorate,
    state: primaryMapping.state,
    candidates: [
      ...(chamberType !== "senate" ? formatHouseCandidates(houseData) : []),
      ...(chamberType !== "house" ? formatSenateCandidates(senateData) : []),
    ],
  };
};
