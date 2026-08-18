-- ========================================================================
-- RE:Art Electronics Repair Service — SUPABASE POSTGRESQL SCHEMA
-- ========================================================================
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE repair_order_status AS ENUM (
        'REQUESTED',
        'RECEIVED',
        'DIAGNOSTICS',
        'IN_PROGRESS',
        'TESTING',
        'READY',
        'COMPLETED',
        'CANCELLED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    telegram_handle TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. DEVICE BRANDS TABLE
CREATE TABLE IF NOT EXISTS public.device_brands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. DEVICE MODELS TABLE
CREATE TABLE IF NOT EXISTS public.device_models (
    id TEXT PRIMARY KEY,
    brand_id TEXT NOT NULL REFERENCES public.device_brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. REPAIR SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.repair_services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    estimated_time TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. REPAIR ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.repair_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    public_id TEXT NOT NULL UNIQUE,                            -- e.g. "REP-240182"
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_first_name TEXT NOT NULL,
    customer_last_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    preferred_contact TEXT NOT NULL DEFAULT 'Email',           -- 'Email' | 'Phone' | 'SMS' | 'Telegram'
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    repairs JSONB NOT NULL DEFAULT '[]'::jsonb,               -- array of repair names
    delivery_method TEXT NOT NULL,                             -- 'Service center' | 'Courier pickup' | 'Send by mail'
    appointment_slot TEXT,
    notes TEXT,
    price_agreed TEXT DEFAULT 'Price on request',
    status repair_order_status NOT NULL DEFAULT 'REQUESTED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. REPAIR STATUS TIMELINE LOGS
CREATE TABLE IF NOT EXISTS public.repair_status_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.repair_orders(id) ON DELETE CASCADE,
    status repair_order_status NOT NULL,
    note TEXT,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. AUTO-UPDATE updated_at TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_repair_orders_updated_at
    BEFORE UPDATE ON public.repair_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. INDEXES FOR HIGH-SPEED LOOKUPS
CREATE INDEX IF NOT EXISTS idx_repair_orders_public_id ON public.repair_orders(public_id);
CREATE INDEX IF NOT EXISTS idx_repair_orders_status ON public.repair_orders(status);
CREATE INDEX IF NOT EXISTS idx_repair_orders_created_at ON public.repair_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_status_logs_order_id ON public.repair_status_logs(order_id);

-- 11. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_status_logs ENABLE ROW LEVEL SECURITY;

-- Catalog (public read)
CREATE POLICY "Public can view brands" ON public.device_brands FOR SELECT USING (true);
CREATE POLICY "Public can view models" ON public.device_models FOR SELECT USING (true);
CREATE POLICY "Public can view services" ON public.repair_services FOR SELECT USING (true);

-- Orders: public insert + public read by public_id
CREATE POLICY "Public can insert repair orders" ON public.repair_orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view orders by public_id" ON public.repair_orders
    FOR SELECT USING (true);

-- Status logs: public read
CREATE POLICY "Public can view status logs" ON public.repair_status_logs
    FOR SELECT USING (true);

-- Customers: service_role only (server-side inserts)
CREATE POLICY "Service role can manage customers" ON public.customers
    FOR ALL USING (auth.role() = 'service_role');

-- Admins full access
CREATE POLICY "Admins full access on orders" ON public.repair_orders
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Admins full access on status logs" ON public.repair_status_logs
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 12. SEED DATA — catalog
INSERT INTO public.device_brands (id, name) VALUES
    ('apple', 'Apple'),
    ('samsung', 'Samsung'),
    ('google', 'Google'),
    ('xiaomi', 'Xiaomi'),
    ('huawei', 'Huawei'),
    ('other', 'Other')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.repair_services (id, name, description, estimated_time) VALUES
    ('screen',       'Display replacement',  'Premium OLED display, calibrated and tested.', '2 hours'),
    ('battery',      'Battery replacement',  'Restore all-day battery life and peak performance.', '60 minutes'),
    ('back-glass',   'Back glass repair',    'Precision glass replacement with a clean factory finish.', '3 hours'),
    ('charging',     'Charging port',        'Cleaning, diagnostics and port replacement if needed.', '2 hours'),
    ('camera',       'Camera repair',        'Resolve focus, image or lens problems.', '2 hours'),
    ('diagnostics',  'Diagnostics',          'A complete hardware and software assessment.', '1–2 days'),
    ('liquid',       'Liquid damage',        'Board-level inspection and corrosion treatment.', '3–5 days')
ON CONFLICT (id) DO NOTHING;
