import React, { useState } from 'react';
import { Bell, Plus, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface HabitNotificationsProps {
  reminderTimes: string[];
  onUpdateReminders: (times: string[]) => void;
  enabled?: boolean;
  onToggleEnabled?: (enabled: boolean) => void;
}

export const HabitNotifications: React.FC<HabitNotificationsProps> = ({
  reminderTimes,
  onUpdateReminders,
  enabled = false,
  onToggleEnabled
}) => {
  const [newTime, setNewTime] = useState('08:00');

  const addReminderTime = () => {
    if (!reminderTimes.includes(newTime)) {
      onUpdateReminders([...reminderTimes, newTime].sort());
    }
    setNewTime('08:00');
  };

  const removeReminderTime = (timeToRemove: string) => {
    onUpdateReminders(reminderTimes.filter(time => time !== timeToRemove));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Lembretes
          </CardTitle>
          {onToggleEnabled && (
            <Switch
              checked={enabled}
              onCheckedChange={onToggleEnabled}
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {enabled && (
          <>
            {/* Add new reminder */}
            <div className="flex gap-2">
              <Input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addReminderTime} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Current reminders */}
            {reminderTimes.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Horários Configurados:</h4>
                <div className="space-y-2">
                  {reminderTimes.map(time => (
                    <div key={time} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{formatTime(time)}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeReminderTime(time)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum lembrete configurado</p>
              </div>
            )}
          </>
        )}

        {!enabled && (
          <div className="text-center py-6 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Lembretes desabilitados</p>
            <p className="text-xs mt-1">
              Ative para receber notificações nos horários definidos
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};