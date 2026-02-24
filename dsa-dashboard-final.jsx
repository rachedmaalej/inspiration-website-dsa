import { useState, useEffect, useCallback } from "react";

const FontLink = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,300,0,0&display=swap" rel="stylesheet" />
  </>
);
const Icon = ({ name, size = 18, style = {} }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size, lineHeight: 1, ...style }}>{name}</span>
);

// ─── SINGLE SOURCE OF TRUTH FOR ALL COLORS ───────────────────────────────────
// Palette drawn from the HTML design reference — warm, earthy, editorial.
// Cream/parchment backgrounds · grove green + gold accents · muted terracottas
const COLORS = {
  // ── Owners ──────────────────────────────────────────── round pill badges
  rached:   { bg: "#F5EFE2", text: "#7A5820", border: "#D8C090", hex: "#C4A35A", label: "Rached"  }, // gold
  elyssa:   { bg: "#E8EEE6", text: "#2C4035", border: "#90A898", hex: "#5C7A6B", label: "Elyssa"  }, // grove green
  lilia:    { bg: "#EDE8E0", text: "#6B5B45", border: "#C8B898", hex: "#A0876A", label: "Lilia"   }, // warm tan
  tous:     { bg: "#EAE6E0", text: "#4A3C2E", border: "#C0B098", hex: "#8B7355", label: "Tous"    }, // taupe

  // ── Task statuses ────────────────────────────────────── square-ish badges
  todo:     { bg: "#EDE8E0", text: "#7A6A58", border: "#C8BAA0", hex: "#A89880", label: "À faire"   }, // dust
  progress: { bg: "#E4EAE6", text: "#2C4035", border: "#88A898", hex: "#4A7060", label: "En cours"  }, // grove
  review:   { bg: "#F5EFE2", text: "#7A5820", border: "#D8C090", hex: "#C4A35A", label: "En revue"  }, // gold
  done:     { bg: "#E6EDE2", text: "#2E4830", border: "#8AB08A", hex: "#4A6741", label: "Fait ✓"    }, // forest
  blocked:  { bg: "#F0E6E0", text: "#7A3010", border: "#D09070", hex: "#B5623A", label: "Bloquée"   }, // terracotta

  // ── Phases ──────────────────────────────────────────── horizontal bars only
  phase0:   { hex: "#4A6741", label: "Phase 0"  }, // forest green
  phase1:   { hex: "#5C7A6B", label: "Phase 1"  }, // sage green
  phase1b:  { hex: "#A0876A", label: "Phase 1b" }, // tan
  phase2:   { hex: "#B5623A", label: "Phase 2"  }, // terracotta
  phase3:   { hex: "#8B7355", label: "Phase 3"  }, // taupe

  // ── Budget envelopes ─────────────────────────────────── top stripe on cards
  bDigital: { hex: "#C4A35A", label: "Digital & Tech"         }, // gold
  bRenov:   { hex: "#B5623A", label: "Rénovation"             }, // terracotta
  bContent: { hex: "#5C7A6B", label: "Contenu"                }, // sage
  bMkt:     { hex: "#6B5B45", label: "Opérations & Marketing" }, // warm brown

  // ── Budget entry statuses ──────────────────────────────── inline tags
  bPrevu:   { bg: "#EDE8E0", text: "#7A6A58", hex: "#A89880", label: "Prévu"   },
  bEngage:  { bg: "#F5EFE2", text: "#7A5820", hex: "#C4A35A", label: "Engagé"  },
  bPaye:    { bg: "#E6EDE2", text: "#2E4830", hex: "#4A6741", label: "Payé"    },

  // ── Dependency statuses ────────────────────────────────── inline text
  depReady:   { hex: "#4A6741", label: "Prêt ✓"      },
  depPending: { hex: "#C4A35A", label: "En cours"    },
  depWaiting: { hex: "#A89880", label: "En attente"  },
};

