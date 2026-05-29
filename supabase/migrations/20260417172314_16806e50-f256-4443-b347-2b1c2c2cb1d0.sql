CREATE TABLE public.giveaway_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  winner_name TEXT NOT NULL,
  winner_type TEXT NOT NULL CHECK (winner_type IN ('hero', 'merch')),
  role TEXT,
  rarity TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.giveaway_history ENABLE ROW LEVEL SECURITY;

-- Public giveaway board: anyone can read and append, no one can modify history.
CREATE POLICY "Anyone can view history"
  ON public.giveaway_history FOR SELECT
  USING (true);

CREATE POLICY "Anyone can append to history"
  ON public.giveaway_history FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_giveaway_history_created_at ON public.giveaway_history (created_at DESC);