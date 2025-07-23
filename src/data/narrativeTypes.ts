
// Tipos de narrativa e suas etapas pré-definidas

export interface NarrativeStage {
  title: string;
  description: string;
  order: number;
}

export interface NarrativeType {
  id: string;
  name: string;
  description: string;
  stages: NarrativeStage[];
  isGraduation?: boolean;
}

export const NARRATIVE_TYPES: NarrativeType[] = [
  {
    id: 'hero-journey',
    name: 'Jornada do Herói',
    description: 'A clássica jornada de transformação em 12 etapas',
    stages: [
      { title: 'Mundo Comum', description: 'Estabeleça sua situação atual e ponto de partida', order: 1 },
      { title: 'Chamado à Aventura', description: 'Identifique o que precisa mudar ou melhorar', order: 2 },
      { title: 'Recusa do Chamado', description: 'Reconheça suas resistências e medos', order: 3 },
      { title: 'Encontro com o Mentor', description: 'Busque conhecimento e orientação', order: 4 },
      { title: 'Cruzando o Limiar', description: 'Dê o primeiro passo concreto', order: 5 },
      { title: 'Testes e Aliados', description: 'Enfrente desafios iniciais e construa apoio', order: 6 },
      { title: 'Aproximação da Caverna', description: 'Prepare-se para o maior desafio', order: 7 },
      { title: 'Provação Suprema', description: 'Enfrente o obstáculo mais difícil', order: 8 },
      { title: 'Recompensa', description: 'Colha os primeiros frutos da transformação', order: 9 },
      { title: 'Caminho de Volta', description: 'Aplique o aprendizado no mundo real', order: 10 },
      { title: 'Ressurreição', description: 'Integre completamente a nova versão de si', order: 11 },
      { title: 'Retorno com o Elixir', description: 'Compartilhe sua transformação com outros', order: 12 }
    ]
  },
  {
    id: 'transformation-arc',
    name: 'Arco de Transformação',
    description: 'Foco em mudança pessoal profunda em 8 etapas',
    stages: [
      { title: 'Despertar', description: 'Reconheça a necessidade de mudança', order: 1 },
      { title: 'Resistência', description: 'Identifique e trabalhe suas resistências', order: 2 },
      { title: 'Exploração', description: 'Descubra novas possibilidades e caminhos', order: 3 },
      { title: 'Compromisso', description: 'Comprometa-se genuinamente com a mudança', order: 4 },
      { title: 'Experimentação', description: 'Teste novos comportamentos e hábitos', order: 5 },
      { title: 'Prática', description: 'Incorpore as mudanças no dia a dia', order: 6 },
      { title: 'Integração', description: 'Torne as mudanças parte natural de você', order: 7 },
      { title: 'Expressão', description: 'Viva plenamente sua nova identidade', order: 8 }
    ]
  },
  {
    id: 'epic-adventure',
    name: 'Aventura Épica',
    description: 'Uma jornada grandiosa de conquista em 10 etapas',
    stages: [
      { title: 'Visão do Destino', description: 'Defina claramente seu objetivo final', order: 1 },
      { title: 'Preparação', description: 'Reúna recursos e conhecimentos necessários', order: 2 },
      { title: 'Partida', description: 'Inicie oficialmente sua aventura', order: 3 },
      { title: 'Primeiros Desafios', description: 'Supere obstáculos iniciais', order: 4 },
      { title: 'Aliados Poderosos', description: 'Construa uma rede de apoio forte', order: 5 },
      { title: 'Meio da Jornada', description: 'Avalie progresso e ajuste estratégias', order: 6 },
      { title: 'Grande Obstáculo', description: 'Enfrente o maior desafio da jornada', order: 7 },
      { title: 'Vitória Decisiva', description: 'Conquiste um marco importante', order: 8 },
      { title: 'Consolidação', description: 'Solidifique suas conquistas', order: 9 },
      { title: 'Triunfo Final', description: 'Alcance seu objetivo épico', order: 10 }
    ]
  },
  {
    id: 'personal-growth',
    name: 'Crescimento Pessoal',
    description: 'Desenvolvimento focado e prático em 6 etapas',
    stages: [
      { title: 'Autoavaliação', description: 'Analise honestamente sua situação atual', order: 1 },
      { title: 'Definição de Metas', description: 'Estabeleça objetivos claros e mensuráveis', order: 2 },
      { title: 'Planejamento', description: 'Crie um plano de ação detalhado', order: 3 },
      { title: 'Implementação', description: 'Execute consistentemente seu plano', order: 4 },
      { title: 'Monitoramento', description: 'Acompanhe progresso e faça ajustes', order: 5 },
      { title: 'Celebração', description: 'Reconheça conquistas e defina próximos passos', order: 6 }
    ]
  },
  // Narrativas específicas para modo graduação
  {
    id: 'certification-path',
    name: 'Caminho da Certificação',
    description: 'Estrutura focada em conquista de certificações profissionais',
    isGraduation: true,
    stages: [
      { title: 'Escolha da Certificação', description: 'Defina qual certificação almeja e por quê', order: 1 },
      { title: 'Mapeamento dos Requisitos', description: 'Identifique todos os pré-requisitos e conteúdos', order: 2 },
      { title: 'Preparação do Ambiente', description: 'Configure recursos, materiais e cronograma', order: 3 },
      { title: 'Estudo Sistemático', description: 'Execute seu plano de estudos consistentemente', order: 4 },
      { title: 'Prática e Simulados', description: 'Aplique conhecimentos em exercícios práticos', order: 5 },
      { title: 'Exame de Certificação', description: 'Realize a prova e conquiste sua certificação', order: 6 }
    ]
  },
  {
    id: 'academic-journey',
    name: 'Jornada Acadêmica',
    description: 'Para cursos, especializações e programas educacionais',
    isGraduation: true,
    stages: [
      { title: 'Matrícula e Planejamento', description: 'Formalize inscrição e organize cronograma acadêmico', order: 1 },
      { title: 'Fundamentação Teórica', description: 'Domine os conceitos básicos e fundamentos', order: 2 },
      { title: 'Aprofundamento Técnico', description: 'Desenvolva conhecimentos específicos e avançados', order: 3 },
      { title: 'Projetos Práticos', description: 'Aplique aprendizado em projetos reais', order: 4 },
      { title: 'Avaliações e Trabalhos', description: 'Complete provas, trabalhos e atividades', order: 5 },
      { title: 'Networking Acadêmico', description: 'Construa relacionamentos com colegas e professores', order: 6 },
      { title: 'Trabalho de Conclusão', description: 'Desenvolva projeto final ou monografia', order: 7 },
      { title: 'Graduação e Diploma', description: 'Conclua o curso e receba sua titulação', order: 8 }
    ]
  },
  {
    id: 'competency-mastery',
    name: 'Conquista de Competência',
    description: 'Foco em dominar uma habilidade específica com reconhecimento',
    isGraduation: true,
    stages: [
      { title: 'Diagnóstico de Nível', description: 'Avalie seu conhecimento atual na competência', order: 1 },
      { title: 'Capacitação Dirigida', description: 'Estude e treine de forma estruturada', order: 2 },
      { title: 'Aplicação Prática', description: 'Use a competência em situações reais', order: 3 },
      { title: 'Validação Externa', description: 'Obtenha feedback de especialistas ou pares', order: 4 },
      { title: 'Reconhecimento Oficial', description: 'Conquiste certificado ou validação formal', order: 5 }
    ]
  },
  {
    id: 'learning-track',
    name: 'Trilha de Aprendizado',
    description: 'Para programas estruturados de desenvolvimento',
    isGraduation: true,
    stages: [
      { title: 'Ponto de Partida', description: 'Estabeleça linha de base e objetivos claros', order: 1 },
      { title: 'Módulo Introdutório', description: 'Complete fundamentos e pré-requisitos', order: 2 },
      { title: 'Módulo Intermediário', description: 'Desenvolva conhecimentos de nível médio', order: 3 },
      { title: 'Módulo Avançado', description: 'Domine conceitos complexos e especializados', order: 4 },
      { title: 'Projeto Integrador', description: 'Aplique todo aprendizado em projeto completo', order: 5 },
      { title: 'Avaliação Final', description: 'Demonstre domínio através de avaliação completa', order: 6 },
      { title: 'Certificado de Conclusão', description: 'Receba reconhecimento oficial da trilha', order: 7 }
    ]
  }
];

