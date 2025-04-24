
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface TextInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  example?: {
    title: string;
    content: string;
  };
  required?: boolean;
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  example,
  required = false,
}) => {
  return (
    <div>
      <label className="block mb-2 font-medium">
        {label} {required ? <span className="text-red-500">*</span> : <span className="text-gray-400">(optional)</span>}
      </label>
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[80px]"
      />
      {example && (
        <div className="mt-2 p-3 bg-muted rounded-md text-xs text-muted-foreground">
          <p className="font-medium mb-1">{example.title}</p>
          <p>{example.content}</p>
        </div>
      )}
      <p className="text-xs text-gray-500 mt-1">
        Be specific and clear in your message for better results
      </p>
    </div>
  );
};

export default TextInputField;
