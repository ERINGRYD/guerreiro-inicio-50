
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Star, Play, CheckCircle, Clock } from 'lucide-react';
import { Journey } from '@/types/hero';
import { useHero } from '@/contexts/HeroContext';

interface JourneyCardProps {
  journey: Journey;
  onStart: (journey: Journey) => void;
}

const JourneyCard: React.FC<JourneyCardProps> = ({ journey, onStart }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { addJourney } = useHero();

  const getStatusIcon = (status: Journey['status']) => {
    switch (status) {
      case 'Concluída':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Em Progresso':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Play className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: Journey['status']) => {
    switch (status) {
      case 'Concluída':
        return 'Concluída';
      case 'Em Progresso':
        return 'Em Progresso';
      default:
        return 'Não Iniciada';
    }
  };

  const getDifficultyLevel = (stages: Journey['stages']) => {
    const stageCount = stages.length;
    if (stageCount <= 2) return 'Fácil';
    if (stageCount <= 3) return 'Médio';
    return 'Avançado';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil':
        return 'bg-green-100 text-green-800';
      case 'Médio':
        return 'bg-yellow-100 text-yellow-800';
      case 'Avançado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = () => {
    if (journey.status === 'Concluída') return 100;
    if (journey.status === 'Em Progresso') {
      const completedStages = journey.stages.filter(stage => stage.completed).length;
      return (completedStages / journey.stages.length) * 100;
    }
    return 0;
  };

  const handleStartJourney = async () => {
    if (journey.status === 'Em Progresso') {
      // Navegar para a jornada em progresso
      onStart(journey);
      return;
    }

    // Criar nova jornada
    const newJourney = await addJourney({
      title: journey.title,
      description: journey.description,
      narrativeType: journey.narrativeType,
      icon: journey.icon,
      area: journey.area,
      graduationMode: journey.graduationMode,
      stages: journey.stages,
      status: 'Em Progresso',
      objectiveType: journey.objectiveType,
      objectiveName: journey.objectiveName,
      objectiveDescription: journey.objectiveDescription,
      objectiveIcon: journey.objectiveIcon,
      totalXpReward: journey.totalXpReward
    });

    if (newJourney) {
      onStart(newJourney);
    }
  };

  const difficulty = getDifficultyLevel(journey.stages);
  const progress = getProgressPercentage();

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{journey.icon}</div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold leading-tight">
                {journey.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(journey.status)}
                <span className="text-sm text-muted-foreground">
                  {getStatusText(journey.status)}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-1"
          >
            <Heart 
              className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}`} 
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {journey.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {journey.narrativeType}
          </Badge>
          <Badge 
            className={`text-xs ${getDifficultyColor(difficulty)}`}
            variant="secondary"
          >
            {difficulty}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {journey.stages.length} etapas
          </Badge>
        </div>

        {progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Progresso</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            {journey.totalXpReward} XP total
          </div>
          <Button 
            onClick={handleStartJourney}
            size="sm"
            className="text-sm"
          >
            {journey.status === 'Em Progresso' ? 'Continuar' : 'Iniciar Jornada'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JourneyCard;
