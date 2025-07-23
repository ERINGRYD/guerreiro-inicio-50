import { Task, Habit } from '@/types/hero';
import { TaskRecurrence } from '@/types/repeat';
import { format, isToday, isBefore, isAfter, startOfDay, getDay, getDate } from 'date-fns';

export interface DateFilterOptions {
  includeOverdue?: boolean;
  includeHighPriorityWithoutDate?: boolean;
  includeStartingSoon?: boolean;
}

/**
 * Verifica se uma tarefa deve aparecer em uma data específica
 */
export const shouldTaskAppearOnDate = (
  task: Task, 
  targetDate: Date, 
  options: DateFilterOptions = {}
): boolean => {
  const {
    includeOverdue = true,
    includeHighPriorityWithoutDate = true,
    includeStartingSoon = false
  } = options;

  console.log(`Verificando tarefa "${task.title}" para data ${format(targetDate, 'yyyy-MM-dd')}`);

  // Tarefa concluída não aparece (exceto se for hoje e foi concluída hoje)
  if (task.completed) {
    if (task.completedAt && isToday(new Date(task.completedAt)) && isToday(targetDate)) {
      console.log(`Tarefa "${task.title}" - incluída (concluída hoje)`);
      return true;
    }
    console.log(`Tarefa "${task.title}" - excluída (já concluída)`);
    return false;
  }

  // 1. Verificar recorrência
  if (task.recurrence?.enabled) {
    const shouldAppear = isTaskRecurringOnDate(task, targetDate);
    if (shouldAppear) {
      console.log(`Tarefa "${task.title}" - incluída (recorrência)`);
      return true;
    }
  }

  // 2. Verificar data de vencimento
  if (task.dueDate) {
    const dueDate = startOfDay(new Date(task.dueDate));
    const checkDate = startOfDay(targetDate);
    
    // Vence hoje
    if (dueDate.getTime() === checkDate.getTime()) {
      console.log(`Tarefa "${task.title}" - incluída (vence hoje)`);
      return true;
    }
    
    // Está atrasada
    if (includeOverdue && isBefore(dueDate, checkDate)) {
      console.log(`Tarefa "${task.title}" - incluída (atrasada)`);
      return true;
    }
  }

  // 3. Verificar data de início
  if (task.startDate) {
    const startDate = startOfDay(new Date(task.startDate));
    const checkDate = startOfDay(targetDate);
    
    // Pode começar hoje ou já podia ter começado
    if (!isAfter(startDate, checkDate)) {
      // Se tem prazo, só mostrar se ainda não venceu
      if (task.dueDate) {
        const dueDate = startOfDay(new Date(task.dueDate));
        if (!isBefore(dueDate, checkDate)) {
          console.log(`Tarefa "${task.title}" - incluída (período ativo)`);
          return true;
        }
      } else {
        console.log(`Tarefa "${task.title}" - incluída (pode começar)`);
        return true;
      }
    }
  }

  // 4. Tarefas sem data mas de alta prioridade (aparecem todos os dias)
  if (includeHighPriorityWithoutDate && !task.dueDate && !task.startDate && 
      (task.priority === 'Alta' || task.priority === 'Urgente')) {
    console.log(`Tarefa "${task.title}" - incluída (alta prioridade sem data)`);
    return true;
  }

  console.log(`Tarefa "${task.title}" - excluída (não atende critérios)`);
  return false;
};

/**
 * Verifica se um hábito deve aparecer em uma data específica
 */
