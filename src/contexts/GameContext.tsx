import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage, useBackupRestore } from '@/hooks/useLocalStorage';
import { 
  GameData, 
  WarriorProfile, 
  Journey, 
  Task, 
  Phase, 
  WarriorStats,
  XP_FORMULA,
  INITIAL_JOURNEYS
} from '@/types/warrior';
import { toast } from '@/hooks/use-toast';

// Dados iniciais do jogo
const INITIAL_WARRIOR: WarriorProfile = {
  id: 'warrior-' + Date.now(),
  name: '',
  symbol: '⚔️',
  coreValue: '',
  phrase: '',
  level: 1,
  xp: 0,
  createdAt: new Date(),
  updatedAt: new Date()
};

const INITIAL_STATS: WarriorStats = {
  totalXP: 0,
  level: 1,
  completedTasks: 0,
  completedPhases: 0,
  completedJourneys: 0,
  streak: 0
};

const INITIAL_GAME_DATA: GameData = {
  warrior: INITIAL_WARRIOR,
  journeys: INITIAL_JOURNEYS.map((journey, index) => ({
    ...journey,
    id: `journey-${index + 1}`,
    phases: journey.phases.map((phase, phaseIndex) => ({
      ...phase,
      id: `${journey.title}-phase-${phaseIndex + 1}`,
      tasks: phase.tasks.map((task, taskIndex) => ({
        ...task,
        id: `${journey.title}-task-${taskIndex + 1}`
      }))
    }))
  })),
  stats: INITIAL_STATS,
  settings: {
    notifications: true,
    soundEffects: true,
    theme: 'auto'
  },
  backup: {
    autoBackup: true
  }
};

