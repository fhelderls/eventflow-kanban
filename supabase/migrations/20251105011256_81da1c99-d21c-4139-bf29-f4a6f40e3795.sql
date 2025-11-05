-- 1. Atualizar status dos eventos
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check;
ALTER TABLE events ADD CONSTRAINT events_status_check 
  CHECK (status IN ('planejamento', 'preparacao', 'montagem', 'em-andamento', 'concluido', 'cancelado'));

-- Converter status antigos para novos
UPDATE events SET status = 'planejamento' WHERE status = 'planejado';
UPDATE events SET status = 'preparacao' WHERE status = 'confirmado';

-- 2. Adicionar campo de funcionário designado
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS assigned_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_events_assigned_user ON events(assigned_user_id);

-- 3. Criar tabela de tarefas do checklist
CREATE TABLE IF NOT EXISTS event_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by UUID REFERENCES auth.users(id),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_tasks_event_id ON event_tasks(event_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_event_tasks_updated_at
  BEFORE UPDATE ON event_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE event_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view event tasks"
  ON event_tasks FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create event tasks"
  ON event_tasks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update event tasks"
  ON event_tasks FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete event tasks"
  ON event_tasks FOR DELETE
  USING (true);

-- 4. Função para sincronizar status de equipamentos
CREATE OR REPLACE FUNCTION sync_equipment_status(p_equipment_id UUID)
RETURNS void AS $$
DECLARE
  active_count INTEGER;
BEGIN
  -- Conta quantos eventos ativos usam este equipamento
  SELECT COUNT(*) INTO active_count
  FROM event_equipment ee
  INNER JOIN events e ON e.id = ee.event_id
  WHERE ee.equipment_id = p_equipment_id
    AND ee.status IN ('alocado', 'em-uso')
    AND e.status IN ('preparacao', 'montagem', 'em-andamento');
  
  -- Atualiza o status do equipamento
  -- Só altera se o status atual for 'disponivel' ou 'em-uso'
  -- Não sobrescreve 'manutencao' ou 'indisponivel'
  IF active_count > 0 THEN
    UPDATE equipment 
    SET status = 'em-uso'
    WHERE id = p_equipment_id 
      AND status IN ('disponivel', 'em-uso');
  ELSE
    UPDATE equipment 
    SET status = 'disponivel'
    WHERE id = p_equipment_id 
      AND status = 'em-uso';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função wrapper para triggers
CREATE OR REPLACE FUNCTION sync_equipment_status_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM sync_equipment_status(OLD.equipment_id);
  ELSE
    PERFORM sync_equipment_status(NEW.equipment_id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para sincronizar todos equipamentos de um evento
CREATE OR REPLACE FUNCTION sync_all_event_equipment_trigger()
RETURNS TRIGGER AS $$
DECLARE
  equipment_record RECORD;
BEGIN
  FOR equipment_record IN 
    SELECT DISTINCT equipment_id 
    FROM event_equipment 
    WHERE event_id = NEW.id
  LOOP
    PERFORM sync_equipment_status(equipment_record.equipment_id);
  END LOOP;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Criar Triggers
DROP TRIGGER IF EXISTS sync_equipment_after_insert ON event_equipment;
CREATE TRIGGER sync_equipment_after_insert
AFTER INSERT ON event_equipment
FOR EACH ROW
EXECUTE FUNCTION sync_equipment_status_trigger();

DROP TRIGGER IF EXISTS sync_equipment_after_update ON event_equipment;
CREATE TRIGGER sync_equipment_after_update
AFTER UPDATE ON event_equipment
FOR EACH ROW
EXECUTE FUNCTION sync_equipment_status_trigger();

DROP TRIGGER IF EXISTS sync_equipment_after_delete ON event_equipment;
CREATE TRIGGER sync_equipment_after_delete
AFTER DELETE ON event_equipment
FOR EACH ROW
EXECUTE FUNCTION sync_equipment_status_trigger();

DROP TRIGGER IF EXISTS sync_event_equipment_after_event_update ON events;
CREATE TRIGGER sync_event_equipment_after_event_update
AFTER UPDATE OF status ON events
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION sync_all_event_equipment_trigger();