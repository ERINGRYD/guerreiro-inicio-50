
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/GameContext';
import { Heart, Briefcase, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AreaProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  examples: string[];
}

interface AreaCardProps {
  area: AreaProps;
  onExplore: (areaName: string) => void;
}

const AreaCard: React.FC<AreaCardProps> = ({ area, onExplore }) => {
  const navigate = useNavigate();
  const { gameData } = useGame();
  
  const getAreaIcon = (areaId: string) => {
    switch (areaId) {
      case 'bem-estar':
        return <Heart className="w-8 h-8 text-emerald-500" />;
      case 'business':
        return <Briefcase className="w-8 h-8 text-blue-500" />;
      case 'maestria':
        return <Target className="w-8 h-8 text-purple-500" />;
      default:
        return <Target className="w-8 h-8 text-purple-500" />;
    }
  };

  const getAreaColor = (areaId: string) => {
    switch (areaId) {
      case 'bem-estar':
        return 'border-emerald-500/20 hover:border-emerald-500/40 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30';
      case 'business':
        return 'border-blue-500/20 hover:border-blue-500/40 bg-gradient-to-br from-blue-50/50 to-blue-100/30';
      case 'maestria':
        return 'border-purple-500/20 hover:border-purple-500/40 bg-gradient-to-br from-purple-50/50 to-purple-100/30';
      default:
        return 'border-purple-500/20 hover:border-purple-500/40 bg-gradient-to-br from-purple-50/50 to-purple-100/30';
    }
  };

  // Calcular jornadas relacionadas à área
  const areaJourneys = gameData.journeys.filter(journey => 
    journey.title.toLowerCase().includes(area.name.toLowerCase()) ||
    journey.description.toLowerCase().includes(area.name.toLowerCase())
  );

  const completedJourneys = areaJourneys.filter(journey => 
    journey.phases.every(phase => 
      phase.tasks.every(task => task.completed)
    )
  );

  const progress = areaJourneys.length > 0 ? 
    (completedJourneys.length / areaJourneys.length) * 100 : 0;

  const handleExploreArea = () => {
    onExplore(area.name);
    navigate(`/area/${area.id}`);
  };

  return (
    <Card className={`transition-all duration-300 hover:scale-105 hover:shadow-lg ${getAreaColor(area.id)} border-2`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getAreaIcon(area.id)}
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                {area.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {area.description}
              </p>
            </div>
          </div>
          <div className="text-2xl">{area.icon}</div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-foreground">
            Jornadas Ativas
          </span>
          <span className="text-lg font-bold text-primary">
            {areaJourneys.length}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Progresso Geral
            </span>
            <span className="text-sm font-medium text-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground text-center">
            {completedJourneys.length} de {areaJourneys.length} jornadas concluídas
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Exemplos:</p>
          <div className="flex flex-wrap gap-1">
            {area.examples.slice(0, 3).map((example, index) => (
              <span 
                key={index}
                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
              >
                {example}
              </span>
            ))}
          </div>
        </div>
        
        <Button 
          onClick={handleExploreArea}
          className="w-full mt-4"
          variant="outline"
        >
          Explorar Área
        </Button>
      </CardContent>
    </Card>
  );
};

export default AreaCard;
