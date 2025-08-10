import type { SupabaseProfile } from '@/hooks/useSupabaseProfile';
import type { SupabaseJourney } from '@/hooks/useSupabaseJourneys';
import type { SupabaseTask } from '@/hooks/useSupabaseTasks';
import type { SupabaseHabit } from '@/hooks/useSupabaseHabits';
import type { HeroProfile, Journey, Task, HeroStats } from '@/types/hero';
import type { Habit } from '@/types/habit';

// Adapters to convert Supabase types to legacy types for backward compatibility

export const adaptSupabaseProfile = (profile: SupabaseProfile): HeroProfile => ({
  id: parseInt(profile.id),
  totalXp: profile.total_xp,
  level: profile.level,
  heroName: profile.hero_name || '',
  heroClass: profile.hero_class || '',
  avatar: profile.avatar || '⚔️',
  createdAt: profile.created_at,
  updatedAt: profile.updated_at
});

export const adaptSupabaseJourney = (journey: SupabaseJourney): Journey => ({
  id: parseInt(journey.id),
  title: journey.title,
  description: '', // Default empty since Supabase doesn't have this field yet
  area: (journey.area as any) || 'Bem-Estar',
  status: journey.status as any,
  narrativeType: 'linear', // Default value
  icon: '🎯', // Default icon
  totalXpReward: 100, // Default XP reward
  stages: [], // Empty array since stages will be handled separately
  createdAt: journey.created_at,
  updatedAt: journey.updated_at
});

export const adaptSupabaseTask = (task: SupabaseTask): Task => ({
  id: parseInt(task.id),
  stageId: task.stage_id || '',
  journeyId: task.journey_id ? parseInt(task.journey_id) : undefined,
  title: task.title,
  description: '', // Default empty
  completed: task.completed,
  priority: task.priority as any || 'Baixa',
  startDate: task.start_date || undefined,
  dueDate: task.due_date || undefined,
  createdAt: task.created_at,
  xpReward: (task.priority || 1) * 10, // Calculate XP based on priority
  subTasks: [] // Empty array for now
});

export const adaptSupabaseHabit = (habit: SupabaseHabit): Habit => ({
  id: habit.id,
  stageId: habit.stage_id || '',
  journeyId: habit.journey_id || undefined,
  name: habit.name,
  description: '', // Default empty
  frequency: habit.frequency as any,
  
  difficulty: (habit.difficulty as any) || 1,
  classification: habit.classification as any || 'positive',
  isActive: habit.is_active,
  createdAt: habit.created_at,
  updatedAt: habit.created_at, // Use created_at as fallback
  xpPerCompletion: (habit.difficulty || 1) * 5,
  completions: [], // Empty array for now
  subHabits: [], // Empty array for now
  psychology: {
    trigger: '',
    reward: '',
    objective: ''
  },
  streak: {
    current: 0,
    best: 0,
    lastCompletionDate: null
  },
  stats: {
    totalCompletions: 0,
    successRate: 0,
    totalTimeInvested: 0,
    consistency: 0
  }
});

// Mock stats for now - this should be calculated from actual data
export const mockHeroStats = (): HeroStats => ({
  totalTasks: 0,
  completedTasks: 0,
  totalHabits: 0,
  activeHabits: 0,
  totalJourneys: 0,
  completedJourneys: 0,
  currentStreak: 0,
  longestStreak: 0
});