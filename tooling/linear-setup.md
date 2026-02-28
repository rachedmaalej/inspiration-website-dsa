# Linear Setup — Domaine Sidi Abdallah

> **Linear** est ton outil de suivi de tâches de développement.
> Elyssa et Lilia n'ont pas accès à Linear — elles suivent via Notion.
> Linear est ton espace de travail personnel pour les phases de dev.

---

## 1. Création du workspace

1. Créer un compte sur linear.app
2. Créer un workspace : **"DSA Platform"**
3. Créer une équipe : **"dsa"** (identifier: `dsa`)
4. Connecter GitHub : Settings → Integrations → GitHub → repo `dsa-platform`

---

## 2. Labels

Créer ces labels (couleurs suggérées) :

| Label | Couleur | Usage |
|-------|---------|-------|
| `frontend` | Bleu | Composants React, pages, styles |
| `backend` | Violet | API routes, logique serveur |
| `database` | Orange | Prisma, migrations, seeds |
| `infra` | Gris | Vercel, Supabase, DNS, CI |
| `content` | Vert | MDX, textes, traductions, photos |
| `design` | Rose | Tokens, maquettes, assets |
| `admin` | Jaune | Back-office, authentification |
| `blocked` | Rouge | Attend une réponse ou livraison externe |

---

## 3. Projects (Cycles)

Créer ces projets dans l'ordre :

| Project | Timeline | Heures |
|---------|----------|--------|
| **Phase 0 — Infra & Décisions** | 1 mars – 6 avr 2026 | ~10h |
| **Phase 1 — Site Web + Restaurant** | 7 avr – 16 mai 2026 | ~230h |
| **Phase 1b — Wellness** | Juin–Sept 2026 | ~90h |
| **Phase 2 — Chambres + Paiements** | Fin 2026 | ~200h |
| **Phase 3 — Retraites + Dashboard** | 2027+ | ~200h |

---

## 4. Issues — Phase 0 (Infra & Décisions)

> Copier-coller chaque bloc comme une nouvelle issue dans Linear.
> Project : **Phase 0 — Infra & Décisions**
> Assigné à : Rached (toi)

---

### INF-01 · Enregistrer les domaines
**Labels:** `infra`
**Priority:** Urgent
**Due:** 1 mars 2026
**Description:**
```
- [ ] Namecheap : acheter domainesidiabdallah.com (~$10/an)
- [ ] Namecheap : acheter darsaad.com (anti-squatting)
- [ ] Namecheap : acheter agrumia.com (anti-squatting)
- [ ] Configurer le renouvellement automatique
- [ ] Noter les credentials dans Notion > Comptes & Accès
```

---

### INF-02 · Créer le repo GitHub dsa-platform
**Labels:** `infra`
**Priority:** Urgent
**Due:** 1 mars 2026
**Description:**
```
- [ ] Créer repo : github.com/[org]/dsa-platform (privé)
- [ ] Copier les templates depuis tooling/github-dsa-platform/
- [ ] Créer les branches : main (dev) + production (stable)
- [ ] Protéger la branche production (require CI to pass)
- [ ] Connecter à Vercel (auto-deploy)
```

---

### INF-03 · Créer les projets Supabase
**Labels:** `infra`, `database`
**Priority:** Urgent
**Due:** 1 mars 2026
**Description:**
```
- [ ] Créer projet Supabase DEV (région eu-west-2 Paris si dispo)
- [ ] Créer projet Supabase PROD (même région)
- [ ] Récupérer les 2 connection strings (pooler + direct)
- [ ] Configurer pgbouncer en mode transaction (PROD uniquement)
- [ ] Stocker les URLs dans .env.local (jamais dans le repo)
- [ ] Documenter dans Notion > Comptes & Accès
```

---

