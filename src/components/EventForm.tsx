import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, MapPin, DollarSign, AlertTriangle, FileText } from "lucide-react";

export interface EventFormData {
  title: string;
  description?: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  event_date: string;
  event_time: string;
  end_time?: string;
  location: string;
  address?: string;
  status: "planejado" | "confirmado" | "em-andamento" | "concluido" | "cancelado";
  priority: "alta" | "media" | "baixa";
  estimated_budget?: number;
  notes?: string;
}

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                Dados do Cliente
              </h3>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="client_name">Nome do Cliente *</Label>
                  <Input
                    id="client_name"
                    {...register("client_name", { required: "Nome do cliente é obrigatório" })}
                    placeholder="Ex: Maria Silva"
                  />
                  {errors.client_name && (
                    <p className="text-sm text-destructive">{errors.client_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_email">E-mail</Label>
                  <Input
                    id="client_email"
                    type="email"
                    {...register("client_email")}
                    placeholder="maria@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_phone">Telefone</Label>
                  <Input
                    id="client_phone"
                    {...register("client_phone")}
                    placeholder="(11) 99999-9999"
                  />
                </div>
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
                  <Label htmlFor="event_time">Horário de Início *</Label>
                  <Input
                    id="event_time"
                    type="time"
                    {...register("event_time", { required: "Horário é obrigatório" })}
                  />
                  {errors.event_time && (
                    <p className="text-sm text-destructive">{errors.event_time.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_time">Horário de Término</Label>
                  <Input
                    id="end_time"
                    type="time"
                    {...register("end_time")}
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
                  <Label htmlFor="location">Nome do Local *</Label>
                  <Input
                    id="location"
                    {...register("location", { required: "Local é obrigatório" })}
                    placeholder="Ex: Salão de Festas Príncipe"
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive">{errors.location.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Input
                    id="address"
                    {...register("address")}
                    placeholder="Rua, número, bairro, cidade"
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
                <Label htmlFor="notes">Notas Adicionais</Label>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  placeholder="Observações importantes sobre o evento..."
                  rows={4}
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-4 pt-6 border-t">
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
};