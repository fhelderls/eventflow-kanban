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
    client: "Maria Silva",
    date: "15/12/2024",
    time: "19:00",
    location: "Salão Príncipe",
    status: "confirmado",
    equipmentCount: 12,
    priority: "alta"
  },
  {
    id: "2", 
    title: "Formatura Medicina UFMG",
    client: "João Oliveira",
    date: "20/12/2024",
    time: "20:00",
    location: "Centro de Convenções",
    status: "planejado",
    equipmentCount: 25,
    priority: "media"
  },
  {
    id: "3",
    title: "Aniversário 15 Anos",
    client: "Ana Costa",
    date: "12/12/2024", 
    time: "18:00",
    location: "Clube Náutico",
    status: "em-andamento",
    equipmentCount: 8,
    priority: "baixa"
  },
  {
    id: "4",
    title: "Evento Corporativo TechStart",
    client: "Carlos Mendes",
    date: "10/12/2024",
    time: "14:00", 
    location: "Hotel Intercity",
    status: "concluido",
    equipmentCount: 18,
    priority: "alta"
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
            value={new Set(mockEvents.map(e => e.client)).size}
            icon={Users}
            variant="success"
          />
          <StatsCard
            title="Equipamentos"
            value={mockEvents.reduce((acc, e) => acc + e.equipmentCount, 0)}
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