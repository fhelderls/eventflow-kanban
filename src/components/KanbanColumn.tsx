import { EventCard } from "./EventCard";
import { Event } from "@/hooks/useEvents";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KanbanColumnProps {
  title: string;
  status: Event["status"];
  events: Event[];
  onEventClick?: (event: Event) => void;
  onAddEvent?: (status: Event["status"]) => void;
}

const statusConfig = {
  planejado: {
    color: "bg-info/10 text-info border-info/20",
    count: "bg-info text-info-foreground"
  },
  confirmado: {
    color: "bg-primary/10 text-primary border-primary/20", 
    count: "bg-primary text-primary-foreground"
  },
  "em-andamento": {
    color: "bg-warning/10 text-warning border-warning/20",
    count: "bg-warning text-warning-foreground"
  },
  concluido: {
    color: "bg-success/10 text-success border-success/20",
    count: "bg-success text-success-foreground"
  },
  cancelado: {
    color: "bg-destructive/10 text-destructive border-destructive/20",
    count: "bg-destructive text-destructive-foreground"
  }
};

export const KanbanColumn = ({ 
  title, 
  status, 
  events, 
  onEventClick, 
  onAddEvent 
}: KanbanColumnProps) => {
  const config = statusConfig[status];
  
  return (
    <div className="flex flex-col min-h-0 w-80 shrink-0">
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-sm">{title}</h2>
          <Badge className={config.count}>
            {events.length}
          </Badge>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddEvent?.(status)}
          className="h-8 w-8 p-0 hover:bg-primary/10"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Column Content */}
      <div 
        className={`flex-1 p-4 space-y-3 overflow-y-auto min-h-32 border-2 border-dashed rounded-lg mx-4 mb-4 ${config.color}`}
      >
        {events.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
            Nenhum evento
          </div>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={onEventClick}
            />
          ))
        )}
      </div>
    </div>
  );
};