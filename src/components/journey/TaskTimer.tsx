import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square } from 'lucide-react';

interface TaskTimerProps {
  taskId: string;
  onStop: () => void;
}

export function TaskTimer({ taskId, onStop }: TaskTimerProps) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleStop = () => {
    setIsRunning(false);
    setTime(0);
    onStop();
  };

  return (
    <Card className="p-4 bg-muted/50">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-mono font-bold">
          {formatTime(time)}
        </div>
        
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <Button size="sm" onClick={handleStart} className="gap-1">
              <Play className="h-3 w-3" />
              Iniciar
            </Button>
          ) : (
            <Button size="sm" onClick={handlePause} variant="outline" className="gap-1">
              <Pause className="h-3 w-3" />
              Pausar
            </Button>
          )}
          
          <Button size="sm" onClick={handleStop} variant="outline" className="gap-1">
            <Square className="h-3 w-3" />
            Parar
          </Button>
        </div>
      </div>
      
      {time > 0 && (
        <div className="text-xs text-muted-foreground mt-2">
          Tempo registrado para esta tarefa
        </div>
      )}
    </Card>
  );
}