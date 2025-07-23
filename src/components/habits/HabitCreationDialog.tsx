import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Clock, Target, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { RepeatPatternSelector } from './RepeatPatternSelector';
import { 
  HabitFormData, 
  HABIT_FREQUENCY_LABELS, 
  HABIT_DIFFICULTY_LABELS,
  HABIT_CLASSIFICATION_LABELS,
  HABIT_QUANTIFICATION_LABELS,
  HABIT_DIFFICULTY_XP
} from '@/types/habit';

const habitSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'custom']),
  customFrequency: z.object({
    timesPerWeek: z.number().min(1).max(7),
    specificDays: z.array(z.number().min(0).max(6)).optional()
  }).optional(),
  repeatPattern: z.object({
    type: z.enum(['limited', 'unlimited', 'alternating', 'custom_cycle']),
    maxOccurrences: z.number().optional(),
    endAfterDays: z.number().optional(),
    alternatingPattern: z.object({
      activeDays: z.number(),
      restDays: z.number()
    }).optional(),
    customCycle: z.object({
      pattern: z.array(z.number()),
      repeatEveryWeeks: z.number()
    }).optional(),
    skipWeekends: z.boolean().optional(),
    skipHolidays: z.boolean().optional()
  }).optional(),
  quantification: z.object({
    type: z.enum(['repetition', 'time', 'distance', 'weight', 'other']),
    unit: z.string().min(1),
    target: z.number().min(0.1)
  }).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'very-hard']),
  classification: z.enum(['positive', 'negative']),
  psychology: z.object({
    trigger: z.string().min(3, 'Gatilho deve ter pelo menos 3 caracteres'),
    reward: z.string().min(3, 'Recompensa deve ter pelo menos 3 caracteres'),
    objective: z.string().min(3, 'Objetivo deve ter pelo menos 3 caracteres')
  }),
  subHabits: z.array(z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    description: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres'),
    order: z.number()
  })),
  reminderTimes: z.array(z.string()).optional(),
  stageId: z.string(),
  journeyId: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: "Data de fim deve ser posterior à data de início",
  path: ["endDate"]
});

interface HabitCreationDialogProps {
  onCreateHabit: (habitData: HabitFormData) => void;
  trigger?: React.ReactNode;
  defaultStageId?: string;
  defaultJourneyId?: string;
}

const WEEKDAYS = [
  { value: 0, label: 'Dom' },
  { value: 1, label: 'Seg' },
  { value: 2, label: 'Ter' },
  { value: 3, label: 'Qua' },
  { value: 4, label: 'Qui' },
  { value: 5, label: 'Sex' },
  { value: 6, label: 'Sáb' }
];