const CSS = `
  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-weight: normal; font-style: normal; font-size: 18px;
    line-height: 1; letter-spacing: normal; text-transform: none;
    display: inline-block; white-space: nowrap; word-wrap: normal; direction: ltr;
    -webkit-font-feature-settings: 'liga'; font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased; vertical-align: middle;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream:     #F7F3EC;
    --parchment: #EDE6D8;
    --surface:   #FFFFFF;
    --ink:       #1C1A17;
    --ink2:      #4A3E30;
    --grove:     #2C4035;
    --gold:      #C4A35A;
    --dust:      #A89880;
    --mist:      #D6CFC4;
    --border:    #D6CFC4;
    --card:      #FFFFFF;
    --card2:     #F2EDE3;
    --muted:     #A89880;
    --dim:       #C8BCAA;
    --shadow-sm: 0 1px 6px rgba(28,26,23,0.05);
    --shadow:    0 2px 18px rgba(28,26,23,0.055);
    --shadow-lg: 0 8px 36px rgba(28,26,23,0.10);
    --radius:    2px;
    --font-disp: 'Cormorant Garamond', Georgia, serif;
    --font-body: 'Jost', sans-serif;
    --font-mono: 'Jost', sans-serif;
  }

  body {
    background: var(--cream);
    color: var(--ink);
    font-family: var(--font-body);
    font-weight: 300;
    font-size: 14px;
    line-height: 1.7;
    overflow-x: hidden;
  }

  /* ── HEADER ── */
  .header {
    background: var(--cream);
    border-bottom: 1px solid var(--mist);
    padding: 0 48px;
    display: flex; align-items: stretch; justify-content: space-between;
    position: sticky; top: 0; z-index: 100;
    box-shadow: var(--shadow-sm);
  }
  .header-brand { display: flex; align-items: center; gap: 20px; padding: 15px 0; }
  .header-dot { width: 6px; height: 6px; background: var(--gold); border-radius: 50%; flex-shrink: 0; }
  .header-title { font-family: var(--font-disp); font-size: 18px; font-weight: 400; color: var(--ink); letter-spacing: 0.04em; }
  .header-title em { font-style: italic; color: var(--grove); }
  .header-divider { width: 1px; background: var(--mist); margin: 14px 0; }
  .header-sub { font-family: var(--font-body); font-weight: 200; font-size: 9px; color: var(--dust); letter-spacing: 0.28em; text-transform: uppercase; }
  .header-right { display: flex; align-items: center; gap: 16px; }
  .header-status { font-family: var(--font-body); font-weight: 200; font-size: 10px; color: var(--dust); display: flex; align-items: center; gap: 6px; letter-spacing: 0.12em; }

  /* ── PROGRESS BAR ── */
  .scroll-progress { position: fixed; top: 0; left: 0; height: 2px; background: linear-gradient(to right, var(--grove), var(--gold)); z-index: 200; pointer-events: none; transition: width 0.1s linear; }

  /* ── NAV ── */
  .nav {
    background: var(--cream);
    border-bottom: 1px solid var(--mist);
    padding: 0 48px;
    display: flex; overflow-x: auto;
  }
  .nav-tab {
    padding: 14px 20px;
    font-family: var(--font-body); font-weight: 300; font-size: 9.5px;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--dust); border: none; background: none; cursor: pointer;
    border-bottom: 2px solid transparent; transition: all 0.2s; white-space: nowrap;
  }
  .nav-tab:hover { color: var(--ink2); }
  .nav-tab.active { color: var(--grove); border-bottom-color: var(--gold); font-weight: 400; }

  .main { padding: 48px; max-width: 1440px; margin: 0 auto; }

  /* ── PAGE HEADER ── */
  .page-header { margin-bottom: 32px; position: relative; }
  .page-header::before {
    content: '';
    position: absolute; top: -48px; left: -48px; right: -48px; height: 160px;
    background: radial-gradient(ellipse at 30% 0%, rgba(196,163,90,0.06) 0%, transparent 65%);
    pointer-events: none;
  }
  .page-title { font-family: var(--font-disp); font-size: 36px; font-weight: 300; color: var(--ink); line-height: 1.15; letter-spacing: 0.01em; }
  .page-title em { font-style: italic; color: var(--grove); }
  .page-sub { font-family: var(--font-body); font-weight: 200; font-size: 9px; color: var(--dust); letter-spacing: 0.28em; text-transform: uppercase; margin-top: 6px; }
  .page-ornament { display: flex; align-items: center; gap: 14px; margin: 16px 0 0; }
  .page-ornament span { display: block; height: 1px; width: 40px; background: var(--mist); }

  /* ── CARDS ── */
  .card { background: var(--card); border: 1px solid var(--mist); border-radius: var(--radius); box-shadow: var(--shadow); position: relative; overflow: hidden; }
  .card::before {
    content: '';
    position: absolute; top: 0; right: 0; width: 140px; height: 140px;
    background: radial-gradient(circle at top right, rgba(196,163,90,0.04) 0%, transparent 65%);
    pointer-events: none;
  }
  .card-p { padding: 24px 28px; }
  .card-p-sm { padding: 16px 20px; }

  /* ── STAT CARDS ── */
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .stat-card {
    background: var(--card); border: 1px solid var(--mist); border-radius: var(--radius);
    padding: 22px 26px; box-shadow: var(--shadow); position: relative; overflow: hidden;
    transition: box-shadow 0.25s, transform 0.25s;
  }
  .stat-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-1px); }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--gold); opacity: 0.4; }
  .stat-card::after {
    content: ''; position: absolute; top: 0; right: 0; width: 120px; height: 120px;
    background: radial-gradient(circle at top right, rgba(196,163,90,0.05) 0%, transparent 65%);
    pointer-events: none;
  }
  .stat-label { font-family: var(--font-body); font-weight: 200; font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--dust); margin-bottom: 12px; }
  .stat-value { font-family: var(--font-disp); font-size: 40px; font-weight: 300; color: var(--ink); line-height: 1; }
  .stat-note { font-family: var(--font-body); font-weight: 300; font-size: 11px; color: var(--dust); margin-top: 6px; letter-spacing: 0.04em; }

  /* ── PHASE BARS ── */
  .phase-block { margin-bottom: 20px; }
  .phase-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 7px; }
  .phase-name { font-family: var(--font-body); font-size: 12px; font-weight: 400; color: var(--ink2); letter-spacing: 0.06em; }
  .phase-meta { font-family: var(--font-body); font-weight: 200; font-size: 10px; color: var(--dust); letter-spacing: 0.06em; }
  .phase-track { height: 3px; background: var(--parchment); border-radius: 2px; overflow: hidden; }
  .phase-fill  { height: 100%; border-radius: 2px; transition: width 0.8s cubic-bezier(.4,0,.2,1); }
  .section-label {
    font-family: var(--font-body); font-weight: 200; font-size: 9px;
    letter-spacing: 0.28em; text-transform: uppercase; color: var(--dust);
    margin-bottom: 16px; display: flex; align-items: center; gap: 12px;
  }
  .section-label::after { content: ''; flex: 1; height: 1px; background: var(--mist); }

  /* ── BADGES ── */
  .badge {
    display: inline-flex; align-items: center; padding: 2px 9px;
    border-radius: 2px; font-family: var(--font-body); font-weight: 300;
    font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase;
    white-space: nowrap; border: 1px solid transparent;
  }
  .owner-badge { border-radius: 20px; font-weight: 400; }

  /* ── KANBAN ── */
  .kanban { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; align-items: start; }
  .k-col { border-radius: var(--radius); padding: 14px; border: 1px solid var(--mist); background: #F5F0E8; }
  .k-col-header {
    font-family: var(--font-body); font-weight: 200; font-size: 9px;
    letter-spacing: 0.24em; text-transform: uppercase; color: var(--dust);
    margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;
  }
  .k-count { background: var(--surface); border: 1px solid var(--mist); color: var(--dust); padding: 1px 7px; border-radius: 20px; font-size: 10px; }
  .task-card {
    background: var(--surface); border: 1px solid var(--mist); border-radius: var(--radius);
    padding: 13px 15px; margin-bottom: 9px; cursor: pointer;
    transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s; box-shadow: var(--shadow-sm);
  }
  .task-card:hover { box-shadow: var(--shadow); transform: translateY(-1px); border-color: var(--gold); }
  .task-card:last-child { margin-bottom: 0; }
  .task-title { font-size: 12.5px; font-weight: 300; color: var(--ink); line-height: 1.5; margin-bottom: 10px; }
  .task-meta { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
  .task-due { font-family: var(--font-body); font-weight: 200; font-size: 9.5px; color: var(--dust); letter-spacing: 0.06em; }
  .task-overdue { color: ${COLORS.blocked.text}; font-weight: 500; }
  .task-block-tag { font-family: var(--font-body); font-weight: 200; font-size: 9px; color: var(--dim); }
  .task-comments-indicator { font-family: var(--font-body); font-weight: 200; font-size: 9px; color: var(--dust); margin-top: 5px; display: flex; align-items: center; gap: 4px; }

  /* ── FILTERS ── */
  .filter-bar { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; align-items: center; }
  .filter-label { font-family: var(--font-body); font-weight: 200; font-size: 9px; color: var(--dust); letter-spacing: 0.2em; text-transform: uppercase; }
  .filter-btn {
    padding: 4px 16px; border-radius: 20px;
    font-family: var(--font-body); font-weight: 300; font-size: 9px;
    letter-spacing: 0.16em; text-transform: uppercase;
    cursor: pointer; border: 1px solid var(--mist);
    background: var(--surface); color: var(--dust); transition: all 0.18s;
  }
  .filter-btn:hover { border-color: var(--dust); color: var(--ink2); }
  .filter-btn.active { background: var(--grove); border-color: var(--grove); color: #fff; font-weight: 400; }

  /* ── DECISIONS ── */
  .dec-table { width: 100%; border-collapse: collapse; }
  .dec-table th {
    font-family: var(--font-body); font-weight: 200; font-size: 9px;
    letter-spacing: 0.22em; text-transform: uppercase; color: var(--dust);
    padding: 10px 18px; text-align: left; border-bottom: 1px solid var(--mist);
  }
  .dec-table td { padding: 15px 18px; border-bottom: 1px solid var(--mist); font-size: 13px; font-weight: 300; vertical-align: top; }
  .dec-table tr:last-child td { border-bottom: none; }
  .dec-table tr:hover td { background: #F5F0E8; cursor: pointer; }

  /* ── DEPENDENCIES ── */
  .dep-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .dep-card { background: var(--surface); border: 1px solid var(--mist); border-radius: var(--radius); padding: 22px; box-shadow: var(--shadow); position: relative; overflow: hidden; }
  .dep-card::before { content: ''; position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: radial-gradient(circle at top right, rgba(196,163,90,0.04) 0%, transparent 65%); pointer-events: none; }
  .dep-card-title { font-family: var(--font-disp); font-size: 16px; font-weight: 400; color: var(--ink); margin-bottom: 3px; }
  .dep-card-owner { font-family: var(--font-body); font-weight: 200; font-size: 9px; color: var(--dust); letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 16px; }
  .dep-item { display: flex; justify-content: space-between; align-items: flex-start; padding: 8px 0; border-bottom: 1px solid var(--mist); gap: 10px; }
  .dep-item:last-child { border-bottom: none; }
  .dep-item-name { font-size: 12.5px; font-weight: 300; color: var(--ink2); line-height: 1.5; }
  .dep-item-note { font-family: var(--font-body); font-weight: 200; font-size: 10px; color: var(--dust); margin-top: 2px; letter-spacing: 0.04em; }

  /* ── BUDGET ── */
  .budget-section { margin-bottom: 28px; }
  .budget-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .budget-name { font-family: var(--font-disp); font-size: 19px; font-weight: 400; color: var(--ink); display: flex; align-items: center; gap: 12px; }
  .budget-stripe { width: 3px; height: 20px; border-radius: 1px; flex-shrink: 0; }
  .budget-track { height: 3px; background: var(--parchment); border-radius: 2px; overflow: hidden; margin-bottom: 14px; }
  .budget-fill  { height: 100%; border-radius: 2px; transition: width 0.7s; }
  .budget-entry { display: flex; justify-content: space-between; align-items: center; padding: 9px 14px; border-radius: var(--radius); margin-bottom: 5px; background: #F5F0E8; }
  .budget-entry-left { flex: 1; }
  .budget-entry-name { font-size: 12.5px; font-weight: 300; color: var(--ink); }
  .budget-entry-meta { font-family: var(--font-body); font-weight: 200; font-size: 9.5px; color: var(--dust); margin-top: 2px; letter-spacing: 0.04em; }

  /* ── FORMS ── */
  .btn {
    padding: 8px 22px; border-radius: var(--radius);
    font-family: var(--font-body); font-weight: 400; font-size: 9.5px;
    letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer;
    border: 1px solid transparent; transition: all 0.18s;
  }
  .btn-primary { background: var(--grove); color: #F7F3EC; border-color: var(--grove); }
  .btn-primary:hover { background: #1E2E25; }
  .btn-ghost { background: transparent; color: var(--dust); border-color: var(--mist); }
  .btn-ghost:hover { color: var(--ink2); border-color: var(--dust); }
  .btn-danger { background: transparent; color: ${COLORS.blocked.text}; border-color: ${COLORS.blocked.border}; }
  .btn-danger:hover { background: ${COLORS.blocked.bg}; }
  .btn-sm { padding: 5px 14px; font-size: 9px; }
  input, select, textarea {
    background: #F5F0E8; border: 1px solid var(--mist); color: var(--ink);
    padding: 9px 13px; border-radius: var(--radius);
    font-family: var(--font-body); font-weight: 300; font-size: 13px;
    outline: none; width: 100%; transition: border-color 0.18s;
  }
  input:focus, select:focus, textarea:focus { border-color: var(--gold); background: #fff; }
  select option { background: #fff; }
  label {
    font-family: var(--font-body); font-weight: 200; font-size: 9px;
    letter-spacing: 0.22em; text-transform: uppercase; color: var(--dust);
    display: block; margin-bottom: 6px;
  }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
  .form-field { margin-bottom: 14px; }

  /* ── MODAL ── */
  .modal-overlay { position: fixed; inset: 0; background: rgba(28,26,23,0.4); display: flex; align-items: center; justify-content: center; z-index: 200; backdrop-filter: blur(3px); }
  .modal { background: var(--surface); border-radius: var(--radius); padding: 36px; width: 560px; max-width: 96vw; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg); border: 1px solid var(--mist); }
  .modal-title { font-family: var(--font-disp); font-size: 24px; font-weight: 300; margin-bottom: 24px; color: var(--ink); letter-spacing: 0.02em; }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--mist); }

  /* ── COMMENTS ── */
  .comments-section { margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--mist); }
  .comments-label { font-family: var(--font-body); font-weight: 200; font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--dust); margin-bottom: 12px; }
  .comment-item { background: #F5F0E8; border-radius: var(--radius); padding: 10px 13px; margin-bottom: 8px; }
  .comment-meta { font-family: var(--font-body); font-weight: 200; font-size: 10px; color: var(--dust); margin-bottom: 4px; display: flex; gap: 8px; letter-spacing: 0.06em; }
  .comment-text { font-size: 12.5px; font-weight: 300; color: var(--ink2); line-height: 1.55; }
  .comment-add { display: flex; gap: 8px; margin-top: 10px; }
  .comment-add textarea { resize: none; font-size: 12.5px; }

  /* ── TIMELINE ── */
  .tl-wrap { overflow-x: auto; }
  .tl-grid { display: grid; grid-template-columns: 190px repeat(12, 1fr); min-width: 760px; }
  .tl-hcell { font-family: var(--font-body); font-weight: 200; font-size: 8.5px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--dust); text-align: center; padding: 8px 4px; border-bottom: 1px solid var(--mist); border-right: 1px solid var(--mist); }
  .tl-hcell.current { color: var(--grove); background: rgba(196,163,90,0.08); font-weight: 500; }
  .tl-label { font-family: var(--font-body); font-weight: 300; font-size: 11px; color: var(--ink2); text-align: right; padding: 4px 12px 4px 0; display: flex; align-items: center; justify-content: flex-end; border-right: 1px solid var(--mist); min-height: 26px; }
  .tl-cell { border-right: 1px solid var(--mist); height: 26px; display: flex; align-items: center; }
  .tl-bar { height: 14px; width: 100%; border-radius: 1px; opacity: 0.85; }
  .milestone-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 24px; }
  .milestone-card {
    background: var(--surface); border: 1px solid var(--mist); border-radius: var(--radius);
    padding: 16px 18px; box-shadow: var(--shadow-sm);
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .milestone-card:hover { box-shadow: var(--shadow); transform: translateY(-1px); }
  .milestone-date { font-family: var(--font-body); font-weight: 300; font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold); margin-bottom: 5px; }
  .milestone-label { font-family: var(--font-disp); font-size: 14px; font-weight: 400; color: var(--ink); line-height: 1.4; }

  /* ── LILIA VIEW ── */
  .lilia-section { margin-bottom: 28px; }
  .lilia-section-title { font-family: var(--font-disp); font-size: 18px; font-weight: 300; color: var(--ink); border-bottom: 1px solid var(--mist); padding-bottom: 9px; margin-bottom: 16px; letter-spacing: 0.02em; }
  .lilia-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 18px; }
  .lilia-kpi { background: var(--surface); border: 1px solid var(--mist); border-radius: var(--radius); padding: 16px 20px; text-align: center; box-shadow: var(--shadow-sm); }
  .lilia-kpi-val { font-family: var(--font-disp); font-size: 32px; font-weight: 300; color: var(--ink); }
  .lilia-kpi-label { font-family: var(--font-body); font-weight: 200; font-size: 9px; color: var(--dust); text-transform: uppercase; letter-spacing: 0.22em; margin-top: 3px; }
  .lilia-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid var(--mist); gap: 16px; }
  .lilia-row:last-child { border-bottom: none; }

  /* ── GRIDS ── */
  .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .g3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .g4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

  @media (max-width: 1100px) { .kanban { grid-template-columns: repeat(3,1fr); } .stat-grid,.g4 { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 800px)  { .main { padding: 24px; } .header,.nav { padding-left: 24px; padding-right: 24px; } .kanban { grid-template-columns: 1fr 1fr; } .dep-grid,.g2,.g3,.lilia-grid,.milestone-grid { grid-template-columns: 1fr; } .form-row { grid-template-columns: 1fr; } }
  @media (max-width: 560px)  { .kanban { grid-template-columns: 1fr; } .stat-grid { grid-template-columns: 1fr 1fr; } }
`;

// ─── Legend component ────────────────────────────────────────────────────────
// Each group gets its own tinted panel so groups are visually distinct even
// when individual chip colors happen to be close.
// groups: array of { label, panelBg?, items: [{color, label, shape, bg, border, textColor}] }
// shape: 'square' | 'round' | 'bar'

// Distinct panel backgrounds — warm parchment variants
const PANEL_BG  = ["#EDE6D8", "#E8EEE6", "#F5EFE2", "#EAE6E0", "#F0E8E0", "#E4EDE8"];
const PANEL_BDR = ["#C8BCAA", "#A8C0B0", "#D8C090", "#C0B098", "#C8A898", "#A8C0B4"];

