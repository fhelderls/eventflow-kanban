import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, MapPin, DollarSign, AlertTriangle, FileText, ArrowLeft } from "lucide-react";
import { useClients } from "@/hooks/useClients";

export interface EventFormData {
  title: string;
  description?: string;
  client_id?: string;
  event_date: string;
  event_time?: string;
  event_address_street?: string;
  event_address_number?: string;
  event_address_complement?: string;
  event_address_neighborhood?: string;
  event_address_city?: string;
  event_address_state?: string;
  event_address_cep?: string;
  status: "planejado" | "confirmado" | "em-andamento" | "concluido" | "cancelado";
  priority: "alta" | "media" | "baixa";
  estimated_budget?: number;
  observations?: string;
}

const ClientSelect = ({ value, onValueChange }: { value: string; onValueChange: (value: string) => void }) => {
  const { data: clients = [], isLoading } = useClients();
  
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={isLoading ? "Carregando clientes..." : "Selecione um cliente"} />
      </SelectTrigger>
      <SelectContent>
        {clients.map((client) => (
          <SelectItem key={client.id} value={client.id}>
            {client.name} {client.company_name && `(${client.company_name})`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EventForm = ({ initialData, onSubmit, onCancel, isLoading }: EventFormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EventFormData>({
    defaultValues: {
      status: "planejado",
      priority: "media",
      ...initialData,
    },
  });

  const watchedStatus = watch("status");
  const watchedPriority = watch("priority");

  const handleFormSubmit = (data: EventFormData) => {
    // Validate that client_id is provided
    if (!data.client_id || data.client_id.trim() === "") {
      return; // Form validation will show the error
    }
    onSubmit(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {initialData?.title ? "Editar Evento" : "Novo Evento"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Hidden field for client_id validation */}
            <input
              type="hidden"
              {...register("client_id", { required: "Selecione um cliente" })}
            />
            {/* Informações Básicas */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Nome do Evento *</Label>
                <Input
                  id="title"
                  {...register("title", { required: "Nome do evento é obrigatório" })}
                  placeholder="Ex: Casamento Silva & Santos"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={watchedStatus} onValueChange={(value) => setValue("status", value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planejado">Planejado</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="em-andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Descrição detalhada do evento..."
                rows={3}
              />
            </div>

            {/* Informações do Cliente */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Cliente
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="client_id">Cliente *</Label>
                <ClientSelect
                  value={watch("client_id") || ""}
                  onValueChange={(value) => setValue("client_id", value)}
                />
                {errors.client_id && (
                  <p className="text-sm text-destructive">{errors.client_id.message}</p>
                )}
              </div>
            </div>

            {/* Data e Horário */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Data e Horário
              </h3>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="event_date">Data do Evento *</Label>
                  <Input
                    id="event_date"
                    type="date"
                    {...register("event_date", { required: "Data é obrigatória" })}
                  />
                  {errors.event_date && (
                    <p className="text-sm text-destructive">{errors.event_date.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_time">Horário do Evento</Label>
                  <Input
                    id="event_time"
                    type="time"
                    {...register("event_time")}
                  />
                </div>
              </div>
            </div>

            {/* Local */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Local do Evento
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="event_address_street">Rua</Label>
                  <Input
                    id="event_address_street"
                    {...register("event_address_street")}
                    placeholder="Nome da rua"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_address_number">Número</Label>
                  <Input
                    id="event_address_number"
                    {...register("event_address_number")}
                    placeholder="Número"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_address_complement">Complemento</Label>
                  <Input
                    id="event_address_complement"
                    {...register("event_address_complement")}
                    placeholder="Apartamento, bloco, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_address_neighborhood">Bairro</Label>
                  <Input
                    id="event_address_neighborhood"
                    {...register("event_address_neighborhood")}
                    placeholder="Bairro"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_address_city">Cidade</Label>
                  <Input
                    id="event_address_city"
                    {...register("event_address_city")}
                    placeholder="Cidade"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_address_state">Estado</Label>
                  <Input
                    id="event_address_state"
                    {...register("event_address_state")}
                    placeholder="Estado"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_address_cep">CEP</Label>
                  <Input
                    id="event_address_cep"
                    {...register("event_address_cep")}
                    placeholder="00000-000"
                  />
                </div>
              </div>
            </div>

            {/* Configurações Adicionais */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Configurações
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select value={watchedPriority} onValueChange={(value) => setValue("priority", value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated_budget">Orçamento Estimado (R$)</Label>
                  <Input
                    id="estimated_budget"
                    type="number"
                    step="0.01"
                    {...register("estimated_budget", { valueAsNumber: true })}
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Observações
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  {...register("observations")}
                  placeholder="Observações importantes sobre o evento..."
                  rows={4}
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-between gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={() => window.location.href = "/"}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Início
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  {isLoading ? "Salvando..." : "Salvar Evento"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};