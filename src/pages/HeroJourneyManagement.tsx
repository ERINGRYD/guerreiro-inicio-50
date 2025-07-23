import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHero } from '@/contexts/HeroContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Lock, CheckCircle, Clock, Play } from 'lucide-react';
import { HeroStageManagement } from '@/components/journey/HeroStageManagement';

export default function HeroJourneyManagement() {
  const { journeyId } = useParams<{ journeyId: string }>();
  const navigate = useNavigate();
  const { journeys } = useHero();
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

  const journey = journeys.find(j => j.id === Number(journeyId));

  if (!journey) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-muted-foreground mb-4">Jornada não encontrada</h2>
            <Button onClick={() => navigate(`/area/${journey?.area.toLowerCase() || 'bem-estar'}`)}>
              Voltar às Jornadas
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const getStageStatus = (stage: any, index: number) => {
    if (stage.completed) return 'completed';
    if (index === 0) return 'active'; // Primeira etapa sempre desbloqueada
    
    // Verificar se etapa anterior está completa
    const previousStage = journey.stages[index - 1];
    if (previousStage?.completed) return 'active';
    
    return 'locked';
  };

  const getStageProgress = (stage: any) => {
    if (stage.tasks.length === 0) return 0;
    const completedTasks = stage.tasks.filter((task: any) => task.completed).length;
    return (completedTasks / stage.tasks.length) * 100;
  };

  const getJourneyProgress = () => {
    if (journey.stages.length === 0) return 0;
    const completedStages = journey.stages.filter(stage => stage.completed).length;
    return (completedStages / journey.stages.length) * 100;
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

  if (selectedStageId) {
    return (
      <HeroStageManagement
        journeyId={journey.id!}
        stageId={selectedStageId}
        onBack={() => setSelectedStageId(null)}
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
              onClick={() => navigate(`/area/${journey.area.toLowerCase()}`)}
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
                <span>{journey.stages.filter(s => s.completed).length} de {journey.stages.length} etapas completas</span>
                <span>+{journey.totalXpReward || 0} XP total</span>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Etapas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Etapas da Jornada</h2>
            </div>

            <div className="grid gap-4">
              {journey.stages.map((stage, index) => {
                const status = getStageStatus(stage, index);
                const progress = getStageProgress(stage);
                const isLocked = status === 'locked';

                return (
                  <Card 
                    key={stage.id} 
                    className={`transition-all hover:shadow-lg ${isLocked ? 'opacity-60' : 'cursor-pointer hover:scale-[1.02]'}`}
                    onClick={() => !isLocked && setSelectedStageId(stage.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(status)}
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{stage.title}</h3>
                              <p className="text-muted-foreground text-sm mt-1">
                                {stage.description || "Sem descrição"}
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
                                {stage.tasks.filter((t: any) => t.completed).length} de {stage.tasks.length} tarefas
                              </span>
                              <span className="text-muted-foreground">
                                +{stage.xpReward || 0} XP
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
                                setSelectedStageId(stage.id);
                              }}
                            >
                              Gerenciar Etapa
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {journey.stages.length === 0 && (
              <Card className="p-8 text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold mb-2">Jornada sem etapas</h3>
                <p className="text-muted-foreground mb-4">
                  Esta jornada ainda não possui etapas definidas.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}