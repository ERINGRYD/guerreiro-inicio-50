
export interface HeroAttribute {
  id: string;
  name: string;
  description: string;
  icon: string;
  currentXp: number;
  level: number;
  maxLevel: number;
  xpPerLevel: number;
  area: 'Bem-Estar' | 'Business' | 'Maestria';
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AttributeHistory {
  id: string;
  attributeId: string;
  date: string;
  xpGained: number;
  levelBefore: number;
  levelAfter: number;
  source: 'task' | 'habit' | 'stage' | 'journey' | 'manual';
  sourceId?: string;
}

export interface AttributeGoal {
  id: string;
  attributeId: string;
  targetLevel: number;
  targetDate: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AttributeSystem {
  attributes: HeroAttribute[];
  history: AttributeHistory[];
  goals: AttributeGoal[];
  totalAttributeXp: number;
  averageLevel: number;
}

// Base attributes configuration
export const BASE_ATTRIBUTES = {
  // Bem-Estar
  'autoconhecimento': {
    name: 'Autoconhecimento',
    description: 'Capacidade de compreender suas emoções, motivações e padrões comportamentais',
    icon: '🧠',
    area: 'Bem-Estar' as const
  },
  'resiliencia': {
    name: 'Resiliência',
    description: 'Habilidade de se recuperar rapidamente de dificuldades e adversidades',
    icon: '🛡️',
    area: 'Bem-Estar' as const
  },
  'presenca': {
    name: 'Presença',
    description: 'Capacidade de estar completamente presente e consciente no momento atual',
    icon: '🧘',
    area: 'Bem-Estar' as const
  },
  'empatia': {
    name: 'Empatia',
    description: 'Habilidade de compreender e compartilhar os sentimentos dos outros',
    icon: '❤️',
    area: 'Bem-Estar' as const
  },
  // Business
  'clareza-mental': {
    name: 'Clareza Mental',
    description: 'Capacidade de pensar com precisão, foco e objetividade',
    icon: '💎',
    area: 'Business' as const
  },
  'inovacao': {
    name: 'Inovação',
    description: 'Habilidade de criar soluções criativas e pensar fora da caixa',
    icon: '💡',
    area: 'Business' as const
  },
  'coragem': {
    name: 'Coragem',
    description: 'Força para enfrentar desafios e tomar decisões difíceis',
    icon: '⚔️',
    area: 'Business' as const
  },
  'blindagem-emocional': {
    name: 'Blindagem Emocional',
    description: 'Capacidade de manter equilíbrio emocional em situações de pressão',
    icon: '🛡️',
    area: 'Business' as const
  },
  // Maestria
  'sabedoria': {
    name: 'Sabedoria',
    description: 'Conhecimento profundo combinado com julgamento maduro',
    icon: '📚',
    area: 'Maestria' as const
  },
  'proposito': {
    name: 'Propósito',
    description: 'Clareza sobre sua missão de vida e direcionamento pessoal',
    icon: '🎯',
    area: 'Maestria' as const
  }
} as const;

// XP rewards for attribute progression
export const ATTRIBUTE_XP_REWARDS = {
  task: {
    'Baixa': 5,
    'Média': 10,
    'Alta': 15,
    'Urgente': 20
  },
  habit: {
    'Fácil': 3,
    'Médio': 8,
    'Difícil': 12,
    'Muito Difícil': 18
  },
  stage: 50,
  journey: 100
} as const;

// Journey to attribute mapping
export const JOURNEY_ATTRIBUTE_MAPPING = {
  // Bem-Estar journeys
  'autoconhecimento': ['autoconhecimento', 'sabedoria', 'presenca'],
  'saude-mental': ['resiliencia', 'blindagem-emocional', 'autoconhecimento'],
  'relacionamentos': ['empatia', 'presenca', 'sabedoria'],
  'bem-estar-fisico': ['resiliencia', 'presenca', 'proposito'],
  
  // Business journeys
  'produtividade': ['clareza-mental', 'inovacao', 'coragem'],
  'lideranca': ['coragem', 'empatia', 'clareza-mental'],
  'empreendedorismo': ['inovacao', 'coragem', 'blindagem-emocional'],
  'financas': ['clareza-mental', 'blindagem-emocional', 'sabedoria'],
  
  // Maestria journeys
  'aprendizado': ['sabedoria', 'inovacao', 'presenca'],
  'criatividade': ['inovacao', 'presenca', 'proposito'],
  'espiritualidade': ['sabedoria', 'proposito', 'presenca'],
  'arte': ['inovacao', 'presenca', 'proposito']
} as const;

// Utility functions
export const AttributeUtils = {
  calculateLevel: (xp: number, xpPerLevel: number = 100): number => {
    return Math.floor(xp / xpPerLevel) + 1;
  },
  
  calculateXpForNextLevel: (currentXp: number, xpPerLevel: number = 100): number => {
    const currentLevel = Math.floor(currentXp / xpPerLevel) + 1;
    return (currentLevel * xpPerLevel) - currentXp;
  },
  
  calculateProgress: (currentXp: number, xpPerLevel: number = 100): { current: number; needed: number; percentage: number } => {
    const currentLevelXp = currentXp % xpPerLevel;
    return {
      current: currentLevelXp,
      needed: xpPerLevel,
      percentage: (currentLevelXp / xpPerLevel) * 100
    };
  },
  
  getAttributesByArea: (attributes: HeroAttribute[], area: 'Bem-Estar' | 'Business' | 'Maestria'): HeroAttribute[] => {
    return attributes.filter(attr => attr.area === area);
  },
  
  getLowestAttributes: (attributes: HeroAttribute[], count: number = 3): HeroAttribute[] => {
    return [...attributes]
      .sort((a, b) => a.level - b.level || a.currentXp - b.currentXp)
      .slice(0, count);
  }
};
