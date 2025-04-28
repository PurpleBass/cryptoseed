import { useState, useEffect } from "react";

interface UseSeedPhraseProps {
  initialWordCount?: number;
  onSeedPhraseChange: (seedPhrase: string) => void;
}

export function useSeedPhrase({ initialWordCount = 12, onSeedPhraseChange }: UseSeedPhraseProps) {
  const [wordCount, setWordCount] = useState(initialWordCount);
  const [words, setWords] = useState<string[]>(Array(initialWordCount).fill(""));
  const [isCustomCount, setIsCustomCount] = useState(false);

  // Adjust words array when word count changes
  useEffect(() => {
    const newWords = [...words];
    if (wordCount > words.length) {
      for (let i = words.length; i < wordCount; i++) {
        newWords.push("");
      }
    } else if (wordCount < words.length) {
      newWords.splice(wordCount);
    }
    setWords(newWords);
  }, [wordCount, words.length]);

  // Call the callback when words change
  useEffect(() => {
    const seedPhrase = words.join(" ").trim();
    onSeedPhraseChange(seedPhrase);
  }, [words, onSeedPhraseChange]);

  // Change a specific word
  const handleWordChange = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
  };

  // Handle word count change from dropdown
  const handleWordCountChange = (value: string) => {
    if (value === "custom") {
      setIsCustomCount(true);
    } else {
      setIsCustomCount(false);
      setWordCount(parseInt(value));
    }
  };

  // Increment word count (for custom mode)
  const increaseWordCount = () => {
    setWordCount(wordCount + 1);
  };

  // Decrement word count (for custom mode)
  const decreaseWordCount = () => {
    if (wordCount > 3) {
      setWordCount(wordCount - 1);
    }
  };

  // Clear all words
  const clearAllWords = () => {
    const emptyWords = Array(wordCount).fill("");
    setWords(emptyWords);
  };

  return {
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
  };
}
