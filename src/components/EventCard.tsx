import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, User, Clock, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Event } from "@/hooks/useEvents";

interface EventCardProps {
  event: Event;
  onClick?: (event: Event) => void;
}

const statusColors = {
  planejado: "bg-info text-info-foreground",
  confirmado: "bg-primary text-primary-foreground",
  "em-andamento": "bg-warning text-warning-foreground",
  concluido: "bg-success text-success-foreground",
  cancelado: "bg-destructive text-destructive-foreground",
};

const priorityIndicators = {
  alta: "border-l-4 border-destructive",
  media: "border-l-4 border-warning",
  baixa: "border-l-4 border-success",
};

export const EventCard = ({ event, onClick }: EventCardProps) => {
  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 hover:shadow-elevated hover:-translate-y-1",
        "bg-gradient-card animate-fade-in",
        priorityIndicators[event.priority]
      )}
      onClick={() => onClick?.(event)}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm text-card-foreground line-clamp-2">
            {event.title}
          </h3>
          <Badge 
            className={cn("text-xs shrink-0", statusColors[event.status])}
          >
            {event.status}
          </Badge>
        </div>

        {/* Client */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="w-3 h-3" />
          <span className="truncate">{event.client?.name || "Cliente não informado"}</span>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{event.event_date}</span>
          <Clock className="w-3 h-3 ml-1" />
          <span>{event.event_time}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{event.event_address_street ? `${event.event_address_street}, ${event.event_address_number}` : "Local não informado"}</span>
        </div>

        {/* Budget */}
        {event.estimated_budget && (
          <div className="flex items-center gap-2 text-xs">
            <Package className="w-3 h-3 text-primary" />
            <span className="text-primary font-medium">
              R$ {event.estimated_budget.toLocaleString('pt-BR')}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};