-- Phase 1 Restructured: Customer ID (10-digit) & Admin Roles

-- ==========================================
-- TYPES & ROLES
-- ==========================================

CREATE TYPE platform_role AS ENUM ('customer', 'admin', 'supreme_admin');

-- Maps Auth Users to Roles
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role platform_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- CUSTOMERS (Client Onboarding Data)
-- ==========================================

-- Primary key is now the 10-digit Cust ID as requested
CREATE TABLE public.customers (
    cust_id VARCHAR(10) PRIMARY KEY,
    auth_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    phone VARCHAR NOT NULL,
    address TEXT NOT NULL,
    gst_number VARCHAR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(auth_id)
);

-- ==========================================
-- CATALOG & MODULES
-- ==========================================

CREATE TABLE public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    description TEXT,
    base_price DECIMAL NOT NULL DEFAULT 0.00
);

-- Customer Module Access (Admin toggles this)
CREATE TABLE public.customer_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cust_id VARCHAR(10) NOT NULL REFERENCES public.customers(cust_id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    granted_by UUID REFERENCES auth.users(id), -- Admin who gave access
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (cust_id, module_id)
);

-- Orders/Requests for Modules (Customer initiates)
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cust_id VARCHAR(10) NOT NULL REFERENCES public.customers(cust_id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    status VARCHAR NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- NOTIFICATIONS
-- ==========================================

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cust_id VARCHAR(10) NOT NULL REFERENCES public.customers(cust_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- RLS
-- ==========================================

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