export const OBJECTIVE_TYPES = [
  { id: 'skill', name: 'Habilidade', icon: '🎯' },
  { id: 'knowledge', name: 'Conhecimento', icon: '📚' },
  { id: 'resource', name: 'Recurso', icon: '💎' },
  { id: 'weapon', name: 'Ferramenta', icon: '⚔️' }
];

export const GRADUATION_OBJECTIVE_TYPES = [
  { id: 'certification', name: 'Certificação', icon: '🏆' },
  { id: 'degree', name: 'Diploma', icon: '🎓' },
  { id: 'specialization', name: 'Especialização', icon: '🏅' },
  { id: 'license', name: 'Licença', icon: '📜' }
];

export const JOURNEY_ICONS = [
  '🌟', '🎯', '🚀', '⚡', '🔥', '💪', '🧠', '❤️',
  '🌱', '🏆', '💡', '🔑', '🎨', '📈', '🎭', '🌊',
  '⭐', '🌙', '☀️', '🌈', '🦋', '🔮', '💰', '🎪'
];

export const GRADUATION_ICONS = [
  '🎓', '📚', '🏆', '🏅', '📜', '🎖️', '🌟', '⭐',
  '💎', '🔥', '⚡', '🚀', '💪', '🧠', '🎯', '📈'
];