interface GameContextType {
  gameData: GameData;
  // Warrior actions
  updateWarriorProfile: (updates: Partial<WarriorProfile>) => void;
  // Task actions
  completeTask: (journeyId: string, phaseId: string, taskId: string) => void;
  uncompleteTask: (journeyId: string, phaseId: string, taskId: string) => void;
  addCustomTask: (journeyId: string, phaseId: string, task: Omit<Task, 'id' | 'createdAt'>) => void;
  // Journey/Phase actions
  addCustomJourney: (journey: Omit<Journey, 'id'>) => void;
  addCustomPhase: (journeyId: string, phase: Omit<Phase, 'id'>) => void;
  // Stats and XP
  getXPProgress: () => { current: number; needed: number; percentage: number };
  getLevelProgress: () => { currentLevel: number; nextLevel: number };
  // Backup/Restore
  exportGameData: () => void;
  importGameData: (file: File) => Promise<void>;
  resetGameData: () => void;
  // Streak management
  updateStreak: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameData, setGameData] = useLocalStorage<GameData>('warrior-game-data', INITIAL_GAME_DATA);
  const { exportData, importData, validateBackupData } = useBackupRestore();

  // Calcular estatísticas automaticamente
  const calculatedStats = useMemo(() => {
    const stats = { ...gameData.stats };
    
    // Contar tasks, phases e journeys completadas
    let completedTasks = 0;
    let completedPhases = 0;
    let completedJourneys = 0;
    let totalXP = 0;

    gameData.journeys.forEach(journey => {
      let journeyCompleted = true;
      
      journey.phases.forEach(phase => {
        let phaseCompleted = true;
        
        phase.tasks.forEach(task => {
          if (task.completed) {
            completedTasks++;
            totalXP += task.xpReward;
          } else {
            phaseCompleted = false;
          }
        });
        
        if (phaseCompleted && phase.tasks.length > 0) {
          completedPhases++;
        } else {
          journeyCompleted = false;
        }
      });
      
      if (journeyCompleted && journey.phases.length > 0) {
        completedJourneys++;
      }
    });

    const level = XP_FORMULA.calculateLevelFromXP(totalXP);

    return {
      ...stats,
      totalXP,
      level,
      completedTasks,
      completedPhases,
      completedJourneys
    };
  }, [gameData.journeys, gameData.stats]);

  // Atualizar warrior level baseado no XP
  useEffect(() => {
    const newLevel = calculatedStats.level;
    if (gameData.warrior.level !== newLevel || gameData.warrior.xp !== calculatedStats.totalXP) {
      setGameData(prev => ({
        ...prev,
        warrior: {
          ...prev.warrior,
          level: newLevel,
          xp: calculatedStats.totalXP,
          updatedAt: new Date()
        },
        stats: calculatedStats
      }));

      // Notificar sobre level up
      if (newLevel > gameData.warrior.level) {
        toast({
          title: "🎉 Level Up!",
          description: `Você alcançou o nível ${newLevel}! Continue sua jornada, guerreiro!`,
        });
      }
    }
  }, [calculatedStats, gameData.warrior.level, gameData.warrior.xp, setGameData]);

  const updateWarriorProfile = (updates: Partial<WarriorProfile>) => {
    setGameData(prev => ({
      ...prev,
      warrior: {
        ...prev.warrior,
        ...updates,
        updatedAt: new Date()
      }
    }));
  };

  const completeTask = (journeyId: string, phaseId: string, taskId: string) => {
    setGameData(prev => {
      const updatedData = {
        ...prev,
        journeys: prev.journeys.map(journey => 
          journey.id === journeyId ? {
            ...journey,
            phases: journey.phases.map(phase => {
              if (phase.id === phaseId) {
                const updatedTasks = phase.tasks.map(task =>
                  task.id === taskId ? {
                    ...task,
                    completed: true,
                    completedAt: new Date()
                  } : task
                );
                
                // Verificar se todas as tarefas da fase estão completas
                const allTasksCompleted = updatedTasks.every(task => task.completed);
                
                return {
                  ...phase,
                  tasks: updatedTasks,
                  completed: allTasksCompleted,
                  completedAt: allTasksCompleted ? new Date() : phase.completedAt
                };
              }
              return phase;
            })
          } : journey
        )
      };

      // Verificar se todas as fases da jornada estão completas
      const journey = updatedData.journeys.find(j => j.id === journeyId);
      if (journey) {
        const allPhasesCompleted = journey.phases.every(phase => phase.completed);
        if (allPhasesCompleted && !journey.completed) {
          updatedData.journeys = updatedData.journeys.map(j =>
            j.id === journeyId ? {
              ...j,
              completed: true,
              completedAt: new Date()
            } : j
          );
        }
      }

      return updatedData;
    });

    // Buscar task para mostrar XP ganho
    const journey = gameData.journeys.find(j => j.id === journeyId);
    const phase = journey?.phases.find(p => p.id === phaseId);
    const task = phase?.tasks.find(t => t.id === taskId);
    
    if (task) {
      toast({
        title: "✅ Tarefa Completa!",
        description: `${task.title} - +${task.xpReward} XP`,
      });
    }
  };

  const uncompleteTask = (journeyId: string, phaseId: string, taskId: string) => {
    setGameData(prev => ({
      ...prev,
      journeys: prev.journeys.map(journey => 
        journey.id === journeyId ? {
          ...journey,
          phases: journey.phases.map(phase =>
            phase.id === phaseId ? {
              ...phase,
              tasks: phase.tasks.map(task =>
                task.id === taskId ? {
                  ...task,
                  completed: false,
                  completedAt: undefined
                } : task
              )
            } : phase
          )
        } : journey
      )
    }));
  };

  const addCustomTask = (journeyId: string, phaseId: string, task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: `custom-task-${Date.now()}`,
      createdAt: new Date()
    };

    setGameData(prev => ({
      ...prev,
      journeys: prev.journeys.map(journey => 
        journey.id === journeyId ? {
          ...journey,
          phases: journey.phases.map(phase =>
            phase.id === phaseId ? {
              ...phase,
              tasks: [...phase.tasks, newTask]
            } : phase
          )
        } : journey
      )
    }));
  };

  const addCustomJourney = (journey: Omit<Journey, 'id'>) => {
    const newJourney: Journey = {
      ...journey,
      id: `custom-journey-${Date.now()}`
    };

    setGameData(prev => ({
      ...prev,
      journeys: [...prev.journeys, newJourney]
    }));
  };

  const addCustomPhase = (journeyId: string, phase: Omit<Phase, 'id'>) => {
    const newPhase: Phase = {
      ...phase,
      id: `custom-phase-${Date.now()}`
    };

    setGameData(prev => ({
      ...prev,
      journeys: prev.journeys.map(journey => 
        journey.id === journeyId ? {
          ...journey,
          phases: [...journey.phases, newPhase]
        } : journey
      )
    }));
  };

  const getXPProgress = () => {
    return XP_FORMULA.getXPProgressForCurrentLevel(calculatedStats.totalXP);
  };

  const getLevelProgress = () => {
    return {
      currentLevel: calculatedStats.level,
      nextLevel: calculatedStats.level + 1
    };
  };

  const exportGameData = () => {
    const success = exportData(gameData, 'warrior-game-backup');
    if (success) {
      setGameData(prev => ({
        ...prev,
        backup: {
          ...prev.backup,
          lastBackup: new Date()
        }
      }));
      toast({
        title: "📦 Backup Criado",
        description: "Seus dados foram salvos com sucesso!",
      });
    } else {
      toast({
        title: "❌ Erro no Backup",
        description: "Não foi possível criar o backup.",
        variant: "destructive"
      });
    }
  };

  const importGameData = async (file: File) => {
    try {
      const data = await importData(file);
      
      if (!validateBackupData(data)) {
        throw new Error('Formato de backup inválido');
      }

      setGameData(data);
      toast({
        title: "📥 Dados Restaurados",
        description: "Seus dados foram restaurados com sucesso!",
      });
    } catch (error) {
      toast({
        title: "❌ Erro na Restauração",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  };

  const resetGameData = () => {
    setGameData(INITIAL_GAME_DATA);
    toast({
      title: "🔄 Dados Resetados",
      description: "Seus dados foram resetados. Uma nova jornada começou!",
    });
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActivity = gameData.stats.lastActivityDate?.toDateString();
    
    if (lastActivity !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      let newStreak = 1;
      if (lastActivity === yesterday.toDateString()) {
        newStreak = gameData.stats.streak + 1;
      }

      setGameData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          streak: newStreak,
          lastActivityDate: new Date()
        }
      }));
    }
  };

  // Auto-backup periódico
  useEffect(() => {
    if (gameData.backup.autoBackup) {
      const interval = setInterval(() => {
        const lastBackup = gameData.backup.lastBackup;
        const daysSinceBackup = lastBackup ? 
          Math.floor((Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24)) : 
          Infinity;
        
        if (daysSinceBackup >= 7) { // Backup automático a cada 7 dias
          exportGameData();
        }
      }, 1000 * 60 * 60); // Verificar a cada hora

      return () => clearInterval(interval);
    }
  }, [gameData.backup, exportGameData]);

  const contextValue: GameContextType = {
    gameData,
    updateWarriorProfile,
    completeTask,
    uncompleteTask,
    addCustomTask,
    addCustomJourney,
    addCustomPhase,
    getXPProgress,
    getLevelProgress,
    exportGameData,
    importGameData,
    resetGameData,
    updateStreak
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame deve ser usado dentro de um GameProvider');
  }
  return context;
};