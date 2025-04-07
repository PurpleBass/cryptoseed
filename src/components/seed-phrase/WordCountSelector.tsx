import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle, ChevronDown } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface WordCountSelectorProps {
  wordCount: number;
  isCustomCount: boolean;
  onWordCountChange: (value: string) => void;
  onIncrease: () => void;
  onDecrease: () => void;
  setIsCustomCount: (value: boolean) => void;
  setWordCount: (count: number) => void;
}

export const WordCountSelector: React.FC<WordCountSelectorProps> = ({
  wordCount,
  isCustomCount,
  onWordCountChange,
  onIncrease,
  onDecrease,
  setIsCustomCount,
  setWordCount
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <Label htmlFor="wordCount" className="text-gray-700 whitespace-nowrap">Number of Words</Label>
      {isCustomCount ? (
        <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={onDecrease}
              disabled={wordCount <= 3}
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{wordCount}</span>
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={onIncrease}
              disabled={wordCount >= 24}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2 w-auto">
                  <span className="mr-1">Length</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => {
                  setIsCustomCount(false); 
                  setWordCount(12);
                }}>
                  12 words
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setIsCustomCount(false);
                  setWordCount(15);
                }}>
                  15 words
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setIsCustomCount(false);
                  setWordCount(18);
                }}>
                  18 words
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setIsCustomCount(false);
                  setWordCount(21);
                }}>
                  21 words
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setIsCustomCount(false);
                  setWordCount(24);
                }}>
                  24 words
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setIsCustomCount(true);
                }}>
                  Custom
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ) : (
        <Select onValueChange={onWordCountChange} defaultValue="12">
          <SelectTrigger className="w-[180px] ml-2">
            <SelectValue placeholder="Select length" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">12 words</SelectItem>
            <SelectItem value="15">15 words</SelectItem>
            <SelectItem value="18">18 words</SelectItem>
            <SelectItem value="21">21 words</SelectItem>
            <SelectItem value="24">24 words</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
