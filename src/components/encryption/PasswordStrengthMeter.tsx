import React from "react";

interface PasswordStrengthMeterProps {
  password: string;
  label?: string;
}

function getStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let label = "Very Weak";
  let color = "bg-red-400";
  if (score >= 4) {
    label = "Strong";
    color = "bg-green-500";
  } else if (score === 3) {
    label = "Medium";
    color = "bg-yellow-400";
  } else if (score === 2) {
    label = "Weak";
    color = "bg-orange-400";
  }
  return { score, label, color };
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password, label }) => {
  const { score, label: strengthLabel, color } = getStrength(password);
  return (
    <div className="mt-1">
      <div className="w-full h-2 bg-gray-200 rounded">
        <div
          className={`h-2 rounded transition-all duration-300 ${color}`}
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <div className="text-xs mt-1 text-gray-600">{label || 'Strength:'} <span className={`font-semibold ${color.replace('bg-', 'text-')}`}>{strengthLabel}</span></div>
    </div>
  );
};
