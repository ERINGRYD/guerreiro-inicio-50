
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Briefcase, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHero } from '@/contexts/HeroContext';
import { HeroArea } from '@/types/hero';

interface AreaHeaderProps {
  area: HeroArea;
}

const AreaHeader: React.FC<AreaHeaderProps> = ({ area }) => {
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

  const getGradientClass = (area: HeroArea) => {
    switch (area) {
      case 'Bem-Estar':
        return 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/30';
      case 'Business':
        return 'bg-gradient-to-r from-blue-500/20 to-blue-600/30';
      case 'Maestria':
        return 'bg-gradient-to-r from-purple-500/20 to-purple-600/30';
    }
  };

  return (
    <Card className={`p-6 ${getGradientClass(area)} border-none`}>
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/jogo')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        {getAreaIcon(area)}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {areaConfig.name}
          </h1>
          <p className="text-lg text-muted-foreground">
            {areaConfig.description}
          </p>
        </div>
        <div className="text-4xl">{areaConfig.icon}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Jornadas Disponíveis</h3>
          <p className="text-2xl font-bold text-primary">{areaJourneys.length}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Jornadas Concluídas</h3>
          <p className="text-2xl font-bold text-primary">{progress.completed}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Progresso Geral</h3>
          <div className="flex items-center gap-2">
            <Progress value={progress.percentage} className="flex-1" />
            <span className="text-sm font-medium text-foreground">
              {Math.round(progress.percentage)}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AreaHeader;
