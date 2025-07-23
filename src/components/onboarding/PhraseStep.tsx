import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw } from 'lucide-react';

interface PhraseStepProps {
  phrase: string;
  onChange: (phrase: string) => void;
  warriorName: string;
  coreValue: string;
}

export const PhraseStep: React.FC<PhraseStepProps> = ({ 
  phrase, 
  onChange, 
  warriorName, 
  coreValue 
}) => {
  const [focused, setFocused] = useState(false);

  // Gerar sugestões baseadas no nome e valor
  const generateSuggestions = () => {
    const suggestions = [
      `Eu sou ${warriorName}, e minha ${coreValue.toLowerCase()} é minha força.`,
      `Com ${coreValue.toLowerCase()}, eu transformo desafios em vitórias.`,
      `${warriorName} caminha com ${coreValue.toLowerCase()} e determinação.`,
      `Cada passo que dou é guiado pela ${coreValue.toLowerCase()}.`,
      `Eu, ${warriorName}, escolho crescer através da ${coreValue.toLowerCase()}.`,
      `Minha jornada é de ${coreValue.toLowerCase()} e transformação constante.`,
      `${coreValue} é minha bússola, ${warriorName} é meu nome.`,
      `Eu abraço cada desafio com ${coreValue.toLowerCase()} no coração.`
    ];
    
    return suggestions;
  };

  const suggestions = generateSuggestions();
  const defaultPhrase = suggestions[0];

  // Definir frase padrão se estiver vazia
  useEffect(() => {
    if (!phrase && warriorName && coreValue) {
      onChange(defaultPhrase);
    }
  }, [warriorName, coreValue, phrase, defaultPhrase, onChange]);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
  };

  const generateRandomPhrase = () => {
    const randomIndex = Math.floor(Math.random() * suggestions.length);
    onChange(suggestions[randomIndex]);
  };

  return (
    <div className="space-y-6">
      {/* Explicação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <p className="text-muted-foreground">
          Crie uma frase que te inspire e te lembre de quem você é nos momentos desafiadores.
        </p>
        <p className="text-sm text-muted-foreground">
          Esta frase será seu mantra pessoal. Você pode personalizá-la ou usar uma das sugestões.
        </p>
      </motion.div>

      {/* Campo de texto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <Label htmlFor="warrior-phrase" className="text-lg font-medium">
            Sua Frase de Poder
          </Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={generateRandomPhrase}
            className="flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <RotateCcw className="w-4 h-4" />
            Nova sugestão
          </Button>
        </div>
        
        <div className="relative">
          <Textarea
            id="warrior-phrase"
            value={phrase}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Digite sua frase inspiradora..."
            className={`min-h-[120px] text-base resize-none transition-all duration-200 ${
              focused ? 'ring-2 ring-primary shadow-glow' : ''
            }`}
            maxLength={200}
          />
        </div>

        {/* Contador de caracteres */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            {phrase && '✨ Sua frase de poder está pronta!'}
          </span>
          <span>{phrase.length}/200</span>
        </div>
      </motion.div>

      {/* Sugestões */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-medium text-center">
              Sugestões Personalizadas
            </h4>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          
          <div className="grid gap-3">
            {suggestions.slice(0, 4).map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`
                  p-4 text-left rounded-lg border transition-all duration-200
                  ${phrase === suggestion 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }
                `}
              >
                <p className="text-sm italic">"{suggestion}"</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Preview da frase */}
      {phrase && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20"
        >
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">Sua frase de poder:</p>
            <blockquote className="text-lg font-medium text-foreground italic">
              "{phrase}"
            </blockquote>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">—</span>
              <span className="text-sm font-medium text-primary">{warriorName}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Nota sobre opcional */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-xs text-muted-foreground"
      >
        <p>
          💡 Esta frase é opcional, mas pode ser uma fonte poderosa de motivação. 
          Você pode mudá-la a qualquer momento no seu perfil.
        </p>
      </motion.div>
    </div>
  );
};