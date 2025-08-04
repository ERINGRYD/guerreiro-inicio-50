import { useState, useRef } from 'react';
import { Upload, FileText, Download, Star, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useJourneyImport } from '@/hooks/useJourneyImport';
import { HERO_AREAS } from '@/types/hero';

interface JourneyImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JourneyImportDialog = ({ open, onOpenChange }: JourneyImportDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  
  const { 
    importing, 
    importProgress, 
    importFromFile, 
    importTemplate, 
    getAvailableTemplates 
  } = useJourneyImport();

  const templates = getAvailableTemplates();

  const handleFileSelect = (file: File) => {
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      setSelectedFile(file);
    } else {
      alert('Por favor, selecione um arquivo JSON válido.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleImportFile = async () => {
    if (!selectedFile) return;
    
    const result = await importFromFile(selectedFile);
    if (result.success) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImportTemplate = async (templateId: string) => {
    await importTemplate(templateId);
  };

  const exportSampleJourney = () => {
    const sampleJourney = {
      title: "Exemplo: Desenvolver Hábito de Leitura",
      description: "Uma jornada para criar o hábito consistente de leitura diária",
      narrativeType: "Transformação Pessoal",
      icon: "📚",
      area: "Maestria",
      graduationMode: false,
      stages: [
        {
          id: "stage-1",
          title: "Preparação",
          description: "Configurar ambiente e escolher livros",
          order: 1,
          completed: false,
          tasks: [],
          habits: [],
          createdAt: new Date().toISOString()
        },
        {
          id: "stage-2", 
          title: "Prática Inicial",
          description: "Primeiros 30 dias de leitura",
          order: 2,
          completed: false,
          tasks: [],
          habits: [],
          createdAt: new Date().toISOString()
        }
      ],
      status: "Em Progresso",
      totalXpReward: 500
    };

    const dataStr = JSON.stringify(sampleJourney, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exemplo-jornada.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Jornadas
          </DialogTitle>
          <DialogDescription>
            Importe jornadas de arquivos JSON ou escolha templates prontos
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Arquivo JSON
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportSampleJourney}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Baixar Exemplo
                </Button>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  Arraste um arquivo JSON ou clique para selecionar
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Suporte para jornadas individuais ou múltiplas em um array
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importing}
                >
                  Selecionar Arquivo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              {selectedFile && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Arquivo Selecionado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        onClick={handleImportFile}
                        disabled={importing}
                        className="flex items-center gap-2"
                      >
                        {importing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Importando...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            Importar
                          </>
                        )}
                      </Button>
                    </div>
                    {importing && (
                      <div className="mt-4">
                        <Progress value={importProgress} className="w-full" />
                        <p className="text-sm text-muted-foreground mt-2">
                          {Math.round(importProgress)}% concluído
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <ScrollArea className="h-[400px]">
              <div className="grid gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{template.icon}</div>
                          <div className="flex-1">
                            <CardTitle className="text-base">{template.title}</CardTitle>
                            <CardDescription className="text-sm">
                              {template.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleImportTemplate(template.id)}
                          disabled={importing}
                          className="shrink-0"
                        >
                          {importing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Importar'
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={`bg-${HERO_AREAS[template.area].color}-100 text-${HERO_AREAS[template.area].color}-800`}
                        >
                          {HERO_AREAS[template.area].icon} {template.area}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {template.stagesCount} etapas
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};