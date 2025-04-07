
import React from "react";
import { WordInput } from "./WordInput";
import { useBreakpoint } from "@/hooks/use-mobile";

interface WordInputGridProps {
  wordCount: number;
  words: string[];
  onWordChange: (index: number, value: string) => void;
}

export const WordInputGrid: React.FC<WordInputGridProps> = ({ 
  wordCount, 
  words, 
  onWordChange 
}) => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';
  
  // Adjust column layout based on screen size
  const columnsCount = isMobile ? 1 : 3;
  const wordsPerColumn = Math.ceil(wordCount / columnsCount);
  const columns = [];

  for (let col = 0; col < columnsCount; col++) {
    const columnWords = [];
    for (let row = 0; row < wordsPerColumn; row++) {
      const index = col * wordsPerColumn + row;
      if (index < wordCount) {
        columnWords.push(
          <WordInput 
            key={index}
            index={index}
            value={words[index]}
            onChange={onWordChange}
          />
        );
      }
    }
    columns.push(
      <div key={col} className="flex flex-col w-full">
        {columnWords}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full overflow-x-hidden">
      {columns}
    </div>
  );
};
