import { useState, useCallback } from 'react';
import { Journey } from '@/types/hero';
import { useJourneys } from '@/hooks/useHeroDatabase';
import { toast } from '@/hooks/use-toast';
import { JOURNEY_TEMPLATES } from '@/data/initialJourneys';

interface ImportValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface ImportOptions {
  replaceDuplicates?: boolean;
  skipDuplicates?: boolean;
  generateNewIds?: boolean;
}

export const useJourneyImport = () => {
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const { addJourney, journeys } = useJourneys();

  const validateJourneyData = useCallback((data: any): ImportValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data || typeof data !== 'object') {
      errors.push('Arquivo deve conter um objeto JSON válido');
      return { isValid: false, errors, warnings };
    }

    // Validar se é uma jornada única ou array de jornadas
    const journeysToValidate = Array.isArray(data) ? data : [data];

    journeysToValidate.forEach((journey, index) => {
      const prefix = journeysToValidate.length > 1 ? `Jornada ${index + 1}: ` : '';

      // Campos obrigatórios
      if (!journey.title || typeof journey.title !== 'string') {
        errors.push(`${prefix}Campo 'title' é obrigatório e deve ser uma string`);
      }
      if (!journey.description || typeof journey.description !== 'string') {
        errors.push(`${prefix}Campo 'description' é obrigatório e deve ser uma string`);
      }
      if (!journey.area || !['Bem-Estar', 'Business', 'Maestria'].includes(journey.area)) {
        errors.push(`${prefix}Campo 'area' deve ser 'Bem-Estar', 'Business' ou 'Maestria'`);
      }
      if (!journey.narrativeType || typeof journey.narrativeType !== 'string') {
        errors.push(`${prefix}Campo 'narrativeType' é obrigatório`);
      }

      // Validar stages se existir
      if (journey.stages && !Array.isArray(journey.stages)) {
        errors.push(`${prefix}Campo 'stages' deve ser um array`);
      }

      // Verificar duplicatas
      const isDuplicate = journeys.some(existing => 
        existing.title.toLowerCase() === journey.title.toLowerCase() &&
        existing.area === journey.area
      );
      
      if (isDuplicate) {
        warnings.push(`${prefix}Jornada '${journey.title}' já existe`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }, [journeys]);

  const processJourneyForImport = useCallback((journeyData: any): Omit<Journey, 'id' | 'createdAt' | 'updatedAt'> => {
    return {
      title: journeyData.title,
      description: journeyData.description,
      narrativeType: journeyData.narrativeType,
      icon: journeyData.icon || '🎯',
      area: journeyData.area,
      graduationMode: journeyData.graduationMode || false,
      stages: journeyData.stages || [],
      status: 'Em Progresso',
      objectiveType: journeyData.objectiveType,
      objectiveName: journeyData.objectiveName,
      objectiveDescription: journeyData.objectiveDescription,
      objectiveIcon: journeyData.objectiveIcon,
      totalXpReward: journeyData.totalXpReward || 0
    };
  }, []);

  const importFromFile = useCallback(async (file: File, options: ImportOptions = {}) => {
    setImporting(true);
    setImportProgress(0);

    try {
      const fileContent = await file.text();
      const data = JSON.parse(fileContent);
      
      const validation = validateJourneyData(data);
      
      if (!validation.isValid) {
        toast({
          title: "Erro na Validação",
          description: `Arquivo inválido: ${validation.errors.join(', ')}`,
          variant: "destructive"
        });
        return { success: false, errors: validation.errors };
      }

      if (validation.warnings.length > 0) {
        console.warn('Avisos de importação:', validation.warnings);
      }

      const journeysToImport = Array.isArray(data) ? data : [data];
      const results = [];

      for (let i = 0; i < journeysToImport.length; i++) {
        const journeyData = journeysToImport[i];
        setImportProgress((i / journeysToImport.length) * 100);

        try {
          const processedJourney = processJourneyForImport(journeyData);
          const result = await addJourney(processedJourney);
          if (result) {
            results.push({ success: true, journey: result });
          }
        } catch (error) {
          console.error(`Erro ao importar jornada ${journeyData.title}:`, error);
          results.push({ success: false, error: error.message, title: journeyData.title });
        }
      }

      setImportProgress(100);

      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;

      if (successCount > 0) {
        toast({
          title: "Importação Concluída",
          description: `${successCount} jornada(s) importada(s) com sucesso${errorCount > 0 ? `. ${errorCount} falhou(ram).` : '.'}`,
        });
      }

      return { success: true, results, successCount, errorCount };

    } catch (error) {
      console.error('Erro ao importar arquivo:', error);
      toast({
        title: "Erro na Importação",
        description: error.message.includes('JSON') 
          ? "Arquivo JSON inválido ou corrompido" 
          : "Erro inesperado durante a importação",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setImporting(false);
      setImportProgress(0);
    }
  }, [validateJourneyData, processJourneyForImport, addJourney]);

  const importTemplate = useCallback(async (templateId: string) => {
    const template = JOURNEY_TEMPLATES.find(t => t.id === templateId);
    
    if (!template) {
      toast({
        title: "Erro",
        description: "Template não encontrado",
        variant: "destructive"
      });
      return { success: false };
    }

    try {
      const processedJourney = processJourneyForImport(template);
      const result = await addJourney(processedJourney);
      
      if (result) {
        toast({
          title: "Template Importado",
          description: `Jornada '${template.title}' foi adicionada com sucesso!`,
        });
        return { success: true, journey: result };
      }
    } catch (error) {
      console.error('Erro ao importar template:', error);
      toast({
        title: "Erro",
        description: "Não foi possível importar o template",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  }, [addJourney, processJourneyForImport]);

  const getAvailableTemplates = useCallback(() => {
    return JOURNEY_TEMPLATES.map(template => ({
      id: template.id,
      title: template.title,
      description: template.description,
      area: template.area,
      icon: template.icon,
      stagesCount: template.stages?.length || 0
    }));
  }, []);

  return {
    importing,
    importProgress,
    validateJourneyData,
    importFromFile,
    importTemplate,
    getAvailableTemplates
  };
};