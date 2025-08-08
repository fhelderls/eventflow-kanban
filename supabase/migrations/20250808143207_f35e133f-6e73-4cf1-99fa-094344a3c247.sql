-- Create clients table with complete registration details
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  cpf_cnpj TEXT,
  address_street TEXT,
  address_number TEXT,
  address_complement TEXT,
  address_neighborhood TEXT,
  address_city TEXT,
  address_state TEXT,
  address_cep TEXT,
  company_name TEXT,
  contact_person TEXT,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create equipment table with unique IDs
CREATE TABLE public.equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'disponivel',
  acquisition_date DATE,
  value DECIMAL(10,2),
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table with complete details
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  client_id UUID REFERENCES public.clients(id),
  event_date DATE NOT NULL,
  event_time TIME,
  event_address_street TEXT,
  event_address_number TEXT,
  event_address_complement TEXT,
  event_address_neighborhood TEXT,
  event_address_city TEXT,
  event_address_state TEXT,
  event_address_cep TEXT,
  barrel_quantity INTEGER DEFAULT 0,
  estimated_budget DECIMAL(10,2),
  final_budget DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'planejado',
  priority TEXT NOT NULL DEFAULT 'media',
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event_equipment junction table for equipment control
CREATE TABLE public.event_equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES public.equipment(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  allocated_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  returned_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'alocado',
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, equipment_id)
);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_equipment ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust later with authentication)
CREATE POLICY "Anyone can view clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Anyone can create clients" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update clients" ON public.clients FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete clients" ON public.clients FOR DELETE USING (true);

CREATE POLICY "Anyone can view equipment" ON public.equipment FOR SELECT USING (true);
CREATE POLICY "Anyone can create equipment" ON public.equipment FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update equipment" ON public.equipment FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete equipment" ON public.equipment FOR DELETE USING (true);

CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Anyone can create events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update events" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete events" ON public.events FOR DELETE USING (true);

CREATE POLICY "Anyone can view event_equipment" ON public.event_equipment FOR SELECT USING (true);
CREATE POLICY "Anyone can create event_equipment" ON public.event_equipment FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update event_equipment" ON public.event_equipment FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete event_equipment" ON public.event_equipment FOR DELETE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_event_equipment_updated_at
  BEFORE UPDATE ON public.event_equipment
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_clients_name ON public.clients(name);
CREATE INDEX idx_clients_cpf_cnpj ON public.clients(cpf_cnpj);
CREATE INDEX idx_equipment_code ON public.equipment(equipment_code);
CREATE INDEX idx_equipment_status ON public.equipment(status);
CREATE INDEX idx_events_date ON public.events(event_date);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_client_id ON public.events(client_id);
CREATE INDEX idx_event_equipment_event_id ON public.event_equipment(event_id);
CREATE INDEX idx_event_equipment_equipment_id ON public.event_equipment(equipment_id);