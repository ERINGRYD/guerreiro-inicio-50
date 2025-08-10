import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface SupabaseHabit {
  id: string;
  name: string;
  stage_id: string | null;
  journey_id: string | null;
  frequency: string;
  difficulty: number | null;
  classification: string | null;
  is_active: boolean;
  user_id: string;
  created_at: string;
}

export const useSupabaseHabits = (stageId?: string, journeyId?: string) => {
  const [habits, setHabits] = useState<SupabaseHabit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadHabits = useCallback(async () => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (stageId) {
        query = query.eq('stage_id', stageId);
      }

      if (journeyId) {
        query = query.eq('journey_id', journeyId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      setHabits(data || []);
    } catch (error) {
      console.error('Erro ao carregar hábitos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os hábitos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, stageId, journeyId]);

  const createHabit = useCallback(async (habitData: Omit<SupabaseHabit, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          ...habitData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setHabits(prev => [data, ...prev]);
      
      toast({
        title: "Hábito Criado",
        description: `"${habitData.name}" foi criado com sucesso!`,
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar hábito:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o hábito",
        variant: "destructive"
      });
    }
  }, [user]);

  const updateHabit = useCallback(async (habitId: string, updates: Partial<SupabaseHabit>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', habitId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setHabits(prev => 
        prev.map(habit => 
          habit.id === habitId ? { ...habit, ...updates } : habit
        )
      );

      return data;
    } catch (error) {
      console.error('Erro ao atualizar hábito:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o hábito",
        variant: "destructive"
      });
    }
  }, [user]);

  const deleteHabit = useCallback(async (habitId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('habits')
        .update({ is_active: false })
        .eq('id', habitId)
        .eq('user_id', user.id);

      if (error) throw error;

      setHabits(prev => prev.filter(habit => habit.id !== habitId));
      
      toast({
        title: "Hábito Removido",
        description: "O hábito foi removido com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar hábito:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o hábito",
        variant: "destructive"
      });
    }
  }, [user]);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  return {
    habits,
    loading,
    createHabit,
    updateHabit,
    deleteHabit,
    refreshHabits: loadHabits
  };
};