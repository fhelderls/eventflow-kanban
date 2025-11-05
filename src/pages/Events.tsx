import { useState } from "react";
import { DndContext, DragEndEvent, closestCorners, DragOverlay } from '@dnd-kit/core';
import { useEvents, useCreateEvent, useUpdateEvent, Event } from "@/hooks/useEvents";
import { EventForm, EventFormData } from "@/components/EventForm";
import { EventDetailDialog } from "@/components/EventDetailDialog";
import { KanbanColumn } from "@/components/KanbanColumn";
import { DraggableEventCard } from "@/components/DraggableEventCard";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusColumns = [
  { status: 'planejamento' as const, title: 'Planejamento' },
  { status: 'preparacao' as const, title: 'Preparação' },
  { status: 'montagem' as const, title: 'Montagem' },
  { status: 'em-andamento' as const, title: 'Em Andamento' },
  { status: 'concluido' as const, title: 'Concluído' }
];

export const Events = () => {
  const [view, setView] = useState<"kanban" | "form" | "detail">("kanban");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: events = [], refetch } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const { toast } = useToast();

  const eventsGroupedByStatus = statusColumns.reduce((acc, col) => {
    acc[col.status] = events.filter(e => e.status === col.status);
    return acc;
  }, {} as Record<string, Event[]>);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const eventId = active.id as string;
    const newStatus = over.id.toString().replace('column-', '') as Event["status"];
    const eventToUpdate = events.find(e => e.id === eventId);

    if (eventToUpdate && eventToUpdate.status !== newStatus) {
      updateEvent.mutate({
        id: eventId,
        data: { status: newStatus }
      }, {
        onSuccess: () => {
          toast({ title: "Status atualizado com sucesso!" });
          refetch();
        }
      });
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

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setView("detail");
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

  if (view === "detail" && selectedEvent) {
    return (
      <EventDetailDialog
        event={selectedEvent}
        onClose={handleCloseDetail}
        onEdit={() => {}}
        onEventUpdate={refetch}
      />
    );
  }

  return (
    <AppLayout title="Eventos" description="Gerencie seus eventos em formato Kanban">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard de Eventos</h2>
        <Button onClick={() => setView("form")}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={({ active }) => setActiveId(active.id as string)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {statusColumns.map(column => (
            <KanbanColumn
              key={column.status}
              title={column.title}
              status={column.status}
              events={eventsGroupedByStatus[column.status] || []}
              onEventClick={handleViewEvent}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <DraggableEventCard
              event={events.find(e => e.id === activeId)!}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </AppLayout>
  );
};
