import { useState, useEffect, useCallback } from 'react';
import { db, initializeDefaultProfile } from '@/lib/database';
import { HeroProfile, Journey, Task, HeroStats, XP_SYSTEM } from '@/types/hero';
import { Habit } from '@/types/habit';
import { toast } from '@/hooks/use-toast';

export const useHeroProfile = () => {
  const [profile, setProfile] = useState<HeroProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const heroProfile = await initializeDefaultProfile();
      setProfile(heroProfile);
    } catch (error) {
      console.error('Erro ao carregar perfil do herói:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seu perfil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<HeroProfile>) => {
    if (!profile?.id) return;

    try {
      const updatedProfile = {
        ...profile,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await db.heroProfile.update(profile.id, updatedProfile);
      setProfile(updatedProfile);

      toast({
        title: "Perfil Atualizado",
        description: "Suas informações foram salvas com sucesso",
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seu perfil",
        variant: "destructive"
      });
    }
  }, [profile]);

  const addXP = useCallback(async (xpAmount: number) => {
    if (!profile?.id) return;

    const newTotalXp = profile.totalXp + xpAmount;
    const newLevel = XP_SYSTEM.calculateLevel(newTotalXp);
    const leveledUp = newLevel > profile.level;

    await updateProfile({
      totalXp: newTotalXp,
      level: newLevel
    });

    if (leveledUp) {
      toast({
        title: "🎉 Level Up!",
        description: `Parabéns! Você alcançou o nível ${newLevel}!`,
      });
    } else {
      toast({
        title: `+${xpAmount} XP`,
        description: "Experiência adquirida!",
      });
    }
  }, [profile, updateProfile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    updateProfile,
    addXP,
    reloadProfile: loadProfile
  };
};

export const useJourneys = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

  const loadJourneys = useCallback(async () => {
    try {
      const allJourneys = await db.journeys.orderBy('createdAt').reverse().toArray();
      setJourneys(allJourneys);
    } catch (error) {
      console.error('Erro ao carregar jornadas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addJourney = useCallback(async (journey: Omit<Journey, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newJourney: Journey = {
        ...journey,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const id = await db.journeys.add(newJourney);
      const createdJourney = { ...newJourney, id };
      
      setJourneys(prev => [createdJourney, ...prev]);
      
      toast({
        title: "Jornada Criada",
        description: `"${journey.title}" foi adicionada às suas jornadas!`,
      });

      return createdJourney;
    } catch (error) {
      console.error('Erro ao criar jornada:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a jornada",
        variant: "destructive"
      });
    }
  }, []);

  const updateJourney = useCallback(async (id: number, updates: Partial<Journey>) => {
    try {
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await db.journeys.update(id, updatedData);
      
      setJourneys(prev => 
        prev.map(journey => 
          journey.id === id ? { ...journey, ...updatedData } : journey
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar jornada:', error);
    }
  }, []);

  const deleteJourney = useCallback(async (id: number) => {
    try {
      await db.journeys.delete(id);
      setJourneys(prev => prev.filter(journey => journey.id !== id));
      
      toast({
        title: "Jornada Removida",
        description: "A jornada foi removida com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar jornada:', error);
    }
  }, []);

  useEffect(() => {
    loadJourneys();
  }, [loadJourneys]);

  return {
    journeys,
    loading,
    addJourney,
    updateJourney,
    deleteJourney,
    reloadJourneys: loadJourneys
  };
};

export const useHeroStats = () => {
  const [stats, setStats] = useState<HeroStats | null>(null);
  const [loading, setLoading] = useState(true);

  const calculateStats = useCallback(async () => {
    try {
      const [allTasks, allHabits, allJourneys] = await Promise.all([
        db.tasks.toArray(),
        db.habits.toArray(),
        db.journeys.toArray()
      ]);

      const completedTasks = allTasks.filter(task => task.completed).length;
      const activeHabits = allHabits.filter(habit => habit.classification === 'positive' && habit.isActive).length;
      const completedJourneys = allJourneys.filter(journey => journey.status === 'Concluída').length;

      // Calcular streak (simplificado por agora)
      const currentStreak = 0; // Implementar lógica de streak baseada em atividade diária
      const longestStreak = 0; // Implementar lógica de maior streak

      const calculatedStats: HeroStats = {
        totalTasks: allTasks.length,
        completedTasks,
        totalHabits: allHabits.length,
        activeHabits,
        totalJourneys: allJourneys.length,
        completedJourneys,
        currentStreak,
        longestStreak
      };

      setStats(calculatedStats);
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  return {
    stats,
    loading,
    refreshStats: calculateStats
  };
};
