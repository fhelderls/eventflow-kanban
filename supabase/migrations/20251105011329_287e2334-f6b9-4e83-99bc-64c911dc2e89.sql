-- Corrigir search_path das funções criadas
CREATE OR REPLACE FUNCTION sync_equipment_status(p_equipment_id UUID)
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  active_count INTEGER;
BEGIN
  -- Conta quantos eventos ativos usam este equipamento
  SELECT COUNT(*) INTO active_count
  FROM public.event_equipment ee
  INNER JOIN public.events e ON e.id = ee.event_id
  WHERE ee.equipment_id = p_equipment_id
    AND ee.status IN ('alocado', 'em-uso')
    AND e.status IN ('preparacao', 'montagem', 'em-andamento');
  
  -- Atualiza o status do equipamento
  IF active_count > 0 THEN
    UPDATE public.equipment 
    SET status = 'em-uso'
    WHERE id = p_equipment_id 
      AND status IN ('disponivel', 'em-uso');
  ELSE
    UPDATE public.equipment 
    SET status = 'disponivel'
    WHERE id = p_equipment_id 
      AND status = 'em-uso';
  END IF;
END;
$$;

-- Função wrapper para triggers
CREATE OR REPLACE FUNCTION sync_equipment_status_trigger()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.sync_equipment_status(OLD.equipment_id);
  ELSE
    PERFORM public.sync_equipment_status(NEW.equipment_id);
  END IF;
  RETURN NULL;
END;
$$;

-- Função para sincronizar todos equipamentos de um evento
CREATE OR REPLACE FUNCTION sync_all_event_equipment_trigger()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  equipment_record RECORD;
BEGIN
  FOR equipment_record IN 
    SELECT DISTINCT equipment_id 
    FROM public.event_equipment 
    WHERE event_id = NEW.id
  LOOP
    PERFORM public.sync_equipment_status(equipment_record.equipment_id);
  END LOOP;
  RETURN NULL;
END;
$$;