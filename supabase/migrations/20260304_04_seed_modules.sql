-- ==========================================
-- SEED INITIAL MODULES
-- ==========================================

INSERT INTO public.modules (name, slug, description, base_price) VALUES
('Inventory Management', 'inventory-management', 'Real-time stock tracking, barcode integration, and low-stock alerts across multiple storage locations.', 199.00),
('Procurement Management', 'procurement-management', 'Automate purchase orders, manage vendor relationships, and negotiate better rates by tracking spend.', 149.00),
('Warehouse Management', 'warehouse-management', 'Optimize inbound/outbound logistics, routing, and bin-level inventory tracking for your warehouse.', 299.00),
('Order Management', 'order-management', 'Streamline the entire lifecycle from order capture to fulfillment, shipping, and returns.', 249.00),
('Analytics', 'analytics', 'Powerful reports, predictive demand forecasting, and customizable dashboards for executive insights.', 399.00)
ON CONFLICT (slug) DO NOTHING;
