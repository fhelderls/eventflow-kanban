import { useState } from "react";
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent, Event } from "@/hooks/useEvents";
import { EventForm, EventFormData } from "@/components/EventForm";
import { EventDetailDialog } from "@/components/EventDetailDialog";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  List, 
  Edit, 
  Trash2,
  User,
  MapPin,
  Clock,
  Eye,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const statusColors = {
  planejado: "bg-info text-info-foreground",
  confirmado: "bg-primary text-primary-foreground",
  "em-andamento": "bg-warning text-warning-foreground",
  concluido: "bg-success text-success-foreground",
  cancelado: "bg-destructive text-destructive-foreground",
};

const priorityColors = {
  alta: "border-l-4 border-destructive",
  media: "border-l-4 border-warning",
  baixa: "border-l-4 border-success",
};

export const Events = () => {
  const [view, setView] = useState<"list" | "form" | "detail">("list");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const { data: events = [], isLoading } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const { toast } = useToast();

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.client?.name.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || event.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setView("form");
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setView("form");
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setView("detail");
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
      await deleteEvent.mutateAsync(eventId);
    }
  };

  const handleFormSubmit = async (data: EventFormData) => {
    try {
      if (selectedEvent) {
        await updateEvent.mutateAsync({ id: selectedEvent.id, data });
        toast({ title: "Evento atualizado com sucesso!" });
      } else {
        await createEvent.mutateAsync(data);
        toast({ title: "Evento criado com sucesso!" });
      }
      setView("list");
    } catch (error) {
      toast({ 
        title: "Erro ao salvar evento", 
        description: "Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (view === "form") {
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
          <EventForm
            initialData={selectedEvent || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setView("list")}
            isLoading={createEvent.isPending || updateEvent.isPending}
          />
        </div>
      </div>
    );
  }

  if (view === "detail" && selectedEvent) {
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
          <EventDetailDialog
            event={selectedEvent}
            onClose={() => setView("list")}
            onEdit={() => handleEditEvent(selectedEvent)}
          />
        </div>
      </div>
    );
  }

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
      <div className="flex-1 order-1 md:order-2 pb-16 md:pb-0 overflow-hidden">
        <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => window.location.href = "/"}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Eventos</h1>
              <p className="text-muted-foreground">
                Gerencie todos os seus eventos
              </p>
            </div>
          </div>
          <Button 
            onClick={handleCreateEvent}
            className="bg-gradient-primary hover:opacity-90 shadow-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="planejado">Planejado</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="em-andamento">Em Andamento</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Carregando eventos...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <CalendarIcon className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum evento encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                ? "Tente ajustar os filtros ou criar um novo evento."
                : "Comece criando seu primeiro evento."
              }
            </p>
            <Button onClick={handleCreateEvent} className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Evento
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <Card 
                key={event.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-elevated hover:-translate-y-1 bg-gradient-card ${priorityColors[event.priority]}`}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm line-clamp-2">
                        {event.title}
                      </h3>
                      <Badge className={statusColors[event.status]}>
                        {event.status}
                      </Badge>
                    </div>

                    {/* Client */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span className="truncate">{event.client?.name || "Cliente não informado"}</span>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{format(new Date(event.event_date), "dd/MM/yyyy", { locale: ptBR })}</span>
                      <Clock className="w-3 h-3 ml-1" />
                      <span>{event.event_time}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{event.event_address_street ? `${event.event_address_street}, ${event.event_address_number}` : "Local não informado"}</span>
                    </div>

                    {/* Budget */}
                    {event.estimated_budget && (
                      <div className="text-xs">
                        <span className="text-primary font-medium">
                          R$ {event.estimated_budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between pt-2 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewEvent(event);
                        }}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </Button>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEvent(event);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event.id);
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};