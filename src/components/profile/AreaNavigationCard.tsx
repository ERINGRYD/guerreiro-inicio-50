
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EpicButton } from '@/components/ui/epic-button';
import { useHero } from '@/contexts/HeroContext';
import { HeroArea } from '@/types/hero';
import { Heart, Briefcase, Target, ArrowRight } from 'lucide-react';

interface AreaNavigationCardProps {
  area: HeroArea;
}

const AreaNavigationCard: React.FC<AreaNavigationCardProps> = ({ area }) => {
  const navigate = useNavigate();
  const { areas, getJourneysByArea, getAreaProgress } = useHero();
  
  const areaConfig = areas[area];
  const areaJourneys = getJourneysByArea(area);
  const progress = getAreaProgress(area);
  
  const getAreaIcon = (area: HeroArea) => {
    switch (area) {
      case 'Bem-Estar':
        return <Heart className="w-8 h-8 text-emerald-500" />;
      case 'Business':
        return <Briefcase className="w-8 h-8 text-blue-500" />;
      case 'Maestria':
        return <Target className="w-8 h-8 text-purple-500" />;
    }
  };

  const getAreaColor = (area: HeroArea) => {
    switch (area) {
      case 'Bem-Estar':
        return 'border-emerald-500/20 hover:border-emerald-500/40 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 hover:shadow-emerald-500/10';
      case 'Business':
        return 'border-blue-500/20 hover:border-blue-500/40 bg-gradient-to-br from-blue-50/50 to-blue-100/30 hover:shadow-blue-500/10';
      case 'Maestria':
        return 'border-purple-500/20 hover:border-purple-500/40 bg-gradient-to-br from-purple-50/50 to-purple-100/30 hover:shadow-purple-500/10';
    }
  };

  const handleExploreArea = () => {
    navigate(`/area/${area.toLowerCase()}`);
  };

  const handleCreateJourney = () => {
    navigate('/criar-jornada', { state: { selectedArea: area } });
  };

  return (
    <Card className={`
      transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer
      ${getAreaColor(area)} border-2 group
    `}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getAreaIcon(area)}
            <div>
              <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {areaConfig.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {areaConfig.description}
              </p>
            </div>
          </div>
          <div className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">
            {areaConfig.icon}
          </div>
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
              {Math.round(progress.percentage)}%
            </span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
          <div className="text-xs text-muted-foreground text-center">
            {progress.completed} de {progress.total} jornadas concluídas
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <EpicButton 
            onClick={handleExploreArea}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Explorar
            <ArrowRight className="w-4 h-4 ml-1" />
          </EpicButton>
          
          <EpicButton 
            onClick={handleCreateJourney}
            variant="hero"
            size="sm"
            className="flex-1"
          >
            Nova Jornada
          </EpicButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default AreaNavigationCard;
