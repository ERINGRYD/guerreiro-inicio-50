
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAttributeSystem } from '@/hooks/useAttributeSystem';
import { Target } from 'lucide-react';

interface AttributeGoalSetterProps {
  attributeId: string;
  onClose: () => void;
}

const AttributeGoalSetter: React.FC<AttributeGoalSetterProps> = ({ attributeId, onClose }) => {
  const { attributes, setAttributeGoal } = useAttributeSystem();
  const attribute = attributes.find(attr => attr.id === attributeId);
  
  const [targetLevel, setTargetLevel] = useState(attribute ? attribute.level + 1 : 2);
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  if (!attribute) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDate || targetLevel <= attribute.level) return;

    setSaving(true);
    try {
      await setAttributeGoal(attributeId, targetLevel, targetDate, description || undefined);
      onClose();
    } catch (error) {
      console.error('Erro ao definir meta:', error);
    } finally {
      setSaving(false);
    }
  };

  // Calculate minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Definir Meta para {attribute.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <span className="text-2xl">{attribute.icon}</span>
            <div>
              <p className="font-medium">{attribute.name}</p>
              <p className="text-sm text-muted-foreground">
                Nível atual: {attribute.level}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetLevel">Nível desejado</Label>
            <Input
              id="targetLevel"
              type="number"
              min={attribute.level + 1}
              max={attribute.maxLevel}
              value={targetLevel}
              onChange={(e) => setTargetLevel(parseInt(e.target.value))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Máximo: {attribute.maxLevel}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Data limite</Label>
            <Input
              id="targetDate"
              type="date"
              min={minDate}
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Por que esta meta é importante para você?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={saving || !targetDate || targetLevel <= attribute.level}
              className="flex-1"
            >
              {saving ? 'Salvando...' : 'Definir Meta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AttributeGoalSetter;
