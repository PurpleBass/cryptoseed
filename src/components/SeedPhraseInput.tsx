
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MinusCircle, PlusCircle, ChevronDown } from "lucide-react";

interface SeedPhraseInputProps {
  onSeedPhraseChange: (seedPhrase: string) => void;
}

const SeedPhraseInput: React.FC<SeedPhraseInputProps> = ({ onSeedPhraseChange }) => {
  const [wordCount, setWordCount] = useState(12);
  const [words, setWords] = useState<string[]>(Array(12).fill(""));
  const [isCustomCount, setIsCustomCount] = useState(false);

  // Update word array when count changes
  useEffect(() => {
    const newWords = [...words];
    if (wordCount > words.length) {
      // Add empty words
      for (let i = words.length; i < wordCount; i++) {
        newWords.push("");
      }
    } else if (wordCount < words.length) {
      // Remove extra words
      newWords.splice(wordCount);
    }
    setWords(newWords);
  }, [wordCount]);

  // Update parent component when words change
  useEffect(() => {
    const seedPhrase = words.join(" ").trim();
    onSeedPhraseChange(seedPhrase);
  }, [words, onSeedPhraseChange]);

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
  };

  const handleWordCountChange = (value: string) => {
    if (value === "custom") {
      setIsCustomCount(true);
    } else {
      setIsCustomCount(false);
      setWordCount(parseInt(value));
    }
  };

  const increaseWordCount = () => {
    if (wordCount < 24) {
      setWordCount(wordCount + 1);
    }
  };

  const decreaseWordCount = () => {
    if (wordCount > 3) {
      setWordCount(wordCount - 1);
    }
  };

  const returnToDropdown = () => {
    setIsCustomCount(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="wordCount" className="text-gray-700">Number of Words</Label>
        {isCustomCount ? (
          <div className="flex items-center gap-2">
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={decreaseWordCount}
              disabled={wordCount <= 3}
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{wordCount}</span>
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={increaseWordCount}
              disabled={wordCount >= 24}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
        ) : (
          <Select onValueChange={handleWordCountChange} defaultValue="12">
            <SelectTrigger className="w-[180px]">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {words.map((word, index) => (
          <div key={index} className="flex items-center">
            <span className="mr-2 text-sm text-gray-500 w-6">{index + 1}:</span>
            <Input
              value={word}
              onChange={(e) => handleWordChange(index, e.target.value)}
              placeholder={`Word ${index + 1}`}
              className="satoshi-input placeholder:text-xs placeholder:text-muted-foreground/50"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeedPhraseInput;

