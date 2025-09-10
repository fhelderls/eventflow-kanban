import { useState } from "react";
import { useUpdateEvent } from "@/hooks/useEvents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EventCheckListProps {
  event: any;
  onStatusChange: () => void;
}

const checkListItems = [
  { id: "equipment_check", label: "Verificação de equipamentos" },
  { id: "client_confirmation", label: "Confirmação com cliente" },
  { id: "team_briefing", label: "Briefing da equipe" },
  { id: "transport_ready", label: "Transporte preparado" },
  { id: "final_review", label: "Revisão final" }
];

export const EventCheckList = ({ event, onStatusChange }: EventCheckListProps) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const updateEvent = useUpdateEvent();
  const { toast } = useToast();

  const allItemsChecked = checkListItems.every(item => checkedItems[item.id]);
  const canStartEvent = event.status === "confirmado" && allItemsChecked;

  const handleItemCheck = (itemId: string, checked: boolean) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: checked
    }));
  };

  const handleStartEvent = async () => {
    if (!canStartEvent) return;

    setIsProcessing(true);
    try {
      await updateEvent.mutateAsync({
        id: event.id,
        data: { status: "em-andamento" }
      });
      
      toast({
        title: "Evento iniciado",
        description: "O status do evento foi alterado para 'Em Andamento'. Agora os equipamentos podem ser registrados.",
      });
      
      onStatusChange();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o evento.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (event.status !== "confirmado") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Check List do Evento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Check list disponível apenas para eventos com status "Confirmado"
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Check List do Evento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {checkListItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={item.id}
                checked={checkedItems[item.id] || false}
                onCheckedChange={(checked) => handleItemCheck(item.id, checked as boolean)}
              />
              <label htmlFor={item.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {item.label}
              </label>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          {!allItemsChecked ? (
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-4 h-4" />
              <p className="text-sm">Complete todos os itens para iniciar o evento</p>
            </div>
          ) : (
            <Button
              onClick={handleStartEvent}
              disabled={!canStartEvent || isProcessing}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isProcessing ? "Processando..." : "Iniciar Evento - Alterar Status para Em Andamento"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};