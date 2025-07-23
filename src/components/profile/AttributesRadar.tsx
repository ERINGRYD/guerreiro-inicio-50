
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAttributeSystem } from '@/hooks/useAttributeSystem';
import { AttributeUtils } from '@/types/attribute';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Target } from 'lucide-react';

const AttributesRadar: React.FC = () => {
  const { attributes, loading } = useAttributeSystem();

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando atributos...</p>
      </div>
    );
  }

  if (attributes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Atributos do Herói
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Nenhum atributo encontrado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare radar chart data
  const radarData = attributes.map(attr => ({
    attribute: attr.name,
    value: (attr.level / attr.maxLevel) * 100,
    fullMark: 100
  }));

  const chartConfig = {
    value: {
      label: "Nível",
      color: "hsl(var(--primary))",
    },
  };

  // Group attributes by area for display
  const attributesByArea = {
    'Bem-Estar': AttributeUtils.getAttributesByArea(attributes, 'Bem-Estar'),
    'Business': AttributeUtils.getAttributesByArea(attributes, 'Business'),
    'Maestria': AttributeUtils.getAttributesByArea(attributes, 'Maestria')
  };

  const getAreaColor = (area: string) => {
    switch (area) {
      case 'Bem-Estar': return '#10b981'; // emerald-500
      case 'Business': return '#3b82f6'; // blue-500
      case 'Maestria': return '#8b5cf6'; // purple-500
      default: return '#6b7280'; // gray-500
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Atributos do Herói
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div className="h-80">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <PolarGrid gridType="polygon" />
                    <PolarAngleAxis 
                      dataKey="attribute" 
                      tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                    />
                    <PolarRadiusAxis 
                      domain={[0, 100]} 
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      tickCount={5}
                    />
                    <Radar
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            
            {/* Attributes List by Area */}
            <div className="space-y-4">
              {Object.entries(attributesByArea).map(([areaName, areaAttributes]) => (
                <div key={areaName} className="space-y-2">
                  <h4 className="font-medium text-sm" style={{ color: getAreaColor(areaName) }}>
                    {areaName}
                  </h4>
                  <div className="space-y-2">
                    {areaAttributes.map((attr) => {
                      const progress = AttributeUtils.calculateProgress(attr.currentXp, attr.xpPerLevel);
                      return (
                        <div key={attr.id} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{attr.icon}</span>
                              <span className="font-medium text-sm">{attr.name}</span>
                            </div>
                            <span className="text-sm font-bold">Nv.{attr.level}</span>
                          </div>
                          <Progress 
                            value={progress.percentage} 
                            className="h-2" 
                          />
                          <p className="text-xs text-muted-foreground">
                            {progress.current}/{progress.needed} XP
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttributesRadar;
