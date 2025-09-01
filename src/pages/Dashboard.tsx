import { AppLayout } from "@/components/AppLayout";
import { StatsCard } from "@/components/StatsCard";
import { Calendar, Users, Package, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { useClients } from "@/hooks/useClients";
import { useEquipment } from "@/hooks/useEquipment";

export const Dashboard = () => {
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: equipment, isLoading: equipmentLoading } = useEquipment();

  // Calculate stats from real data
  const confirmedEvents = events?.filter(e => e.status === "confirmado").length || 0;
  const totalRevenue = events?.reduce((sum, e) => sum + (e.estimated_budget || 0), 0) || 0;
  const activeEquipment = equipment?.filter(e => e.status === "disponivel").length || 0;
  const maintenanceEquipment = equipment?.filter(e => e.status === "manutencao").length || 0;

  return (
    <AppLayout 
      title="Dashboard" 
      description="Visão geral dos seus eventos e operações"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total de Eventos"
          value={eventsLoading ? "..." : (events?.length || 0).toString()}
          description="Cadastrados no sistema"
          icon={Calendar}
          trend={{ 
            value: events?.length || 0, 
            label: "total", 
            positive: (events?.length || 0) > 0 
          }}
        />
        <StatsCard
          title="Eventos Confirmados"
          value={eventsLoading ? "..." : confirmedEvents.toString()}
          description="Prontos para execução"
          icon={Users}
          trend={{ 
            value: confirmedEvents, 
            label: "confirmados", 
            positive: confirmedEvents > 0 
          }}
        />
        <StatsCard
          title="Receita Esperada"
          value={eventsLoading ? "..." : `R$ ${totalRevenue.toLocaleString('pt-BR')}`}
          description="Valor total estimado"
          icon={TrendingUp}
          trend={{ 
            value: Math.round((totalRevenue / 1000)), 
            label: "mil reais", 
            positive: totalRevenue > 0 
          }}
        />
        <StatsCard
          title="Equipamentos"
          value={equipmentLoading ? "..." : activeEquipment.toString()}
          description="Disponíveis"
          icon={Package}
          trend={{ 
            value: maintenanceEquipment, 
            label: "em manutenção", 
            positive: maintenanceEquipment === 0 
          }}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-card rounded-lg p-6 mb-8 shadow-card">
        <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Button 
            asChild 
            variant="outline" 
            className="p-4 h-auto bg-primary/5 hover:bg-primary/10 border-primary/20 transition-all group"
          >
            <Link to="/events" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Novo Evento</h3>
                <p className="text-sm text-muted-foreground">Criar evento</p>
              </div>
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            className="p-4 h-auto bg-success/5 hover:bg-success/10 border-success/20 transition-all group"
          >
            <Link to="/clients" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-success" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Novo Cliente</h3>
                <p className="text-sm text-muted-foreground">Cadastrar cliente</p>
              </div>
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            className="p-4 h-auto bg-info/5 hover:bg-info/10 border-info/20 transition-all group"
          >
            <Link to="/equipment" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5 text-info" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Novo Equipamento</h3>
                <p className="text-sm text-muted-foreground">Adicionar item</p>
              </div>
            </Link>
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-card rounded-lg p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Atividade Recente</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/events">
              Ver todos
            </Link>
          </Button>
        </div>
        
        {eventsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-muted/60 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.event_date).toLocaleDateString('pt-BR')} - {event.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum evento encontrado</p>
            <p className="text-sm">Crie seu primeiro evento para começar</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};