import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, Timer, Edit2, Trash2, Play, Pause } from 'lucide-react';
import { TaskDialog } from './TaskDialog';
import { TaskTimer } from './TaskTimer';

interface PhaseManagementProps {
  journeyId: string;
  phaseId: string;
  onBack: () => void;
}

export function PhaseManagement({ journeyId, phaseId, onBack }: PhaseManagementProps) {
  const { gameData, completeTask, uncompleteTask } = useGame();
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTimerId, setActiveTimerId] = useState<string | null>(null);

  const journey = gameData.journeys.find(j => j.id === journeyId);
  const phase = journey?.phases.find(p => p.id === phaseId);

  if (!journey || !phase) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-muted-foreground mb-4">Fase não encontrada</h2>
            <Button onClick={onBack}>Voltar</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const getPhaseProgress = () => {
    if (phase.tasks.length === 0) return 0;
    const completedTasks = phase.tasks.filter(task => task.completed).length;
    return (completedTasks / phase.tasks.length) * 100;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-orange-100 text-orange-800';
      case 'epic':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      case 'epic': return 'Épico';
      default: return priority;
    }
  };

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    if (completed) {
      completeTask(journeyId, phaseId, taskId);
    } else {
      uncompleteTask(journeyId, phaseId, taskId);
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
              <h1 className="text-3xl font-bold">{phase.title}</h1>
              <p className="text-muted-foreground mt-1">{phase.description || "Sem descrição"}</p>
            </div>
          </div>

          {/* Progresso da Fase */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Progresso da Fase</span>
                <Badge variant="secondary">{Math.round(getPhaseProgress())}% Completo</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={getPhaseProgress()} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{phase.tasks.filter(t => t.completed).length} de {phase.tasks.length} tarefas completas</span>
                <span>+{phase.xpTotal} XP total</span>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Tarefas */}
          <div className="space-y-4">
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
              {phase.tasks.map((task) => (
                <Card key={task.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={(checked) => 
                          handleTaskToggle(task.id, checked as boolean)
                        }
                        className="mt-1"
                      />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={getPriorityColor(task.difficulty)}
                            >
                              {getPriorityLabel(task.difficulty)}
                            </Badge>
                            <Badge variant="secondary">
                              +{task.xpReward} XP
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setActiveTimerId(activeTimerId === task.id ? null : task.id)}
                            className="gap-1"
                          >
                            {activeTimerId === task.id ? (
                              <>
                                <Pause className="h-3 w-3" />
                                Pausar
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3" />
                                Cronômetro
                              </>
                            )}
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedTaskId(task.id);
                              setShowTaskDialog(true);
                            }}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </div>

                        {activeTimerId === task.id && (
                          <TaskTimer 
                            taskId={task.id}
                            onStop={() => setActiveTimerId(null)}
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {phase.tasks.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-muted-foreground">
                      <Timer className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Nenhuma tarefa ainda</h3>
                      <p className="text-sm">Adicione sua primeira tarefa para começar esta fase.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <TaskDialog
        open={showTaskDialog}
        onOpenChange={(open) => {
          setShowTaskDialog(open);
          if (!open) setSelectedTaskId(null);
        }}
        journeyId={journeyId}
        phaseId={phaseId}
        taskId={selectedTaskId}
      />
    </Layout>
  );
}