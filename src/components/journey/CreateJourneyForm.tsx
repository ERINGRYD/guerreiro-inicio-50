import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useHero } from '@/contexts/HeroContext';
import { HERO_AREAS } from '@/types/hero';
import { 
  NARRATIVE_TYPES, 
  OBJECTIVE_TYPES, 
  GRADUATION_OBJECTIVE_TYPES
} from '@/data/narrativeTypes';
import { toast } from '@/hooks/use-toast';
import { IconSelector } from './IconSelector';
import AttributeSelector from '@/components/attributes/AttributeSelector';

const createJourneySchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  area: z.enum(['Bem-Estar', 'Business', 'Maestria'] as const),
  narrativeType: z.string().min(1, 'Selecione um tipo de narrativa'),
  icon: z.string().min(1, 'Selecione um ícone'),
  graduationMode: z.boolean().default(false),
  objectiveType: z.string().min(1, 'Selecione o tipo de objetivo'),
  objectiveName: z.string().min(3, 'Nome do objetivo deve ter pelo menos 3 caracteres'),
  objectiveDescription: z.string().min(10, 'Descrição do objetivo deve ter pelo menos 10 caracteres'),
  objectiveIcon: z.string().min(1, 'Selecione um ícone para o objetivo'),
  linkedAttributes: z.array(z.string()).default([])
});

type CreateJourneyFormData = z.infer<typeof createJourneySchema>;

