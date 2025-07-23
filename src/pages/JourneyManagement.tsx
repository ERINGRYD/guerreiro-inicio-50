import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Lock, CheckCircle, Clock, Play } from 'lucide-react';
import { PhaseManagement } from '@/components/journey/PhaseManagement';
import { AddPhaseDialog } from '@/components/journey/AddPhaseDialog';

export default function JourneyManagement() {
  const { journeyId } = useParams<{ journeyId: string }>();
  const navigate = useNavigate();
  const { gameData } = useGame();
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [showAddPhase, setShowAddPhase] = useState(false);

  const journey = gameData.journeys.find(j => j.id === journeyId);

  if (!journey) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-muted-foreground mb-4">Jornada não encontrada</h2>
            <Button onClick={() => navigate('/jogo')}>Voltar ao Dashboard</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const getPhaseStatus = (phase: any, index: number) => {
    if (phase.completed) return 'completed';
    if (index === 0) return 'active'; // Primeira fase sempre desbloqueada
    
    // Verificar se fase anterior está completa
    const previousPhase = journey.phases[index - 1];
    if (previousPhase?.completed) return 'active';
    
    return 'locked';
  };

  const getPhaseProgress = (phase: any) => {
    if (phase.tasks.length === 0) return 0;
    const completedTasks = phase.tasks.filter((task: any) => task.completed).length;
    return (completedTasks / phase.tasks.length) * 100;
  };

  const getJourneyProgress = () => {
    if (journey.phases.length === 0) return 0;
    const completedPhases = journey.phases.filter(phase => phase.completed).length;
    return (completedPhases / journey.phases.length) * 100;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'active':
        return <Play className="h-5 w-5 text-blue-500" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'locked':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (selectedPhaseId) {
    return (
      <PhaseManagement
        journeyId={journeyId!}
        phaseId={selectedPhaseId}
        onBack={() => setSelectedPhaseId(null)}
      />
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/jogo')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{journey.title}</h1>
              <p className="text-muted-foreground mt-1">{journey.description}</p>
            </div>
          </div>

          {/* Progresso Geral */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Progresso da Jornada</span>
                <Badge variant="secondary">{Math.round(getJourneyProgress())}% Completo</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={getJourneyProgress()} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{journey.phases.filter(p => p.completed).length} de {journey.phases.length} fases completas</span>
                <span>+{journey.xpTotal} XP total</span>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Fases */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Fases da Jornada</h2>
              <Button 
                onClick={() => setShowAddPhase(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Fase
              </Button>
            </div>

            <div className="grid gap-4">
              {journey.phases.map((phase, index) => {
                const status = getPhaseStatus(phase, index);
                const progress = getPhaseProgress(phase);
                const isLocked = status === 'locked';

                return (
                  <Card 
                    key={phase.id} 
                    className={`transition-all hover:shadow-lg ${isLocked ? 'opacity-60' : 'cursor-pointer hover:scale-[1.02]'}`}
                    onClick={() => !isLocked && setSelectedPhaseId(phase.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(status)}
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{phase.title}</h3>
                              <p className="text-muted-foreground text-sm mt-1">
                                {phase.description || "Sem descrição"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={getStatusColor(status)}
                              >
                                {status === 'completed' && 'Concluída'}
                                {status === 'active' && 'Ativa'}
                                {status === 'locked' && 'Bloqueada'}
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">
                                {phase.tasks.filter((t: any) => t.completed).length} de {phase.tasks.length} tarefas
                              </span>
                              <span className="text-muted-foreground">
                                +{phase.xpTotal} XP
                              </span>
                            </div>
                            <Progress value={progress} className="w-full" />
                          </div>

                          {!isLocked && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="w-full mt-4"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPhaseId(phase.id);
                              }}
                            >
                              Gerenciar Fase
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AddPhaseDialog
        open={showAddPhase}
        onOpenChange={setShowAddPhase}
        journeyId={journeyId!}
      />
    </Layout>
  );
}