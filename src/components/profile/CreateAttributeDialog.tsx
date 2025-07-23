
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAttributeSystem } from '@/hooks/useAttributeSystem';
import IconSelector from './IconSelector';
import { HeroAttribute } from '@/types/attribute';

const createAttributeSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(30, 'Nome deve ter no máximo 30 caracteres'),
  description: z.string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(150, 'Descrição deve ter no máximo 150 caracteres'),
  area: z.enum(['Bem-Estar', 'Business', 'Maestria']),
  maxLevel: z.number()
    .min(5, 'Nível máximo deve ser pelo menos 5')
    .max(20, 'Nível máximo deve ser no máximo 20'),
  xpPerLevel: z.number()
    .min(50, 'XP por nível deve ser pelo menos 50')
    .max(200, 'XP por nível deve ser no máximo 200'),
});

type CreateAttributeForm = z.infer<typeof createAttributeSchema>;

interface CreateAttributeDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateAttributeDialog: React.FC<CreateAttributeDialogProps> = ({
  open,
  onClose
}) => {
  const { createCustomAttribute } = useAttributeSystem();
  const [selectedIcon, setSelectedIcon] = useState<string>('⭐');
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<CreateAttributeForm>({
    resolver: zodResolver(createAttributeSchema),
    defaultValues: {
      name: '',
      description: '',
      area: 'Bem-Estar',
      maxLevel: 10,
      xpPerLevel: 100,
    },
  });

  const watchedValues = form.watch();

  const handleSubmit = async (data: CreateAttributeForm) => {
    if (!selectedIcon) {
      form.setError('root', { message: 'Selecione um ícone para o atributo' });
      return;
    }

    setIsCreating(true);
    try {
      const attributeData: Omit<HeroAttribute, 'id' | 'createdAt' | 'updatedAt'> = {
        name: data.name,
        description: data.description,
        icon: selectedIcon,
        area: data.area,
        currentXp: 0,
        level: 1,
        maxLevel: data.maxLevel,
        xpPerLevel: data.xpPerLevel,
        isCustom: true,
      };

      await createCustomAttribute(attributeData);
      form.reset();
      setSelectedIcon('⭐');
      onClose();
    } catch (error) {
      console.error('Erro ao criar atributo:', error);
      form.setError('root', { message: 'Erro ao criar atributo. Tente novamente.' });
    } finally {
      setIsCreating(false);
    }
  };

  const getAreaColor = (area: string) => {
    switch (area) {
      case 'Bem-Estar': return 'emerald';
      case 'Business': return 'blue';
      case 'Maestria': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Atributo Personalizado</DialogTitle>
          <DialogDescription>
            Crie um novo atributo para acompanhar seu desenvolvimento pessoal.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário */}
          <div className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Atributo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Criatividade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Descreva o que este atributo representa..."
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Uma breve descrição do que este atributo mede ou desenvolve.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma área" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Bem-Estar">🌱 Bem-Estar</SelectItem>
                          <SelectItem value="Business">💼 Business</SelectItem>
                          <SelectItem value="Maestria">🎯 Maestria</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maxLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nível Máximo</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="xpPerLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>XP por Nível</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormLabel>Ícone do Atributo</FormLabel>
                  <div className="mt-2">
                    <IconSelector 
                      selectedIcon={selectedIcon}
                      onIconSelect={setSelectedIcon}
                    />
                  </div>
                </div>

                {form.formState.errors.root && (
                  <div className="text-sm text-destructive">
                    {form.formState.errors.root.message}
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isCreating}
                    className="flex-1"
                  >
                    {isCreating ? 'Criando...' : 'Criar Atributo'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    disabled={isCreating}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <h3 className="font-semibold">Preview do Atributo</h3>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedIcon}</span>
                    <div>
                      <h4 className="font-medium">
                        {watchedValues.name || 'Nome do Atributo'}
                      </h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs text-${getAreaColor(watchedValues.area)}-600`}
                      >
                        {watchedValues.area}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    Nv. 1
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {watchedValues.description || 'Descrição do atributo aparecerá aqui...'}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>0 XP</span>
                    <span>{watchedValues.xpPerLevel} XP</span>
                  </div>
                  <Progress value={0} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {watchedValues.xpPerLevel} XP para próximo nível
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAttributeDialog;