export const CreateJourneyForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addJourney } = useHero();
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pegar área pré-selecionada do state da navegação
  const preSelectedArea = location.state?.selectedArea;

  const form = useForm<CreateJourneyFormData>({
    resolver: zodResolver(createJourneySchema),
    defaultValues: {
      title: '',
      description: '',
      area: preSelectedArea || 'Bem-Estar',
      narrativeType: '',
      icon: '',
      graduationMode: false,
      objectiveType: '',
      objectiveName: '',
      objectiveDescription: '',
      objectiveIcon: '',
      linkedAttributes: []
    }
  });

  const watchedValues = form.watch();
  
  // Filtrar narrativas baseado no modo de graduação
  const availableNarratives = NARRATIVE_TYPES.filter(narrative => 
    watchedValues.graduationMode ? narrative.isGraduation : !narrative.isGraduation
  );
  
  const selectedNarrative = availableNarratives.find(n => n.id === watchedValues.narrativeType);
  
  // Escolher tipos de objetivo baseado no modo
  const availableObjectiveTypes = watchedValues.graduationMode 
    ? GRADUATION_OBJECTIVE_TYPES 
    : OBJECTIVE_TYPES;
  
  const selectedObjectiveType = availableObjectiveTypes.find(t => t.id === watchedValues.objectiveType);

  // Resetar seleções quando modo graduação muda
  React.useEffect(() => {
    form.setValue('narrativeType', '');
    form.setValue('objectiveType', '');
    form.setValue('icon', '');
    form.setValue('objectiveIcon', '');
  }, [watchedValues.graduationMode, form]);

  const onSubmit = async (data: CreateJourneyFormData) => {
    if (!selectedNarrative) return;

    setIsSubmitting(true);
    try {
      const stages = selectedNarrative.stages.map(stage => ({
        id: `stage-${stage.order}`,
        title: stage.title,
        description: stage.description,
        order: stage.order,
        completed: false,
        tasks: [],
        habits: [],
        xpReward: data.graduationMode ? 75 : 50, // Mais XP para graduação
        createdAt: new Date().toISOString()
      }));

      const journeyData = {
        title: data.title,
        description: data.description,
        narrativeType: selectedNarrative.name,
        icon: data.icon,
        area: data.area,
        graduationMode: data.graduationMode,
        stages,
        status: 'Em Progresso' as const,
        objectiveType: data.objectiveType,
        objectiveName: data.objectiveName,
        objectiveDescription: data.objectiveDescription,
        objectiveIcon: data.objectiveIcon,
        linkedAttributes: data.linkedAttributes,
        totalXpReward: stages.length * (data.graduationMode ? 75 : 50) + (data.graduationMode ? 300 : 200)
      };

      const newJourney = await addJourney(journeyData);
      
      toast({
        title: data.graduationMode ? 'Jornada de Graduação Criada!' : 'Jornada Criada!',
        description: `${data.title} foi criada com sucesso.`
      });

      // Redirecionar para a área específica da jornada criada
      navigate(`/area/${data.area.toLowerCase()}`);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a jornada. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (showPreview) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                <ArrowLeft className="h-4 w-4" />
                Voltar à Edição
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Preview da Jornada</h1>
                <p className="text-muted-foreground">Confira como sua jornada ficará</p>
              </div>
            </div>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Salvando...' : 'Criar Jornada'}
            </Button>
          </div>

          {/* Preview Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Journey Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{watchedValues.icon}</span>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {watchedValues.title}
                        {watchedValues.graduationMode && (
                          <Badge variant="secondary">🎓 Graduação</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {HERO_AREAS[watchedValues.area]?.name} • {selectedNarrative?.name}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{watchedValues.description}</p>
                </CardContent>
              </Card>

              {/* Stages Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {watchedValues.graduationMode ? 'Módulos do Curso' : 'Etapas da Jornada'}
                  </CardTitle>
                  <CardDescription>
                    {selectedNarrative?.stages.length} {watchedValues.graduationMode ? 'módulos' : 'etapas'} baseadas em {selectedNarrative?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedNarrative?.stages.map((stage, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{stage.title}</h4>
                          <p className="text-sm text-muted-foreground">{stage.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Objective Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {watchedValues.graduationMode ? 'Certificação Final' : 'Objetivo Final'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{watchedValues.objectiveIcon}</div>
                    <h3 className="font-semibold">{watchedValues.objectiveName}</h3>
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                      {selectedObjectiveType?.icon} {selectedObjectiveType?.name}
                    </p>
                  </div>
                  <p className="text-sm">{watchedValues.objectiveDescription}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recompensas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>XP por {watchedValues.graduationMode ? 'módulo' : 'etapa'}:</span>
                      <span className="font-medium">{watchedValues.graduationMode ? '75 XP' : '50 XP'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Bônus conclusão:</span>
                      <span className="font-medium">{watchedValues.graduationMode ? '300 XP' : '200 XP'}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>
                        {(selectedNarrative?.stages.length || 0) * (watchedValues.graduationMode ? 75 : 50) + (watchedValues.graduationMode ? 300 : 200)} XP
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Criar Nova Jornada</h1>
              <p className="text-muted-foreground">Configure sua jornada de transformação</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowPreview(true)}
            disabled={!form.formState.isValid}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                <TabsTrigger value="narrative">Narrativa</TabsTrigger>
                <TabsTrigger value="objective">{watchedValues.graduationMode ? 'Certificação' : 'Objetivo'}</TabsTrigger>
              </TabsList>

              {/* Basic Information */}
              <TabsContent value="basic" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Básicas</CardTitle>
                    <CardDescription>Defina as informações principais da sua jornada</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="graduationMode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Modo Graduação 🎓</FormLabel>
                            <FormDescription>
                              Ative para jornadas de conquista de certificações, diplomas ou cursos
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {watchedValues.graduationMode ? 'Nome do Curso/Certificação *' : 'Título da Jornada *'}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={
                                watchedValues.graduationMode 
                                  ? "Ex: Certificação AWS Solutions Architect" 
                                  : "Ex: Mestria em Comunicação"
                              } 
                              {...field} 
                            />
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
                          <FormLabel>Descrição *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={
                                watchedValues.graduationMode
                                  ? "Descreva os conhecimentos e competências que você adquirirá com esta certificação..."
                                  : "Descreva o que esta jornada irá desenvolver e transformar em você..."
                              }
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Área *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a área" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(HERO_AREAS).map(([key, area]) => (
                                  <SelectItem key={key} value={key}>
                                    <div className="flex items-center gap-2">
                                      <span>{area.icon}</span>
                                      <span>{area.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="icon"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <IconSelector
                                value={field.value}
                                onChange={field.onChange}
                                graduationMode={watchedValues.graduationMode}
                                label={watchedValues.graduationMode ? 'Ícone do Curso *' : 'Ícone da Jornada *'}
                                error={form.formState.errors.icon?.message}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="linkedAttributes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Atributos Vinculados</FormLabel>
                          <FormDescription>
                            Selecione quais atributos serão desenvolvidos através desta jornada
                          </FormDescription>
                          <FormControl>
                            <AttributeSelector
                              area={watchedValues.area}
                              selectedAttributes={field.value}
                              onAttributeSelect={(attributeId) => {
                                const currentSelected = field.value || [];
                                const isAlreadySelected = currentSelected.includes(attributeId);
                                
                                if (isAlreadySelected) {
                                  field.onChange(currentSelected.filter(id => id !== attributeId));
                                } else {
                                  field.onChange([...currentSelected, attributeId]);
                                }
                              }}
                              multiSelect={true}
                              showPreview={true}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Narrative Type */}
              <TabsContent value="narrative" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {watchedValues.graduationMode ? 'Estrutura do Curso' : 'Tipo de Narrativa'}
                    </CardTitle>
                    <CardDescription>
                      {watchedValues.graduationMode 
                        ? 'Escolha a estrutura de aprendizado que melhor se adequa ao seu curso'
                        : 'Escolha a estrutura que melhor se adequa à sua jornada'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="narrativeType"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {availableNarratives.map((narrative) => (
                                <div
                                  key={narrative.id}
                                  className={`relative p-4 border rounded-lg cursor-pointer transition-colors ${
                                    field.value === narrative.id
                                      ? 'border-primary bg-primary/5'
                                      : 'border-muted hover:border-muted-foreground/25'
                                  }`}
                                  onClick={() => field.onChange(narrative.id)}
                                >
                                  <div className="space-y-2">
                                    <h3 className="font-semibold">{narrative.name}</h3>
                                    <p className="text-sm text-muted-foreground">{narrative.description}</p>
                                    <Badge variant="outline">
                                      {narrative.stages.length} {watchedValues.graduationMode ? 'módulos' : 'etapas'}
                                    </Badge>
                                  </div>
                                  {field.value === narrative.id && (
                                    <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedNarrative && (
                      <Card className="mt-6">
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {watchedValues.graduationMode ? 'Módulos' : 'Etapas'}: {selectedNarrative.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {selectedNarrative.stages.map((stage, index) => (
                              <div key={index} className="flex items-start gap-3 text-sm">
                                <span className="flex-shrink-0 w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs">
                                  {index + 1}
                                </span>
                                <div>
                                  <span className="font-medium">{stage.title}</span>
                                  <p className="text-muted-foreground">{stage.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Objective */}
              <TabsContent value="objective" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {watchedValues.graduationMode ? 'Certificação Final' : 'Objetivo Final'}
                    </CardTitle>
                    <CardDescription>
                      {watchedValues.graduationMode
                        ? 'Defina a certificação ou diploma que você conquistará'
                        : 'Defina o que você conquistará ao completar esta jornada'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="objectiveType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {watchedValues.graduationMode ? 'Tipo de Certificação *' : 'Tipo de Objetivo *'}
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableObjectiveTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  <div className="flex items-center gap-2">
                                    <span>{type.icon}</span>
                                    <span>{type.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="objectiveName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {watchedValues.graduationMode ? 'Nome da Certificação *' : 'Nome do Objetivo *'}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={
                                  watchedValues.graduationMode
                                    ? "Ex: AWS Certified Solutions Architect"
                                    : "Ex: Comunicação Assertiva"
                                } 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="objectiveIcon"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <IconSelector
                                value={field.value}
                                onChange={field.onChange}
                                graduationMode={watchedValues.graduationMode}
                                label={watchedValues.graduationMode ? 'Ícone da Certificação *' : 'Ícone do Objetivo *'}
                                error={form.formState.errors.objectiveIcon?.message}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="objectiveDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {watchedValues.graduationMode ? 'Descrição da Certificação *' : 'Descrição do Objetivo *'}
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={
                                watchedValues.graduationMode
                                  ? "Descreva as competências e conhecimentos que esta certificação comprova..."
                                  : "Descreva detalhadamente o que você terá conquistado..."
                              }
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setShowPreview(true)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Criando...' : watchedValues.graduationMode ? 'Criar Curso' : 'Criar Jornada'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </div>
  );
};
