-- Add reason for decline and update status enum concepts implicitly
-- Statuses: 'pending', 'approved', 'rejected', 'pending_decline'

ALTER TABLE public.orders 
ADD COLUMN decline_reason TEXT;
