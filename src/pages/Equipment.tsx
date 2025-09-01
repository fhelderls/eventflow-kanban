import { useState } from "react";
import { useEquipment, useCreateEquipment, useUpdateEquipment, useDeleteEquipment } from "@/hooks/useEquipment";
import { EquipmentForm, EquipmentFormData } from "@/components/EquipmentForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Package, 
  Edit, 
  Trash2,
  Eye,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusColors = {
  disponivel: "bg-success text-success-foreground",
  "em-uso": "bg-primary text-primary-foreground",
  manutencao: "bg-warning text-warning-foreground",
  indisponivel: "bg-destructive text-destructive-foreground",
};

export const Equipment = () => {
  const [view, setView] = useState<"list" | "form">("list");
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: equipment = [], isLoading } = useEquipment();
  const createEquipment = useCreateEquipment();
  const updateEquipment = useUpdateEquipment();
  const deleteEquipment = useDeleteEquipment();
  const { toast } = useToast();

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.equipment_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreateEquipment = () => {
    setSelectedEquipment(null);
    setView("form");
  };

  const handleEditEquipment = (item: any) => {
    setSelectedEquipment(item);
    setView("form");
  };

  const handleDeleteEquipment = async (itemId: string) => {
    if (confirm("Tem certeza que deseja excluir este equipamento?")) {
      await deleteEquipment.mutateAsync(itemId);
    }
  };

  const handleFormSubmit = async (data: EquipmentFormData) => {
    try {
      if (selectedEquipment) {
        await updateEquipment.mutateAsync({ id: selectedEquipment.id, data });
        toast({ title: "Equipamento atualizado com sucesso!" });
      } else {
        await createEquipment.mutateAsync(data);
        toast({ title: "Equipamento criado com sucesso!" });
      }
      setView("list");
    } catch (error) {
      toast({ 
        title: "Erro ao salvar equipamento", 
        description: "Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (view === "form") {
    return (
      <EquipmentForm
        initialData={selectedEquipment || undefined}
        onSubmit={handleFormSubmit}
        onCancel={() => setView("list")}
        isLoading={createEquipment.isPending || updateEquipment.isPending}
      />
    );
  }

  return (
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
              <h1 className="text-2xl font-bold">Equipamentos</h1>
              <p className="text-muted-foreground">
                Gerencie todos os seus equipamentos
              </p>
            </div>
          </div>
          <Button 
            onClick={handleCreateEquipment}
            className="bg-gradient-primary hover:opacity-90 shadow-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Equipamento
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar equipamentos..."
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
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="em-uso">Em Uso</SelectItem>
                <SelectItem value="manutencao">Manutenção</SelectItem>
                <SelectItem value="indisponivel">Indisponível</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="som">Som</SelectItem>
                <SelectItem value="iluminacao">Iluminação</SelectItem>
                <SelectItem value="estrutura">Estrutura</SelectItem>
                <SelectItem value="decoracao">Decoração</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Equipment List */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Carregando equipamentos...</p>
          </div>
        ) : filteredEquipment.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum equipamento encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                ? "Tente ajustar os filtros ou criar um novo equipamento."
                : "Comece criando seu primeiro equipamento."
              }
            </p>
            <Button onClick={handleCreateEquipment} className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Equipamento
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEquipment.map((item) => (
              <Card 
                key={item.id} 
                className="cursor-pointer transition-all duration-200 hover:shadow-elevated hover:-translate-y-1 bg-gradient-card"
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Código: {item.equipment_code}
                        </p>
                      </div>
                      <Badge className={statusColors[item.status]}>
                        {item.status}
                      </Badge>
                    </div>

                    {/* Category */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Package className="w-3 h-3" />
                      <span className="truncate">{item.category}</span>
                    </div>

                    {/* Value */}
                    {item.value && (
                      <div className="text-xs">
                        <span className="text-primary font-medium">
                          R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-1 pt-2 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditEquipment(item);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEquipment(item.id);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};