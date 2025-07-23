
import { useState, useEffect, useCallback } from 'react';
import { db, initializeHeroAttributes } from '@/lib/database';
import { HeroAttribute, AttributeHistory, AttributeGoal, AttributeUtils, JOURNEY_ATTRIBUTE_MAPPING } from '@/types/attribute';
import { toast } from '@/hooks/use-toast';

export const useAttributeSystem = () => {
  const [attributes, setAttributes] = useState<HeroAttribute[]>([]);
  const [history, setHistory] = useState<AttributeHistory[]>([]);
  const [goals, setGoals] = useState<AttributeGoal[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAttributes = useCallback(async () => {
    try {
      const heroAttributes = await initializeHeroAttributes();
      const attributeHistory = await db.attributeHistory.orderBy('date').reverse().toArray();
      const attributeGoals = await db.attributeGoals.where('isActive').equals(1).toArray();
      
      setAttributes(heroAttributes);
      setHistory(attributeHistory);
      setGoals(attributeGoals);
    } catch (error) {
      console.error('Erro ao carregar sistema de atributos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os atributos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const addAttributeXP = useCallback(async (attributeId: string, xpAmount: number, source: AttributeHistory['source'], sourceId?: string) => {
    try {
      const attribute = attributes.find(attr => attr.id === attributeId);
      if (!attribute) return;

      const newXp = attribute.currentXp + xpAmount;
      const newLevel = AttributeUtils.calculateLevel(newXp, attribute.xpPerLevel);
      const leveledUp = newLevel > attribute.level;

      // Update attribute
      const updatedAttribute = {
        ...attribute,
        currentXp: newXp,
        level: Math.min(newLevel, attribute.maxLevel),
        updatedAt: new Date().toISOString()
      };

      await db.heroAttributes.update(attributeId, updatedAttribute);

      // Add to history
      const historyEntry: AttributeHistory = {
        id: `${attributeId}-${Date.now()}`,
        attributeId,
        date: new Date().toISOString(),
        xpGained: xpAmount,
        levelBefore: attribute.level,
        levelAfter: updatedAttribute.level,
        source,
        sourceId
      };

      await db.attributeHistory.add(historyEntry);

      // Update local state
      setAttributes(prev => 
        prev.map(attr => attr.id === attributeId ? updatedAttribute : attr)
      );
      
      setHistory(prev => [historyEntry, ...prev]);

      // Show notification
      if (leveledUp) {
        toast({
          title: `🎉 ${attribute.name} Subiu de Nível!`,
          description: `Parabéns! Você alcançou o nível ${updatedAttribute.level} em ${attribute.name}!`,
        });
      } else {
        toast({
          title: `+${xpAmount} XP em ${attribute.name}`,
          description: "Atributo desenvolvido!",
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar XP ao atributo:', error);
    }
  }, [attributes]);

  const addAttributeXPForJourney = useCallback(async (journeyTitle: string, xpAmount: number, source: AttributeHistory['source'], sourceId?: string) => {
    try {
      // Find journey mapping
      const journeyKey = Object.keys(JOURNEY_ATTRIBUTE_MAPPING).find(key => 
        journeyTitle.toLowerCase().includes(key) || key.includes(journeyTitle.toLowerCase())
      );

      if (!journeyKey) {
        console.log('No attribute mapping found for journey:', journeyTitle);
        return;
      }

      const attributeIds = JOURNEY_ATTRIBUTE_MAPPING[journeyKey as keyof typeof JOURNEY_ATTRIBUTE_MAPPING];
      
      // Distribute XP among the journey's attributes
      const xpPerAttribute = Math.floor(xpAmount / attributeIds.length);
      
      for (const attributeId of attributeIds) {
        await addAttributeXP(attributeId, xpPerAttribute, source, sourceId);
      }
    } catch (error) {
      console.error('Erro ao adicionar XP de jornada aos atributos:', error);
    }
  }, [addAttributeXP]);

  const createCustomAttribute = useCallback(async (attributeData: Omit<HeroAttribute, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newAttribute: HeroAttribute = {
        ...attributeData,
        id: `custom-${Date.now()}`,
        isCustom: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await db.heroAttributes.add(newAttribute);
      setAttributes(prev => [...prev, newAttribute]);

      toast({
        title: "Atributo Personalizado Criado",
        description: `${newAttribute.name} foi adicionado aos seus atributos!`,
      });

      return newAttribute;
    } catch (error) {
      console.error('Erro ao criar atributo personalizado:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o atributo personalizado",
        variant: "destructive"
      });
    }
  }, []);

  const setAttributeGoal = useCallback(async (attributeId: string, targetLevel: number, targetDate: string, description?: string) => {
    try {
      // Deactivate existing goals for this attribute
      const existingGoals = await db.attributeGoals.where('attributeId').equals(attributeId).toArray();
      for (const goal of existingGoals) {
        await db.attributeGoals.update(goal.id, { isActive: false });
      }

      const newGoal: AttributeGoal = {
        id: `goal-${attributeId}-${Date.now()}`,
        attributeId,
        targetLevel,
        targetDate,
        description,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      await db.attributeGoals.add(newGoal);
      setGoals(prev => [...prev.filter(g => g.attributeId !== attributeId), newGoal]);

      toast({
        title: "Meta Definida",
        description: `Meta estabelecida para ${attributes.find(a => a.id === attributeId)?.name}!`,
      });
    } catch (error) {
      console.error('Erro ao definir meta de atributo:', error);
    }
  }, [attributes]);

  const getRecommendedJourneys = useCallback((attributeId: string): string[] => {
    const recommendedJourneys: string[] = [];
    
    Object.entries(JOURNEY_ATTRIBUTE_MAPPING).forEach(([journeyKey, attributeIds]) => {
      if ((attributeIds as readonly string[]).includes(attributeId)) {
        recommendedJourneys.push(journeyKey);
      }
    });

    return recommendedJourneys;
  }, []);

  const getAttributeStats = useCallback(() => {
    const totalXp = attributes.reduce((sum, attr) => sum + attr.currentXp, 0);
    const averageLevel = attributes.length > 0 
      ? attributes.reduce((sum, attr) => sum + attr.level, 0) / attributes.length 
      : 1;
    const lowestAttributes = AttributeUtils.getLowestAttributes(attributes, 3);

    return {
      totalAttributeXp: totalXp,
      averageLevel: Math.round(averageLevel * 100) / 100,
      lowestAttributes,
      totalAttributes: attributes.length,
      customAttributes: attributes.filter(attr => attr.isCustom).length
    };
  }, [attributes]);

  useEffect(() => {
    loadAttributes();
  }, [loadAttributes]);

  return {
    attributes,
    history,
    goals,
    loading,
    addAttributeXP,
    addAttributeXPForJourney,
    createCustomAttribute,
    setAttributeGoal,
    getRecommendedJourneys,
    getAttributeStats,
    reloadAttributes: loadAttributes
  };
};
