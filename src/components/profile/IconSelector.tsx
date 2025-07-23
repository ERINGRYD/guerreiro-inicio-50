
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
}

const ICON_CATEGORIES = {
  'Bem-Estar': ['🧠', '🛡️', '🧘', '❤️', '🌱', '💚', '🕊️', '🌸', '🌿', '☮️'],
  'Business': ['💎', '💡', '⚔️', '🛡️', '📊', '🎯', '🚀', '💼', '📈', '🏆'],
  'Maestria': ['📚', '🎯', '🔥', '⭐', '🎨', '🎵', '✨', '🌟', '🎭', '📖'],
  'Geral': ['⚡', '🔥', '💪', '🌟', '✨', '🎉', '🏅', '👑', '💫', '🌈']
};

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, onIconSelect }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Geral');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.keys(ICON_CATEGORIES).map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <ScrollArea className="h-32 w-full">
        <div className="grid grid-cols-5 gap-2 p-2">
          {ICON_CATEGORIES[activeCategory as keyof typeof ICON_CATEGORIES].map((icon) => (
            <Button
              key={icon}
              variant={selectedIcon === icon ? "default" : "ghost"}
              className="h-12 w-12 text-2xl p-0"
              onClick={() => onIconSelect(icon)}
            >
              {icon}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {selectedIcon && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Selecionado:</span>
          <Badge variant="outline" className="text-xl px-3 py-1">
            {selectedIcon}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default IconSelector;
