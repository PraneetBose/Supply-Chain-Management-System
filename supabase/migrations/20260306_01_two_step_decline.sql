-- Add reason for decline and update status enum concepts implicitly
-- Statuses: 'pending', 'approved', 'rejected', 'pending_decline'

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS decline_reason TEXT;

ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders 
ADD CONSTRAINT orders_status_check CHECK (status IN ('pending', 'approved', 'rejected', 'pending_decline'));

-- Add UPDATE policy for admins to approve/decline orders
DROP POLICY IF EXISTS "Admins update all orders" ON public.orders;
CREATE POLICY "Admins update all orders" ON public.orders 
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE id = auth.uid() AND role IN ('admin', 'supreme_admin'))
);

-- Add ALL policy for supreme admins to manage modules (pricing, etc.)
DROP POLICY IF EXISTS "Supreme admins manage modules" ON public.modules;
CREATE POLICY "Supreme admins manage modules" ON public.modules 
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE id = auth.uid() AND role = 'supreme_admin')
);

