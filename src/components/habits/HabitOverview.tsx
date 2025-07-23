import React from 'react';
import { Target, TrendingUp, Calendar, BarChart3, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Habit } from '@/types/habit';

interface HabitOverviewProps {
  habits: Habit[];
}

export const HabitOverview: React.FC<HabitOverviewProps> = ({ habits }) => {
  const calculateOverallStats = () => {
    if (habits.length === 0) {
      return {
        totalHabits: 0,
        activeStreaks: 0,
        completedToday: 0,
        totalXpEarned: 0,
        averageSuccessRate: 0
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(habit => 
      habit.completions.some(c => c.date === today && c.completed)
    ).length;

    const totalXpEarned = habits.reduce((total, habit) => {
      const completions = habit.completions.filter(c => c.completed).length;
      return total + (completions * habit.xpPerCompletion);
    }, 0);

    const averageSuccessRate = habits.reduce((total, habit) => 
      total + habit.stats.successRate, 0
    ) / habits.length;

    const activeStreaks = habits.filter(habit => habit.streak.current > 0).length;

    return {
      totalHabits: habits.length,
      activeStreaks,
      completedToday,
      totalXpEarned,
      averageSuccessRate: Math.round(averageSuccessRate)
    };
  };

  const stats = calculateOverallStats();

  const statCards = [
    {
      title: 'Total de Hábitos',
      value: stats.totalHabits,
      icon: Target,
      color: 'text-muted-foreground'
    },
    {
      title: 'Concluídos Hoje',
      value: stats.completedToday,
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: 'Streaks Ativos',
      value: stats.activeStreaks,
      icon: TrendingUp,
      color: 'text-orange-600'
    },
    {
      title: 'Taxa de Sucesso',
      value: `${stats.averageSuccessRate}%`,
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      title: 'XP Total',
      value: stats.totalXpEarned,
      icon: Clock,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${
                    stat.title === 'Concluídos Hoje' ? stat.color : ''
                  }`}>
                    {stat.value}
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};