export const HabitCreationDialog: React.FC<HabitCreationDialogProps> = ({ 
  onCreateHabit, 
  trigger,
  defaultStageId = '',
  defaultJourneyId = ''
}) => {
  const [open, setOpen] = useState(false);
  const [useQuantification, setUseQuantification] = useState(false);
  const [useDateRange, setUseDateRange] = useState(false);
  const [useRepeatPattern, setUseRepeatPattern] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const form = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: '',
      description: '',
      frequency: 'daily',
      difficulty: 'medium',
      classification: 'positive',
      psychology: {
        trigger: '',
        reward: '',
        objective: ''
      },
      subHabits: [],
      reminderTimes: [],
      stageId: defaultStageId,
      journeyId: defaultJourneyId
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'subHabits'
  });

  const watchedValues = form.watch();
  const xpReward = HABIT_DIFFICULTY_XP[watchedValues.difficulty];

  const onSubmit = (data: HabitFormData) => {
    console.log('HabitCreationDialog - Enviando dados:', data);
    onCreateHabit(data);
    setOpen(false);
    form.reset({
      name: '',
      description: '',
      frequency: 'daily',
      difficulty: 'medium',
      classification: 'positive',
      psychology: {
        trigger: '',
        reward: '',
        objective: ''
      },
      subHabits: [],
      reminderTimes: [],
      stageId: defaultStageId,
      journeyId: defaultJourneyId
    });
    setUseQuantification(false);
    setUseDateRange(false);
    setUseRepeatPattern(false);
    setActiveTab('basic');
  };

  const addSubHabit = () => {
    append({
      name: '',
      description: '',
      order: fields.length
    });
  };

  const canProceedToNext = (tab: string) => {
    switch (tab) {
      case 'basic':
        return watchedValues.name && watchedValues.description && watchedValues.frequency;
      case 'quantification':
        return true;
      case 'psychology':
        return watchedValues.psychology.trigger && watchedValues.psychology.reward && watchedValues.psychology.objective;
      default:
        return true;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default">
            <Plus className="w-4 h-4 mr-2" />
            Criar Hábito
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Criar Novo Hábito
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Básico</TabsTrigger>
                <TabsTrigger value="repeat" disabled={!canProceedToNext('basic')}>
                  Repetição
                </TabsTrigger>
                <TabsTrigger value="quantification" disabled={!canProceedToNext('basic')}>
                  Medição
                </TabsTrigger>
                <TabsTrigger value="psychology" disabled={!canProceedToNext('quantification')}>
                  Psicologia
                </TabsTrigger>
                <TabsTrigger value="advanced" disabled={!canProceedToNext('psychology')}>
                  Avançado
                </TabsTrigger>
              </TabsList>

              {/* Basic Information */}
              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Básicas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Hábito *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Exercitar-se 30 minutos" {...field} />
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
                          <FormLabel>Descrição Detalhada *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva o hábito em detalhes, como pretende executá-lo..."
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="frequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frequência *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(HABIT_FREQUENCY_LABELS).map(([key, label]) => (
                                  <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="difficulty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dificuldade *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(HABIT_DIFFICULTY_LABELS).map(([key, label]) => (
                                  <SelectItem key={key} value={key}>
                                    {label} ({HABIT_DIFFICULTY_XP[key as keyof typeof HABIT_DIFFICULTY_XP]} XP)
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="classification"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Classificação *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(HABIT_CLASSIFICATION_LABELS).map(([key, label]) => (
                                  <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Date Range Section */}
                    <Card className="bg-muted/20">
                      <CardContent className="pt-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <Switch
                            checked={useDateRange}
                            onCheckedChange={setUseDateRange}
                          />
                          <FormLabel className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Definir período do hábito
                          </FormLabel>
                        </div>

                        {useDateRange && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="startDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Data de Início</FormLabel>
                                  <FormControl>
                                    <DatePicker
                                      date={field.value ? (() => {
                                        const [year, month, day] = field.value.split('-').map(Number);
                                        return new Date(year, month - 1, day);
                                      })() : undefined}
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
                                    Quando você pretende começar este hábito
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="endDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Data de Fim (Opcional)</FormLabel>
                                  <FormControl>
                                    <DatePicker
                                      date={field.value ? (() => {
                                        const [year, month, day] = field.value.split('-').map(Number);
                                        return new Date(year, month - 1, day);
                                      })() : undefined}
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
                                      placeholder="Quando terminar"
                                      minDate={watchedValues.startDate ? (() => {
                                        const [year, month, day] = watchedValues.startDate.split('-').map(Number);
                                        return new Date(year, month - 1, day);
                                      })() : undefined}
                                      disablePastDates={true}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Para hábitos temporários ou desafios
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {watchedValues.frequency === 'custom' && (
                      <Card className="bg-muted/50">
                        <CardContent className="pt-4">
                          <FormField
                            control={form.control}
                            name="customFrequency.timesPerWeek"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Vezes por Semana</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="1" 
                                    max="7" 
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="mt-4">
                            <FormLabel>Dias Específicos (opcional)</FormLabel>
                            <div className="flex gap-2 mt-2">
                              {WEEKDAYS.map((day) => (
                                <FormField
                                  key={day.value}
                                  control={form.control}
                                  name="customFrequency.specificDays"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(day.value) || false}
                                          onCheckedChange={(checked) => {
                                            const current = field.value || [];
                                            if (checked) {
                                              field.onChange([...current, day.value]);
                                            } else {
                                              field.onChange(current.filter(d => d !== day.value));
                                            }
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm">{day.label}</FormLabel>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="flex justify-end">
                      <Button 
                        type="button"
                        onClick={() => setActiveTab('repeat')}
                        disabled={!canProceedToNext('basic')}
                      >
                        Próximo: Repetição
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Nova aba de Repetição */}
              <TabsContent value="repeat" className="space-y-4">
                <RepeatPatternSelector
                  useRepeatPattern={useRepeatPattern}
                  onToggleRepeatPattern={setUseRepeatPattern}
                />
                
                <div className="flex justify-between">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab('basic')}
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setActiveTab('quantification')}
                  >
                    Próximo: Medição
                  </Button>
                </div>
              </TabsContent>

              {/* Quantification */}
              <TabsContent value="quantification" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Quantificação do Hábito</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={useQuantification}
                        onCheckedChange={setUseQuantification}
                      />
                      <FormLabel>Usar quantificação específica</FormLabel>
                    </div>

                    {useQuantification && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                        <FormField
                          control={form.control}
                          name="quantification.type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Medição</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(HABIT_QUANTIFICATION_LABELS).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="quantification.unit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unidade</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: minutos, kg, km" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="quantification.target"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Meta</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.1"
                                  placeholder="Ex: 30"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    <div className="flex justify-between">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab('repeat')}
                      >
                        Voltar
                      </Button>
                      <Button 
                        type="button"
                        onClick={() => setActiveTab('psychology')}
                      >
                        Próximo: Psicologia
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Psychology */}
              <TabsContent value="psychology" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Psicologia do Hábito</CardTitle>
                    <FormDescription>
                      Defina os aspectos psicológicos que tornarão seu hábito mais efetivo
                    </FormDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="psychology.trigger"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gatilho/Trigger *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Ex: Após escovar os dentes, Quando acordar..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            O que vai disparar este hábito?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="psychology.reward"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recompensa Pessoal *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Ex: Assistir um episódio, Tomar um café especial..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Como você se recompensará após completar?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="psychology.objective"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Objetivo Específico *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Ex: Quero melhorar minha saúde cardiovascular para ter mais energia..."
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Por que este hábito é importante para você?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab('quantification')}
                      >
                        Voltar
                      </Button>
                      <Button 
                        type="button"
                        onClick={() => setActiveTab('advanced')}
                        disabled={!canProceedToNext('psychology')}
                      >
                        Próximo: Avançado
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Advanced */}
              <TabsContent value="advanced" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações Avançadas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Sub-habits */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <FormLabel>Sub-hábitos (opcional)</FormLabel>
                        <Button type="button" variant="outline" size="sm" onClick={addSubHabit}>
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar
                        </Button>
                      </div>

                      {fields.map((field, index) => (
                        <Card key={field.id} className="mb-4">
                          <CardContent className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`subHabits.${index}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Ex: Preparar roupa" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`subHabits.${index}.description`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <div className="flex gap-2">
                                      <FormControl>
                                        <Input placeholder="Breve descrição" {...field} />
                                      </FormControl>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => remove(index)}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* XP Preview */}
                    <Card className="bg-primary/5">
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary mb-2">
                            {xpReward} XP
                          </div>
                          <p className="text-sm text-muted-foreground">
                            XP por conclusão diária
                          </p>
                          <Badge variant="secondary" className="mt-2">
                            {HABIT_DIFFICULTY_LABELS[watchedValues.difficulty]} • {HABIT_CLASSIFICATION_LABELS[watchedValues.classification]}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-between">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab('psychology')}
                      >
                        Voltar
                      </Button>
                      <Button type="submit">
                        Criar Hábito
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
