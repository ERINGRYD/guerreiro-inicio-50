import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabaseProfile } from '@/hooks/useSupabaseProfile';
import { useSupabaseJourneys } from '@/hooks/useSupabaseJourneys';
import { useSupabaseTasks } from '@/hooks/useSupabaseTasks';
import { useSupabaseHabits } from '@/hooks/useSupabaseHabits';
import { HeroProfile, Journey, HeroStats, HERO_AREAS, Task } from '@/types/hero';
import { Habit, HabitFormData, HabitCompletion } from '@/types/habit';
import { useAttributeSystem } from '@/hooks/useAttributeSystem';
import { ATTRIBUTE_XP_REWARDS } from '@/types/attribute';
import { 
  adaptSupabaseProfile, 
  adaptSupabaseJourney, 
  adaptSupabaseTask, 
  adaptSupabaseHabit,
  mockHeroStats 
} from '@/types/supabase-adapters';

interface HeroContextType {
  // Profile
  profile: HeroProfile | null;
  profileLoading: boolean;
  updateProfile: (updates: Partial<HeroProfile>) => Promise<void>;
  addXP: (xpAmount: number) => Promise<void>;
  
  // Journeys
  journeys: Journey[];
  journeysLoading: boolean;
  addJourney: (journey: Omit<Journey, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Journey | undefined>;
  updateJourney: (id: number, updates: Partial<Journey>) => Promise<void>;
  deleteJourney: (id: number) => Promise<void>;
  
  // Tasks
  addTaskToStage: (journeyId: number, stageId: string, task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  
  // Habits - Global functions for backward compatibility
  createHabit: (habitData: HabitFormData) => Promise<void>;
  updateHabit: (habitId: string, updates: Partial<Habit>) => Promise<void>;
  toggleHabitCompletion: (habitId: string, completion: Omit<HabitCompletion, 'date'>) => Promise<void>;
  updateSubHabit: (habitId: string, subHabitId: string, completed: boolean) => Promise<void>;
  
  // Stats
  stats: HeroStats | null;
  statsLoading: boolean;
  refreshStats: () => Promise<void>;
  
  // Areas
  areas: typeof HERO_AREAS;
  
  // Utility functions
  getJourneysByArea: (area: keyof typeof HERO_AREAS) => Journey[];
  getAreaProgress: (area: keyof typeof HERO_AREAS) => { completed: number; total: number; percentage: number };
  getHabitsForStage: (stageId: string, journeyId?: string) => Promise<Habit[]>;
}

const HeroContext = createContext<HeroContextType | null>(null);

export const HeroProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('HeroProvider - Inicializando com Supabase...');
  
  // Use Supabase hooks
  const profileHook = useSupabaseProfile();
  const journeysHook = useSupabaseJourneys();
  const tasksHook = useSupabaseTasks();
  const habitsHook = useSupabaseHabits();
  const attributeSystem = useAttributeSystem();

  console.log('HeroProvider - Hooks carregados:', {
    profile: !!profileHook.profile,
    profileLoading: profileHook.loading,
    journeys: journeysHook.journeys.length,
    journeysLoading: journeysHook.loading,
    tasks: tasksHook.tasks.length,
    tasksLoading: tasksHook.loading,
    habits: habitsHook.habits.length,
    habitsLoading: habitsHook.loading
  });

  const getJourneysByArea = (area: keyof typeof HERO_AREAS): Journey[] => {
    return journeysHook.journeys
      .filter(journey => journey.area === area)
      .map(adaptSupabaseJourney);
  };

  const getAreaProgress = (area: keyof typeof HERO_AREAS) => {
    const areaJourneys = getJourneysByArea(area);
    const completed = areaJourneys.filter(journey => journey.status === 'Concluída').length;
    const total = areaJourneys.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return { completed, total, percentage };
  };

  const getHabitsForStage = async (stageId: string, journeyId?: string): Promise<Habit[]> => {
    return habitsHook.habits
      .filter(habit => {
        const stageMatch = habit.stage_id === stageId;
        const journeyMatch = !journeyId || habit.journey_id === journeyId;
        return stageMatch && journeyMatch && habit.is_active;
      })
      .map(adaptSupabaseHabit);
  };

  const addTaskToStage = async (journeyId: number, stageId: string, task: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const newTask = await tasksHook.createTask({
        stage_id: stageId,
        journey_id: journeyId.toString(),
        title: task.title,
        completed: false,
        priority: (task.priority as any) || 1,
        start_date: task.startDate || null,
        due_date: task.dueDate || null
      });

      if (newTask && profileHook.profile) {
        await profileHook.addXP(10);
      }
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      throw error;
    }
  };

