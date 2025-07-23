import React from 'react';
import { motion } from 'framer-motion';
import { Sword, Shield, Mountain, Zap, TreePine, Star, Compass, Flame } from 'lucide-react';

interface SymbolOption {
  icon: React.ComponentType<any>;
  emoji: string;
  name: string;
  description: string;
  meaning: string;
}

const SYMBOLS: SymbolOption[] = [
  {
    icon: Sword,
    emoji: '⚔️',
    name: 'Espada',
    description: 'Força e determinação',
    meaning: 'Representa coragem para enfrentar desafios e cortar através das ilusões.'
  },
  {
    icon: Shield,
    emoji: '🛡️',
    name: 'Escudo',
    description: 'Proteção e sabedoria',
    meaning: 'Simboliza a capacidade de se proteger e proteger outros, além da prudência.'
  },
  {
    icon: Mountain,
    emoji: '⛰️',
    name: 'Montanha',
    description: 'Estabilidade e perseverança',
    meaning: 'Representa solidez, resistência e a jornada de crescimento constante.'
  },
  {
    icon: Zap,
    emoji: '🔥',
    name: 'Fênix',
    description: 'Renovação e transformação',
    meaning: 'Simboliza renascimento, superação e a capacidade de se reinventar.'
  },
  {
    icon: TreePine,
    emoji: '🌲',
    name: 'Árvore',
    description: 'Crescimento e conexão',
    meaning: 'Representa crescimento pessoal, raízes profundas e conexão com a natureza.'
  },
  {
    icon: Star,
    emoji: '⭐',
    name: 'Estrela',
    description: 'Orientação e inspiração',
    meaning: 'Simboliza direcionamento, luz na escuridão e aspirações elevadas.'
  },
  {
    icon: Compass,
    emoji: '🧭',
    name: 'Bússola',
    description: 'Direção e propósito',
    meaning: 'Representa clareza de propósito e a capacidade de encontrar o próprio caminho.'
  },
  {
    icon: Flame,
    emoji: '🔥',
    name: 'Chama',
    description: 'Paixão e energia',
    meaning: 'Simboliza paixão interior, energia vital e o fogo da transformação.'
  }
];

interface SymbolStepProps {
  selectedSymbol: string;
  onChange: (symbol: string) => void;
}

export const SymbolStep: React.FC<SymbolStepProps> = ({ selectedSymbol, onChange }) => {
  const selectedOption = SYMBOLS.find(s => s.emoji === selectedSymbol);

  return (
    <div className="space-y-6">
      {/* Grid de símbolos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SYMBOLS.map((symbol, index) => {
          const isSelected = selectedSymbol === symbol.emoji;
          const IconComponent = symbol.icon;

          return (
            <motion.button
              key={symbol.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(symbol.emoji)}
              className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300
                ${isSelected 
                  ? 'border-primary bg-primary/10 shadow-glow' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
            >
              {/* Ícone principal */}
              <div className="flex flex-col items-center space-y-3">
                <div className={`
                  p-3 rounded-xl transition-colors duration-300
                  ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                `}>
                  <IconComponent className="w-8 h-8" />
                </div>
                
                <div className="text-center">
                  <p className="text-2xl mb-1">{symbol.emoji}</p>
                  <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {symbol.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {symbol.description}
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

      {/* Descrição do símbolo selecionado */}
      {selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-3xl">{selectedOption.emoji}</span>
              <h3 className="text-xl font-bold text-foreground">
                {selectedOption.name}
              </h3>
            </div>
            
            <p className="text-muted-foreground mb-3">
              {selectedOption.description}
            </p>
            
            <div className="text-sm text-muted-foreground italic">
              <p className="font-medium mb-1">Significado:</p>
              <p>{selectedOption.meaning}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Orientação */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm text-muted-foreground"
      >
        <p>
          Escolha o símbolo que mais ressoa com sua essência interior. 
          Este será seu emblema pessoal na jornada de transformação.
        </p>
      </motion.div>
    </div>
  );
};