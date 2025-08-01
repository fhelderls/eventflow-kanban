import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, User, Clock, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Event {
  id: string;
  title: string;
  client: string;
  date: string;
  time: string;
  location: string;
  status: "planejado" | "confirmado" | "em-andamento" | "concluido" | "cancelado";
  equipmentCount: number;
  priority: "alta" | "media" | "baixa";
}

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
          <span className="truncate">{event.client}</span>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{event.date}</span>
          <Clock className="w-3 h-3 ml-1" />
          <span>{event.time}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{event.location}</span>
        </div>

        {/* Equipment Count */}
        <div className="flex items-center gap-2 text-xs">
          <Package className="w-3 h-3 text-primary" />
          <span className="text-primary font-medium">
            {event.equipmentCount} equipamentos
          </span>
        </div>
      </div>
    </Card>
  );
};