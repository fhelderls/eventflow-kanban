import { forwardRef } from "react";
import { Event } from "@/hooks/useEvents";
import { useEventEquipment } from "@/hooks/useEventEquipment";
import { useEventTasks } from "@/hooks/useEventTasks";
import { useRequiredEquipment } from "@/hooks/useRequiredEquipment";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, XCircle, Package, ListChecks } from "lucide-react";

interface EventPrintViewProps {
  event: Event;
}

export const EventPrintView = forwardRef<HTMLDivElement, EventPrintViewProps>(
  ({ event }, ref) => {
    const { data: eventEquipment = [] } = useEventEquipment(event.id);
    const { data: tasks = [] } = useEventTasks(event.id);
    const { validationResults, allRequirementsMet } = useRequiredEquipment(event.id);

    const statusLabels: Record<string, string> = {
      planejamento: "Planejamento",
      preparacao: "Preparação",
      montagem: "Montagem",
      "em-andamento": "Em Andamento",
      concluido: "Concluído",
      cancelado: "Cancelado"
    };

    const priorityLabels: Record<string, string> = {
      baixa: "Baixa",
      media: "Média",
      alta: "Alta"
    };

    return (
      <div ref={ref} className="print:block hidden">
        <style>{`
          @media print {
            @page {
              margin: 2cm;
              size: A4;
            }
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        `}</style>
        
        <div className="p-8 bg-background text-foreground">
          {/* Cabeçalho */}
          <div className="border-b-4 border-primary pb-4 mb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">{event.title}</h1>
            <div className="flex gap-4 text-sm">
              <span className="px-3 py-1 bg-primary/10 rounded-full">
                Status: {statusLabels[event.status]}
              </span>
              <span className="px-3 py-1 bg-accent/30 rounded-full">
                Prioridade: {priorityLabels[event.priority]}
              </span>
            </div>
          </div>

          {/* Informações do Evento */}
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-primary">
              📅 Detalhes do Evento
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Data</p>
                <p className="font-medium">
                  {format(new Date(event.event_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
              {event.event_time && (
                <div>
                  <p className="text-sm text-muted-foreground">Horário</p>
                  <p className="font-medium">{event.event_time}</p>
                </div>
              )}
              {event.barrel_quantity && (
                <div>
                  <p className="text-sm text-muted-foreground">Quantidade de Barris</p>
                  <p className="font-medium">{event.barrel_quantity}</p>
                </div>
              )}
            </div>
          </section>

          {/* Cliente */}
          {event.client && (
            <section className="mb-6">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-primary">
                👤 Cliente
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{event.client.name}</p>
                </div>
                {event.client.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{event.client.phone}</p>
                  </div>
                )}
                {event.client.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{event.client.email}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Endereço do Evento */}
          {event.event_address_street && (
            <section className="mb-6">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-primary">
                📍 Local do Evento
              </h2>
              <div className="bg-accent/30 p-4 rounded-lg">
                <p className="font-medium">
                  {event.event_address_street}, {event.event_address_number}
                </p>
                {event.event_address_complement && (
                  <p>{event.event_address_complement}</p>
                )}
                <p>
                  {event.event_address_neighborhood} - {event.event_address_city}/{event.event_address_state}
                </p>
                {event.event_address_cep && <p>CEP: {event.event_address_cep}</p>}
              </div>
            </section>
          )}

          {/* Equipamentos Obrigatórios */}
          <section className="mb-6 break-inside-avoid">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-primary">
              <Package className="w-5 h-5" />
              Equipamentos Obrigatórios
            </h2>
            <div className="border-2 border-primary/20 rounded-lg p-4">
              <div className="mb-3 flex items-center gap-2">
                {allRequirementsMet ? (
                  <span className="text-success font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Todos Equipamentos Alocados
                  </span>
                ) : (
                  <span className="text-destructive font-medium flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Equipamentos Faltando
                  </span>
                )}
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-primary/20">
                    <th className="text-left py-2">Equipamento</th>
                    <th className="text-center py-2">Necessário</th>
                    <th className="text-center py-2">Alocado</th>
                    <th className="text-center py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {validationResults.map(item => (
                    <tr key={item.category} className="border-b border-border/50">
                      <td className="py-2 font-medium">{item.label}</td>
                      <td className="text-center">{item.required}</td>
                      <td className="text-center">{item.allocated}</td>
                      <td className="text-center">
                        {item.hasRequired ? (
                          <CheckCircle2 className="w-4 h-4 text-success inline" />
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive inline" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Todos os Equipamentos */}
          {eventEquipment.length > 0 && (
            <section className="mb-6 break-inside-avoid">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-primary">
                🔧 Todos os Equipamentos
              </h2>
              <table className="w-full border-collapse border border-border/50">
                <thead className="bg-accent/30">
                  <tr>
                    <th className="border border-border/50 p-2 text-left">Equipamento</th>
                    <th className="border border-border/50 p-2 text-left">Código</th>
                    <th className="border border-border/50 p-2 text-center">Qtd</th>
                    <th className="border border-border/50 p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {eventEquipment.map(item => (
                    <tr key={item.id}>
                      <td className="border border-border/50 p-2">{item.equipment?.name}</td>
                      <td className="border border-border/50 p-2">{item.equipment?.equipment_code}</td>
                      <td className="border border-border/50 p-2 text-center">{item.quantity}</td>
                      <td className="border border-border/50 p-2 text-center">{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Checklist de Tarefas */}
          {tasks.length > 0 && (
            <section className="mb-6 break-inside-avoid">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-primary">
                <ListChecks className="w-5 h-5" />
                Checklist de Tarefas
              </h2>
              <div className="space-y-2">
                {tasks.map((task, index) => (
                  <div key={task.id} className="flex items-center gap-3 p-2 border border-border/50 rounded">
                    <div className="w-5 h-5 border-2 border-foreground/30 rounded flex items-center justify-center">
                      {task.completed && <CheckCircle2 className="w-4 h-4 text-success" />}
                    </div>
                    <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                      {index + 1}. {task.description}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                Concluídas: {tasks.filter(t => t.completed).length} de {tasks.length}
              </div>
            </section>
          )}

          {/* Observações */}
          {event.observations && (
            <section className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-primary">📝 Observações</h2>
              <div className="bg-accent/30 p-4 rounded-lg whitespace-pre-wrap">
                {event.observations}
              </div>
            </section>
          )}

          {/* Rodapé */}
          <div className="mt-8 pt-4 border-t-2 border-border/50 text-sm text-muted-foreground">
            <p>Documento gerado em: {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
          </div>
        </div>
      </div>
    );
  }
);

EventPrintView.displayName = "EventPrintView";
