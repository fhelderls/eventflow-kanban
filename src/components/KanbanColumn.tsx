import { DraggableEventCard } from "./DraggableEventCard";
import { Event } from "@/hooks/useEvents";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Skeleton } from "@/components/ui/skeleton";

interface KanbanColumnProps {
  title: string;
  status: Event["status"];
  events: Event[];
  onEventClick?: (event: Event) => void;
  onAddEvent?: (status: Event["status"]) => void;
  isLoading?: boolean;
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
  onAddEvent,
  isLoading = false
}: KanbanColumnProps) => {
  const config = statusConfig[status];
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
  });

  const eventIds = events.map(e => e.id);
  
  return (
    <div className="flex flex-col w-full mb-4">
      {/* Row Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 min-w-[180px]">
          <h2 className="font-semibold text-sm">{title}</h2>
          <Badge className={config.count}>
            {events.length}
          </Badge>
        </div>
        
        {onAddEvent && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddEvent(status)}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Row Content - Horizontal Scroll */}
      <div 
        ref={setNodeRef}
        className={`flex gap-3 p-4 overflow-x-auto min-h-[200px] border-2 border-dashed rounded-lg transition-all duration-200 ${config.color} ${
          isOver ? 'border-primary border-solid bg-primary/5' : ''
        }`}
      >
        {isLoading ? (
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-80 shrink-0" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full text-muted-foreground text-sm gap-2">
            <div className="text-4xl opacity-20">📋</div>
            <span>Nenhum evento</span>
          </div>
        ) : (
          <SortableContext items={eventIds} strategy={verticalListSortingStrategy}>
            <div className="flex gap-3">
              {events.map((event) => (
                <div key={event.id} className="w-80 shrink-0">
                  <DraggableEventCard
                    event={event}
                    onClick={onEventClick}
                  />
                </div>
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
};