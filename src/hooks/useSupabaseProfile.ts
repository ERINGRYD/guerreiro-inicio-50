import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface SupabaseProfile {
  id: string;
  user_id: string;
  hero_name: string | null;
  hero_class: string | null;
  avatar: string | null;
  level: number;
  total_xp: number;
  created_at: string;
  updated_at: string;
}

export const useSupabaseProfile = () => {
  const [profile, setProfile] = useState<SupabaseProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // Se não existe perfil, ele será criado automaticamente pelo trigger
        console.log('Perfil não encontrado, será criado automaticamente');
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seu perfil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProfile = useCallback(async (updates: Partial<SupabaseProfile>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      
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
  }, [user]);

  const addXP = useCallback(async (xpAmount: number) => {
    if (!profile || !user) return;

    const newTotalXp = profile.total_xp + xpAmount;
    const newLevel = Math.floor(newTotalXp / 100) + 1; // Cálculo simples de level
    const leveledUp = newLevel > profile.level;

    await updateProfile({
      total_xp: newTotalXp,
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
  }, [profile, updateProfile, user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    updateProfile,
    addXP,
    refreshProfile: loadProfile
  };
};