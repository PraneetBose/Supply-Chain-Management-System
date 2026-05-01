-- 1. Ensure the decline_reason column exists
ALTER TABLE IF EXISTS public.orders ADD COLUMN IF NOT EXISTS decline_reason TEXT;

-- 2. Update the status check constraint to allow 'pending_decline'
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check CHECK (status IN ('pending', 'approved', 'rejected', 'pending_decline'));

-- 3. Fix the critical Admin RLS bug: Admins must be able to UPDATE orders to actually approve/decline them
DROP POLICY IF EXISTS "Admins update all orders" ON public.orders;
CREATE POLICY "Admins update all orders" ON public.orders FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE id = auth.uid() AND role IN ('admin', 'supreme_admin'))
);
