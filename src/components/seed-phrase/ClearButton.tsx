
import React from "react";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";

interface ClearButtonProps {
  onClear: () => void;
}

export const ClearButton: React.FC<ClearButtonProps> = ({ onClear }) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClear}
      className="text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-700"
    >
      <Eraser className="h-3.5 w-3.5 mr-1.5" />
      <span>Clear Seed Phrase</span>
    </Button>
  );
};