### INF-04 · Créer le projet Vercel
**Labels:** `infra`
**Priority:** Urgent
**Due:** 1 mars 2026
**Description:**
```
- [ ] Créer un projet Vercel : "dsa-platform"
- [ ] Région de déploiement : cdg1 (Paris)
- [ ] Connecter au repo GitHub dsa-platform
- [ ] Configurer : branch main → preview, branch production → prod
- [ ] Ajouter le domaine domainesidiabdallah.com dans Vercel
- [ ] Configurer les variables d'env dans Vercel (PROD)
```

---

### INF-05 · Configurer Cloudflare
**Labels:** `infra`
**Priority:** High
**Due:** 5 mars 2026
**Description:**
```
- [ ] Créer compte Cloudflare (gratuit)
- [ ] Ajouter domainesidiabdallah.com dans Cloudflare
- [ ] Changer les nameservers chez Namecheap → Cloudflare
- [ ] SSL/TLS : mode Full (strict)
- [ ] Configurer le redirect 301 : domainesidiabdallah.tn → .com
- [ ] Configurer le redirect 301 : www.domainesidiabdallah.com → domainesidiabdallah.com
- [ ] Pointer le domaine vers Vercel (CNAME)
```

---

### INF-06 · Créer le compte Brevo + listes
**Labels:** `infra`
**Priority:** Urgent
**Due:** 1 mars 2026
**Description:**
```
- [ ] Créer compte Brevo (gratuit, 300 emails/jour)
- [ ] Créer liste : "DSA Waitlist — FR"
- [ ] Créer liste : "DSA Waitlist — EN"
- [ ] Créer liste : "DSA Newsletter"
- [ ] Créer listes par pilier : "Intérêt Séjour", "Intérêt Bien-être", "Intérêt Restaurant", "Intérêt Retraites"
- [ ] Récupérer l'API key → Notion Comptes & Accès
- [ ] Configurer le sender : "Domaine Sidi Abdallah <contact@domainesidiabdallah.com>"
```

---

### INF-07 · Demande Twilio WhatsApp Business ⚡
**Labels:** `infra`
**Priority:** Urgent
**Due:** 3 mars 2026
**Description:**
```
ATTENTION : Approbation prend 2–3 jours ouvrables.
Soumettre le 3 mars au plus tard pour être opérationnel le 7 avril.

- [ ] Créer compte Twilio
- [ ] Soumettre demande WhatsApp Business API
- [ ] Numéro à utiliser : celui du Domaine (confirmer avec Elyssa)
- [ ] Préparer : nom de l'entreprise, description, logo, URL du site
      (utiliser URL Vercel preview si site pas encore live)
- [ ] Configurer le webhook de réception de messages
- [ ] Tester l'envoi de message de confirmation
- [ ] Stocker Account SID + Auth Token dans les env vars Vercel
```

---

### INF-08 · Configurer Resend
**Labels:** `infra`
**Priority:** High
**Due:** 5 mars 2026
**Description:**
```
- [ ] Créer compte Resend (gratuit, 3000 emails/mois)
- [ ] Vérifier le domaine domainesidiabdallah.com (DNS DKIM via Cloudflare)
- [ ] Configurer sender : "Domaine Sidi Abdallah <reservations@domainesidiabdallah.com>"
- [ ] Récupérer l'API key → env vars
- [ ] Tester envoi d'un email de confirmation (template basique)
```

---

### INF-09 · Google Business Profile
**Labels:** `infra`
**Priority:** Medium
**Due:** 10 mars 2026
**Description:**
```
- [ ] Créer profil Google Business pour "Domaine Sidi Abdallah"
- [ ] Adresse : Mohammedia, Tunisie
- [ ] Catégorie : Hôtel de luxe + Restaurant
- [ ] Ajouter photos de la grove (en attente livraison photographe)
- [ ] Configurer le lien de réservation (URL restaurant quand live)
- [ ] Vérification du profil (courrier ou appel)
```

---

