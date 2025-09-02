import { useState } from "react";
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from "@/hooks/useClients";
import { ClientForm, ClientFormData } from "@/components/ClientForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  User, 
  Edit, 
  Trash2,
  Mail,
  Phone,
  Building,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Clients = () => {
  const [view, setView] = useState<"list" | "form">("list");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: clients = [], isLoading } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();
  const { toast } = useToast();

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                         (client.company_name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleCreateClient = () => {
    setSelectedClient(null);
    setView("form");
  };

  const handleEditClient = (client: any) => {
    setSelectedClient(client);
    setView("form");
  };

  const handleDeleteClient = async (clientId: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      await deleteClient.mutateAsync(clientId);
    }
  };

  const handleFormSubmit = async (data: ClientFormData) => {
    try {
      if (selectedClient) {
        await updateClient.mutateAsync({ id: selectedClient.id, data });
        toast({ title: "Cliente atualizado com sucesso!" });
      } else {
        await createClient.mutateAsync(data);
        toast({ title: "Cliente criado com sucesso!" });
      }
      setView("list");
    } catch (error) {
      toast({ 
        title: "Erro ao salvar cliente", 
        description: "Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (view === "form") {
    return (
      <ClientForm
        initialData={selectedClient || undefined}
        onSubmit={handleFormSubmit}
        onCancel={() => setView("list")}
        isLoading={createClient.isPending || updateClient.isPending}
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
              <h1 className="text-2xl font-bold">Clientes</h1>
              <p className="text-muted-foreground">
                Gerencie todos os seus clientes
              </p>
            </div>
          </div>
          <Button 
            onClick={handleCreateClient}
            className="bg-gradient-primary hover:opacity-90 shadow-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        {/* Search */}
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clients List */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Carregando clientes...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <User className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum cliente encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "Tente ajustar a busca ou criar um novo cliente."
                : "Comece criando seu primeiro cliente."
              }
            </p>
            <Button onClick={handleCreateClient} className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Cliente
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client) => (
              <Card 
                key={client.id} 
                className="cursor-pointer transition-all duration-200 hover:shadow-elevated hover:-translate-y-1 bg-gradient-card"
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                     {/* Header */}
                     <div className="flex items-start justify-between gap-2">
                       <div className="flex-1">
                         <div className="flex items-center gap-2 mb-1">
                           <h3 className="font-semibold text-sm line-clamp-1">
                             {client.name}
                           </h3>
                         </div>
                         <div className="text-xs text-muted-foreground mb-1">
                           <strong>ID:</strong> {client.id.slice(0, 8)}...
                         </div>
                         {client.company_name && (
                           <p className="text-xs text-muted-foreground line-clamp-1">
                             {client.company_name}
                           </p>
                         )}
                       </div>
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={(e) => {
                           e.stopPropagation();
                           if (navigator.clipboard) {
                             navigator.clipboard.writeText(client.id);
                             toast({ title: "ID copiado!", description: "ID do cliente copiado para área de transferência" });
                           } else {
                             // Fallback for browsers without clipboard API
                             const textArea = document.createElement('textarea');
                             textArea.value = client.id;
                             document.body.appendChild(textArea);
                             textArea.select();
                             document.execCommand('copy');
                             document.body.removeChild(textArea);
                             toast({ title: "ID copiado!", description: "ID do cliente copiado para área de transferência" });
                           }
                         }}
                         className="shrink-0"
                         title="Copiar ID completo"
                       >
                         <User className="w-3 h-3" />
                       </Button>
                     </div>

                    {/* Contact Info */}
                    {client.email && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}

                    {client.phone && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span className="truncate">{client.phone}</span>
                      </div>
                    )}

                    {/* Company Info */}
                    {client.cpf_cnpj && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Building className="w-3 h-3" />
                        <span className="truncate">CPF/CNPJ: {client.cpf_cnpj}</span>
                      </div>
                    )}

                    {/* Address */}
                    {client.address_street && (
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {[client.address_street, client.address_number, client.address_neighborhood, client.address_city].filter(Boolean).join(", ")}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-1 pt-2 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClient(client);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClient(client.id);
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