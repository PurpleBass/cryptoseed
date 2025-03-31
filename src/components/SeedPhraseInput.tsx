
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MinusCircle, PlusCircle } from "lucide-react";

interface SeedPhraseInputProps {
  onSeedPhraseChange: (seedPhrase: string) => void;
}

const SeedPhraseInput: React.FC<SeedPhraseInputProps> = ({ onSeedPhraseChange }) => {
  const [wordCount, setWordCount] = useState(12);
  const [words, setWords] = useState<string[]>(Array(12).fill(""));

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="wordCount" className="text-gray-700">Number of Words</Label>
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {words.map((word, index) => (
          <div key={index} className="flex items-center">
            <span className="mr-2 text-sm text-gray-500 w-6">{index + 1}:</span>
            <Input
              value={word}
              onChange={(e) => handleWordChange(index, e.target.value)}
              placeholder={`Word ${index + 1}`}
              className="satoshi-input"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeedPhraseInput;
