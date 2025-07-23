
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAttributeSystem } from '@/hooks/useAttributeSystem';
import { ATTRIBUTE_XP_REWARDS } from '@/types/attribute';
import { Zap, TrendingUp } from 'lucide-react';

interface AttributeXPPreviewProps {
  attributeIds: string[];
  actionType: 'task' | 'habit' | 'stage' | 'journey';
  actionDifficulty?: 'Baixa' | 'Média' | 'Alta' | 'Urgente' | 'Fácil' | 'Médio' | 'Difícil' | 'Muito Difícil';
}

const AttributeXPPreview: React.FC<AttributeXPPreviewProps> = ({
  attributeIds,
  actionType,
  actionDifficulty
}) => {
  const { attributes } = useAttributeSystem();

  if (attributeIds.length === 0) return null;

  const getXPAmount = () => {
    if (actionType === 'task' && actionDifficulty) {
      return ATTRIBUTE_XP_REWARDS.task[actionDifficulty as keyof typeof ATTRIBUTE_XP_REWARDS.task];
    }
    if (actionType === 'habit' && actionDifficulty) {
      return ATTRIBUTE_XP_REWARDS.habit[actionDifficulty as keyof typeof ATTRIBUTE_XP_REWARDS.habit];
    }
    if (actionType === 'stage') {
      return ATTRIBUTE_XP_REWARDS.stage;
    }
    if (actionType === 'journey') {
      return ATTRIBUTE_XP_REWARDS.journey;
    }
    return 0;
  };

  const xpAmount = getXPAmount();
  const xpPerAttribute = Math.floor(xpAmount / attributeIds.length);

  if (xpAmount === 0) return null;

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <Zap className="w-4 h-4 text-primary mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Recompensa de XP</span>
              <Badge variant="secondary" className="text-xs">
                +{xpAmount} XP total
              </Badge>
            </div>
            
            <div className="space-y-1">
              {attributeIds.map((attributeId) => {
                const attribute = attributes.find(a => a.id === attributeId);
                if (!attribute) return null;
                
                return (
                  <div key={attributeId} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <span>{attribute.icon}</span>
                      <span>{attribute.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      <TrendingUp className="w-3 h-3" />
                      <span>+{xpPerAttribute} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              O XP será distribuído automaticamente entre os atributos ao completar esta {actionType === 'task' ? 'tarefa' : 'ação'}.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttributeXPPreview;
