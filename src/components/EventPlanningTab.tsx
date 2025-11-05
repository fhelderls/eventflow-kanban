import { useState } from "react";
import { Event } from "@/hooks/useEvents";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { EventForm } from "./EventForm";
import { User, MapPin, DollarSign, FileText, Edit } from "lucide-react";

interface EventPlanningTabProps {
  event: Event;
  onUpdate: (data: any) => void;
}

export const EventPlanningTab = ({ event, onUpdate }: EventPlanningTabProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (data: any) => {
    onUpdate(data);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="py-4">
        <EventForm
          initialData={event}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditing(false)}
          isLoading={false}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {event.client ? (
            <div className="space-y-2">
              <div>
                <label className="text-sm text-muted-foreground">Nome</label>
                <p className="font-medium">{event.client.name}</p>
              </div>
              {event.client.email && (
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p>{event.client.email}</p>
                </div>
              )}
              {event.client.phone && (
                <div>
                  <label className="text-sm text-muted-foreground">Telefone</label>
                  <p>{event.client.phone}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhum cliente associado</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Local do Evento
          </CardTitle>
        </CardHeader>
        <CardContent>
          {event.event_address_street ? (
            <div className="space-y-1">
              <p>
                {event.event_address_street}, {event.event_address_number}
              </p>
              {event.event_address_complement && <p>{event.event_address_complement}</p>}
              <p>
                {event.event_address_neighborhood}
              </p>
              <p>
                {event.event_address_city} - {event.event_address_state}
              </p>
              {event.event_address_cep && <p>CEP: {event.event_address_cep}</p>}
            </div>
          ) : (
            <p className="text-muted-foreground">Endereço não informado</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Detalhes Financeiros e Operacionais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {event.estimated_budget && (
            <div>
              <label className="text-sm text-muted-foreground">Orçamento Estimado</label>
              <p className="font-medium">R$ {Number(event.estimated_budget).toFixed(2)}</p>
            </div>
          )}
          {event.final_budget && (
            <div>
              <label className="text-sm text-muted-foreground">Orçamento Final</label>
              <p className="font-medium">R$ {Number(event.final_budget).toFixed(2)}</p>
            </div>
          )}
          {event.barrel_quantity !== undefined && event.barrel_quantity > 0 && (
            <div>
              <label className="text-sm text-muted-foreground">Quantidade de Barris</label>
              <p className="font-medium">{event.barrel_quantity}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {event.observations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Observações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{event.observations}</p>
          </CardContent>
        </Card>
      )}

      <Button onClick={() => setIsEditing(true)} className="w-full">
        <Edit className="w-4 h-4 mr-2" />
        Editar Planejamento
      </Button>
    </div>
  );
};
