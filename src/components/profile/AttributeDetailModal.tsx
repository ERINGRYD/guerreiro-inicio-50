
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAttributeSystem } from '@/hooks/useAttributeSystem';
import { AttributeUtils } from '@/types/attribute';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Calendar, TrendingUp, Zap, Trophy } from 'lucide-react';

interface AttributeDetailModalProps {
  attributeId: string;
  onClose: () => void;
}

const AttributeDetailModal: React.FC<AttributeDetailModalProps> = ({ attributeId, onClose }) => {
  const { attributes, history, goals, getRecommendedJourneys } = useAttributeSystem();
  
  const attribute = attributes.find(attr => attr.id === attributeId);
  const attributeHistory = history.filter(h => h.attributeId === attributeId).slice(0, 10);
  const attributeGoal = goals.find(g => g.attributeId === attributeId);
  const recommendedJourneys = getRecommendedJourneys(attributeId);

  if (!attribute) return null;

  const progress = AttributeUtils.calculateProgress(attribute.currentXp, attribute.xpPerLevel);
  
  // Prepare chart data
  const historyChartData = attributeHistory.reverse().map((entry, index) => ({
    index: index + 1,
    level: entry.levelAfter,
    xp: entry.xpGained,
    date: new Date(entry.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })
  }));

  const chartConfig = {
    level: {
      label: "Nível",
      color: "hsl(var(--primary))",
    },
    xp: {
      label: "XP Ganho",
      color: "hsl(var(--secondary))",
    },
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{attribute.icon}</span>
            {attribute.name}
            <Badge variant="secondary">{attribute.area}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Status Atual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">Nível {attribute.level}</span>
                <Badge variant="outline" className="font-mono">
                  {attribute.currentXp.toLocaleString()} XP
                </Badge>
              </div>

              <p className="text-muted-foreground">{attribute.description}</p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{progress.current} XP</span>
                  <span>{progress.needed} XP</span>
                </div>
                <Progress value={progress.percentage} className="h-3" />
                {attribute.level < attribute.maxLevel && (
                  <p className="text-sm text-muted-foreground">
                    {AttributeUtils.calculateXpForNextLevel(attribute.currentXp, attribute.xpPerLevel)} XP para o próximo nível
                  </p>
                )}
              </div>

              {attributeGoal && (
                <div className="p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="font-medium">Meta Ativa</span>
                  </div>
                  <p className="text-sm">Alcançar nível {attributeGoal.targetLevel}</p>
                  <p className="text-xs text-muted-foreground">
                    Até {new Date(attributeGoal.targetDate).toLocaleDateString('pt-BR')}
                  </p>
                  {attributeGoal.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {attributeGoal.description}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                Evolução Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {historyChartData.length > 0 ? (
                <div className="h-64">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historyChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="level"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum histórico ainda</p>
                    <p className="text-sm">Comece completando tarefas e hábitos!</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Histórico Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {attributeHistory.length > 0 ? (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {attributeHistory.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div>
                        <p className="text-sm font-medium">
                          +{entry.xpGained} XP
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString('pt-BR')} • {entry.source}
                        </p>
                      </div>
                      {entry.levelAfter > entry.levelBefore && (
                        <Badge variant="secondary" className="text-xs">
                          Nível {entry.levelAfter}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma atividade ainda</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Journeys */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Jornadas Recomendadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendedJourneys.length > 0 ? (
                <div className="space-y-2">
                  {recommendedJourneys.map((journey) => (
                    <div key={journey} className="p-2 bg-muted/50 rounded">
                      <p className="text-sm font-medium capitalize">
                        {journey.replace('-', ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Desenvolve este atributo
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma recomendação disponível</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttributeDetailModal;
