import { useState } from "react";
import { useRequiredEquipment } from "@/hooks/useRequiredEquipment";
import { useEventEquipment, useAddEventEquipment } from "@/hooks/useEventEquipment";
import { useEquipment } from "@/hooks/useEquipment";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Package, CheckCircle2, XCircle, AlertTriangle, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RequiredEquipmentPanelProps {
  eventId: string;
  eventDate: string;
}

export const RequiredEquipmentPanel = ({ eventId, eventDate }: RequiredEquipmentPanelProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { validationResults, allRequirementsMet, missingEquipment } = useRequiredEquipment(eventId);
  const { data: eventEquipment = [] } = useEventEquipment(eventId);
  const { data: allEquipment = [] } = useEquipment();
  const addEquipment = useAddEventEquipment();
  const { toast } = useToast();

  // Filtrar equipamentos disponíveis por categoria
  const availableEquipmentByCategory = selectedCategory
    ? allEquipment.filter(eq => 
        eq.category === selectedCategory && 
        eq.status === 'disponivel'
      )
    : [];

  const handleOpenCategoryDialog = (category: string) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleAddEquipment = async (equipmentId: string) => {
    try {
      await addEquipment.mutateAsync({
        eventId,
        equipmentData: {
          equipment_id: equipmentId,
          quantity: 1,
          status: 'alocado',
          observations: ''
        },
        eventDate
      });
      
      toast({
        title: "Equipamento adicionado",
        description: "O equipamento foi adicionado ao evento com sucesso.",
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o equipamento.",
        variant: "destructive",
      });
    }
  };

  const allocatedCount = validationResults.filter(v => v.hasRequired).length;
  const totalCount = validationResults.length;
  const progressPercentage = totalCount > 0 ? (allocatedCount / totalCount) * 100 : 0;

  return (
    <Card className={allRequirementsMet ? "border-success/50 bg-success/5" : "border-warning/50 bg-warning/5"}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Equipamentos Obrigatórios
          </span>
          {allRequirementsMet ? (
            <Badge className="bg-success text-success-foreground">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Completo
            </Badge>
          ) : (
            <Badge className="bg-warning text-warning-foreground">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Incompleto
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barra de Progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{allocatedCount} de {totalCount}</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className={`h-3 ${allRequirementsMet ? '[&>div]:bg-success' : '[&>div]:bg-warning'}`}
          />
        </div>

        {/* Lista de Equipamentos Obrigatórios */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold mb-3">Status dos Equipamentos</h4>
          {validationResults.map(item => {
            const allocatedEquipment = eventEquipment.filter(
              eq => eq.equipment?.category === item.category && eq.status !== 'retornado'
            );

            return (
              <div 
                key={item.category} 
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                  item.hasRequired 
                    ? 'border-success/30 bg-success/5' 
                    : 'border-destructive/30 bg-destructive/5 hover:border-primary/50 cursor-pointer'
                }`}
                onClick={() => !item.hasRequired && handleOpenCategoryDialog(item.category)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {item.hasRequired ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                    <span className="font-medium">{item.label}</span>
                    {!item.hasRequired && (
                      <span className="text-xs text-muted-foreground italic">
                        (clique para adicionar)
                      </span>
                    )}
                  </div>
                  {allocatedEquipment.length > 0 && (
                    <div className="ml-7 mt-1">
                      {allocatedEquipment.map(eq => (
                        <div key={eq.id} className="text-xs text-muted-foreground">
                          • {eq.equipment?.name} ({eq.equipment?.equipment_code})
                          <Badge className="ml-2 text-xs" variant="outline">
                            {eq.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={item.hasRequired ? "default" : "destructive"}
                    className={item.hasRequired ? "bg-success text-success-foreground" : ""}
                  >
                    {item.allocated}/{item.required}
                  </Badge>
                  {!item.hasRequired && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCategoryDialog(item.category);
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Alerta de Equipamentos Faltando */}
        {!allRequirementsMet && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Atenção: Equipamentos Faltando</AlertTitle>
            <AlertDescription className="space-y-1">
              <p className="font-medium">Os seguintes equipamentos obrigatórios precisam ser alocados:</p>
              <ul className="list-disc list-inside mt-2">
                {missingEquipment.map(e => (
                  <li key={e.category}>
                    {e.label} - Faltam {e.required - e.allocated}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm">
                O evento não poderá ser iniciado até que todos os equipamentos obrigatórios sejam alocados.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Mensagem de Sucesso */}
        {allRequirementsMet && (
          <Alert className="border-success/50 bg-success/10">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertTitle className="text-success">Todos os Equipamentos Alocados</AlertTitle>
            <AlertDescription className="text-success-foreground/80">
              Todos os equipamentos obrigatórios foram alocados corretamente para este evento.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      {/* Dialog para selecionar equipamento disponível */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Equipamentos Disponíveis - {validationResults.find(v => v.category === selectedCategory)?.label}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {availableEquipmentByCategory.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Nenhum equipamento disponível desta categoria no momento.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Todos os equipamentos podem estar em uso ou em manutenção.
                </p>
              </div>
            ) : (
              availableEquipmentByCategory.map(equipment => (
                <Card 
                  key={equipment.id}
                  className="hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => handleAddEquipment(equipment.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{equipment.name}</h4>
                          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                            {equipment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Código: <span className="font-medium">{equipment.equipment_code}</span>
                        </p>
                        {equipment.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {equipment.description}
                          </p>
                        )}
                        {equipment.observations && (
                          <p className="text-xs text-muted-foreground mt-1 italic">
                            Obs: {equipment.observations}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="ml-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddEquipment(equipment.id);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
