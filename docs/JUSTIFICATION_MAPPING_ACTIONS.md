# Justification du mapping actions → compétences
## Hotel English Pro — 80 actions × 2–4 compétences

Pour chaque action, une ligne explique pourquoi ces compétences ont été choisies en lien avec la situation métier réelle.  
Format : **ID** | Compétences (poids) | Justification métier

---

## RÉCEPTION (20 actions — préfixe REC_)

| Action ID | Compétences liées | Justification |
|-----------|---|---|
| `REC_CI_STANDARD` | accueillir_client (3), verifier_information (2), conclure_interaction (2) | Le check-in commence par un accueil formel, passe par la vérification de la réservation et de la pièce d'identité, et se termine par la remise de la clé avec confirmation. |
| `REC_CI_ADMIN` | verifier_information (3), donner_information (2) | Les formalités administratives tournent entièrement autour de la vérification (pièce d'identité, carte de crédit, préautorisation) et de l'explication des procédures au client. |
| `REC_CI_EARLY` | gerer_situation_difficile (3), proposer_solution (3), dire_non_professionnellement (2) | Arrivée avant l'heure = chambre non prête : double enjeu de gérer la déception du client et de lui proposer une alternative concrète (bagagerie, lobby, restaurant), tout en refusant poliment d'accéder à une chambre non prête. |
| `REC_CI_WALKIN` | comprendre_demande (3), donner_information (2), proposer_solution (2) | Le client sans réservation exprime un besoin : l'agent doit comprendre sa demande (durée, type de chambre), informer sur la disponibilité réelle, et proposer une solution ou une alternative. |
| `REC_CI_UPGRADE` | proposer_solution (3), utiliser_vocabulaire_metier (2) | Le surclassement est une démarche commerciale : l'agent propose une option supérieure et doit utiliser le vocabulaire hôtelier adéquat (suite, vue mer, upgrade, tarif différentiel). |
| `REC_INFO_FACILITIES` | donner_information (3), utiliser_vocabulaire_metier (2) | Répondre aux questions sur les services (horaires, spa, restaurant, piscine) = donner une information claire avec le vocabulaire hôtelier approprié. |
| `REC_INFO_DIRECTIONS` | orienter_client (3), donner_information (2) | Indiquer des directions vers l'aéroport, un restaurant ou un point de repère = compétence d'orientation avec information pratique (distances, transports). |
| `REC_SERV_BOOKING` | comprendre_demande (3), reformuler_confirmer (2), gerer_appel (2) | Réserver un restaurant ou une activité pour le client implique de comprendre ses besoins précis, de confirmer les détails, et souvent de passer un appel téléphonique externe pour valider. |
| `REC_SERV_WAKEUP` | comprendre_demande (3), reformuler_confirmer (2), gerer_appel (3)* | Le réveil téléphonique consiste à comprendre l'heure souhaitée, confirmer pour éviter l'erreur, et gérer l'appel entrant/sortant — c'est littéralement un échange téléphonique. *poids 3 ajouté via patch 006b. |
| `REC_SERV_MAINTENANCE` | comprendre_demande (3), proposer_solution (2) | Recevoir un signalement technique = d'abord bien comprendre la nature du problème (climatisation, WC, TV), puis proposer un délai d'intervention ou un geste commercial si nécessaire. |
| `REC_PROB_NOISE` | gerer_reclamation (3), proposer_solution (3), maintenir_echange_fluide (2) | Plainte bruit nocturne = double enjeu : gérer l'émotion du client et proposer une action concrète (contact sécurité, changement de chambre), tout en maintenant un ton calme et professionnel. |
| `REC_PROB_CLEAN` | gerer_reclamation (3), proposer_solution (3) | Même structure que bruit : accueillir la plainte sans minimiser, puis proposer une solution immédiate (envoi Housekeeping, changement de chambre). |
| `REC_PROB_BILL` | gerer_reclamation (3), verifier_information (2), dire_non_professionnellement (2) | Contestation de facture = gérer l'insatisfaction, vérifier les charges avant toute décision, et si la charge est correcte, refuser professionnellement la demande de remboursement. |
| `REC_PROB_KEY` | verifier_information (3), dire_non_professionnellement (2) | Clé démagnétisée = sécurité prioritaire : vérifier l'identité avant tout accès. Si le client ne peut pas prouver son identité, refuser clairement mais respectueusement. |
| `REC_PROB_MISSING` | gerer_reclamation (3), gerer_situation_difficile (2) | Perte ou vol d'objet = situation émotionnellement chargée : accueillir la détresse du client, ne pas minimiser, documenter et orienter vers la procédure adéquate. |
| `REC_CO_STANDARD` | conclure_interaction (3), verifier_information (2) | Check-out = clôture de l'expérience client : vérifier la facture, recueillir les clés, confirmer le mode de paiement, et conclure avec des formules de politesse et de bons vœux. |
| `REC_CO_INVOICE` | donner_information (3), reformuler_confirmer (2), verifier_information (2) | Facture complexe = expliquer chaque poste clairement, reformuler pour s'assurer de la compréhension du client, et vérifier avant toute modification. |
| `REC_CO_LATE` | dire_non_professionnellement (3), proposer_solution (2) | Late check-out non disponible = refuser clairement la demande tout en proposant une alternative (bagagerie, prolongation payante si possible). |
| `REC_CO_LUGGAGE` | repondre_demande (3), conclure_interaction (2) | Service bagagerie = action courte et simple : répondre à la demande de stockage et conclure proprement en remettant le ticket de bagagerie. |
| `REC_CO_FEEDBACK` | conclure_interaction (3), comprendre_demande (2) | Recueillir l'avis du client = clôturer l'expérience de manière active, écouter le retour (positif ou négatif) et remercier sincèrement. |

---

## HOUSEKEEPING (20 actions — préfixe HK_)

| Action ID | Compétences liées | Justification |
|-----------|---|---|
| `HK_ROOM_CLEAN` | utiliser_vocabulaire_metier (2), repondre_demande (2) | Action principalement opérationnelle : si le client est présent, la gouvernante doit répondre à une demande simple et utiliser le vocabulaire des équipements de chambre. |
| `HK_TURNDOWN` | accueillir_client (2), conclure_interaction (2) | Service couverture = interaction brève mais soignée : accueillir le client discrètement, effectuer le service, et conclure avec une formule de bonne nuit. |
| `HK_LINEN_CHANGE` | comprendre_demande (3), repondre_demande (2) | Changement de linge = comprendre la demande spécifique (serviettes, draps, couvertures) et y répondre immédiatement ou en donnant un délai clair. |
| `HK_AMENITIES` | repondre_demande (3), utiliser_vocabulaire_metier (2) | Réassort de produits de salle de bain = répondre directement à la demande en utilisant le vocabulaire exact des amenities (shampooing, savon, mouchoirs, gel douche). |
| `HK_MINIBAR_CHECK` | verifier_information (3), utiliser_vocabulaire_metier (2) | Contrôle minibar = inventaire rigoureux des consommés vs stock ; vocabulaire précis des produits minibar indispensable pour le signalement. |
| `HK_DND` | dire_non_professionnellement (3), maintenir_echange_fluide (2) | Pancarte DND = ne pas entrer et replanifier ; si le client questionne, expliquer calmement la procédure et maintenir un échange rassurant. |
| `HK_LATE_SERVICE` | repondre_demande (3), gerer_situation_difficile (2) | Demande après 20h = répondre à la demande urgente tout en gérant l'attente et les contraintes opérationnelles nocturnes sans créer de frustration. |
| `HK_LOST_FOUND` | verifier_information (3), donner_information (2) | Objet trouvé = vérifier la propriété avant toute restitution et informer le client de la procédure Lost & Found et du délai de conservation. |
| `HK_DAMAGE_REPORT` | donner_information (3), utiliser_vocabulaire_metier (2) | Signalement d'un dégât = décrire précisément et factuellemnt (nature, localisation, gravité) avec le vocabulaire technique approprié pour le rapport de maintenance. |
| `HK_MAINT_REQUEST` | comprendre_demande (3), proposer_solution (2), gerer_appel (1)* | Urgence technique = comprendre la nature exacte du problème, proposer une première mesure de sécurisation, et escalader par téléphone. *gerer_appel ajouté via patch 006b. |
| `HK_STAIN_COMPLAINT` | gerer_reclamation (3), proposer_solution (2) | Plainte tache = accueillir la réclamation sans minimiser, proposer un remplacement immédiat et un suivi qualité. |
| `HK_ODOR_SMELL` | gerer_reclamation (3), proposer_solution (3) | Plainte odeur = double enjeu : gérer l'insatisfaction et proposer une solution radicale (désodorisation et/ou changement de chambre via la réception). |
| `HK_BATHROOM_ISSUE` | gerer_reclamation (3), utiliser_vocabulaire_metier (2) | Problème salle de bain = gérer la plainte et décrire le problème avec précision (drainage, joint, robinetterie) pour le suivi technique. |
| `HK_PUBLIC_AREAS` | utiliser_vocabulaire_metier (2) | Action interne sans interaction client directe : vocabulaire des zones communes (lobby, couloir, ascenseur) suffisant pour les consignes et rapports. |
| `HK_LAUNDRY_GUEST` | comprendre_demande (3), reformuler_confirmer (2) | Blanchisserie express = comprendre les instructions (articles, délai souhaité, mode de lavage) et les reformuler pour éviter toute erreur coûteuse. |
| `HK_EXTRA_BED` | repondre_demande (3), utiliser_vocabulaire_metier (2) | Lit supplémentaire = répondre à la demande et utiliser le vocabulaire hôtelier (rollaway bed, cot, baby crib) pour confirmer le type exact installé. |
| `HK_BABY_COT` | repondre_demande (3), utiliser_vocabulaire_metier (2) | Même structure que lit supplémentaire : répondre et nommer correctement l'équipement installé avec ses accessoires. |
| `HK_VIP_SETUP` | utiliser_vocabulaire_metier (3), conclure_interaction (2) | Préparation VIP = vocabulaire premium (amenity letter, turndown gift, complimentary fruit) et clôture par un contrôle qualité avant l'arrivée. |
| `HK_SUPPLIES` | comprendre_demande (3), repondre_demande (2) | Consommables (eau, café, papier) = comprendre la demande spécifique et y répondre avec un délai de livraison précis. |
| `HK_CHECKLIST` | verifier_information (3), utiliser_vocabulaire_metier (2) | Contrôle qualité = vérification systématique de chaque point de la checklist ; vocabulaire des équipements et standards nécessaire pour un rapport précis. |

---

## RESTAURANT (20 actions — préfixe FB_)

| Action ID | Compétences liées | Justification |
|-----------|---|---|
| `FB_GREET_GUEST` | accueillir_client (3), maintenir_echange_fluide (2) | Accueil restaurant = première impression : formule d'accueil professionnelle et ton chaleureux maintenu depuis l'entrée jusqu'à l'installation. |
| `FB_SEATING_GUEST` | orienter_client (3), accueillir_client (2) | Placement à table = guider physiquement le client tout en maintenant un accueil attentionné (vérification de la réservation, préférence de placement). |
| `FB_PRESENT_MENU` | donner_information (3), utiliser_vocabulaire_metier (2) | Présenter le menu = donner des informations précises sur les plats, les formules et les spécialités du jour avec le vocabulaire culinaire approprié. |
| `FB_TAKE_ORDER` | comprendre_demande (3), reformuler_confirmer (3) | Prise de commande = double enjeu critique : bien comprendre chaque choix et le reformuler immédiatement pour éviter les erreurs en cuisine. |
| `FB_CONFIRM_ORDER` | reformuler_confirmer (3), verifier_information (2) | Confirmation avant envoi en cuisine = dernière vérification de la commande complète, reformulée dans l'ordre, avant transmission. |
| `FB_SPECIAL_REQUEST` | comprendre_demande (3), reformuler_confirmer (2) | Substitution ou modification = comprendre précisément ce que le client souhaite changer et reformuler pour valider avant transmission à la cuisine. |
| `FB_ALLERGY_CHECK` | verifier_information (3), donner_information (2) | Allergie = enjeu de sécurité alimentaire : vérifier les allergènes dans le plat demandé et informer clairement le client sur les risques de contamination croisée. |
| `FB_UPSELL_DRINKS` | proposer_solution (3), utiliser_vocabulaire_metier (2) | Proposition boissons = démarche de vente active avec vocabulaire adapté (apéritif, digestif, accord mets-vins, pression, sélection du jour). |
| `FB_UPSELL_DESSERT` | proposer_solution (3), utiliser_vocabulaire_metier (2) | Même structure que boissons : proposer le dessert avec un vocabulaire culinaire précis qui donne envie (fondant, crémeux, de saison, fait maison). |
| `FB_WINE_RECOMMENDATION` | donner_information (3), utiliser_vocabulaire_metier (3) | Recommandation vin = double compétence à égalité : expliquer l'accord mets-vins avec un vocabulaire spécialisé (cépage, tanins, arômes, appellation). |
| `FB_DELAY_APOLOGY` | gerer_reclamation (3), donner_information (2) | Retard de service = accueillir l'impatience du client et lui donner une information précise sur le délai restant, sans promettre ce qu'on ne peut pas tenir. |
| `FB_WRONG_ORDER` | gerer_reclamation (3), proposer_solution (3) | Commande incorrecte = double enjeu : accueillir l'erreur sans se défausser et proposer immédiatement la correction en priorité cuisine. |
| `FB_COLD_FOOD_COMPLAINT` | gerer_reclamation (3), proposer_solution (2) | Plat froid = gérer la plainte qualité et proposer le choix au client : remplacement complet ou remise en température rapide. |
| `FB_BILL_REQUEST` | repondre_demande (3), utiliser_vocabulaire_metier (2) | Demande d'addition = répondre simplement et rapidement avec le vocabulaire du paiement (bill, receipt, tip, split, card machine). |
| `FB_SPLIT_BILL` | comprendre_demande (3), reformuler_confirmer (2) | Addition séparée = comprendre la répartition souhaitée (par personne, par plat, par table) et la reformuler avant de procéder pour éviter les litiges. |
| `FB_PAYMENT_CARD_ISSUE` | gerer_situation_difficile (3), proposer_solution (2) | Carte refusée = situation délicate à gérer avec discrétion pour ne pas humilier le client ; proposer des alternatives (autre carte, espèces, charge sur la chambre). |
| `FB_GROUP_RESERVATION` | comprendre_demande (3), reformuler_confirmer (2) | Réservation groupe = nombreuses contraintes à comprendre et à valider (nombre, allergies, placement, menu fixe ou carte, heure), toutes à reformuler avant confirmation. |
| `FB_VIP_TABLE` | accueillir_client (3), utiliser_vocabulaire_metier (2) | Table VIP = niveau d'accueil supérieur avec attention personnalisée et vocabulaire de service haut de gamme (sir/madam, amuse-bouche, chef's compliment). |
| `FB_CHILD_MENU` | repondre_demande (3), utiliser_vocabulaire_metier (2) | Menu enfant = répondre à la demande parentale et utiliser le vocabulaire adapté (high chair, children's menu, half portion, allergens). |
| `FB_FEEDBACK_REQUEST` | conclure_interaction (3), comprendre_demande (2) | Recueillir l'avis = clôturer l'expérience gastronomique en invitant sincèrement le client à s'exprimer et en écoutant son retour. |

---

## SÉCURITÉ (20 actions — préfixe SEC_)

| Action ID | Compétences liées | Justification |
|-----------|---|---|
| `SEC_ACCESS_CONTROL` | dire_non_professionnellement (3), verifier_information (2) | Contrôle d'accès = refuser l'entrée à une personne non autorisée tout en vérifiant son identité et en restant courtois et ferme. |
| `SEC_ID_VERIFICATION` | verifier_information (3), donner_information (2) | Vérification d'identité = contrôler le document présenté et expliquer pourquoi cette vérification est obligatoire (sécurité, procédure hôtel). |
| `SEC_ROOM_ESCORT` | orienter_client (3), maintenir_echange_fluide (2) | Escorter un client = l'orienter vers sa chambre ou un lieu sûr avec un discours rassurant et discret, adapté à un contexte de sécurité. |
| `SEC_NOISE_COMPLAINT` | gerer_situation_difficile (3), dire_non_professionnellement (3) | Intervention bruit nocturne = double enjeu : désamorcer la tension des personnes bruyantes et faire respecter la règle fermement sans aggraver le conflit. |
| `SEC_SUSPICIOUS_PERSON` | gerer_situation_difficile (3), maintenir_echange_fluide (2) | Personne suspecte = approcher et questionner avec tact sans accuser directement, maintenir un échange neutre pour évaluer la situation. |
| `SEC_THEFT_REPORT` | comprendre_demande (3), donner_information (2) | Déclaration de vol = écouter attentivement les faits rapportés par la victime et lui expliquer la procédure (rapport, CCTV, police) de manière claire. |
| `SEC_LOST_FOUND` | verifier_information (3), donner_information (2) | Objets trouvés = vérifier que la personne qui réclame est bien le propriétaire légitime, puis informer sur la procédure de restitution ou de conservation. |
| `SEC_EMERGENCY_MEDICAL` | gerer_situation_difficile (3), maintenir_echange_fluide (3), gerer_appel (2)* | Urgence médicale = gérer l'urgence en gardant son calme, maintenir la communication avec le blessé/entourage, et passer l'appel aux secours de façon structurée. *gerer_appel ajouté via patch 006b. |
| `SEC_FIRE_ALARM` | orienter_client (3), maintenir_echange_fluide (2) | Alarme incendie = guider les clients vers les sorties de secours en maintenant un discours calme et directif pour éviter la panique. |
| `SEC_EVACUATION` | orienter_client (3), gerer_situation_difficile (2) | Évacuation = orienter physiquement et vocalement vers le point de rassemblement, avec une attention particulière aux personnes vulnérables. |
| `SEC_CROWD_CONTROL` | gerer_situation_difficile (3), dire_non_professionnellement (2) | Gestion de foule = gérer la pression collective et poser des limites claires (files, zones, règles) sans créer d'escalade. |
| `SEC_PARKING_ASSIST` | orienter_client (3), repondre_demande (2) | Assistance parking = orienter le véhicule et le conducteur, répondre aux demandes de places ou d'informations sur le stationnement. |
| `SEC_KEY_CONTROL` | verifier_information (3), dire_non_professionnellement (2) | Contrôle des clés = vérifier l'habilitation avant toute remise de clé ou de carte ; refuser si les conditions ne sont pas remplies. |
| `SEC_INCIDENT_REPORT` | donner_information (3), utiliser_vocabulaire_metier (2) | Rapport d'incident = formuler les faits clairement et objectivement avec le vocabulaire de sécurité (faits, heure, témoins, mesures prises). |
| `SEC_CONFLICT_DEESCALATION` | gerer_situation_difficile (3), maintenir_echange_fluide (2), dire_non_professionnellement (2) | Désescalade = triple compétence : gérer la tension, maintenir un échange calme, et poser des limites sans provoquer. |
| `SEC_VIP_PROTECTION` | dire_non_professionnellement (3), utiliser_vocabulaire_metier (2) | Protection VIP = refuser avec fermeté et discrétion les demandes extérieures non autorisées, avec le vocabulaire protocolaire approprié. |
| `SEC_VENDOR_ACCESS` | verifier_information (3), dire_non_professionnellement (2) | Accès fournisseurs = vérifier les accréditations et les zones autorisées ; refuser si les documents sont manquants ou périmés. |
| `SEC_CCTV_REQUEST` | dire_non_professionnellement (3), donner_information (2) | Demande CCTV = refuser l'accès aux images sans autorisation de la direction et expliquer la procédure légale applicable. |
| `SEC_CHILD_SAFETY` | gerer_situation_difficile (3), maintenir_echange_fluide (2) | Enfant perdu = gérer l'urgence émotionnelle (rassurer l'enfant et les adultes) tout en maintenant un échange calme pour recueillir les informations. |
| `SEC_NIGHT_PATROL` | utiliser_vocabulaire_metier (2), maintenir_echange_fluide (2) | Ronde de nuit = action principalement interne ; si un client est rencontré, vocabulaire professionnel et ton discret et rassurant. |

---

*Document généré le 2026-04-08 — Hotel English Pro v4*
