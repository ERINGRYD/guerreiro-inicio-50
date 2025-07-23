import React, { useState } from 'react';
import { Check, CheckCircle2, Circle, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SubHabit } from '@/types/habit';

interface SubHabitManagerProps {
  subHabits: SubHabit[];
  onToggleSubHabit: (subHabitId: string, completed: boolean) => void;
  collapsed?: boolean;
}

export const SubHabitManager: React.FC<SubHabitManagerProps> = ({
  subHabits,
  onToggleSubHabit,
  collapsed = false
}) => {
  const [isExpanded, setIsExpanded] = useState(!collapsed);

  if (subHabits.length === 0) {
    return null;
  }

  const completedCount = subHabits.filter(sub => sub.completed).length;
  const totalCount = subHabits.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const sortedSubHabits = [...subHabits].sort((a, b) => a.order - b.order);

  return (
    <Card className="bg-muted/30">
      <CardHeader 
        className="pb-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            Sub-hábitos
            <Badge variant="secondary" className="ml-2">
              {completedCount}/{totalCount}
            </Badge>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">
              {progress.toFixed(0)}%
            </div>
            {progress === 100 && (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            )}
          </div>
        </div>
        
        <Progress value={progress} className="h-1 mt-2" />
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-2">
          {sortedSubHabits.map((subHabit) => (
            <div
              key={subHabit.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                subHabit.completed 
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                  : 'bg-background hover:bg-muted/50'
              }`}
            >
              <Button
                size="sm"
                variant="ghost"
                className="p-0 h-auto w-auto"
                onClick={() => onToggleSubHabit(subHabit.id, !subHabit.completed)}
              >
                {subHabit.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </Button>
              
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium ${
                  subHabit.completed ? 'line-through text-muted-foreground' : ''
                }`}>
                  {subHabit.name}
                </h4>
                {subHabit.description && (
                  <p className={`text-xs mt-1 ${
                    subHabit.completed 
                      ? 'line-through text-muted-foreground' 
                      : 'text-muted-foreground'
                  }`}>
                    {subHabit.description}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Progress summary */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span>Progresso Geral:</span>
              <span className="font-medium">
                {completedCount} de {totalCount} concluídos
              </span>
            </div>
            
            {progress === 100 && (
              <div className="mt-2 flex items-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Todos os sub-hábitos concluídos!
                </span>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};