
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { Repeat, Calendar, Clock } from 'lucide-react';
import { TaskRecurrence, TASK_RECURRENCE_LABELS } from '@/types/repeat';

interface RecurrenceDialogProps {
  useRecurrence: boolean;
  onToggleRecurrence: (enabled: boolean) => void;
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

// Helper function to create local date from string
const createLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const RecurrenceDialog: React.FC<RecurrenceDialogProps> = ({
  useRecurrence,
  onToggleRecurrence
}) => {
  const form = useFormContext();
  const watchedRecurrence = form.watch('recurrence') as TaskRecurrence;

  const renderFrequencySpecificFields = () => {
    if (!watchedRecurrence?.frequency) return null;

    switch (watchedRecurrence.frequency) {
      case 'weekly':
        return (
          <FormField
            control={form.control}
            name="recurrence.daysOfWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dias da Semana</FormLabel>
                <div className="flex gap-2 mt-2">
                  {WEEKDAYS.map((day) => (
                    <FormItem key={day.value} className="flex flex-col items-center space-y-2">
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
                      <FormLabel className="text-xs">{day.label}</FormLabel>
                    </FormItem>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'monthly':
        return (
          <FormField
            control={form.control}
            name="recurrence.dayOfMonth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia do Mês</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    max="31"
                    placeholder="Ex: 15"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormDescription>
                  Em qual dia do mês a tarefa deve se repetir
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  };

  const getRecurrencePreview = () => {
    if (!watchedRecurrence?.enabled || !watchedRecurrence?.frequency) return null;

    const interval = watchedRecurrence.interval || 1;
    
    switch (watchedRecurrence.frequency) {
      case 'daily':
        return interval === 1 ? 'Todos os dias' : `A cada ${interval} dias`;
      
      case 'weekly':
        const selectedDays = watchedRecurrence.daysOfWeek?.length || 0;
        if (interval === 1) {
          return selectedDays > 0 ? `${selectedDays} dia(s) por semana` : 'Semanal';
        }
        return `A cada ${interval} semanas`;
      
      case 'monthly':
        const dayOfMonth = watchedRecurrence.dayOfMonth;
        if (interval === 1) {
          return dayOfMonth ? `Todo dia ${dayOfMonth} do mês` : 'Mensal';
        }
        return `A cada ${interval} meses`;
      
      case 'custom':
        return `A cada ${interval} dias`;
      
      default:
        return 'Recorrência personalizada';
    }
  };

  return (
    <Card className="bg-muted/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Repeat className="w-5 h-5" />
            Tarefa Recorrente
          </CardTitle>
          <Switch
            checked={useRecurrence}
            onCheckedChange={onToggleRecurrence}
          />
        </div>
      </CardHeader>

      {useRecurrence && (
        <CardContent className="space-y-4">
          {/* Frequência */}
          <FormField
            control={form.control}
            name="recurrence.frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequência</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(TASK_RECURRENCE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Intervalo */}
          <FormField
            control={form.control}
            name="recurrence.interval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intervalo</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    placeholder="1"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 1)}
                  />
                </FormControl>
                <FormDescription>
                  A cada quantos períodos a tarefa deve se repetir
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campos específicos da frequência */}
          {renderFrequencySpecificFields()}

          {/* Limite de ocorrências ou data fim */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="recurrence.maxOccurrences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Máximo de Ocorrências (opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Ex: 10"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    Quantas vezes no máximo a tarefa deve se repetir
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recurrence.endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Fim (opcional)</FormLabel>
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
                      placeholder="Quando parar"
                      disablePastDates={true}
                    />
                  </FormControl>
                  <FormDescription>
                    Até quando a tarefa deve se repetir
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Preview */}
          {watchedRecurrence?.enabled && watchedRecurrence?.frequency && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium">Preview:</span>
                  <span className="text-sm text-muted-foreground">
                    {getRecurrencePreview()}
                  </span>
                </div>
                {watchedRecurrence.maxOccurrences && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Máximo: {watchedRecurrence.maxOccurrences} ocorrências
                  </div>
                )}
                {watchedRecurrence.endDate && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Até: {new Date(watchedRecurrence.endDate).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      )}
    </Card>
  );
};
