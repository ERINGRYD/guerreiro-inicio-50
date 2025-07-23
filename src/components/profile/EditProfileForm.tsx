
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useHero } from '@/contexts/HeroContext';
import { HeroProfile } from '@/types/hero';
import { Edit3, Save, X } from 'lucide-react';

const profileSchema = z.object({
  heroName: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome muito longo'),
  heroClass: z.string().min(1, 'Classe é obrigatória').max(30, 'Classe muito longa'),
  avatar: z.string().min(1, 'Avatar é obrigatório')
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EditProfileFormProps {
  profile: HeroProfile;
  onClose: () => void;
}

const AVATAR_OPTIONS = ['⚔️', '🛡️', '🏹', '🔮', '⚡', '🌟', '🔥', '❄️', '🌱', '💎'];
const CLASS_OPTIONS = [
  'Guerreiro', 'Mago', 'Arqueiro', 'Paladino', 'Assassino', 
  'Druida', 'Bárbaro', 'Monge', 'Necromante', 'Ranger'
];

const EditProfileForm: React.FC<EditProfileFormProps> = ({ profile, onClose }) => {
  const { updateProfile } = useHero();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      heroName: profile.heroName,
      heroClass: profile.heroClass,
      avatar: profile.avatar
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      await updateProfile(data);
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Edit3 className="w-5 h-5" />
          Editar Perfil
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="heroName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Herói</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do herói" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heroClass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classe</FormLabel>
                  <FormControl>
                    <select
                      className="w-full p-2 border rounded-md bg-background"
                      {...field}
                    >
                      {CLASS_OPTIONS.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-5 gap-2">
                      {AVATAR_OPTIONS.map((avatar) => (
                        <button
                          key={avatar}
                          type="button"
                          onClick={() => field.onChange(avatar)}
                          className={`p-2 text-2xl border rounded-md hover:bg-accent transition-colors ${
                            field.value === avatar ? 'ring-2 ring-primary bg-accent' : ''
                          }`}
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditProfileForm;
