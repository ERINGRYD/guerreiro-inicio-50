
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Target, Repeat, Clock } from 'lucide-react';
import { 
  RepeatPattern, 
  RepeatPatternType, 
  REPEAT_PATTERN_LABELS, 
  PREDEFINED_PATTERNS 
} from '@/types/repeat';

interface RepeatPatternSelectorProps {
  useRepeatPattern: boolean;
  onToggleRepeatPattern: (enabled: boolean) => void;
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

export const RepeatPatternSelector: React.FC<RepeatPatternSelectorProps> = ({
  useRepeatPattern,
  onToggleRepeatPattern
}) => {
  const form = useFormContext();
  const watchedPattern = form.watch('repeatPattern') as RepeatPattern;

  const renderPatternSpecificFields = () => {
    if (!watchedPattern?.type) return null;

    switch (watchedPattern.type) {
      case 'limited':
        return (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="repeatPattern.maxOccurrences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Repetições</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Ex: 21"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="repeatPattern.endAfterDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ou Limitar por Dias</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Ex: 30"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 'alternating':
        return (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="repeatPattern.alternatingPattern.activeDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dias Ativos</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      placeholder="Ex: 1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="repeatPattern.alternatingPattern.restDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dias de Descanso</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0"
                      placeholder="Ex: 1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 'custom_cycle':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="repeatPattern.customCycle.pattern"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Padrão Semanal</FormLabel>
                  <div className="flex gap-2 mt-2">
                    {WEEKDAYS.map((day, index) => (
                      <FormItem key={day.value} className="flex flex-col items-center space-y-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.[index] === 1 || false}
                            onCheckedChange={(checked) => {
                              const currentPattern = field.value || [0,0,0,0,0,0,0];
                              const newPattern = [...currentPattern];
                              newPattern[index] = checked ? 1 : 0;
                              field.onChange(newPattern);
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
            
            <FormField
              control={form.control}
              name="repeatPattern.customCycle.repeatEveryWeeks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repetir a cada X semanas</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      placeholder="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const getPatternPreview = () => {
    if (!watchedPattern?.type) return null;

    switch (watchedPattern.type) {
      case 'limited':
        const maxOcc = watchedPattern.maxOccurrences;
        const endAfter = watchedPattern.endAfterDays;
        if (maxOcc) return `${maxOcc} repetições`;
        if (endAfter) return `Por ${endAfter} dias`;
        return 'Configure o limite';

      case 'alternating':
        const active = watchedPattern.alternatingPattern?.activeDays;
        const rest = watchedPattern.alternatingPattern?.restDays;
        if (active && rest !== undefined) {
          return `${active} dia(s) ativo, ${rest} dia(s) descanso`;
        }
        return 'Configure o padrão';

      case 'custom_cycle':
        const pattern = watchedPattern.customCycle?.pattern;
        if (pattern) {
          const activeDays = pattern.filter(d => d === 1).length;
          return `${activeDays} dias por semana`;
        }
        return 'Configure os dias';

      case 'unlimited':
        return 'Sem limite de repetições';

      default:
        return null;
    }
  };

  return (
    <Card className="bg-muted/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Repeat className="w-5 h-5" />
            Padrão de Repetição Avançado
          </CardTitle>
          <Switch
            checked={useRepeatPattern}
            onCheckedChange={onToggleRepeatPattern}
          />
        </div>
      </CardHeader>

      {useRepeatPattern && (
        <CardContent className="space-y-4">
          {/* Padrões Pré-definidos */}
          <div>
            <FormLabel className="mb-2 block">Padrões Rápidos</FormLabel>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PREDEFINED_PATTERNS).map(([key, pattern]) => (
                <Badge
                  key={key}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => {
                    form.setValue('repeatPattern', pattern);
                  }}
                >
                  {key === '21-day-challenge' && 'Desafio 21 dias'}
                  {key === 'workout-3x-week' && 'Treino 3x/semana'}
                  {key === 'reading-alternating' && 'Leitura alternada'}
                  {key === 'sprint-weekly' && 'Sprint semanal'}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tipo de Padrão */}
          <FormField
            control={form.control}
            name="repeatPattern.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Padrão</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(REPEAT_PATTERN_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campos Específicos do Padrão */}
          {renderPatternSpecificFields()}

          {/* Opções Gerais */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="repeatPattern.skipWeekends"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Pular finais de semana</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repeatPattern.skipHolidays"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Pular feriados</FormLabel>
                </FormItem>
              )}
            />
          </div>

          {/* Preview */}
          {watchedPattern?.type && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="font-medium">Preview:</span>
                  <span className="text-sm text-muted-foreground">
                    {getPatternPreview()}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      )}
    </Card>
  );
};
