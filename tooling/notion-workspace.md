# Notion Workspace — Domaine Sidi Abdallah

> **Setup:** Create a new Notion workspace (or page in existing workspace).
> Title: "Domaine Sidi Abdallah — Projet Digital"
> Share with: Elyssa (full access), Lilia (comment access)
>
> Create 4 top-level pages using the sections below.
> Paste each section directly into Notion — it handles markdown tables natively.

---

## Page 1 — 📋 Décisions

> **Purpose:** Every decision that affects the website gets logged here with its status.
> Elyssa and Lilia can see what's decided, what's pending, and who approved what.
> Rached refers to this before building anything.

---

### Comment utiliser cette page

| Zone | Usage |
|------|-------|
| ✅ Verrouillée | Décision prise, ne peut pas changer sans discussion |
| ⏳ En attente | Doit être tranchée avant la date indiquée |
| 🔄 En cours | Discussion ouverte |

---

### Décisions verrouillées

| # | Décision | Statut | Approuvé par | Date | Notes |
|---|----------|--------|--------------|------|-------|
| D-01 | Direction artistique : **"Terre d'Agrumes"** | ✅ Verrouillée | Rached | 28 fév 2026 | Palette + typographie confirmées |
| D-02 | Couleurs : Parchment #F7F0E3 · Grove #2C4035 · Terracotta #B5623A · Gold #C4A35A · Ink #1C1A17 | ✅ Verrouillée | Rached | 28 fév 2026 | Dans tailwind.config.ts |
| D-03 | Typographie : Cormorant Garamond (titres) + DM Sans (corps) | ✅ Verrouillée | Rached | 28 fév 2026 | Google Fonts, licences OK |
| D-04 | Domaine principal : domainesidiabdallah.com | ✅ Verrouillée | Rached | 28 fév 2026 | .tn en redirect 301 |
| D-05 | Réservation restaurant incluse en Phase 1 (lancement mai 2026) | ✅ Verrouillée | Rached | 28 fév 2026 | Paiement sur place uniquement |
| D-06 | Stack technique : Next.js 14 + TypeScript + Tailwind + Prisma + Supabase | ✅ Verrouillée | Rached | 28 fév 2026 | Hébergement Vercel (Paris) |
| D-07 | Géodétection : Vercel Edge Middleware → FR pour TN, EN pour international | ✅ Verrouillée | Rached | 28 fév 2026 | Cookie override disponible |
| D-08 | WhatsApp API : Twilio (onboarding 2–3 jours vs 2–4 semaines Meta) | ✅ Verrouillée | Rached | 28 fév 2026 | Demande à soumettre avant le 3 mars |
| D-09 | CMS : MDX dans le repo (Phase 1) → Sanity si Elyssa a besoin d'éditer seule | ✅ Verrouillée | Rached | 28 fév 2026 | Abstraction getContent() en place dès le départ |
| D-10 | Email transactionnel : Resend · Newsletter : Brevo | ✅ Verrouillée | Rached | 28 fév 2026 | Brevo gratuit jusqu'à 300 emails/jour |

---

### Décisions en attente — deadline 15 mars 2026

> Ces 8 questions doivent être tranchées avant le 7 avril (début du développement).
> La réunion avec Elyssa et Lilia sert à y répondre.

