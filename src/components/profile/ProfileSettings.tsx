
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useHero } from '@/contexts/HeroContext';
import { db } from '@/lib/database';
import { toast } from '@/hooks/use-toast';
import { 
  Settings, 
  Download, 
  Upload, 
  Bell, 
  BellOff, 
  Trash2, 
  AlertTriangle,
  Database
} from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const { profile } = useHero();
  const [notifications, setNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const exportData = async () => {
    setIsExporting(true);
    try {
      const [profileData, journeys, tasks, habits] = await Promise.all([
        db.heroProfile.toArray(),
        db.journeys.toArray(),
        db.tasks.toArray(),
        db.habits.toArray()
      ]);

      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        data: {
          profile: profileData,
          journeys,
          tasks,
          habits
        }
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `herotask-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Backup Criado",
        description: "Seus dados foram exportados com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível exportar os dados",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsImporting(true);
      try {
        const text = await file.text();
        const importData = JSON.parse(text);

        if (!importData.data || !importData.version) {
          throw new Error('Formato de arquivo inválido');
        }

        // Confirmar importação
        if (!confirm('Isso substituirá todos os seus dados atuais. Tem certeza?')) {
          return;
        }

        // Limpar dados existentes
        await Promise.all([
          db.heroProfile.clear(),
          db.journeys.clear(),
          db.tasks.clear(),
          db.habits.clear()
        ]);

        // Importar novos dados
        if (importData.data.profile?.length > 0) {
          await db.heroProfile.bulkAdd(importData.data.profile);
        }
        if (importData.data.journeys?.length > 0) {
          await db.journeys.bulkAdd(importData.data.journeys);
        }
        if (importData.data.tasks?.length > 0) {
          await db.tasks.bulkAdd(importData.data.tasks);
        }
        if (importData.data.habits?.length > 0) {
          await db.habits.bulkAdd(importData.data.habits);
        }

        toast({
          title: "Dados Restaurados",
          description: "Seus dados foram importados com sucesso! Recarregue a página.",
        });

        // Recarregar página após 2 segundos
        setTimeout(() => {
          window.location.reload();
        }, 2000);

      } catch (error) {
        console.error('Erro ao importar dados:', error);
        toast({
          title: "Erro",
          description: "Não foi possível importar os dados. Verifique o arquivo.",
          variant: "destructive"
        });
      } finally {
        setIsImporting(false);
      }
    };
    input.click();
  };

  const clearAllData = async () => {
    if (!confirm('ATENÇÃO: Isso apagará TODOS os seus dados permanentemente. Esta ação não pode ser desfeita. Tem certeza absoluta?')) {
      return;
    }

    if (!confirm('Última confirmação: Todos os seus dados serão perdidos para sempre. Continuar?')) {
      return;
    }

    try {
      await Promise.all([
        db.heroProfile.clear(),
        db.journeys.clear(),
        db.tasks.clear(),
        db.habits.clear()
      ]);

      toast({
        title: "Dados Apagados",
        description: "Todos os dados foram removidos. Redirecionando para o onboarding...",
      });

      setTimeout(() => {
        window.location.href = '/onboarding';
      }, 2000);

    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível apagar os dados",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificações Gerais</p>
              <p className="text-sm text-muted-foreground">Receber notificações do sistema</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Lembretes Diários</p>
              <p className="text-sm text-muted-foreground">Lembrete para completar tarefas diárias</p>
            </div>
            <Switch checked={dailyReminders} onCheckedChange={setDailyReminders} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alertas de Conquistas</p>
              <p className="text-sm text-muted-foreground">Notificar quando desbloquear conquistas</p>
            </div>
            <Switch checked={achievementAlerts} onCheckedChange={setAchievementAlerts} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Backup e Restauração
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={exportData}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exportando...' : 'Exportar Dados'}
            </Button>
            
            <Button
              onClick={importData}
              disabled={isImporting}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {isImporting ? 'Importando...' : 'Importar Dados'}
            </Button>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Dica:</strong> Faça backup regular dos seus dados para não perder seu progresso.
              O arquivo exportado contém todas as suas jornadas, tarefas, hábitos e estatísticas.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Zona de Perigo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-destructive mb-2">Apagar Todos os Dados</p>
              <p className="text-sm text-muted-foreground mb-4">
                Esta ação remove permanentemente todos os seus dados, incluindo perfil, jornadas, 
                tarefas, hábitos e estatísticas. Esta ação não pode ser desfeita.
              </p>
              <Button
                onClick={clearAllData}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Apagar Todos os Dados
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
