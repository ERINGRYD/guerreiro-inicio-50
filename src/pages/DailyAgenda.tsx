import { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Calendar, 
  Clock, 
  Trophy, 
  Target, 
  Flame, 
  CheckCircle2, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Play,
  Zap
} from 'lucide-react';
import { useHeroProfile, useJourneys } from '@/hooks/useHeroDatabase';
import { Task, Journey, XP_SYSTEM, HERO_AREAS, DateUtils } from '@/types/hero';
import { Habit, HABIT_FREQUENCY_LABELS } from '@/types/habit';
import { db } from '@/lib/database';
import { format, addDays, subDays, isToday, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import { shouldTaskAppearOnDate, shouldHabitAppearOnDate } from '@/utils/dateFiltering';

type FilterType = 'all' | 'tasks' | 'habits';
type AreaFilter = 'all' | 'Bem-Estar' | 'Business' | 'Maestria';

const DailyAgenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [areaFilter, setAreaFilter] = useState<AreaFilter>('all');
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [todayHabits, setTodayHabits] = useState<Habit[]>([]);
  const [todayXpGained, setTodayXpGained] = useState(0);
  
  const { profile, addXP } = useHeroProfile();
  const { journeys } = useJourneys();

  // Carregar tarefas do dia - MELHORADO
  useEffect(() => {
    const loadTodayTasks = async () => {
      try {
        console.log('DailyAgenda - Carregando tarefas para:', format(currentDate, 'yyyy-MM-dd'));
        
        const allTasks = await db.tasks.toArray();
        console.log('DailyAgenda - Todas as tarefas no banco:', allTasks.length);
        
        const filteredTasks = allTasks.filter(task => 
          shouldTaskAppearOnDate(task, currentDate, {
            includeOverdue: true,
            includeHighPriorityWithoutDate: true,
            includeStartingSoon: true
          })
        );

        console.log('DailyAgenda - Tarefas filtradas por data:', filteredTasks.length);
        console.log('DailyAgenda - Detalhes das tarefas filtradas:', filteredTasks.map(t => ({
          title: t.title,
          dueDate: t.dueDate,
          startDate: t.startDate,
          priority: t.priority,
          completed: t.completed,
          recurrence: t.recurrence
        })));
        
        setTodayTasks(filteredTasks);
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
      }
    };

    loadTodayTasks();
  }, [currentDate]);

  // Carregar hábitos do dia - MELHORADO
  useEffect(() => {
    const loadTodayHabits = async () => {
      try {
        console.log('DailyAgenda - Carregando hábitos para:', format(currentDate, 'yyyy-MM-dd'));
        
        const allHabits = await db.habits.toArray();
        console.log('DailyAgenda - Todos os hábitos no banco:', allHabits.length);
        console.log('DailyAgenda - Detalhes dos hábitos:', allHabits.map(h => ({
          id: h.id,
          name: h.name,
          frequency: h.frequency,
          customFrequency: h.customFrequency,
          isActive: h.isActive,
          startDate: h.startDate,
          endDate: h.endDate
        })));
        
        // Converter hábitos do novo sistema para o sistema antigo para compatibilidade
        const filteredHabits = allHabits.filter((habit: any) => {
          // Mapear frequency do novo sistema para o antigo
          const heroHabit = {
            ...habit,
            frequency: habit.frequency === 'daily' ? 'Diário' :
                      habit.frequency === 'weekly' ? 'Semanal' :
                      habit.frequency === 'monthly' ? 'Mensal' :
                      habit.frequency === 'custom' ? 'Personalizado' :
                      'Diário', // fallback
            frequencyCount: habit.customFrequency?.timesPerWeek || undefined
          };
          return shouldHabitAppearOnDate(heroHabit, currentDate);
        });

        console.log('DailyAgenda - Hábitos filtrados por data:', filteredHabits.length);
        console.log('DailyAgenda - Detalhes dos hábitos filtrados:', filteredHabits.map(h => ({
          name: h.name,
          frequency: h.frequency,
          customFrequency: h.customFrequency
        })));
        
        setTodayHabits(filteredHabits);
      } catch (error) {
        console.error('Erro ao carregar hábitos:', error);
      }
    };

    loadTodayHabits();
  }, [currentDate]);

  // Calcular XP ganho hoje
  useEffect(() => {
    const today = format(currentDate, 'yyyy-MM-dd');
    const completedTasks = todayTasks.filter(task => 
      task.completed && task.completedAt && 
      format(new Date(task.completedAt), 'yyyy-MM-dd') === today
    );
    
    const completedHabits = todayHabits.filter(habit =>
      habit.completions.some(c => c.date === today && c.completed)
    );

    const xpFromTasks = completedTasks.reduce((total, task) => total + (task.xpReward || 0), 0);
    const xpFromHabits = completedHabits.reduce((total, habit) => total + habit.xpPerCompletion, 0);
    
    setTodayXpGained(xpFromTasks + xpFromHabits);
  }, [todayTasks, todayHabits, currentDate]);

  // Filtrar itens - CORRIGIDO
  const filteredItems = useMemo(() => {
    let tasks = todayTasks;
    let habitsToShow = todayHabits;

    console.log('DailyAgenda - Aplicando filtros. Area:', areaFilter);

    if (areaFilter !== 'all') {
      // Filtrar por área usando journeyId
      const journeysInArea = journeys.filter(j => j.area === areaFilter);
      const journeyIds = journeysInArea.map(j => j.id);
      
      console.log('DailyAgenda - Jornadas na área', areaFilter, ':', journeyIds);
      
      // Filtrar tarefas por journeyId
      tasks = tasks.filter(task => {
        const matches = task.journeyId && journeyIds.includes(Number(task.journeyId));
        console.log(`Tarefa "${task.title}" - journeyId: ${task.journeyId}, matches: ${matches}`);
        return matches;
      });
      
      // Filtrar hábitos por journeyId
      habitsToShow = habitsToShow.filter(habit => {
        const matches = habit.journeyId && journeyIds.includes(Number(habit.journeyId));
        console.log(`Hábito "${habit.name}" - journeyId: ${habit.journeyId}, matches: ${matches}`);
        return matches;
      });
    }

    console.log('DailyAgenda - Itens filtrados:', { tasks: tasks.length, habits: habitsToShow.length });

    return { tasks, habits: habitsToShow };
  }, [todayTasks, todayHabits, areaFilter, journeys]);

  const handleTaskComplete = async (task: Task) => {
    try {
      const updatedTask = {
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : undefined
      };

      // Atualizar na tabela tasks
      await db.tasks.update(task.id!, updatedTask);
      
      // IMPORTANTE: Também atualizar na jornada para manter sincronização
      if (task.journeyId) {
        const journey = journeys.find(j => j.id === Number(task.journeyId));
        if (journey) {
          const updatedStages = journey.stages.map(stage => {
            if (stage.id === task.stageId) {
              const updatedTasks = stage.tasks.map(t => 
                t.id === task.id ? updatedTask : t
              );
              return { ...stage, tasks: updatedTasks };
            }
            return stage;
          });
          
          // Usar importação dinâmica para evitar dependência circular
          const { useJourneys } = await import('@/hooks/useHeroDatabase');
          // Esta é uma solução temporária - idealmente deveria usar o contexto
        }
      }
      
      setTodayTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));

      if (!task.completed) {
        const xpReward = task.xpReward || 10;
        await addXP(xpReward);
        
        toast({
          title: "🎯 Tarefa Concluída!",
          description: `+${xpReward} XP ganho!`,
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const handleHabitComplete = async (habit: Habit) => {
    try {
      const today = format(currentDate, 'yyyy-MM-dd');
      const existingCompletion = habit.completions.find(c => c.date === today);
      const isCompleted = existingCompletion?.completed || false;
      
      let updatedCompletions = habit.completions.filter(c => c.date !== today);
      
      if (!isCompleted) {
        updatedCompletions.push({
          date: today,
          completed: true
        });
      }

      // Recalcular streak
      const newStreak = calculateHabitStreak(updatedCompletions);

      const updatedHabit = {
        ...habit,
        completions: updatedCompletions,
        streak: newStreak,
        updatedAt: new Date().toISOString()
      };

      await db.habits.update(habit.id, updatedHabit);
      setTodayHabits(prev => prev.map(h => h.id === habit.id ? updatedHabit : h));

      if (!isCompleted) {
        await addXP(habit.xpPerCompletion);
        
        toast({
          title: "🔥 Hábito Concluído!",
          description: `+${habit.xpPerCompletion} XP ganho!`,
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar hábito:', error);
    }
  };

  const getTaskPriorityColor = (priority: string, isOverdue: boolean) => {
    if (isOverdue) return 'destructive';
    switch (priority) {
      case 'Urgente': return 'destructive';
      case 'Alta': return 'destructive';
      case 'Média': return 'default';
      case 'Baixa': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTaskStatus = (task: Task) => {
    if (task.completed) return 'completed';
    if (task.dueDate && DateUtils.isOverdue(task.dueDate)) return 'overdue';
    if (task.dueDate && DateUtils.isDueToday(task.dueDate)) return 'today';
    return 'pending';
  };

  const calculateHabitStreak = (completions: any[]) => {
    const completedDates = completions
      .filter(c => c.completed)
      .map(c => c.date)
      .sort()
      .reverse();

    let currentStreak = 0;
    let checkDate = new Date();
    
    for (const dateStr of completedDates) {
      const completionDate = new Date(dateStr);
      const diffDays = Math.floor((checkDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === currentStreak) {
        currentStreak++;
        checkDate = new Date(completionDate);
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return {
      current: currentStreak,
      best: Math.max(currentStreak, 0), // Simplified for now
      lastCompletionDate: completedDates[0]
    };
  };

  const isHabitCompletedToday = (habit: Habit) => {
    const today = format(currentDate, 'yyyy-MM-dd');
    return habit.completions.some(c => c.date === today && c.completed);
  };

  const activeJourneys = journeys.filter(j => j.status === 'Em Progresso');
  const completedToday = todayTasks.filter(t => t.completed).length + 
                         todayHabits.filter(h => isHabitCompletedToday(h)).length;
  const totalToday = todayTasks.length + todayHabits.length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header com Perfil do Herói */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 ring-2 ring-primary">
                  <AvatarImage src={profile?.avatar} />
                  <AvatarFallback className="bg-primary text-white text-lg">
                    {profile?.heroName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h1 className="text-2xl font-bold">{profile?.heroName}</h1>
                  <p className="text-muted-foreground">{profile?.heroClass} • Nível {profile?.level}</p>
                  
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 max-w-xs">
                        <Progress 
                          value={XP_SYSTEM.calculateXpProgress(profile?.totalXp || 0).percentage} 
                          className="h-2"
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {XP_SYSTEM.calculateXpProgress(profile?.totalXp || 0).current} / {XP_SYSTEM.calculateXpProgress(profile?.totalXp || 0).needed} XP
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">+{todayXpGained} XP hoje</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navegação de Data */}
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentDate(subDays(currentDate, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="text-center">
                  <p className="font-semibold">
                    {format(currentDate, 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {format(currentDate, 'EEEE', { locale: ptBR })}
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentDate(addDays(currentDate, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Resumo do Progresso */}
            <div className="mt-4 grid grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{completedToday}</p>
                <p className="text-sm text-muted-foreground">Concluídos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{totalToday}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{activeJourneys.length}</p>
                <p className="text-sm text-muted-foreground">Jornadas Ativas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">{Math.round((completedToday / Math.max(totalToday, 1)) * 100)}%</p>
                <p className="text-sm text-muted-foreground">Progresso</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtros */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>
            
            <Tabs value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="tasks">Tarefas</TabsTrigger>
                <TabsTrigger value="habits">Hábitos</TabsTrigger>
              </TabsList>
            </Tabs>

            <Tabs value={areaFilter} onValueChange={(value) => setAreaFilter(value as AreaFilter)}>
              <TabsList>
                <TabsTrigger value="all">Todas Áreas</TabsTrigger>
                <TabsTrigger value="Bem-Estar">🌱 Bem-Estar</TabsTrigger>
                <TabsTrigger value="Business">💼 Business</TabsTrigger>
                <TabsTrigger value="Maestria">🎯 Maestria</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tarefas do Dia */}
          {(filterType === 'all' || filterType === 'tasks') && (
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Tarefas do Dia</span>
                    <Badge variant="secondary">{filteredItems.tasks.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {filteredItems.tasks.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p>Nenhuma tarefa para hoje! 🎉</p>
                      <p className="text-sm mt-2">
                        Debug: {todayTasks.length} tarefas carregadas, filtro área: {areaFilter}
                      </p>
                    </div>
                  ) : (
                    filteredItems.tasks
                      .sort((a, b) => {
                        const aStatus = getTaskStatus(a);
                        const bStatus = getTaskStatus(b);
                        
                        if (aStatus === 'overdue' && bStatus !== 'overdue') return -1;
                        if (bStatus === 'overdue' && aStatus !== 'overdue') return 1;
                        
                        const priorityOrder = { 'Urgente': 0, 'Alta': 1, 'Média': 2, 'Baixa': 3 };
                        return priorityOrder[a.priority] - priorityOrder[b.priority];
                      })
                      .map((task) => {
                        const status = getTaskStatus(task);
                        const isOverdue = status === 'overdue';
                        
                        return (
                          <div
                            key={task.id}
                            className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                              task.completed 
                                ? 'bg-muted/50 opacity-75' 
                                : isOverdue 
                                  ? 'bg-destructive/10 border-destructive/20' 
                                  : 'bg-background hover:bg-muted/50'
                            }`}
                          >
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => handleTaskComplete(task)}
                              className="flex-shrink-0"
                            />
                            
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {task.title}
                              </h4>
                              {task.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {task.description}
                                </p>
                              )}
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge 
                                  variant={getTaskPriorityColor(task.priority, isOverdue)}
                                  className="text-xs"
                                >
                                  {task.priority}
                                </Badge>
                                {task.dueDate && (
                                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>{DateUtils.formatRelativeDate(task.dueDate)}</span>
                                  </div>
                                )}
                                {task.xpReward && (
                                  <div className="flex items-center space-x-1 text-xs text-yellow-600">
                                    <Zap className="h-3 w-3" />
                                    <span>+{task.xpReward} XP</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {isOverdue && (
                              <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
                            )}
                          </div>
                        );
                      })
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Hábitos do Dia */}
          {(filterType === 'all' || filterType === 'habits') && (
            <div className={filterType === 'habits' ? 'lg:col-span-3' : ''}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Flame className="h-5 w-5" />
                    <span>Hábitos do Dia</span>
                    <Badge variant="secondary">{filteredItems.habits.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {filteredItems.habits.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p>Nenhum hábito para hoje.</p>
                      <p className="text-sm mt-2">
                        Debug: {todayHabits.length} hábitos carregados, filtro área: {areaFilter}
                      </p>
                    </div>
                  ) : (
                    filteredItems.habits.map((habit) => {
                      const isCompleted = isHabitCompletedToday(habit);
                      const streak = habit.streak.current;
                      
                      return (
                        <div
                          key={habit.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                            isCompleted 
                              ? 'bg-muted/50 opacity-75' 
                              : 'bg-background hover:bg-muted/50'
                          }`}
                        >
                          <Checkbox
                            checked={isCompleted}
                            onCheckedChange={() => handleHabitComplete(habit)}
                            className="flex-shrink-0"
                          />
                          
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                              {habit.name}
                            </h4>
                            {habit.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {habit.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {HABIT_FREQUENCY_LABELS[habit.frequency]}
                              </Badge>
                              {streak > 0 && (
                                <div className="flex items-center space-x-1 text-xs text-orange-600">
                                  <Flame className="h-3 w-3" />
                                  <span>{streak} dias</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1 text-xs text-yellow-600">
                                <Zap className="h-3 w-3" />
                                <span>+{habit.xpPerCompletion} XP</span>
                              </div>
                            </div>
                          </div>

                          {habit.quantification?.type === 'time' && (
                            <Button size="sm" variant="outline">
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Resumo de Jornadas */}
          {filterType === 'all' && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5" />
                    <span>Jornadas Ativas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeJourneys.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      Nenhuma jornada ativa.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {activeJourneys.slice(0, 3).map((journey) => {
                        const completedStages = journey.stages.filter(s => s.completed).length;
                        const totalStages = journey.stages.length;
                        const progress = totalStages > 0 ? (completedStages / totalStages) * 100 : 0;
                        
                        return (
                          <div key={journey.id} className="p-3 rounded-lg border">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg">{HERO_AREAS[journey.area].icon}</span>
                              <h4 className="font-medium text-sm">{journey.title}</h4>
                            </div>
                            <Progress value={progress} className="h-2 mb-2" />
                            <p className="text-xs text-muted-foreground">
                              {completedStages}/{totalStages} etapas concluídas
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DailyAgenda;