const Legend = ({ groups }) => (
  <div style={{
    display: "flex", flexWrap: "wrap", gap: 8, alignItems: "stretch",
    background: "rgba(237,230,216,0.5)", border: "1px solid var(--mist)",
    borderRadius: "var(--radius)", padding: "10px 14px",
    marginBottom: 28,
  }}>
    {groups.map((g, gi) => (
      <div key={g.label || gi} style={{
        display: "flex", flexDirection: "column", gap: 6,
        background: g.panelBg || PANEL_BG[gi % PANEL_BG.length],
        border: `1px solid ${g.panelBdr || PANEL_BDR[gi % PANEL_BDR.length]}`,
        borderRadius: "var(--radius)", padding: "7px 12px",
      }}>
        {g.label && (
          <div style={{
            fontFamily: "var(--font-body)", fontWeight: 200, fontSize: 8, letterSpacing: "0.28em",
            textTransform: "uppercase", color: "var(--dust)", whiteSpace: "nowrap", marginBottom: 2,
          }}>{g.label}</div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" }}>
          {g.items.map(item => (
            <div key={item.label} style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "2px 9px",
              borderRadius: item.shape === "round" ? 20 : "var(--radius)",
              fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 9.5,
              letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap",
              background: item.bg || "#EDE6D8",
              border: `1px solid ${item.border || "#C8BCAA"}`,
              color: item.textColor || "#4A3E30",
            }}>
              {item.shape === "round"  && <span style={{ width: 7, height: 7, borderRadius: "50%",  background: item.color, flexShrink: 0, display: "inline-block" }} />}
              {item.shape === "bar"    && <span style={{ width: 16, height: 4, borderRadius: 1,      background: item.color, flexShrink: 0, display: "inline-block" }} />}
              {(!item.shape || item.shape === "square") && <span style={{ width: 8, height: 8, borderRadius: 1, background: item.color, flexShrink: 0, display: "inline-block" }} />}
              {item.label}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Pre-built legend configs per tab
const LEGENDS = {
  dashboard: [
    { label: "Responsables", items: [
      { label: "Rached", color: COLORS.rached.hex, bg: COLORS.rached.bg, border: COLORS.rached.border, textColor: COLORS.rached.text, shape: "round" },
      { label: "Elyssa",  color: COLORS.elyssa.hex,  bg: COLORS.elyssa.bg,  border: COLORS.elyssa.border,  textColor: COLORS.elyssa.text,  shape: "round" },
      { label: "Lilia",   color: COLORS.lilia.hex,   bg: COLORS.lilia.bg,   border: COLORS.lilia.border,   textColor: COLORS.lilia.text,   shape: "round" },
      { label: "Tous",    color: COLORS.tous.hex,    bg: COLORS.tous.bg,    border: COLORS.tous.border,    textColor: COLORS.tous.text,    shape: "round" },
    ]},
    { label: "Phases", items: [
      { label: "Phase 0", color: COLORS.phase0.hex, bg: "#E6EDE2", border: "#8AB09A", textColor: "#2C4030", shape: "bar" },
      { label: "Phase 1", color: COLORS.phase1.hex, bg: "#E8EEE6", border: "#90A898", textColor: "#2C4035", shape: "bar" },
      { label: "Phase 1b",color: COLORS.phase1b.hex,bg: "#EDE8E0", border: "#C8B898", textColor: "#6B5B45", shape: "bar" },
      { label: "Phase 2", color: COLORS.phase2.hex, bg: "#F0E6E0", border: "#D09070", textColor: "#7A3010", shape: "bar" },
      { label: "Phase 3", color: COLORS.phase3.hex, bg: "#EAE6E0", border: "#C0B098", textColor: "#4A3C2E", shape: "bar" },
    ]},
  ],
  tasks: [
    { label: "Statuts", items: [
      { label: "À faire",  color: COLORS.todo.hex,     bg: COLORS.todo.bg,     border: COLORS.todo.border,     textColor: COLORS.todo.text     },
      { label: "En cours", color: COLORS.progress.hex, bg: COLORS.progress.bg, border: COLORS.progress.border, textColor: COLORS.progress.text },
      { label: "En revue", color: COLORS.review.hex,   bg: COLORS.review.bg,   border: COLORS.review.border,   textColor: COLORS.review.text   },
      { label: "Fait ✓",   color: COLORS.done.hex,     bg: COLORS.done.bg,     border: COLORS.done.border,     textColor: COLORS.done.text     },
      { label: "Bloquée",  color: COLORS.blocked.hex,  bg: COLORS.blocked.bg,  border: COLORS.blocked.border,  textColor: COLORS.blocked.text  },
    ]},
    { label: "Responsables", items: [
      { label: "Rached", color: COLORS.rached.hex, bg: COLORS.rached.bg, border: COLORS.rached.border, textColor: COLORS.rached.text, shape: "round" },
      { label: "Elyssa", color: COLORS.elyssa.hex, bg: COLORS.elyssa.bg, border: COLORS.elyssa.border, textColor: COLORS.elyssa.text, shape: "round" },
      { label: "Lilia",  color: COLORS.lilia.hex,  bg: COLORS.lilia.bg,  border: COLORS.lilia.border,  textColor: COLORS.lilia.text,  shape: "round" },
      { label: "Tous",   color: COLORS.tous.hex,   bg: COLORS.tous.bg,   border: COLORS.tous.border,   textColor: COLORS.tous.text,   shape: "round" },
    ]},
  ],
  timeline: [
    { label: "Phases", items: [
      { label: "Phase 0 — Fondations",     color: COLORS.phase0.hex,  bg: "#E6EDE2", border: "#8AB09A", textColor: "#2C4030", shape: "bar" },
      { label: "Phase 1 — Build",          color: COLORS.phase1.hex,  bg: "#E8EEE6", border: "#90A898", textColor: "#2C4035", shape: "bar" },
      { label: "Phase 1b — Soft Launch",   color: COLORS.phase1b.hex, bg: "#EDE8E0", border: "#C8B898", textColor: "#6B5B45", shape: "bar" },
      { label: "Phase 2 — Ouverture Hôtel",color: COLORS.phase2.hex,  bg: "#F0E6E0", border: "#D09070", textColor: "#7A3010", shape: "bar" },
      { label: "Phase 3 — Systèmes",       color: COLORS.phase3.hex,  bg: "#EAE6E0", border: "#C0B098", textColor: "#4A3C2E", shape: "bar" },
    ]},
    { label: "Sous-activités", items: [
      { label: "Shooting / Contenu", color: "#B5623A", bg: "#F0E6E0", border: "#D09070", textColor: "#7A3010", shape: "bar" },
      { label: "Rénovation",         color: "#8B7355", bg: "#EAE6E0", border: "#C0B098", textColor: "#4A3C2E", shape: "bar" },
      { label: "Digital / Dev",      color: "#2C4035", bg: "#E4EAE6", border: "#7A9888", textColor: "#1A2E24", shape: "bar" },
    ]},
  ],
  budget: [
    { label: "Enveloppes budget", items: [
      { label: "Digital & Tech",   color: COLORS.bDigital.hex, bg: "#F5EFE2", border: "#D8C090", textColor: "#7A5820", shape: "bar" },
      { label: "Rénovation",       color: COLORS.bRenov.hex,   bg: "#F0E6E0", border: "#D09070", textColor: "#7A3010", shape: "bar" },
      { label: "Contenu",          color: COLORS.bContent.hex, bg: "#E8EEE6", border: "#90A898", textColor: "#2C4035", shape: "bar" },
      { label: "Mktg & Ops",       color: COLORS.bMkt.hex,     bg: "#EDE8E0", border: "#C8B898", textColor: "#6B5B45", shape: "bar" },
    ]},
    { label: "Statut dépenses", items: [
      { label: "Prévu",  color: "#808080", bg: "#EDE8E0", border: "#C8BCAA", textColor: "#6A5E50" },
      { label: "Engagé", color: "#C4A35A", bg: "#F5EFE2", border: "#D8C090", textColor: "#7A5820" },
      { label: "Payé",   color: "#4A6741", bg: "#E6EDE2", border: "#8AB09A", textColor: "#2C4030" },
    ]},
  ],
  decisions: [
    { label: "Statut décision", items: [
      { label: "Prise ✓",    color: COLORS.done.hex,     bg: COLORS.done.bg,     border: COLORS.done.border,     textColor: COLORS.done.text     },
      { label: "En attente", color: COLORS.progress.hex, bg: COLORS.progress.bg, border: COLORS.progress.border, textColor: COLORS.progress.text },
    ]},
  ],
  deps: [
    { label: "Statut asset", items: [
      { label: "Prêt ✓",     color: COLORS.depReady.hex,   bg: "#E6EDE2", border: "#8AB09A", textColor: "#2C4030" },
      { label: "En cours",   color: COLORS.depPending.hex, bg: "#F5EFE2", border: "#D8C090", textColor: "#7A5820" },
      { label: "En attente", color: COLORS.depWaiting.hex, bg: "#EDE8E0", border: "#C8BCAA", textColor: "#6A5E50" },
    ]},
  ],
  lilia: [
    { label: "Statuts tâches", items: [
      { label: "En cours", color: COLORS.progress.hex, bg: COLORS.progress.bg, border: COLORS.progress.border, textColor: COLORS.progress.text },
      { label: "Bloquée",  color: COLORS.blocked.hex,  bg: COLORS.blocked.bg,  border: COLORS.blocked.border,  textColor: COLORS.blocked.text  },
      { label: "Fait ✓",   color: COLORS.done.hex,     bg: COLORS.done.bg,     border: COLORS.done.border,     textColor: COLORS.done.text     },
    ]},
    { label: "Décisions", items: [
      { label: "Votre avis requis", color: "#C4A35A", bg: "#F5EFE2", border: "#D8C090", textColor: "#7A5820" },
      { label: "Prise ✓",          color: "#4A6741", bg: "#E6EDE2", border: "#8AB09A", textColor: "#2C4030" },
    ]},
  ],
};

// ─── Utilities ───────────────────────────────────────────────────────────────
const Ornament = () => (
  <div style={{display:"flex",alignItems:"center",gap:14,margin:"14px 0 0"}}>
    <span style={{display:"block",height:1,width:40,background:"var(--mist)"}}/>
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{color:"var(--gold)",flexShrink:0}}>
      <circle cx="6" cy="6" r="1.8" fill="currentColor"/>
      <circle cx="6" cy="6" r="4.8" stroke="currentColor" strokeWidth="0.7"/>
    </svg>
    <span style={{display:"block",height:1,width:40,background:"var(--mist)"}}/>
  </div>
);
const today = new Date();
const fmtDate = d => { if (!d) return ""; try { return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }); } catch { return d; } };
const isOverdue = d => d && new Date(d) < today;
const fmtTS = ts => { try { return new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); } catch { return ts; } };
const nowISO = () => new Date().toISOString();

const PHASES = [
  { id: "0",  label: "Phase 0 — Fondations",        dates: "Fév – Mar 2026",  color: COLORS.phase0.hex  },
  { id: "1",  label: "Phase 1 — Build & Lancement", dates: "Avr – Mai 2026",  color: COLORS.phase1.hex  },
  { id: "1b", label: "Phase 1b — Soft Launch",       dates: "Juin – Sep 2026", color: COLORS.phase1b.hex },
  { id: "2",  label: "Phase 2 — Ouverture Hôtel",   dates: "Oct – Déc 2026",  color: COLORS.phase2.hex  },
  { id: "3",  label: "Phase 3 — Systèmes Avancés",  dates: "2027+",           color: COLORS.phase3.hex  },
];
const OWNERS = { R: "Rached", E: "Elyssa", L: "Lilia", ALL: "Tous" };

// ─── Badges ──────────────────────────────────────────────────────────────────
const StatusBadge = ({ s }) => {
  const map = {
    todo:         COLORS.todo,
    "in-progress":COLORS.progress,
    review:       COLORS.review,
    done:         COLORS.done,
    blocked:      COLORS.blocked,
  };
  const c = map[s] || COLORS.todo;
  return (
    <span className="badge" style={{ background: c.bg, color: c.text, borderColor: c.border }}>
      {c.label}
    </span>
  );
};

const OwnerBadge = ({ o }) => {
  const map = { R: COLORS.rached, E: COLORS.elyssa, L: COLORS.lilia, ALL: COLORS.tous };
  const c = map[o] || COLORS.rached;
  return (
    <span className="badge owner-badge" style={{ background: c.bg, color: c.text, borderColor: c.border }}>
      {c.label}
    </span>
  );
};

const DecStatusBadge = ({ s }) => {
  const c = s === "open" ? COLORS.progress : COLORS.done;
  const label = s === "open" ? "En attente" : "Prise ✓";
  return <span className="badge" style={{ background: c.bg, color: c.text, borderColor: c.border }}>{label}</span>;
};

// ─── Modals ───────────────────────────────────────────────────────────────────
const TaskModal = ({ task, onSave, onDelete, onClose }) => {
  const [form, setForm] = useState(task || { title: "", phase: "0", status: "todo", owner: "R", due: "", block: "", notes: "", comments: [] });
  const [nc, setNc] = useState("");
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const addComment = () => { if (!nc.trim()) return; setForm(p => ({ ...p, comments: [...(p.comments || []), { id: Date.now(), text: nc.trim(), ts: nowISO() }] })); setNc(""); };
  const delComment = id => setForm(p => ({ ...p, comments: (p.comments || []).filter(c => c.id !== id) }));

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
              <option value="review">En revue</option><option value="done">Fait ✓</option>
              <option value="blocked">Bloquée</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div><label>Responsable</label>
            <select value={form.owner} onChange={e => set("owner", e.target.value)}>
              <option value="R">Rached</option><option value="E">Elyssa</option>
              <option value="L">Lilia</option><option value="ALL">Tous</option>
            </select>
          </div>
          <div><label>Échéance</label><input type="date" value={form.due} onChange={e => set("due", e.target.value)} /></div>
        </div>
        <div className="form-row">
          <div><label>Bloc</label><input value={form.block} onChange={e => set("block", e.target.value)} placeholder="ex: Développement" /></div>
        </div>
        <div className="form-field"><label>Notes</label><textarea rows={2} value={form.notes} onChange={e => set("notes", e.target.value)} /></div>
        <div className="comments-section">
          <div className="comments-label">Mises à jour ({(form.comments || []).length})</div>
          {(form.comments || []).map(c => (
            <div key={c.id} className="comment-item">
              <div className="comment-meta">
                <span>{fmtTS(c.ts)}</span>
                <button onClick={() => delComment(c.id)} style={{ marginLeft: "auto", background: "none", border: "none", color: COLORS.blocked.text, cursor: "pointer", fontSize: 11, fontFamily: "var(--font-mono)" }}>suppr.</button>
              </div>
              <div className="comment-text">{c.text}</div>
            </div>
          ))}
          <div className="comment-add">
            <textarea rows={2} value={nc} onChange={e => setNc(e.target.value)} placeholder="Ajouter une mise à jour… (Ctrl+Entrée)" onKeyDown={e => e.key === "Enter" && e.ctrlKey && addComment()} />
            <button className="btn btn-ghost btn-sm" style={{ whiteSpace: "nowrap", alignSelf: "flex-end" }} onClick={addComment}>+ Ajouter</button>
          </div>
        </div>
        <div className="modal-actions">
          {task && <button className="btn btn-danger btn-sm" onClick={() => onDelete(task.id)}>Supprimer</button>}
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary btn-sm" onClick={() => form.title && onSave(form)}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
};

const DecisionModal = ({ dec, onSave, onDelete, onClose }) => {
  const [form, setForm] = useState(dec || { date: new Date().toLocaleDateString("fr-FR"), decision: "", context: "", by: "Rached + Elyssa", status: "closed" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{dec ? "Modifier la décision" : "Logger une décision"}</div>
        <div className="form-field"><label>Décision</label><textarea rows={3} value={form.decision} onChange={e => set("decision", e.target.value)} /></div>
        <div className="form-field"><label>Contexte / Raison</label><input value={form.context} onChange={e => set("context", e.target.value)} /></div>
        <div className="form-row">
          <div><label>Date</label><input value={form.date} onChange={e => set("date", e.target.value)} /></div>
          <div><label>Décidé par</label><input value={form.by} onChange={e => set("by", e.target.value)} /></div>
        </div>
        <div className="form-field"><label>Statut</label>
          <select value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="closed">Prise ✓</option><option value="open">En attente</option>
          </select>
        </div>
        <div className="modal-actions">
          {dec && <button className="btn btn-danger btn-sm" onClick={() => onDelete(dec.id)}>Supprimer</button>}
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary btn-sm" onClick={() => form.decision && onSave(form)}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
};

const BudgetEntryModal = ({ trackName, onSave, onClose }) => {
  const [form, setForm] = useState({ name: "", amount: "", date: "", status: "prévu" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">Nouvelle dépense — {trackName}</div>
        <div className="form-field"><label>Description</label><input value={form.name} onChange={e => set("name", e.target.value)} /></div>
        <div className="form-row">
          <div><label>Montant (TND)</label><input type="number" value={form.amount} onChange={e => set("amount", e.target.value)} /></div>
          <div><label>Date prévue</label><input type="date" value={form.date} onChange={e => set("date", e.target.value)} /></div>
        </div>
        <div className="form-field"><label>Statut</label>
          <select value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="prévu">Prévu</option><option value="engagé">Engagé</option><option value="payé">Payé</option>
          </select>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary btn-sm" onClick={() => form.name && onSave({ ...form, amount: parseFloat(form.amount) || 0, id: Date.now() })}>Ajouter</button>
        </div>
      </div>
    </div>
  );
};

// ─── Initial data ────────────────────────────────────────────────────────────
const INIT_TASKS = [
  { id:1,  phase:"0",  title:"Enregistrer les domaines (.tn + .com)",                status:"todo",        owner:"R",   due:"2026-03-05", block:"Infrastructure", notes:"Recommandation: les deux", comments:[] },
  { id:2,  phase:"0",  title:"Configurer Google Business Profile",                   status:"todo",        owner:"R",   due:"2026-03-05", block:"Infrastructure", notes:"", comments:[] },
  { id:3,  phase:"0",  title:"Configurer WhatsApp Business",                         status:"todo",        owner:"R",   due:"2026-03-10", block:"Infrastructure", notes:"", comments:[] },
  { id:4,  phase:"0",  title:"Lancer compte Instagram + premiers posts making-of",   status:"todo",        owner:"E",   due:"2026-03-31", block:"Contenu",        notes:"", comments:[] },
  { id:5,  phase:"0",  title:"Shooting photos Phase I (oranges sur les arbres)",     status:"in-progress", owner:"E",   due:"2026-03-15", block:"Contenu",        notes:"Avant que les oranges tombent", comments:[] },
  { id:6,  phase:"0",  title:"Relecture version FR des textes site web",             status:"in-progress", owner:"L",   due:"2026-03-01", block:"Contenu",        notes:"Lilia → retours à Rached", comments:[] },
  { id:7,  phase:"0",  title:"Validation finale des logos (1 parmi 5 propositions)",status:"in-progress", owner:"ALL", due:"2026-03-15", block:"Branding",       notes:"Mi-mars deadline", comments:[] },
  { id:8,  phase:"0",  title:"Choisir direction design site web",                   status:"todo",        owner:"ALL", due:"2026-03-20", block:"Design",         notes:"Après recherche concurrentielle", comments:[] },
  { id:9,  phase:"0",  title:"Confirmer tech stack + CMS",                          status:"done",        owner:"R",   due:"2026-02-23", block:"Technique",      notes:"React/Node/TypeScript décidé", comments:[] },
  { id:10, phase:"0",  title:"Recherche concurrentielle (Aman, Babylonstoren, TN)", status:"in-progress", owner:"R",   due:"2026-03-05", block:"Stratégie",      notes:"", comments:[] },
  { id:11, phase:"1",  title:"Développer le site vitrine (4 piliers)",               status:"todo",        owner:"R",   due:"2026-04-30", block:"Développement",  notes:"Après validation logo + design", comments:[] },
  { id:12, phase:"1",  title:"Intégrer photos Phase I au site",                     status:"todo",        owner:"R",   due:"2026-05-01", block:"Développement",  notes:"", comments:[] },
  { id:13, phase:"1",  title:"Mise en ligne site web (showcase + contact)",         status:"todo",        owner:"R",   due:"2026-05-15", block:"Lancement",      notes:"", comments:[] },
  { id:14, phase:"1",  title:"Activer capture email Brevo",                         status:"todo",        owner:"R",   due:"2026-05-15", block:"Marketing",      notes:"", comments:[] },
  { id:15, phase:"1",  title:"Démarrage rénovation maison principale",              status:"todo",        owner:"E",   due:"2026-04-06", block:"Travaux",        notes:"Semaine du 6 avril", comments:[] },
  { id:16, phase:"1",  title:"Étude bâtiment Wellness (ancienne étable)",           status:"in-progress", owner:"E",   due:"2026-04-30", block:"Travaux",        notes:"Plans pas encore finalisés", comments:[] },
  { id:17, phase:"1",  title:"Shooting Phase II — Making-of rénovation",            status:"todo",        owner:"E",   due:"2026-06-30", block:"Contenu",        notes:"2 jours: début + milieu travaux", comments:[] },
  { id:18, phase:"1b", title:"Activer réservation restaurant + wellness",           status:"todo",        owner:"R",   due:"2026-08-01", block:"Développement",  notes:"", comments:[] },
  { id:19, phase:"2",  title:"Système de réservation des chambres (Dar Saad 6 rms)",status:"todo",       owner:"R",   due:"2026-11-01", block:"Développement",  notes:"", comments:[] },
  { id:20, phase:"2",  title:"Intégration paiement Konnect + Stripe",              status:"todo",        owner:"R",   due:"2026-11-01", block:"Développement",  notes:"", comments:[] },
  { id:21, phase:"2",  title:"Listings OTA (Booking.com, Airbnb)",                 status:"todo",        owner:"E",   due:"2026-11-15", block:"Distribution",   notes:"", comments:[] },
  { id:22, phase:"2",  title:"Shooting Phase III — produit final post-rénovation", status:"todo",        owner:"E",   due:"2026-10-01", block:"Contenu",        notes:"Chambres décorées", comments:[] },
  { id:23, phase:"2",  title:"Lancement Agrumia Club + événement",                 status:"todo",        owner:"ALL", due:"2026-07-01", block:"Stratégie",      notes:"Summer 2026", comments:[] },
];

const INIT_BUDGET = {
  digital:   { name:"Digital & Tech",           color:COLORS.bDigital.hex, total:140000, entries:[
    {id:1,name:"Site vitrine (4 piliers, FR/EN, géo-adaptatif)",amount:25000,date:"2026-05-01",status:"prévu"},
    {id:2,name:"Système réservation + paiement (Konnect + Stripe)",amount:45000,date:"2026-11-01",status:"prévu"},
    {id:3,name:"Dashboard interne + systèmes avancés (Phase 3)",amount:40000,date:"2027-01-01",status:"prévu"},
    {id:4,name:"SaaS: Brevo, domaines, hébergement, Konnect",amount:8000,date:"2026-05-01",status:"prévu"},
    {id:5,name:"SEO, blog, programme fidélisation",amount:12000,date:"2027-01-01",status:"prévu"},
  ]},
  renov:     { name:"Rénovation & Construction", color:COLORS.bRenov.hex,   total:0,      entries:[
    {id:1,name:"Rénovation maison principale",amount:0,date:"2026-04-06",status:"prévu"},
    {id:2,name:"Aménagement Wellness (ancienne étable)",amount:0,date:"2026-07-01",status:"prévu"},
    {id:3,name:"Rénovation garage → Agrumia Club",amount:0,date:"2026-09-01",status:"prévu"},
  ]},
  content:   { name:"Production Contenu",        color:COLORS.bContent.hex, total:0,      entries:[
    {id:1,name:"Shooting Phase I + édition",amount:0,date:"2026-03-15",status:"prévu"},
    {id:2,name:"Shooting Phase II — Making-of (×2 jours)",amount:0,date:"2026-06-01",status:"prévu"},
    {id:3,name:"Shooting Phase III — produit final",amount:0,date:"2026-10-01",status:"prévu"},
    {id:4,name:"Production vidéo Instagram / Reels",amount:0,date:"2026-04-01",status:"prévu"},
  ]},
  marketing: { name:"Opérations & Marketing",    color:COLORS.bMkt.hex,     total:0,      entries:[
    {id:1,name:"Google Ads — lancement site",amount:0,date:"2026-05-01",status:"prévu"},
    {id:2,name:"Meta Ads — restaurant / wellness",amount:0,date:"2026-07-01",status:"prévu"},
    {id:3,name:"Événement lancement Agrumia Club",amount:0,date:"2026-07-01",status:"prévu"},
    {id:4,name:"Commissions OTA ~15% (Booking, Airbnb)",amount:0,date:"2026-11-01",status:"prévu"},
  ]},
};

const INIT_DECISIONS = [
  {id:1,  date:"23/02/2026", decision:"Rached développe tout lui-même (React/Node/TypeScript)",                                           context:"Coût, contrôle, cohérence technique",              by:"Rached",             status:"closed"},
  {id:2,  date:"23/02/2026", decision:"Site unique géo-adaptatif (1 URL, contenu selon pays visiteur)",                                   context:"FR pour Tunisie, EN pour international",           by:"Rached + Elyssa",    status:"closed"},
  {id:3,  date:"23/02/2026", decision:"Lancement hybride: vitrine hôtel + réservation resto/wellness dès ouverture piliers",              context:"Phase 1b quand les piliers ouvrent",               by:"Rached + Elyssa",    status:"closed"},
  {id:4,  date:"23/02/2026", decision:"Suppression portail membre Agrumia — wellness en pay-per-visit",                                   context:"Simplification Phase 1",                           by:"Rached + Elyssa",    status:"closed"},
  {id:5,  date:"23/02/2026", decision:"PM: Google Sheets + WhatsApp + screenshots pour Lilia",                                            context:"Tooling minimal adapté à l'équipe",                by:"Rached + Elyssa",    status:"closed"},
  {id:6,  date:"",           decision:"Nom de domaine: .tn primaire + .com redirect?",                                                    context:"Recommandation: oui aux deux",                     by:"Rached + Elyssa",    status:"open"},
  {id:7,  date:"",           decision:"Choix direction design (1 des 5 propositions)",                                                    context:"Après résultats recherche concurrentielle",        by:"Lilia + Elyssa + Rached", status:"open"},
  {id:8,  date:"",           decision:"Approche CMS: Markdown statique ou Sanity.io?",                                                    context:"Sanity si Elyssa doit éditer seule",              by:"Rached",             status:"open"},
  {id:9,  date:"",           decision:"Budget SaaS Phase 2: iCal gratuit vs Channex.io ~3-5$/chambre/mois",                               context:"",                                                 by:"Lilia + Elyssa",     status:"open"},
  {id:10, date:"",           decision:"Fournisseur WhatsApp Business API (Twilio vs Meta direct)",                                        context:"À décider à l'ouverture restaurant",              by:"Rached",             status:"open"},
];

const INIT_DEPS = [
  {id:1,title:"Textes Site Web",owner:"Lilia → Rached",items:[
    {name:"Version FR",status:"ready",note:"Prête, en attente relecture Lilia"},
    {name:"Relecture & validation Lilia",status:"pending",note:"En cours"},
    {name:"Version EN",status:"ready",note:"Prête"},
    {name:"Prix et tarifs finalisés",status:"waiting",note:"À déterminer"},
  ]},
  {id:2,title:"Logos & Identité",owner:"Agence → Rached",items:[
    {name:"5 propositions livrées",status:"ready",note:"En phase de revue"},
    {name:"Feedback équipe",status:"pending",note:"En cours"},
    {name:"Validation finale",status:"pending",note:"Mi-mars 2026"},
    {name:"Fichiers finaux (SVG…)",status:"waiting",note:"Post-validation"},
  ]},
  {id:3,title:"Photos Phase I",owner:"Elyssa → Rached",items:[
    {name:"Shooting propriété (orangers)",status:"pending",note:"Fév/Mars 2026"},
    {name:"Édition + upload Drive",status:"waiting",note:"Post-shooting"},
    {name:"Intégration site web",status:"waiting",note:"Dépend Phase I"},
  ]},
  {id:4,title:"Photos Phase II",owner:"Elyssa → Rached",items:[
    {name:"Shooting making-of début travaux",status:"waiting",note:"Avr/Mai 2026"},
    {name:"Shooting making-of milieu travaux",status:"waiting",note:"Mai/Juin 2026"},
    {name:"Contenu teasers Instagram",status:"waiting",note:"En parallèle"},
  ]},
  {id:5,title:"Rénovation & Espaces",owner:"Elyssa → équipe",items:[
    {name:"Devis maison principale",status:"ready",note:"Obtenu"},
    {name:"Démarrage travaux maison",status:"pending",note:"Semaine du 6 avril"},
    {name:"Plans espace Wellness",status:"pending",note:"En cours d'études"},
    {name:"Calendrier travaux Wellness",status:"waiting",note:"Pas encore finalisé"},
  ]},
  {id:6,title:"Direction Design Site",owner:"Tous → Rached",items:[
    {name:"Recherche concurrentielle",status:"pending",note:"En cours"},
    {name:"Choix direction (1/5)",status:"waiting",note:"Réunion Mars 2026"},
    {name:"Démarrage développement site",status:"waiting",note:"Bloque Phase 1"},
  ]},
];

// ─── Views ────────────────────────────────────────────────────────────────────
const Dashboard = ({ tasks, budget, decisions }) => {
  const done = tasks.filter(t=>t.status==="done").length;
  const inProg = tasks.filter(t=>t.status==="in-progress").length;
  const blocked = tasks.filter(t=>t.status==="blocked").length;
  const openDec = decisions.filter(d=>d.status==="open").length;
  const upcoming = tasks.filter(t=>t.status!=="done"&&t.due).sort((a,b)=>new Date(a.due)-new Date(b.due)).slice(0,6);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Vue d'<em>ensemble</em></div>
        <div className="page-sub">{today.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}</div>
        <Ornament/>
      </div>

      <Legend groups={LEGENDS.dashboard} />

      <div className="stat-grid">
        {[
          { label:"Tâches accomplies",     val:`${done}/${tasks.length}`, note:`${Math.round(done/tasks.length*100)}% du total`, color: COLORS.done.hex    },
          { label:"En cours",              val:inProg,  note:"tâches actives",           color: COLORS.progress.hex },
          { label:"Bloquées",              val:blocked, note:blocked>0?"action requise":"aucune",      color: COLORS.blocked.hex  },
          { label:"Décisions en attente",  val:openDec, note:"à trancher",               color: COLORS.review.hex   },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{borderTop:`2px solid ${s.color}`}}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.val === blocked && blocked > 0 ? COLORS.blocked.text : "var(--ink)" }}>{s.val}</div>
            <div className="stat-note">{s.note}</div>
          </div>
        ))}
      </div>

      <div className="g2" style={{ marginBottom: 24 }}>
        <div className="card card-p">
          <div className="section-label">Avancement par phase</div>
          {PHASES.map(p => {
            const pT = tasks.filter(t=>t.phase===p.id);
            const pD = pT.filter(t=>t.status==="done").length;
            const pct = pT.length ? Math.round(pD/pT.length*100) : 0;
            return (
              <div key={p.id} className="phase-block">
                <div className="phase-header">
                  <span className="phase-name">{p.label}</span>
                  <span className="phase-meta">{pD}/{pT.length} · {p.dates}</span>
                </div>
                <div className="phase-track"><div className="phase-fill" style={{width:`${pct}%`,background:p.color}}/></div>
              </div>
            );
          })}
        </div>
        <div className="card card-p">
          <div className="section-label">Prochaines échéances</div>
          {upcoming.map(t => (
            <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
              <div style={{flex:1,marginRight:12}}>
                <div style={{fontSize:13,marginBottom:5}}>{t.title}</div>
                <div style={{display:"flex",gap:6}}><OwnerBadge o={t.owner}/><StatusBadge s={t.status}/></div>
              </div>
              <div className={`task-due ${isOverdue(t.due)?"task-overdue":""}`} style={{fontSize:11,whiteSpace:"nowrap"}}>
                {isOverdue(t.due)?"⚠ ":""}{fmtDate(t.due)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card card-p">
        <div className="section-label">Budget consolidé</div>
        <div className="g4">
          {Object.entries(budget).map(([k,t]) => {
            const paid = t.entries.filter(e=>e.status==="payé").reduce((s,e)=>s+e.amount,0);
            const eng  = t.entries.filter(e=>e.status==="engagé").reduce((s,e)=>s+e.amount,0);
            const prev = t.entries.filter(e=>e.status==="prévu").reduce((s,e)=>s+e.amount,0);
            const pct  = t.total>0 ? Math.min(100,Math.round((paid+eng+prev)/t.total*100)) : 0;
            return (
              <div key={k} style={{borderTop:`3px solid ${t.color}`,paddingTop:14}}>
                <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{t.name}</div>
                <div style={{fontFamily:"var(--font-disp)",fontSize:20,color:"var(--ink)"}}>{t.total>0?`${t.total.toLocaleString()} TND`:"À définir"}</div>
                {t.total>0&&<div className="phase-track" style={{marginTop:8}}><div className="phase-fill" style={{width:`${pct}%`,background:t.color}}/></div>}
                <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",marginTop:5}}>{paid.toLocaleString()} payé · {eng.toLocaleString()} engagé</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const TaskBoard = ({ tasks, setTasks }) => {
  const [ownerF, setOwnerF] = useState("ALL");
  const [phaseF, setPhaseF] = useState("ALL");
  const [modal, setModal] = useState(null);

  const COLS = [
    {id:"todo",        label:"À faire",  hColor: COLORS.todo.text     },
    {id:"in-progress", label:"En cours", hColor: COLORS.progress.text },
    {id:"review",      label:"En revue", hColor: COLORS.review.text   },
    {id:"done",        label:"Fait ✓",   hColor: COLORS.done.text     },
    {id:"blocked",     label:"Bloquée",  hColor: COLORS.blocked.text, colBg: COLORS.blocked.bg, colBorder: COLORS.blocked.border },
  ];

  const filtered = tasks.filter(t=>(ownerF==="ALL"||t.owner===ownerF)&&(phaseF==="ALL"||t.phase===phaseF));
  const save = form => { if(form.id) setTasks(p=>p.map(t=>t.id===form.id?form:t)); else setTasks(p=>[...p,{...form,id:Date.now(),comments:[]}]); setModal(null); };
  const del  = id => { setTasks(p=>p.filter(t=>t.id!==id)); setModal(null); };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24}}>
        <div className="page-header" style={{marginBottom:0}}>
          <div className="page-title">Tableau des <em>tâches</em></div>
          <div className="page-sub">{filtered.length} tâches · Kanban — 5 statuts</div>
          <Ornament/>
        </div>
        <button className="btn btn-primary" onClick={()=>setModal("new")}>+ Nouvelle tâche</button>
      </div>

      <Legend groups={LEGENDS.tasks} />

      <div className="filter-bar">
        <span className="filter-label">Responsable</span>
        {["ALL","R","E","L"].map(o=>(
          <button key={o} className={`filter-btn ${ownerF===o?"active":""}`} onClick={()=>setOwnerF(o)}>
            {o==="ALL"?"Tous":OWNERS[o]}
          </button>
        ))}
        <span className="filter-label" style={{marginLeft:8}}>Phase</span>
        {["ALL",...PHASES.map(p=>p.id)].map(p=>(
          <button key={p} className={`filter-btn ${phaseF===p?"active":""}`} onClick={()=>setPhaseF(p)}>
            {p==="ALL"?"Toutes":`Ph. ${p}`}
          </button>
        ))}
      </div>

      <div className="kanban">
        {COLS.map(col=>{
          const colTasks = filtered.filter(t=>t.status===col.id);
          return (
            <div key={col.id} className="k-col" style={col.colBg?{background:col.colBg,borderColor:col.colBorder}:{}}>
              <div className="k-col-header" style={{color:col.hColor}}>
                <span>{col.label}</span>
                <span className="k-count">{colTasks.length}</span>
              </div>
              {colTasks.map(t=>(
                <div key={t.id} className="task-card" onClick={()=>setModal(t)}>
                  <div className="task-title">{t.title}</div>
                  <div className="task-meta">
                    <OwnerBadge o={t.owner}/>
                    {t.due&&<span className={`task-due ${isOverdue(t.due)&&col.id!=="done"?"task-overdue":""}`}>{fmtDate(t.due)}</span>}
                    {t.block&&<span className="task-block-tag">#{t.block}</span>}
                  </div>
                  {t.comments?.length>0&&<div className="task-comments-indicator">💬 {t.comments.length} mise{t.comments.length>1?"s":""} à jour</div>}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      {modal&&<TaskModal task={modal==="new"?null:modal} onSave={save} onDelete={del} onClose={()=>setModal(null)}/>}
    </div>
  );
};

const Timeline = () => {
  const months = ["Fév 26","Mar 26","Avr 26","Mai 26","Jun 26","Jul 26","Aoû 26","Sep 26","Oct 26","Nov 26","Déc 26","2027+"];
  const bars = [
    {label:"Phase 0 — Fondations",        start:0,  span:2,   color:COLORS.phase0.hex},
    {label:"Phase 1 — Build",             start:2,  span:2,   color:COLORS.phase1.hex},
    {label:"Phase 1b — Soft Launch",      start:4,  span:4,   color:COLORS.phase1b.hex},
    {label:"Phase 2 — Hôtel",             start:8,  span:3,   color:COLORS.phase2.hex},
    {label:"Phase 3 — Systèmes",          start:11, span:1,   color:COLORS.phase3.hex},
    {label:"Shooting Phase I",            start:0,  span:1.5, color:"#D4A96A"},
    {label:"Logos & direction design",    start:0.5,span:1.5, color:"#C49A60"},
    {label:"Rénovation maison",           start:2,  span:5,   color:"#C07050"},
    {label:"Making-of Instagram",         start:2,  span:4,   color:"#70A8C0"},
    {label:"Dév. site vitrine",           start:2,  span:2,   color:"#70A870"},
    {label:"Site en ligne",               start:3.5,span:0.5, color:"#4A8850"},
    {label:"Shooting Phase II",           start:3,  span:2,   color:"#D4A96A"},
    {label:"Ouverture resto + wellness",  start:4,  span:1,   color:"#509898"},
    {label:"Lancement Agrumia",           start:5,  span:1,   color:"#8060A8"},
    {label:"Shooting Phase III",          start:7,  span:1,   color:"#D4A96A"},
    {label:"Ouverture hôtel Dar Saad",    start:8,  span:1,   color:COLORS.phase2.hex},
    {label:"Réservation + OTA en ligne",  start:9,  span:3,   color:"#A04828"},
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Timeline du <em>projet</em></div>
        <div className="page-sub">Fév 2026 → 2027+</div>
        <Ornament/>
      </div>

      <Legend groups={LEGENDS.timeline} />

      <div className="card card-p" style={{marginBottom:24}}>
        <div className="tl-wrap">
          <div className="tl-grid" style={{borderBottom:"1px solid var(--border)",marginBottom:8}}>
            <div style={{borderRight:"1px solid var(--border)"}}/>
            {months.map((m,i)=><div key={m} className={`tl-hcell ${i===0?"current":""}`}>{m}</div>)}
          </div>
          {bars.map((b,idx)=>(
            <div key={idx} className="tl-grid" style={{marginBottom:4}}>
              <div className="tl-label">{b.label}</div>
              {Array.from({length:12}).map((_,ci)=>{
                const inBar = ci>=b.start&&ci<b.start+b.span;
                const isStart=ci===Math.floor(b.start);
                const isEnd=ci>=b.start+b.span-1&&ci<b.start+b.span;
                return (
                  <div key={ci} className="tl-cell">
                    {inBar&&<div className="tl-bar" style={{
                      background:`${b.color}BB`,
                      borderRadius: isStart&&isEnd?4:isStart?"4px 0 0 4px":isEnd?"0 4px 4px 0":0,
                      borderLeft: isStart?`3px solid ${b.color}`:"none",
                      borderRight:isEnd?`3px solid ${b.color}`:"none",
                    }}/>}
                  </div>
                );
              })}
            </div>
          ))}
          <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:COLORS.rached.text,marginTop:12,paddingLeft:190,borderTop:"1px dashed "+COLORS.rached.hex}}>
            ◆ Aujourd'hui — Fév 2026
          </div>
        </div>
      </div>

      <div className="section-label">Jalons clés</div>
      <div className="milestone-grid">
        {[["Mi-mars 2026","Logos validés"],["Mars 2026","Direction design choisie"],["6 avril 2026","Démarrage rénovations"],["Mai 2026","Site web en ligne"],["Été 2026","Ouverture restaurant + wellness"],["Été 2026","Lancement Agrumia Club"],["Post-Ramadan 2026","Ouverture hôtel Dar Saad"],["T4 2026","Réservation en ligne opérationnelle"],["2027+","Systèmes avancés & fidélisation"]].map(([d,l])=>(
          <div key={l} className="milestone-card"><div className="milestone-date">{d}</div><div className="milestone-label">{l}</div></div>
        ))}
      </div>
    </div>
  );
};

const Budget = ({ budget, setBudget }) => {
  const [modal, setModal] = useState(null);
  const addEntry  = (k,e) => { setBudget(p=>({...p,[k]:{...p[k],entries:[...p[k].entries,e]}})); setModal(null); };
  const removeEntry = (k,eid) => setBudget(p=>({...p,[k]:{...p[k],entries:p[k].entries.filter(e=>e.id!==eid)}}));
  const updateTotal = (k,v) => setBudget(p=>({...p,[k]:{...p[k],total:parseFloat(v)||0}}));
  const updateEntry = (k,eid,f,v) => setBudget(p=>({...p,[k]:{...p[k],entries:p[k].entries.map(e=>e.id===eid?{...e,[f]:f==="amount"?parseFloat(v)||0:v}:e)}}));

  const statusStyle = { prévu: COLORS.bPrevu, engagé: COLORS.bEngage, payé: COLORS.bPaye };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Suivi <em>budget</em></div>
        <div className="page-sub">4 enveloppes</div>
        <Ornament/>
      </div>

      <Legend groups={LEGENDS.budget} />

      <div className="g3" style={{marginBottom:24}}>
        {[
          {label:"Budget total",  val:Object.values(budget).reduce((s,t)=>s+t.total,0), color:"var(--ink)"},
          {label:"Engagé / prévu",val:Object.values(budget).reduce((s,t)=>s+t.entries.filter(e=>e.status!=="payé").reduce((a,e)=>a+e.amount,0),0), color:COLORS.bEngage.text},
          {label:"Payé",          val:Object.values(budget).reduce((s,t)=>s+t.entries.filter(e=>e.status==="payé").reduce((a,e)=>a+e.amount,0),0), color:COLORS.bPaye.text},
        ].map(s=>(
          <div key={s.label} className="card card-p-sm">
            <div className="stat-label">{s.label}</div>
            <div style={{fontFamily:"var(--font-disp)",fontSize:26,color:s.color}}>{s.val.toLocaleString()} <span style={{fontSize:13,color:"var(--muted)",fontFamily:"var(--font-mono)"}}>TND</span></div>
          </div>
        ))}
      </div>

      {Object.entries(budget).map(([key,track])=>{
        const paid = track.entries.filter(e=>e.status==="payé").reduce((s,e)=>s+e.amount,0);
        const eng  = track.entries.filter(e=>e.status==="engagé").reduce((s,e)=>s+e.amount,0);
        const prev = track.entries.filter(e=>e.status==="prévu").reduce((s,e)=>s+e.amount,0);
        const pct  = track.total>0?Math.min(100,Math.round((paid+eng+prev)/track.total*100)):0;
        return (
          <div key={key} className="card card-p budget-section">
            <div className="budget-header">
              <div className="budget-name"><div className="budget-stripe" style={{background:track.color}}/>{track.name}</div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <input type="number" value={track.total||""} onChange={e=>updateTotal(key,e.target.value)} placeholder="À définir" style={{width:120,textAlign:"right",padding:"5px 10px",fontSize:13}}/>
                <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted)"}}>TND</span>
                <button className="btn btn-ghost btn-sm" onClick={()=>setModal(key)}>+ Dépense</button>
              </div>
            </div>
            {track.total>0&&<div style={{marginBottom:14}}>
              <div className="budget-track"><div className="budget-fill" style={{width:`${pct}%`,background:track.color}}/></div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",marginTop:5}}>
                {paid.toLocaleString()} payé · {eng.toLocaleString()} engagé · {prev.toLocaleString()} prévu · {pct}% alloué
              </div>
            </div>}
            {track.entries.map(e=>{
              const sc = statusStyle[e.status]||COLORS.bPrevu;
              return (
                <div key={e.id} className="budget-entry" style={{background:sc.bg}}>
                  <div className="budget-entry-left">
                    <div className="budget-entry-name">{e.name}</div>
                    <div className="budget-entry-meta">
                      {e.date&&<span>{fmtDate(e.date)} · </span>}
                      <select value={e.status} onChange={ev=>updateEntry(key,e.id,"status",ev.target.value)}
                        style={{width:"auto",padding:"1px 6px",fontSize:10,background:"transparent",border:`1px solid ${sc.border||"var(--mist)"}`,borderRadius:20,color:sc.text}}>
                        <option value="prévu">prévu</option><option value="engagé">engagé</option><option value="payé">payé</option>
                      </select>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <input type="number" value={e.amount||""} onChange={ev=>updateEntry(key,e.id,"amount",ev.target.value)} placeholder="0" style={{width:110,textAlign:"right",padding:"4px 8px",fontSize:13}}/>
                    <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted)"}}>TND</span>
                    <button className="btn btn-ghost btn-sm" style={{padding:"3px 8px",color:COLORS.blocked.text,borderColor:"transparent"}} onClick={()=>removeEntry(key,e.id)}>✕</button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      {modal&&<BudgetEntryModal trackName={budget[modal].name} onSave={e=>addEntry(modal,e)} onClose={()=>setModal(null)}/>}
    </div>
  );
};

const Decisions = ({ decisions, setDecisions }) => {
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const save = form => { if(form.id) setDecisions(p=>p.map(d=>d.id===form.id?form:d)); else setDecisions(p=>[...p,{...form,id:Date.now()}]); setModal(null); };
  const del  = id => { setDecisions(p=>p.filter(d=>d.id!==id)); setModal(null); };
  const filtered = decisions.filter(d=>filter==="ALL"||d.status===filter);

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24}}>
        <div className="page-header" style={{marginBottom:0}}>
          <div className="page-title">Journal des <em>décisions</em></div>
          <div className="page-sub">{decisions.filter(d=>d.status==="open").length} en attente · {decisions.filter(d=>d.status==="closed").length} prises</div>
          <Ornament/>
        </div>
        <button className="btn btn-primary" onClick={()=>setModal("new")}>+ Logger</button>
      </div>

      <Legend groups={LEGENDS.decisions} />

      <div className="filter-bar">
        {["ALL","open","closed"].map(f=>(
          <button key={f} className={`filter-btn ${filter===f?"active":""}`} onClick={()=>setFilter(f)}>
            {f==="ALL"?"Toutes":f==="open"?"En attente":"Prises"}
          </button>
        ))}
      </div>

      <div className="card" style={{overflow:"hidden"}}>
        <table className="dec-table">
          <thead><tr>
            <th style={{width:100}}>Date</th><th>Décision</th>
            <th style={{width:150}}>Par</th><th style={{width:110,textAlign:"center"}}>Statut</th>
          </tr></thead>
          <tbody>
            {filtered.map(d=>(
              <tr key={d.id} onClick={()=>setModal(d)}>
                <td><span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted)"}}>{d.date||"—"}</span></td>
                <td>
                  <div style={{lineHeight:1.4,marginBottom:3}}>{d.decision}</div>
                  {d.context&&<div style={{fontSize:12,color:"var(--muted)",fontStyle:"italic"}}>{d.context}</div>}
                </td>
                <td><span style={{fontFamily:"var(--font-mono)",fontSize:11}}>{d.by}</span></td>
                <td style={{textAlign:"center"}}><DecStatusBadge s={d.status}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal&&<DecisionModal dec={modal==="new"?null:modal} onSave={save} onDelete={del} onClose={()=>setModal(null)}/>}
    </div>
  );
};

const Dependencies = ({ deps }) => {
  const si = {
    ready:   { label:"Prêt ✓",     color:COLORS.depReady.hex,   textColor:"#1A6838" },
    pending: { label:"En cours",   color:COLORS.depPending.hex, textColor:"#8C4C10" },
    waiting: { label:"En attente", color:COLORS.depWaiting.hex, textColor:"#7A6A58" },
  };
  return (
    <div>
      <div className="page-header">
        <div className="page-title">Dépendances & <em>assets</em></div>
        <div className="page-sub">Ce dont Rached a besoin pour avancer</div>
        <Ornament/>
      </div>
      <Legend groups={LEGENDS.deps} />
      <div className="dep-grid">
        {deps.map(dep=>(
          <div key={dep.id} className="dep-card">
            <div className="dep-card-title">{dep.title}</div>
            <div className="dep-card-owner">{dep.owner}</div>
            {dep.items.map((item,i)=>(
              <div key={i} className="dep-item">
                <div>
                  <div className="dep-item-name">{item.name}</div>
                  {item.note&&<div className="dep-item-note">{item.note}</div>}
                </div>
                <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:si[item.status]?.textColor,whiteSpace:"nowrap",fontWeight:500}}>
                  {si[item.status]?.label}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Lilia's AI-personalized view ────────────────────────────────────────────
const LiliaView = ({ tasks, decisions, budget }) => {
  const done      = tasks.filter(t=>t.status==="done").length;
  const blocked   = tasks.filter(t=>t.status==="blocked").length;
  const openDec   = decisions.filter(d=>d.status==="open").length;
  const active    = tasks.filter(t=>t.status==="in-progress"||t.status==="blocked");
  const openD     = decisions.filter(d=>d.status==="open");

  // Budget helpers
  const totalBudget   = Object.values(budget).reduce((s,t)=>s+t.total,0);
  const totalPaid     = Object.values(budget).reduce((s,t)=>s+t.entries.filter(e=>e.status==="payé").reduce((a,e)=>a+e.amount,0),0);
  const totalEngaged  = Object.values(budget).reduce((s,t)=>s+t.entries.filter(e=>e.status==="engagé").reduce((a,e)=>a+e.amount,0),0);
  const bigExpenses   = Object.entries(budget).flatMap(([,t])=>t.entries.filter(e=>e.amount>=10000)).sort((a,b)=>b.amount-a.amount);

  // AI personalization
  const [wish, setWish]           = useState("");
  const [aiView, setAiView]       = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  const projectSnapshot = `
Projet: Domaine Sidi Abdallah (DSA) — propriété agritouristique de luxe, Mohammedia, Tunisie.
Lilia est la propriétaire et financière du projet. Elle doit approuver toutes les dépenses importantes et toutes les décisions business et artistiques majeures.
Date: ${today.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}

Avancement: ${done}/${tasks.length} tâches terminées.
Tâches bloquées: ${blocked}.
Décisions en attente de validation: ${openDec}.
Budget Digital & Tech alloué: 140 000 TND.
Budget total tous postes: ${totalBudget.toLocaleString()} TND alloué.
Total payé à ce jour: ${totalPaid.toLocaleString()} TND.
Total engagé: ${totalEngaged.toLocaleString()} TND.

Décisions en attente (nécessitent l'avis de Lilia):
${openD.map(d=>`- ${d.decision}${d.context?" ("+d.context+")":""}`).join("\n")}

Grosses dépenses prévues (≥10 000 TND):
${bigExpenses.map(e=>`- ${e.name}: ${e.amount.toLocaleString()} TND (${e.status})`).join("\n")}

Phases du projet:
${PHASES.map(p=>{ const pT=tasks.filter(t=>t.phase===p.id); const pD=pT.filter(t=>t.status==="done").length; return `- ${p.label}: ${pD}/${pT.length} tâches · ${p.dates}`; }).join("\n")}
`;

  const askAI = async () => {
    if (!wish.trim()) return;
    setAiLoading(true); setAiError(""); setAiView(null); setSubmitted(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Tu es l'assistant de Lilia, propriétaire du Domaine Sidi Abdallah. Réponds uniquement en JSON valide, sans balises markdown ni backticks. Le JSON doit avoir exactement cette structure:
{
  "greeting": "phrase d'accueil personnalisée courte pour Lilia (1 phrase)",
  "sections": [
    { "id": "decisions", "show": true/false, "priority": 1-5, "customTitle": "titre personnalisé ou null" },
    { "id": "budget_approvals", "show": true/false, "priority": 1-5, "customTitle": "titre ou null" },
    { "id": "budget_overview", "show": true/false, "priority": 1-5, "customTitle": "titre ou null" },
    { "id": "progress", "show": true/false, "priority": 1-5, "customTitle": "titre ou null" },
    { "id": "milestones", "show": true/false, "priority": 1-5, "customTitle": "titre ou null" }
  ],
  "note": "une note courte de 1-2 phrases expliquant comment tu as organisé la vue pour Lilia"
}
Trie les sections par priorité croissante (1 = premier affiché). Adapte la priorité à ce que Lilia a exprimé.`,
          messages: [{
            role: "user",
            content: `Voici l'état du projet:\n${projectSnapshot}\n\nLilia dit: "${wish}"\n\nAdapte l'organisation de sa vue personnelle en conséquence.`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==="text")?.text || "";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      setAiView(parsed);
    } catch(e) {
      setAiError("Impossible de personnaliser la vue pour l'instant. La vue par défaut est affichée ci-dessous.");
    }
    setAiLoading(false);
  };

  // Resolve section order: AI-driven or default
  const DEFAULT_SECTIONS = [
    { id:"decisions",       priority:1, show:true, customTitle:null },
    { id:"budget_approvals",priority:2, show:true, customTitle:null },
    { id:"budget_overview", priority:3, show:true, customTitle:null },
    { id:"progress",        priority:4, show:true, customTitle:null },
    { id:"milestones",      priority:5, show:true, customTitle:null },
  ];
  const activeSections = (aiView?.sections || DEFAULT_SECTIONS).filter(s=>s.show).sort((a,b)=>a.priority-b.priority);

  const SECTION_TITLES = {
    decisions:        "Décisions en attente de votre validation",
    budget_approvals: "Dépenses importantes à approuver",
    budget_overview:  "Suivi du budget global",
    progress:         "Avancement du projet par phase",
    milestones:       "Prochains jalons",
  };

  const sectionTitle = s => s.customTitle || SECTION_TITLES[s.id];

  return (
    <div>
      {/* ── AI Personalization input ── */}
      <div style={{
        background:"linear-gradient(135deg,#EDE6D8 0%,#F7F3EC 100%)",
        border:"1px solid var(--mist)", borderRadius:"var(--radius)",
        padding:"28px 32px", marginBottom:28,
      }}>
        <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
          <div style={{flex:1}}>
            <div style={{fontFamily:"var(--font-disp)",fontSize:28,fontStyle:"italic",fontWeight:300,color:"var(--grove)",marginBottom:4}}>
              Bonjour, Lilia
            </div>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted)",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:18}}>
              Domaine Sidi Abdallah · {today.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}
            </div>
            <label style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--dust)",display:"block",marginBottom:8}}>
              Comment souhaitez-vous organiser cette page ? Qu'est-ce qui vous importe le plus en ce moment ?
            </label>
            <div style={{display:"flex",gap:10}}>
              <textarea
                value={wish}
                onChange={e=>setWish(e.target.value)}
                placeholder={"Ex: « Je veux voir d'abord les décisions qui attendent mon accord, puis les grosses dépenses, et enfin où en sont les travaux »"}
                rows={2}
                style={{flex:1,resize:"none",fontSize:13,padding:"10px 14px",borderColor:"var(--mist)",background:"rgba(247,243,236,0.9)"}}
                onKeyDown={e=>e.key==="Enter"&&e.ctrlKey&&askAI()}
              />
              <button
                className="btn btn-primary"
                onClick={askAI}
                disabled={aiLoading||!wish.trim()}
                style={{alignSelf:"flex-end",whiteSpace:"nowrap",opacity:(!wish.trim()||aiLoading)?0.5:1}}
              >
                {aiLoading ? "…" : "Personnaliser"}
              </button>
            </div>
            {aiError && <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted)",marginTop:8}}>{aiError}</div>}
            {aiView && !aiLoading && (
              <div style={{marginTop:12,padding:"10px 14px",background:"rgba(255,255,255,0.7)",borderRadius:4,border:"1px solid #E8D9C0"}}>
                <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--dust)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Vue personnalisée activée</div>
                <div style={{fontSize:13,color:"#5A4A30",fontStyle:"italic"}}>{aiView.note}</div>
              </div>
            )}
          </div>
          {/* Quick stats sidebar */}
          <div style={{display:"flex",flexDirection:"column",gap:8,minWidth:130,borderLeft:"1px solid #E8D9C0",paddingLeft:20}}>
            {[
              {val:`${done}/${tasks.length}`,label:"tâches faites",color:"#3A9058"},
              {val:openDec,label:"décisions en attente",color:COLORS.progress.text},
              {val:blocked>0?blocked:"0",label:"tâche"+(blocked>1?"s":"")+" bloquée"+(blocked>1?"s":""),color:blocked>0?COLORS.blocked.text:"var(--muted)"},
              {val:`${totalBudget.toLocaleString()}`,label:"TND alloués",color:"var(--grove)"},
            ].map(s=>(
              <div key={s.label} style={{textAlign:"center"}}>
                <div style={{fontFamily:"var(--font-disp)",fontSize:20,color:s.color,lineHeight:1}}>{s.val}</div>
                <div style={{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.07em",marginTop:2}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Default proposal label (shown when AI hasn't run yet) ── */}
      {!submitted && (
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",letterSpacing:"0.1em",textTransform:"uppercase"}}>
            Proposition par défaut — vue organisée selon votre rôle
          </div>
          <div style={{flex:1,height:1,background:"var(--mist)"}}/>
          <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)"}}>
            Personnalisez ci-dessus pour changer l'ordre
          </div>
        </div>
      )}

      <Legend groups={LEGENDS.lilia} />

      {/* ── Dynamic sections ── */}
      {activeSections.map((sec, idx) => {
        const SectionWrap = ({title, children, accentColor}) => (
          <div className="lilia-section card card-p" style={{marginBottom:16,position:"relative",overflow:"hidden"}}>
            {accentColor && <div style={{position:"absolute",top:0,left:0,bottom:0,width:3,background:accentColor}}/>}
            <div style={{paddingLeft: accentColor ? 16 : 0}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <div style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--muted)",background:"#F2EDE3",padding:"2px 8px",borderRadius:20}}>
                  {idx+1}
                </div>
                <div className="lilia-section-title" style={{marginBottom:0,border:"none",padding:0}}>{title}</div>
              </div>
              {children}
            </div>
          </div>
        );

        if (sec.id === "decisions") return (
          <SectionWrap key={sec.id} title={sectionTitle(sec)} accentColor={COLORS.progress.hex}>
            {openD.length === 0
              ? <div style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--muted)",fontStyle:"italic"}}>Aucune décision en attente pour le moment.</div>
              : openD.map(d=>(
                <div key={d.id} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"12px 0",borderBottom:"1px solid var(--border)",gap:20}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,color:"var(--ink)",marginBottom:4,lineHeight:1.5,fontWeight:500}}>{d.decision}</div>
                    {d.context&&<div style={{fontSize:12,color:"var(--muted)",fontStyle:"italic"}}>{d.context}</div>}
                    <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--dim)",marginTop:4}}>Décidé par: {d.by}</div>
                  </div>
                  <DecStatusBadge s={d.status}/>
                </div>
              ))
            }
          </SectionWrap>
        );

        if (sec.id === "budget_approvals") return (
          <SectionWrap key={sec.id} title={sectionTitle(sec)} accentColor={COLORS.bDigital.hex}>
            {bigExpenses.length === 0
              ? <div style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--muted)",fontStyle:"italic"}}>Aucune dépense ≥ 10 000 TND enregistrée pour l'instant.</div>
              : bigExpenses.map((e,i)=>{
                const sc = e.status==="payé"?COLORS.bPaye:e.status==="engagé"?COLORS.bEngage:COLORS.bPrevu;
                return (
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 14px",borderRadius:4,background:sc.bg,marginBottom:6,gap:16}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,color:"var(--ink)",fontWeight:500,marginBottom:2}}>{e.name}</div>
                      {e.date&&<div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)"}}>Prévu: {fmtDate(e.date)}</div>}
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontFamily:"var(--font-disp)",fontSize:18,color:sc.text,fontWeight:500}}>{e.amount.toLocaleString()}</div>
                      <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)"}}>TND</div>
                    </div>
                    <span className="badge" style={{background:sc.bg,color:sc.text,borderColor:sc.border||"transparent",flexShrink:0}}>{e.status}</span>
                  </div>
                );
              })
            }
            <div style={{marginTop:14,padding:"12px 16px",background:"#F2EDE3",borderRadius:4,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted)"}}>Total budget alloué tous postes</span>
              <span style={{fontFamily:"var(--font-disp)",fontSize:20,color:"var(--grove)"}}>{totalBudget.toLocaleString()} <span style={{fontSize:12,color:"var(--muted)"}}>TND</span></span>
            </div>
          </SectionWrap>
        );

        if (sec.id === "budget_overview") return (
          <SectionWrap key={sec.id} title={sectionTitle(sec)} accentColor={COLORS.bContent.hex}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:16}}>
              {[
                {label:"Budget total alloué",  val:totalBudget,  color:"var(--grove)"},
                {label:"Payé à ce jour",        val:totalPaid,    color:COLORS.bPaye.text},
                {label:"Engagé (contrats)",     val:totalEngaged, color:COLORS.bEngage.text},
                {label:"Restant à allouer",     val:totalBudget-(totalPaid+totalEngaged), color:"var(--muted)"},
              ].map(s=>(
                <div key={s.label} style={{background:"#F2EDE3",borderRadius:4,padding:"12px 16px"}}>
                  <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>{s.label}</div>
                  <div style={{fontFamily:"var(--font-disp)",fontSize:22,color:s.color}}>{s.val.toLocaleString()} <span style={{fontSize:11,color:"var(--muted)"}}>TND</span></div>
                </div>
              ))}
            </div>
            {Object.entries(budget).map(([k,t])=>{
              const paid=t.entries.filter(e=>e.status==="payé").reduce((s,e)=>s+e.amount,0);
              const eng =t.entries.filter(e=>e.status==="engagé").reduce((s,e)=>s+e.amount,0);
              const prev=t.entries.filter(e=>e.status==="prévu").reduce((s,e)=>s+e.amount,0);
              const pct =t.total>0?Math.min(100,Math.round((paid+eng+prev)/t.total*100)):0;
              return (
                <div key={k} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:3,height:14,background:t.color,borderRadius:2}}/>
                      <span style={{fontSize:13,color:"var(--ink)"}}>{t.name}</span>
                    </div>
                    <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted)"}}>{t.total>0?t.total.toLocaleString()+" TND":"À définir"}</span>
                  </div>
                  {t.total>0&&<div className="phase-track"><div className="phase-fill" style={{width:`${pct}%`,background:t.color}}/></div>}
                </div>
              );
            })}
          </SectionWrap>
        );

        if (sec.id === "progress") return (
          <SectionWrap key={sec.id} title={sectionTitle(sec)} accentColor={COLORS.phase1.hex}>
            {PHASES.map(p=>{
              const pT=tasks.filter(t=>t.phase===p.id); const pD=pT.filter(t=>t.status==="done").length;
              const pct=pT.length?Math.round(pD/pT.length*100):0;
              const pBlocked=pT.filter(t=>t.status==="blocked").length;
              return (
                <div key={p.id} className="phase-block">
                  <div className="phase-header">
                    <span className="phase-name" style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{width:8,height:8,borderRadius:2,background:p.color,display:"inline-block",flexShrink:0}}/>
                      {p.label}
                    </span>
                    <span className="phase-meta">
                      {pBlocked>0&&<span style={{color:COLORS.blocked.text,marginRight:8}}>⚠ {pBlocked} bloquée{pBlocked>1?"s":""}</span>}
                      {pD}/{pT.length} · {p.dates}
                    </span>
                  </div>
                  <div className="phase-track"><div className="phase-fill" style={{width:`${pct}%`,background:p.color}}/></div>
                </div>
              );
            })}
            {active.length>0&&(
              <div style={{marginTop:16,paddingTop:16,borderTop:"1px solid var(--border)"}}>
                <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>En cours & bloquées</div>
                {active.map(t=>(
                  <div key={t.id} className="lilia-row">
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,marginBottom:4}}>{t.title}</div>
                      <div style={{display:"flex",gap:8}}><OwnerBadge o={t.owner}/><StatusBadge s={t.status}/></div>
                    </div>
                    {t.due&&<div style={{fontFamily:"var(--font-mono)",fontSize:11,color:isOverdue(t.due)?COLORS.blocked.text:"var(--muted)",whiteSpace:"nowrap"}}>{fmtDate(t.due)}</div>}
                  </div>
                ))}
              </div>
            )}
          </SectionWrap>
        );

        if (sec.id === "milestones") return (
          <SectionWrap key={sec.id} title={sectionTitle(sec)} accentColor={COLORS.phase3.hex}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {[
                {date:"Mi-mars 2026",    label:"Logos validés",                  phase:"0"},
                {date:"Mars 2026",       label:"Direction design choisie",        phase:"0"},
                {date:"6 avril 2026",    label:"Démarrage rénovations",           phase:"1"},
                {date:"Mai 2026",        label:"Site web en ligne",               phase:"1"},
                {date:"Été 2026",        label:"Ouverture restaurant + wellness", phase:"1b"},
                {date:"Été 2026",        label:"Lancement Agrumia Club",          phase:"2"},
                {date:"Post-Ramadan",    label:"Ouverture hôtel Dar Saad",        phase:"2"},
                {date:"T4 2026",         label:"Réservation en ligne",            phase:"2"},
                {date:"2027+",           label:"Systèmes avancés",                phase:"3"},
              ].map(m=>{
                const p=PHASES.find(ph=>ph.id===m.phase);
                return (
                  <div key={m.label} style={{background:"#F2EDE3",borderRadius:4,padding:"12px 14px",borderLeft:`3px solid ${p?.color||"var(--mist)"}`}}>
                    <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:p?.color||"var(--muted)",marginBottom:3,fontWeight:500}}>{m.date}</div>
                    <div style={{fontSize:12,color:"var(--ink)",lineHeight:1.4}}>{m.label}</div>
                  </div>
                );
              })}
            </div>
          </SectionWrap>
        );

        return null;
      })}
    </div>
  );
};

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [tasks,     setTasksS]    = useState(INIT_TASKS);
  const [budget,    setBudgetS]   = useState(INIT_BUDGET);
  const [decisions, setDecisionsS]= useState(INIT_DECISIONS);
  const deps = INIT_DEPS;
  const [ready, setReady] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(()=>{
    (async()=>{
      try{const r=await window.storage.get("dsa3-tasks");    if(r)setTasksS(JSON.parse(r.value));}catch{}
      try{const r=await window.storage.get("dsa3-budget");   if(r)setBudgetS(JSON.parse(r.value));}catch{}
      try{const r=await window.storage.get("dsa3-decisions");if(r)setDecisionsS(JSON.parse(r.value));}catch{}
      setReady(true);
    })();
  },[]);

  useEffect(()=>{
    const onScroll = () => {
      const pct = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      setScrollPct(Math.round(pct * 100));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const persist = (k,v) => { try{ window.storage.set(k,JSON.stringify(v)).catch(()=>{}); }catch{} };
  const setTasks     = useCallback(fn=>setTasksS(p=>{const n=typeof fn==="function"?fn(p):fn; persist("dsa3-tasks",n);     return n;}), []);
  const setBudget    = useCallback(fn=>setBudgetS(p=>{const n=typeof fn==="function"?fn(p):fn; persist("dsa3-budget",n);    return n;}), []);
  const setDecisions = useCallback(fn=>setDecisionsS(p=>{const n=typeof fn==="function"?fn(p):fn; persist("dsa3-decisions",n); return n;}), []);

  const TABS = [
    {id:"dashboard", label:"Vue d'ensemble"},
    {id:"tasks",     label:"Tâches"},
    {id:"timeline",  label:"Timeline"},
    {id:"budget",    label:"Budget"},
    {id:"decisions", label:"Décisions"},
    {id:"deps",      label:"Dépendances"},
    {id:"lilia",     label:"Espace Lilia"},
  ];

  return (
    <>
      <FontLink/>
      <style>{CSS}</style>

      {/* Scroll progress bar */}
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />

      <header className="header">
        <div className="header-brand">
          <div className="header-dot"/>
          <div>
            <div className="header-title">Domaine <em>Sidi Abdallah</em></div>
          </div>
          <div className="header-divider"/>
          <div className="header-sub">Tableau de bord projet</div>
        </div>
        <div className="header-right">
          <div className="header-status">
            <span style={{
              width: 5, height: 5,
              background: ready ? COLORS.done.hex : "var(--dust)",
              borderRadius: "50%", display: "inline-block",
              boxShadow: ready ? `0 0 0 3px ${COLORS.done.bg}` : "none",
            }}/>
            {ready ? "Synchronisé" : "Chargement…"}
          </div>
        </div>
      </header>

      <nav className="nav">
        {TABS.map(t=>(
          <button key={t.id} className={`nav-tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      <main className="main">
        {tab==="dashboard" && <Dashboard  tasks={tasks} budget={budget} decisions={decisions}/>}
        {tab==="tasks"     && <TaskBoard  tasks={tasks} setTasks={setTasks}/>}
        {tab==="timeline"  && <Timeline/>}
        {tab==="budget"    && <Budget     budget={budget} setBudget={setBudget}/>}
        {tab==="decisions" && <Decisions  decisions={decisions} setDecisions={setDecisions}/>}
        {tab==="deps"      && <Dependencies deps={deps}/>}
        {tab==="lilia"     && <LiliaView  tasks={tasks} decisions={decisions} budget={budget}/>}
      </main>

      <footer style={{
        textAlign: "center", padding: "32px 48px", borderTop: "1px solid var(--mist)",
        fontFamily: "var(--font-body)", fontWeight: 200, fontSize: 9,
        letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--dust)",
      }}>
        © 2026 Domaine Sidi Abdallah &nbsp;·&nbsp; Document de travail confidentiel
      </footer>
    </>
  );
}