| # | Question | Enjeu | Options | Décision | Approuvé par | Date |
|---|----------|-------|---------|----------|--------------|------|
| Q-01 | **Ton & langue** — Le Domaine parle-t-il comme une maison ou comme un établissement ? | Conditionne la rédaction de tous les textes FR et EN (livraison fin mars) | A : La Maison ("Notre cuisine", "vos hôtes") · B : Le Domaine ("la propriété", "l'équipe") · C : La Terre parle ("l'orangeraie vous attend") | ⏳ | | |
| Q-02 | **Photographie** — Lance-t-on avec les photos de la grove, ou attend-on les intérieurs finis ? | Fenêtre néroli (floraison) : fév–mars. Manquer = attendre octobre 2026 | A : Grove uniquement (mars) · B : Attendre intérieurs finis (fin 2026, site = coming soon) · C : Grove + making-of rénovation | ⏳ | | |
| Q-03 | **Sous-marques** — Dar Saad et Agrumia : visibles en public ou noms internes seulement ? | Option B = 2–3 semaines de travail supplémentaires (système de design étendu) | A : DSA domine, sous-marques en subtitle · B : Co-marques à égalité avec leur propre style · C : Noms réservés à l'usage interne | ⏳ | | |
| Q-04 | **Navigation au lancement** — Comment présenter les piliers pas encore ouverts en mai ? | Détermine le nombre de pages à avoir prêtes le 16 mai (Option A = 4 pages, Option B = 2) | A : Pages complètes + badge "Bientôt" + liste d'attente · B : Navigation réduite aux piliers ouverts · C : Teasing progressif avec pré-inscription | ⏳ | | |
| Q-05 | **Typographie** — Chaleur ou rigueur dans l'usage de Cormorant Garamond ? | Conditionne les maquettes des composants clés (hero, cartes, nav) | A : Grands titres rapprochés, chaleureux (Kasbah Bab Ourika) · B : Titres fins et espacés, éditorial (Dar Ahlam) · C : Contraste dramatique très grande échelle (Susafa) | ⏳ | | |
| Q-06 | **Hero page d'accueil** — Photo fixe ou vidéo ? | Si vidéo au lancement (Option B) : captation + montage à planifier en mars | A : Photo fixe grove heure dorée · B : Vidéo boucle 15–20 secondes · C : Photo au lancement, vidéo ajoutée en sept–oct après récolte | ⏳ | | |
| Q-07 | **Prix affichés** — Transparence totale, sur demande, ou fourchettes ? | Conditionne l'architecture des pages réservation. "Sur demande" = pas de disponibilité temps réel pour les chambres | A : Prix affichés dès le lancement · B : Prix sur demande (WhatsApp/email) · C : "À partir de X TND" (fourchettes) | ⏳ | | |
| Q-08 | **Boutique D2C** — Le Domaine vendra-t-il ses produits agricoles en ligne ? | Si oui : réserver la nav + enregistrer darsaad.com & agrumia.com cette semaine | A : Oui, c'est la vision (planifier "La Boutique" dans le système de design) · B : Peut-être, pas maintenant · C : Non | ⏳ | | |

---

## Page 2 — 📦 Livrables

> **Purpose:** Tout ce qui doit être livré ou validé, par qui, et avant quand.
> Mise à jour après chaque réunion ou validation.

---

### Phase 0 — Infra & Décisions (1 mars – 6 avril 2026)

| Livrable | Responsable | Statut | Échéance | Notes |
|----------|-------------|--------|----------|-------|
| Enregistrement domainesidiabdallah.com | Rached | ⏳ | 1 mars | Namecheap |
| Enregistrement darsaad.com + agrumia.com | Rached | ⏳ | 1 mars | Anti-squatting |
| Création repo GitHub dsa-platform | Rached | ⏳ | 1 mars | |
| Création projet Vercel | Rached | ⏳ | 1 mars | Région cdg1 Paris |
| Création Supabase dev + prod | Rached | ⏳ | 1 mars | |
| Création compte Brevo + listes waitlist | Rached | ⏳ | 1 mars | Listes : FR, EN, par pilier |
| **Demande Twilio WhatsApp Business** | Rached | ⏳ | **3 mars** | Approbation 2–3 jours |
| Configuration Cloudflare + DNS | Rached | ⏳ | 5 mars | |
| Configuration Resend (email transactionnel) | Rached | ⏳ | 5 mars | |
| Google Business Profile | Rached | ⏳ | 10 mars | |
| **Réunion direction artistique — 8 décisions** | Elyssa + Lilia + Rached | ⏳ | **15 mars** | Voir page Décisions |
| Logos validés + tokens design confirmés | Designer + Elyssa/Lilia | ⏳ | 15 mars | Bloquant pour dev |
| Textes FR finaux approuvés | Elyssa + Lilia | ⏳ | 31 mars | Basés sur le ton choisi (Q-01) |
| Textes EN finaux approuvés | Elyssa + Lilia | ⏳ | 31 mars | |
| **Photos Phase 1 livrées** (propriété + orangeraie) | Photographe | ⏳ | **5 avril** | Si Q-02 Option A ou C |

