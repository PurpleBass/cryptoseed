
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eraser, Eye, EyeOff } from "lucide-react";

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
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="password" className="text-gray-700">Password</Label>
        <Button onClick={onClearPassword} variant="outline" size="sm" className="text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-700">
          <Eraser className="h-3.5 w-3.5 mr-1.5" />
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
          className="satoshi-input pr-10 placeholder:text-xs placeholder:text-muted-foreground/50"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onTogglePassword}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
        >
          {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};