### DEC-01 · Réunion direction artistique — 8 décisions
**Labels:** `design`, `blocked`
**Priority:** Urgent
**Due:** 15 mars 2026
**Description:**
```
Bloquer une réunion avec Elyssa et Lilia.
Board FigJam préparé : voir tooling/figjam-meeting-board.md

Décisions à trancher :
- [ ] Q-01 : Ton & langue (maison / domaine / terre)
- [ ] Q-02 : Photographie au lancement (grove / attendre / grove + making-of)
- [ ] Q-03 : Sous-marques (visibles / co-marques / internes)
- [ ] Q-04 : Navigation au lancement (pages complètes / nav réduite / teasing)
- [ ] Q-05 : Typographie (chaleur / rigueur / dramatique)
- [ ] Q-06 : Hero (photo / vidéo / photo + vidéo différée)
- [ ] Q-07 : Prix (affichés / sur demande / fourchettes)
- [ ] Q-08 : Boutique D2C (oui / peut-être / non)

Après la réunion : mettre à jour Notion > Décisions avec les 8 réponses.
```

---

### DEC-02 · Logos validés + design tokens confirmés
**Labels:** `design`, `blocked`
**Priority:** Urgent
**Due:** 15 mars 2026
**Description:**
```
Bloquant pour le démarrage du développement.

- [ ] Recevoir logos finaux du designer (SVG + PNG)
- [ ] Valider les variants : couleur principale, blanc, noir
- [ ] Confirmer les design tokens (voir tooling/figma-design-tokens.json)
- [ ] Mettre à jour tailwind.config.ts avec les tokens confirmés
- [ ] Préparer favicon.ico + apple-touch-icon.png
```

---

### CONTENT-01 · Textes FR + EN validés
**Labels:** `content`, `blocked`
**Priority:** High
**Due:** 31 mars 2026
**Description:**
```
Attendre validation de Q-01 (ton) avant finalisation.

- [ ] Envoyer les textes à Lilia avec le ton choisi comme cadrage
- [ ] Réceptionner les corrections de Lilia
- [ ] Intégrer dans les fichiers MDX :
      content/fr/home.mdx
      content/fr/sejour.mdx
      content/fr/bien-etre.mdx
      content/fr/restaurant.mdx
      content/fr/retraites.mdx
      content/fr/notre-histoire.mdx
- [ ] Idem pour content/en/
```

---

### CONTENT-02 · Photos Phase 1 livrées
**Labels:** `content`, `blocked`
**Priority:** High
**Due:** 5 avril 2026
**Description:**
```
Dépend de Q-02 (décision photographie).

- [ ] Planifier shooting avec photographe (si Q-02 Option A ou C)
- [ ] Brief photographe :
      Orangeraie à heure dorée (6h–8h ou 17h–19h)
      Lumière à travers le feuillage
      Mains sur les fruits, processus agricole
      Format : JPEG, min 3000px large, non compressés
- [ ] Réceptionner et valider les photos
- [ ] Compresser pour le web (sharp) et organiser dans public/images/
- [ ] Générer les OG images (1200×630px) pour chaque page
```

---

## 5. Issues — Phase 1 (Site Web + Restaurant)

> Project : **Phase 1 — Site Web + Restaurant**
> Organiser en cycles de 1 semaine.

---

### SEMAINE 1 (7–13 avr) — Foundation

#### P1-01 · Initialisation Next.js 14 + design tokens
**Labels:** `frontend`, `infra`
**Priority:** Urgent
**Estimate:** 4h
**Description:**
```
- [ ] npx create-next-app@latest dsa-platform --typescript --tailwind --app
- [ ] Configurer tailwind.config.ts avec les design tokens confirmés :
      colors: parchment, grove, terracotta, gold, ink
      fontFamily: heading (Cormorant Garamond), body (DM Sans)
      borderRadius, spacing custom
- [ ] Configurer next.config.ts (domaines images, headers)
- [ ] Installer dépendances : next-intl, prisma, @prisma/client
- [ ] Configurer tsconfig.json (paths aliases : @/components, @/lib, etc.)
- [ ] Vérifier build clean : npx tsc --noEmit
```