---

### Phase 1 — Site Web + Réservation Restaurant (7 avril – 16 mai 2026)

| Livrable | Responsable | Statut | Semaine | Notes |
|----------|-------------|--------|---------|-------|
| Next.js + design tokens + déploiement Vercel | Rached | ⏳ | S1 (7–13 avr) | |
| Navigation + Footer (FR + EN) | Rached | ⏳ | S1 | |
| Homepage complète (Hero, Piliers, Histoire, Newsletter) | Rached | ⏳ | S2 (14–20 avr) | |
| Page Séjourner (Dar Saad) | Rached | ⏳ | S3 (21–27 avr) | |
| Page Bien-être (Agrumia) | Rached | ⏳ | S3 | |
| Page Retraites | Rached | ⏳ | S3 | |
| Page Notre Histoire | Rached | ⏳ | S3 | |
| Page Contact | Rached | ⏳ | S3 | |
| Backend réservation restaurant (API + DB) | Rached | ⏳ | S4 (28 avr – 4 mai) | |
| UI réservation restaurant (formulaire 3 étapes) | Rached | ⏳ | S5 (5–11 mai) | |
| Admin back-office (connexion, liste réservations, statuts) | Rached | ⏳ | S5 | |
| QA + Lighthouse + tests cross-device | Rached | ⏳ | S6 (12–16 mai) | Perf > 85, A11y > 90 |
| **Mise en ligne** 🚀 | Rached | ⏳ | **16 mai** | DNS cutover |
| **Validation Elyssa/Lilia avant mise en ligne** | Elyssa + Lilia | ⏳ | 14–15 mai | 48h pour retours finaux |

---

### Phase 1b — Réservation Bien-être (Juin–Sept 2026)

| Livrable | Statut | Déclencheur |
|----------|--------|-------------|
| Date d'ouverture Agrumia confirmée | ⏳ | Décision Elyssa |
| Catalogue services (praticiens, horaires, durées) | ⏳ | Après ouverture |
| Backend réservation wellness | ⏳ | ~90h |
| Interface réservation wellness | ⏳ | |
| Admin bien-être (grille praticiens × horaires) | ⏳ | |

---

### Phase 2 — Chambres + Paiements (Fin 2026)

| Livrable | Statut | Notes |
|----------|--------|-------|
| Date d'ouverture Dar Saad confirmée | ⏳ | |
| 6 fiches chambres (noms, descriptions, photos) | ⏳ | Noms = agrumes |
| Tarification par saison | ⏳ | |
| Intégration Stripe (intl) + Konnect (TN) | ⏳ | |
| Synchronisation iCal / OTA | ⏳ | |

---

## Page 3 — 📝 Contenu

> **Purpose:** Suivre l'état des textes et photos pour chaque page et langue.
> Elyssa et Lilia peuvent directement modifier ou commenter dans cette page.

---

### Textes du site

| Page | Statut FR | Statut EN | Notes |
|------|-----------|-----------|-------|
| Homepage (Hero + Histoire) | 🔄 En révision Lilia | ✅ Prêt | Attendre validation Q-01 (ton) |
| Séjourner / Dar Saad | 🔄 En révision Lilia | ✅ Prêt | Descriptions chambres à finaliser |
| Bien-être / Agrumia | 🔄 En révision Lilia | ✅ Prêt | Catalogue services à compléter |
| Restaurant | 🔄 En révision Lilia | ✅ Prêt | Menu saisonnier à ajouter |
| Retraites | 🔄 En révision Lilia | ✅ Prêt | |
| Notre Histoire | 🔄 En révision Lilia | ✅ Prêt | |
| Contact | ⏳ À faire | ⏳ À faire | Adresse, téléphone, WhatsApp |
| Mentions légales | ⏳ À faire | ⏳ À faire | |

