
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useHero } from '@/contexts/HeroContext';
import { 
  Trophy, 
  Star, 
  Target, 
  Flame, 
  Crown, 
  Shield,
  Sword,
  Gem,
  Medal,
  Award
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isUnlocked: boolean;
  progress?: number;
  target?: number;
  category: 'tasks' | 'habits' | 'journeys' | 'xp' | 'streak';
}

const AchievementsSection: React.FC = () => {
  const { profile, stats } = useHero();

  if (!profile || !stats) return null;

  const achievements: Achievement[] = [
    {
      id: 'first-task',
      name: 'Primeiro Passo',
      description: 'Complete sua primeira tarefa',
      icon: <Target className="w-6 h-6" />,
      isUnlocked: stats.completedTasks >= 1,
      category: 'tasks'
    },
    {
      id: 'task-master',
      name: 'Mestre das Tarefas',
      description: 'Complete 100 tarefas',
      icon: <Trophy className="w-6 h-6" />,
      isUnlocked: stats.completedTasks >= 100,
      progress: stats.completedTasks,
      target: 100,
      category: 'tasks'
    },
    {
      id: 'level-up',
      name: 'Evoluindo',
      description: 'Alcance o nível 5',
      icon: <Star className="w-6 h-6" />,
      isUnlocked: profile.level >= 5,
      progress: profile.level,
      target: 5,
      category: 'xp'
    },
    {
      id: 'legendary',
      name: 'Lendário',
      description: 'Alcance o nível 20',
      icon: <Crown className="w-6 h-6" />,
      isUnlocked: profile.level >= 20,
      progress: profile.level,
      target: 20,
      category: 'xp'
    },
    {
      id: 'streak-week',
      name: 'Consistente',
      description: 'Mantenha um streak de 7 dias',
      icon: <Flame className="w-6 h-6" />,
      isUnlocked: stats.currentStreak >= 7 || stats.longestStreak >= 7,
      progress: Math.max(stats.currentStreak, stats.longestStreak),
      target: 7,
      category: 'streak'
    },
    {
      id: 'streak-month',
      name: 'Imparável',
      description: 'Mantenha um streak de 30 dias',
      icon: <Shield className="w-6 h-6" />,
      isUnlocked: stats.currentStreak >= 30 || stats.longestStreak >= 30,
      progress: Math.max(stats.currentStreak, stats.longestStreak),
      target: 30,
      category: 'streak'
    },
    {
      id: 'journey-complete',
      name: 'Explorador',
      description: 'Complete sua primeira jornada',
      icon: <Medal className="w-6 h-6" />,
      isUnlocked: stats.completedJourneys >= 1,
      category: 'journeys'
    },
    {
      id: 'habit-builder',
      name: 'Construtor de Hábitos',
      description: 'Crie 10 hábitos ativos',
      icon: <Gem className="w-6 h-6" />,
      isUnlocked: stats.activeHabits >= 10,
      progress: stats.activeHabits,
      target: 10,
      category: 'habits'
    },
    {
      id: 'xp-collector',
      name: 'Coletor de XP',
      description: 'Acumule 10.000 XP',
      icon: <Sword className="w-6 h-6" />,
      isUnlocked: profile.totalXp >= 10000,
      progress: profile.totalXp,
      target: 10000,
      category: 'xp'
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked);

  const getCategoryColor = (category: Achievement['category']) => {
    switch (category) {
      case 'tasks': return 'bg-blue-500';
      case 'habits': return 'bg-green-500';
      case 'journeys': return 'bg-purple-500';
      case 'xp': return 'bg-yellow-500';
      case 'streak': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const renderAchievement = (achievement: Achievement, isUnlocked: boolean) => (
    <div
      key={achievement.id}
      className={`relative p-4 rounded-lg border transition-all ${
        isUnlocked 
          ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-md' 
          : 'bg-muted/50 border-muted opacity-60'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${isUnlocked ? getCategoryColor(achievement.category) : 'bg-gray-400'} text-white`}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
            {achievement.name}
          </h4>
          <p className={`text-sm ${isUnlocked ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
            {achievement.description}
          </p>
          {achievement.progress !== undefined && achievement.target && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{achievement.progress.toLocaleString()}</span>
                <span>{achievement.target.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${isUnlocked ? getCategoryColor(achievement.category) : 'bg-gray-400'}`}
                  style={{ width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
        {isUnlocked && (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Desbloqueada
          </Badge>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Conquistas Desbloqueadas
            </div>
            <Badge variant="outline">
              {unlockedAchievements.length}/{achievements.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {unlockedAchievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unlockedAchievements.map(achievement => renderAchievement(achievement, true))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Nenhuma conquista desbloqueada ainda.</p>
              <p className="text-sm">Continue progredindo para desbloquear suas primeiras conquistas!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {lockedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Próximas Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lockedAchievements.slice(0, 6).map(achievement => renderAchievement(achievement, false))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AchievementsSection;
