import { useState } from "react";
import { StatsCard } from "@/components/StatsCard";
import { Navigation } from "@/components/ui/navigation";
import { Calendar, Users, Package, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Casamento Silva & Santos",
    client: { id: "1", name: "Maria Silva", email: "maria@email.com", phone: "(11) 99999-1111" },
    event_date: "2024-12-15",
    event_time: "19:00",
    event_address_street: "Rua Príncipe",
    event_address_number: "123",
    event_address_city: "São Paulo",
    status: "confirmado" as const,
    priority: "alta" as const,
    estimated_budget: 5000,
    created_at: "2024-12-01T10:00:00Z",
    updated_at: "2024-12-01T10:00:00Z"
  },
  {
    id: "2", 
    title: "Formatura Medicina UFMG",
    client: { id: "2", name: "João Oliveira", email: "joao@email.com", phone: "(11) 99999-2222" },
    event_date: "2024-12-20",
    event_time: "20:00",
    event_address_street: "Av. Centro de Convenções",
    event_address_number: "456",
    event_address_city: "Belo Horizonte",
    status: "planejado" as const,
    priority: "media" as const,
    estimated_budget: 8000,
    created_at: "2024-12-01T11:00:00Z",
    updated_at: "2024-12-01T11:00:00Z"
  },
  {
    id: "3",
    title: "Aniversário 15 Anos",
    client: { id: "3", name: "Ana Costa", email: "ana@email.com", phone: "(11) 99999-3333" },
    event_date: "2024-12-12", 
    event_time: "18:00",
    event_address_street: "Rua Náutico",
    event_address_number: "789",
    event_address_city: "Rio de Janeiro",
    status: "em-andamento" as const,
    priority: "baixa" as const,
    estimated_budget: 3000,
    created_at: "2024-12-01T12:00:00Z",
    updated_at: "2024-12-01T12:00:00Z"
  },
  {
    id: "4",
    title: "Evento Corporativo TechStart",
    client: { id: "4", name: "Carlos Mendes", email: "carlos@email.com", phone: "(11) 99999-4444" },
    event_date: "2024-12-10",
    event_time: "14:00", 
    event_address_street: "Rua Intercity",
    event_address_number: "321",
    event_address_city: "São Paulo",
    status: "concluido" as const,
    priority: "alta" as const,
    estimated_budget: 7500,
    created_at: "2024-12-01T13:00:00Z",
    updated_at: "2024-12-01T13:00:00Z"
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
    <div className="h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile Navigation - Bottom */}
      <div className="md:hidden order-2">
        <Navigation />
      </div>
      
      {/* Desktop Navigation - Side */}
      <div className="hidden md:block w-64 border-r border-border bg-card">
        <div className="p-4">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            Event Manager
          </h1>
          <Navigation />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 order-1 md:order-2 pb-16 md:pb-0 overflow-y-auto">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  Dashboard
                </h1>
                <p className="text-muted-foreground text-sm">
                  Visão geral dos seus eventos
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatsCard
              title="Total de Eventos"
              value="24"
              description="Este mês"
              icon={Calendar}
              trend={{ value: 12, label: "este mês", positive: true }}
            />
            <StatsCard
              title="Eventos Confirmados"
              value="18"
              description="75% do total"
              icon={Users}
              trend={{ value: 8, label: "confirmados", positive: true }}
            />
            <StatsCard
              title="Receita Esperada"
              value="R$ 45.000"
              description="Este mês"
              icon={TrendingUp}
              trend={{ value: 15, label: "crescimento", positive: true }}
            />
            <StatsCard
              title="Equipamentos Ativos"
              value="42"
              description="Em uso hoje"
              icon={Package}
              trend={{ value: 3, label: "manutenção", positive: false }}
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-card rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <button className="p-4 bg-primary/10 hover:bg-primary/20 rounded-lg text-left transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-primary">📅</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Novo Evento</h3>
                    <p className="text-sm text-muted-foreground">Criar evento</p>
                  </div>
                </div>
              </button>
              
              <button className="p-4 bg-success/10 hover:bg-success/20 rounded-lg text-left transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-success">👥</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Novo Cliente</h3>
                    <p className="text-sm text-muted-foreground">Cadastrar cliente</p>
                  </div>
                </div>
              </button>
              
              <button className="p-4 bg-info/10 hover:bg-info/20 rounded-lg text-left transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-info/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-info">📦</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Novo Equipamento</h3>
                    <p className="text-sm text-muted-foreground">Adicionar item</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};