> **Règle :** Tous les textes doivent être validés dans le **ton choisi (Q-01)** avant d'être intégrés.

---

### Photos

| Lot | Contenu | Statut | Deadline | Format requis |
|-----|---------|--------|----------|---------------|
| Lot 1 — La grove | Orangeraie heure dorée, feuillage, lumière | ⏳ À shooter | **Mars 2026** | JPEG, min 3000px large |
| Lot 1 — La propriété | Façade, jardins, espaces extérieurs | ⏳ À shooter | Mars 2026 | |
| Lot 2 — Making-of | Chantier rénovation (si Q-02 Option C) | ⏳ Conditionnel | Avr–Mai 2026 | Vertical + horizontal |
| Lot 3 — Intérieurs | Chambres, spa, restaurant finalisés | ⏳ En attente | Fin 2026 | |
| OG Images | 1 image par page pour partage réseaux | ⏳ À créer | Avant lancement | 1200×630px |
| Favicon / Logo | SVG + PNG 32px + PNG 180px | ⏳ Attend logos | 15 mars | |

---

### Prix (à confirmer par Elyssa/Lilia)

| Service | Prix TND | Prix EUR | Statut |
|---------|----------|----------|--------|
| Déjeuner (par personne) | TBD | TBD | ⏳ |
| Dîner (par personne) | TBD | TBD | ⏳ |
| Chambre (nuit, base 2) | TBD | TBD | ⏳ |
| Hammam | TBD | TBD | ⏳ |
| Massage (60 min) | TBD | TBD | ⏳ |
| Séjour bien-être (forfait) | TBD | TBD | ⏳ |

---

## Page 4 — 🔑 Comptes & Accès

> **Purpose:** Référence centralisée de tous les comptes créés pour le projet.
> Ne pas stocker les mots de passe ici — utiliser un gestionnaire (Bitwarden, 1Password).
> Cette page liste les URLs d'admin et qui a accès.

---

### Comptes infrastructure

| Service | URL Admin | Qui a accès | Plan | Notes |
|---------|-----------|-------------|------|-------|
| Vercel | vercel.com/team/dsa | Rached | Hobby → Pro si besoin | |
| Supabase (dev) | supabase.com | Rached | Free | DB de développement |
| Supabase (prod) | supabase.com | Rached | Pro si besoin | DB de production |
| Cloudflare | cloudflare.com | Rached | Free | DNS + DDoS |
| GitHub | github.com/[org]/dsa-platform | Rached | Free | Repo dev |
| Namecheap | namecheap.com | Rached | — | domainesidiabdallah.com |

---

### Comptes services

| Service | URL Admin | Qui a accès | Plan | Coût |
|---------|-----------|-------------|------|------|
| Brevo | brevo.com | Rached | Free (300 emails/jour) | 0 |
| Resend | resend.com | Rached | Free (3000/mois) | 0 |
| Twilio | twilio.com | Rached | Pay-per-use | ~$0.005/message |
| Umami Analytics | umami.is | Rached + Elyssa | Free (self-hosted ou cloud) | 0 |
| Vercel Analytics | vercel.com | Rached | Inclus | 0 |

---

### Comptes communication

| Service | Compte | Qui gère | Notes |
|---------|--------|----------|-------|
| WhatsApp Business | +216 XX XXX XXX | Elyssa / Lilia | Numéro du Domaine |
| Instagram | @domainesidiabdallah | Elyssa / Lilia | |
| Google Business | À créer | Rached | Lié à Maps |

---

*Dernière mise à jour : 28 février 2026 — Rached*
