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
  planejamento: {
    color: "bg-slate-100 dark:bg-slate-800",
    count: "bg-slate-500"
  },
  preparacao: {
    color: "bg-blue-100 dark:bg-blue-900", 
    count: "bg-blue-500"
  },
  montagem: {
    color: "bg-yellow-100 dark:bg-yellow-900",
    count: "bg-yellow-500"
  },
  "em-andamento": {
    color: "bg-orange-100 dark:bg-orange-900",
    count: "bg-orange-500"
  },
  concluido: {
    color: "bg-green-100 dark:bg-green-900",
    count: "bg-green-500"
  },
  cancelado: {
    color: "bg-red-100 dark:bg-red-900",
    count: "bg-red-500"
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