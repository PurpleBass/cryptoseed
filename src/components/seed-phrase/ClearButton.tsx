
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
      className="h-8 px-3 text-xs w-full sm:w-auto"
    >
      <Eraser className="h-3 w-3 mr-1.5" />
      <span>Clear Seed Phrase</span>
    </Button>
  );
};