---

#### P1-02 · Configuration next-intl (FR/EN)
**Labels:** `frontend`
**Priority:** Urgent
**Estimate:** 2h
**Description:**
```
- [ ] Créer messages/fr.json et messages/en.json (structure de base)
- [ ] Configurer i18n.ts : locales: ['fr', 'en'], defaultLocale: 'fr'
- [ ] App Router : app/[locale]/layout.tsx avec NextIntlClientProvider
- [ ] next.config.ts : withNextIntl(config)
- [ ] Tester : fr (sans préfixe) et /en/* fonctionnent
```

---

#### P1-03 · Middleware géodétection + routing
**Labels:** `backend`, `infra`
**Priority:** Urgent
**Estimate:** 3h
**Description:**
```
Implémenter middleware.ts :
- [ ] Lire cookie dsa-audience (tn | intl)
- [ ] Si pas de cookie : lire request.geo.country (Vercel Edge)
      TN → audience = 'tn', autres → audience = 'intl'
- [ ] Écrire cookie dsa-audience (30 jours, httpOnly: false)
- [ ] Si audience = 'intl' et pas de préfixe /en/ → redirect /en/*
- [ ] Chaîner avec createMiddleware de next-intl
- [ ] Créer lib/geo.ts : getAudience() lit le cookie côté serveur
- [ ] Tests : VPN TN → FR, VPN UK → EN
```

---

#### P1-04 · Schema Prisma Phase 1 + migration
**Labels:** `database`
**Priority:** Urgent
**Estimate:** 3h
**Description:**
```
- [ ] Implémenter prisma/schema.prisma (Phase 1 tables) :
      Guest, Booking, RestaurantBooking,
      RestaurantDayConfig, RestaurantTimeSlot,
      NewsletterSubscriber, AdminUser, CommunicationLog
- [ ] prisma migrate dev --name init
- [ ] Vérifier migration sur Supabase DEV
- [ ] Créer lib/db.ts (Prisma client singleton, connection pooling)
- [ ] Tester : npx prisma studio (quelques lignes de test)
```

---

#### P1-05 · Navigation + Footer
**Labels:** `frontend`
**Priority:** High
**Estimate:** 6h
**Description:**
```
Navigation.tsx :
- [ ] Desktop : logo gauche, 5–6 items centré, WhatsApp CTA droite
- [ ] Mobile : hamburger → drawer plein écran
- [ ] Items : Le Domaine · La Table · Séjourner · Agrumia · Retraites · Contact
- [ ] Active state sur la page courante
- [ ] FR/EN switch (next-intl useRouter)
- [ ] Transparent sur hero, fond parchemin au scroll

Footer.tsx :
- [ ] 3 colonnes : nav rapide · contact · newsletter mini-form
- [ ] WhatsApp + réseaux sociaux
- [ ] Mentions légales + Copyright
- [ ] FR + EN
```

---

#### P1-06 · Déploiement Vercel + domaine custom
**Labels:** `infra`
**Priority:** Urgent
**Estimate:** 2h
**Description:**
```
- [ ] Push initial sur GitHub main
- [ ] Vercel : import du repo, configurer les env vars
- [ ] Ajouter env vars dans Vercel (dashboard) :
      DATABASE_URL, DIRECT_URL, TWILIO_*, RESEND_*, BREVO_API_KEY
- [ ] Vérifier que le build passe en production
- [ ] Configurer domainesidiabdallah.com dans Vercel
- [ ] Vérifier HTTPS + domaine custom résolu
Gate : URL custom accessible, middleware logs audience dans console.
```

---

### SEMAINE 2 (14–20 avr) — Homepage

#### P1-07 · HeroSection
**Labels:** `frontend`
**Priority:** High
**Estimate:** 5h
**Description:**
```
- [ ] Photo plein écran (ou vidéo si Q-06 Option B)
- [ ] Overlay texte adaptatif audience :
      TN : "L'orangeraie vous attend · Réserver via WhatsApp →"
      INTL : "Discover the Domain · Plan your visit →"
- [ ] Lire audience depuis cookie (getAudience())
- [ ] Animation entrée douce (pas de GSAP, CSS transform)
- [ ] LCP : image preload + priority prop
```

