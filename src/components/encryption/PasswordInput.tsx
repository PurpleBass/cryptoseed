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
    <div className="password-input-container">
      <div className="password-header">
        <Label htmlFor="password" className="password-label-modern flex items-center gap-2">
          <KeyRound className="h-4 w-4" />
          Password
        </Label>
        <Button 
          onClick={onClearPassword} 
          variant="outline" 
          size="sm" 
          className="password-clear-button-modern"
        >
          <Eraser className="h-4 w-4 mr-2" />
          <span>Clear</span>
        </Button>
      </div>
      <div className="password-input-wrapper">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Enter a strong password"
          className="password-input-modern"
          style={{ paddingRight: '60px' }} // Extra space to avoid overlap with browser suggestions
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onTogglePassword}
          className="password-toggle-modern"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
      </div>
      <PasswordStrengthMeter password={password} />
    </div>
  );
};