  const createHabit = async (habitData: HabitFormData) => {
    try {
      const newHabit = await habitsHook.createHabit({
        name: habitData.name,
        stage_id: habitData.stageId || null,
        journey_id: habitData.journeyId?.toString() || null,
        frequency: habitData.frequency,
        difficulty: (habitData.difficulty as any) || 1,
        classification: habitData.classification || null,
        is_active: true
      });

      if (newHabit && profileHook.profile) {
        await profileHook.addXP(15);
      }
    } catch (error) {
      console.error('Erro ao criar hábito:', error);
      throw error;
    }
  };

  const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
    try {
      await habitsHook.updateHabit(habitId, {
        name: updates.name,
        frequency: updates.frequency,
        difficulty: (updates.difficulty as any),
        classification: updates.classification,
        is_active: updates.isActive
      });
    } catch (error) {
      console.error('Erro ao atualizar hábito:', error);
      throw error;
    }
  };

  const toggleHabitCompletion = async (habitId: string, completion: Omit<HabitCompletion, 'date'>) => {
    // For now, just update the habit's completion status
    // This will need to be enhanced with a separate completions table
    console.log('Toggle habit completion:', habitId, completion);
    
    if (completion.completed && profileHook.profile) {
      await profileHook.addXP(5);
    }
  };

  const updateSubHabit = async (habitId: string, subHabitId: string, completed: boolean) => {
    // Sub-habits functionality will be added later
    console.log('Update sub-habit:', habitId, subHabitId, completed);
  };

  // Create context value
  const contextValue: HeroContextType = {
    // Profile
    profile: profileHook.profile ? adaptSupabaseProfile(profileHook.profile) : null,
    profileLoading: profileHook.loading,
    updateProfile: async (updates: Partial<HeroProfile>) => {
      await profileHook.updateProfile({
        hero_name: updates.heroName,
        hero_class: updates.heroClass,
        avatar: updates.avatar,
        level: updates.level,
        total_xp: updates.totalXp
      });
    },
    addXP: profileHook.addXP,
    
    // Journeys
    journeys: journeysHook.journeys.map(adaptSupabaseJourney),
    journeysLoading: journeysHook.loading,
    addJourney: async (journey: Omit<Journey, 'id' | 'createdAt' | 'updatedAt'>) => {
      const result = await journeysHook.createJourney({
        title: journey.title,
        area: journey.area,
        status: journey.status
      });
      return result ? adaptSupabaseJourney(result) : undefined;
    },
    updateJourney: async (id: number, updates: Partial<Journey>) => {
      await journeysHook.updateJourney(id.toString(), {
        title: updates.title,
        area: updates.area,
        status: updates.status
      });
    },
    deleteJourney: async (id: number) => {
      await journeysHook.deleteJourney(id.toString());
    },
    
    // Tasks
    addTaskToStage,
    
    // Habits
    createHabit,
    updateHabit,
    toggleHabitCompletion,
    updateSubHabit,
    
    // Stats
    stats: mockHeroStats(),
    statsLoading: false,
    refreshStats: async () => {
      // Stats refresh logic will be implemented later
    },
    
    // Areas
    areas: HERO_AREAS,
    
    // Utility functions
    getJourneysByArea,
    getAreaProgress,
    getHabitsForStage
  };


  console.log('HeroContext - Valor do contexto criado:', contextValue);

  return (
    <HeroContext.Provider value={contextValue}>
      {children}
    </HeroContext.Provider>
  );
};

export const useHero = () => {
  const context = useContext(HeroContext);
  
  console.log('useHero - Context value:', context);
  
  if (!context) {
    console.error('useHero - Context é null! HeroProvider não está funcionando corretamente');
    throw new Error('useHero deve ser usado dentro de um HeroProvider');
  }
  
  return context;
};
