
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAttributeSystem } from '@/hooks/useAttributeSystem';
import { AttributeUtils } from '@/types/attribute';
import { HERO_AREAS } from '@/types/hero';

interface AttributeSelectorProps {
  area: keyof typeof HERO_AREAS;
  selectedAttributes?: string[];
  onAttributeSelect?: (attributeId: string) => void;
  multiSelect?: boolean;
  showPreview?: boolean;
}

const AttributeSelector: React.FC<AttributeSelectorProps> = ({
  area,
  selectedAttributes = [],
  onAttributeSelect,
  multiSelect = false,
  showPreview = true
}) => {
  const { attributes, loading } = useAttributeSystem();

  if (loading) {
    return <div className="text-sm text-muted-foreground">Carregando atributos...</div>;
  }

  const areaAttributes = AttributeUtils.getAttributesByArea(attributes, area);

  if (areaAttributes.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">
          Nenhum atributo encontrado para {area}
        </p>
      </div>
    );
  }

  const handleAttributeClick = (attributeId: string) => {
    if (!onAttributeSelect) return;
    onAttributeSelect(attributeId);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-medium">Atributos de {area}</h4>
        <Badge variant="outline" className="text-xs">
          {areaAttributes.length} disponíveis
        </Badge>
      </div>

      <div className="grid gap-2">
        {areaAttributes.map((attribute) => {
          const isSelected = selectedAttributes.includes(attribute.id);
          const progress = AttributeUtils.calculateProgress(attribute.currentXp, attribute.xpPerLevel);

          return (
            <Card
              key={attribute.id}
              className={`cursor-pointer transition-all hover:shadow-sm ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => handleAttributeClick(attribute.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{attribute.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{attribute.name}</span>
                        {attribute.isCustom && (
                          <Badge variant="outline" className="text-xs">
                            Personalizado
                          </Badge>
                        )}
                      </div>
                      {showPreview && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {attribute.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">Nv.{attribute.level}</div>
                    {showPreview && (
                      <div className="text-xs text-muted-foreground">
                        {progress.current}/{progress.needed} XP
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedAttributes.length > 0 && (
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-1">
            Atributos selecionados ({selectedAttributes.length}):
          </p>
          <div className="flex flex-wrap gap-1">
            {selectedAttributes.map((attributeId) => {
              const attribute = attributes.find(a => a.id === attributeId);
              if (!attribute) return null;
              
              return (
                <div key={attributeId} className="flex items-center gap-1">
                  <span className="text-xs">{attribute.icon}</span>
                  <span className="text-xs">{attribute.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttributeSelector;
