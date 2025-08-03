import { useState } from "react";
import { StatsCard } from "@/components/StatsCard";
import { KanbanColumn } from "@/components/KanbanColumn";
import { useEvents, Event } from "@/hooks/useEvents";
import { Calendar, Users, Package, TrendingUp, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Casamento Silva & Santos",
    client_name: "Maria Silva",
    event_date: "2024-12-15",
    event_time: "19:00",
    location: "Salão Príncipe",
    status: "confirmado",
    priority: "alta",
    estimated_budget: 5000
  },
  {
    id: "2", 
    title: "Formatura Medicina UFMG",
    client_name: "João Oliveira",
    event_date: "2024-12-20",
    event_time: "20:00",
    location: "Centro de Convenções",
    status: "planejado",
    priority: "media",
    estimated_budget: 8000
  },
  {
    id: "3",
    title: "Aniversário 15 Anos",
    client_name: "Ana Costa",
    event_date: "2024-12-12", 
    event_time: "18:00",
    location: "Clube Náutico",
    status: "em-andamento",
    priority: "baixa",
    estimated_budget: 3000
  },
  {
    id: "4",
    title: "Evento Corporativo TechStart",
    client_name: "Carlos Mendes",
    event_date: "2024-12-10",
    event_time: "14:00", 
    location: "Hotel Intercity",
    status: "concluido",
    priority: "alta",
    estimated_budget: 7500
  }
];

export const Dashboard = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("todos");
  
  const eventsByStatus = {
    planejado: mockEvents.filter(e => e.status === "planejado"),
    confirmado: mockEvents.filter(e => e.status === "confirmado"),
    "em-andamento": mockEvents.filter(e => e.status === "em-andamento"),
    concluido: mockEvents.filter(e => e.status === "concluido"),
    cancelado: mockEvents.filter(e => e.status === "cancelado"),
  };

  const handleEventClick = (event: Event) => {
    console.log("Abrir detalhes do evento:", event);
  };

  const handleAddEvent = (status: Event["status"]) => {
    console.log("Adicionar novo evento com status:", status);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Event Manager
            </h1>
            <p className="text-muted-foreground">Gerencie seus eventos de forma inteligente</p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90 shadow-glow">
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="Eventos Ativos"
            value={mockEvents.filter(e => e.status !== "concluido" && e.status !== "cancelado").length}
            icon={Calendar}
            variant="primary"
            trend={{ value: 12, label: "este mês", positive: true }}
          />
          <StatsCard
            title="Clientes"
            value={new Set(mockEvents.map(e => e.client_name)).size}
            icon={Users}
            variant="success"
          />
          <StatsCard
            title="Equipamentos"
            value={mockEvents.length}
            icon={Package}
            variant="warning"
          />
          <StatsCard
            title="Taxa Sucesso"
            value="94%"
            icon={TrendingUp}
            variant="success"
            trend={{ value: 5, label: "vs mês anterior", positive: true }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {["todos", "alta", "media", "baixa"].map((filter) => (
            <Badge
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              className="cursor-pointer capitalize whitespace-nowrap"
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </Badge>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 p-4 min-w-max">
          <KanbanColumn
            title="Planejado"
            status="planejado"
            events={eventsByStatus.planejado}
            onEventClick={handleEventClick}
            onAddEvent={handleAddEvent}
          />
          <KanbanColumn
            title="Confirmado"
            status="confirmado"
            events={eventsByStatus.confirmado}
            onEventClick={handleEventClick}
            onAddEvent={handleAddEvent}
          />
          <KanbanColumn
            title="Em Andamento"
            status="em-andamento"
            events={eventsByStatus["em-andamento"]}
            onEventClick={handleEventClick}
            onAddEvent={handleAddEvent}
          />
          <KanbanColumn
            title="Concluído"
            status="concluido"
            events={eventsByStatus.concluido}
            onEventClick={handleEventClick}
            onAddEvent={handleAddEvent}
          />
          <KanbanColumn
            title="Cancelado"
            status="cancelado"
            events={eventsByStatus.cancelado}
            onEventClick={handleEventClick}
            onAddEvent={handleAddEvent}
          />
        </div>
      </div>
    </div>
  );
};