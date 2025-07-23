
import React, { useState } from 'react';
import { Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { HabitCreationDialog } from './HabitCreationDialog';
import { HabitCard } from './HabitCard';
import { HabitCalendar } from './HabitCalendar';
import { HabitStats } from './HabitStats';
import { HabitOverview } from './HabitOverview';
import { Habit, HabitFormData, HabitCompletion, HABIT_DIFFICULTY_XP } from '@/types/habit';

interface HabitManagementProps {
  stageId: string;
  journeyId: string;
  habits: Habit[];
  habitsLoading: boolean;
  onCreateHabit: (habitData: HabitFormData) => Promise<void>;
  onUpdateHabit: (habitId: string, updates: Partial<Habit>) => Promise<void>;
  onToggleCompletion: (habitId: string, completion: Omit<HabitCompletion, 'date'>) => Promise<void>;
  onUpdateSubHabit?: (habitId: string, subHabitId: string, completed: boolean) => Promise<void>;
}

export const HabitManagement: React.FC<HabitManagementProps> = ({
  stageId,
  journeyId,
  habits,
  habitsLoading,
  onCreateHabit,
  onUpdateHabit,
  onToggleCompletion,
  onUpdateSubHabit
}) => {
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  console.log('HabitManagement - Props recebidas:');
  console.log('HabitManagement - StageId:', stageId);
  console.log('HabitManagement - JourneyId:', journeyId);
  console.log('HabitManagement - Habits recebidos:', habits.length);
  console.log('HabitManagement - Habits details:', habits.map(h => ({
    id: h.id,
    name: h.name,
    stageId: h.stageId,
    journeyId: h.journeyId,
    isActive: h.isActive
  })));

  // Filter habits for this stage - The filtering should already be done by the parent
  // but we'll double-check here for safety
  const stageHabits = habits.filter(habit => {
    const isCorrectStage = habit.stageId === stageId;
    const isActive = habit.isActive;
    
    console.log(`HabitManagement - Verificando hábito ${habit.name}: stageId=${habit.stageId}, esperado=${stageId}, match=${isCorrectStage}, active=${isActive}`);
    
    return isCorrectStage && isActive;
  });
  
  console.log('HabitManagement - Stage habits filtrados:', stageHabits.length);

  const handleCreateHabit = async (habitData: HabitFormData) => {
    try {
      console.log('HabitManagement - Criando hábito para stage:', stageId);
      console.log('HabitManagement - Dados do hábito:', habitData);
      
      // Ensure the habit is created with the correct stageId and journeyId
      const habitDataWithIds = {
        ...habitData,
        stageId: stageId,
        journeyId: journeyId
      };
      
      console.log('HabitManagement - Dados finais para criação:', habitDataWithIds);
      
      await onCreateHabit(habitDataWithIds);
      console.log('HabitManagement - Hábito criado com sucesso');
    } catch (error) {
      console.error('HabitManagement - Erro ao criar hábito:', error);
    }
  };

  if (habitsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Hábitos</h2>
          <p className="text-muted-foreground">
            Crie e acompanhe hábitos para esta etapa ({stageHabits.length} hábitos)
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Stage: {stageId} | Journey: {journeyId}
          </p>
        </div>
        <HabitCreationDialog 
          onCreateHabit={handleCreateHabit}
          defaultStageId={stageId}
          defaultJourneyId={journeyId}
        />
      </div>

      {/* Stats Overview */}
      <HabitOverview habits={stageHabits} />

      {/* Content */}
      {stageHabits.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum hábito criado</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando seu primeiro hábito para esta etapa
              </p>
              <HabitCreationDialog 
                onCreateHabit={handleCreateHabit}
                defaultStageId={stageId}
                defaultJourneyId={journeyId}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="habits" className="space-y-4">
          <TabsList>
            <TabsTrigger value="habits">Hábitos ({stageHabits.length})</TabsTrigger>
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
          </TabsList>

          <TabsContent value="habits" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stageHabits.map(habit => (
                <HabitCard
                  key={`habit-${habit.id}`}
                  habit={habit}
                  onToggleCompletion={onToggleCompletion}
                  onUpdateValue={(habitId, value, notes) => {
                    onToggleCompletion(habitId, {
                      completed: true,
                      value,
                      notes
                    });
                  }}
                  onUpdateSubHabit={onUpdateSubHabit}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            {selectedHabit ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Calendário: {selectedHabit.name}
                  </h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedHabit(null)}
                  >
                    Ver Todos
                  </Button>
                </div>
                <HabitCalendar habit={selectedHabit} />
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Selecione um hábito</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stageHabits.map(habit => (
                    <Card 
                      key={`calendar-habit-${habit.id}`}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedHabit(habit)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{habit.name}</h4>
                          <Badge variant="secondary">
                            {habit.streak.current} dias
                          </Badge>
                        </div>
                        <Progress 
                          value={habit.stats.successRate} 
                          className="h-2" 
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          {habit.stats.successRate.toFixed(1)}% sucesso
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <HabitStats habits={stageHabits} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
