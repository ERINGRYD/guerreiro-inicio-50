
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAttributeSystem } from '@/hooks/useAttributeSystem';
import { AttributeUtils } from '@/types/attribute';
import { 
  Target, 
  TrendingUp, 
  Plus, 
  BarChart3, 
  Trophy,
  Zap,
  Eye
} from 'lucide-react';
import AttributeDetailModal from './AttributeDetailModal';
import AttributeGoalSetter from './AttributeGoalSetter';
import AttributeRecommendations from './AttributeRecommendations';
import CreateAttributeDialog from './CreateAttributeDialog';

const AttributeSystem: React.FC = () => {
  const { 
    attributes, 
    loading, 
    goals, 
    getAttributeStats 
  } = useAttributeSystem();
  
  const [selectedAttributeId, setSelectedAttributeId] = useState<string | null>(null);
  const [showGoalSetter, setShowGoalSetter] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeArea, setActiveArea] = useState<'all' | 'Bem-Estar' | 'Business' | 'Maestria'>('all');

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando atributos...</p>
      </div>
    );
  }

  const stats = getAttributeStats();
  const filteredAttributes = activeArea === 'all' 
    ? attributes 
    : AttributeUtils.getAttributesByArea(attributes, activeArea);

  const getAreaColor = (area: string) => {
    switch (area) {
      case 'Bem-Estar': return 'emerald';
      case 'Business': return 'blue';
      case 'Maestria': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sistema de Atributos</h2>
          <p className="text-muted-foreground">Acompanhe e desenvolva suas habilidades</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Criar Atributo
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">XP Total de Atributos</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttributeXp.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nível Médio</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageLevel}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atributos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttributes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.customAttributes} personalizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Ativas</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Area Filter */}
      <Tabs value={activeArea} onValueChange={(value) => setActiveArea(value as any)}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="Bem-Estar">🌱 Bem-Estar</TabsTrigger>
          <TabsTrigger value="Business">💼 Business</TabsTrigger>
          <TabsTrigger value="Maestria">🎯 Maestria</TabsTrigger>
        </TabsList>

        <TabsContent value={activeArea} className="mt-6">
          {/* Attributes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAttributes.map((attribute) => {
              const progress = AttributeUtils.calculateProgress(attribute.currentXp, attribute.xpPerLevel);
              const goal = goals.find(g => g.attributeId === attribute.id);
              
              return (
                <Card key={attribute.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{attribute.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{attribute.name}</CardTitle>
                            {attribute.isCustom && (
                              <Badge variant="outline" className="text-xs">
                                Personalizado
                              </Badge>
                            )}
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs text-${getAreaColor(attribute.area)}-600`}
                          >
                            {attribute.area}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant="outline" className="font-mono">
                        Nv. {attribute.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{attribute.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{progress.current} XP</span>
                        <span>{progress.needed} XP</span>
                      </div>
                      <Progress value={progress.percentage} className="h-2" />
                      {attribute.level < attribute.maxLevel && (
                        <p className="text-xs text-muted-foreground">
                          {AttributeUtils.calculateXpForNextLevel(attribute.currentXp, attribute.xpPerLevel)} XP para próximo nível
                        </p>
                      )}
                    </div>

                    {/* Goal Indicator */}
                    {goal && (
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Trophy className="w-4 h-4" />
                        <span>Meta: Nível {goal.targetLevel}</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedAttributeId(attribute.id)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Detalhes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowGoalSetter(attribute.id)}
                      >
                        <Target className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recommendations */}
      <AttributeRecommendations />

      {/* Modals */}
      {selectedAttributeId && (
        <AttributeDetailModal
          attributeId={selectedAttributeId}
          onClose={() => setSelectedAttributeId(null)}
        />
      )}

      {showGoalSetter && (
        <AttributeGoalSetter
          attributeId={showGoalSetter}
          onClose={() => setShowGoalSetter(null)}
        />
      )}

      <CreateAttributeDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </div>
  );
};

export default AttributeSystem;
