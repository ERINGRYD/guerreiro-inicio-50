import { RepeatPattern } from './repeat';

export type HabitFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';

export type HabitQuantificationType = 'repetition' | 'time' | 'distance' | 'weight' | 'other';

export type HabitDifficulty = 'easy' | 'medium' | 'hard' | 'very-hard';

export type HabitClassification = 'positive' | 'negative';

export interface HabitQuantification {
  type: HabitQuantificationType;
  unit: string;
  target: number;
}

export interface HabitPsychology {
  trigger: string;
  reward: string;
  objective: string;
}

export interface SubHabit {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  order: number;
}

export interface HabitCompletion {
  date: string; // ISO date string
  completed: boolean;
  value?: number; // quantified value
  notes?: string;
}

export interface HabitStreak {
  current: number;
  best: number;
  lastCompletionDate?: string;
}

export interface HabitStats {
  totalCompletions: number;
  successRate: number; // percentage
  totalTimeInvested: number; // in minutes
  averageValue?: number;
  consistency: number; // percentage
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: HabitFrequency;
  customFrequency?: {
    timesPerWeek: number;
    specificDays?: number[]; // 0-6 for Sunday-Saturday
  };
  // Novo sistema de repetição avançado
  repeatPattern?: RepeatPattern;
  quantification?: HabitQuantification;
  difficulty: HabitDifficulty;
  classification: HabitClassification;
  psychology: HabitPsychology;
  subHabits: SubHabit[];
  completions: HabitCompletion[];
  streak: HabitStreak;
  stats: HabitStats;
  stageId: string; // which stage this habit belongs to
  journeyId: string;
  xpPerCompletion: number;
  reminderTimes?: string[]; // time strings like "08:00"
  isActive: boolean;
  startDate?: string; // ISO date string - when habit should start
  endDate?: string; // ISO date string - when habit should end (optional)
  createdAt: string;
  updatedAt: string;
}

export interface HabitFormData {
  name: string;
  description: string;
  frequency: HabitFrequency;
  customFrequency?: {
    timesPerWeek: number;
    specificDays?: number[];
  };
  // Novo campo para padrão de repetição
  repeatPattern?: RepeatPattern;
  quantification?: HabitQuantification;
  difficulty: HabitDifficulty;
  classification: HabitClassification;
  psychology: HabitPsychology;
  subHabits: Omit<SubHabit, 'id' | 'completed'>[];
  reminderTimes?: string[];
  stageId: string;
  journeyId: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
}

export const HABIT_DIFFICULTY_XP = {
  easy: 10,
  medium: 15,
  hard: 25,
  'very-hard': 40
} as const;

export const HABIT_FREQUENCY_LABELS = {
  daily: 'Diário',
  weekly: 'Semanal',
  monthly: 'Mensal',
  custom: 'Personalizado'
} as const;

export const HABIT_DIFFICULTY_LABELS = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
  'very-hard': 'Muito Difícil'
} as const;

export const HABIT_CLASSIFICATION_LABELS = {
  positive: 'Positivo',
  negative: 'Negativo'
} as const;

export const HABIT_QUANTIFICATION_LABELS = {
  repetition: 'Repetições',
  time: 'Tempo',
  distance: 'Distância',
  weight: 'Peso',
  other: 'Outro'
} as const;
