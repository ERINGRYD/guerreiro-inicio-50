import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface HabitTimerProps {
  onTimeComplete: (timeInMinutes: number) => void;
  targetMinutes?: number;
  className?: string;
}

export const HabitTimer: React.FC<HabitTimerProps> = ({ 
  onTimeComplete, 
  targetMinutes,
  className 
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  
  const handleStop = () => {
    setIsRunning(false);
    const timeInMinutes = Math.floor(seconds / 60);
    if (timeInMinutes > 0) {
      onTimeComplete(timeInMinutes);
    }
    setSeconds(0);
  };

  const progressPercentage = targetMinutes 
    ? Math.min((seconds / (targetMinutes * 60)) * 100, 100)
    : 0;

  return (
    <Card className={className}>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Timer className="w-5 h-5 text-primary" />
            <div>
              <div className="font-mono text-2xl font-bold">
                {formatTime(seconds)}
              </div>
              {targetMinutes && (
                <div className="text-xs text-muted-foreground">
                  Meta: {targetMinutes} min ({progressPercentage.toFixed(0)}%)
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            {!isRunning ? (
              <Button size="sm" onClick={handleStart} variant="default">
                <Play className="w-4 h-4" />
              </Button>
            ) : (
              <Button size="sm" onClick={handlePause} variant="outline">
                <Pause className="w-4 h-4" />
              </Button>
            )}
            <Button 
              size="sm" 
              onClick={handleStop} 
              variant="outline"
              disabled={seconds === 0}
            >
              <Square className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {targetMinutes && (
          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};