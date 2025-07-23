
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { Crown, Zap, Plus, Play } from 'lucide-react';

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const { gameData, getXPProgress } = useGame();

  if (!gameData.warrior.name) return null;

  const xpProgress = getXPProgress();

  return (
    <div className="mystic-card p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16 ring-4 ring-primary/20">
            <AvatarFallback className="text-2xl bg-gradient-primary text-white">
              {gameData.warrior.symbol}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center space-x-2">
              <span>{gameData.warrior.name}</span>
              <Crown className="w-5 h-5 text-accent" />
            </h1>
            <p className="text-muted-foreground">
              Guerreiro • Nível {gameData.warrior.level}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">
                {xpProgress.current} / {xpProgress.needed} XP
              </span>
            </div>
            <Progress 
              value={xpProgress.percentage} 
              className="w-32 h-2"
            />
            <span className="text-xs text-muted-foreground">
              {xpProgress.needed - xpProgress.current} XP para o próximo nível
            </span>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/criar-jornada')}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Jornada
            </Button>
            <Button onClick={() => navigate('/jogo')}>
              <Play className="h-4 w-4 mr-2" />
              Continuar Jornada
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