---

#### P1-08 · PillarGrid
**Labels:** `frontend`
**Priority:** High
**Estimate:** 4h
**Description:**
```
- [ ] 4 cartes : Déguster · Séjourner · Se Détendre · S'Évader
- [ ] Badge dynamique : "Ouvert" (vert) / "Bientôt — Automne 2026"
- [ ] Lien vers la page correspondante
- [ ] Hover : légère élévation, curseur pointer
- [ ] Mobile : 2 colonnes → 1 colonne
- [ ] Badge état configurable via prop (pas en dur dans le composant)
```

---

#### P1-09 · StorySection + NewsletterCapture + WhatsAppButton
**Labels:** `frontend`
**Priority:** High
**Estimate:** 5h
**Description:**
```
StorySection :
- [ ] Texte depuis MDX (getContent('home', 'story', locale))
- [ ] Photo orangeraie latérale
- [ ] Section divider : SVG feuille citrus organique

NewsletterCapture.tsx :
- [ ] Input email + bouton "S'inscrire"
- [ ] POST /api/newsletter → Brevo waitlist
- [ ] Message succès / erreur
- [ ] RGPD mention (consentement explicite)

WhatsAppButton.tsx :
- [ ] Floating bottom-right
- [ ] Lien wa.me/[numero]?text=[pré-rempli selon la page]
- [ ] Audience-aware : TN → WhatsApp direct, INTL → booking form
```

---

#### P1-10 · AudienceToggle
**Labels:** `frontend`
**Priority:** Medium
**Estimate:** 2h
**Description:**
```
- [ ] Toggle discret dans le footer ou header
- [ ] Écrit le cookie dsa-audience (tn | intl)
- [ ] Appelle router.refresh() pour recharger les server components
- [ ] Label : "🇹🇳 Version Tunisie" / "🌍 International version"
```

---

### SEMAINE 3 (21–27 avr) — Pages Showcase

#### P1-11 · /sejour (Dar Saad)
**Labels:** `frontend`, `content`
**Estimate:** 4h
**Description:**
```
- [ ] Hero + titre "Séjourner au Domaine"
- [ ] Concept Dar Saad (depuis MDX)
- [ ] Cards des 6 chambres (noms + description évocatrice)
- [ ] ComingSoonOverlay : formulaire liste d'attente → Brevo
- [ ] Badge "Ouverture Fin 2026"
```

---

#### P1-12 · /bien-etre (Agrumia)
**Labels:** `frontend`, `content`
**Estimate:** 3h
**Description:**
```
- [ ] Concept Agrumia (depuis MDX)
- [ ] Catalogue services statique (affichage seulement, Phase 1b pour réservation)
- [ ] WhatsApp CTA proéminent
- [ ] ComingSoonOverlay avec liste d'attente
```

---

#### P1-13 · /retraites · /notre-histoire · /contact
**Labels:** `frontend`, `content`
**Estimate:** 6h
**Description:**
```
/retraites :
- [ ] Cards programmes retreat (depuis MDX)
- [ ] Formulaire pré-inscription email

/notre-histoire :
- [ ] Timeline narrative (famille, orangeraie, rénovation)
- [ ] Photos grove
- [ ] Philosophy statement

/contact :
- [ ] Formulaire → POST /api/contact → Resend email
- [ ] WhatsApp lien direct
- [ ] Google Maps embed
- [ ] Adresse + horaires
```

---

### SEMAINE 4 (28 avr – 4 mai) — Restaurant Backend

