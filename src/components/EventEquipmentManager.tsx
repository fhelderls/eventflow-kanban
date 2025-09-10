import { useState } from "react";
import { useEventEquipment, useAddEventEquipment, useUpdateEventEquipment, useRemoveEventEquipment, EventEquipmentFormData } from "@/hooks/useEventEquipment";
import { useAvailableEquipment } from "@/hooks/useEquipment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Package, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";

interface EventEquipmentManagerProps {
  eventId: string;
}

const EquipmentForm = ({ 
  onSubmit, 
  initialData, 
  isLoading 
}: { 
  onSubmit: (data: EventEquipmentFormData) => void;
  initialData?: Partial<EventEquipmentFormData>;
  isLoading?: boolean;
}) => {
  const { data: equipment = [] } = useAvailableEquipment();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EventEquipmentFormData>({
    defaultValues: {
      status: "alocado",
      quantity: 1,
      ...initialData
    }
  });

  const watchedStatus = watch("status");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("equipment_id", { required: "Selecione um equipamento" })} />
      
      <div className="space-y-2">
        <Label>Equipamento *</Label>
        <Select 
          value={watch("equipment_id") || ""} 
          onValueChange={(value) => setValue("equipment_id", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um equipamento" />
          </SelectTrigger>
          <SelectContent>
            {equipment.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name} - {item.equipment_code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.equipment_id && (
          <p className="text-sm text-destructive">{errors.equipment_id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantidade *</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          {...register("quantity", { 
            required: "Quantidade é obrigatória",
            min: { value: 1, message: "Quantidade deve ser pelo menos 1" },
            valueAsNumber: true
          })}
        />
        {errors.quantity && (
          <p className="text-sm text-destructive">{errors.quantity.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={watchedStatus} onValueChange={(value) => setValue("status", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alocado">Alocado</SelectItem>
            <SelectItem value="em-uso">Em Uso</SelectItem>
            <SelectItem value="retornado">Retornado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observations">Observações</Label>
        <Input
          id="observations"
          {...register("observations")}
          placeholder="Observações sobre o equipamento..."
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
};

export const EventEquipmentManager = ({ eventId }: EventEquipmentManagerProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<any>(null);

  const { data: eventEquipment = [], isLoading } = useEventEquipment(eventId);
  const addEquipment = useAddEventEquipment();
  const updateEquipment = useUpdateEventEquipment();
  const removeEquipment = useRemoveEventEquipment();

  const handleAdd = async (data: EventEquipmentFormData) => {
    await addEquipment.mutateAsync({ eventId, equipmentData: data });
    setIsAddDialogOpen(false);
  };

  const handleUpdate = async (data: EventEquipmentFormData) => {
    if (editingEquipment) {
      await updateEquipment.mutateAsync({ 
        id: editingEquipment.id, 
        eventId, 
        data 
      });
      setEditingEquipment(null);
    }
  };

  const handleRemove = async (equipmentId: string) => {
    if (confirm("Tem certeza que deseja remover este equipamento do evento?")) {
      await removeEquipment.mutateAsync({ id: equipmentId, eventId });
    }
  };

  const statusColors = {
    alocado: "bg-info text-info-foreground",
    "em-uso": "bg-warning text-warning-foreground",
    retornado: "bg-success text-success-foreground",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Equipamentos do Evento
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Equipamento</DialogTitle>
              </DialogHeader>
              <EquipmentForm 
                onSubmit={handleAdd}
                isLoading={addEquipment.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {eventEquipment.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <AlertTriangle className="w-12 h-12 text-warning mx-auto" />
            <div>
              <h3 className="font-medium text-warning">Nenhum equipamento adicionado</h3>
              <p className="text-sm text-muted-foreground">
                Este evento deve ter pelo menos um equipamento associado.
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Equipamento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Equipamento</DialogTitle>
                </DialogHeader>
                <EquipmentForm 
                  onSubmit={handleAdd}
                  isLoading={addEquipment.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipamento</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventEquipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.equipment?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {item.equipment?.equipment_code || "N/A"}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[item.status as keyof typeof statusColors]}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog 
                        open={editingEquipment?.id === item.id} 
                        onOpenChange={(open) => setEditingEquipment(open ? item : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Equipamento</DialogTitle>
                          </DialogHeader>
                          <EquipmentForm 
                            onSubmit={handleUpdate}
                            initialData={{
                              equipment_id: item.equipment_id,
                              quantity: item.quantity,
                              status: item.status,
                              observations: item.observations || ""
                            }}
                            isLoading={updateEquipment.isPending}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemove(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};