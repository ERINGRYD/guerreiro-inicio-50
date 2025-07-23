import React, { useState } from 'react';
import { format, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Timer,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SubHabitManager } from './SubHabitManager';
import { 
  Habit, 
  HabitCompletion, 
  HABIT_DIFFICULTY_LABELS,
  HABIT_CLASSIFICATION_LABELS 
} from '@/types/habit';

interface HabitCardProps {
  habit: Habit;
  onToggleCompletion: (habitId: string, completion: Omit<HabitCompletion, 'date'>) => void;
  onUpdateValue: (habitId: string, value: number, notes?: string) => void;
  onUpdateSubHabit?: (habitId: string, subHabitId: string, completed: boolean) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  onToggleCompletion,
  onUpdateValue,
  onUpdateSubHabit
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Get today's completion
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayCompletion = habit.completions.find(c => c.date === today);
  const isCompletedToday = todayCompletion?.completed || false;

  // Calculate weekly progress for display
  const weeklyCompletions = habit.completions.filter(c => {
    const completionDate = parseISO(c.date);
    const daysDiff = Math.abs(new Date().getTime() - completionDate.getTime()) / (1000 * 3600 * 24);
    return daysDiff <= 7 && c.completed;
  }).length;

  const expectedWeeklyCompletions = habit.frequency === 'daily' ? 7 : 
    habit.frequency === 'weekly' ? 1 :
    habit.customFrequency?.timesPerWeek || 1;

  const weeklyProgress = Math.min((weeklyCompletions / expectedWeeklyCompletions) * 100, 100);

  const handleToggleCompletion = () => {
    if (habit.quantification && !isCompletedToday) {
      // If has quantification and not completed, show input first
      return;
    }

    onToggleCompletion(habit.id, {
      completed: !isCompletedToday,
      value: currentValue || undefined,
      notes: notes || undefined
    });

    // Reset inputs
    setCurrentValue(0);
    setNotes('');
  };

  const handleSubmitWithValue = () => {
    onToggleCompletion(habit.id, {
      completed: true,
      value: currentValue,
      notes: notes || undefined
    });

    setCurrentValue(0);
    setNotes('');
  };

  // Timer functions
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const startTimer = () => setIsTimerRunning(true);
  const pauseTimer = () => setIsTimerRunning(false);
  const stopTimer = () => {
    setIsTimerRunning(false);
    if (habit.quantification?.type === 'time') {
      setCurrentValue(Math.floor(timerSeconds / 60)); // Convert to minutes
    }
    setTimerSeconds(0);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hrs > 0 ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` :
           `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'very-hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      isCompletedToday ? 'ring-2 ring-green-500/20 bg-green-50/50 dark:bg-green-950/20' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-1">
              {habit.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {habit.description}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Badge className={getDifficultyColor(habit.difficulty)}>
              {HABIT_DIFFICULTY_LABELS[habit.difficulty]}
            </Badge>
            <Badge variant={habit.classification === 'positive' ? 'default' : 'secondary'}>
              {HABIT_CLASSIFICATION_LABELS[habit.classification]}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso Semanal</span>
            <span>{weeklyCompletions}/{expectedWeeklyCompletions}</span>
          </div>
          <Progress value={weeklyProgress} className="h-2" />
        </div>

        {/* Streak Display */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span>Streak Atual: <strong>{habit.streak.current}</strong></span>
          </div>
          <div className="text-muted-foreground">
            Melhor: {habit.streak.best}
          </div>
        </div>

        {/* Timer (for time-based habits) */}
        {habit.quantification?.type === 'time' && (
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  <span className="font-mono text-lg">{formatTime(timerSeconds)}</span>
                </div>
                <div className="flex gap-2">
                  {!isTimerRunning ? (
                    <Button size="sm" variant="outline" onClick={startTimer}>
                      <Play className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={pauseTimer}>
                      <Pause className="w-4 h-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={stopTimer}>
                    <Square className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quantification Input */}
        {habit.quantification && !isCompletedToday && (
          <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">
                Meta: {habit.quantification.target} {habit.quantification.unit}
              </span>
            </div>
            
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.1"
                placeholder="Valor"
                value={currentValue || ''}
                onChange={(e) => setCurrentValue(parseFloat(e.target.value) || 0)}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground self-center">
                {habit.quantification.unit}
              </span>
            </div>

            <Textarea
              placeholder="Notas (opcional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[60px]"
            />

            <Button 
              onClick={handleSubmitWithValue}
              className="w-full"
              disabled={!currentValue}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Concluir com Valor
            </Button>
          </div>
        )}

        {/* Completion Button */}
        <div className="flex gap-2">
          <Button
            onClick={handleToggleCompletion}
            variant={isCompletedToday ? "outline" : "default"}
            className="flex-1"
            disabled={habit.quantification && !isCompletedToday && !currentValue}
          >
            {isCompletedToday ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                Concluído
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 mr-2" />
                Marcar como Concluído
              </>
            )}
          </Button>

          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Detalhes do Hábito</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Psicologia</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Gatilho:</strong> {habit.psychology.trigger}</p>
                    <p><strong>Recompensa:</strong> {habit.psychology.reward}</p>
                    <p><strong>Objetivo:</strong> {habit.psychology.objective}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Estatísticas</h4>
                  <div className="space-y-2 text-sm">
                    <p>Taxa de Sucesso: {habit.stats.successRate.toFixed(1)}%</p>
                    <p>Total de Conclusões: {habit.stats.totalCompletions}</p>
                    <p>Consistência: {habit.stats.consistency.toFixed(1)}%</p>
                    {habit.quantification && (
                      <p>Tempo Total: {Math.floor(habit.stats.totalTimeInvested / 60)}h {habit.stats.totalTimeInvested % 60}m</p>
                    )}
                  </div>
                </div>

                {habit.subHabits.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Sub-hábitos</h4>
                    <div className="space-y-1">
                      {habit.subHabits.map((subHabit) => (
                        <div key={subHabit.id} className="flex items-center gap-2 text-sm">
                          {subHabit.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span>{subHabit.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sub-habits */}
        {habit.subHabits.length > 0 && (
          <SubHabitManager
            subHabits={habit.subHabits}
            onToggleSubHabit={(subHabitId, completed) => 
              onUpdateSubHabit?.(habit.id, subHabitId, completed)
            }
            collapsed={true}
          />
        )}

        {/* Today's completion info */}
        {todayCompletion && todayCompletion.completed && (
          <div className="text-xs text-muted-foreground p-2 bg-green-50 dark:bg-green-950/20 rounded">
            <div className="flex items-center justify-between">
              <span>✓ Concluído hoje</span>
              <span>+{habit.xpPerCompletion} XP</span>
            </div>
            {todayCompletion.value && (
              <div>Valor: {todayCompletion.value} {habit.quantification?.unit}</div>
            )}
            {todayCompletion.notes && (
              <div className="mt-1 italic">"{todayCompletion.notes}"</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};