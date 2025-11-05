import { Event } from "@/hooks/useEvents";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Edit, Calendar, Clock, User, MapPin, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EventOverviewTabProps {
  event: Event;
  onEdit: () => void;
}

const statusColors: Record<string, string> = {
  planejamento: "bg-slate-500",
  preparacao: "bg-blue-500",
  montagem: "bg-yellow-500",
  "em-andamento": "bg-orange-500",
  concluido: "bg-green-500",
  cancelado: "bg-red-500",
};

const priorityColors: Record<string, string> = {
  baixa: "bg-gray-500",
  media: "bg-yellow-500",
  alta: "bg-red-500",
};

export const EventOverviewTab = ({ event, onEdit }: EventOverviewTabProps) => {
  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Status</label>
              <div>
                <Badge className={statusColors[event.status] || "bg-gray-500"}>
                  {event.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Prioridade</label>
              <div>
                <Badge className={priorityColors[event.priority] || "bg-gray-500"}>
                  {event.priority}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Data e Horário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{format(new Date(event.event_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
          </div>
          {event.event_time && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{event.event_time}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {event.client && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="font-medium">{event.client.name}</p>
              {event.client.email && (
                <p className="text-sm text-muted-foreground">{event.client.email}</p>
              )}
              {event.client.phone && (
                <p className="text-sm text-muted-foreground">{event.client.phone}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {(event.event_address_street || event.event_address_city) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Local do Evento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {event.event_address_street} {event.event_address_number}
              {event.event_address_complement && `, ${event.event_address_complement}`}
              <br />
              {event.event_address_neighborhood}
              <br />
              {event.event_address_city} - {event.event_address_state}
              {event.event_address_cep && <> - CEP: {event.event_address_cep}</>}
            </p>
          </CardContent>
        </Card>
      )}

      {(event.estimated_budget || event.final_budget) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Orçamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {event.estimated_budget && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Estimado:</span>
                <span className="text-sm font-medium">
                  R$ {Number(event.estimated_budget).toFixed(2)}
                </span>
              </div>
            )}
            {event.final_budget && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Final:</span>
                <span className="text-sm font-medium">
                  R$ {Number(event.final_budget).toFixed(2)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Button onClick={onEdit} className="w-full">
        <Edit className="w-4 h-4 mr-2" />
        Editar Informações Principais
      </Button>
    </div>
  );
};
