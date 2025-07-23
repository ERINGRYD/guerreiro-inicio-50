import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Habit, HabitCompletion } from '@/types/habit';

interface HabitCalendarProps {
  habit: Habit;
}

export const HabitCalendar: React.FC<HabitCalendarProps> = ({ habit }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const getDayCompletion = (date: Date): HabitCompletion | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return habit.completions.find(c => c.date === dateStr);
  };

  const getDayStatus = (date: Date) => {
    const completion = getDayCompletion(date);
    if (!completion) return 'none';
    return completion.completed ? 'completed' : 'attempted';
  };

  const getDayClasses = (date: Date) => {
    const status = getDayStatus(date);
    const isCurrentMonth = isSameMonth(date, currentMonth);
    const isTodayDate = isToday(date);
    
    let classes = 'w-8 h-8 flex items-center justify-center text-xs rounded-full transition-colors ';
    
    if (!isCurrentMonth) {
      classes += 'text-muted-foreground/50 ';
    } else if (isTodayDate) {
      classes += 'ring-2 ring-primary ';
    }

    switch (status) {
      case 'completed':
        classes += 'bg-green-500 text-white hover:bg-green-600 ';
        break;
      case 'attempted':
        classes += 'bg-yellow-500 text-white hover:bg-yellow-600 ';
        break;
      default:
        classes += isCurrentMonth 
          ? 'hover:bg-muted-foreground/10 ' 
          : '';
    }

    return classes;
  };

  const getCompletionStats = () => {
    const monthCompletions = habit.completions.filter(c => {
      const completionDate = parseISO(c.date);
      return isSameMonth(completionDate, currentMonth) && c.completed;
    });

    const totalDaysInMonth = daysInMonth.length;
    const completedDays = monthCompletions.length;
    const successRate = totalDaysInMonth > 0 ? (completedDays / totalDaysInMonth) * 100 : 0;

    return {
      completed: completedDays,
      total: totalDaysInMonth,
      successRate: Math.round(successRate)
    };
  };

  const stats = getCompletionStats();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Calendário de Conclusões
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </span>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="secondary">
            {stats.completed}/{stats.total} dias
          </Badge>
          <Badge variant={stats.successRate >= 70 ? "default" : "secondary"}>
            {stats.successRate}% sucesso
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Weekday Headers */}
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {daysInMonth.map(date => {
              const completion = getDayCompletion(date);
              return (
                <div key={date.toISOString()} className="flex justify-center p-1">
                  <div 
                    className={getDayClasses(date)}
                    title={
                      completion 
                        ? `${format(date, 'dd/MM')} - ${completion.completed ? 'Concluído' : 'Tentativa'}${completion.value ? ` (${completion.value}${habit.quantification?.unit || ''})` : ''}${completion.notes ? ` - ${completion.notes}` : ''}`
                        : format(date, 'dd/MM')
                    }
                  >
                    {format(date, 'd')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Concluído</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Tentativa</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full border border-muted-foreground"></div>
              <span>Não realizado</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full border-2 border-primary"></div>
              <span>Hoje</span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Atividade Recente</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {habit.completions
                .filter(c => c.completed)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map(completion => (
                  <div key={completion.date} className="flex items-center justify-between text-xs">
                    <span>
                      {format(parseISO(completion.date), 'dd/MM', { locale: ptBR })}
                    </span>
                    <div className="flex items-center gap-2">
                      {completion.value && (
                        <span className="text-muted-foreground">
                          {completion.value}{habit.quantification?.unit}
                        </span>
                      )}
                      <span className="text-green-600">✓</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};