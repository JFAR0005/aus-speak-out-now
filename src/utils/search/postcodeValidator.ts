
export const isValidPostcode = (input: string): boolean => {
  return /^\d{3,4}$/.test(input);
};

export const validatePostcodeInput = (input: string): string | null => {
  if (!input.trim()) {
    return "Please enter a postcode to search";
  }
  
  if (!isValidPostcode(input.trim())) {
    return "Please enter a valid 3 or 4-digit postcode";
  }
  
  return null;
};
