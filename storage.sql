-- =========================================================
-- STORAGE BUKTI TRANSFER — DESAINCV.TOP
-- =========================================================


-- =========================================================
-- BUAT BUCKET PRIVATE
-- =========================================================

insert into storage.buckets (
    id,
    name,
    public
)

values (
    'payment-proofs',
    'payment-proofs',
    false
)

on conflict (id)

do update set
    public = false;


-- =========================================================
-- HAPUS POLICY LAMA
-- =========================================================

drop policy if exists
"Public can upload payment proofs"
on storage.objects;

drop policy if exists
"Authenticated can view payment proofs"
on storage.objects;

drop policy if exists
"Authenticated can update payment proofs"
on storage.objects;

drop policy if exists
"Authenticated can delete payment proofs"
on storage.objects;


-- =========================================================
-- CUSTOMER BOLEH UPLOAD BUKTI
-- =========================================================

create policy
"Public can upload payment proofs"

on storage.objects

for insert

to anon

with check (

    bucket_id =
        'payment-proofs'

    and

    name like 'proofs/%'

);


-- =========================================================
-- ADMIN BOLEH MELIHAT BUKTI
-- =========================================================

create policy
"Authenticated can view payment proofs"

on storage.objects

for select

to authenticated

using (

    bucket_id =
        'payment-proofs'

);


-- =========================================================
-- ADMIN BOLEH UPDATE FILE
-- =========================================================

create policy
"Authenticated can update payment proofs"

on storage.objects

for update

to authenticated

using (

    bucket_id =
        'payment-proofs'

)

with check (

    bucket_id =
        'payment-proofs'

);


-- =========================================================
-- ADMIN BOLEH DELETE FILE
-- =========================================================

create policy
"Authenticated can delete payment proofs"

on storage.objects

for delete

to authenticated

using (

    bucket_id =
        'payment-proofs'

);