import { useState, useEffect, useCallback } from 'react';

// Hook personalizado para gerenciar localStorage com TypeScript
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // State para armazenar nosso valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Obter do localStorage por chave
      const item = window.localStorage.getItem(key);
      // Parsear JSON armazenado ou retornar valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Se erro, retornar valor inicial
      console.error(`Erro ao ler localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Função para definir valor no state e localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Permitir valor ser uma função para ter a mesma API do useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Salvar no state
      setStoredValue(valueToStore);
      
      // Salvar no localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Disparar evento customizado para sincronização entre abas
      window.dispatchEvent(new CustomEvent('localStorage-change', {
        detail: { key, value: valueToStore }
      }));
    } catch (error) {
      console.error(`Erro ao salvar no localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Função para limpar valor
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      
      window.dispatchEvent(new CustomEvent('localStorage-change', {
        detail: { key, value: null }
      }));
    } catch (error) {
      console.error(`Erro ao remover localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Escutar mudanças do localStorage de outras abas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Erro ao sincronizar localStorage key "${key}":`, error);
        }
      }
    };

    const handleCustomChange = (e: CustomEvent) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value || initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorage-change', handleCustomChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorage-change', handleCustomChange as EventListener);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// Hook para gerenciar múltiplas chaves localStorage
export function useMultipleLocalStorage<T extends Record<string, any>>(
  keys: (keyof T)[],
  initialValues: T
) {
  const [values, setValues] = useState<T>(() => {
    const stored = {} as T;
    keys.forEach(key => {
      try {
        const item = window.localStorage.getItem(key as string);
        stored[key] = item ? JSON.parse(item) : initialValues[key];
      } catch (error) {
        console.error(`Erro ao ler localStorage key "${String(key)}":`, error);
        stored[key] = initialValues[key];
      }
    });
    return stored;
  });

  const updateValue = useCallback(<K extends keyof T>(key: K, value: T[K] | ((val: T[K]) => T[K])) => {
    setValues(prev => {
      const newValue = value instanceof Function ? value(prev[key]) : value;
      const updated = { ...prev, [key]: newValue };
      
      try {
        window.localStorage.setItem(key as string, JSON.stringify(newValue));
        window.dispatchEvent(new CustomEvent('localStorage-change', {
          detail: { key, value: newValue }
        }));
      } catch (error) {
        console.error(`Erro ao salvar localStorage key "${String(key)}":`, error);
      }
      
      return updated;
    });
  }, []);

  const removeValue = useCallback(<K extends keyof T>(key: K) => {
    setValues(prev => {
      const updated = { ...prev, [key]: initialValues[key] };
      try {
        window.localStorage.removeItem(key as string);
        window.dispatchEvent(new CustomEvent('localStorage-change', {
          detail: { key, value: null }
        }));
      } catch (error) {
        console.error(`Erro ao remover localStorage key "${String(key)}":`, error);
      }
      return updated;
    });
  }, [initialValues]);

  return { values, updateValue, removeValue };
}

// Hook para backup e restore de dados
export function useBackupRestore() {
  const exportData = useCallback((data: any, filename: string = 'warrior-backup') => {
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      return false;
    }
  }, []);

  const importData = useCallback((file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          resolve(data);
        } catch (error) {
          reject(new Error('Arquivo inválido ou corrompido'));
        }
      };
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    });
  }, []);

  const validateBackupData = useCallback((data: any): boolean => {
    // Validação básica da estrutura dos dados
    return (
      data &&
      typeof data === 'object' &&
      data.warrior &&
      data.journeys &&
      data.stats &&
      Array.isArray(data.journeys)
    );
  }, []);

  return { exportData, importData, validateBackupData };
}