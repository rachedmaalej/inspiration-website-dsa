import { useState, useEffect, useCallback } from "react";

// ─── Google Fonts ──────────────────────────────────────────────────────────
const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&family=Jost:wght@300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

// ─── Theme / Palette ────────────────────────────────────────────────────────
const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #16120e;
    --surface: #1f1a14;
    --card: #26201a;
    --card2: #2e2720;
    --border: #3a3028;
    --gold: #c49a6c;
    --gold-light: #dbb98a;
    --sage: #7d9e6a;
    --terra: #b5624a;
    --cream: #f0e6d6;
    --muted: #8a7a6a;
    --dim: #5a4e42;
    --font-display: 'Cormorant Garamond', serif;
    --font-mono: 'DM Mono', monospace;
    --font-body: 'Jost', sans-serif;
  }
  body { background: var(--bg); color: var(--cream); font-family: var(--font-body); }
  
  .app { min-height: 100vh; }
  
  /* Header */
  .header {
    border-bottom: 1px solid var(--border);
    padding: 20px 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--surface);
    position: sticky; top: 0; z-index: 100;
  }
  .header-brand { display: flex; align-items: baseline; gap: 14px; }
  .header-title { font-family: var(--font-display); font-size: 22px; font-weight: 400; color: var(--cream); letter-spacing: 0.04em; }
  .header-sub { font-family: var(--font-mono); font-size: 10px; color: var(--gold); letter-spacing: 0.12em; text-transform: uppercase; }
  .header-date { font-family: var(--font-mono); font-size: 11px; color: var(--muted); letter-spacing: 0.06em; }

  /* Nav */
  .nav { 
    display: flex; gap: 2px; padding: 0 36px; 
    background: var(--surface); border-bottom: 1px solid var(--border);
    overflow-x: auto;
  }
  .nav-tab {
    padding: 14px 20px; font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted);
    border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent;
    transition: color 0.2s, border-color 0.2s; white-space: nowrap;
  }
  .nav-tab:hover { color: var(--cream); }
  .nav-tab.active { color: var(--gold); border-bottom-color: var(--gold); }

  /* Main */
  .main { padding: 36px; max-width: 1400px; margin: 0 auto; }
  
  /* Section title */
  .section-title { font-family: var(--font-display); font-size: 32px; font-weight: 300; color: var(--cream); margin-bottom: 6px; }
  .section-sub { font-family: var(--font-mono); font-size: 11px; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 32px; }

  /* Grid */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

  /* Card */
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 4px; padding: 24px; }
  .card-sm { background: var(--card); border: 1px solid var(--border); border-radius: 4px; padding: 16px; }
  .card-label { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
  .card-value { font-family: var(--font-display); font-size: 36px; font-weight: 300; color: var(--cream); line-height: 1; }
  .card-note { font-size: 12px; color: var(--muted); margin-top: 6px; font-family: var(--font-mono); }

  /* Stat card with color accent */
  .stat-accent-gold { border-left: 3px solid var(--gold); }
  .stat-accent-sage { border-left: 3px solid var(--sage); }
  .stat-accent-terra { border-left: 3px solid var(--terra); }
  .stat-accent-dim { border-left: 3px solid var(--dim); }

  /* Phase bar */
  .phase-block { margin-bottom: 20px; }
  .phase-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
  .phase-name { font-family: var(--font-display); font-size: 16px; font-weight: 500; color: var(--cream); }
  .phase-dates { font-family: var(--font-mono); font-size: 10px; color: var(--muted); letter-spacing: 0.06em; }
  .phase-bar-track { height: 6px; background: var(--card2); border-radius: 3px; overflow: hidden; }
  .phase-bar-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
  .phase-items { margin-top: 10px; display: flex; flex-direction: column; gap: 4px; }
  .phase-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); }
  .phase-item.done { color: var(--cream); }
  .phase-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

  /* Status badge */
  .badge { display: inline-block; padding: 2px 8px; border-radius: 2px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; }
  .badge-todo { background: #2a2420; color: var(--muted); border: 1px solid var(--border); }
  .badge-progress { background: #2a2010; color: var(--gold); border: 1px solid #4a3820; }
  .badge-review { background: #1a2a30; color: #6ab0c0; border: 1px solid #2a4050; }
  .badge-done { background: #1a2a1a; color: var(--sage); border: 1px solid #2a4a2a; }
  .badge-blocked { background: #2a1a1a; color: var(--terra); border: 1px solid #4a2a2a; }

  /* Owner badge */
  .owner-r { background: #2a2010; color: var(--gold); border: 1px solid #4a3820; padding: 1px 7px; border-radius: 2px; font-family: var(--font-mono); font-size: 10px; }
  .owner-e { background: #1a2a30; color: #6ab0c0; border: 1px solid #2a4050; padding: 1px 7px; border-radius: 2px; font-family: var(--font-mono); font-size: 10px; }
  .owner-l { background: #2a1a2a; color: #c06ac0; border: 1px solid #4a2a4a; padding: 1px 7px; border-radius: 2px; font-family: var(--font-mono); font-size: 10px; }
  .owner-all { background: #1a2520; color: var(--sage); border: 1px solid #2a4030; padding: 1px 7px; border-radius: 2px; font-family: var(--font-mono); font-size: 10px; }

  /* Task kanban */
  .kanban { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; align-items: start; }
  .kanban-col { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 14px; }
  .kanban-col-header { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; }
  .kanban-count { background: var(--card2); color: var(--muted); padding: 1px 6px; border-radius: 10px; font-size: 10px; }
  .task-card { background: var(--card); border: 1px solid var(--border); border-radius: 3px; padding: 12px; margin-bottom: 10px; cursor: pointer; transition: border-color 0.2s; }
  .task-card:hover { border-color: var(--gold); }
  .task-title { font-size: 13px; color: var(--cream); line-height: 1.4; margin-bottom: 8px; }
  .task-meta { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
  .task-due { font-family: var(--font-mono); font-size: 10px; color: var(--muted); }
  .task-overdue { color: var(--terra); }
  .phase-tag { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.06em; color: var(--dim); }

  /* Budget */
  .budget-track { margin-bottom: 28px; }
  .budget-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
  .budget-name { font-family: var(--font-display); font-size: 18px; font-weight: 400; color: var(--cream); }
  .budget-amounts { font-family: var(--font-mono); font-size: 11px; color: var(--muted); }
  .budget-bar-track { height: 8px; background: var(--card2); border-radius: 4px; overflow: hidden; margin-bottom: 10px; }
  .budget-bar-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
  .budget-entries { display: flex; flex-direction: column; gap: 6px; }
  .budget-entry { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--card2); border-radius: 3px; }
  .budget-entry-name { font-size: 13px; color: var(--cream); }
  .budget-entry-amount { font-family: var(--font-mono); font-size: 12px; color: var(--gold); }
  .budget-entry-date { font-family: var(--font-mono); font-size: 10px; color: var(--muted); }

  /* Decisions */
  .decision-row { padding: 16px; border-bottom: 1px solid var(--border); display: grid; grid-template-columns: 120px 1fr 100px 90px; gap: 16px; align-items: start; }
  .decision-row:last-child { border-bottom: none; }
  .decision-date { font-family: var(--font-mono); font-size: 11px; color: var(--muted); }
  .decision-text { font-size: 13px; color: var(--cream); line-height: 1.5; }
  .decision-context { font-size: 12px; color: var(--muted); margin-top: 4px; font-style: italic; }
  .decision-by { font-family: var(--font-mono); font-size: 11px; color: var(--gold); text-align: right; }
  .decision-open { font-family: var(--font-mono); font-size: 10px; color: var(--terra); border: 1px solid var(--terra); padding: 2px 6px; border-radius: 2px; text-align: center; }
  .decision-closed { font-family: var(--font-mono); font-size: 10px; color: var(--sage); border: 1px solid var(--sage); padding: 2px 6px; border-radius: 2px; text-align: center; }

  /* Dependencies */
  .dep-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .dep-card { background: var(--card); border: 1px solid var(--border); border-radius: 4px; padding: 18px; }
  .dep-card-title { font-family: var(--font-display); font-size: 16px; color: var(--cream); margin-bottom: 4px; }
  .dep-card-owner { font-family: var(--font-mono); font-size: 10px; color: var(--muted); margin-bottom: 14px; }
  .dep-item { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--border); }
  .dep-item:last-child { border-bottom: none; }
  .dep-item-name { font-size: 12px; color: var(--cream); }
  .dep-item-status { font-family: var(--font-mono); font-size: 10px; }
  .dep-ready { color: var(--sage); }
  .dep-pending { color: var(--gold); }
  .dep-waiting { color: var(--muted); }

  /* Form elements */
  .btn { padding: 8px 18px; border-radius: 3px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; border: none; transition: all 0.2s; }
  .btn-primary { background: var(--gold); color: var(--bg); }
  .btn-primary:hover { background: var(--gold-light); }
  .btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); }
  .btn-ghost:hover { color: var(--cream); border-color: var(--muted); }
  .btn-danger { background: transparent; color: var(--terra); border: 1px solid var(--terra); }

  input, select, textarea {
    background: var(--card2); border: 1px solid var(--border); color: var(--cream);
    padding: 8px 12px; border-radius: 3px; font-family: var(--font-body); font-size: 13px;
    outline: none; width: 100%;
  }
  input:focus, select:focus, textarea:focus { border-color: var(--gold); }
  select option { background: var(--card2); }
  label { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 6px; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
  .form-field { margin-bottom: 14px; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 200; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 28px; width: 520px; max-width: 95vw; }
  .modal-title { font-family: var(--font-display); font-size: 22px; margin-bottom: 20px; color: var(--cream); }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }

  /* Filter bar */
  .filter-bar { display: flex; gap: 10px; margin-bottom: 24px; align-items: center; flex-wrap: wrap; }
  .filter-btn { padding: 5px 14px; border-radius: 20px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; border: 1px solid var(--border); background: transparent; color: var(--muted); transition: all 0.2s; }
  .filter-btn:hover, .filter-btn.active { color: var(--cream); border-color: var(--gold); background: rgba(196,154,108,0.1); }

  /* Timeline strip */
  .timeline-strip { position: relative; padding: 20px 0; }
  .timeline-months { display: flex; gap: 0; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
  .timeline-month { flex: 1; text-align: center; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.06em; color: var(--muted); padding: 8px 4px; border-right: 1px solid var(--border); text-transform: uppercase; }
  .timeline-month.current { color: var(--gold); background: rgba(196,154,108,0.08); }
  .timeline-row { display: flex; align-items: center; gap: 14px; margin-bottom: 10px; }
  .timeline-label { font-size: 12px; color: var(--muted); width: 160px; flex-shrink: 0; text-align: right; }
  .timeline-bars { flex: 1; position: relative; height: 28px; }
  .timeline-bar { position: absolute; height: 22px; border-radius: 3px; display: flex; align-items: center; padding: 0 8px; font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.05em; color: rgba(255,255,255,0.8); overflow: hidden; white-space: nowrap; top: 3px; }

  /* Divider */
  .divider { border: none; border-top: 1px solid var(--border); margin: 28px 0; }

  /* Scrollable table */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--border); }
  td { padding: 12px 14px; border-bottom: 1px solid var(--border); font-size: 13px; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.02); }

  .progress-ring { display: flex; align-items: center; gap: 16px; }
  .ring-label { font-size: 12px; color: var(--muted); }
  .ring-val { font-family: var(--font-display); font-size: 24px; color: var(--cream); }

  @media (max-width: 900px) {
    .kanban { grid-template-columns: 1fr 1fr; }
    .grid-4 { grid-template-columns: 1fr 1fr; }
    .grid-3 { grid-template-columns: 1fr; }
    .dep-grid { grid-template-columns: 1fr; }
    .decision-row { grid-template-columns: 1fr; gap: 6px; }
  }
  @media (max-width: 600px) {
    .main { padding: 16px; }
    .header { padding: 14px 16px; }
    .nav { padding: 0 16px; }
    .kanban { grid-template-columns: 1fr; }
    .grid-2, .grid-4 { grid-template-columns: 1fr; }
    .form-row { grid-template-columns: 1fr; }
  }
`;

// ─── Initial Data ───────────────────────────────────────────────────────────
const INITIAL_TASKS = [
  // Phase 0 - Feb/Mar
  { id: 1, title: "Enregistrer les domaines (.tn + .com)", phase: "0", status: "todo", owner: "R", due: "2026-03-05", block: "Infrastructure", notes: "" },
  { id: 2, title: "Configurer Google Business Profile", phase: "0", status: "todo", owner: "R", due: "2026-03-05", block: "Infrastructure", notes: "" },
  { id: 3, title: "Configurer WhatsApp Business", phase: "0", status: "todo", owner: "R", due: "2026-03-10", block: "Infrastructure", notes: "" },
  { id: 4, title: "Lancer le compte Instagram + premiers posts making-of", phase: "0", status: "todo", owner: "E", due: "2026-03-31", block: "Contenu", notes: "" },
  { id: 5, title: "Shooting photos Phase I (oranges sur les arbres)", phase: "0", status: "in-progress", owner: "E", due: "2026-03-15", block: "Contenu", notes: "À faire avant que les oranges tombent" },
  { id: 6, title: "Relecture version FR des textes", phase: "0", status: "in-progress", owner: "L", due: "2026-03-01", block: "Contenu", notes: "Lilia → retours à Rached" },
  { id: 7, title: "Valider les 5 propositions de logos (choix final)", phase: "0", status: "in-progress", owner: "ALL", due: "2026-03-15", block: "Branding", notes: "Mid-March deadline" },
  { id: 8, title: "Choisir direction design site web (1 parmi 5)", phase: "0", status: "todo", owner: "ALL", due: "2026-03-20", block: "Design", notes: "Après résultats recherche concurrentielle" },
  { id: 9, title: "Confirmer tech stack + CMS", phase: "0", status: "done", owner: "R", due: "2026-02-23", block: "Technique", notes: "React/Node/TypeScript décidé" },
  { id: 10, title: "Recherche concurrentielle (propriétés intégrées)", phase: "0", status: "in-progress", owner: "R", due: "2026-03-05", block: "Stratégie", notes: "Aman, Babylonstoren, concurrents TN" },
  // Phase 1
  { id: 11, title: "Développer le site vitrine (4 piliers)", phase: "1", status: "todo", owner: "R", due: "2026-04-30", block: "Développement", notes: "Démarrage après validation logo + design" },
  { id: 12, title: "Intégrer photos Phase I au site", phase: "1", status: "todo", owner: "R", due: "2026-05-01", block: "Développement", notes: "" },
  { id: 13, title: "Mise en ligne site web (showcase + contact)", phase: "1", status: "todo", owner: "R", due: "2026-05-15", block: "Lancement", notes: "" },
  { id: 14, title: "Activer capture email Brevo", phase: "1", status: "todo", owner: "R", due: "2026-05-15", block: "Marketing", notes: "" },
  { id: 15, title: "Démarrage rénovation maison principale", phase: "1", status: "todo", owner: "E", due: "2026-04-06", block: "Travaux", notes: "Semaine du 6 avril" },
  { id: 16, title: "Étude bâtiment Wellness (ancienne étable)", phase: "1", status: "in-progress", owner: "E", due: "2026-04-30", block: "Travaux", notes: "Plans pas encore finalisés" },
  { id: 17, title: "Shooting Phase II — Making-of rénovation", phase: "1", status: "todo", owner: "E", due: "2026-06-30", block: "Contenu", notes: "2 jours: début + milieu travaux" },
  { id: 18, title: "Activer réservation restaurant + wellness", phase: "1b", status: "todo", owner: "R", due: "2026-08-01", block: "Développement", notes: "Soft launch piliers" },
  // Phase 2
  { id: 19, title: "Système de réservation des chambres", phase: "2", status: "todo", owner: "R", due: "2026-11-01", block: "Développement", notes: "Dar Saad — 6 chambres" },
  { id: 20, title: "Intégration paiement Konnect + Stripe", phase: "2", status: "todo", owner: "R", due: "2026-11-01", block: "Développement", notes: "" },
  { id: 21, title: "Listings OTA (Booking.com, Airbnb)", phase: "2", status: "todo", owner: "E", due: "2026-11-15", block: "Distribution", notes: "" },
  { id: 22, title: "Shooting Phase III — Produit final", phase: "2", status: "todo", owner: "E", due: "2026-10-01", block: "Contenu", notes: "Chambres décorées + espaces finis" },
  { id: 23, title: "Lancement Agrumia + événement de lancement", phase: "2", status: "todo", owner: "ALL", due: "2026-07-01", block: "Stratégie", notes: "Summer 2026" },
];

const INITIAL_BUDGET = {
  digital: { name: "Digital & Tech", total: 140000, currency: "TND", color: "#c49a6c", entries: [
    { id: 1, name: "Développement site vitrine", amount: 25000, date: "2026-05-01", status: "prévu" },
    { id: 2, name: "Système réservation + paiement", amount: 45000, date: "2026-11-01", status: "prévu" },
    { id: 3, name: "Dashboard interne + systèmes avancés", amount: 40000, date: "2027-01-01", status: "prévu" },
    { id: 4, name: "SaaS / outils (Brevo, Konnect, etc.)", amount: 8000, date: "2026-05-01", status: "prévu" },
  ]},
  renovation: { name: "Rénovation & Construction", total: 0, currency: "TND", color: "#b5624a", entries: [] },
  content: { name: "Production Contenu", total: 0, currency: "TND", color: "#7d9e6a", entries: [] },
  marketing: { name: "Opérations & Marketing", total: 0, currency: "TND", color: "#6ab0c0", entries: [] },
};

const INITIAL_DECISIONS = [
  { id: 1, date: "2026-02-23", decision: "Rached développe tout lui-même (React/Node/TypeScript)", context: "Coût, contrôle, cohérence technique", by: "Rached", status: "closed" },
  { id: 2, date: "2026-02-23", decision: "Site unique géo-adaptatif (une URL, contenu selon pays visiteur)", context: "FR pour Tunisie, EN pour international", by: "Rached + Elyssa", status: "closed" },
  { id: 3, date: "2026-02-23", decision: "Lancement hybride: vitrine hôtel/retraites + réservation resto/wellness fonctionnelle", context: "Phase 1b quand les piliers ouvrent", by: "Rached + Elyssa", status: "closed" },
  { id: 4, date: "2026-02-23", decision: "Suppression portail membre Agrumia (bloc C) — wellness en pay-per-visit", context: "Simplification Phase 1, no digital membership", by: "Rached + Elyssa", status: "closed" },
  { id: 5, date: "2026-02-23", decision: "PM: Google Sheets + WhatsApp + screenshots pour Lilia", context: "Tooling minimal, Lilia via WhatsApp uniquement", by: "Rached + Elyssa", status: "closed" },
  { id: 6, date: "", decision: "Nom de domaine: .tn primaire + .com redirect ?", context: "Recommandation: oui aux deux", by: "Rached + Elyssa", status: "open" },
  { id: 7, date: "", decision: "Choix direction design (1 des 5 propositions)", context: "Après résultats recherche concurrentielle", by: "Lilia + Elyssa + Rached", status: "open" },
  { id: 8, date: "", decision: "Approche CMS: Markdown ou Sanity.io ?", context: "Sanity si Elyssa doit éditer contenu elle-même", by: "Rached", status: "open" },
  { id: 9, date: "", decision: "Budget SaaS Phase 2 (commissions OTA + passerelle paiement)", context: "Channex.io ~3-5$/chambre/mois vs iCal gratuit", by: "Lilia + Elyssa", status: "open" },
  { id: 10, date: "", decision: "Fournisseur WhatsApp Business API (Twilio vs Meta direct)", context: "À décider à l'ouverture du restaurant", by: "Rached", status: "open" },
];

const INITIAL_DEPS = [
  { 
    id: 1, title: "Textes Site Web", owner: "Lilia → Rached",
    items: [
      { name: "Version FR (structure + contenu)", status: "ready", note: "Prêt, en attente relecture Lilia" },
      { name: "Relecture & validation Lilia", status: "pending", note: "En cours" },
      { name: "Version EN", status: "ready", note: "Prête" },
      { name: "Prix finalisés", status: "waiting", note: "À déterminer" },
    ]
  },
  { 
    id: 2, title: "Logos & Identité", owner: "Agence → Rached",
    items: [
      { name: "5 propositions livrées", status: "ready", note: "En revue" },
      { name: "Feedback équipe", status: "pending", note: "En cours" },
      { name: "Validation finale", status: "pending", note: "Mi-mars 2026" },
      { name: "Fichiers finaux livrés", status: "waiting", note: "Post-validation" },
    ]
  },
  { 
    id: 3, title: "Photos & Vidéos Phase I", owner: "Elyssa → Rached",
    items: [
      { name: "Shooting propriété (oranges)", status: "pending", note: "Fév/Mars 2026" },
      { name: "Édition + livrable Drive", status: "waiting", note: "Post-shooting" },
      { name: "Intégration site web", status: "waiting", note: "Dépend Phase I photos" },
    ]
  },
  { 
    id: 4, title: "Photos & Vidéos Phase II", owner: "Elyssa → Rached",
    items: [
      { name: "Shooting Making-of (début travaux)", status: "waiting", note: "Avr/Mai 2026" },
      { name: "Shooting Making-of (milieu travaux)", status: "waiting", note: "Mai/Juin 2026" },
      { name: "Contenu teasers Instagram", status: "waiting", note: "En parallèle" },
    ]
  },
  { 
    id: 5, title: "Rénovation & Espaces", owner: "Elyssa → équipe",
    items: [
      { name: "Devis maison principale", status: "ready", note: "Obtenu" },
      { name: "Démarrage travaux maison", status: "pending", note: "Semaine du 6 avril" },
      { name: "Plans espace Wellness", status: "pending", note: "En cours d'études" },
      { name: "Calendrier travaux Wellness", status: "waiting", note: "Pas encore finalisé" },
    ]
  },
  { 
    id: 6, title: "Direction Design Site", owner: "Tous → Rached",
    items: [
      { name: "Recherche concurrentielle", status: "pending", note: "En cours" },
      { name: "Choix direction (1/5)", status: "waiting", note: "Réunion Mars 2026" },
      { name: "Développement site", status: "waiting", note: "Post-décision design" },
    ]
  },
];

const PHASES = [
  { id: "0", label: "Phase 0 — Fondations", dates: "Fév – Mars 2026", color: "#c49a6c", progress: 35 },
  { id: "1", label: "Phase 1 — Build & Lancement", dates: "Avr – Mai 2026", color: "#7d9e6a", progress: 0 },
  { id: "1b", label: "Phase 1b — Soft Launch", dates: "Juin – Sep 2026", color: "#6ab0c0", progress: 0 },
  { id: "2", label: "Phase 2 — Ouverture Hôtel", dates: "Oct – Déc 2026", color: "#b5624a", progress: 0 },
  { id: "3", label: "Phase 3 — Systèmes Avancés", dates: "2027+", color: "#9a6ec4", progress: 0 },
];

// ─── Utilities ───────────────────────────────────────────────────────────────
const today = new Date();
const fmt = (d) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "2-digit" });
const isOverdue = (d) => d && new Date(d) < today;
const monthStr = today.toLocaleString("fr-FR", { month: "long", year: "numeric" });

const ownerLabel = { R: "Rached", E: "Elyssa", L: "Lilia", ALL: "Tous" };
const ownerClass = { R: "owner-r", E: "owner-e", L: "owner-l", ALL: "owner-all" };

const StatusBadge = ({ s }) => {
  const map = { "todo": ["badge-todo", "À faire"], "in-progress": ["badge-progress", "En cours"], "review": ["badge-review", "En revue"], "done": ["badge-done", "Fait"], "blocked": ["badge-blocked", "Bloqué"] };
  const [cls, label] = map[s] || ["badge-todo", s];
  return <span className={`badge ${cls}`}>{label}</span>;
};

const OwnerBadge = ({ o }) => <span className={ownerClass[o]}>{ownerLabel[o] || o}</span>;

// ─── Modals ──────────────────────────────────────────────────────────────────
const TaskModal = ({ task, onSave, onDelete, onClose }) => {
  const [form, setForm] = useState(task || { title: "", phase: "0", status: "todo", owner: "R", due: "", block: "", notes: "" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{task ? "Modifier la tâche" : "Nouvelle tâche"}</div>
        <div className="form-field"><label>Titre</label><input value={form.title} onChange={e => set("title", e.target.value)} /></div>
        <div className="form-row">
          <div><label>Phase</label>
            <select value={form.phase} onChange={e => set("phase", e.target.value)}>
              {PHASES.map(p => <option key={p.id} value={p.id}>{p.id} — {p.label.split("—")[1]?.trim()}</option>)}
            </select>
          </div>
          <div><label>Statut</label>
            <select value={form.status} onChange={e => set("status", e.target.value)}>
              <option value="todo">À faire</option><option value="in-progress">En cours</option>
              <option value="review">En revue</option><option value="done">Fait</option><option value="blocked">Bloqué</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div><label>Responsable</label>
            <select value={form.owner} onChange={e => set("owner", e.target.value)}>
              <option value="R">Rached</option><option value="E">Elyssa</option><option value="L">Lilia</option><option value="ALL">Tous</option>
            </select>
          </div>
          <div><label>Échéance</label><input type="date" value={form.due} onChange={e => set("due", e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div><label>Bloc</label><input value={form.block} onChange={e => set("block", e.target.value)} placeholder="ex: Développement" /></div>
        </div>
        <div className="form-field"><label>Notes</label><textarea rows={3} value={form.notes} onChange={e => set("notes", e.target.value)} /></div>
        <div className="modal-actions">
          {task && <button className="btn btn-danger" onClick={() => onDelete(task.id)}>Supprimer</button>}
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={() => form.title && onSave(form)}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
};

const DecisionModal = ({ dec, onSave, onClose }) => {
  const [form, setForm] = useState(dec || { date: new Date().toISOString().slice(0,10), decision: "", context: "", by: "Rached + Elyssa", status: "closed" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{dec ? "Modifier la décision" : "Logger une décision"}</div>
        <div className="form-field"><label>Décision</label><textarea rows={2} value={form.decision} onChange={e => set("decision", e.target.value)} /></div>
        <div className="form-field"><label>Contexte / Raison</label><input value={form.context} onChange={e => set("context", e.target.value)} /></div>
        <div className="form-row">
          <div><label>Date</label><input type="date" value={form.date} onChange={e => set("date", e.target.value)} /></div>
          <div><label>Décidé par</label><input value={form.by} onChange={e => set("by", e.target.value)} /></div>
        </div>
        <div className="form-field"><label>Statut</label>
          <select value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="closed">Prise ✓</option><option value="open">En attente</option>
          </select>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={() => form.decision && onSave(form)}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
};

const BudgetEntryModal = ({ track, onSave, onClose }) => {
  const [form, setForm] = useState({ name: "", amount: "", date: new Date().toISOString().slice(0,10), status: "prévu" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">Ajouter une dépense — {track}</div>
        <div className="form-field"><label>Description</label><input value={form.name} onChange={e => set("name", e.target.value)} /></div>
        <div className="form-row">
          <div><label>Montant (TND)</label><input type="number" value={form.amount} onChange={e => set("amount", e.target.value)} /></div>
          <div><label>Date</label><input type="date" value={form.date} onChange={e => set("date", e.target.value)} /></div>
        </div>
        <div className="form-field"><label>Statut</label>
          <select value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="prévu">Prévu</option><option value="engagé">Engagé</option><option value="payé">Payé</option>
          </select>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={() => form.name && form.amount && onSave({ ...form, amount: parseFloat(form.amount), id: Date.now() })}>Ajouter</button>
        </div>
      </div>
    </div>
  );
};

// ─── Views ────────────────────────────────────────────────────────────────────
const Dashboard = ({ tasks, budget, decisions }) => {
  const done = tasks.filter(t => t.status === "done").length;
  const inProg = tasks.filter(t => t.status === "in-progress").length;
  const blocked = tasks.filter(t => t.status === "blocked").length;
  const openDec = decisions.filter(d => d.status === "open").length;
  const totalBudget = Object.values(budget).reduce((s, t) => s + t.total, 0);
  const totalSpent = Object.values(budget).reduce((s, t) => s + t.entries.filter(e => e.status === "payé").reduce((a, e) => a + e.amount, 0), 0);
  const upcoming = tasks.filter(t => t.status !== "done" && t.due).sort((a,b) => new Date(a.due)-new Date(b.due)).slice(0, 5);

  return (
    <div>
      <div className="section-title">Vue d'ensemble</div>
      <div className="section-sub">Domaine Sidi Abdallah · {monthStr}</div>

      <div className="grid-4" style={{ marginBottom: 32 }}>
        <div className="card-sm stat-accent-gold">
          <div className="card-label">Tâches accomplies</div>
          <div className="card-value">{done}<span style={{ fontSize: 16, color: "var(--muted)" }}>/{tasks.length}</span></div>
          <div className="card-note">{Math.round(done/tasks.length*100)}% du total</div>
        </div>
        <div className="card-sm stat-accent-sage">
          <div className="card-label">En cours</div>
          <div className="card-value">{inProg}</div>
          <div className="card-note">tâches actives</div>
        </div>
        <div className="card-sm stat-accent-terra">
          <div className="card-label">Décisions en attente</div>
          <div className="card-value">{openDec}</div>
          <div className="card-note">à trancher</div>
        </div>
        <div className="card-sm stat-accent-dim">
          <div className="card-label">Bloquées</div>
          <div className="card-value">{blocked}</div>
          <div className="card-note">nécessitent attention</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 32 }}>
        {/* Phase progress */}
        <div className="card">
          <div className="card-label" style={{ marginBottom: 20 }}>Avancement par phase</div>
          {PHASES.map(p => {
            const pTasks = tasks.filter(t => t.phase === p.id);
            const pDone = pTasks.filter(t => t.status === "done").length;
            const pct = pTasks.length ? Math.round(pDone / pTasks.length * 100) : 0;
            return (
              <div key={p.id} className="phase-block">
                <div className="phase-header">
                  <span className="phase-name" style={{ fontSize: 13 }}>{p.label}</span>
                  <span className="phase-dates">{pDone}/{pTasks.length} · {p.dates}</span>
                </div>
                <div className="phase-bar-track">
                  <div className="phase-bar-fill" style={{ width: `${pct}%`, background: p.color }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Upcoming deadlines */}
        <div className="card">
          <div className="card-label" style={{ marginBottom: 14 }}>Prochaines échéances</div>
          {upcoming.map(t => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontSize: 13, color: "var(--cream)", marginBottom: 4 }}>{t.title}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <OwnerBadge o={t.owner} />
                  <StatusBadge s={t.status} />
                </div>
              </div>
              <div className={`task-due ${isOverdue(t.due) ? "task-overdue" : ""}`}>{fmt(t.due)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget summary */}
      <div className="card">
        <div className="card-label" style={{ marginBottom: 20 }}>Récapitulatif budget</div>
        <div className="grid-4">
          {Object.entries(budget).map(([k, t]) => {
            const spent = t.entries.filter(e => e.status === "payé").reduce((a,e) => a+e.amount, 0);
            const committed = t.entries.filter(e => e.status !== "payé").reduce((a,e) => a+e.amount, 0);
            const pct = t.total ? Math.round((spent + committed) / t.total * 100) : 0;
            return (
              <div key={k} className="card-sm" style={{ borderTop: `3px solid ${t.color}` }}>
                <div className="card-label">{t.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "var(--cream)", marginBottom: 4 }}>
                  {t.total > 0 ? `${t.total.toLocaleString()} TND` : "À définir"}
                </div>
                {t.total > 0 && <div className="phase-bar-track" style={{ marginTop: 8 }}>
                  <div className="phase-bar-fill" style={{ width: `${pct}%`, background: t.color }} />
                </div>}
                <div className="card-note">{spent.toLocaleString()} payé · {committed.toLocaleString()} engagé</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const TaskBoard = ({ tasks, setTasks }) => {
  const [filter, setFilter] = useState("ALL");
  const [phaseFilter, setPhaseFilter] = useState("ALL");
  const [modal, setModal] = useState(null); // null | "new" | task obj
  const cols = ["todo", "in-progress", "review", "done"];
  const colLabels = { "todo": "À faire", "in-progress": "En cours", "review": "En revue", "done": "Fait" };

  const filtered = tasks.filter(t =>
    (filter === "ALL" || t.owner === filter) &&
    (phaseFilter === "ALL" || t.phase === phaseFilter)
  );

  const saveTask = (form) => {
    if (form.id) {
      setTasks(prev => prev.map(t => t.id === form.id ? form : t));
    } else {
      setTasks(prev => [...prev, { ...form, id: Date.now() }]);
    }
    setModal(null);
  };

  const deleteTask = (id) => { setTasks(prev => prev.filter(t => t.id !== id)); setModal(null); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div className="section-title">Tableau des tâches</div>
          <div className="section-sub">Kanban · {filtered.length} tâches</div>
        </div>
        <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => setModal("new")}>+ Nouvelle tâche</button>
      </div>

      <div className="filter-bar">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", textTransform: "uppercase" }}>Responsable:</span>
        {["ALL", "R", "E", "L"].map(o => (
          <button key={o} className={`filter-btn ${filter === o ? "active" : ""}`} onClick={() => setFilter(o)}>
            {o === "ALL" ? "Tous" : ownerLabel[o]}
          </button>
        ))}
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", marginLeft: 10 }}>Phase:</span>
        {["ALL", ...PHASES.map(p => p.id)].map(p => (
          <button key={p} className={`filter-btn ${phaseFilter === p ? "active" : ""}`} onClick={() => setPhaseFilter(p)}>
            {p === "ALL" ? "Toutes" : `Phase ${p}`}
          </button>
        ))}
      </div>

      <div className="kanban">
        {cols.map(col => {
          const colTasks = filtered.filter(t => t.status === col);
          return (
            <div key={col} className="kanban-col">
              <div className="kanban-col-header">
                <span>{colLabels[col]}</span>
                <span className="kanban-count">{colTasks.length}</span>
              </div>
              {colTasks.map(t => (
                <div key={t.id} className="task-card" onClick={() => setModal(t)}>
                  <div className="task-title">{t.title}</div>
                  <div className="task-meta">
                    <OwnerBadge o={t.owner} />
                    {t.due && <span className={`task-due ${isOverdue(t.due) && col !== "done" ? "task-overdue" : ""}`}>{fmt(t.due)}</span>}
                    {t.block && <span className="phase-tag">#{t.block}</span>}
                  </div>
                  {t.notes && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6, fontStyle: "italic" }}>{t.notes}</div>}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {modal && (
        <TaskModal
          task={modal === "new" ? null : modal}
          onSave={saveTask}
          onDelete={deleteTask}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

const Timeline = ({ tasks }) => {
  const months = ["Fév 26", "Mar 26", "Avr 26", "Mai 26", "Jun 26", "Jul 26", "Aoû 26", "Sep 26", "Oct 26", "Nov 26", "Déc 26", "2027+"];
  const currentMonth = 0; // Feb 2026

  const bars = [
    { label: "Phase 0 — Fondations", start: 0, span: 2, color: "#c49a6c" },
    { label: "Shooting Phase I", start: 0, span: 1.5, color: "#7d9e6a" },
    { label: "Logos & Design", start: 0.5, span: 1.5, color: "#c49a6c" },
    { label: "Phase 1 — Build", start: 2, span: 2, color: "#7d9e6a" },
    { label: "Site en ligne", start: 3.5, span: 0.5, color: "#7d9e6a" },
    { label: "Rénovation maison", start: 2, span: 5, color: "#b5624a" },
    { label: "Making-of Instagram", start: 2, span: 4, color: "#6ab0c0" },
    { label: "Shooting Phase II", start: 3, span: 2, color: "#7d9e6a" },
    { label: "Phase 1b — Soft Launch", start: 4, span: 4, color: "#6ab0c0" },
    { label: "Lancement Agrumia", start: 5, span: 1, color: "#9a6ec4" },
    { label: "Phase 2 — Hôtel", start: 8, span: 3, color: "#b5624a" },
    { label: "Shooting Phase III", start: 7, span: 1, color: "#7d9e6a" },
    { label: "OTA Listings", start: 9, span: 3, color: "#b5624a" },
    { label: "Phase 3 — Systèmes", start: 11, span: 1, color: "#9a6ec4" },
  ];

  const total = 12;

  return (
    <div>
      <div className="section-title">Timeline du projet</div>
      <div className="section-sub">Fév 2026 → 2027+</div>

      <div className="card" style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 700 }}>
          {/* Month headers */}
          <div style={{ display: "grid", gridTemplateColumns: `160px repeat(${total}, 1fr)`, borderBottom: "1px solid var(--border)", marginBottom: 16 }}>
            <div />
            {months.map((m, i) => (
              <div key={m} style={{
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em",
                color: i === currentMonth ? "var(--gold)" : "var(--muted)",
                padding: "8px 4px", textAlign: "center", textTransform: "uppercase",
                borderLeft: "1px solid var(--border)",
                background: i === currentMonth ? "rgba(196,154,108,0.08)" : "transparent"
              }}>{m}</div>
            ))}
          </div>

          {/* Bars */}
          {bars.map((b, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: `160px repeat(${total}, 1fr)`, marginBottom: 8, alignItems: "center" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", textAlign: "right", paddingRight: 12, letterSpacing: "0.04em" }}>{b.label}</div>
              {Array.from({ length: total }).map((_, ci) => {
                const inBar = ci >= b.start && ci < b.start + b.span;
                const isStart = ci === Math.floor(b.start);
                const isEnd = ci === Math.floor(b.start + b.span - 0.01);
                return (
                  <div key={ci} style={{ height: 24, borderLeft: "1px solid var(--border)", display: "flex", alignItems: "center" }}>
                    {inBar && <div style={{
                      height: 18, width: "100%",
                      background: `${b.color}33`,
                      borderTop: `2px solid ${b.color}`,
                      borderBottom: `2px solid ${b.color}`,
                      borderLeft: isStart ? `2px solid ${b.color}` : "none",
                      borderRight: isEnd ? `2px solid ${b.color}` : "none",
                      borderRadius: isStart && isEnd ? 4 : isStart ? "4px 0 0 4px" : isEnd ? "0 4px 4px 0" : 0,
                    }} />}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Today marker */}
          <div style={{ display: "grid", gridTemplateColumns: `160px repeat(${total}, 1fr)`, marginTop: 8 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--gold)", textAlign: "right", paddingRight: 12 }}>◆ Aujourd'hui</div>
            <div style={{ borderLeft: "2px dashed var(--gold)", height: 12, opacity: 0.6 }} />
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>Jalons clés</div>
        <div className="grid-3">
          {[
            { date: "Mi-mars 2026", label: "Logos validés", color: "var(--gold)" },
            { date: "Mars 2026", label: "Direction design choisie", color: "var(--gold)" },
            { date: "6 avril 2026", label: "Démarrage rénovations", color: "var(--terra)" },
            { date: "Mai 2026", label: "Site web en ligne", color: "var(--sage)" },
            { date: "Été 2026", label: "Ouverture restaurant + wellness", color: "var(--sage)" },
            { date: "Été 2026", label: "Lancement Agrumia Club", color: "#9a6ec4" },
            { date: "Post-Ramadan 2026", label: "Ouverture hôtel (Dar Saad)", color: "var(--terra)" },
            { date: "T4 2026", label: "Réservation en ligne opérationnelle", color: "var(--terra)" },
            { date: "2027+", label: "Systèmes avancés & fidélisation", color: "#9a6ec4" },
          ].map((m, i) => (
            <div key={i} className="card-sm" style={{ borderLeft: `3px solid ${m.color}` }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: m.color, marginBottom: 4 }}>{m.date}</div>
              <div style={{ fontSize: 13, color: "var(--cream)" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Budget = ({ budget, setBudget }) => {
  const [modal, setModal] = useState(null); // null | trackKey
  const tracks = Object.entries(budget);
  const [editTotal, setEditTotal] = useState({});

  const addEntry = (trackKey, entry) => {
    setBudget(prev => ({
      ...prev,
      [trackKey]: { ...prev[trackKey], entries: [...prev[trackKey].entries, entry] }
    }));
    setModal(null);
  };

  const removeEntry = (trackKey, entryId) => {
    setBudget(prev => ({
      ...prev,
      [trackKey]: { ...prev[trackKey], entries: prev[trackKey].entries.filter(e => e.id !== entryId) }
    }));
  };

  const updateTotal = (trackKey) => {
    if (editTotal[trackKey] !== undefined) {
      setBudget(prev => ({ ...prev, [trackKey]: { ...prev[trackKey], total: parseFloat(editTotal[trackKey]) || 0 } }));
      setEditTotal(p => { const n = {...p}; delete n[trackKey]; return n; });
    }
  };

  const grandTotal = tracks.reduce((s,[,t]) => s + t.total, 0);
  const grandSpent = tracks.reduce((s,[,t]) => s + t.entries.filter(e => e.status === "payé").reduce((a,e) => a+e.amount, 0), 0);
  const grandCommitted = tracks.reduce((s,[,t]) => s + t.entries.filter(e => e.status !== "payé").reduce((a,e) => a+e.amount, 0), 0);

  return (
    <div>
      <div className="section-title">Suivi budget</div>
      <div className="section-sub">4 enveloppes · {grandTotal.toLocaleString()} TND total estimé</div>

      <div className="grid-3" style={{ marginBottom: 32 }}>
        <div className="card-sm stat-accent-sage"><div className="card-label">Budget total</div><div className="card-value" style={{ fontSize: 28 }}>{grandTotal.toLocaleString()}<span style={{ fontSize: 14, color: "var(--muted)", marginLeft: 6 }}>TND</span></div></div>
        <div className="card-sm stat-accent-gold"><div className="card-label">Engagé / prévu</div><div className="card-value" style={{ fontSize: 28 }}>{grandCommitted.toLocaleString()}<span style={{ fontSize: 14, color: "var(--muted)", marginLeft: 6 }}>TND</span></div></div>
        <div className="card-sm stat-accent-terra"><div className="card-label">Payé</div><div className="card-value" style={{ fontSize: 28 }}>{grandSpent.toLocaleString()}<span style={{ fontSize: 14, color: "var(--muted)", marginLeft: 6 }}>TND</span></div></div>
      </div>

      {tracks.map(([key, track]) => {
        const spent = track.entries.filter(e => e.status === "payé").reduce((a,e) => a+e.amount, 0);
        const committed = track.entries.filter(e => e.status !== "payé").reduce((a,e) => a+e.amount, 0);
        const pct = track.total ? Math.min(100, Math.round((spent + committed) / track.total * 100)) : 0;
        return (
          <div key={key} className="card" style={{ marginBottom: 20 }}>
            <div className="budget-header">
              <div className="budget-name" style={{ borderLeft: `4px solid ${track.color}`, paddingLeft: 12 }}>{track.name}</div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {editTotal[key] !== undefined ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input style={{ width: 140 }} type="number" value={editTotal[key]} onChange={e => setEditTotal(p => ({...p, [key]: e.target.value}))} />
                    <button className="btn btn-primary" onClick={() => updateTotal(key)}>OK</button>
                  </div>
                ) : (
                  <span className="budget-amounts" style={{ cursor: "pointer" }} onClick={() => setEditTotal(p => ({...p, [key]: track.total}))}>
                    {track.total > 0 ? `${track.total.toLocaleString()} TND` : "Budget à définir — cliquer pour éditer"}
                  </span>
                )}
                <button className="btn btn-ghost" onClick={() => setModal(key)}>+ Dépense</button>
              </div>
            </div>
            {track.total > 0 && (
              <div>
                <div className="budget-bar-track" style={{ marginBottom: 6 }}>
                  <div className="budget-bar-fill" style={{ width: `${pct}%`, background: track.color }} />
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", marginBottom: 14 }}>
                  {spent.toLocaleString()} TND payé · {committed.toLocaleString()} TND prévu/engagé · {pct}% utilisé
                </div>
              </div>
            )}
            {track.entries.length > 0 ? (
              <div className="budget-entries">
                {track.entries.map(e => (
                  <div key={e.id} className="budget-entry">
                    <div>
                      <div className="budget-entry-name">{e.name}</div>
                      <div className="budget-entry-date">{e.date ? fmt(e.date) : ""} · <span style={{ color: e.status === "payé" ? "var(--sage)" : e.status === "engagé" ? "var(--gold)" : "var(--muted)" }}>{e.status}</span></div>
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span className="budget-entry-amount">{e.amount.toLocaleString()} TND</span>
                      <button className="btn btn-ghost" style={{ padding: "2px 8px", fontSize: 10 }} onClick={() => removeEntry(key, e.id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--dim)", fontStyle: "italic" }}>Aucune dépense enregistrée</div>
            )}
          </div>
        );
      })}

      {modal && (
        <BudgetEntryModal track={budget[modal].name} onSave={(e) => addEntry(modal, e)} onClose={() => setModal(null)} />
      )}
    </div>
  );
};

const Decisions = ({ decisions, setDecisions }) => {
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const save = (form) => {
    if (form.id) {
      setDecisions(prev => prev.map(d => d.id === form.id ? form : d));
    } else {
      setDecisions(prev => [...prev, { ...form, id: Date.now() }]);
    }
    setModal(null);
  };

  const filtered = decisions.filter(d => filter === "ALL" || d.status === filter);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div className="section-title">Journal des décisions</div>
          <div className="section-sub">{decisions.filter(d => d.status === "open").length} en attente · {decisions.filter(d => d.status === "closed").length} prises</div>
        </div>
        <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => setModal("new")}>+ Logger</button>
      </div>

      <div className="filter-bar">
        {["ALL", "open", "closed"].map(f => (
          <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f === "ALL" ? "Toutes" : f === "open" ? "En attente" : "Prises"}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "110px 1fr 110px 90px", gap: 16 }}>
          <div className="card-label">Date</div>
          <div className="card-label">Décision</div>
          <div className="card-label" style={{ textAlign: "right" }}>Par</div>
          <div className="card-label" style={{ textAlign: "center" }}>Statut</div>
        </div>
        {filtered.map(d => (
          <div key={d.id} className="decision-row" style={{ cursor: "pointer" }} onClick={() => setModal(d)}>
            <div className="decision-date">{d.date ? fmt(d.date) : "—"}</div>
            <div>
              <div className="decision-text">{d.decision}</div>
              {d.context && <div className="decision-context">{d.context}</div>}
            </div>
            <div className="decision-by" style={{ textAlign: "right" }}>{d.by}</div>
            <div style={{ textAlign: "center" }}>
              <span className={d.status === "open" ? "decision-open" : "decision-closed"}>
                {d.status === "open" ? "En attente" : "Prise ✓"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <DecisionModal
          dec={modal === "new" ? null : modal}
          onSave={save}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

const Dependencies = ({ deps }) => {
  const statusInfo = { ready: { label: "Prêt ✓", cls: "dep-ready" }, pending: { label: "En cours", cls: "dep-pending" }, waiting: { label: "En attente", cls: "dep-waiting" } };
  return (
    <div>
      <div className="section-title">Dépendances & Assets</div>
      <div className="section-sub">Ce dont Rached a besoin pour avancer</div>
      <div className="dep-grid">
        {deps.map(dep => (
          <div key={dep.id} className="dep-card">
            <div className="dep-card-title">{dep.title}</div>
            <div className="dep-card-owner">{dep.owner}</div>
            {dep.items.map((item, i) => (
              <div key={i} className="dep-item">
                <div>
                  <div className="dep-item-name">{item.name}</div>
                  {item.note && <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--dim)", marginTop: 2 }}>{item.note}</div>}
                </div>
                <span className={`dep-item-status ${statusInfo[item.status]?.cls}`}>{statusInfo[item.status]?.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [tasks, setTasksState] = useState(INITIAL_TASKS);
  const [budget, setBudgetState] = useState(INITIAL_BUDGET);
  const [decisions, setDecisionsState] = useState(INITIAL_DECISIONS);
  const [deps] = useState(INITIAL_DEPS);
  const [loaded, setLoaded] = useState(false);

  // Load from storage
  useEffect(() => {
    (async () => {
      try {
        const t = await window.storage.get("dsa-tasks");
        if (t) setTasksState(JSON.parse(t.value));
      } catch {}
      try {
        const b = await window.storage.get("dsa-budget");
        if (b) setBudgetState(JSON.parse(b.value));
      } catch {}
      try {
        const d = await window.storage.get("dsa-decisions");
        if (d) setDecisionsState(JSON.parse(d.value));
      } catch {}
      setLoaded(true);
    })();
  }, []);

  const setTasks = useCallback(async (fn) => {
    setTasksState(prev => {
      const next = typeof fn === "function" ? fn(prev) : fn;
      window.storage.set("dsa-tasks", JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const setBudget = useCallback(async (fn) => {
    setBudgetState(prev => {
      const next = typeof fn === "function" ? fn(prev) : fn;
      window.storage.set("dsa-budget", JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const setDecisions = useCallback(async (fn) => {
    setDecisionsState(prev => {
      const next = typeof fn === "function" ? fn(prev) : fn;
      window.storage.set("dsa-decisions", JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const tabs = [
    { id: "dashboard", label: "Vue d'ensemble" },
    { id: "tasks", label: "Tâches" },
    { id: "timeline", label: "Timeline" },
    { id: "budget", label: "Budget" },
    { id: "decisions", label: "Décisions" },
    { id: "deps", label: "Dépendances" },
  ];

  return (
    <>
      <FontLink />
      <style>{CSS}</style>
      <div className="app">
        <header className="header">
          <div className="header-brand">
            <div className="header-title">Domaine Sidi Abdallah</div>
            <div className="header-sub">Tableau de bord projet</div>
          </div>
          <div className="header-date">{loaded ? "✦ Synchronisé" : "Chargement..."}</div>
        </header>
        <nav className="nav">
          {tabs.map(t => (
            <button key={t.id} className={`nav-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
        <main className="main">
          {tab === "dashboard" && <Dashboard tasks={tasks} budget={budget} decisions={decisions} />}
          {tab === "tasks" && <TaskBoard tasks={tasks} setTasks={setTasks} />}
          {tab === "timeline" && <Timeline tasks={tasks} />}
          {tab === "budget" && <Budget budget={budget} setBudget={setBudget} />}
          {tab === "decisions" && <Decisions decisions={decisions} setDecisions={setDecisions} />}
          {tab === "deps" && <Dependencies deps={deps} />}
        </main>
      </div>
    </>
  );
}