export const shouldHabitAppearOnDate = (habit: Habit, targetDate: Date): boolean => {
  console.log(`Verificando hábito "${habit.name}" para data ${format(targetDate, 'yyyy-MM-dd')}`);

  // Verificar frequência baseada no tipo do hero.ts
  switch (habit.frequency) {
    case 'Diário':
      console.log(`Hábito "${habit.name}" - incluído (diário)`);
      return true;
      
    case '3x por semana':
      // Segunda, quarta, sexta
      const dayOfWeek = getDay(targetDate);
      const shouldAppear3x = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
      console.log(`Hábito "${habit.name}" - ${shouldAppear3x ? 'incluído' : 'excluído'} (3x por semana)`);
      return shouldAppear3x;
      
    case 'Semanal':
      // Uma vez por semana (domingo)
      const shouldAppearWeekly = getDay(targetDate) === 0;
      console.log(`Hábito "${habit.name}" - ${shouldAppearWeekly ? 'incluído' : 'excluído'} (semanal)`);
      return shouldAppearWeekly;
      
    case 'Mensal':
      // Dia 1 do mês
      const shouldAppearMonthly = getDate(targetDate) === 1;
      console.log(`Hábito "${habit.name}" - ${shouldAppearMonthly ? 'incluído' : 'excluído'} (mensal)`);
      return shouldAppearMonthly;
      
    case 'Personalizado':
      // Usar frequencyCount se disponível
      if (habit.frequencyCount) {
        const dayOfWeek = getDay(targetDate);
        
        // Distribuir ao longo da semana baseado em frequencyCount
        if (habit.frequencyCount >= 7) {
          console.log(`Hábito "${habit.name}" - incluído (personalizado: todos os dias)`);
          return true;
        } else if (habit.frequencyCount >= 5) {
          // Segunda a sexta
          const shouldAppearCustom = dayOfWeek >= 1 && dayOfWeek <= 5;
          console.log(`Hábito "${habit.name}" - ${shouldAppearCustom ? 'incluído' : 'excluído'} (personalizado: dias úteis)`);
          return shouldAppearCustom;
        } else if (habit.frequencyCount >= 3) {
          // Segunda, quarta, sexta
          const shouldAppearCustom = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
          console.log(`Hábito "${habit.name}" - ${shouldAppearCustom ? 'incluído' : 'excluído'} (personalizado: 3x semana)`);
          return shouldAppearCustom;
        } else if (habit.frequencyCount >= 2) {
          // Segunda e quinta
          const shouldAppearCustom = dayOfWeek === 1 || dayOfWeek === 4;
          console.log(`Hábito "${habit.name}" - ${shouldAppearCustom ? 'incluído' : 'excluído'} (personalizado: 2x semana)`);
          return shouldAppearCustom;
        } else {
          // Uma vez por semana (segunda)
          const shouldAppearCustom = dayOfWeek === 1;
          console.log(`Hábito "${habit.name}" - ${shouldAppearCustom ? 'incluído' : 'excluído'} (personalizado: 1x semana)`);
          return shouldAppearCustom;
        }
      }
      // Fallback para diário se não tem frequencyCount
      console.log(`Hábito "${habit.name}" - incluído (personalizado: fallback diário)`);
      return true;
      
    default:
      console.log(`Hábito "${habit.name}" - excluído (frequência não reconhecida: ${habit.frequency})`);
      return false;
  }
};

/**
 * Verifica se uma tarefa recorrente deve aparecer em uma data específica
 */
const isTaskRecurringOnDate = (task: Task, targetDate: Date): boolean => {
  if (!task.recurrence?.enabled) return false;

  const { frequency, interval = 1, daysOfWeek, dayOfMonth, endDate, maxOccurrences } = task.recurrence;

  // Verificar se a recorrência já terminou
  if (endDate && isAfter(targetDate, new Date(endDate))) {
    return false;
  }

  // TODO: Implementar verificação de maxOccurrences
  // Isso requereria contar quantas vezes a tarefa já foi executada

  const dayOfWeek = getDay(targetDate);
  const dateOfMonth = getDate(targetDate);

  switch (frequency) {
    case 'daily':
      // TODO: Implementar lógica de intervalo (a cada X dias)
      return true;
      
    case 'weekly':
      if (daysOfWeek && daysOfWeek.length > 0) {
        return daysOfWeek.includes(dayOfWeek);
      }
      // Padrão: mesmo dia da semana que a data original
      return true; // Simplificado por enquanto
      
    case 'monthly':
      if (dayOfMonth) {
        return dateOfMonth === dayOfMonth;
      }
      // Padrão: mesmo dia do mês que a data original
      return true; // Simplificado por enquanto
      
    case 'custom':
      // TODO: Implementar lógica personalizada
      return false;
      
    default:
      return false;
  }
};

/**
 * Padroniza datas para comparação (remove horário)
 */
export const normalizeDate = (date: string | Date): Date => {
  return startOfDay(new Date(date));
};

/**
 * Verifica se duas datas são o mesmo dia
 */
export const isSameDay = (date1: string | Date, date2: string | Date): boolean => {
  const d1 = normalizeDate(date1);
  const d2 = normalizeDate(date2);
  return d1.getTime() === d2.getTime();
};