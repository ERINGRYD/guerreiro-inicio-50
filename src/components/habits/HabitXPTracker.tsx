import React from 'react';
import { Star, Zap, Trophy, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Habit } from '@/types/habit';

interface HabitXPTrackerProps {
  habits: Habit[];
  className?: string;
}

export const HabitXPTracker: React.FC<HabitXPTrackerProps> = ({ 
  habits, 
  className 
}) => {
  const calculateXPStats = () => {
    const totalXP = habits.reduce((total, habit) => {
      const completions = habit.completions.filter(c => c.completed).length;
      return total + (completions * habit.xpPerCompletion);
    }, 0);

    const todayXP = habits.reduce((total, habit) => {
      const today = new Date().toISOString().split('T')[0];
      const todayCompletion = habit.completions.find(c => c.date === today && c.completed);
      return total + (todayCompletion ? habit.xpPerCompletion : 0);
    }, 0);

    const weeklyXP = habits.reduce((total, habit) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyCompletions = habit.completions.filter(c => {
        const completionDate = new Date(c.date);
        return c.completed && completionDate >= weekAgo;
      }).length;
      return total + (weeklyCompletions * habit.xpPerCompletion);
    }, 0);

    // Calculate streak bonuses
    const streakBonus = habits.reduce((total, habit) => {
      const streakWeeks = Math.floor(habit.streak.current / 7);
      return total + (streakWeeks * 10); // 10 XP bonus per week of streak
    }, 0);

    return {
      totalXP: totalXP + streakBonus,
      todayXP,
      weeklyXP,
      streakBonus,
      baseXP: totalXP
    };
  };

  const getLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1;
  };

  const getXPForNextLevel = (xp: number) => {
    const currentLevel = getLevel(xp);
    const xpForNextLevel = currentLevel * 100;
    const currentLevelXP = xp % 100;
    return {
      current: currentLevelXP,
      needed: 100 - currentLevelXP,
      total: xpForNextLevel
    };
  };

  const stats = calculateXPStats();
  const level = getLevel(stats.totalXP);
  const nextLevel = getXPForNextLevel(stats.totalXP);

  const achievements = [
    { name: 'Primeiro Passo', threshold: 10, icon: Star },
    { name: 'Dedicado', threshold: 100, icon: Zap },
    { name: 'Experiente', threshold: 500, icon: TrendingUp },
    { name: 'Mestre', threshold: 1000, icon: Trophy },
  ];

  const unlockedAchievements = achievements.filter(a => stats.totalXP >= a.threshold);
  const nextAchievement = achievements.find(a => stats.totalXP < a.threshold);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Sistema de XP
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Level Progress */}
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-1">
            Nível {level}
          </div>
          <div className="text-sm text-muted-foreground mb-3">
            {stats.totalXP} XP total
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso para Nível {level + 1}</span>
              <span>{nextLevel.current}/100 XP</span>
            </div>
            <Progress value={(nextLevel.current / 100) * 100} className="h-3" />
            <div className="text-xs text-muted-foreground">
              Faltam {nextLevel.needed} XP para o próximo nível
            </div>
          </div>
        </div>

        {/* XP Breakdown */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-lg font-bold text-green-600">
              +{stats.todayXP}
            </div>
            <div className="text-xs text-muted-foreground">
              Hoje
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-lg font-bold text-blue-600">
              +{stats.weeklyXP}
            </div>
            <div className="text-xs text-muted-foreground">
              Esta Semana
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-lg font-bold text-orange-600">
              +{stats.streakBonus}
            </div>
            <div className="text-xs text-muted-foreground">
              Bônus Streak
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Conquistas</h4>
          
          <div className="grid grid-cols-2 gap-2">
            {achievements.map((achievement) => {
              const isUnlocked = stats.totalXP >= achievement.threshold;
              const Icon = achievement.icon;
              
              return (
                <div
                  key={achievement.name}
                  className={`p-2 rounded-lg border text-center ${
                    isUnlocked 
                      ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800' 
                      : 'bg-muted/50 border-muted'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-1 ${
                    isUnlocked ? 'text-yellow-500' : 'text-muted-foreground'
                  }`} />
                  <div className={`text-xs font-medium ${
                    isUnlocked ? 'text-yellow-700 dark:text-yellow-300' : 'text-muted-foreground'
                  }`}>
                    {achievement.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {achievement.threshold} XP
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Achievement */}
          {nextAchievement && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Próxima Conquista: {nextAchievement.name}
                </span>
                <Badge variant="outline">
                  {nextAchievement.threshold - stats.totalXP} XP restantes
                </Badge>
              </div>
              <Progress 
                value={(stats.totalXP / nextAchievement.threshold) * 100} 
                className="h-2" 
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};