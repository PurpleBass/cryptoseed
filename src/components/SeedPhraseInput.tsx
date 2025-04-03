
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
import { MinusCircle, PlusCircle, ChevronDown, Eraser, Wallet } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SeedPhraseInputProps {
  onSeedPhraseChange: (seedPhrase: string) => void;
  onWalletMetadataChange?: (metadata: WalletMetadata) => void;
}

export interface WalletMetadata {
  name: string;
  description: string;
}

const SeedPhraseInput: React.FC<SeedPhraseInputProps> = ({ 
  onSeedPhraseChange, 
  onWalletMetadataChange 
}) => {
  const [wordCount, setWordCount] = useState(12);
  const [words, setWords] = useState<string[]>(Array(12).fill(""));
  const [isCustomCount, setIsCustomCount] = useState(false);
  const [walletMetadata, setWalletMetadata] = useState<WalletMetadata>({
    name: "",
    description: ""
  });

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
  }, [wordCount]);

  useEffect(() => {
    const seedPhrase = words.join(" ").trim();
    onSeedPhraseChange(seedPhrase);
  }, [words, onSeedPhraseChange]);

  useEffect(() => {
    if (onWalletMetadataChange) {
      onWalletMetadataChange(walletMetadata);
    }
  }, [walletMetadata, onWalletMetadataChange]);

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
  };

  const handleWalletMetadataChange = (field: keyof WalletMetadata, value: string) => {
    setWalletMetadata(prev => ({
      ...prev,
      [field]: value
    }));
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

  const clearAllWords = () => {
    const emptyWords = Array(wordCount).fill("");
    setWords(emptyWords);
  };

  const clearWalletMetadata = () => {
    setWalletMetadata({
      name: "",
      description: ""
    });
  };

  return (
    <div className="space-y-4">
      {/* Wallet Metadata Section */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-secure-600" />
            <h3 className="text-sm font-medium text-gray-900">Wallet Reference Info</h3>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearWalletMetadata}
            className="text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-700"
          >
            <Eraser className="h-3.5 w-3.5 mr-1.5" />
            <span>Clear</span>
          </Button>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Add reference information to identify this wallet. This information will not be encrypted.
        </p>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="walletName" className="text-xs text-gray-700">Wallet Name/Alias</Label>
            <Input
              id="walletName"
              value={walletMetadata.name}
              onChange={(e) => handleWalletMetadataChange("name", e.target.value)}
              placeholder="e.g., My ETH Wallet, Hardware Wallet #1"
              className="satoshi-input placeholder:text-xs placeholder:text-muted-foreground/50"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="walletDescription" className="text-xs text-gray-700">Notes/Description (optional)</Label>
            <Input
              id="walletDescription"
              value={walletMetadata.description}
              onChange={(e) => handleWalletMetadataChange("description", e.target.value)}
              placeholder="e.g., Ethereum main wallet, Cold storage"
              className="satoshi-input placeholder:text-xs placeholder:text-muted-foreground/50"
            />
          </div>
        </div>
      </div>

      <Separator className="my-2" />

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

      <div className="grid gap-4">
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearAllWords}
            className="text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-700"
          >
            <Eraser className="h-3.5 w-3.5 mr-1.5" />
            <span>Clear Seed Phrase</span>
          </Button>
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
    </div>
  );
};

export default SeedPhraseInput;
