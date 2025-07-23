import React, { createContext, useContext, ReactNode } from 'react';
import { useHeroProfile, useJourneys, useHeroStats } from '@/hooks/useHeroDatabase';
import { HeroProfile, Journey, HeroStats, HERO_AREAS, Task } from '@/types/hero';
import { Habit, HabitFormData, HabitCompletion } from '@/types/habit';
import { useHabits } from '@/hooks/useHabitDatabase';
import { useAttributeSystem } from '@/hooks/useAttributeSystem';
import { ATTRIBUTE_XP_REWARDS } from '@/types/attribute';
import { generateUniqueStageId } from '@/lib/stageIdMigration';

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
  console.log('HeroProvider - Inicializando...');
  
  // Use hooks with improved error handling
  let profileHook, journeysHook, statsHook, habitsHook, attributeSystem;
  
  try {
    profileHook = useHeroProfile();
    journeysHook = useJourneys();
    statsHook = useHeroStats();
    habitsHook = useHabits();
    attributeSystem = useAttributeSystem();

    console.log('HeroProvider - Hooks carregados:', {
      profile: !!profileHook.profile,
      profileLoading: profileHook.loading,
      journeys: journeysHook.journeys.length,
      journeysLoading: journeysHook.loading,
      stats: !!statsHook.stats,
      statsLoading: statsHook.loading,
      attributes: attributeSystem.attributes.length
    });
  } catch (error) {
    console.error('HeroProvider - Erro crítico ao inicializar hooks:', error);
    
    // Provide fallback empty context to prevent complete crash
    const fallbackValue: HeroContextType = {
      profile: null,
      profileLoading: false,
      updateProfile: async () => {},
      addXP: async () => {},
      journeys: [],
      journeysLoading: false,
      addJourney: async () => undefined,
      updateJourney: async () => {},
      deleteJourney: async () => {},
      addTaskToStage: async () => {},
      createHabit: async () => {},
      updateHabit: async () => {},
      toggleHabitCompletion: async () => {},
      updateSubHabit: async () => {},
      stats: null,
      statsLoading: false,
      refreshStats: async () => {},
      areas: HERO_AREAS,
      getJourneysByArea: () => [],
      getAreaProgress: () => ({ completed: 0, total: 0, percentage: 0 }),
      getHabitsForStage: async () => []
    };
    
    return (
      <HeroContext.Provider value={fallbackValue}>
        {children}
      </HeroContext.Provider>
    );
  }

  const getJourneysByArea = (area: keyof typeof HERO_AREAS): Journey[] => {
    return journeysHook.journeys.filter(journey => journey.area === area);
  };

  const getAreaProgress = (area: keyof typeof HERO_AREAS) => {
    const areaJourneys = getJourneysByArea(area);
    const completed = areaJourneys.filter(journey => journey.status === 'Concluída').length;
    const total = areaJourneys.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return { completed, total, percentage };
  };

  const getHabitsForStage = async (stageId: string, journeyId?: string): Promise<Habit[]> => {
    try {
      console.log('HeroContext - getHabitsForStage chamado para stage:', stageId, 'journey:', journeyId);
      
      const { db } = await import('@/lib/database');
      const allHabits = await db.habits.toArray();
      
      const filteredHabits = allHabits.filter(habit => {
        const stageMatch = habit.stageId === stageId;
        const journeyMatch = !journeyId || habit.journeyId?.toString() === journeyId?.toString();
        const isActive = habit.isActive;
        
        console.log(`HeroContext - Verificando hábito ${habit.name}:`, {
          stageMatch,
          journeyMatch,
          isActive,
          habitStageId: habit.stageId,
          habitJourneyId: habit.journeyId
        });
        
        return stageMatch && journeyMatch && isActive;
      });
      
      console.log(`HeroContext - Hábitos encontrados para stage ${stageId}:`, filteredHabits.length);
      return filteredHabits;
    } catch (error) {
      console.error('HeroContext - Erro ao carregar hábitos para stage:', error);
      return [];
    }
  };

  const addTaskToStage = async (journeyId: number, stageId: string, task: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const journey = journeysHook.journeys.find(j => j.id === journeyId);
      if (!journey) throw new Error('Jornada não encontrada');

      // Gerar ID único para a tarefa
      const taskId = Date.now() + Math.random();
      const newTask: Task = {
        ...task,
        id: taskId,
        stageId,
        createdAt: new Date().toISOString()
      };

      // Atualizar a jornada com a nova tarefa
      const updatedStages = journey.stages.map(stage => {
        if (stage.id === stageId) {
          return {
            ...stage,
            tasks: [...stage.tasks, newTask]
          };
        }
        return stage;
      });

      // Salvar na jornada
      await journeysHook.updateJourney(journeyId, { 
        stages: updatedStages,
        updatedAt: new Date().toISOString()
      });

      // IMPORTANTE: Salvar também na tabela tasks para aparecer na agenda
      const { db } = await import('@/lib/database');
      const taskForDb = {
        ...newTask,
        journeyId: journeyId // Adicionar journeyId para filtros
      };
      
      await db.tasks.add(taskForDb);
      console.log('Tarefa salva tanto na jornada quanto na tabela tasks');

      // Add attribute XP for task creation
      const xpAmount = ATTRIBUTE_XP_REWARDS.task[task.priority];
      await attributeSystem.addAttributeXPForJourney(
        journey.title,
        Math.floor(xpAmount / 2), // Half XP for creating, full XP for completing
        'task',
        String(taskId)
      );
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      throw error;
    }
  };

  const createHabit = async (habitData: HabitFormData) => {
    try {
      console.log('HeroContext - Criando hábito (global):', habitData);
      
      // Garantir que o journeyId seja uma string
      const habitDataWithStringIds = {
        ...habitData,
        journeyId: habitData.journeyId?.toString(),
        stageId: habitData.stageId
      };
      
      await habitsHook.createHabit(habitDataWithStringIds);
      
      // Add XP for habit creation
      await profileHook.addXP(10);
      
      // Add attribute XP if habit is linked to a journey
      if (habitData.journeyId) {
        const journey = journeysHook.journeys.find(j => j.id === Number(habitData.journeyId));
        if (journey) {
          const xpAmount = ATTRIBUTE_XP_REWARDS.habit[habitData.difficulty];
          await attributeSystem.addAttributeXPForJourney(
            journey.title,
            Math.floor(xpAmount / 2), // Half XP for creating
            'habit',
            habitData.name
          );
        }
      }
      
      console.log('HeroContext - Hábito criado com sucesso (global)');
    } catch (error) {
      console.error('HeroContext - Erro ao criar hábito (global):', error);
      throw error;
    }
  };

  const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
    try {
      console.log('HeroContext - Atualizando hábito (global):', habitId, updates);
      
      await habitsHook.updateHabit(habitId, updates);
      
      console.log('HeroContext - Hábito atualizado com sucesso (global)');
    } catch (error) {
      console.error('HeroContext - Erro ao atualizar hábito (global):', error);
      throw error;
    }
  };

  const toggleHabitCompletion = async (habitId: string, completion: Omit<HabitCompletion, 'date'>) => {
    try {
      console.log('HeroContext - Toggle habit completion (global):', habitId, completion);
      
      await habitsHook.toggleHabitCompletion(habitId, completion);
      
      // Add XP if completing
      if (completion.completed) {
        // Find the habit to get XP and journey info
        const { db } = await import('@/lib/database');
        const habit = await db.habits.get(habitId);
        if (habit) {
          await profileHook.addXP(habit.xpPerCompletion);
          
          // Add attribute XP if linked to journey
          if (habit.journeyId) {
            const journey = journeysHook.journeys.find(j => j.id === Number(habit.journeyId));
            if (journey) {
              const xpAmount = ATTRIBUTE_XP_REWARDS.habit[habit.difficulty];
              await attributeSystem.addAttributeXPForJourney(
                journey.title,
                xpAmount,
                'habit',
                habitId
              );
            }
          }
        }
      }
      
      console.log('HeroContext - Conclusão do hábito atualizada com sucesso (global)');
    } catch (error) {
      console.error('HeroContext - Erro ao alternar conclusão do hábito (global):', error);
      throw error;
    }
  };

  const updateSubHabit = async (habitId: string, subHabitId: string, completed: boolean) => {
    try {
      console.log('HeroContext - Atualizando sub-hábito (global):', habitId, subHabitId, completed);
      
      await habitsHook.updateSubHabit(habitId, subHabitId, completed);
      
      console.log('HeroContext - Sub-hábito atualizado com sucesso (global)');
    } catch (error) {
      console.error('HeroContext - Erro ao atualizar sub-hábito (global):', error);
      throw error;
    }
  };

  // Create context value
  const contextValue: HeroContextType = {
    // Profile
    profile: profileHook.profile,
    profileLoading: profileHook.loading,
    updateProfile: profileHook.updateProfile,
    addXP: profileHook.addXP,
    
    // Journeys
    journeys: journeysHook.journeys,
    journeysLoading: journeysHook.loading,
    addJourney: journeysHook.addJourney,
    updateJourney: journeysHook.updateJourney,
    deleteJourney: journeysHook.deleteJourney,
    
    // Tasks
    addTaskToStage,
    
    // Habits
    createHabit,
    updateHabit,
    toggleHabitCompletion,
    updateSubHabit,
    
    // Stats
    stats: statsHook.stats,
    statsLoading: statsHook.loading,
    refreshStats: statsHook.refreshStats,
    
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
