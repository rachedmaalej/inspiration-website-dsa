# Strategie Digitale — Domaine Sidi Abdallah

## Le parcours client : ou intervient le digital ?

```
DECOUVRIR        EXPLORER         RESERVER         PREPARER         VIVRE            SE SOUVENIR
    |                |                |                |                |                |
 Comment         Voir l'offre,     Choisir,         Infos avant      Sur place :      Partager,
 ils nous        ressentir         payer,            arrivee          activites,       revenir,
 trouvent ?      l'ambiance        confirmer         (acces, planning) horaires, menu   recommander
    |                |                |                |                |                |
 Instagram       SITE WEB         RESERVATION       Email /          App / PWA ?      Avis Google
 Google          (vitrine)        (conversion)      WhatsApp         ou site mobile   Newsletter
 Bouche-a-oreille                                                    suffit ?         Programme membre
```

---

## Qui sont nos clients ? Qui reserve comment ?

| Segment                  | % revenu estime | Comment ils trouvent | Comment ils reservent      |
|--------------------------|:---------------:|----------------------|----------------------------|
| Touristes internationaux |      40%        | Google, Booking.com  | En ligne, carte bancaire   |
| Tunisiens (day pass)     |      25%        | Instagram, amis      | WhatsApp, telephone        |
| Membres Agrumia          |      20%        | Bouche-a-oreille     | App/portail membre         |
| Entreprises (events)     |      15%        | Reseau pro, LinkedIn | Email, devis sur mesure    |

**A discuter** : ces % sont-ils realistes ? Ca determine ce qu'on construit en premier.

---

## Construire ou Acheter ?

| Besoin                     | Acheter (SaaS)              | Construire (Rached)    | Recommandation           |
|----------------------------|-----------------------------|------------------------|--------------------------|
| Site vitrine               | Squarespace ~25$/mois       | Site sur mesure        | **Construire** — c'est notre image |
| Reservation chambres       | Lodgify, Beds24 ~30$/mois   | Moteur custom          | **Hybride** — OTAs + site propre |
| Reservation retraites      | Aucun SaaS adapte           | Systeme sur mesure     | **Construire** — offre unique |
| Reservation spa/fitness    | Fresha (gratuit), Planity   | Custom                 | **Acheter** — standard   |
| Reservation restaurant     | TheFork, Zenchef            | Custom                 | **Acheter** — standard   |
| Abonnements Agrumia        | Memberful ~25$/mois         | Portail membre         | **A decider** — voir complexite |
| CRM / emails               | Brevo gratuit               | Custom                 | **Acheter** — aucune raison de construire |
| Avis / reputation          | Google Business (gratuit)   | Custom                 | **Acheter**              |

---

## App, PWA ou rien ?

```
                        TELECHARGER                 USAGE              COUT
                        necessaire ?                frequent ?         dev + maintenance

App native              OUI                         Pour membres       $$$$
(iOS + Android)         (frein a l'adoption)        Agrumia seulement  Long a developper

PWA                     NON                         Tous clients       $$
(web app)               (lien ou QR code)           Sur place          Plus rapide

Site mobile             NON                         Tous clients       $
responsive              (deja inclus dans           Avant + pendant    Inclus dans le site
                         le site web)               sejour
```

**Regle** : une app se justifie quand il y a des **utilisateurs reguliers** qui font des **actions frequentes**.
- Membres Agrumia (visite mensuelle, reserver cours) → PWA utile
- Client hotel (visite unique) → site mobile suffit

---

## Phasage propose

```
PHASE 1 — Lancement                    PHASE 2 — 6 mois apres               PHASE 3 — Annee 1
(minimum viable)                        (croissance)                          (fidelisation)

[x] Site web FR + EN                    [ ] Portail membre Agrumia            [ ] PWA sur place
    vitrine + tarifs + galerie              inscription, planning,                menu, activites,
                                            paiement mensuel                      horaires, guide
[x] Reservation en ligne
    chambres + retraites                [ ] Integration OTAs                   [ ] Programme fidelite
    (systeme sur mesure)                    Booking.com, Airbnb                   parrainage, offres
                                            pour chambres classiques              retour
[x] Page Google Business
    avis, horaires, localisation        [ ] Newsletter / CRM                  [ ] Tableau de bord
                                            Brevo, sequences                      interne (staff)
[x] Instagram professionnel                 pre/post-sejour                       reservations, stats,
    contenu regulier                                                              planning
                                        [ ] Reservation spa (Fresha)
[x] WhatsApp Business                      et restaurant (Zenchef)
    pour reservations locales
```

---

## Le defi technique cle

Un client qui reserve une **Retraite Spa 3 nuits** fait simultanement :

```
  1 reservation = chambre (3 nuits)
                + hammam (1 seance)
                + 4 activites au choix
                + restaurant (3 diners)
                + transfert aeroport
                → 1 seul paiement
```

**Question** : construit-on un systeme unifie qui gere tout, ou chaque pilier a son propre outil ?

| Approche         | Avantage                              | Inconvenient                        |
|------------------|---------------------------------------|-------------------------------------|
| Systeme unifie   | Experience client fluide, 1 paiement  | Plus complexe a developper          |
| Outils separes   | Plus rapide, chaque outil specialise  | Client doit reserver a plusieurs endroits |

**Recommandation** : systeme unifie pour les retraites/forfaits (c'est le differenciateur), outils SaaS pour les reservations individuelles (spa seul, restaurant seul).

---

## 7 questions pour notre discussion

1. **Quel segment de clients est prioritaire au lancement ?**
2. **Quel % de reservations doit passer en ligne vs telephone/WhatsApp ?**
3. **Les retraites sont-elles le produit phare, ou les chambres classiques ?**
4. **Quel budget mensuel pour les outils SaaS ?**
5. **Qui maintient le contenu du site (textes, photos, nouveaux menus) ?**
6. **Les membres Agrumia ont-ils besoin d'un espace digital dedie des le debut ?**
7. **Faut-il accepter les paiements en ligne (carte) ou uniquement sur place ?**
