
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StanceType, ToneType } from "../../utils/letterUtils/letterGenerator";

interface MessageOptionsProps {
  stance: StanceType;
  setStance: (value: StanceType) => void;
  letterTone: ToneType;
  setLetterTone: (value: ToneType) => void;
}

const MessageOptions: React.FC<MessageOptionsProps> = ({
  stance,
  setStance,
  letterTone,
  setLetterTone,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block mb-2 font-medium">
          Your stance on this issue
        </label>
        <Select 
          value={stance} 
          onValueChange={(value: StanceType) => setStance(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your stance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="oppose">Oppose</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="concerned">Concerned</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500 mt-1">
          This helps tailor your letter's tone and arguments
        </p>
      </div>
      
      <div>
        <label className="block mb-2 font-medium">
          Letter tone
        </label>
        <Select 
          value={letterTone} 
          onValueChange={(value: ToneType) => setLetterTone(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="formal">Formal</SelectItem>
            <SelectItem value="passionate">Passionate</SelectItem>
            <SelectItem value="direct">Direct</SelectItem>
            <SelectItem value="hopeful">Hopeful</SelectItem>
            <SelectItem value="empathetic">Empathetic</SelectItem>
            <SelectItem value="optimistic">Optimistic</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500 mt-1">
          Choose the tone for your letters - each will be uniquely written
        </p>
      </div>
    </div>
  );
};

export default MessageOptions;
