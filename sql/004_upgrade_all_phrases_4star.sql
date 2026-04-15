-- =====================================================
-- 004_upgrade_all_phrases_4star.sql
-- Comprehensive upgrade of ALL English phrases to
-- consistent 4-star hospitality standard
--
-- Fixes applied across all 4 modules:
--   - Corrupted apostrophes (''''  →  '')
--   - French calques (literal translations)
--   - Telegraphic / incomplete responses
--   - Missing politeness markers
--   - Grammar and tense consistency
--   - Misleading terminology
--   - Cross-module consistency
--   - Blunt phrasing ("I want" → "I would like")
--   - FR/EN translation mismatches
--
-- 103 phrases upgraded:
--   Reception:    28
--   Housekeeping:  16
--   Restaurant:    23
--   Security:      36
--
-- No changes to: id, action_id, phrase_fr, phase,
--                niveau, voice_type, audio_url
--
-- Idempotent — safe to re-run
-- Run in: Supabase Dashboard > SQL Editor
-- =====================================================

BEGIN;

-- =====================================================
-- RECEPTION MODULE — 28 fixes
-- =====================================================

-- -------------------------------------------------
-- REC §1: Corrupted apostrophes (19 phrases)
-- Bug: '''' in SQL source stores '' in DB instead of '
-- Fix: replace quadruple-quote with double-quote
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'I''d rather keep the booked room, thank you.'
WHERE id = 'REC_REC_CI_UPGRADE_0016';

UPDATE phrases SET phrase_en = 'Tonight''s rate is {amount} {currency}, excluding breakfast.'
WHERE id = 'REC_REC_CI_WALKIN_0008';

UPDATE phrases SET phrase_en = 'Thank you for your feedback, it''s very helpful.'
WHERE id = 'REC_REC_CO_FEEDBACK_0008';

UPDATE phrases SET phrase_en = 'I''m sorry to hear that. I will report this to management immediately.'
WHERE id = 'REC_REC_CO_FEEDBACK_0012';

UPDATE phrases SET phrase_en = 'I''m in a hurry. Could you speed this up?'
WHERE id = 'REC_REC_CO_INVOICE_0016';

UPDATE phrases SET phrase_en = 'I''m a loyal guest. Could you make an exception?'
WHERE id = 'REC_REC_CO_LATE_0015';

UPDATE phrases SET phrase_en = 'I have a late appointment, it''s important.'
WHERE id = 'REC_REC_CO_LATE_0016';

UPDATE phrases SET phrase_en = 'I''m sorry, the bar is currently closed, but it reopens at {time}.'
WHERE id = 'REC_REC_INFO_FACILITIES_0013';

UPDATE phrases SET phrase_en = 'I''m truly sorry to hear that.'
WHERE id = 'REC_REC_PROB_CLEAN_0006';

UPDATE phrases SET phrase_en = 'I''m sorry, your key card is not working.'
WHERE id = 'REC_REC_PROB_KEY_0006';

UPDATE phrases SET phrase_en = 'I''m locked out of my room.'
WHERE id = 'REC_REC_PROB_KEY_0011';

UPDATE phrases SET phrase_en = 'I don''t have my ID with me.'
WHERE id = 'REC_REC_PROB_KEY_0016';

UPDATE phrases SET phrase_en = 'I''m sorry to hear that.'
WHERE id = 'REC_REC_PROB_MISSING_0006';

UPDATE phrases SET phrase_en = 'It''s urgent, I need it today.'
WHERE id = 'REC_REC_PROB_MISSING_0016';

UPDATE phrases SET phrase_en = 'I''m sorry for the disturbance.'
WHERE id = 'REC_REC_PROB_NOISE_0006';

UPDATE phrases SET phrase_en = 'I''m very unhappy, this is unacceptable.'
WHERE id = 'REC_REC_PROB_NOISE_0016';

UPDATE phrases SET phrase_en = 'I''m sorry to hear that.'
WHERE id = 'REC_REC_SERV_MAINTENANCE_0006';

UPDATE phrases SET phrase_en = 'It''s urgent, I need a solution right away.'
WHERE id = 'REC_REC_SERV_MAINTENANCE_0015';

UPDATE phrases SET phrase_en = 'I have an early flight. I don''t want to miss it.'
WHERE id = 'REC_REC_SERV_WAKEUP_0015';

-- -------------------------------------------------
-- REC §2: Unnatural client greetings (4 phrases)
-- "Hello, please." / "Good X, please." are not
-- natural English — a greeting does not end with
-- a bare "please"
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Hi there.'
WHERE id = 'REC_REC_PROB_BILL_0004';

UPDATE phrases SET phrase_en = 'Hello.'
WHERE id = 'REC_REC_INFO_FACILITIES_0004';

UPDATE phrases SET phrase_en = 'Good afternoon.'
WHERE id = 'REC_REC_SERV_BOOKING_0004';

UPDATE phrases SET phrase_en = 'Good evening.'
WHERE id = 'REC_REC_SERV_WAKEUP_0004';

-- -------------------------------------------------
-- REC §3: Grammar fix (1 phrase)
-- "it happens" → present perfect for repeated event
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'This is the third time this has happened.'
WHERE id = 'REC_REC_PROB_KEY_0015';

-- -------------------------------------------------
-- REC §4: Telegraphic phrases (3 phrases)
-- Missing subject, object, or structure
-- -------------------------------------------------

-- "Hello, please help." needs direct object
UPDATE phrases SET phrase_en = 'Hello, please help me.'
WHERE id = 'REC_REC_CO_FEEDBACK_0004';

-- "Thanks, appreciate it." too casual for 4-star
UPDATE phrases SET phrase_en = 'Thank you, I appreciate it.'
WHERE id = 'REC_REC_CO_LUGGAGE_0005';

-- "Noted for {time}." needs subject for STAFF speech
UPDATE phrases SET phrase_en = 'That is noted for {time}.'
WHERE id = 'REC_REC_SERV_WAKEUP_0007';

-- -------------------------------------------------
-- REC §5: FR/EN translation mismatch (1 phrase)
-- FR says "prénom et nom" (first + last name)
-- EN only says "surname" — incomplete
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'May I have your first and last name, please?'
WHERE id = 'REC_REC_PROB_NOISE_0002';


-- =====================================================
-- HOUSEKEEPING MODULE — 16 fixes
-- =====================================================

-- -------------------------------------------------
-- HK §1: Misleading terminology (1 phrase)
-- "room service" = food delivery in hotel industry
-- This is a housekeeping context, not food delivery
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'I am here for housekeeping.'
WHERE id = 'HK_HK_ROOM_CLEAN_0002';

-- -------------------------------------------------
-- HK §2: Politeness — conditional form (1 phrase)
-- "suits you" → "would suit you" for polite offer
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'What time would suit you?'
WHERE id = 'HK_HK_ROOM_CLEAN_0004';

-- -------------------------------------------------
-- HK §3: Awkward staff "please" (1 phrase)
-- Staff describing own action should not end with
-- "please" — it sounds like asking permission
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'I will collect the used linen.'
WHERE id = 'HK_HK_LINEN_CHANGE_0007';

-- -------------------------------------------------
-- HK §4: Telegraphic client response (1 phrase)
-- Choppy period break → smoother flow
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Yes, please change them.'
WHERE id = 'HK_HK_LINEN_CHANGE_0009';

-- -------------------------------------------------
-- HK §5: French calque "I am listening" (1 phrase)
-- "Je vous écoute" → "I am listening" is a literal
-- translation; natural English: "how can I help you"
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Good morning, how can I help you? Which item is missing?'
WHERE id = 'HK_HK_LOST_FOUND_0001';

-- -------------------------------------------------
-- HK §6: Missing greeting (1 phrase)
-- FR has "Bonjour" but EN omits the greeting
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Good morning, I''m sorry about the issue.'
WHERE id = 'HK_HK_MAINT_REQUEST_0001';

-- -------------------------------------------------
-- HK §7: Awkward phrasing (1 phrase)
-- "Thank you for waiting, please." — trailing
-- "please" after "thank you" is unnatural
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Thank you for your patience.'
WHERE id = 'HK_HK_BATHROOM_ISSUE_0007';

-- -------------------------------------------------
-- HK §8: Missing "please" on client request (1 phrase)
-- Direct imperative without "please" is too abrupt
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Please leave towels at the door.'
WHERE id = 'HK_HK_DND_0011';

-- -------------------------------------------------
-- HK §9: Collocation fix (1 phrase)
-- "checking odors" → "checking for odors"
-- In English you "check FOR" the presence of something
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'I am checking for odors and the air conditioning.'
WHERE id = 'HK_HK_CHECKLIST_0004';

-- -------------------------------------------------
-- HK §10: Tense consistency (3 phrases)
-- Other HK staff actions use "I will" or present
-- continuous; these used bare present simple
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'I will complete the checklist and sign it.'
WHERE id = 'HK_HK_CHECKLIST_0005';

UPDATE phrases SET phrase_en = 'I will report any issue to maintenance.'
WHERE id = 'HK_HK_CHECKLIST_0006';

UPDATE phrases SET phrase_en = 'I will confirm with the front desk.'
WHERE id = 'HK_HK_CHECKLIST_0008';

-- -------------------------------------------------
-- HK §11: French calque "compliant" (1 phrase)
-- "conforme" → "compliant" is too formal/legal
-- Natural hotel English: "in order"
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'The room is in order and ready.'
WHERE id = 'HK_HK_CHECKLIST_0007';

-- -------------------------------------------------
-- HK §12: French calques "compliant" + "validate"
-- (1 phrase)
-- "conforme" → "compliant", "valider" → "validate"
-- Natural: "in order" + "confirm"
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Everything is in order. I will confirm with the supervisor.'
WHERE id = 'HK_HK_VIP_SETUP_0006';

-- -------------------------------------------------
-- HK §13: Missing article (1 phrase)
-- "adjust pillows" → "adjust the pillows"
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'I can adjust the pillows to the VIP preference.'
WHERE id = 'HK_HK_VIP_SETUP_0007';

-- -------------------------------------------------
-- HK §14: French calque "your trust" (1 phrase)
-- "votre confiance" → "your trust" is too literal
-- Natural: "choosing our service"
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Thank you for choosing our service.'
WHERE id = 'HK_HK_LAUNDRY_GUEST_0016';


-- =====================================================
-- RESTAURANT MODULE — 23 fixes
-- =====================================================

-- -------------------------------------------------
-- RST §1: Unnatural party-size phrasing (2 phrases)
-- "We are {time} people." is not how English speakers
-- express party size. Correct: "There are X of us."
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'There are {time} of us.'
WHERE id = 'RST_FB_GREET_GUEST_0008';

UPDATE phrases SET phrase_en = 'Yes, there are {time} of us.'
WHERE id = 'RST_FB_GROUP_RESERVATION_0006';

-- -------------------------------------------------
-- RST §2: Redundant word (1 phrase)
-- "best available option available" — double "available"
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Of course. I will check the best available option.'
WHERE id = 'RST_FB_GREET_GUEST_0011';

-- -------------------------------------------------
-- RST §3: French calque "I am taking note" (1 phrase)
-- "je note" → "I am taking note" is a literal
-- translation; natural English: "noted"
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Very well, noted.'
WHERE id = 'RST_FB_TAKE_ORDER_0005';

-- -------------------------------------------------
-- RST §4: Tense fix (1 phrase)
-- "You chose" → present perfect for order just placed
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'You have chosen {dish} and {dish}, is that correct?'
WHERE id = 'RST_FB_CONFIRM_ORDER_0002';

-- -------------------------------------------------
-- RST §5: Slashes → natural spoken English (1 phrase)
-- "rare / medium / well done" with slashes is written
-- style; spoken English uses commas + "or"
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Noted: rare, medium, or well done.'
WHERE id = 'RST_FB_CONFIRM_ORDER_0011';

-- -------------------------------------------------
-- RST §6: French calque "is it noted?" (1 phrase)
-- "c''est bien noté ?" → "is it noted?" is unnatural
-- Natural: "has that been noted?"
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'I want to make sure: gluten-free — has that been noted?'
WHERE id = 'RST_FB_CONFIRM_ORDER_0013';

-- -------------------------------------------------
-- RST §7: Singular → plural (1 phrase)
-- "any special request" → "requests" (asking about
-- multiple possible requests)
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Do you have any special requests?'
WHERE id = 'RST_FB_SPECIAL_REQUEST_0001';

-- -------------------------------------------------
-- RST §8: Telegraphic STAFF fragments (2 phrases)
-- Missing "Would you like" or "Would you prefer"
-- -------------------------------------------------

-- "A coffee or tea to finish?" needs subject + verb
UPDATE phrases SET phrase_en = 'Would you like a coffee or tea to finish?'
WHERE id = 'RST_FB_UPSELL_DESSERT_0003';

-- "Red, white, or rosé?" needs "Would you prefer"
UPDATE phrases SET phrase_en = 'Would you prefer red, white, or rosé?'
WHERE id = 'RST_FB_WINE_RECOMMENDATION_0002';

-- -------------------------------------------------
-- RST §9: Telegraphic CLIENT fragment (1 phrase)
-- "A dessert to share?" needs complete structure
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Could we have a dessert to share?'
WHERE id = 'RST_FB_UPSELL_DESSERT_0008';

-- -------------------------------------------------
-- RST §10: Blunt "I want" → polite form (1 phrase)
-- "I want it remade." → "I would like"
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'I would like it remade, please.'
WHERE id = 'RST_FB_COLD_FOOD_COMPLAINT_0007';

-- -------------------------------------------------
-- RST §11: Awkward phrasing (1 phrase)
-- "after verification" is a French business calque
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'I understand. I can speak with my manager about a suitable gesture.'
WHERE id = 'RST_FB_COLD_FOOD_COMPLAINT_0015';

-- -------------------------------------------------
-- RST §12: Politeness — "Will you pay" (1 phrase)
-- "Will you pay" is too direct for 4-star service
-- "Would you like to pay" is correct hospitality form
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Would you like to pay by card or cash?'
WHERE id = 'RST_FB_BILL_REQUEST_0003';

-- -------------------------------------------------
-- RST §13: Telegraphic CLIENT "In cash." (1 phrase)
-- Bare fragment needs "please"
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'In cash, please.'
WHERE id = 'RST_FB_BILL_REQUEST_0008';

-- -------------------------------------------------
-- RST §14: Missing "please" on client requests
-- (4 phrases)
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'One part on the company card, please.'
WHERE id = 'RST_FB_SPLIT_BILL_0007';

UPDATE phrases SET phrase_en = 'Yes, please suggest an alternative.'
WHERE id = 'RST_FB_DELAY_APOLOGY_0013';

UPDATE phrases SET phrase_en = 'Yes, please send me the review link.'
WHERE id = 'RST_FB_FEEDBACK_REQUEST_0015';

-- -------------------------------------------------
-- RST §15: Telegraphic CLIENT fragments (2 phrases)
-- Bare fragments need complete structure
-- -------------------------------------------------

-- "Drinks on bill 2." → needs article + "please"
UPDATE phrases SET phrase_en = 'The drinks on bill two, please.'
WHERE id = 'RST_FB_SPLIT_BILL_0012';

-- "Equal split, yes." → reorder + add "please"
UPDATE phrases SET phrase_en = 'Yes, an equal split, please.'
WHERE id = 'RST_FB_SPLIT_BILL_0016';

-- -------------------------------------------------
-- RST §16: French calque "It doesn''t work?" (1 phrase)
-- "Ça ne passe pas ?" about a declined card
-- Natural English: "It didn''t go through?"
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'It didn''t go through?'
WHERE id = 'RST_FB_PAYMENT_CARD_ISSUE_0006';

-- -------------------------------------------------
-- RST §17: French calque "organization" (1 phrase)
-- "organisation" → "organization" is a false friend
-- Natural hotel English: "arrangements"
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'I will confirm the arrangements with you.'
WHERE id = 'RST_FB_GROUP_RESERVATION_0005';

-- -------------------------------------------------
-- RST §18: Blunt "We want" → polite form (1 phrase)
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'We would like to pay together.'
WHERE id = 'RST_FB_GROUP_RESERVATION_0008';


-- =====================================================
-- SECURITY MODULE — 36 fixes
-- =====================================================

-- -------------------------------------------------
-- SEC §1: Internal jargon leak (1 phrase)
-- "STAFF procedure" exposes internal role label
-- into client-facing English
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'It is a standard procedure to protect guests and rooms.'
WHERE id = 'SEC_ID_VERIFICATION_03';

-- -------------------------------------------------
-- SEC §2: Consistency — "desk" → "front desk"
-- (2 phrases)
-- All other modules use "front desk"; Security used
-- "the desk" in two phrases
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'If you need anything during the night, you can call the front desk.'
WHERE id = 'SEC_ROOM_ESCORT_07';

UPDATE phrases SET phrase_en = 'We could not reach the guest. You may leave a message at the front desk.'
WHERE id = 'SEC_SUSPICIOUS_PERSON_15';

-- -------------------------------------------------
-- SEC §3: Bare "Yes." responses to polite offers
-- (3 phrases)
-- "May I...?" → "Yes." is too abrupt
-- Natural form: "Yes, please."
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Yes, please.'
WHERE id = 'SEC_ROOM_ESCORT_11';

UPDATE phrases SET phrase_en = 'Yes, please.'
WHERE id = 'SEC_THEFT_REPORT_12';

UPDATE phrases SET phrase_en = 'Yes, please.'
WHERE id = 'SEC_CROWD_CONTROL_07';

-- -------------------------------------------------
-- SEC §4: Bare "Okay." responses (10 phrases)
-- Single-word "Okay." is too terse for 4-star
-- context; adding appropriate completion
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Okay, thank you.'
WHERE id = 'SEC_ID_VERIFICATION_15';

UPDATE phrases SET phrase_en = 'Okay, thank you.'
WHERE id = 'SEC_SUSPICIOUS_PERSON_16';

UPDATE phrases SET phrase_en = 'Okay, thank you.'
WHERE id = 'SEC_FIRE_ALARM_15';

UPDATE phrases SET phrase_en = 'Okay, I understand.'
WHERE id = 'SEC_CROWD_CONTROL_13';

UPDATE phrases SET phrase_en = 'Okay, thank you.'
WHERE id = 'SEC_PARKING_ASSIST_11';

UPDATE phrases SET phrase_en = 'Okay, thank you.'
WHERE id = 'SEC_INCIDENT_REPORT_15';

UPDATE phrases SET phrase_en = 'Okay, thank you.'
WHERE id = 'SEC_CONFLICT_DEESCALATION_15';

UPDATE phrases SET phrase_en = 'Okay, understood.'
WHERE id = 'SEC_VENDOR_ACCESS_09';

UPDATE phrases SET phrase_en = 'Okay, I understand.'
WHERE id = 'SEC_CCTV_REQUEST_13';

UPDATE phrases SET phrase_en = 'Okay, thank you.'
WHERE id = 'SEC_NIGHT_PATROL_05';

-- -------------------------------------------------
-- SEC §5: Bare "Fine." / "Good." responses (4 phrases)
-- Too abrupt for 4-star hospitality context
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Alright, I understand.'
WHERE id = 'SEC_SUSPICIOUS_PERSON_13';

UPDATE phrases SET phrase_en = 'Alright, thank you.'
WHERE id = 'SEC_VENDOR_ACCESS_15';

UPDATE phrases SET phrase_en = 'Good, thank you.'
WHERE id = 'SEC_KEY_CONTROL_09';

UPDATE phrases SET phrase_en = 'Good, thank you.'
WHERE id = 'SEC_NIGHT_PATROL_14';

-- -------------------------------------------------
-- SEC §6: Casual "Thanks." (1 phrase)
-- Too informal for 4-star context
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Thank you.'
WHERE id = 'SEC_CROWD_CONTROL_16';

-- -------------------------------------------------
-- SEC §7: Telegraphic "Yes, here." (1 phrase)
-- Needs completion for natural English
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Yes, here it is.'
WHERE id = 'SEC_ID_VERIFICATION_11';

-- -------------------------------------------------
-- SEC §8: Telegraphic CLIENT fragments — data/info
-- (7 phrases)
-- Bare fragments lacking subject or verb
-- -------------------------------------------------

-- "Room {room}." → needs "It is"
UPDATE phrases SET phrase_en = 'It is room {room}.'
WHERE id = 'SEC_NOISE_COMPLAINT_04';

-- "{guest_name}, room {room}." → needs "My name is"
UPDATE phrases SET phrase_en = 'My name is {guest_name}, room {room}.'
WHERE id = 'SEC_THEFT_REPORT_04';

UPDATE phrases SET phrase_en = 'My name is {guest_name}, room {room}.'
WHERE id = 'SEC_KEY_CONTROL_04';

-- "This morning." → needs "It was"
UPDATE phrases SET phrase_en = 'It was this morning.'
WHERE id = 'SEC_THEFT_REPORT_06';

-- "Black, small, with a zipper." → needs "It is"
UPDATE phrases SET phrase_en = 'It is black, small, with a zipper.'
WHERE id = 'SEC_LOST_FOUND_04';

-- "Near the elevator." → needs "It was"
UPDATE phrases SET phrase_en = 'It was near the elevator.'
WHERE id = 'SEC_INCIDENT_REPORT_07';

-- "At {time}." → needs "It is"
UPDATE phrases SET phrase_en = 'It is at {time}.'
WHERE id = 'SEC_VIP_PROTECTION_13';

-- -------------------------------------------------
-- SEC §9: Telegraphic CLIENT fragments — actions
-- (3 phrases)
-- Missing subject, verb, or "please"
-- -------------------------------------------------

-- "Delivery for the kitchen." → needs "I have"
UPDATE phrases SET phrase_en = 'I have a delivery for the kitchen.'
WHERE id = 'SEC_VENDOR_ACCESS_01';

-- "Here." → needs completion
UPDATE phrases SET phrase_en = 'Here it is.'
WHERE id = 'SEC_VENDOR_ACCESS_03';

-- "Yes, a cutter." → needs "I have"
UPDATE phrases SET phrase_en = 'Yes, I have a cutter.'
WHERE id = 'SEC_VENDOR_ACCESS_12';

-- -------------------------------------------------
-- SEC §10: Missing "please" on instruction (1 phrase)
-- CLIENT giving instruction to security staff
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Please use the side entrance.'
WHERE id = 'SEC_VIP_PROTECTION_05';

-- -------------------------------------------------
-- SEC §11: Tense fix — in-progress action (1 phrase)
-- "We go to the assembly point" (present simple)
-- should be present continuous for ongoing action
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'We are heading to the assembly point outside, near the main gate.'
WHERE id = 'SEC_EVACUATION_06';

-- -------------------------------------------------
-- SEC §12: Telegraphic emergency response (1 phrase)
-- "Yes, but very weak." — missing subject
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'Yes, but only very weakly.'
WHERE id = 'SEC_EMERGENCY_MEDICAL_05';

-- -------------------------------------------------
-- SEC §13: Blunt "I want" → polite form (1 phrase)
-- -------------------------------------------------

UPDATE phrases SET phrase_en = 'I would like to see the CCTV footage.'
WHERE id = 'SEC_CCTV_REQUEST_01';


-- =====================================================
-- DONE. 103 phrases upgraded across 4 modules.
--
-- Summary by module:
--   Reception:    28 fixes
--     19 corrupted apostrophes
--      4 unnatural greetings
--      1 grammar (present perfect)
--      3 telegraphic phrases
--      1 FR/EN translation mismatch
--
--   Housekeeping:  16 fixes
--      1 misleading terminology
--      1 politeness (conditional)
--      1 awkward staff "please"
--      1 telegraphic client response
--      1 French calque "listening"
--      1 missing greeting
--      1 awkward phrasing
--      1 missing "please"
--      1 collocation
--      3 tense consistency
--      1 French calque "compliant"
--      1 French calques "compliant" + "validate"
--      1 missing article
--      1 French calque "trust"
--
--   Restaurant:    23 fixes
--      2 party-size phrasing
--      1 redundant word
--      1 French calque "taking note"
--      1 tense (present perfect)
--      1 slashes → commas
--      1 French calque "is it noted"
--      1 singular → plural
--      2 telegraphic STAFF fragments
--      1 telegraphic CLIENT fragment
--      1 blunt "I want"
--      1 awkward phrasing
--      1 politeness "Will you" → "Would you"
--      1 telegraphic "In cash."
--      4 missing "please"
--      2 telegraphic CLIENT fragments
--      1 French calque "doesn't work"
--      1 French calque "organization"
--      1 blunt "We want"
--
--   Security:      36 fixes
--      1 internal jargon leak
--      2 "desk" → "front desk"
--      3 bare "Yes." to offers
--     10 bare "Okay."
--      4 bare "Fine." / "Good."
--      1 casual "Thanks."
--      1 telegraphic "Yes, here."
--      7 telegraphic data fragments
--      3 telegraphic action fragments
--      1 missing "please"
--      1 tense (present continuous)
--      1 telegraphic emergency
--      1 blunt "I want"
-- =====================================================

COMMIT;
