
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AreaCard from '@/components/dashboard/AreaCard';
import ProgressSummary from '@/components/dashboard/ProgressSummary';
import QuickNavigation from '@/components/dashboard/QuickNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useHero } from '@/contexts/HeroContext';
import { toast } from '@/hooks/use-toast';
import { Settings, Play, CheckCircle, Upload, Plus } from 'lucide-react';
import { JourneyImportDialog } from '@/components/journey/JourneyImportDialog';

const Game: React.FC = () => {
  const navigate = useNavigate();
  const { profile, journeys } = useHero();
  const [importDialogOpen, setImportDialogOpen] = React.useState(false);

  // Verificar se precisa fazer onboarding
  useEffect(() => {
    if (!profile?.heroName || !profile?.heroClass) {
      navigate('/onboarding');
    }
  }, [profile, navigate]);

  const handleExploreArea = (area: string) => {
    navigate(`/area/${area.toLowerCase()}`);
  };

  // Definir as três grandes áreas
  const areas = [
    {
      id: 'bem-estar',
      name: 'Bem-Estar',
      description: 'Saúde física, mental e emocional',
      icon: '🌱',
      color: 'emerald',
      examples: ['Exercícios', 'Meditação', 'Alimentação', 'Sono', 'Relacionamentos']
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Carreira, finanças e empreendedorismo',
      icon: '💼',
      color: 'blue',
      examples: ['Projetos', 'Networking', 'Investimentos', 'Skills', 'Liderança']
    },
    {
      id: 'maestria',
      name: 'Maestria',
      description: 'Habilidades, conhecimento e paixões',
      icon: '🎯',
      color: 'purple',
      examples: ['Estudo', 'Arte', 'Música', 'Esportes', 'Hobbies']
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Cabeçalho do Dashboard */}
        <DashboardHeader />

        {/* Título Principal */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Escolha Sua Área de Crescimento
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transforme sua vida através das três grandes áreas do desenvolvimento pessoal. 
            Cada jornada é uma aventura épica rumo à sua melhor versão.
          </p>
        </div>

        {/* Cards das Grandes Áreas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area) => (
            <AreaCard
              key={area.id}
              area={area}
              onExplore={handleExploreArea}
            />
          ))}
        </div>

        {/* Jornadas Ativas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-foreground">
              Suas Jornadas
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setImportDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Importar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/criar-jornada')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Criar
              </Button>
            </div>
          </div>
          
          {journeys.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {journeys.map((journey) => {
                const completedStages = journey.stages.filter(stage => stage.completed).length;
                const progress = journey.stages.length > 0 ? 
                  (completedStages / journey.stages.length) * 100 : 0;
                const isCompleted = journey.status === 'Concluída';

                return (
                  <Card key={journey.id} className="hover:shadow-lg transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{journey.icon}</span>
                          <CardTitle className="text-lg">{journey.title}</CardTitle>
                        </div>
                        <Badge variant={isCompleted ? "default" : "secondary"}>
                          {isCompleted ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Concluída
                            </>
                          ) : (
                            <>
                              <Play className="h-3 w-3 mr-1" />
                              {journey.status}
                            </>
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {journey.description}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} />
                        <div className="text-xs text-muted-foreground">
                          {completedStages} de {journey.stages.length} etapas completas
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => navigate(`/hero-jornada/${journey.id}`)}
                        className="w-full gap-2"
                        variant="outline"
                      >
                        <Settings className="h-4 w-4" />
                        Gerenciar Jornada
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="text-center p-8">
              <CardContent className="space-y-4">
                <div className="text-4xl mb-4">🚀</div>
                <h4 className="text-lg font-semibold">Comece Sua Primeira Jornada</h4>
                <p className="text-muted-foreground">
                  Importe jornadas prontas ou crie uma personalizada para começar
                </p>
                <div className="flex justify-center gap-2">
                  <Button
                    onClick={() => setImportDialogOpen(true)}
                    className="flex items-center gap-2"
                    variant="outline"
                  >
                    <Upload className="h-4 w-4" />
                    Importar Jornadas
                  </Button>
                  <Button
                    onClick={() => navigate('/criar-jornada')}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Criar Jornada
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Resumo de Progresso */}
        <ProgressSummary />

        {/* Navegação Rápida */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-foreground">
            Navegação Rápida
          </h3>
          <QuickNavigation />
        </div>

        {/* Call to Action */}
        <div className="text-center mystic-card p-8">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Pronto para a Aventura?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Cada passo que você dá é uma vitória. Cada desafio superado te torna mais forte. 
            Desperte o guerreiro que existe dentro de você!
          </p>
          <QuickNavigation />
        </div>
        
        <JourneyImportDialog
          open={importDialogOpen}
          onOpenChange={setImportDialogOpen}
        />
      </div>
    </Layout>
  );
};

export default Game;
