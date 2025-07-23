
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useHero } from '@/contexts/HeroContext';
import { XP_SYSTEM } from '@/types/hero';
import { 
  Trophy, 
  Target, 
  Calendar, 
  Flame, 
  TrendingUp, 
  Clock,
  Star,
  Award
} from 'lucide-react';

const AdvancedStats: React.FC = () => {
  const { profile, stats } = useHero();

  if (!profile || !stats) return null;

  const xpProgress = XP_SYSTEM.calculateXpProgress(profile.totalXp);
  const completionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;
  const journeyCompletionRate = stats.totalJourneys > 0 ? (stats.completedJourneys / stats.totalJourneys) * 100 : 0;

  const statsData = [
    {
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      label: 'XP Total',
      value: profile.totalXp.toLocaleString(),
      subtitle: `Nível ${profile.level}`,
      progress: xpProgress.percentage
    },
    {
      icon: <Target className="w-5 h-5 text-blue-500" />,
      label: 'Taxa de Conclusão',
      value: `${completionRate.toFixed(1)}%`,
      subtitle: `${stats.completedTasks}/${stats.totalTasks} tarefas`,
      progress: completionRate
    },
    {
      icon: <Trophy className="w-5 h-5 text-purple-500" />,
      label: 'Jornadas',
      value: `${journeyCompletionRate.toFixed(1)}%`,
      subtitle: `${stats.completedJourneys}/${stats.totalJourneys} concluídas`,
      progress: journeyCompletionRate
    },
    {
      icon: <Flame className="w-5 h-5 text-orange-500" />,
      label: 'Streak Atual',
      value: stats.currentStreak.toString(),
      subtitle: 'dias consecutivos',
      progress: Math.min((stats.currentStreak / 30) * 100, 100)
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Estatísticas Avançadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {statsData.map((stat, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {stat.icon}
                    <span className="font-medium">{stat.label}</span>
                  </div>
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <Progress value={stat.progress} className="h-2" />
                <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{new Date(profile.createdAt).toLocaleDateString()}</p>
              <p className="text-sm text-muted-foreground">Data de Criação</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">
                {Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
              </p>
              <p className="text-sm text-muted-foreground">Dias como Herói</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{stats.longestStreak}</p>
              <p className="text-sm text-muted-foreground">Maior Streak</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedStats;
