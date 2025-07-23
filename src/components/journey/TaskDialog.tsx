import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGame } from '@/contexts/GameContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { XP_REWARDS } from '@/types/warrior';
import { toast } from '@/hooks/use-toast';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'epic']),
  category: z.enum(['physical', 'mental', 'spiritual', 'social', 'creative']),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
}).refine((data) => {
  if (data.startDate && data.dueDate) {
    return new Date(data.startDate) <= new Date(data.dueDate);
  }
  return true;
}, {
  message: "Data de vencimento deve ser posterior à data de início",
  path: ["dueDate"]
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  journeyId: string;
  phaseId: string;
  taskId?: string | null;
}

// Helper function for date formatting
const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Amanhã';
  if (diffDays === -1) return 'Ontem';
  if (diffDays < 0) return `${Math.abs(diffDays)} dias atrás`;
  return `Em ${diffDays} dias`;
};

const isOverdue = (dueDate: string): boolean => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return new Date(dueDate) < today;
};

const isDueToday = (dueDate: string): boolean => {
  const today = new Date();
  const due = new Date(dueDate);
  return today.toDateString() === due.toDateString();
};

const isDueSoon = (dueDate: string, daysAhead: number = 3): boolean => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= daysAhead && diffDays >= 0;
};

export function TaskDialog({ open, onOpenChange, journeyId, phaseId, taskId }: TaskDialogProps) {
  const { addCustomTask, gameData } = useGame();

  // Buscar tarefa existente se editando
  const existingTask = taskId ? 
    gameData.journeys.find(j => j.id === journeyId)
      ?.phases.find(p => p.id === phaseId)
      ?.tasks.find(t => t.id === taskId) 
    : null;

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: existingTask?.title || '',
      description: existingTask?.description || '',
      difficulty: existingTask?.difficulty || 'easy',
      category: existingTask?.category || 'mental',
    },
  });

  const selectedDifficulty = form.watch('difficulty');
  const startDate = form.watch('startDate');
  const dueDate = form.watch('dueDate');
  const xpReward = XP_REWARDS[selectedDifficulty];

  // Helper function to create local date from string
  const createLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const onSubmit = (data: TaskFormData) => {
    if (taskId) {
      // TODO: Implementar edição de tarefa
      toast({
        title: "⚠️ Em Desenvolvimento",
        description: "Edição de tarefas será implementada em breve.",
      });
      return;
    }

    const newTask = {
      title: data.title,
      description: data.description || '',
      difficulty: data.difficulty,
      category: data.category,
      startDate: data.startDate,
      dueDate: data.dueDate,
      xpReward,
      completed: false,
    };

    addCustomTask(journeyId, phaseId, newTask);
    
    toast({
      title: "✅ Tarefa Criada",
      description: `"${data.title}" foi adicionada à fase!`,
    });

    form.reset();
    onOpenChange(false);
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      case 'epic': return 'Épico';
      default: return difficulty;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'physical': return 'Físico';
      case 'mental': return 'Mental';
      case 'spiritual': return 'Espiritual';
      case 'social': return 'Social';
      case 'creative': return 'Criativo';
      default: return category;
    }
  };

  const getUrgencyIndicator = () => {
    if (!dueDate) return null;
    
    const overdue = isOverdue(dueDate);
    const today = isDueToday(dueDate);
    const soon = isDueSoon(dueDate);
    
    if (overdue) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="w-3 h-3" />
          Vencida
        </Badge>
      );
    }
    
    if (today) {
      return (
        <Badge variant="secondary" className="gap-1 bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3" />
          Hoje
        </Badge>
      );
    }
    
    if (soon) {
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="w-3 h-3" />
          Próxima
        </Badge>
      );
    }
    
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {taskId ? 'Editar Tarefa' : 'Nova Tarefa'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Tarefa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Meditar por 10 minutos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detalhe a tarefa..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dificuldade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="easy">Fácil (+{XP_REWARDS.easy} XP)</SelectItem>
                        <SelectItem value="medium">Médio (+{XP_REWARDS.medium} XP)</SelectItem>
                        <SelectItem value="hard">Difícil (+{XP_REWARDS.hard} XP)</SelectItem>
                        <SelectItem value="epic">Épico (+{XP_REWARDS.epic} XP)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="physical">Físico</SelectItem>
                        <SelectItem value="mental">Mental</SelectItem>
                        <SelectItem value="spiritual">Espiritual</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="creative">Criativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início (Opcional)</FormLabel>
                    <FormControl>
                       <DatePicker
                        date={field.value ? createLocalDate(field.value) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            field.onChange(`${year}-${month}-${day}`);
                          } else {
                            field.onChange(undefined);
                          }
                        }}
                        placeholder="Quando começar"
                        disablePastDates={true}
                      />
                    </FormControl>
                    <FormDescription>
                      Quando planeja começar esta tarefa
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prazo (Opcional)</FormLabel>
                    <FormControl>
                       <DatePicker
                        date={field.value ? createLocalDate(field.value) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            field.onChange(`${year}-${month}-${day}`);
                          } else {
                            field.onChange(undefined);
                          }
                        }}
                        placeholder="Prazo limite"
                        minDate={startDate ? createLocalDate(startDate) : new Date()}
                        disablePastDates={true}
                      />
                    </FormControl>
                    <FormDescription>
                      Data limite para conclusão
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Preview Section */}
            <Card className="bg-muted/20">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <strong>XP da Tarefa:</strong> +{xpReward} pontos
                  </div>
                  {getUrgencyIndicator()}
                </div>
                
                {dueDate && (
                  <div className="text-sm text-muted-foreground mt-2">
                    <strong>Prazo:</strong> {formatRelativeDate(dueDate)}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {taskId ? 'Salvar' : 'Criar Tarefa'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
