import React from 'react';
import { format, subDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart3, TrendingUp, Target, Clock, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Habit } from '@/types/habit';

interface HabitStatsProps {
  habits: Habit[];
}

export const HabitStats: React.FC<HabitStatsProps> = ({ habits }) => {
  // Calculate overall statistics
  const calculateOverallStats = () => {
    const totalHabits = habits.length;
    if (totalHabits === 0) return null;

    const totalCompletions = habits.reduce((sum, habit) => 
      sum + habit.stats.totalCompletions, 0
    );

    const averageSuccessRate = habits.reduce((sum, habit) => 
      sum + habit.stats.successRate, 0
    ) / totalHabits;

    const totalTimeInvested = habits.reduce((sum, habit) => 
      sum + habit.stats.totalTimeInvested, 0
    );

    const bestStreak = Math.max(...habits.map(habit => habit.streak.best), 0);

    const averageConsistency = habits.reduce((sum, habit) => 
      sum + habit.stats.consistency, 0
    ) / totalHabits;

    return {
      totalHabits,
      totalCompletions,
      averageSuccessRate,
      totalTimeInvested,
      bestStreak,
      averageConsistency
    };
  };

  // Calculate weekly progress
  const calculateWeeklyProgress = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => 
      format(subDays(new Date(), i), 'yyyy-MM-dd')
    ).reverse();

    return last7Days.map(date => {
      const completions = habits.reduce((count, habit) => {
        const completion = habit.completions.find(c => c.date === date && c.completed);
        return count + (completion ? 1 : 0);
      }, 0);

      return {
        date,
        completions,
        total: habits.length,
        percentage: habits.length > 0 ? (completions / habits.length) * 100 : 0
      };
    });
  };

  // Get habit performance ranking
  const getHabitRanking = () => {
    return habits
      .map(habit => ({
        name: habit.name,
        successRate: habit.stats.successRate,
        streak: habit.streak.current,
        totalCompletions: habit.stats.totalCompletions,
        consistency: habit.stats.consistency
      }))
      .sort((a, b) => b.successRate - a.successRate);
  };

  // Calculate category breakdown
  const getCategoryBreakdown = () => {
    const categories = {
      positive: habits.filter(h => h.classification === 'positive').length,
      negative: habits.filter(h => h.classification === 'negative').length
    };

    const difficulties = {
      easy: habits.filter(h => h.difficulty === 'easy').length,
      medium: habits.filter(h => h.difficulty === 'medium').length,
      hard: habits.filter(h => h.difficulty === 'hard').length,
      'very-hard': habits.filter(h => h.difficulty === 'very-hard').length
    };

    return { categories, difficulties };
  };

  const overallStats = calculateOverallStats();
  const weeklyProgress = calculateWeeklyProgress();
  const habitRanking = getHabitRanking();
  const { categories, difficulties } = getCategoryBreakdown();

  if (!overallStats) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sem dados para análise</h3>
            <p className="text-muted-foreground">
              Crie alguns hábitos e comece a completá-los para ver as estatísticas
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taxa de Sucesso Média
                </p>
                <p className="text-2xl font-bold">
                  {overallStats.averageSuccessRate.toFixed(1)}%
                </p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Conclusões
                </p>
                <p className="text-2xl font-bold">
                  {overallStats.totalCompletions}
                </p>
              </div>
              <Award className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Melhor Streak
                </p>
                <p className="text-2xl font-bold">
                  {overallStats.bestStreak} dias
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tempo Total
                </p>
                <p className="text-2xl font-bold">
                  {Math.floor(overallStats.totalTimeInvested / 60)}h
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Progresso dos Últimos 7 Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyProgress.map((day, index) => (
                <div key={day.date} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {format(parseISO(day.date), 'EEE, dd/MM', { locale: ptBR })}
                    </span>
                    <span>
                      {day.completions}/{day.total} ({day.percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <Progress value={day.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Habit Performance Ranking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Ranking de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {habitRanking.slice(0, 5).map((habit, index) => (
                <div key={habit.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{habit.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {habit.totalCompletions} conclusões
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">
                      {habit.successRate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {habit.streak} dias
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Classificação</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Positivos</span>
                  <Badge variant="default">{categories.positive}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Negativos</span>
                  <Badge variant="secondary">{categories.negative}</Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Dificuldade</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Fácil</span>
                  <Badge className="bg-green-100 text-green-800">{difficulties.easy}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Médio</span>
                  <Badge className="bg-yellow-100 text-yellow-800">{difficulties.medium}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Difícil</span>
                  <Badge className="bg-orange-100 text-orange-800">{difficulties.hard}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Muito Difícil</span>
                  <Badge className="bg-red-100 text-red-800">{difficulties['very-hard']}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consistency Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Análise de Consistência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {overallStats.averageConsistency.toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Consistência Média
                </p>
              </div>

              <div className="space-y-3">
                {habits.map(habit => (
                  <div key={habit.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="truncate">{habit.name}</span>
                      <span>{habit.stats.consistency.toFixed(1)}%</span>
                    </div>
                    <Progress value={habit.stats.consistency} className="h-1" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};