begin;

-- Harmonisation Restaurant (4★ Afrique de l’Ouest) :
-- Objectif : 16 phrases EXACTEMENT par action (20 actions => 320 phrases).
-- Action : supprimer les phrases excédentaires (au-delà des 16 premières) pour chaque action Restaurant.

with ranked as (
  select
    p.id,
    p.action_id,
    row_number() over (
      partition by p.action_id
      order by p.created_at asc, p.id asc
    ) as rn
  from phrases p
  join actions_metier a on a.id = p.action_id
  where a.metier = 'Restaurant'
)
delete from phrases
where id in (
  select id from ranked where rn > 16
);

commit;
