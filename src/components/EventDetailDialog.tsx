import { Event } from "@/hooks/useEvents";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { EventOverviewTab } from "./EventOverviewTab";
import { EventPlanningTab } from "./EventPlanningTab";
import { EventTeamTab } from "./EventTeamTab";
import { AppLayout } from "./AppLayout";
import { ArrowLeft } from "lucide-react";

interface EventDetailDialogProps {
  event: Event;
  onClose: () => void;
  onEdit: () => void;
  onEventUpdate: () => void;
}

export const EventDetailDialog = ({ event, onClose, onEdit, onEventUpdate }: EventDetailDialogProps) => {
  return (
    <AppLayout title={event.title} description="Detalhes do evento">
      <div className="mb-4">
        <Button onClick={onClose} variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Eventos
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="planning">Planejamento</TabsTrigger>
              <TabsTrigger value="team">Equipe & Montagem</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <EventOverviewTab event={event} onEdit={onEdit} />
            </TabsContent>

            <TabsContent value="planning">
              <EventPlanningTab event={event} onUpdate={(data) => {
                onEdit();
                onEventUpdate();
              }} />
            </TabsContent>

            <TabsContent value="team">
              <EventTeamTab event={event} onEventUpdate={onEventUpdate} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AppLayout>
  );
};
