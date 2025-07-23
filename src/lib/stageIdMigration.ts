
import { db } from './database';
import { Journey } from '@/types/hero';

// Gera ID único para stage baseado na jornada
export const generateUniqueStageId = (journeyId: number, stageOrder: number): string => {
  return `stage-${journeyId}-${stageOrder}`;
};

// Migração para corrigir IDs duplicados de stages
export const migrateStageIds = async (): Promise<void> => {
  console.log('Iniciando migração de IDs de stages...');
  
  const journeys = await db.journeys.toArray();
  const habitsToUpdate = await db.habits.toArray();
  
  for (const journey of journeys) {
    if (!journey.id) continue;
    
    let hasChanges = false;
    const oldToNewStageMap = new Map<string, string>();
    
    // Atualizar IDs dos stages
    const updatedStages = journey.stages.map((stage, index) => {
      const newStageId = generateUniqueStageId(journey.id!, index);
      
      // Se o ID já está correto, não fazer nada
      if (stage.id === newStageId) {
        return stage;
      }
      
      // Mapear ID antigo para novo
      oldToNewStageMap.set(stage.id, newStageId);
      hasChanges = true;
      
      console.log(`Migrando stage: ${stage.id} -> ${newStageId} na jornada ${journey.title}`);
      
      return {
        ...stage,
        id: newStageId
      };
    });
    
    // Atualizar jornada se houve mudanças
    if (hasChanges) {
      await db.journeys.update(journey.id, {
        stages: updatedStages,
        updatedAt: new Date().toISOString()
      });
      
      console.log(`Jornada "${journey.title}" atualizada com novos IDs de stages`);
    }
    
    // Atualizar hábitos que referenciam os stages antigos
    for (const [oldStageId, newStageId] of oldToNewStageMap.entries()) {
      const habitsToUpdateForStage = habitsToUpdate.filter(h => h.stageId === oldStageId);
      
      for (const habit of habitsToUpdateForStage) {
        await db.habits.update(habit.id, {
          stageId: newStageId,
          journeyId: journey.id!.toString(),
          updatedAt: new Date().toISOString()
        });
        
        console.log(`Hábito "${habit.name}" atualizado: ${oldStageId} -> ${newStageId}`);
      }
    }
  }
  
  console.log('Migração de IDs de stages concluída');
};

// Sincronizar tarefas das jornadas para a tabela tasks
export const syncTasksFromJourneys = async (): Promise<void> => {
  console.log('Iniciando sincronização de tarefas...');
  
  const journeys = await db.journeys.toArray();
  const existingTasks = await db.tasks.toArray();
  const existingTaskIds = new Set(existingTasks.map(t => t.id));
  
  for (const journey of journeys) {
    if (!journey.id) continue;
    
    for (const stage of journey.stages) {
      for (const task of stage.tasks) {
        // Se a tarefa já existe na tabela tasks, pular
        if (task.id && existingTaskIds.has(task.id)) {
          continue;
        }
        
        // Criar nova tarefa na tabela tasks
        const taskToAdd = {
          ...task,
          stageId: stage.id,
          journeyId: journey.id,
          id: task.id || Date.now() + Math.random()
        };
        
        await db.tasks.add(taskToAdd);
        console.log(`Tarefa "${task.title}" sincronizada para a tabela tasks`);
      }
    }
  }
  
  console.log('Sincronização de tarefas concluída');
};

// Executar todas as migrações
export const runMigrations = async (): Promise<void> => {
  try {
    await migrateStageIds();
    await syncTasksFromJourneys();
    console.log('Todas as migrações executadas com sucesso');
  } catch (error) {
    console.error('Erro durante as migrações:', error);
    throw error;
  }
};
