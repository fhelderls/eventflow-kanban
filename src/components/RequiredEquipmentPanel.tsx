import { useRequiredEquipment } from "@/hooks/useRequiredEquipment";
import { useEventEquipment } from "@/hooks/useEventEquipment";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Package, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface RequiredEquipmentPanelProps {
  eventId: string;
}

export const RequiredEquipmentPanel = ({ eventId }: RequiredEquipmentPanelProps) => {
  const { validationResults, allRequirementsMet, missingEquipment } = useRequiredEquipment(eventId);
  const { data: eventEquipment = [] } = useEventEquipment(eventId);

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
                    : 'border-destructive/30 bg-destructive/5'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {item.hasRequired ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                    <span className="font-medium">{item.label}</span>
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
                <div className="text-right">
                  <Badge 
                    variant={item.hasRequired ? "default" : "destructive"}
                    className={item.hasRequired ? "bg-success text-success-foreground" : ""}
                  >
                    {item.allocated}/{item.required}
                  </Badge>
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
    </Card>
  );
};
