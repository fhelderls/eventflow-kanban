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
  planejamento: "bg-slate-500 text-white",
  preparacao: "bg-blue-500 text-white",
  montagem: "bg-yellow-500 text-white",
  "em-andamento": "bg-orange-500 text-white",
  concluido: "bg-green-500 text-white",
  cancelado: "bg-red-500 text-white",
};

const priorityIndicators = {
  alta: "border-l-4 border-destructive",
  media: "border-l-4 border-warning",
  baixa: "border-l-4 border-success",
};

export const EventCard = ({ event, onClick }: EventCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/50",
        "bg-card animate-fade-in group",
        priorityIndicators[event.priority]
      )}
      onClick={() => onClick?.(event)}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            {event.assigned_user && (
              <div className="flex items-center gap-1 mt-1">
                <User className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">
                  {event.assigned_user.name}
                </span>
              </div>
            )}
          </div>
          <Badge 
            className={cn("text-xs shrink-0 capitalize", statusColors[event.status])}
          >
            {event.status.replace('-', ' ')}
          </Badge>
        </div>

        {/* Client */}
        {event.client && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="w-3 h-3 flex-shrink-0" />
            <span className="truncate font-medium">{event.client.name}</span>
          </div>
        )}

        {/* Date & Time */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span className="font-medium">{formatDate(event.event_date)}</span>
          </div>
          {event.event_time && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{event.event_time}</span>
            </div>
          )}
        </div>

        {/* Location */}
        {event.event_address_city && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">
              {event.event_address_city}{event.event_address_state && `, ${event.event_address_state}`}
            </span>
          </div>
        )}

        {/* Footer: Equipment count & Budget */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          {event.equipment && event.equipment.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Package className="w-3 h-3" />
              <span>{event.equipment.length} {event.equipment.length === 1 ? 'equipamento' : 'equipamentos'}</span>
            </div>
          )}
          
          {event.estimated_budget && (
            <span className="text-xs text-primary font-semibold">
              R$ {event.estimated_budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};