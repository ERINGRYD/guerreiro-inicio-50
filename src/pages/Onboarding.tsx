import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

// Importar componentes das etapas
import { NameStep } from '@/components/onboarding/NameStep';
import { SymbolStep } from '@/components/onboarding/SymbolStep';
import { ValueStep } from '@/components/onboarding/ValueStep';
import { PhraseStep } from '@/components/onboarding/PhraseStep';

interface OnboardingData {
  name: string;
  symbol: string;
  coreValue: string;
  phrase: string;
}

const INITIAL_DATA: OnboardingData = {
  name: '',
  symbol: '⚔️',
  coreValue: '',
  phrase: ''
};

const STEPS = [
  { title: 'Nome do Guerreiro', description: 'Como você gostaria de ser chamado?' },
  { title: 'Símbolo Sagrado', description: 'Escolha o símbolo que representa sua essência' },
  { title: 'Valor Central', description: 'Qual valor guiará sua jornada?' },
  { title: 'Frase de Poder', description: 'Crie sua frase inspiradora (opcional)' }
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { updateWarriorProfile, gameData } = useGame();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [isCompleting, setIsCompleting] = useState(false);

  // Verificar se já passou pelo onboarding
  useEffect(() => {
    if (gameData.warrior.name && gameData.warrior.coreValue) {
      navigate('/jogo', { replace: true });
    }
  }, [gameData.warrior, navigate]);

  const updateData = (field: keyof OnboardingData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const canContinue = () => {
    switch (currentStep) {
      case 0: return data.name.trim().length >= 2;
      case 1: return data.symbol !== '';
      case 2: return data.coreValue !== '';
      case 3: return true; // Frase é opcional
      default: return false;
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboarding = async () => {
    setIsCompleting(true);
    
    // Salvar perfil do guerreiro
    updateWarriorProfile({
      name: data.name.trim(),
      symbol: data.symbol,
      coreValue: data.coreValue,
      phrase: data.phrase.trim() || `Eu sou ${data.name}, guerreiro da ${data.coreValue.toLowerCase()}.`
    });

    // Aguardar um pouco para mostrar animação
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    navigate('/jogo', { replace: true });
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const pageVariants = {
    initial: { opacity: 0, x: 300 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -300 }
  };

  const pageTransition = {
    duration: 0.5
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <NameStep 
            name={data.name}
            onChange={(name) => updateData('name', name)}
          />
        );
      case 1:
        return (
          <SymbolStep 
            selectedSymbol={data.symbol}
            onChange={(symbol) => updateData('symbol', symbol)}
          />
        );
      case 2:
        return (
          <ValueStep 
            selectedValue={data.coreValue}
            onChange={(value) => updateData('coreValue', value)}
          />
        );
      case 3:
        return (
          <PhraseStep 
            phrase={data.phrase}
            onChange={(phrase) => updateData('phrase', phrase)}
            warriorName={data.name}
            coreValue={data.coreValue}
          />
        );
      default:
        return null;
    }
  };

  if (isCompleting) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-6"
            >
              <CheckCircle className="w-full h-full text-primary" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Bem-vindo, {data.name}!
            </h2>
            <p className="text-lg text-muted-foreground">
              Sua jornada de guerreiro está prestes a começar...
            </p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header com progresso */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Criação do Guerreiro
              </h1>
              <p className="text-muted-foreground">
                Etapa {currentStep + 1} de {STEPS.length}
              </p>
            </div>
            
            <div className="space-y-2">
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                {STEPS.map((step, index) => (
                  <span 
                    key={index}
                    className={`${index <= currentStep ? 'text-primary font-medium' : ''}`}
                  >
                    {step.title}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Conteúdo da etapa atual */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="mystic-card mb-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 text-foreground">
                  {STEPS[currentStep].title}
                </h2>
                <p className="text-muted-foreground">
                  {STEPS[currentStep].description}
                </p>
              </div>

              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navegação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-between"
          >
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>

            <Button
              onClick={nextStep}
              disabled={!canContinue()}
              className="flex items-center gap-2 bg-gradient-primary hover:opacity-90"
            >
              {currentStep === STEPS.length - 1 ? 'Finalizar' : 'Continuar'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Onboarding;