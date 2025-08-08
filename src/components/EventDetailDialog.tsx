import { Event } from "@/hooks/useEvents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MapPin, DollarSign, FileText, Edit, X } from "lucide-react";

interface EventDetailDialogProps {
  event: Event;
  onClose: () => void;
  onEdit: () => void;
}

export const EventDetailDialog = ({ event, onClose, onEdit }: EventDetailDialogProps) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              {event.title}
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={onEdit} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button onClick={onClose} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Badge>{event.status}</Badge>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Prioridade</label>
              <Badge variant="outline">{event.priority}</Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Cliente
            </h3>
            <div className="grid gap-2 md:grid-cols-3">
              <div>
                <label className="text-sm text-muted-foreground">Nome</label>
                <p className="font-medium">{event.client?.name || "Cliente não informado"}</p>
              </div>
              {event.client?.email && (
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="font-medium">{event.client.email}</p>
                </div>
              )}
              {event.client?.phone && (
                <div>
                  <label className="text-sm text-muted-foreground">Telefone</label>
                  <p className="font-medium">{event.client.phone}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Data e Horário
            </h3>
            <div className="grid gap-2 md:grid-cols-3">
              <div>
                <label className="text-sm text-muted-foreground">Data</label>
                <p className="font-medium">{event.event_date}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Início</label>
                <p className="font-medium">{event.event_time}</p>
              </div>
              {event.barrel_quantity && (
                <div>
                  <label className="text-sm text-muted-foreground">Barris</label>
                  <p className="font-medium">{event.barrel_quantity}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Local
            </h3>
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <label className="text-sm text-muted-foreground">Endereço</label>
                <p className="font-medium">
                  {[event.event_address_street, event.event_address_number, event.event_address_neighborhood, event.event_address_city, event.event_address_state].filter(Boolean).join(", ") || "Endereço não informado"}
                </p>
              </div>
              {event.event_address_cep && (
                <div>
                  <label className="text-sm text-muted-foreground">CEP</label>
                  <p className="font-medium">{event.event_address_cep}</p>
                </div>
              )}
            </div>
          </div>

          {event.estimated_budget && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Orçamento
              </h3>
              <p className="text-xl font-bold text-primary">
                R$ {event.estimated_budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}

          {event.observations && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Observações
              </h3>
              <p className="text-muted-foreground">{event.observations}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};