begin;

-- Restaurant module cleanup: hide legacy actions that were created earlier (REST_*)
-- Goal: keep only the 20 canonical FB_* actions for the Restaurant 4★ module.
-- This avoids uneven phrase distribution when you run reports by metier='Restaurant'.

update actions_metier
set metier = 'Restaurant_OLD'
where metier = 'Restaurant'
  and id like 'REST\_%' escape '\';

-- Optional (recommended): also hide any other legacy prefixes you don't want in the Restaurant module
-- update actions_metier
-- set metier = 'Restaurant_OLD'
-- where metier = 'Restaurant' and id like 'RES\_%' escape '\';

commit;
