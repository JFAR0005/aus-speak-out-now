
type ToastFunction = any;

export const handleSearchSuccess = (
  toast: ToastFunction,
  houseCount: number,
  senateCount: number,
  chamberType: "house" | "senate" | null,
  primaryMapping: any
) => {
  const description = getSuccessMessage(houseCount, senateCount, chamberType, primaryMapping);
  
  toast({
    title: "Found your representatives",
    description,
  });
};

export const handleSearchError = (toast: ToastFunction) => {
  toast({
    variant: "destructive",
    title: "Error",
    description: "Failed to fetch candidate data. Please try again.",
  });
};

const getSuccessMessage = (
  houseCount: number,
  senateCount: number,
  chamberType: "house" | "senate" | null,
  primaryMapping: any
) => {
  if (chamberType === "house") {
    return `Found ${houseCount} House candidates for ${primaryMapping.electorate} in ${primaryMapping.state}.`;
  } else if (chamberType === "senate") {
    return `Found ${senateCount} Senate candidates for ${primaryMapping.state}.`;
  } else {
    return `Found ${houseCount} House and ${senateCount} Senate candidates for ${primaryMapping.state}.`;
  }
};

