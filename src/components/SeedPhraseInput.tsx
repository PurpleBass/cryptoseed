
import React from "react";
import { WordCountSelector } from "@/components/seed-phrase/WordCountSelector";
import { WordInputGrid } from "@/components/seed-phrase/WordInputGrid";
import { ClearButton } from "@/components/seed-phrase/ClearButton";
import { useSeedPhrase } from "@/hooks/use-seed-phrase";

interface SeedPhraseInputProps {
  onSeedPhraseChange: (seedPhrase: string) => void;
}

const SeedPhraseInput: React.FC<SeedPhraseInputProps> = ({ onSeedPhraseChange }) => {
  const {
    wordCount,
    words,
    isCustomCount,
    setWordCount,
    setIsCustomCount,
    handleWordChange,
    handleWordCountChange,
    increaseWordCount,
    decreaseWordCount,
    clearAllWords
  } = useSeedPhrase({ onSeedPhraseChange });

  return (
    <div className="space-y-4 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <WordCountSelector 
          wordCount={wordCount}
          isCustomCount={isCustomCount}
          onWordCountChange={handleWordCountChange}
          onIncrease={increaseWordCount}
          onDecrease={decreaseWordCount}
          setIsCustomCount={setIsCustomCount}
          setWordCount={setWordCount}
        />
        
        <ClearButton onClear={clearAllWords} />
      </div>

      <div className="w-full overflow-hidden">
        <WordInputGrid 
          wordCount={wordCount}
          words={words}
          onWordChange={handleWordChange}
        />
      </div>
    </div>
  );
};

export default SeedPhraseInput;
