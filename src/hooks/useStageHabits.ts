
import { useState, useEffect, useCallback } from 'react';
import { useHabits } from './useHabitDatabase';
import { Habit, HabitFormData, HabitCompletion } from '@/types/habit';
import { generateUniqueStageId } from '@/lib/stageIdMigration';

interface UseStageHabitsProps {
  stageId: string;
  journeyId: string;
}

export const useStageHabits = ({ stageId, journeyId }: UseStageHabitsProps) => {
  console.log('useStageHabits - Inicializando para stage:', stageId, 'journey:', journeyId);

  const {
    habits,
    loading,
    createHabit: createHabitInDB,
    updateHabit: updateHabitInDB,
    toggleHabitCompletion: toggleHabitCompletionInDB,
    updateSubHabit: updateSubHabitInDB,
    refreshHabits
  } = useHabits({ stageId, journeyId });

  const createHabit = useCallback(async (habitData: HabitFormData) => {
    try {
      console.log('useStageHabits - Criando hábito para stage:', stageId, 'journey:', journeyId);
      
      const habitDataWithIds = {
        ...habitData,
        stageId,
        journeyId: journeyId?.toString() || '' // Garantir que seja string e não vazio
      };
      
      await createHabitInDB(habitDataWithIds);
      console.log('useStageHabits - Hábito criado com sucesso');
    } catch (error) {
      console.error('useStageHabits - Erro ao criar hábito:', error);
      throw error;
    }
  }, [stageId, journeyId, createHabitInDB]);

  const updateHabit = useCallback(async (habitId: string, updates: Partial<Habit>) => {
    await updateHabitInDB(habitId, updates);
  }, [updateHabitInDB]);

  const toggleHabitCompletion = useCallback(async (habitId: string, completion: Omit<HabitCompletion, 'date'>) => {
    await toggleHabitCompletionInDB(habitId, completion);
  }, [toggleHabitCompletionInDB]);

  const updateSubHabit = useCallback(async (habitId: string, subHabitId: string, completed: boolean) => {
    await updateSubHabitInDB(habitId, subHabitId, completed);
  }, [updateSubHabitInDB]);

  return {
    habits,
    loading,
    createHabit,
    updateHabit,
    toggleHabitCompletion,
    updateSubHabit,
    refreshHabits
  };
};
