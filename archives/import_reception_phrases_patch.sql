begin;

insert into phrases (id, action_id, phrase_fr, phrase_en, phase, niveau, voice_type, audio_url) values
('REC_REC_PROB_BILL_0014', 'REC_PROB_BILL',
 'En geste commercial, je peux retirer provisoirement les frais de minibar en attente de vérification, dans la limite de {amount} {currency} selon la procédure.',
 'As a gesture of goodwill, I can temporarily remove the minibar charges pending verification, up to {amount} {currency} as per procedure.',
 'Paiement', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  phrase_fr = excluded.phrase_fr,
  phrase_en = excluded.phrase_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

commit;
