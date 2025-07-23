
import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/database';
import { Habit, HabitFormData, HabitCompletion, HABIT_DIFFICULTY_XP } from '@/types/habit';
import { toast } from '@/hooks/use-toast';

interface UseHabitsOptions {
  stageId?: string;
  journeyId?: string;
}

export const useHabits = (options?: UseHabitsOptions) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHabits = useCallback(async () => {
    try {
      console.log('useHabits - Carregando hábitos com filtros:', options);
      
      let habitsQuery = db.habits.orderBy('createdAt').reverse();
      
      // Se há filtros específicos, aplicar na query
      if (options?.stageId || options?.journeyId) {
        const allHabits = await habitsQuery.toArray();
        
        console.log('useHabits - Todos os hábitos antes do filtro:', allHabits.map(h => ({
          id: h.id,
          name: h.name,
          stageId: h.stageId,
          journeyId: h.journeyId,
          isActive: h.isActive
        })));
        
        const filteredHabits = allHabits.filter(habit => {
          const stageMatch = !options.stageId || habit.stageId === options.stageId;
          // Converter ambos para string para garantir comparação correta
          const journeyMatch = !options.journeyId || habit.journeyId?.toString() === options.journeyId?.toString();
          const isActive = habit.isActive;
          
          console.log(`useHabits - Verificando hábito ${habit.name}:`, {
            stageMatch,
            journeyMatch,
            isActive,
            habitStageId: habit.stageId,
            habitJourneyId: habit.journeyId,
            habitJourneyIdType: typeof habit.journeyId,
            filterStageId: options.stageId,
            filterJourneyId: options.journeyId,
            filterJourneyIdType: typeof options.journeyId,
            journeyIdComparison: `'${habit.journeyId}' === '${options.journeyId}' = ${habit.journeyId?.toString() === options.journeyId?.toString()}`
          });
          
          return stageMatch && journeyMatch && isActive;
        });
        
        console.log('useHabits - Hábitos filtrados:', filteredHabits.length);
        setHabits(filteredHabits);
      } else {
        // Carregar todos os hábitos se não há filtros
        const allHabits = await habitsQuery.toArray();
        console.log('useHabits - Carregando todos os hábitos:', allHabits.length);
        setHabits(allHabits);
      }
    } catch (error) {
      console.error('useHabits - Erro ao carregar hábitos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os hábitos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [options?.stageId, options?.journeyId]);

  const createHabit = useCallback(async (habitData: HabitFormData) => {
    try {
      console.log('useHabits - Criando hábito com dados:', habitData);
      console.log('useHabits - StageId recebido:', habitData.stageId);
      console.log('useHabits - JourneyId recebido:', habitData.journeyId);
      
      const newHabit: Habit = {
        id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: habitData.name,
        description: habitData.description,
        frequency: habitData.frequency,
        customFrequency: habitData.customFrequency,
        quantification: habitData.quantification,
        difficulty: habitData.difficulty,
        classification: habitData.classification,
        psychology: habitData.psychology,
        subHabits: habitData.subHabits.map((sub, index) => ({
          id: `sub-${Date.now()}-${index}`,
          name: sub.name,
          description: sub.description,
          completed: false,
          order: sub.order
        })),
        completions: [],
        streak: { current: 0, best: 0 },
        stats: {
          totalCompletions: 0,
          successRate: 0,
          totalTimeInvested: 0,
          consistency: 0
        },
        stageId: habitData.stageId,
        journeyId: habitData.journeyId,
        xpPerCompletion: HABIT_DIFFICULTY_XP[habitData.difficulty],
        reminderTimes: habitData.reminderTimes,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('useHabits - Hábito a ser criado:', {
        id: newHabit.id,
        name: newHabit.name,
        stageId: newHabit.stageId,
        journeyId: newHabit.journeyId
      });

      // Usar o ID string como chave no IndexedDB
      await db.habits.put(newHabit, newHabit.id);
      await loadHabits(); // Recarregar hábitos

      toast({
        title: "Hábito Criado",
        description: `"${habitData.name}" foi adicionado aos seus hábitos!`,
      });

      console.log('useHabits - Hábito criado com sucesso:', newHabit);
    } catch (error) {
      console.error('useHabits - Erro ao criar hábito:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o hábito",
        variant: "destructive"
      });
      throw error;
    }
  }, [loadHabits]);

  const updateHabit = useCallback(async (habitId: string, updates: Partial<Habit>) => {
    try {
      console.log('useHabits - Atualizando hábito:', habitId, updates);
      
      const habit = habits.find(h => h.id === habitId);
      if (!habit) {
        throw new Error('Hábito não encontrado');
      }

      const updatedHabit = {
        ...habit,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await db.habits.put(updatedHabit, habitId);
      await loadHabits();

      console.log('useHabits - Hábito atualizado com sucesso');
    } catch (error) {
      console.error('useHabits - Erro ao atualizar hábito:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o hábito",
        variant: "destructive"
      });
      throw error;
    }
  }, [habits, loadHabits]);

  const toggleHabitCompletion = useCallback(async (habitId: string, completion: Omit<HabitCompletion, 'date'>) => {
    try {
      console.log('useHabits - Toggle habit completion:', habitId, completion);
      
      const habit = habits.find(h => h.id === habitId);
      if (!habit) {
        throw new Error('Hábito não encontrado');
      }

      const today = new Date().toISOString().split('T')[0];
      const existingCompletionIndex = habit.completions.findIndex(c => c.date === today);
      
      let newCompletions: HabitCompletion[];

      if (existingCompletionIndex >= 0) {
        // Update existing completion
        newCompletions = habit.completions.map((c, index) =>
          index === existingCompletionIndex
            ? { ...completion, date: today }
            : c
        );
      } else {
        // Add new completion
        newCompletions = [...habit.completions, { ...completion, date: today }];
      }

      // Calculate new streak and stats
      const newStreak = calculateStreak(newCompletions);
      const newStats = calculateStats(newCompletions);

      const updatedHabit = {
        ...habit,
        completions: newCompletions,
        streak: newStreak,
        stats: newStats,
        updatedAt: new Date().toISOString()
      };

      await db.habits.put(updatedHabit, habitId);
      await loadHabits();

      if (completion.completed) {
        toast({
          title: "Hábito Concluído! 🎉",
          description: `+${habit.xpPerCompletion} XP ganhos!`,
        });
      }

      console.log('useHabits - Conclusão do hábito atualizada com sucesso');
    } catch (error) {
      console.error('useHabits - Erro ao alternar conclusão do hábito:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a conclusão do hábito",
        variant: "destructive"
      });
      throw error;
    }
  }, [habits, loadHabits]);

  const updateSubHabit = useCallback(async (habitId: string, subHabitId: string, completed: boolean) => {
    try {
      console.log('useHabits - Atualizando sub-hábito:', habitId, subHabitId, completed);
      
      const habit = habits.find(h => h.id === habitId);
      if (!habit) {
        throw new Error('Hábito não encontrado');
      }

      const updatedSubHabits = habit.subHabits.map(sub =>
        sub.id === subHabitId ? { ...sub, completed } : sub
      );

      const updatedHabit = {
        ...habit,
        subHabits: updatedSubHabits,
        updatedAt: new Date().toISOString()
      };

      await db.habits.put(updatedHabit, habitId);
      await loadHabits();

      console.log('useHabits - Sub-hábito atualizado com sucesso');
    } catch (error) {
      console.error('useHabits - Erro ao atualizar sub-hábito:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o sub-hábito",
        variant: "destructive"
      });
      throw error;
    }
  }, [habits, loadHabits]);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  return {
    habits,
    loading,
    createHabit,
    updateHabit,
    toggleHabitCompletion,
    updateSubHabit,
    refreshHabits: loadHabits
  };
};

// Helper functions
const calculateStreak = (completions: HabitCompletion[]) => {
  const sortedCompletions = completions
    .filter(c => c.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedCompletions.length === 0) {
    return { current: 0, best: 0 };
  }

  let currentStreak = 0;
  let bestStreak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Check if today is completed
  const today = currentDate.toISOString().split('T')[0];
  const completedToday = sortedCompletions.some(c => c.date === today);

  if (!completedToday) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  // Calculate current streak
  for (const completion of sortedCompletions) {
    const completionDate = new Date(completion.date);
    completionDate.setHours(0, 0, 0, 0);

    if (completionDate.getTime() === currentDate.getTime()) {
      currentStreak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate best streak
  let tempStreak = 0;
  let previousDate: Date | null = null;

  for (const completion of sortedCompletions.reverse()) {
    const completionDate = new Date(completion.date);
    
    if (!previousDate) {
      tempStreak = 1;
    } else {
      const dayDiff = Math.floor(
        (completionDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (dayDiff === 1) {
        tempStreak++;
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    
    previousDate = completionDate;
  }
  
  bestStreak = Math.max(bestStreak, tempStreak, currentStreak);

  return { current: currentStreak, best: bestStreak };
};

const calculateStats = (completions: HabitCompletion[]) => {
  const completedCompletions = completions.filter(c => c.completed);
  const totalDays = completions.length;
  const totalCompletions = completedCompletions.length;

  const successRate = totalDays > 0 ? (totalCompletions / totalDays) * 100 : 0;
  const totalTimeInvested = completedCompletions.reduce((sum, c) => sum + (c.value || 0), 0);

  // Calculate consistency
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  const completedInLast30Days = last30Days.filter(date =>
    completions.some(c => c.date === date && c.completed)
  ).length;

  const consistency = (completedInLast30Days / 30) * 100;

  return {
    totalCompletions,
    successRate,
    totalTimeInvested,
    consistency
  };
};
