
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AreaHeader from '@/components/areas/AreaHeader';
import JourneyCard from '@/components/areas/JourneyCard';
import JourneyFilters from '@/components/areas/JourneyFilters';
import { useHero } from '@/contexts/HeroContext';
import { HeroArea, Journey } from '@/types/hero';
import { INITIAL_JOURNEYS } from '@/data/initialJourneys';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const AreaExploration: React.FC = () => {
  const { area } = useParams<{ area: string }>();
  const navigate = useNavigate();
  const { journeys, addJourney } = useHero();
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  // Validar área
  const validAreas: HeroArea[] = ['Bem-Estar', 'Business', 'Maestria'];
  const currentArea = validAreas.find(a => a.toLowerCase() === area?.toLowerCase()) as HeroArea;

  if (!currentArea) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Área não encontrada</h1>
          <p className="text-muted-foreground">A área solicitada não existe.</p>
        </div>
      </div>
    );
  }

  // Combinar jornadas existentes com as iniciais, convertendo iniciais para Journey completo
  const allJourneys = useMemo(() => {
    const initialJourneysForArea = INITIAL_JOURNEYS.filter(j => j.area === currentArea);
    const userJourneysForArea = journeys.filter(j => j.area === currentArea);
    
    // Evitar duplicatas baseando-se no título
    const userJourneyTitles = new Set(userJourneysForArea.map(j => j.title));
    const filteredInitialJourneys = initialJourneysForArea.filter(
      j => !userJourneyTitles.has(j.title)
    );
    
    // Converter jornadas iniciais para Journey completo para uso na interface
    const convertedInitialJourneys: Journey[] = filteredInitialJourneys.map(initial => ({
      ...initial,
      id: undefined, // Marcar como não salva no banco
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    
    return [...userJourneysForArea, ...convertedInitialJourneys];
  }, [journeys, currentArea]);

  // Função para obter dificuldade baseada no número de etapas
  const getDifficultyLevel = (stages: Journey['stages']) => {
    const stageCount = stages.length;
    if (stageCount <= 2) return 'Fácil';
    if (stageCount <= 3) return 'Médio';
    return 'Avançado';
  };

  // Filtrar jornadas
  const filteredJourneys = useMemo(() => {
    return allJourneys.filter(journey => {
      // Filtro de busca
      const matchesSearch = searchTerm === '' || 
        journey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journey.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journey.narrativeType.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de status - usar "Não iniciada" para jornadas sem ID
      const journeyStatus = journey.id ? journey.status : 'Não iniciada';
      const matchesStatus = statusFilter === 'all' || journeyStatus === statusFilter;

      // Filtro de dificuldade
      const journeyDifficulty = getDifficultyLevel(journey.stages);
      const matchesDifficulty = difficultyFilter === 'all' || journeyDifficulty === difficultyFilter;

      return matchesSearch && matchesStatus && matchesDifficulty;
    });
  }, [allJourneys, searchTerm, statusFilter, difficultyFilter]);

  // Contar filtros ativos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm !== '') count++;
    if (statusFilter !== 'all') count++;
    if (difficultyFilter !== 'all') count++;
    return count;
  }, [searchTerm, statusFilter, difficultyFilter]);

  // Limpar todos os filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDifficultyFilter('all');
  };

  // Função para lidar com início de jornada
  const handleStartJourney = async (journey: Journey) => {
    if (journey.id) {
      // Jornada já existe no banco, navegar para ela
      navigate(`/hero-jornada/${journey.id}`);
    } else {
      // Jornada inicial, adicionar ao banco e depois navegar
      try {
        // Criar uma jornada com uma etapa de exemplo
        const testJourney = {
          ...journey,
          stages: [
            {
              id: 'stage-1',
              title: 'Primeira Etapa',
              description: 'Sua primeira etapa nesta jornada!',
              order: 1,
              completed: false,
              tasks: [],
              habits: [],
              xpReward: 100,
              createdAt: new Date().toISOString()
            }
          ]
        };
        
        const newJourney = await addJourney(testJourney);
        if (newJourney) {
          navigate(`/hero-jornada/${newJourney.id}`);
        }
      } catch (error) {
        console.error('Erro ao criar jornada:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Cabeçalho da Área */}
        <AreaHeader area={currentArea} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filtros - Sidebar */}
          <div className="lg:col-span-1">
            <JourneyFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              difficultyFilter={difficultyFilter}
              onDifficultyFilterChange={setDifficultyFilter}
              onClearFilters={handleClearFilters}
              activeFiltersCount={activeFiltersCount}
            />
          </div>

          {/* Lista de Jornadas */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Jornadas Disponíveis
              </h2>
              <div className="text-sm text-muted-foreground">
                {filteredJourneys.length} jornadas encontradas
              </div>
            </div>

            {filteredJourneys.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhuma jornada encontrada
                </h3>
                <p className="text-muted-foreground mb-4">
                  Tente ajustar os filtros ou buscar por outros termos.
                </p>
                <Button variant="outline" onClick={() => navigate('/criar-jornada')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Nova Jornada
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJourneys.map((journey, index) => (
                  <JourneyCard
                    key={journey.id || `initial-${journey.title}-${index}`}
                    journey={journey}
                    onStart={handleStartJourney}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaExploration;
