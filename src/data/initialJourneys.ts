
import { Journey } from '@/types/hero';

export const INITIAL_JOURNEYS: Omit<Journey, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // BEM-ESTAR
  {
    title: "Autoconhecimento Profundo",
    description: "Uma jornada introspectiva para descobrir seus valores, forças e propósito de vida através de práticas de reflexão e autoavaliação.",
    narrativeType: "Descoberta Interior",
    icon: "🧠",
    area: "Bem-Estar",
    graduationMode: false,
    stages: [
      {
        id: "stage-1",
        title: "Identificando Valores Pessoais",
        description: "Descubra quais valores realmente guiam sua vida",
        order: 1,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 100,
        createdAt: new Date().toISOString()
      },
      {
        id: "stage-2", 
        title: "Mapeando Forças Internas",
        description: "Reconheça e fortaleça seus talentos naturais",
        order: 2,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 100,
        createdAt: new Date().toISOString()
      },
      {
        id: "stage-3",
        title: "Definindo Propósito",
        description: "Encontre seu propósito de vida e missão pessoal",
        order: 3,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 150,
        createdAt: new Date().toISOString()
      }
    ],
    status: "Em Progresso",
    objectiveType: "Desenvolvimento Pessoal",
    objectiveName: "Clareza Interior",
    objectiveDescription: "Alcançar profundo autoconhecimento",
    objectiveIcon: "🎯",
    totalXpReward: 350
  },
  {
    title: "Resilência Mental",
    description: "Desenvolva uma mente forte e resiliente para enfrentar desafios com serenidade e crescer através das adversidades.",
    narrativeType: "Fortalecimento Interior",
    icon: "🛡️",
    area: "Bem-Estar",
    graduationMode: false,
    stages: [
      {
        id: "stage-1",
        title: "Construindo Base Mental",
        description: "Estabeleça fundações sólidas para uma mente resiliente",
        order: 1,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 100,
        createdAt: new Date().toISOString()
      },
      {
        id: "stage-2",
        title: "Lidando com Adversidades",
        description: "Aprenda técnicas para superar obstáculos",
        order: 2,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 150,
        createdAt: new Date().toISOString()
      }
    ],
    status: "Em Progresso",
    objectiveType: "Fortalecimento Mental",
    objectiveName: "Mente Resiliente",
    objectiveDescription: "Desenvolver resistência mental",
    objectiveIcon: "💪",
    totalXpReward: 250
  },
  {
    title: "Energia Vital",
    description: "Transforme sua energia física e mental através de hábitos saudáveis que aumentam sua vitalidade e disposição diária.",
    narrativeType: "Vitalidade Renovada",
    icon: "⚡",
    area: "Bem-Estar",
    graduationMode: false,
    stages: [
      {
        id: "stage-1",
        title: "Otimizando Sono",
        description: "Crie uma rotina de sono reparador",
        order: 1,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 100,
        createdAt: new Date().toISOString()
      },
      {
        id: "stage-2",
        title: "Nutrição Inteligente",
        description: "Desenvolva hábitos alimentares energizantes",
        order: 2,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 100,
        createdAt: new Date().toISOString()
      },
      {
        id: "stage-3",
        title: "Movimento Diário",
        description: "Incorpore exercícios revitalizantes na rotina",
        order: 3,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 100,
        createdAt: new Date().toISOString()
      }
    ],
    status: "Em Progresso",
    objectiveType: "Vitalidade",
    objectiveName: "Energia Renovada",
    objectiveDescription: "Maximizar energia e disposição",
    objectiveIcon: "🔋",
    totalXpReward: 300
  },

  // BUSINESS
  {
    title: "Produtividade Inteligente",
    description: "Domine técnicas avançadas de produtividade e gestão de tempo para maximizar resultados com menos esforço.",
    narrativeType: "Otimização de Performance",
    icon: "🚀",
    area: "Business",
    graduationMode: false,
    stages: [
      {
        id: "stage-1",
        title: "Gestão de Tempo Eficaz",
        description: "Aprenda a priorizar e organizar seu tempo",
        order: 1,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 100,
        createdAt: new Date().toISOString()
      },
      {
        id: "stage-2",
        title: "Foco Profundo",
        description: "Desenvolva capacidade de concentração intensa",
        order: 2,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 150,
        createdAt: new Date().toISOString()
      },
      {
        id: "stage-3",
        title: "Automação Inteligente",
        description: "Automatize processos para ganhar eficiência",
        order: 3,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 200,
        createdAt: new Date().toISOString()
      }
    ],
    status: "Em Progresso",
    objectiveType: "Produtividade",
    objectiveName: "Máxima Eficiência",
    objectiveDescription: "Otimizar performance profissional",
    objectiveIcon: "📊",
    totalXpReward: 450
  },
  {
    title: "Comunicação Eficaz",
    description: "Transforme sua capacidade de comunicação para influenciar positivamente e construir relacionamentos sólidos.",
    narrativeType: "Maestria em Comunicação",
    icon: "🗣️",
    area: "Business",
    graduationMode: false,
    stages: [
      {
        id: "stage-1",
        title: "Fundamentos da Comunicação",
        description: "Domine os princípios básicos da comunicação eficaz",
        order: 1,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 100,
        createdAt: new Date().toISOString()
      },
      {
        id: "stage-2",
        title: "Persuasão Ética",
        description: "Aprenda técnicas de influência positiva",
        order: 2,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 150,
        createdAt: new Date().toISOString()
      }
    ],
    status: "Em Progresso",
    objectiveType: "Comunicação",
    objectiveName: "Influência Positiva",
    objectiveDescription: "Comunicar com impacto",
    objectiveIcon: "💬",
    totalXpReward: 250
  },
  {
    title: "Liderança Pessoal",
    description: "Desenvolva habilidades de liderança autêntica para inspirar outros e alcançar objetivos ambiciosos.",
    narrativeType: "Despertar do Líder",
    icon: "👑",
    area: "Business",
    graduationMode: false,
    stages: [
      {
        id: "stage-1",
        title: "Autoconhecimento do Líder",
        description: "Identifique seu estilo único de liderança",
        order: 1,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 100,
        createdAt: new Date().toISOString()
      },
      {
        id: "stage-2",
        title: "Inspirando Outros",
        description: "Aprenda a motivar e guiar equipes",
        order: 2,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 150,
        createdAt: new Date().toISOString()
      },
      {
        id: "stage-3",
        title: "Visão Estratégica",
        description: "Desenvolva pensamento estratégico de longo prazo",
        order: 3,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 200,
        createdAt: new Date().toISOString()
      }
    ],
    status: "Em Progresso",
    objectiveType: "Liderança",
    objectiveName: "Líder Inspirador",
    objectiveDescription: "Liderar com propósito",
    objectiveIcon: "⭐",
    totalXpReward: 450
  },

  // MAESTRIA
  {
    title: "Foco Inabalável",
    description: "Desenvolva uma concentração laser que permite realizar trabalho profundo e alcançar resultados extraordinários.",
    narrativeType: "Conquista da Atenção",
    icon: "🎯",
    area: "Maestria",
    graduationMode: false,
    stages: [
      {
        id: "stage-1",
        title: "Eliminando Distrações",
        description: "Identifique e remova obstáculos à concentração",
        order: 1,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 100,
        createdAt: new Date().toISOString()
      },
      {
        id: "stage-2",
        title: "Técnicas de Concentração",
        description: "Domine métodos para manter foco profundo",
        order: 2,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 150,
        createdAt: new Date().toISOString()
      },
      {
        id: "stage-3",
        title: "Flow State",
        description: "Acesse estados de concentração total",
        order: 3,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 200,
        createdAt: new Date().toISOString()
      }
    ],
    status: "Em Progresso",
    objectiveType: "Concentração",
    objectiveName: "Foco Total",
    objectiveDescription: "Dominar a arte da concentração",
    objectiveIcon: "🔍",
    totalXpReward: 450
  },
  {
    title: "Criatividade Ilimitada",
    description: "Desperte seu potencial criativo através de técnicas que expandem sua capacidade de inovação e expressão.",
    narrativeType: "Despertar Criativo",
    icon: "🎨",
    area: "Maestria",
    graduationMode: false,
    stages: [
      {
        id: "stage-1",
        title: "Desbloqueando Criatividade",
        description: "Supere bloqueios e liberte sua expressão",
        order: 1,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 100,
        createdAt: new Date().toISOString()
      },
      {
        id: "stage-2",
        title: "Técnicas de Ideação",
        description: "Aprenda métodos para gerar ideias inovadoras",
        order: 2,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 150,
        createdAt: new Date().toISOString()
      }
    ],
    status: "Em Progresso",
    objectiveType: "Criatividade",
    objectiveName: "Expressão Livre",
    objectiveDescription: "Expandir capacidade criativa",
    objectiveIcon: "🌟",
    totalXpReward: 250
  },
  {
    title: "Propósito Claro",
    description: "Descubra e cultive um propósito de vida claro que guie suas decisões e alimente sua motivação diária.",
    narrativeType: "Busca pelo Sentido",
    icon: "🧭",
    area: "Maestria",
    graduationMode: false,
    stages: [
      {
        id: "stage-1",
        title: "Explorando Paixões",
        description: "Identifique aquilo que realmente te move",
        order: 1,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 100,
        createdAt: new Date().toISOString()
      },
      {
        id: "stage-2",
        title: "Definindo Missão",
        description: "Articule sua missão de vida pessoal",
        order: 2,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 150,
        createdAt: new Date().toISOString()
      },
      {
        id: "stage-3",
        title: "Vivendo com Propósito",
        description: "Alinhe suas ações com seu propósito",
        order: 3,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: 200,
        createdAt: new Date().toISOString()
      }
    ],
    status: "Em Progresso",
    objectiveType: "Propósito",
    objectiveName: "Vida com Sentido",
    objectiveDescription: "Viver com propósito claro",
    objectiveIcon: "🌅",
    totalXpReward: 450
  }
];
