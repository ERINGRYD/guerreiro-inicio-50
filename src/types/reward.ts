import React from 'react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
  category: AchievementCategory;
  rarity: AchievementRarity;
  xpBonus?: number;
}

export type AchievementCategory = 
  | 'tasks' 
  | 'habits' 
  | 'journeys' 
  | 'xp' 
  | 'streak' 
  | 'attributes' 
  | 'areas';

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Reward {
  id: string;
  name: string;
  description: string;
  type: RewardType;
  rarity: AchievementRarity;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  sourceAchievement?: string;
  sourceJourney?: string;
  data?: RewardData;
}

export type RewardType = 'skill' | 'knowledge' | 'resource' | 'weapon';

export interface RewardData {
  // For themes
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  // For avatars
  avatar?: string;
  // For XP boosters
  xpMultiplier?: number;
  duration?: number; // in hours
  // For skills (new features)
  featureId?: string;
  // For knowledge (tips)
  tip?: string;
  category?: string;
}

export interface JourneyReward {
  id: string;
  type: RewardType;
  name: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  data?: RewardData;
}

export interface UserInventory {
  rewards: Reward[];
  activeTheme?: string;
  activeAvatar?: string;
  activeBooster?: {
    rewardId: string;
    activatedAt: string;
    expiresAt: string;
  };
}

export const ACHIEVEMENT_CATEGORIES = [
  { id: 'all', name: 'Todas', icon: '🏆' },
  { id: 'tasks', name: 'Tarefas', icon: '✅' },
  { id: 'habits', name: 'Hábitos', icon: '🔄' },
  { id: 'journeys', name: 'Jornadas', icon: '🗺️' },
  { id: 'xp', name: 'Experiência', icon: '⭐' },
  { id: 'streak', name: 'Sequências', icon: '🔥' },
  { id: 'attributes', name: 'Atributos', icon: '💪' },
  { id: 'areas', name: 'Áreas', icon: '🌟' }
] as const;

export const RARITY_COLORS = {
  common: 'text-gray-600 bg-gray-100 border-gray-200',
  rare: 'text-blue-600 bg-blue-100 border-blue-200',
  epic: 'text-purple-600 bg-purple-100 border-purple-200',
  legendary: 'text-yellow-600 bg-yellow-100 border-yellow-200'
} as const;

export const REWARD_TYPE_LABELS = {
  skill: 'Habilidade',
  knowledge: 'Conhecimento',
  resource: 'Recurso',
  weapon: 'Arma'
} as const;

export const RARITY_LABELS = {
  common: 'Comum',
  rare: 'Rara',
  epic: 'Épica',
  legendary: 'Lendária'
} as const;