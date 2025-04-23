
import { supabase } from "@/integrations/supabase/client";
import type { PostcodeMapping } from "./types";

export const fetchPostcodeMappings = async (postcode: number): Promise<{
  data: PostcodeMapping[] | null;
  error: any;
}> => {
  const result = await supabase
    .from('postcode_mappings')
    .select('*')
    .eq('postcode', postcode);
    
  return {
    data: result.data as PostcodeMapping[] | null,
    error: result.error
  };
};

