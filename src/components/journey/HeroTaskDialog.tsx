import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useHero } from '@/contexts/HeroContext';
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
import { RecurrenceDialog } from './RecurrenceDialog';
import { XP_REWARDS, DateUtils } from '@/types/hero';
import { toast } from '@/hooks/use-toast';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  priority: z.enum(['Baixa', 'Média', 'Alta', 'Urgente']),
  estimatedTime: z.number().min(1, 'Tempo estimado deve ser maior que 0').optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  recurrence: z.object({
    enabled: z.boolean(),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'custom']).optional(),
    interval: z.number().optional(),
    daysOfWeek: z.array(z.number()).optional(),
    dayOfMonth: z.number().optional(),
    endDate: z.string().optional(),
    maxOccurrences: z.number().optional()
  }).optional()
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

interface HeroTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  journeyId: number;
  stageId: string;
}

export function HeroTaskDialog({ open, onOpenChange, journeyId, stageId }: HeroTaskDialogProps) {
  const { addTaskToStage } = useHero();
  const [useRecurrence, setUseRecurrence] = useState(false);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'Média',
      estimatedTime: 30,
      recurrence: {
        enabled: false,
        interval: 1
      }
    },
  });

  const selectedPriority = form.watch('priority');
  const startDate = form.watch('startDate');
  const dueDate = form.watch('dueDate');
  const recurrence = form.watch('recurrence');
  const xpReward = XP_REWARDS.task[selectedPriority];

  // Helper function to create local date from string
  const createLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const onSubmit = async (data: TaskFormData) => {
    try {
      const newTask = {
        stageId,
        title: data.title,
        description: data.description || '',
        priority: data.priority,
        estimatedTime: data.estimatedTime,
        startDate: data.startDate,
        dueDate: data.dueDate,
        completed: false,
        subTasks: [],
        timerActive: false,
        timeSpent: 0,
        xpReward,
        ...(data.recurrence?.enabled && { 
          recurrence: { 
            enabled: true,
            frequency: data.recurrence.frequency || 'daily',
            interval: data.recurrence.interval || 1,
            ...(data.recurrence.daysOfWeek && { daysOfWeek: data.recurrence.daysOfWeek }),
            ...(data.recurrence.dayOfMonth && { dayOfMonth: data.recurrence.dayOfMonth }),
            ...(data.recurrence.endDate && { endDate: data.recurrence.endDate }),
            ...(data.recurrence.maxOccurrences && { maxOccurrences: data.recurrence.maxOccurrences })
          } 
        })
      };

      await addTaskToStage(journeyId, stageId, newTask);
      
      const toastMessage = data.recurrence?.enabled 
        ? `"${data.title}" foi adicionada como tarefa recorrente!`
        : `"${data.title}" foi adicionada à etapa!`;
      
      toast({
        title: "✅ Tarefa Criada",
        description: toastMessage,
      });

      form.reset();
      setUseRecurrence(false);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível criar a tarefa. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const getUrgencyIndicator = () => {
    if (!dueDate) return null;
    
    const isOverdue = DateUtils.isOverdue(dueDate);
    const isDueToday = DateUtils.isDueToday(dueDate);
    const isDueSoon = DateUtils.isDueSoon(dueDate);
    
    if (isOverdue) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="w-3 h-3" />
          Vencida
        </Badge>
      );
    }
    
    if (isDueToday) {
      return (
        <Badge variant="secondary" className="gap-1 bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3" />
          Hoje
        </Badge>
      );
    }
    
    if (isDueSoon) {
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Nova Tarefa
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
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Baixa">Baixa (+{XP_REWARDS.task.Baixa} XP)</SelectItem>
                        <SelectItem value="Média">Média (+{XP_REWARDS.task.Média} XP)</SelectItem>
                        <SelectItem value="Alta">Alta (+{XP_REWARDS.task.Alta} XP)</SelectItem>
                        <SelectItem value="Urgente">Urgente (+{XP_REWARDS.task.Urgente} XP)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo Estimado (min)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="30"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <RecurrenceDialog
              useRecurrence={useRecurrence}
              onToggleRecurrence={setUseRecurrence}
            />

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
                    <strong>Prazo:</strong> {DateUtils.formatRelativeDate(dueDate)}
                  </div>
                )}

                {recurrence?.enabled && (
                  <div className="text-sm text-muted-foreground mt-2">
                    <Badge variant="outline" className="text-xs">
                      Tarefa Recorrente
                    </Badge>
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
                {recurrence?.enabled ? 'Criar Tarefa Recorrente' : 'Criar Tarefa'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
