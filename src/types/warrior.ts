// Tipos TypeScript para o Sistema do Guerreiro Interno

export interface WarriorProfile {
  id: string;
  name: string;
  symbol: string; // Emoji ou símbolo que representa o guerreiro
  coreValue: string; // Valor principal do guerreiro
  phrase: string; // Frase motivacional pessoal
  level: number;
  xp: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  category: 'physical' | 'mental' | 'spiritual' | 'social' | 'creative';
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  completed: boolean;
  completedAt?: Date;
  xpTotal: number; // XP total da fase
  requiredLevel?: number; // Nível mínimo necessário
}

export interface Journey {
  id: string;
  title: string;
  description: string;
  phases: Phase[];
  completed: boolean;
  completedAt?: Date;
  xpTotal: number; // XP total da jornada
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'master';
  category: 'self-discovery' | 'discipline' | 'courage' | 'wisdom' | 'leadership';
}

export interface WarriorStats {
  totalXP: number;
  level: number;
  completedTasks: number;
  completedPhases: number;
  completedJourneys: number;
  streak: number; // Dias consecutivos de atividade
  lastActivityDate?: Date;
}

export interface GameData {
  warrior: WarriorProfile;
  journeys: Journey[];
  stats: WarriorStats;
  settings: {
    notifications: boolean;
    soundEffects: boolean;
    theme: 'auto' | 'light' | 'dark';
  };
  backup: {
    lastBackup?: Date;
    autoBackup: boolean;
  };
}

// Utilitários para XP e Níveis
export const XP_FORMULA = {
  BASE_XP: 100,
  MULTIPLIER: 1.5,
  // Level 1 = 100 XP, Level 2 = 250 XP, Level 3 = 475 XP, etc.
  calculateXPForLevel: (level: number): number => {
    if (level === 1) return 0;
    let totalXP = 0;
    for (let i = 1; i < level; i++) {
      totalXP += Math.floor(XP_FORMULA.BASE_XP * Math.pow(XP_FORMULA.MULTIPLIER, i - 1));
    }
    return totalXP;
  },
  calculateLevelFromXP: (xp: number): number => {
    let level = 1;
    let totalXP = 0;
    while (totalXP <= xp) {
      const xpForNextLevel = Math.floor(XP_FORMULA.BASE_XP * Math.pow(XP_FORMULA.MULTIPLIER, level - 1));
      if (totalXP + xpForNextLevel > xp) break;
      totalXP += xpForNextLevel;
      level++;
    }
    return level;
  },
  getXPProgressForCurrentLevel: (xp: number): { current: number; needed: number; percentage: number } => {
    const currentLevel = XP_FORMULA.calculateLevelFromXP(xp);
    const xpForCurrentLevel = XP_FORMULA.calculateXPForLevel(currentLevel);
    const xpForNextLevel = Math.floor(XP_FORMULA.BASE_XP * Math.pow(XP_FORMULA.MULTIPLIER, currentLevel - 1));
    const currentXPInLevel = xp - xpForCurrentLevel;
    
    return {
      current: currentXPInLevel,
      needed: xpForNextLevel,
      percentage: (currentXPInLevel / xpForNextLevel) * 100
    };
  }
};

// Recompensas de XP por dificuldade
export const XP_REWARDS = {
  easy: 10,
  medium: 25,
  hard: 50,
  epic: 100
} as const;

// Dados iniciais/exemplo
export const INITIAL_JOURNEYS: Omit<Journey, 'id'>[] = [
  {
    title: "O Despertar do Guerreiro",
    description: "Sua primeira jornada rumo ao autoconhecimento",
    difficulty: "beginner",
    category: "self-discovery",
    completed: false,
    xpTotal: 185,
    phases: [
      {
        id: "phase-1",
        title: "Reconhecendo o Chamado",
        description: "Identifique suas motivações e objetivos",
        completed: false,
        xpTotal: 85,
        tasks: [
          {
            id: "task-1",
            title: "Defina seu Por Quê",
            description: "Escreva em 3 frases por que você quer se transformar",
            difficulty: "easy",
            category: "mental",
            xpReward: 10,
            completed: false,
            createdAt: new Date()
          },
          {
            id: "task-2",
            title: "Escolha seu Símbolo",
            description: "Selecione um emoji ou símbolo que represente sua essência",
            difficulty: "easy",
            category: "spiritual",
            xpReward: 10,
            completed: false,
            createdAt: new Date()
          },
          {
            id: "task-3",
            title: "Crie sua Frase de Poder",
            description: "Desenvolva uma frase que te inspire nos momentos difíceis",
            difficulty: "medium",
            category: "mental",
            xpReward: 25,
            completed: false,
            createdAt: new Date()
          },
          {
            id: "task-4",
            title: "Primeiro Desafio Físico",
            description: "Faça 20 flexões ou uma caminhada de 10 minutos",
            difficulty: "medium",
            category: "physical",
            xpReward: 25,
            completed: false,
            createdAt: new Date()
          },
          {
            id: "task-5",
            title: "Meditação Inicial",
            description: "Medite por 5 minutos focando na sua respiração",
            difficulty: "easy",
            category: "spiritual",
            xpReward: 15,
            completed: false,
            createdAt: new Date()
          }
        ]
      },
      {
        id: "phase-2",
        title: "Forjando a Disciplina",
        description: "Desenvolva hábitos consistentes",
        completed: false,
        xpTotal: 100,
        tasks: [
          {
            id: "task-6",
            title: "Rotina Matinal",
            description: "Crie e execute uma rotina matinal por 3 dias consecutivos",
            difficulty: "hard",
            category: "mental",
            xpReward: 50,
            completed: false,
            createdAt: new Date()
          },
          {
            id: "task-7",
            title: "Diário de Guerreiro",
            description: "Escreva suas reflexões diárias por uma semana",
            difficulty: "hard",
            category: "mental",
            xpReward: 50,
            completed: false,
            createdAt: new Date()
          }
        ]
      }
    ]
  }
];