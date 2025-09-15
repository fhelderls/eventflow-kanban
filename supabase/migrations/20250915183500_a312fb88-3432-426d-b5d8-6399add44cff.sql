-- Adicionar foreign keys para relacionamentos (apenas se não existirem)
DO $$ 
BEGIN
    -- Adicionar FK de events para clients se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_events_client'
    ) THEN
        ALTER TABLE public.events 
        ADD CONSTRAINT fk_events_client 
        FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;
    END IF;

    -- Adicionar FK de event_equipment para events se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_event_equipment_event'
    ) THEN
        ALTER TABLE public.event_equipment 
        ADD CONSTRAINT fk_event_equipment_event 
        FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;
    END IF;

    -- Adicionar FK de event_equipment para equipment se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_event_equipment_equipment'
    ) THEN
        ALTER TABLE public.event_equipment 
        ADD CONSTRAINT fk_event_equipment_equipment 
        FOREIGN KEY (equipment_id) REFERENCES public.equipment(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Criar índices para melhor performance (apenas se não existirem)
CREATE INDEX IF NOT EXISTS idx_events_client_id ON public.events(client_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON public.equipment(status);
CREATE INDEX IF NOT EXISTS idx_event_equipment_event_id ON public.event_equipment(event_id);
CREATE INDEX IF NOT EXISTS idx_event_equipment_equipment_id ON public.event_equipment(equipment_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Criar buckets de storage para arquivos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('logos', 'logos', true) 
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true) 
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para logos (apenas admins podem fazer upload)
DROP POLICY IF EXISTS "Admins can upload logos" ON storage.objects;
CREATE POLICY "Admins can upload logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'logos' AND has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Logos are publicly viewable" ON storage.objects;
CREATE POLICY "Logos are publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'logos');

DROP POLICY IF EXISTS "Admins can update logos" ON storage.objects;
CREATE POLICY "Admins can update logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'logos' AND has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete logos" ON storage.objects;
CREATE POLICY "Admins can delete logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'logos' AND has_role(auth.uid(), 'admin'));

-- Políticas de storage para avatars (usuários podem gerenciar seus próprios avatars)
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Avatars are publicly viewable" ON storage.objects;
CREATE POLICY "Avatars are publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);