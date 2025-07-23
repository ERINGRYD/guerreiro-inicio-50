import React, { useState } from 'react';
import { useHero } from '@/contexts/HeroContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, Play, Pause } from 'lucide-react';
import { HeroTaskDialog } from './HeroTaskDialog';
import { TaskTimer } from './TaskTimer';
import { HabitManagement } from '@/components/habits/HabitManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Task } from '@/types/hero';
import { useStageHabits } from '@/hooks/useStageHabits';

interface HeroStageManagementProps {
  journeyId: number;
  stageId: string;
  onBack: () => void;
}

export function HeroStageManagement({ journeyId, stageId, onBack }: HeroStageManagementProps) {
  const { 
    journeys, 
    updateJourney, 
    addXP
  } = useHero();
  
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [activeTimerId, setActiveTimerId] = useState<string | null>(null);

  // Usar o hook específico para hábitos da etapa
  const {
    habits: stageHabits,
    loading: habitsLoading,
    createHabit,
    updateHabit,
    toggleHabitCompletion,
    updateSubHabit
  } = useStageHabits({
    stageId,
    journeyId: journeyId.toString()
  });

  console.log('HeroStageManagement - Passando journeyId para useStageHabits:', journeyId.toString(), typeof journeyId.toString());

  const journey = journeys.find(j => j.id === journeyId);
  const stage = journey?.stages.find(s => s.id === stageId);

  console.log('HeroStageManagement - Journey:', journey);
  console.log('HeroStageManagement - Stage:', stage);
  console.log('HeroStageManagement - StageHabits:', stageHabits);

  if (!journey || !stage) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-muted-foreground mb-4">Etapa não encontrada</h2>
            <Button onClick={onBack}>Voltar</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const stageProgress = stage.tasks.length > 0 
    ? (stage.tasks.filter(task => task.completed).length / stage.tasks.length) * 100 
    : 0;

  const handleCompleteTask = async (taskId: string | number | undefined) => {
    if (!taskId) return;
    
    console.log('HeroStageManagement - Tentando completar tarefa:', taskId);
    
    try {
      const updatedStages = journey.stages.map(s => {
        if (s.id === stageId) {
          const updatedTasks = s.tasks.map(task => {
            if (task.id === taskId) {
              const wasCompleted = task.completed;
              const updatedTask = { ...task, completed: !task.completed };
              
              // Adicionar XP se completando a tarefa
              if (!wasCompleted && updatedTask.completed && task.xpReward) {
                console.log('HeroStageManagement - Adicionando XP pela tarefa:', task.xpReward);
                addXP(task.xpReward);
              }
              
              return updatedTask;
            }
            return task;
          });
          
          // Verificar se todas as tarefas estão completas
          const allTasksCompleted = updatedTasks.every(task => task.completed);
          
          return {
            ...s,
            tasks: updatedTasks,
            completed: allTasksCompleted
          };
        }
        return s;
      });

      await updateJourney(journeyId, { 
        stages: updatedStages,
        updatedAt: new Date().toISOString()
      });
      
      console.log('HeroStageManagement - Tarefa atualizada com sucesso');
    } catch (error) {
      console.error('HeroStageManagement - Erro ao atualizar tarefa:', error);
    }
  };

  const getDifficultyColor = (priority: string) => {
    switch (priority) {
      case 'Baixa': return 'bg-green-100 text-green-800 border-green-200';
      case 'Média': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Urgente': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleToggleHabitCompletion = async (habitId: string, completion: any) => {
    try {
      await toggleHabitCompletion(habitId, completion);
      
      // Adicionar XP se completando
      if (completion.completed) {
        const habit = stageHabits.find(h => h.id === habitId);
        if (habit) {
          await addXP(habit.xpPerCompletion);
        }
      }
    } catch (error) {
      console.error('HeroStageManagement - Erro ao alternar conclusão do hábito:', error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{stage.title}</h1>
              <p className="text-muted-foreground mt-1">
                {stage.description || "Sem descrição"}
              </p>
            </div>
          </div>

          {/* Progresso da Etapa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Progresso da Etapa</span>
                <Badge variant="secondary">
                  {Math.round(stageProgress)}% Completo
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={stageProgress} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>
                  {stage.tasks.filter(t => t.completed).length} de {stage.tasks.length} tarefas completas
                </span>
                <span>+{stage.xpReward || 0} XP total</span>
              </div>
            </CardContent>
          </Card>

          {/* Tabs para Tarefas e Hábitos */}
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tasks">Tarefas ({stage.tasks.length})</TabsTrigger>
              <TabsTrigger value="habits">Hábitos ({stageHabits.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Tarefas</h2>
                <Button 
                  onClick={() => setShowTaskDialog(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nova Tarefa
                </Button>
              </div>

              <div className="space-y-3">
                {stage.tasks.map((task) => (
                  <Card 
                    key={`task-${task.id}`}
                    className={`transition-all hover:shadow-md ${
                      task.completed ? 'opacity-75 bg-muted/50' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => handleCompleteTask(task.id)}
                          className="mt-1"
                        />
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className={task.completed ? 'line-through' : ''}>
                              <h3 className="font-medium">{task.title}</h3>
                              {task.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {task.description}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={getDifficultyColor(task.priority)}
                              >
                                {task.priority}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                +{task.xpReward || 0} XP
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {task.estimatedTime && (
                                <span>⏱️ {task.estimatedTime}min</span>
                              )}
                              {task.timeSpent && (
                                <span>✅ {Math.round(task.timeSpent / 60)}min gastos</span>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const taskIdStr = task.id?.toString();
                                  if (activeTimerId === taskIdStr) {
                                    setActiveTimerId(null);
                                  } else {
                                    setActiveTimerId(taskIdStr || null);
                                  }
                                }}
                              >
                                {activeTimerId === task.id?.toString() ? (
                                  <Pause className="h-3 w-3" />
                                ) : (
                                  <Play className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </div>

                          {activeTimerId === task.id?.toString() && (
                            <TaskTimer 
                              taskId={task.id?.toString() || ''}
                              onStop={() => setActiveTimerId(null)}
                            />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {stage.tasks.length === 0 && (
                  <Card className="p-8 text-center">
                    <div className="text-4xl mb-4">📋</div>
                    <h3 className="text-lg font-semibold mb-2">Nenhuma tarefa ainda</h3>
                    <p className="text-muted-foreground mb-4">
                      Adicione sua primeira tarefa para começar esta etapa!
                    </p>
                    <Button onClick={() => setShowTaskDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Tarefa
                    </Button>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="habits" className="space-y-4">
              <HabitManagement
                stageId={stageId}
                journeyId={journeyId.toString()}
                habits={stageHabits}
                habitsLoading={habitsLoading}
                onCreateHabit={createHabit}
                onUpdateHabit={updateHabit}
                onToggleCompletion={handleToggleHabitCompletion}
                onUpdateSubHabit={updateSubHabit}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <HeroTaskDialog
        open={showTaskDialog}
        onOpenChange={setShowTaskDialog}
        journeyId={journeyId}
        stageId={stageId}
      />
    </Layout>
  );
}
