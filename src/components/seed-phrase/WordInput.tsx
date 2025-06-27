
import React from "react";
import { Input } from "@/components/ui/input";

interface WordInputProps {
  index: number;
  value: string;
  onChange: (index: number, value: string) => void;
}

export const WordInput: React.FC<WordInputProps> = ({ index, value, onChange }) => {
  return (
    <div className="flex items-center mb-3 w-full">
      <span className="mr-2 text-sm text-gray-500 w-6 text-right flex-shrink-0">{index + 1}:</span>
      <Input
        value={value}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder={`Word ${index + 1}`}
        className="satoshi-input placeholder:text-sm placeholder:text-gray-400 placeholder:font-helvetica w-full"
      />
    </div>
  );
};
