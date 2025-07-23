
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHero } from '@/contexts/HeroContext';
import { CheckCircle, Target, TrendingUp, Flame } from 'lucide-react';

const ProgressSummary: React.FC = () => {
  const { stats } = useHero();

  if (!stats) return null;

  const summaryItems = [
    {
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      label: 'Tarefas Concluídas',
      value: stats.completedTasks,
      total: stats.totalTasks
    },
    {
      icon: <Target className="w-5 h-5 text-blue-500" />,
      label: 'Hábitos Ativos',
      value: stats.activeHabits,
      total: stats.totalHabits
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-purple-500" />,
      label: 'Jornadas Concluídas',
      value: stats.completedJourneys,
      total: stats.totalJourneys
    },
    {
      icon: <Flame className="w-5 h-5 text-orange-500" />,
      label: 'Streak Atual',
      value: stats.currentStreak,
      unit: 'dias'
    }
  ];

  return (
    <Card className="mystic-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Resumo de Progresso
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryItems.map((item, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="flex justify-center">
                {item.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {item.value}
                  {item.total && <span className="text-muted-foreground">/{item.total}</span>}
                  {item.unit && <span className="text-sm text-muted-foreground ml-1">{item.unit}</span>}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressSummary;
