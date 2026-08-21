create or replace function place_order(reference uuid, p_user_id uuid, cart_items jsonb) 

returns numeric

language plpgsql

security definer set search_path= ''

as $$





$$;