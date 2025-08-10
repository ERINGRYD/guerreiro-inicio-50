import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface SupabaseTask {
  id: string;
  stage_id: string | null;
  title: string;
  journey_id: string | null;
  completed: boolean;
  priority: number | null;
  start_date: string | null;
  due_date: string | null;
  user_id: string;
  created_at: string;
}

export const useSupabaseTasks = (stageId?: string, journeyId?: string) => {
  const [tasks, setTasks] = useState<SupabaseTask[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);

      if (stageId) {
        query = query.eq('stage_id', stageId);
      }

      if (journeyId) {
        query = query.eq('journey_id', journeyId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      setTasks(data || []);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as tarefas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, stageId, journeyId]);

  const createTask = useCallback(async (taskData: Omit<SupabaseTask, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => [data, ...prev]);
      
      toast({
        title: "Tarefa Criada",
        description: `"${taskData.title}" foi criada com sucesso!`,
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a tarefa",
        variant: "destructive"
      });
    }
  }, [user]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<SupabaseTask>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      );

      return data;
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa",
        variant: "destructive"
      });
    }
  }, [user]);

  const deleteTask = useCallback(async (taskId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      toast({
        title: "Tarefa Removida",
        description: "A tarefa foi removida com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a tarefa",
        variant: "destructive"
      });
    }
  }, [user]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks: loadTasks
  };
};