// Tipos TypeScript para o Sistema HeroTask

import { TaskRecurrence } from './repeat';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface SubHabit {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Task {
  id?: number;
  stageId: string;
  journeyId?: number;
  title: string;
  description?: string;
  completed: boolean;
  startDate?: string; // ISO date string
  dueDate?: string; // ISO date string
  completedAt?: string; // ISO date string - when task was completed
  priority: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  estimatedTime?: number;
  subTasks: SubTask[];
  timerActive?: boolean;
  timeSpent?: number;
  xpReward?: number;
  // Novo campo para recorrência
  recurrence?: TaskRecurrence;
  createdAt: string;
}

export interface Habit {
  id?: number;
  stageId: string;
  name: string;
  description?: string;
  frequency: 'Diário' | '3x por semana' | 'Semanal' | 'Mensal' | 'Personalizado';
  frequencyCount?: number;
  quantifier: 'repetição' | 'tempo' | 'distância' | 'peso' | 'outro';
  quantifierUnit?: string;
  targetValue?: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil' | 'Muito Difícil';
  doneDays: string[];
  subHabits: SubHabit[];
  isPositive: boolean;
  trigger?: string;
  reward?: string;
  goal?: string;
  timerActive?: boolean;
  timeSpent?: number;
  xpReward?: number;
  createdAt: string;
}

export interface Stage {
  id: string;
  title: string;
  description?: string;
  order: number;
  completed: boolean;
  tasks: Task[];
  habits: Habit[];
  xpReward?: number;
  createdAt: string;
}

export interface Journey {
  id?: number;
  title: string;
  description: string;
  narrativeType: string;
  icon?: string;
  area: 'Bem-Estar' | 'Business' | 'Maestria';
  graduationMode?: boolean;
  stages: Stage[];
  status: 'Em Progresso' | 'Concluída' | 'Pausada';
  objectiveType?: string;
  objectiveName?: string;
  objectiveDescription?: string;
  objectiveIcon?: string;
  totalXpReward?: number;
  createdAt: string;
  updatedAt: string;
}

export interface HeroProfile {
  id?: number;
  totalXp: number;
  level: number;
  heroName: string;
  heroClass: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface HeroStats {
  totalTasks: number;
  completedTasks: number;
  totalHabits: number;
  activeHabits: number;
  totalJourneys: number;
  completedJourneys: number;
  currentStreak: number;
  longestStreak: number;
}

// Sistema de XP e Níveis
export const XP_SYSTEM = {
  XP_PER_LEVEL: 500,
  calculateLevel: (totalXp: number): number => {
    return Math.floor(totalXp / 500) + 1;
  },
  calculateXpForNextLevel: (currentXp: number): number => {
    const currentLevel = Math.floor(currentXp / 500) + 1;
    return (currentLevel * 500) - currentXp;
  },
  calculateXpProgress: (currentXp: number): { current: number; needed: number; percentage: number } => {
    const currentLevelXp = currentXp % 500;
    return {
      current: currentLevelXp,
      needed: 500,
      percentage: (currentLevelXp / 500) * 100
    };
  }
};

// Recompensas de XP por dificuldade
export const XP_REWARDS = {
  task: {
    'Baixa': 10,
    'Média': 20,
    'Alta': 35,
    'Urgente': 50
  },
  habit: {
    'Fácil': 5,
    'Médio': 15,
    'Difícil': 25,
    'Muito Difícil': 40
  },
  stage: 100,
  journey: 200
} as const;

// Configuração das 3 grandes áreas
export const HERO_AREAS = {
  'Bem-Estar': {
    name: 'Bem-Estar',
    description: 'Saúde física, mental e emocional',
    icon: '🌱',
    color: 'emerald',
    examples: ['Exercícios', 'Meditação', 'Alimentação', 'Sono', 'Relacionamentos']
  },
  'Business': {
    name: 'Business',
    description: 'Carreira, finanças e empreendedorismo',
    icon: '💼',
    color: 'blue',
    examples: ['Projetos', 'Networking', 'Investimentos', 'Skills', 'Liderança']
  },
  'Maestria': {
    name: 'Maestria',
    description: 'Habilidades, conhecimento e paixões',
    icon: '🎯',
    color: 'purple',
    examples: ['Estudo', 'Arte', 'Música', 'Esportes', 'Hobbies']
  }
} as const;

export type HeroArea = keyof typeof HERO_AREAS;

// Utility functions for date handling
export const DateUtils = {
  isOverdue: (dueDate: string): boolean => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return new Date(dueDate) < today;
  },
  
  isDueToday: (dueDate: string): boolean => {
    const today = new Date();
    const due = new Date(dueDate);
    return today.toDateString() === due.toDateString();
  },
  
  isDueSoon: (dueDate: string, daysAhead: number = 3): boolean => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= daysAhead && diffDays >= 0;
  },
  
  formatRelativeDate: (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays === -1) return 'Ontem';
    if (diffDays < 0) return `${Math.abs(diffDays)} dias atrás`;
    return `Em ${diffDays} dias`;
  }
};
