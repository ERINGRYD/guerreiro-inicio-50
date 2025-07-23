import { useState, useCallback } from 'react';
import { Habit, HabitFormData, HabitCompletion } from '@/types/habit';

interface UseHabitManagementProps {
  initialHabits?: Habit[];
  onHabitChange?: (habits: Habit[]) => void;
}

export const useHabitManagement = ({ 
  initialHabits = [], 
  onHabitChange 
}: UseHabitManagementProps) => {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);

  const updateHabits = useCallback((newHabits: Habit[]) => {
    setHabits(newHabits);
    onHabitChange?.(newHabits);
  }, [onHabitChange]);

  const createHabit = useCallback((habitData: HabitFormData, stageId: string, journeyId: string) => {
    const newHabit: Habit = {
      id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...habitData,
      stageId,
      journeyId,
      completions: [],
      streak: { current: 0, best: 0 },
      stats: {
        totalCompletions: 0,
        successRate: 0,
        totalTimeInvested: 0,
        consistency: 0
      },
      xpPerCompletion: getXPForDifficulty(habitData.difficulty),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subHabits: habitData.subHabits.map((sub, index) => ({
        id: `sub-${Date.now()}-${index}`,
        ...sub,
        completed: false
      }))
    };

    updateHabits([...habits, newHabit]);
    return newHabit;
  }, [habits, updateHabits]);

  const updateHabit = useCallback((habitId: string, updates: Partial<Habit>) => {
    const updatedHabits = habits.map(habit =>
      habit.id === habitId
        ? { ...habit, ...updates, updatedAt: new Date().toISOString() }
        : habit
    );
    updateHabits(updatedHabits);
  }, [habits, updateHabits]);

  const toggleCompletion = useCallback((habitId: string, completion: Omit<HabitCompletion, 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    
    const updatedHabits = habits.map(habit => {
      if (habit.id !== habitId) return habit;

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

      // Calculate new streak
      const newStreak = calculateStreak(newCompletions);
      
      // Calculate new stats
      const newStats = calculateStats(newCompletions, habit.quantification?.type);

      return {
        ...habit,
        completions: newCompletions,
        streak: newStreak,
        stats: newStats,
        updatedAt: new Date().toISOString()
      };
    });

    updateHabits(updatedHabits);
  }, [habits, updateHabits]);

  const deleteHabit = useCallback((habitId: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    updateHabits(updatedHabits);
  }, [habits, updateHabits]);

  const getHabitsForStage = useCallback((stageId: string) => {
    return habits.filter(habit => habit.stageId === stageId && habit.isActive);
  }, [habits]);

  return {
    habits,
    createHabit,
    updateHabit,
    toggleCompletion,
    deleteHabit,
    getHabitsForStage
  };
};

// Helper functions
const getXPForDifficulty = (difficulty: string): number => {
  const xpMap = {
    easy: 10,
    medium: 15,
    hard: 25,
    'very-hard': 40
  };
  return xpMap[difficulty as keyof typeof xpMap] || 15;
};

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
    // If not completed today, check from yesterday
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

  return {
    current: currentStreak,
    best: bestStreak,
    lastCompletionDate: sortedCompletions[0]?.date
  };
};

const calculateStats = (completions: HabitCompletion[], quantificationType?: string) => {
  const completedCompletions = completions.filter(c => c.completed);
  const totalDays = completions.length;
  const totalCompletions = completedCompletions.length;

  const successRate = totalDays > 0 ? (totalCompletions / totalDays) * 100 : 0;

  let totalTimeInvested = 0;
  let averageValue = 0;

  if (quantificationType === 'time') {
    totalTimeInvested = completedCompletions.reduce((sum, c) => sum + (c.value || 0), 0);
  }

  if (completedCompletions.some(c => c.value !== undefined)) {
    const valuesSum = completedCompletions.reduce((sum, c) => sum + (c.value || 0), 0);
    averageValue = completedCompletions.length > 0 ? valuesSum / completedCompletions.length : 0;
  }

  // Calculate consistency (simplified version)
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
    averageValue,
    consistency
  };
};