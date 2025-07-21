import React, { useState, useEffect } from "react";

interface PasswordStrengthMeterProps {
  password: string;
  label?: string;
}

interface StrengthResult {
  score: number; 
  label: string; 
  color: string; 
  feedback: string;
  crackTime: string;
}

// Lazy load zxcvbn only when needed
let zxcvbnPromise: Promise<any> | null = null;

function loadZxcvbn() {
  if (!zxcvbnPromise) {
    zxcvbnPromise = import('zxcvbn').then(module => module.default || module);
  }
  return zxcvbnPromise;
}

function getBasicStrength(password: string): StrengthResult {
  if (!password) {
    return { 
      score: 0, 
      label: "No Password", 
      color: "bg-gray-300", 
      feedback: "Enter a password",
      crackTime: ""
    };
  }

  // Basic fallback scoring while zxcvbn loads
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const strengthMap = {
    0: { label: "Very Weak", color: "bg-red-500" },
    1: { label: "Weak", color: "bg-red-400" },
    2: { label: "Fair", color: "bg-yellow-400" },
    3: { label: "Good", color: "bg-green-400" },
    4: { label: "Strong", color: "bg-green-500" },
    5: { label: "Strong", color: "bg-green-500" }
  };

  const { label, color } = strengthMap[score as keyof typeof strengthMap];
  
  return {
    score: Math.min(score, 4),
    label,
    color,
    feedback: "",
    crackTime: ""
  };
}

async function getStrengthFromZxcvbn(password: string): Promise<StrengthResult> {
  if (!password) {
    return getBasicStrength(password);
  }

  try {
    const zxcvbn = await loadZxcvbn();
    const result = zxcvbn(password);
    
    // zxcvbn returns scores 0-4, we'll map them to labels and colors
    const strengthMap = {
      0: { label: "Very Weak", color: "bg-red-500" },
      1: { label: "Weak", color: "bg-red-400" },
      2: { label: "Fair", color: "bg-yellow-400" },
      3: { label: "Good", color: "bg-green-400" },
      4: { label: "Strong", color: "bg-green-500" }
    };

    const { label, color } = strengthMap[result.score as keyof typeof strengthMap];
    
    // Get the primary feedback message
    const feedback = result.feedback.suggestions.length > 0 
      ? result.feedback.suggestions[0]
      : result.feedback.warning || "";

    // Format crack time for display
    const crackTime = String(result.crack_times_display.offline_slow_hashing_1e4_per_second);

    return {
      score: result.score,
      label,
      color,
      feedback,
      crackTime
    };
  } catch (error) {
    console.warn('Failed to load zxcvbn, falling back to basic strength estimation:', error);
    return getBasicStrength(password);
  }
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password, label }) => {
  const [strength, setStrength] = useState<StrengthResult>(getBasicStrength(password));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!password) {
      setStrength(getBasicStrength(password));
      return;
    }

    // Show basic strength immediately
    setStrength(getBasicStrength(password));
    setIsLoading(true);

    // Then load zxcvbn and update with detailed analysis
    getStrengthFromZxcvbn(password).then(result => {
      setStrength(result);
      setIsLoading(false);
    });
  }, [password]);

  const { score, label: strengthLabel, color, feedback, crackTime } = strength;
  
  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-600">{label || 'Password Strength:'}</span>
          <span className={`text-xs font-semibold ${color.replace('bg-', 'text-')} flex items-center gap-1`}>
            {strengthLabel}
            {isLoading && (
              <div className="w-3 h-3 border border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            )}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${((score + 1) / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Feedback and Crack Time */}
      {password && !isLoading && (
        <div className="space-y-1">
          {crackTime && (
            <div className="text-xs text-gray-500">
              <span className="font-medium">Crack time:</span> {crackTime}
            </div>
          )}
          {feedback && (
            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded border-l-2 border-blue-200">
              💡 {feedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
