import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface NameStepProps {
  name: string;
  onChange: (name: string) => void;
}

export const NameStep: React.FC<NameStepProps> = ({ name, onChange }) => {
  const [focused, setFocused] = useState(false);
  
  const isValid = name.trim().length >= 2;
  const showValidation = name.length > 0;

  const suggestions = [
    'Guardião das Sombras',
    'Portador da Luz',
    'Caminhante dos Ventos',
    'Forjador de Destinos',
    'Desperto da Aurora'
  ];

  return (
    <div className="space-y-6">
      {/* Campo de input principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <Label htmlFor="warrior-name" className="text-lg font-medium">
          Nome do Guerreiro
        </Label>
        
        <div className="relative">
          <Input
            id="warrior-name"
            value={name}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Digite seu nome de guerreiro..."
            className={`text-lg py-3 px-4 transition-all duration-200 ${
              focused ? 'ring-2 ring-primary shadow-glow' : ''
            } ${
              showValidation ? (isValid ? 'border-green-500' : 'border-red-500') : ''
            }`}
            maxLength={30}
          />
          
          {/* Ícone de validação */}
          {showValidation && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {isValid ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </motion.div>
          )}
        </div>

        {/* Contador de caracteres */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            {showValidation && !isValid && 'Mínimo 2 caracteres'}
            {isValid && '✨ Nome válido!'}
          </span>
          <span>{name.length}/30</span>
        </div>
      </motion.div>

      {/* Descrição e dicas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="text-center text-muted-foreground">
          <p className="mb-4">
            Escolha um nome que ressoe com sua força interior. Pode ser seu nome real, 
            um apelido especial, ou um nome totalmente novo que represente quem você está se tornando.
          </p>
        </div>

        {/* Sugestões */}
        {!name && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-medium text-center text-muted-foreground">
              Inspirações:
            </h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onChange(suggestion)}
                  className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded-full transition-colors border border-border hover:border-primary/50"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Preview do nome */}
      {isValid && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20"
        >
          <p className="text-sm text-muted-foreground mb-2">Seu nome de guerreiro:</p>
          <p className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {name}
          </p>
        </motion.div>
      )}
    </div>
  );
};