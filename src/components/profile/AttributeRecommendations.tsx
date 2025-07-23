
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAttributeSystem } from '@/hooks/useAttributeSystem';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, ArrowRight, TrendingDown } from 'lucide-react';

const AttributeRecommendations: React.FC = () => {
  const { getAttributeStats, getRecommendedJourneys } = useAttributeSystem();
  const navigate = useNavigate();
  const stats = getAttributeStats();

  if (stats.lowestAttributes.length === 0) return null;

  const handleJourneyClick = (journeyKey: string) => {
    // Navigate to journey creation or area exploration
    const areaMap: { [key: string]: string } = {
      'autoconhecimento': 'Bem-Estar',
      'saude-mental': 'Bem-Estar',
      'relacionamentos': 'Bem-Estar',
      'bem-estar-fisico': 'Bem-Estar',
      'produtividade': 'Business',
      'lideranca': 'Business',
      'empreendedorismo': 'Business',
      'financas': 'Business',
      'aprendizado': 'Maestria',
      'criatividade': 'Maestria',
      'espiritualidade': 'Maestria',
      'arte': 'Maestria'
    };

    const area = areaMap[journeyKey];
    if (area) {
      navigate(`/area/${area}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Recomendações Inteligentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingDown className="w-4 h-4" />
          <span>Baseado nos seus atributos com menor desenvolvimento</span>
        </div>

        <div className="space-y-4">
          {stats.lowestAttributes.slice(0, 3).map((attribute) => {
            const recommendedJourneys = getRecommendedJourneys(attribute.id);
            
            return (
              <div key={attribute.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{attribute.icon}</span>
                    <div>
                      <span className="font-medium">{attribute.name}</span>
                      <Badge variant="outline" className="ml-2">
                        Nível {attribute.level}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="secondary">{attribute.area}</Badge>
                </div>

                <p className="text-sm text-muted-foreground">
                  Desenvolva este atributo criando jornadas relacionadas:
                </p>

                <div className="flex flex-wrap gap-2">
                  {recommendedJourneys.slice(0, 3).map((journeyKey) => (
                    <Button
                      key={journeyKey}
                      size="sm"
                      variant="outline"
                      onClick={() => handleJourneyClick(journeyKey)}
                      className="flex items-center gap-1"
                    >
                      <span className="capitalize">
                        {journeyKey.replace('-', ' ')}
                      </span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t">
          <Button
            variant="default"
            onClick={() => navigate('/criar-jornada')}
            className="w-full"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Criar Nova Jornada
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttributeRecommendations;
