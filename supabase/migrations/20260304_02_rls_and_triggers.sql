-- ==========================================
-- TRIGGERS
-- ==========================================

-- Auto-assign role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_roles (id, role)
  VALUES (new.id, 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- RLS POLICIES
-- ==========================================

-- 1. Roles: Users can read their own role
CREATE POLICY "Users read own role" ON public.user_roles FOR SELECT USING (auth.uid() = id);

-- 2. Customers
CREATE POLICY "Customers read own data" ON public.customers FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY "Customers insert own data" ON public.customers FOR INSERT WITH CHECK (auth.uid() = auth_id);
-- Admins can read all customers
CREATE POLICY "Admins read all customers" ON public.customers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE id = auth.uid() AND role IN ('admin', 'supreme_admin'))
);

-- 3. Modules (Catalog)
CREATE POLICY "Everyone reads modules" ON public.modules FOR SELECT USING (auth.role() = 'authenticated');

-- 4. Customer Modules (Access Control)
-- Customers can see their own provisioned modules
CREATE POLICY "Customers read own modules" ON public.customer_modules FOR SELECT USING (
  cust_id IN (SELECT cust_id FROM public.customers WHERE auth_id = auth.uid())
);
-- Admins can manage all customer modules
CREATE POLICY "Admins manage all customer modules" ON public.customer_modules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE id = auth.uid() AND role IN ('admin', 'supreme_admin'))
);

-- 5. Orders (Module checkout requests)
CREATE POLICY "Customers manage own orders" ON public.orders FOR ALL USING (
  cust_id IN (SELECT cust_id FROM public.customers WHERE auth_id = auth.uid())
);
CREATE POLICY "Admins read all orders" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE id = auth.uid() AND role IN ('admin', 'supreme_admin'))
);

-- 6. Notifications
CREATE POLICY "Customers read own notifications" ON public.notifications FOR SELECT USING (
  cust_id IN (SELECT cust_id FROM public.customers WHERE auth_id = auth.uid())
);
CREATE POLICY "Admins read and create notifications" ON public.notifications FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE id = auth.uid() AND role IN ('admin', 'supreme_admin'))
);
