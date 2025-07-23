import React, { useState, useEffect } from 'react';
import { Achievement, Reward, UserInventory, JourneyReward, AchievementCategory } from '@/types/reward';
import { useHero } from '@/contexts/HeroContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
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
  Award,
  Zap,
  Brain,
  Globe,
  Users,
  CheckCircle,
  TrendingUp,
  Calendar,
  Layers
} from 'lucide-react';

export const useRewardSystem = () => {
  const { profile, stats, journeys } = useHero();
  const { toast } = useToast();
  const [inventory, setInventory] = useLocalStorage<UserInventory>('user-inventory', {
    rewards: [],
    activeTheme: undefined,
    activeAvatar: undefined,
    activeBooster: undefined
  });

  const [lastCheckedStats, setLastCheckedStats] = useLocalStorage('last-checked-stats', {
    completedTasks: 0,
    completedJourneys: 0,
    totalXp: 0,
    currentStreak: 0,
    activeHabits: 0,
    maxAttributeLevel: 0
  });

  // Define all achievements
  const getAllAchievements = (): Achievement[] => {
    if (!profile || !stats) return [];

    const maxAttributeLevel = 10; // TODO: Get from attributes system

    return [
      // Task Achievements
      {
        id: 'first-task',
        name: 'Primeiro Passo',
        description: 'Complete sua primeira tarefa',
        icon: React.createElement(Target, { className: "w-6 h-6" }),
        isUnlocked: stats.completedTasks >= 1,
        category: 'tasks',
        rarity: 'common',
        xpBonus: 50
      },
      {
        id: 'task-10',
        name: 'Começando a Jornada',
        description: 'Complete 10 tarefas',
        icon: React.createElement(CheckCircle, { className: "w-6 h-6" }),
        isUnlocked: stats.completedTasks >= 10,
        progress: stats.completedTasks,
        target: 10,
        category: 'tasks',
        rarity: 'common',
        xpBonus: 100
      },
      {
        id: 'task-100',
        name: 'Mestre das Tarefas',
        description: 'Complete 100 tarefas',
        icon: React.createElement(Trophy, { className: "w-6 h-6" }),
        isUnlocked: stats.completedTasks >= 100,
        progress: stats.completedTasks,
        target: 100,
        category: 'tasks',
        rarity: 'rare',
        xpBonus: 500
      },
      {
        id: 'task-1000',
        name: 'Lenda das Tarefas',
        description: 'Complete 1000 tarefas',
        icon: React.createElement(Crown, { className: "w-6 h-6" }),
        isUnlocked: stats.completedTasks >= 1000,
        progress: stats.completedTasks,
        target: 1000,
        category: 'tasks',
        rarity: 'legendary',
        xpBonus: 2000
      },

      // Habit Achievements
      {
        id: 'streak-7',
        name: 'Consistente',
        description: 'Mantenha um streak de 7 dias',
        icon: React.createElement(Flame, { className: "w-6 h-6" }),
        isUnlocked: stats.currentStreak >= 7 || stats.longestStreak >= 7,
        progress: Math.max(stats.currentStreak, stats.longestStreak),
        target: 7,
        category: 'streak',
        rarity: 'common',
        xpBonus: 200
      },
      {
        id: 'streak-30',
        name: 'Imparável',
        description: 'Mantenha um streak de 30 dias',
        icon: React.createElement(Shield, { className: "w-6 h-6" }),
        isUnlocked: stats.currentStreak >= 30 || stats.longestStreak >= 30,
        progress: Math.max(stats.currentStreak, stats.longestStreak),
        target: 30,
        category: 'streak',
        rarity: 'rare',
        xpBonus: 1000
      },
      {
        id: 'streak-100',
        name: 'Imortal',
        description: 'Mantenha um streak de 100 dias',
        icon: React.createElement(Zap, { className: "w-6 h-6" }),
        isUnlocked: stats.currentStreak >= 100 || stats.longestStreak >= 100,
        progress: Math.max(stats.currentStreak, stats.longestStreak),
        target: 100,
        category: 'streak',
        rarity: 'legendary',
        xpBonus: 5000
      },
      {
        id: 'habits-5',
        name: 'Construtor de Hábitos',
        description: 'Mantenha 5 hábitos ativos simultaneamente',
        icon: React.createElement(Layers, { className: "w-6 h-6" }),
        isUnlocked: stats.activeHabits >= 5,
        progress: stats.activeHabits,
        target: 5,
        category: 'habits',
        rarity: 'common',
        xpBonus: 300
      },
      {
        id: 'habits-10',
        name: 'Mestre dos Hábitos',
        description: 'Mantenha 10 hábitos ativos simultaneamente',
        icon: React.createElement(Gem, { className: "w-6 h-6" }),
        isUnlocked: stats.activeHabits >= 10,
        progress: stats.activeHabits,
        target: 10,
        category: 'habits',
        rarity: 'rare',
        xpBonus: 800
      },

      // Journey Achievements
      {
        id: 'first-journey',
        name: 'Explorador',
        description: 'Complete sua primeira jornada',
        icon: React.createElement(Medal, { className: "w-6 h-6" }),
        isUnlocked: stats.completedJourneys >= 1,
        category: 'journeys',
        rarity: 'common',
        xpBonus: 500
      },
      {
        id: 'journeys-5',
        name: 'Aventureiro',
        description: 'Complete 5 jornadas',
        icon: React.createElement(Globe, { className: "w-6 h-6" }),
        isUnlocked: stats.completedJourneys >= 5,
        progress: stats.completedJourneys,
        target: 5,
        category: 'journeys',
        rarity: 'rare',
        xpBonus: 1000
      },
      {
        id: 'journeys-10',
        name: 'Mestre Explorador',
        description: 'Complete 10 jornadas',
        icon: React.createElement(Crown, { className: "w-6 h-6" }),
        isUnlocked: stats.completedJourneys >= 10,
        progress: stats.completedJourneys,
        target: 10,
        category: 'journeys',
        rarity: 'epic',
        xpBonus: 2000
      },

      // XP Achievements
      {
        id: 'xp-1000',
        name: 'Novato Experiente',
        description: 'Acumule 1.000 XP',
        icon: React.createElement(Star, { className: "w-6 h-6" }),
        isUnlocked: profile.totalXp >= 1000,
        progress: profile.totalXp,
        target: 1000,
        category: 'xp',
        rarity: 'common',
        xpBonus: 100
      },
      {
        id: 'xp-5000',
        name: 'Guerreiro Dedicado',
        description: 'Acumule 5.000 XP',
        icon: React.createElement(Sword, { className: "w-6 h-6" }),
        isUnlocked: profile.totalXp >= 5000,
        progress: profile.totalXp,
        target: 5000,
        category: 'xp',
        rarity: 'rare',
        xpBonus: 500
      },
      {
        id: 'xp-10000',
        name: 'Coletor de XP',
        description: 'Acumule 10.000 XP',
        icon: React.createElement(Award, { className: "w-6 h-6" }),
        isUnlocked: profile.totalXp >= 10000,
        progress: profile.totalXp,
        target: 10000,
        category: 'xp',
        rarity: 'epic',
        xpBonus: 1000
      },
      {
        id: 'xp-50000',
        name: 'Lenda Viva',
        description: 'Acumule 50.000 XP',
        icon: React.createElement(Crown, { className: "w-6 h-6" }),
        isUnlocked: profile.totalXp >= 50000,
        progress: profile.totalXp,
        target: 50000,
        category: 'xp',
        rarity: 'legendary',
        xpBonus: 5000
      },

      // Level Achievements
      {
        id: 'level-5',
        name: 'Evoluindo',
        description: 'Alcance o nível 5',
        icon: React.createElement(TrendingUp, { className: "w-6 h-6" }),
        isUnlocked: profile.level >= 5,
        progress: profile.level,
        target: 5,
        category: 'xp',
        rarity: 'common',
        xpBonus: 200
      },
      {
        id: 'level-10',
        name: 'Veterano',
        description: 'Alcance o nível 10',
        icon: React.createElement(Shield, { className: "w-6 h-6" }),
        isUnlocked: profile.level >= 10,
        progress: profile.level,
        target: 10,
        category: 'xp',
        rarity: 'rare',
        xpBonus: 500
      },
      {
        id: 'level-20',
        name: 'Lendário',
        description: 'Alcance o nível 20',
        icon: React.createElement(Crown, { className: "w-6 h-6" }),
        isUnlocked: profile.level >= 20,
        progress: profile.level,
        target: 20,
        category: 'xp',
        rarity: 'legendary',
        xpBonus: 2000
      },

      // Attribute Achievements
      {
        id: 'attribute-5',
        name: 'Especialista',
        description: 'Alcance nível 5 em qualquer atributo',
        icon: React.createElement(Brain, { className: "w-6 h-6" }),
        isUnlocked: maxAttributeLevel >= 5,
        progress: maxAttributeLevel,
        target: 5,
        category: 'attributes',
        rarity: 'common',
        xpBonus: 300
      },
      {
        id: 'attribute-10',
        name: 'Mestre de Atributo',
        description: 'Alcance nível 10 em qualquer atributo',
        icon: React.createElement(Gem, { className: "w-6 h-6" }),
        isUnlocked: maxAttributeLevel >= 10,
        progress: maxAttributeLevel,
        target: 10,
        category: 'attributes',
        rarity: 'epic',
        xpBonus: 1000
      }
    ];
  };

  // Check for new achievements
  const checkNewAchievements = () => {
    if (!profile || !stats) return;

    const achievements = getAllAchievements();
    const newlyUnlocked = achievements.filter(achievement => {
      return achievement.isUnlocked && 
             !inventory.rewards.some(reward => reward.sourceAchievement === achievement.id);
    });

    newlyUnlocked.forEach(achievement => {
      unlockAchievement(achievement);
    });

    // Update last checked stats
    setLastCheckedStats({
      completedTasks: stats.completedTasks,
      completedJourneys: stats.completedJourneys,
      totalXp: profile.totalXp,
      currentStreak: stats.currentStreak,
      activeHabits: stats.activeHabits,
      maxAttributeLevel: 10 // TODO: Get from attributes
    });
  };

  const unlockAchievement = (achievement: Achievement) => {
    const reward: Reward = {
      id: `reward-${achievement.id}`,
      name: achievement.name,
      description: achievement.description,
      type: 'knowledge',
      rarity: achievement.rarity,
      icon: '🏆',
      isUnlocked: true,
      unlockedAt: new Date().toISOString(),
      sourceAchievement: achievement.id
    };

    setInventory(prev => ({
      ...prev,
      rewards: [...prev.rewards, reward]
    }));

    toast({
      title: "🏆 Conquista Desbloqueada!",
      description: `${achievement.name}: ${achievement.description}`,
      duration: 5000
    });

    // Add XP bonus if defined
    if (achievement.xpBonus) {
      // TODO: Add XP to profile
      toast({
        title: `+${achievement.xpBonus} XP Bônus!`,
        description: "XP de conquista adicionado",
        duration: 3000
      });
    }
  };

  const unlockJourneyReward = (journeyReward: JourneyReward, journeyTitle: string) => {
    const reward: Reward = {
      id: `journey-reward-${Date.now()}`,
      name: journeyReward.name,
      description: journeyReward.description,
      type: journeyReward.type,
      rarity: journeyReward.rarity,
      icon: journeyReward.icon,
      isUnlocked: true,
      unlockedAt: new Date().toISOString(),
      sourceJourney: journeyTitle,
      data: journeyReward.data
    };

    setInventory(prev => ({
      ...prev,
      rewards: [...prev.rewards, reward]
    }));

    toast({
      title: "🎁 Recompensa de Jornada!",
      description: `${reward.name} desbloqueado em "${journeyTitle}"`,
      duration: 5000
    });
  };

  const applyTheme = (rewardId: string) => {
    setInventory(prev => ({
      ...prev,
      activeTheme: rewardId
    }));
    toast({
      title: "Tema Aplicado",
      description: "Novo tema ativado com sucesso!"
    });
  };

  const applyAvatar = (rewardId: string) => {
    setInventory(prev => ({
      ...prev,
      activeAvatar: rewardId
    }));
    toast({
      title: "Avatar Aplicado",
      description: "Novo avatar ativado com sucesso!"
    });
  };

  const activateBooster = (rewardId: string, duration: number) => {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + duration);

    setInventory(prev => ({
      ...prev,
      activeBooster: {
        rewardId,
        activatedAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString()
      }
    }));

    toast({
      title: "Booster Ativado!",
      description: `XP booster ativo por ${duration} horas`,
      duration: 5000
    });
  };

  const getRecentAchievements = () => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    return inventory.rewards.filter(reward => 
      reward.unlockedAt && new Date(reward.unlockedAt) > oneDayAgo
    );
  };

  const getAchievementsByCategory = (category: AchievementCategory | 'all') => {
    const achievements = getAllAchievements();
    return category === 'all' ? achievements : achievements.filter(a => a.category === category);
  };

  // Check for new achievements on stats change
  useEffect(() => {
    checkNewAchievements();
  }, [stats, profile]);

  return {
    achievements: getAllAchievements(),
    inventory,
    unlockJourneyReward,
    applyTheme,
    applyAvatar,
    activateBooster,
    getRecentAchievements,
    getAchievementsByCategory,
    checkNewAchievements
  };
};