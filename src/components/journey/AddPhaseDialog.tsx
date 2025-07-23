import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGame } from '@/contexts/GameContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const phaseSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
});

type PhaseFormData = z.infer<typeof phaseSchema>;

interface AddPhaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  journeyId: string;
}

export function AddPhaseDialog({ open, onOpenChange, journeyId }: AddPhaseDialogProps) {
  const { addCustomPhase } = useGame();

  const form = useForm<PhaseFormData>({
    resolver: zodResolver(phaseSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = (data: PhaseFormData) => {
    const newPhase = {
      title: data.title,
      description: data.description || '',
      tasks: [],
      completed: false,
      xpTotal: 0,
    };

    addCustomPhase(journeyId, newPhase);
    
    toast({
      title: "✅ Fase Criada",
      description: `A fase "${data.title}" foi adicionada à jornada!`,
    });

    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Fase</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Fase</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Estabelecendo Fundamentos" {...field} />
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
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o objetivo desta fase..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Criar Fase
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}