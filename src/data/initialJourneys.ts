
import { Journey } from '@/types/hero';

export const JOURNEY_TEMPLATES: Array<Omit<Journey, 'id' | 'createdAt' | 'updatedAt'> & { id: string }> = [
  {
    id: "mestrado-cc",
    title: "Mestrado em Ciência da Computação",
    description: "Jornada acadêmica para conclusão do mestrado, incluindo disciplinas, pesquisa e defesa da dissertação.",
    narrativeType: "Graduação Acadêmica",
    icon: "🎓",
    area: "Maestria",
    graduationMode: true,
    stages: [
      {
        id: "mestrado-disciplinas",
        title: "Disciplinas do Mestrado",
        description: "Completar todas as disciplinas obrigatórias e eletivas",
        order: 1,
        completed: false,
        tasks: [],
        habits: [],
        createdAt: new Date().toISOString()
      },
      {
        id: "mestrado-qualificacao",
        title: "Qualificação",
        description: "Preparar e defender o projeto de dissertação",
        order: 2,
        completed: false,
        tasks: [],
        habits: [],
        createdAt: new Date().toISOString()
      },
      {
        id: "mestrado-pesquisa",
        title: "Desenvolvimento da Pesquisa",
        description: "Conduzir a pesquisa e redigir a dissertação",
        order: 3,
        completed: false,
        tasks: [],
        habits: [],
        createdAt: new Date().toISOString()
      },
      {
        id: "mestrado-defesa",
        title: "Defesa da Dissertação",
        description: "Preparar e realizar a defesa final",
        order: 4,
        completed: false,
        tasks: [],
        habits: [],
        createdAt: new Date().toISOString()
      }
    ],
    status: "Em Progresso",
    totalXpReward: 2000
  },
  {
    id: "habito-leitura",
    title: "Desenvolver Hábito de Leitura",
    description: "Criar e manter o hábito de leitura diária para crescimento pessoal e intelectual.",
    narrativeType: "Transformação Pessoal",
    icon: "📚",
    area: "Maestria",
    graduationMode: false,
    stages: [
      {
        id: "leitura-preparacao",
        title: "Preparação",
        description: "Organizar ambiente e escolher primeiros livros",
        order: 1,
        completed: false,
        tasks: [],
        habits: [],
        createdAt: new Date().toISOString()
      },
      {
        id: "leitura-30dias",
        title: "Primeiros 30 Dias",
        description: "Estabelecer rotina de leitura diária",
        order: 2,
        completed: false,
        tasks: [],
        habits: [],
        createdAt: new Date().toISOString()
      },
      {
        id: "leitura-consolidacao",
        title: "Consolidação",
        description: "Manter consistência e expandir repertório",
        order: 3,
        completed: false,
        tasks: [],
        habits: [],
        createdAt: new Date().toISOString()
      }
    ],
    status: "Em Progresso",
    totalXpReward: 800
  },
  {
    id: "vida-saudavel",
    title: "Estilo de Vida Saudável",
    description: "Transformação completa para uma vida mais saudável através de exercícios, alimentação e sono.",
    narrativeType: "Transformação de Saúde",
    icon: "💪",
    area: "Bem-Estar",
    graduationMode: false,
    stages: [
      {
        id: "saude-avaliacao",
        title: "Avaliação Inicial",
        description: "Checkup médico e definição de metas",
        order: 1,
        completed: false,
        tasks: [],
        habits: [],
        createdAt: new Date().toISOString()
      },
      {
        id: "saude-exercicios",
        title: "Rotina de Exercícios",
        description: "Estabelecer programa regular de atividade física",
        order: 2,
        completed: false,
        tasks: [],
        habits: [],
        createdAt: new Date().toISOString()
      },
      {
        id: "saude-alimentacao",
        title: "Alimentação Balanceada",
        description: "Reeducação alimentar e planejamento de refeições",
        order: 3,
        completed: false,
        tasks: [],
        habits: [],
        createdAt: new Date().toISOString()
      },
      {
        id: "saude-sono",
        title: "Qualidade do Sono",
        description: "Otimizar rotina de sono e descanso",
        order: 4,
        completed: false,
        tasks: [],
        habits: [],
        createdAt: new Date().toISOString()
      }
    ],
    status: "Em Progresso",
    totalXpReward: 1200
  },
  {
    id: "negocio-online",
    title: "Lançar Negócio Online",
    description: "Jornada completa para criar e lançar um negócio digital do zero.",
    narrativeType: "Empreendedorismo",
    icon: "🚀",
    area: "Business",
    graduationMode: false,
    stages: [
      {
        id: "negocio-validacao",
        title: "Validação da Ideia",
        description: "Pesquisar mercado e validar proposta de valor",
        order: 1,
        completed: false,
        tasks: [],
        habits: [],
        createdAt: new Date().toISOString()
      },
      {
        id: "negocio-mvp",
        title: "Desenvolvimento MVP",
        description: "Criar versão mínima viável do produto",
        order: 2,
        completed: false,
        tasks: [],
        habits: [],
        createdAt: new Date().toISOString()
      },
      {
        id: "negocio-marketing",
        title: "Estratégia de Marketing",
        description: "Definir e executar plano de marketing digital",
        order: 3,
        completed: false,
        tasks: [],
        habits: [],
        createdAt: new Date().toISOString()
      },
      {
        id: "negocio-lancamento",
        title: "Lançamento",
        description: "Lançar produto e primeiras vendas",
        order: 4,
        completed: false,
        tasks: [],
        habits: [],
        createdAt: new Date().toISOString()
      }
    ],
    status: "Em Progresso",
    totalXpReward: 1500
  },
  {
    id: "certificacao-aws",
    title: "Certificação AWS Solutions Architect",
    description: "Preparação completa para obter certificação AWS Solutions Architect Associate.",
    narrativeType: "Certificação Profissional",
    icon: "☁️",
    area: "Maestria",
    graduationMode: false,
    stages: [
      {
        id: "aws-fundamentos",
        title: "Fundamentos AWS",
        description: "Compreender conceitos básicos da AWS",
        order: 1,
        completed: false,
        tasks: [],
        habits: [],
        createdAt: new Date().toISOString()
      },
      {
        id: "aws-pratica",
        title: "Laboratórios Práticos",
        description: "Hands-on com serviços AWS principais",
        order: 2,
        completed: false,
        tasks: [],
        habits: [],
        createdAt: new Date().toISOString()
      },
      {
        id: "aws-simulados",
        title: "Simulados e Revisão",
        description: "Praticar com simulados e revisar conteúdo",
        order: 3,
        completed: false,
        tasks: [],
        habits: [],
        createdAt: new Date().toISOString()
      },
      {
        id: "aws-exame",
        title: "Exame de Certificação",
        description: "Agendar e realizar o exame oficial",
        order: 4,
        completed: false,
        tasks: [],
        habits: [],
        createdAt: new Date().toISOString()
      }
    ],
    status: "Em Progresso",
    totalXpReward: 1000
  },
  // BEM-ESTAR
  {
    id: "autoconhecimento-profundo",
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
    id: "resiliencia-mental",
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
    id: "energia-vital",
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
    id: "produtividade-inteligente",
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
    id: "comunicacao-eficaz",
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
    id: "lideranca-pessoal",
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
    id: "foco-inabalavel",
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
    id: "criatividade-ilimitada",
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
    id: "proposito-claro",
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

export const INITIAL_JOURNEYS: Omit<Journey, 'id' | 'createdAt' | 'updatedAt'>[] = JOURNEY_TEMPLATES;
