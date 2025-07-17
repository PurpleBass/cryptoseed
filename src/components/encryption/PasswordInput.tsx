import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eraser, Eye, EyeOff, KeyRound } from "lucide-react";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

interface PasswordInputProps {
  password: string;
  showPassword: boolean;
  onPasswordChange: (password: string) => void;
  onTogglePassword: () => void;
  onClearPassword: () => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  showPassword,
  onPasswordChange,
  onTogglePassword,
  onClearPassword,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
          <KeyRound className="h-4 w-4" />
          Password
        </Label>
        <Button 
          onClick={onClearPassword} 
          variant="outline" 
          size="sm" 
          className="h-8 px-3 text-xs"
        >
          <Eraser className="h-3 w-3 mr-1.5" />
          <span>Clear</span>
        </Button>
      </div>
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Enter a strong password"
          className="pr-12 font-mono text-sm placeholder:text-xs placeholder:text-gray-400"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onTogglePassword}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-gray-100"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
      </div>
      <PasswordStrengthMeter password={password} />
    </div>
  );
};
