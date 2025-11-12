import { useState } from "react";
import { Event, useUpdateEvent } from "@/hooks/useEvents";
import { useEventTasks, useCreateEventTask, useToggleEventTask, useDeleteEventTask } from "@/hooks/useEventTasks";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { EventEquipmentManager } from "./EventEquipmentManager";
import { RequiredEquipmentPanel } from "./RequiredEquipmentPanel";
import { ListChecks, Plus, Trash2, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EventTeamTabProps {
  event: Event;
  onEventUpdate: () => void;
}

export const EventTeamTab = ({ event, onEventUpdate }: EventTeamTabProps) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskDescription, setNewTaskDescription] = useState("");

  const { data: tasks = [] } = useEventTasks(event.id);
  const createTask = useCreateEventTask();
  const toggleTask = useToggleEventTask();
  const deleteTask = useDeleteEventTask();
  const updateEvent = useUpdateEvent();

  // Fetch users for assignment
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, avatar_url");
      
      if (error) throw error;
      return data || [];
    },
  });

  const handleAssignUser = (userId: string) => {
    updateEvent.mutate({
      id: event.id,
      data: { assigned_user_id: userId }
    }, {
      onSuccess: onEventUpdate
    });
  };

  const handleAddTask = () => {
    if (!newTaskDescription.trim()) return;
    
    createTask.mutate({
      eventId: event.id,
      data: {
        description: newTaskDescription,
        order_index: tasks.length
      }
    }, {
      onSuccess: () => {
        setNewTaskDescription("");
        setShowAddTask(false);
      }
    });
  };

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const taskProgress = tasks.length > 0 ? (completedTasksCount / tasks.length) * 100 : 0;

  return (
    <div className="space-y-6 py-4">
      {/* Painel de Progresso das Tarefas */}
      <Card className="bg-primary/5">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Progresso do Checklist de Tarefas</h3>
              <Progress value={taskProgress} className="h-3" />
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">Tarefas Concluídas</p>
              <p className="font-medium text-lg">
                {completedTasksCount} de {tasks.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Funcionário Designado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Funcionário Designado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={event.assigned_user_id || ""}
            onValueChange={handleAssignUser}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecionar funcionário" />
            </SelectTrigger>
            <SelectContent>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    {user.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Equipamentos Obrigatórios */}
      <RequiredEquipmentPanel eventId={event.id} />

      {/* Checklist de Tarefas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ListChecks className="w-5 h-5" />
              Checklist de Tarefas
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddTask(!showAddTask)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar Tarefa
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showAddTask && (
            <div className="mb-4 flex gap-2">
              <Input
                placeholder="Descrição da tarefa..."
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <Button
                onClick={handleAddTask}
                disabled={!newTaskDescription.trim()}
              >
                Adicionar
              </Button>
            </div>
          )}

          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-2 border rounded hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-2 flex-1">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked) => 
                      toggleTask.mutate({ 
                        taskId: task.id, 
                        completed: checked as boolean,
                        eventId: event.id 
                      })
                    }
                  />
                  <label className={`text-sm cursor-pointer flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.description}
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask.mutate({ taskId: task.id, eventId: event.id })}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          {tasks.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma tarefa adicionada ainda. Clique em "Adicionar Tarefa" para começar.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Gerenciador de Equipamentos */}
      <EventEquipmentManager 
        eventId={event.id}
        event={event}
        onEventUpdate={onEventUpdate}
      />
    </div>
  );
};
