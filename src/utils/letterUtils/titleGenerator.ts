
import { Candidate } from "../../types";

export const generateTitle = (candidate: Candidate): string => {
  if (candidate.role === "senator") {
    return "Senator";
  } else if (candidate.role === "mp") {
    return "Hon.";
  }
  return "";
};
