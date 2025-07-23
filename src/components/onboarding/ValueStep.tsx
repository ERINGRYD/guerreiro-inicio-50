import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Eye, 
  Clock, 
  Target, 
  BookOpen, 
  HandHeart, 
  Shield, 
  Palette, 
  Scale, 
  Zap 
} from 'lucide-react';

interface ValueOption {
  icon: React.ComponentType<any>;
  name: string;
  description: string;
  meaning: string;
  color: string;
}

const VALUES: ValueOption[] = [
  {
    icon: Heart,
    name: 'Coragem',
    description: 'Enfrentar medos com determinação',
    meaning: 'A força para agir mesmo diante do desconhecido e das incertezas.',
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: Eye,
    name: 'Clareza',
    description: 'Ver através das ilusões',
    meaning: 'A capacidade de enxergar a verdade e tomar decisões conscientes.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Clock,
    name: 'Presença',
    description: 'Viver plenamente o momento',
    meaning: 'A habilidade de estar completamente presente e consciente no agora.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Target,
    name: 'Determinação',
    description: 'Persistir até alcançar objetivos',
    meaning: 'A força de vontade para continuar mesmo quando o caminho é difícil.',
    color: 'from-orange-500 to-yellow-500'
  },
  {
    icon: BookOpen,
    name: 'Sabedoria',
    description: 'Aprender e crescer constantemente',
    meaning: 'A busca contínua pelo conhecimento e compreensão mais profunda.',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    icon: HandHeart,
    name: 'Compaixão',
    description: 'Demonstrar empatia e bondade',
    meaning: 'A capacidade de entender e cuidar dos outros com amor genuíno.',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: Shield,
    name: 'Integridade',
    description: 'Agir com honestidade e ética',
    meaning: 'Manter-se fiel aos próprios valores e princípios em todas as situações.',
    color: 'from-slate-500 to-gray-500'
  },
  {
    icon: Palette,
    name: 'Criatividade',
    description: 'Expressar-se com originalidade',
    meaning: 'A capacidade de criar, inovar e encontrar soluções únicas.',
    color: 'from-violet-500 to-purple-500'
  },
  {
    icon: Scale,
    name: 'Equilíbrio',
    description: 'Harmonizar todos os aspectos',
    meaning: 'A habilidade de manter harmonia entre diferentes áreas da vida.',
    color: 'from-teal-500 to-green-500'
  },
  {
    icon: Zap,
    name: 'Transformação',
    description: 'Renovar-se constantemente',
    meaning: 'A disposição para mudar, evoluir e se reinventar continuamente.',
    color: 'from-yellow-500 to-orange-500'
  }
];

interface ValueStepProps {
  selectedValue: string;
  onChange: (value: string) => void;
}

export const ValueStep: React.FC<ValueStepProps> = ({ selectedValue, onChange }) => {
  const selectedOption = VALUES.find(v => v.name === selectedValue);

  return (
    <div className="space-y-6">
      {/* Grid de valores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {VALUES.map((value, index) => {
          const isSelected = selectedValue === value.name;
          const IconComponent = value.icon;

          return (
            <motion.button
              key={value.name}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(value.name)}
              className={`
                relative p-5 rounded-xl border-2 transition-all duration-300 text-left
                ${isSelected 
                  ? 'border-primary bg-primary/10 shadow-glow' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
            >
              <div className="flex items-start gap-4">
                {/* Ícone com gradiente */}
                <div className={`
                  p-3 rounded-lg bg-gradient-to-br ${value.color} text-white
                  ${isSelected ? 'shadow-lg' : ''}
                `}>
                  <IconComponent className="w-6 h-6" />
                </div>
                
                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-lg mb-1 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {value.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </div>

              {/* Indicador de seleção */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                >
                  <span className="text-primary-foreground text-xs">✓</span>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Descrição detalhada do valor selecionado */}
      {selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${selectedOption.color} text-white`}>
              <selectedOption.icon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                {selectedOption.name}
              </h3>
              <p className="text-muted-foreground">
                {selectedOption.description}
              </p>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Por que este valor é poderoso:</p>
            <p className="italic">{selectedOption.meaning}</p>
          </div>
        </motion.div>
      )}

      {/* Orientação */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-sm text-muted-foreground space-y-2"
      >
        <p>
          Escolha o valor que mais ressoa com sua alma neste momento da jornada.
        </p>
        <p className="text-xs">
          Este será seu norte moral e a fonte de força nos momentos desafiadores.
        </p>
      </motion.div>
    </div>
  );
};