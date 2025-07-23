
import Dexie, { Table } from 'dexie';
import { HeroProfile, Journey, Task } from '@/types/hero';
import { Habit } from '@/types/habit';
import { HeroAttribute, AttributeHistory, AttributeGoal } from '@/types/attribute';

export class HeroTaskDatabase extends Dexie {
  heroProfile!: Table<HeroProfile>;
  journeys!: Table<Journey>;
  tasks!: Table<Task>;
  habits!: Table<Habit, string>;
  heroAttributes!: Table<HeroAttribute, string>;
  attributeHistory!: Table<AttributeHistory, string>;
  attributeGoals!: Table<AttributeGoal, string>;

  constructor() {
    super('HeroTaskDatabase');
    
    this.version(2).stores({
      heroProfile: '++id, totalXp, level, heroName, heroClass, avatar, createdAt, updatedAt',
      journeys: '++id, title, area, status, createdAt, updatedAt',
      tasks: '++id, stageId, journeyId, title, completed, priority, startDate, dueDate, createdAt',
      habits: 'id, stageId, journeyId, name, frequency, difficulty, classification, isActive, createdAt',
      heroAttributes: 'id, name, area, level, currentXp, isCustom, createdAt, updatedAt',
      attributeHistory: 'id, attributeId, date, xpGained, source, createdAt',
      attributeGoals: 'id, attributeId, targetLevel, targetDate, isActive, createdAt'
    });

    // Migration logic for version 2
    this.version(2).upgrade(tx => {
      console.log('Upgrading database to version 2 - Adding attribute tables and journeyId to tasks');
    });

    // Executar migrações após abertura do banco
    this.open().then(() => {
      this.runPostInitMigrations();
    });
  }

  private async runPostInitMigrations() {
    try {
      const hasRunMigrations = localStorage.getItem('heroTask_migrations_v2');
      
      if (!hasRunMigrations) {
        console.log('Executando migrações de dados...');
        
        // Importar dinamicamente para evitar dependências circulares
        const { runMigrations } = await import('./stageIdMigration');
        await runMigrations();
        
        localStorage.setItem('heroTask_migrations_v2', 'true');
        console.log('Migrações concluídas com sucesso');
      }
    } catch (error) {
      console.error('Erro ao executar migrações:', error);
    }
  }
}

export const db = new HeroTaskDatabase();

// Initialize default profile if it doesn't exist
export const initializeDefaultProfile = async (): Promise<HeroProfile> => {
  const existingProfile = await db.heroProfile.toCollection().first();
  
  if (!existingProfile) {
    const defaultProfile: HeroProfile = {
      totalXp: 0,
      level: 1,
      heroName: '',
      heroClass: '',
      avatar: '⚔️',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const id = await db.heroProfile.add(defaultProfile);
    return { ...defaultProfile, id };
  }
  
  return existingProfile;
};

// Initialize base attributes for a hero
export const initializeHeroAttributes = async (): Promise<HeroAttribute[]> => {
  const existingAttributes = await db.heroAttributes.toArray();
  
  if (existingAttributes.length === 0) {
    const { BASE_ATTRIBUTES } = await import('@/types/attribute');
    const attributesToCreate: HeroAttribute[] = Object.entries(BASE_ATTRIBUTES).map(([id, config]) => ({
      id,
      name: config.name,
      description: config.description,
      icon: config.icon,
      currentXp: 0,
      level: 1,
      maxLevel: 10,
      xpPerLevel: 100,
      area: config.area,
      isCustom: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    await db.heroAttributes.bulkAdd(attributesToCreate);
    return attributesToCreate;
  }
  
  return existingAttributes;
};
