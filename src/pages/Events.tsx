import { useState, useMemo } from "react";
import { DndContext, DragEndEvent, closestCorners, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useEvents, useCreateEvent, useUpdateEvent, Event } from "@/hooks/useEvents";
import { EventForm, EventFormData } from "@/components/EventForm";
import { EventDetailDialog } from "@/components/EventDetailDialog";
import { KanbanColumn } from "@/components/KanbanColumn";
import { DraggableEventCard } from "@/components/DraggableEventCard";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

const statusColumns = [
  { status: 'planejamento' as const, title: 'Planejamento' },
  { status: 'preparacao' as const, title: 'Preparação' },
  { status: 'montagem' as const, title: 'Montagem' },
  { status: 'em-andamento' as const, title: 'Em Andamento' },
  { status: 'concluido' as const, title: 'Concluído' }
];

export const Events = () => {
  const [view, setView] = useState<"kanban" | "form" | "detail" | "edit">("kanban");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const { data: events = [], refetch, isLoading } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = searchQuery === "" || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.client?.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPriority = priorityFilter === "all" || event.priority === priorityFilter;
      
      return matchesSearch && matchesPriority;
    });
  }, [events, searchQuery, priorityFilter]);

  const eventsGroupedByStatus = useMemo(() => {
    return statusColumns.reduce((acc, col) => {
      acc[col.status] = filteredEvents.filter(e => e.status === col.status);
      return acc;
    }, {} as Record<string, Event[]>);
  }, [filteredEvents]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const eventId = active.id as string;
    const overId = over.id.toString();
    
    // Check if dropped on a column
    if (overId.startsWith('column-')) {
      const newStatus = overId.replace('column-', '') as Event["status"];
      const eventToUpdate = filteredEvents.find(e => e.id === eventId);

      if (eventToUpdate && eventToUpdate.status !== newStatus) {
        updateEvent.mutate({
          id: eventId,
          data: { status: newStatus }
        }, {
          onSuccess: () => {
            toast({ 
              title: "Status atualizado", 
              description: `Evento movido para ${statusColumns.find(c => c.status === newStatus)?.title}` 
            });
          },
          onError: () => {
            toast({
              title: "Erro ao atualizar status",
              description: "Tente novamente",
              variant: "destructive"
            });
          }
        });
      }
    }
  };

  const handleCreateEvent = (data: EventFormData) => {
    createEvent.mutate(data, {
      onSuccess: () => {
        setView("kanban");
        refetch();
      }
    });
  };

  const handleUpdateEvent = (data: EventFormData) => {
    if (!selectedEvent) return;
    
    updateEvent.mutate({
      id: selectedEvent.id,
      data
    }, {
      onSuccess: () => {
        setView("kanban");
        setSelectedEvent(null);
        refetch();
      }
    });
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setView("detail");
  };

  const handleEditEvent = () => {
    setView("edit");
  };

  const handleCloseDetail = () => {
    setSelectedEvent(null);
    setView("kanban");
    refetch();
  };

  if (view === "form") {
    return (
      <AppLayout title="Novo Evento" description="Criar um novo evento">
        <EventForm
          onSubmit={handleCreateEvent}
          onCancel={() => setView("kanban")}
          isLoading={createEvent.isPending}
        />
      </AppLayout>
    );
  }

  if (view === "edit" && selectedEvent) {
    return (
      <AppLayout title="Editar Evento" description="Editar informações do evento">
        <EventForm
          initialData={selectedEvent}
          onSubmit={handleUpdateEvent}
          onCancel={handleCloseDetail}
          isLoading={updateEvent.isPending}
        />
      </AppLayout>
    );
  }

  if (view === "detail" && selectedEvent) {
    return (
      <EventDetailDialog
        event={selectedEvent}
        onClose={handleCloseDetail}
        onEdit={handleEditEvent}
        onEventUpdate={refetch}
      />
    );
  }

  return (
    <AppLayout title="Eventos" description="Gerencie seus eventos em formato Kanban">
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Dashboard de Eventos</h2>
          <Button onClick={() => setView("form")}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por evento ou cliente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
              
              {(searchQuery || priorityFilter !== "all") && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setPriorityFilter("all");
                  }}
                >
                  Limpar
                </Button>
              )}
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-muted-foreground">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
          </div>
        </Card>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col gap-4">
          {statusColumns.map(column => (
            <KanbanColumn
              key={column.status}
              title={column.title}
              status={column.status}
              events={eventsGroupedByStatus[column.status] || []}
              onEventClick={handleViewEvent}
              isLoading={isLoading}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeId ? (
            <div className="rotate-3 scale-105 opacity-90 w-80">
              <DraggableEventCard
                event={filteredEvents.find(e => e.id === activeId)!}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </AppLayout>
  );
};
