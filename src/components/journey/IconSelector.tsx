
import React from 'react';
import { Label } from '@/components/ui/label';
import { JOURNEY_ICONS, GRADUATION_ICONS } from '@/data/narrativeTypes';

interface IconSelectorProps {
  value: string;
  onChange: (icon: string) => void;
  graduationMode: boolean;
  label: string;
  error?: string;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  value,
  onChange,
  graduationMode,
  label,
  error
}) => {
  const availableIcons = graduationMode ? GRADUATION_ICONS : JOURNEY_ICONS;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="grid grid-cols-6 gap-2 p-4 border rounded-lg bg-background">
        {availableIcons.map((icon) => (
          <button
            key={icon}
            type="button"
            onClick={() => onChange(icon)}
            className={`
              p-3 text-2xl hover:bg-accent rounded-lg transition-colors border-2
              ${value === icon 
                ? 'border-primary bg-primary/10' 
                : 'border-transparent hover:border-accent-foreground/20'
              }
            `}
          >
            {icon}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};