#### P1-14 · lib/booking/restaurant.ts
**Labels:** `backend`, `database`
**Estimate:** 8h
**Description:**
```
getAvailableSlots(date: Date, covers: number):
- [ ] Lire RestaurantDayConfig pour la date
- [ ] Pour chaque slot : calculer covers restants
      (maxCovers - heldCovers - bookedCovers)
- [ ] Retourner slots disponibles avec hint
      ("Complet" / "3 places restantes" / "Disponible")
- [ ] Gérer les cas limites : date passée, restaurant fermé, covers > max

createBooking(data: CreateBookingInput):
- [ ] Transaction Prisma : Guest upsert + Booking + RestaurantBooking
- [ ] Décrémenter bookedCovers sur le slot
- [ ] Générer bookingRef (court, lisible : "DSA-2026-0421")
- [ ] Retourner la réservation créée

Unit tests (Vitest) :
- [ ] Slot plein → retourner vide
- [ ] Capacité partielle → hint correct
- [ ] Double booking → conflit (répliquer race condition)
- [ ] Date fermée → erreur appropriée
```

---

#### P1-15 · API routes restaurant
**Labels:** `backend`
**Estimate:** 4h
**Description:**
```
GET /api/availability/restaurant?date=YYYY-MM-DD&covers=N :
- [ ] Valider params (zod)
- [ ] Appeler getAvailableSlots()
- [ ] Répondre 200 avec les slots | 400 si params invalides

POST /api/bookings/restaurant :
- [ ] Valider body (zod schema)
- [ ] Appeler createBooking()
- [ ] Envoyer WhatsApp au staff (Twilio)
- [ ] Envoyer confirmation email au client (Resend)
- [ ] Répondre 201 avec bookingRef | 409 si slot plein

Seed :
- [ ] Script prisma/seed.ts : RestaurantDayConfig pour 90 jours
      Déjeuner 12h30–14h30 (slots 30 min, 40 covers, 10 réservés walk-in)
      Dîner 19h30–22h00 (40 covers)
```

---

### SEMAINE 5 (5–11 mai) — UI Réservation + Admin

#### P1-16 · UI réservation restaurant
**Labels:** `frontend`
**Estimate:** 10h
**Description:**
```
Formulaire 3 étapes (mobile-first) :

Étape 1 — Date :
- [ ] DatePicker : calendrier avec jours indisponibles grisés
- [ ] Fetch API GET /api/availability sur sélection de date + covers

Étape 2 — Heure :
- [ ] TimeSlotSelector : grille des créneaux disponibles
- [ ] Hint de capacité par slot
- [ ] Toggle déjeuner / dîner

Étape 3 — Coordonnées :
- [ ] Prénom, Nom, Téléphone (+216...), Email, Demandes spéciales
- [ ] Récapitulatif de la réservation
- [ ] Bouton "Confirmer ma réservation"
- [ ] Écran de confirmation avec bookingRef
```

---

#### P1-17 · Admin back-office
**Labels:** `admin`, `backend`
**Estimate:** 10h
**Description:**
```
Auth :
- [ ] POST /api/auth : email + password → JWT httpOnly cookie (7 jours)
- [ ] Middleware admin : vérifier JWT sur toutes les routes /admin
- [ ] /admin/login page (formulaire simple)

/admin/dashboard :
- [ ] Covers du jour (déjeuner + dîner)
- [ ] Prochaines 5 réservations
- [ ] Lien "Ajouter une réservation" (walk-in)

/admin/restaurant :
- [ ] Sélecteur de date
- [ ] 2 panneaux : Déjeuner / Dîner
- [ ] Liste des réservations triée par heure
- [ ] Pour chaque : Nom · Couverts · Téléphone · Statut
- [ ] Mise à jour statut en 1 tap : En attente → Confirmé → Assis → Terminé / No-Show
- [ ] Compteur de couverts avec indicateur couleur (vert / orange / rouge)
- [ ] Bouton "Fermer ce service" (met isOpen = false sur RestaurantDayConfig)
```

---

### SEMAINE 6 (12–16 mai) — QA & Launch

