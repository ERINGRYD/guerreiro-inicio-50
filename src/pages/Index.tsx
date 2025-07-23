import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "@/components/layout/Layout";
import { EpicButton } from "@/components/ui/epic-button";
import { Sword, Shield, Sparkles, Target, Zap, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { useGame } from '@/contexts/GameContext';

const Index = () => {
  const navigate = useNavigate();
  const { gameData } = useGame();

  // Verificar se precisa fazer onboarding
  useEffect(() => {
    // Se não tem nome ou valor central, redirecionar para onboarding
    if (!gameData.warrior.name || !gameData.warrior.coreValue) {
      navigate('/onboarding');
    }
  }, [gameData.warrior, navigate]);

  const features = [
    {
      icon: Sword,
      title: "Batalhas Internas",
      description: "Enfrente seus medos e limitações em desafios épicos"
    },
    {
      icon: Shield,
      title: "Fortaleza Mental",
      description: "Desenvolva resiliência e força interior"
    },
    {
      icon: Target,
      title: "Missões Diárias",
      description: "Complete objetivos que transformam sua vida"
    },
    {
      icon: Zap,
      title: "Poder Interior",
      description: "Desperte habilidades que você nem sabia que tinha"
    },
    {
      icon: Crown,
      title: "Reino Pessoal",
      description: "Construa o império da sua melhor versão"
    },
    {
      icon: Sparkles,
      title: "Magia da Transformação",
      description: "Viva a magia de se tornar quem você realmente é"
    }
  ];

  const getJourneyButtonText = () => {
    if (gameData.warrior.name) {
      return "Continuar Jornada";
    }
    return "Iniciar Jornada";
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <h1 className="hero-title mb-6 animate-gradient">
              O Jogo da Vida do
              <br />
              Guerreiro Interno
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transforme sua vida em uma aventura épica. Cada desafio é uma batalha, 
              cada vitória é uma conquista rumo à sua melhor versão.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/jogo">
              <EpicButton variant="hero" size="xl" className="w-full sm:w-auto">
                <Sword className="w-5 h-5" />
                {getJourneyButtonText()}
              </EpicButton>
            </Link>
            <Link to="/perfil">
              <EpicButton variant="outline" size="xl" className="w-full sm:w-auto">
                <Shield className="w-5 h-5" />
                Ver Perfil
              </EpicButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Desperte Seu Guerreiro Interior
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubra as ferramentas místicas que irão guiá-lo na jornada de autodescoberta e transformação
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="mystic-card group hover:scale-105 transition-all duration-500"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 group-hover:animate-pulse-glow">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mystic-card max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Sua Aventura Épica Começa Agora
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              Não espere mais. O guerreiro interior que existe em você está pronto para despertar.
            </p>
            <Link to="/jogo">
              <EpicButton variant="glow" size="lg" className="w-full sm:w-auto">
                <Sparkles className="w-5 h-5" />
                Despertar Guerreiro
              </EpicButton>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
