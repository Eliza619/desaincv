-- =========================================================
-- DESAINCV.TOP
-- DATABASE ORDER
-- =========================================================

create extension if not exists "pgcrypto";


-- =========================================================
-- TABLE ORDERS
-- =========================================================

create table if not exists public.orders (

    id uuid primary key
        default gen_random_uuid(),

    order_code text not null unique,

    customer_name text not null,

    whatsapp text not null,

    email text,

    package_name text not null,

    template_name text,

    template_id text,

    template_image text,

    price numeric(12,2)
        not null default 0,

    note text,

    payment_proof text,

    payment_status text
        not null default 'Menunggu',

    order_status text
        not null default 'Baru',

    admin_note text,

    created_at timestamptz
        not null default now(),

    updated_at timestamptz
        not null default now(),

    constraint orders_payment_status_check
        check (
            payment_status in (
                'Menunggu',
                'Diterima',
                'Ditolak'
            )
        ),

    constraint orders_order_status_check
        check (
            order_status in (
                'Baru',
                'Diproses',
                'Selesai',
                'Dibatalkan'
            )
        )
);


-- =========================================================
-- INDEX
-- =========================================================

create index if not exists orders_created_at_idx
on public.orders(created_at desc);

create index if not exists orders_payment_status_idx
on public.orders(payment_status);

create index if not exists orders_order_status_idx
on public.orders(order_status);

create index if not exists orders_customer_name_idx
on public.orders(customer_name);

create index if not exists orders_order_code_idx
on public.orders(order_code);


-- =========================================================
-- AUTO UPDATE updated_at
-- =========================================================

create or replace function public.update_orders_updated_at()

returns trigger

language plpgsql

as $$

begin

    new.updated_at = now();

    return new;

end;

$$;


drop trigger if exists orders_updated_at
on public.orders;


create trigger orders_updated_at

before update
on public.orders

for each row

execute function public.update_orders_updated_at();


-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.orders
enable row level security;


-- =========================================================
-- HAPUS POLICY LAMA
-- =========================================================

drop policy if exists "Public can insert orders"
on public.orders;

drop policy if exists "Authenticated can view orders"
on public.orders;

drop policy if exists "Authenticated can update orders"
on public.orders;

drop policy if exists "Authenticated can delete orders"
on public.orders;

drop policy if exists "Public can insert orders authenticated"
on public.orders;


-- =========================================================
-- CUSTOMER
-- BOLEH MEMBUAT ORDER
-- =========================================================

create policy "Public can insert orders"

on public.orders

for insert

to anon, authenticated

with check (
    true
);


-- =========================================================
-- ADMIN
-- BOLEH MELIHAT ORDER
-- =========================================================

create policy "Authenticated can view orders"

on public.orders

for select

to authenticated

using (
    true
);


-- =========================================================
-- ADMIN
-- BOLEH UPDATE ORDER
-- =========================================================

create policy "Authenticated can update orders"

on public.orders

for update

to authenticated

using (
    true
)

with check (
    true
);


-- =========================================================
-- ADMIN
-- BOLEH HAPUS ORDER
-- =========================================================

create policy "Authenticated can delete orders"

on public.orders

for delete

to authenticated

using (
    true
);


-- =========================================================
-- SELESAI
-- =========================================================

select
    'orders database siap' as status;