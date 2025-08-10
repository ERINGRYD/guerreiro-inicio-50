import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface SupabaseJourney {
  id: string;
  title: string;
  area: string | null;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useSupabaseJourneys = () => {
  const [journeys, setJourneys] = useState<SupabaseJourney[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadJourneys = useCallback(async () => {
    if (!user) {
      setJourneys([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('journeys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setJourneys(data || []);
    } catch (error) {
      console.error('Erro ao carregar jornadas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as jornadas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createJourney = useCallback(async (journeyData: Omit<SupabaseJourney, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('journeys')
        .insert({
          ...journeyData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setJourneys(prev => [data, ...prev]);
      
      toast({
        title: "Jornada Criada",
        description: `"${journeyData.title}" foi criada com sucesso!`,
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar jornada:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a jornada",
        variant: "destructive"
      });
    }
  }, [user]);

  const updateJourney = useCallback(async (journeyId: string, updates: Partial<SupabaseJourney>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('journeys')
        .update(updates)
        .eq('id', journeyId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setJourneys(prev => 
        prev.map(journey => 
          journey.id === journeyId ? { ...journey, ...updates } : journey
        )
      );

      return data;
    } catch (error) {
      console.error('Erro ao atualizar jornada:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a jornada",
        variant: "destructive"
      });
    }
  }, [user]);

  const deleteJourney = useCallback(async (journeyId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('journeys')
        .delete()
        .eq('id', journeyId)
        .eq('user_id', user.id);

      if (error) throw error;

      setJourneys(prev => prev.filter(journey => journey.id !== journeyId));
      
      toast({
        title: "Jornada Removida",
        description: "A jornada foi removida com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar jornada:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a jornada",
        variant: "destructive"
      });
    }
  }, [user]);

  useEffect(() => {
    loadJourneys();
  }, [loadJourneys]);

  return {
    journeys,
    loading,
    createJourney,
    updateJourney,
    deleteJourney,
    refreshJourneys: loadJourneys
  };
};