#### P1-18 · QA Lighthouse + performance
**Labels:** `frontend`
**Estimate:** 8h
**Description:**
```
Objectifs :
- [ ] Lighthouse mobile : Performance > 85, Accessibility > 90, SEO > 95
- [ ] LCP < 2.5s sur connexion 4G simulée (Chrome DevTools)
- [ ] CLS < 0.1

Actions typiques :
- [ ] next/image avec priority + sizes appropriés
- [ ] Font preload (Cormorant Garamond + DM Sans)
- [ ] Lazy load des composants sous la fold
- [ ] Vérifier og:image, meta description sur toutes les pages
- [ ] LocalBusiness structured data (JSON-LD) sur homepage + contact
```

---

#### P1-19 · Tests cross-device + géodétection
**Labels:** `frontend`, `infra`
**Estimate:** 4h
**Description:**
```
- [ ] Chrome Mac + Windows
- [ ] Safari Mac + iPhone (real device)
- [ ] Firefox
- [ ] Android Chrome (real device ou BrowserStack)
- [ ] VPN test : TN IP → contenu FR + WhatsApp CTA
- [ ] VPN test : UK IP → contenu EN + booking form
- [ ] Cookie override (AudienceToggle) fonctionne
- [ ] Formulaire réservation end-to-end sur mobile
```

---

#### P1-20 · DNS cutover + mise en ligne 🚀
**Labels:** `infra`
**Priority:** Urgent
**Due:** 16 mai 2026
**Description:**
```
Checklist finale avant cutover :
- [ ] Tous les textes FR + EN intégrés et validés
- [ ] Toutes les photos intégrées et optimisées
- [ ] Formulaire réservation testé end-to-end
- [ ] Admin back-office testé par Elyssa
- [ ] Brevo reçoit les inscriptions newsletter
- [ ] WhatsApp notification de réservation reçue
- [ ] Resend email de confirmation reçu
- [ ] Lighthouse passé sur tous les objectifs
- [ ] Analytics (Vercel + Umami) configurés

Actions :
- [ ] Pointer DNS Cloudflare vers Vercel (CNAME)
- [ ] Vérifier HTTPS sur domainesidiabdallah.com
- [ ] Vérifier redirect www → apex
- [ ] Vérifier redirect .tn → .com
- [ ] Tester une vraie réservation depuis un téléphone tunisien
- [ ] Informer Elyssa + Lilia → Loom update de lancement 🎉
```

---

## 6. Epics (Phases futures)

> Créer ces epics maintenant, sans issues dedans.
> Issues à créer quand la phase se rapproche.

### Epic : Phase 1b — Wellness (Juin–Sept 2026)
*~90h | Déclencheur : date d'ouverture Agrumia confirmée par Elyssa*

Contenu prévu :
- Prisma migration : WellnessService, PractitionerSchedule, Resource, AvailabilitySlot
- Moteur dispo multi-ressource (praticien + salle, avec buffer)
- GET /api/availability/wellness · POST /api/bookings/wellness
- ServiceCatalog.tsx, WellnessBookingForm.tsx, PractitionerSelector.tsx
- Admin grille praticiens × horaires

---

### Epic : Phase 2 — Chambres + Paiements (Fin 2026)
*~200h | Déclencheur : date d'ouverture Dar Saad confirmée*

Contenu prévu :
- Prisma migration : RoomType (6 chambres), PricingSeason, OtaChannel, Payment
- Moteur de tarification (base × saison × durée × weekend)
- Hold de 15 min avec expiry
- Stripe (intl) + Konnect (TN) intégration
- Sync iCal OTA

---

### Epic : Phase 3 — Retraites + Dashboard (2027+)
*~200h | Déclencheur : décision stratégique 2027*

Contenu prévu :
- RetreatProgram, RetreatDate, RetreatBooking
- "Plan Your Stay" pré-arrivée scheduler
- Tableau de bord unifié (revenus, taux d'occupation, analytics)
- Boutique D2C si Q-08 Option A
