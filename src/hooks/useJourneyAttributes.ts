
import { useState, useEffect } from 'react';
import { useAttributeSystem } from './useAttributeSystem';
import { JOURNEY_ATTRIBUTE_MAPPING } from '@/types/attribute';

export const useJourneyAttributes = (journeyTitle?: string, area?: string) => {
  const { attributes } = useAttributeSystem();
  const [relevantAttributes, setRelevantAttributes] = useState<string[]>([]);

  useEffect(() => {
    if (!journeyTitle && !area) {
      setRelevantAttributes([]);
      return;
    }

    // Try to find attributes by journey title first
    if (journeyTitle) {
      const journeyKey = Object.keys(JOURNEY_ATTRIBUTE_MAPPING).find(key => 
        journeyTitle.toLowerCase().includes(key) || 
        key.includes(journeyTitle.toLowerCase())
      );

      if (journeyKey) {
        const mappedAttributes = JOURNEY_ATTRIBUTE_MAPPING[journeyKey as keyof typeof JOURNEY_ATTRIBUTE_MAPPING];
        setRelevantAttributes([...mappedAttributes]);
        return;
      }
    }

    // Fallback to area-based attributes
    if (area) {
      const areaAttributes = attributes
        .filter(attr => attr.area === area)
        .map(attr => attr.id);
      setRelevantAttributes(areaAttributes);
    }
  }, [journeyTitle, area, attributes]);

  return {
    relevantAttributes,
    allAreaAttributes: area ? attributes.filter(attr => attr.area === area) : []
  };
};
