import React from 'react';
import { TrendingUp, Flame, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Habit } from '@/types/habit';

interface HabitStreakDisplayProps {
  habit: Habit;
  className?: string;
}

export const HabitStreakDisplay: React.FC<HabitStreakDisplayProps> = ({ 
  habit, 
  className 
}) => {
  const getStreakColor = (current: number, best: number) => {
    if (current === 0) return 'text-muted-foreground';
    if (current === best) return 'text-orange-500';
    if (current >= best * 0.8) return 'text-yellow-500';
    return 'text-blue-500';
  };

  const getStreakIcon = (current: number) => {
    if (current === 0) return Target;
    if (current >= 7) return Flame;
    return TrendingUp;
  };

  const StreakIcon = getStreakIcon(habit.streak.current);
  const streakColor = getStreakColor(habit.streak.current, habit.streak.best);

  return (
    <Card className={className}>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StreakIcon className={`w-6 h-6 ${streakColor}`} />
            <div>
              <div className="text-2xl font-bold">
                {habit.streak.current}
              </div>
              <div className="text-xs text-muted-foreground">
                dias consecutivos
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <Badge variant="secondary" className="mb-1">
              Melhor: {habit.streak.best}
            </Badge>
            <div className="text-xs text-muted-foreground">
              {habit.streak.lastCompletionDate ? (
                `Último: ${new Date(habit.streak.lastCompletionDate).toLocaleDateString()}`
              ) : (
                'Nenhuma conclusão'
              )}
            </div>
          </div>
        </div>
        
        {/* Streak milestone badges */}
        <div className="mt-3 flex gap-1">
          {[7, 14, 30, 60, 100].map(milestone => (
            <div
              key={milestone}
              className={`w-2 h-2 rounded-full ${
                habit.streak.best >= milestone 
                  ? 'bg-primary' 
                  : 'bg-muted'
              }`}
              title={`${milestone} dias${habit.streak.best >= milestone ? ' ✓' : ''}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};