
export type RepeatPatternType = 'limited' | 'unlimited' | 'alternating' | 'custom_cycle';

export interface AlternatingPattern {
  activeDays: number; // dias fazendo
  restDays: number; // dias descansando
}

export interface CustomCycle {
  pattern: number[]; // [1,0,1,0,1,1,0] = seg,ter,qua,qui,sex,sab,dom
  repeatEveryWeeks: number; // repetir o padrão a cada X semanas
}

export interface RepeatPattern {
  type: RepeatPatternType;
  
  // Para repetições limitadas
  maxOccurrences?: number; // ex: 20 vezes
  endAfterDays?: number; // ex: 30 dias
  
  // Para padrões alternados
  alternatingPattern?: AlternatingPattern;
  
  // Para ciclos personalizados
  customCycle?: CustomCycle;
  
  // Configurações gerais
  skipWeekends?: boolean;
  skipHolidays?: boolean;
}

export type TaskRecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface TaskRecurrence {
  enabled: boolean;
  frequency: TaskRecurrenceFrequency;
  interval: number; // a cada X dias/semanas/meses
  daysOfWeek?: number[]; // para semanal
  dayOfMonth?: number; // para mensal
  endDate?: string;
  maxOccurrences?: number;
}

// Padrões pré-definidos
export const PREDEFINED_PATTERNS = {
  '21-day-challenge': {
    type: 'limited' as RepeatPatternType,
    maxOccurrences: 21,
    skipWeekends: false
  },
  'workout-3x-week': {
    type: 'custom_cycle' as RepeatPatternType,
    customCycle: {
      pattern: [1, 0, 1, 0, 1, 0, 0], // seg, qua, sex
      repeatEveryWeeks: 1
    }
  },
  'reading-alternating': {
    type: 'alternating' as RepeatPatternType,
    alternatingPattern: {
      activeDays: 1,
      restDays: 1
    }
  },
  'sprint-weekly': {
    type: 'alternating' as RepeatPatternType,
    alternatingPattern: {
      activeDays: 5,
      restDays: 2
    }
  }
} as const;

export const REPEAT_PATTERN_LABELS = {
  limited: 'Repetição Limitada',
  unlimited: 'Repetição Ilimitada',
  alternating: 'Padrão Alternado',
  custom_cycle: 'Ciclo Personalizado'
} as const;

export const TASK_RECURRENCE_LABELS = {
  daily: 'Diário',
  weekly: 'Semanal',
  monthly: 'Mensal',
  custom: 'Personalizado'
} as const;
