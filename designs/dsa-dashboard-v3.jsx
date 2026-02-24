import { useState, useEffect, useCallback } from "react";

const FontLink = () => (
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lato:wght@300;400;700&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
);

// ─── SINGLE SOURCE OF TRUTH FOR ALL COLORS ───────────────────────────────────
// Each color is used for exactly ONE concept across the entire app.
const COLORS = {
  // ── Owners ──────────────────────────────────────────── round pill badges
  rached:   { bg: "#FDF0E0", text: "#8C5C20", border: "#E8C080", hex: "#B8874E", label: "Rached" },
  elyssa:   { bg: "#E4F2FC", text: "#1E6090", border: "#90C8E8", hex: "#3A8FBF", label: "Elyssa" },
  lilia:    { bg: "#F3EAF8", text: "#5A2A80", border: "#C098D8", hex: "#8B5AAA", label: "Lilia"  },
  tous:     { bg: "#E8F5E0", text: "#2A6020", border: "#90C870", hex: "#5A8F3A", label: "Tous"   },

  // ── Task statuses ────────────────────────────────────── square-ish badges
  todo:     { bg: "#F0ECE6", text: "#7A6A58", border: "#D0C4B0", hex: "#9A8A78", label: "À faire"   },
  progress: { bg: "#FEF0E0", text: "#8C4C10", border: "#F0A860", hex: "#C87830", label: "En cours"  }, // warm orange — distinct from Rached amber
  review:   { bg: "#ECEEFE", text: "#2A3898", border: "#9098E8", hex: "#5865B8", label: "En revue"  }, // indigo — distinct from Elyssa blue
  done:     { bg: "#E0F5E8", text: "#1A6838", border: "#70C890", hex: "#3A9058", label: "Fait ✓"    }, // emerald — distinct from Tous sage
  blocked:  { bg: "#FBEAE4", text: "#8A2010", border: "#E08060", hex: "#B84030", label: "Bloquée"   }, // crimson

  // ── Phases ──────────────────────────────────────────── horizontal bars only
  phase0:   { hex: "#9A6830", label: "Phase 0" }, // deep copper
  phase1:   { hex: "#4A7840", label: "Phase 1" }, // forest green
  phase1b:  { hex: "#2A7880", label: "Phase 1b"}, // teal
  phase2:   { hex: "#7A3020", label: "Phase 2" }, // dark maroon
  phase3:   { hex: "#6A4090", label: "Phase 3" }, // violet

  // ── Budget envelopes ─────────────────────────────────── top stripe on cards
  bDigital: { hex: "#B07820", label: "Digital & Tech"        }, // dark gold
  bRenov:   { hex: "#A04828", label: "Rénovation"            }, // sienna
  bContent: { hex: "#507838", label: "Contenu"               }, // olive
  bMkt:     { hex: "#285880", label: "Opérations & Marketing"}, // navy

  // ── Budget entry statuses ──────────────────────────────── inline tags
  bPrevu:   { bg: "#F5F0E8", text: "#7A6A50", hex: "#9A8A70", label: "Prévu"   },
  bEngage:  { bg: "#FEF0D8", text: "#806010", hex: "#C09030", label: "Engagé"  },
  bPaye:    { bg: "#E0F5E8", text: "#1A6838", hex: "#3A9058", label: "Payé"    }, // same as Done — both mean "completed/confirmed"

  // ── Dependency statuses ────────────────────────────────── inline text
  depReady:   { hex: "#3A9058", label: "Prêt ✓"      },
  depPending: { hex: "#C87830", label: "En cours"    }, // same orange as task progress
  depWaiting: { hex: "#9A8A78", label: "En attente"  },
};

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:        #FAF7F2;
    --surface:   #FFFFFF;
    --card:      #FFFFFF;
    --card2:     #F5F0E8;
    --border:    #E2D9CC;
    --ink:       #2A2218;
    --ink2:      #5A4E3E;
    --muted:     #9A8A78;
    --dim:       #C8B9A5;
    --font-disp: 'Playfair Display', Georgia, serif;
    --font-body: 'Lato', sans-serif;
    --font-mono: 'DM Mono', monospace;
    --shadow-sm: 0 1px 3px rgba(42,34,24,0.07);
    --shadow:    0 2px 12px rgba(42,34,24,0.09);
    --shadow-lg: 0 8px 32px rgba(42,34,24,0.13);
    --radius:    6px;
    --gold: #B8874E;
  }
  body { background: var(--bg); color: var(--ink); font-family: var(--font-body); font-size: 14px; line-height: 1.6; }

  /* ── HEADER ── */
  .header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 0 40px; display: flex; align-items: stretch; justify-content: space-between; position: sticky; top: 0; z-index: 100; box-shadow: var(--shadow-sm); }
  .header-brand { display: flex; align-items: center; gap: 20px; padding: 16px 0; }
  .header-dot { width: 8px; height: 8px; background: ${COLORS.rached.hex}; border-radius: 50%; flex-shrink: 0; }
  .header-title { font-family: var(--font-disp); font-size: 19px; font-weight: 500; color: var(--ink); letter-spacing: 0.01em; }
  .header-divider { width: 1px; background: var(--border); margin: 14px 0; }
  .header-sub { font-family: var(--font-mono); font-size: 10px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }
  .header-right { display: flex; align-items: center; gap: 16px; }
  .header-status { font-family: var(--font-mono); font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 6px; }

  /* ── NAV ── */
  .nav { background: var(--surface); border-bottom: 1px solid var(--border); padding: 0 40px; display: flex; overflow-x: auto; }
  .nav-tab { padding: 13px 18px; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.09em; text-transform: uppercase; color: var(--muted); border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.18s; white-space: nowrap; }
  .nav-tab:hover { color: var(--ink2); }
  .nav-tab.active { color: ${COLORS.rached.text}; border-bottom-color: ${COLORS.rached.hex}; }

  .main { padding: 40px; max-width: 1440px; margin: 0 auto; }

  /* ── LEGEND BAR ── */
  .legend-bar { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 10px 16px; margin-bottom: 28px; box-shadow: var(--shadow-sm); }
  .legend-group { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; }
  .legend-sep { width: 1px; height: 18px; background: var(--border); margin: 0 6px; flex-shrink: 0; }
  .legend-group-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--dim); margin-right: 4px; white-space: nowrap; }
  .legend-chip { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 3px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.04em; border: 1px solid transparent; white-space: nowrap; }
  .legend-swatch { width: 9px; height: 9px; border-radius: 2px; flex-shrink: 0; }
  .legend-swatch-round { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
  .legend-swatch-bar { width: 16px; height: 6px; border-radius: 3px; flex-shrink: 0; }

  /* ── PAGE HEADER ── */
  .page-header { margin-bottom: 24px; }
  .page-title { font-family: var(--font-disp); font-size: 32px; font-weight: 400; color: var(--ink); line-height: 1.2; }
  .page-title em { font-style: italic; color: ${COLORS.rached.hex}; }
  .page-sub { font-family: var(--font-mono); font-size: 10px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 5px; }

  /* ── CARDS ── */
  .card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-sm); }
  .card-p { padding: 24px; }
  .card-p-sm { padding: 16px 20px; }

  /* ── STAT CARDS ── */
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px 24px; box-shadow: var(--shadow-sm); position: relative; overflow: hidden; }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
  .stat-label { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
  .stat-value { font-family: var(--font-disp); font-size: 38px; font-weight: 400; color: var(--ink); line-height: 1; }
  .stat-note { font-size: 12px; color: var(--muted); margin-top: 6px; font-family: var(--font-mono); }

  /* ── PHASE BARS ── */
  .phase-block { margin-bottom: 18px; }
  .phase-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 7px; }
  .phase-name { font-size: 13px; font-weight: 700; color: var(--ink2); }
  .phase-meta { font-family: var(--font-mono); font-size: 10px; color: var(--muted); }
  .phase-track { height: 5px; background: var(--card2); border-radius: 3px; overflow: hidden; }
  .phase-fill  { height: 100%; border-radius: 3px; transition: width 0.7s cubic-bezier(.4,0,.2,1); }
  .section-label { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
  .section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* ── BADGES ── */
  .badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 3px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.04em; font-weight: 500; white-space: nowrap; border: 1px solid transparent; }
  .owner-badge { border-radius: 20px; }

  /* ── KANBAN ── */
  .kanban { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; align-items: start; }
  .k-col { border-radius: var(--radius); padding: 14px; border: 1px solid var(--border); background: var(--card2); }
  .k-col-header { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
  .k-count { background: var(--surface); border: 1px solid var(--border); color: var(--muted); padding: 1px 7px; border-radius: 20px; font-size: 10px; }
  .task-card { background: var(--surface); border: 1px solid var(--border); border-radius: 5px; padding: 12px 14px; margin-bottom: 9px; cursor: pointer; transition: box-shadow 0.15s, border-color 0.15s; box-shadow: var(--shadow-sm); }
  .task-card:hover { box-shadow: var(--shadow); border-color: ${COLORS.rached.hex}; }
  .task-card:last-child { margin-bottom: 0; }
  .task-title { font-size: 12.5px; color: var(--ink); line-height: 1.45; margin-bottom: 9px; }
  .task-meta { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
  .task-due { font-family: var(--font-mono); font-size: 10px; color: var(--muted); }
  .task-overdue { color: ${COLORS.blocked.text}; font-weight: 700; }
  .task-block-tag { font-family: var(--font-mono); font-size: 9.5px; color: var(--dim); }
  .task-comments-indicator { font-family: var(--font-mono); font-size: 9px; color: ${COLORS.elyssa.text}; margin-top: 5px; }

  /* ── FILTERS ── */
  .filter-bar { display: flex; gap: 8px; margin-bottom: 22px; flex-wrap: wrap; align-items: center; }
  .filter-label { font-family: var(--font-mono); font-size: 10px; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }
  .filter-btn { padding: 4px 14px; border-radius: 20px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.07em; text-transform: uppercase; cursor: pointer; border: 1px solid var(--border); background: var(--surface); color: var(--muted); transition: all 0.15s; }
  .filter-btn:hover { border-color: ${COLORS.rached.hex}; color: var(--ink2); }
  .filter-btn.active { background: ${COLORS.rached.bg}; border-color: ${COLORS.rached.hex}; color: ${COLORS.rached.text}; font-weight: 700; }

  /* ── DECISIONS ── */
  .dec-table { width: 100%; border-collapse: collapse; }
  .dec-table th { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); padding: 10px 16px; text-align: left; border-bottom: 1px solid var(--border); }
  .dec-table td { padding: 14px 16px; border-bottom: 1px solid var(--border); font-size: 13px; vertical-align: top; }
  .dec-table tr:last-child td { border-bottom: none; }
  .dec-table tr:hover td { background: var(--card2); cursor: pointer; }

  /* ── DEPENDENCIES ── */
  .dep-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .dep-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow-sm); }
  .dep-card-title { font-family: var(--font-disp); font-size: 15px; color: var(--ink); margin-bottom: 2px; }
  .dep-card-owner { font-family: var(--font-mono); font-size: 10px; color: var(--muted); margin-bottom: 14px; }
  .dep-item { display: flex; justify-content: space-between; align-items: flex-start; padding: 7px 0; border-bottom: 1px solid var(--border); gap: 10px; }
  .dep-item:last-child { border-bottom: none; }
  .dep-item-name { font-size: 12.5px; color: var(--ink2); line-height: 1.4; }
  .dep-item-note { font-family: var(--font-mono); font-size: 10px; color: var(--muted); margin-top: 2px; }

  /* ── BUDGET ── */
  .budget-section { margin-bottom: 24px; }
  .budget-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .budget-name { font-family: var(--font-disp); font-size: 18px; font-weight: 400; color: var(--ink); display: flex; align-items: center; gap: 10px; }
  .budget-stripe { width: 4px; height: 20px; border-radius: 2px; flex-shrink: 0; }
  .budget-track { height: 6px; background: var(--card2); border-radius: 3px; overflow: hidden; margin-bottom: 12px; }
  .budget-fill  { height: 100%; border-radius: 3px; transition: width 0.7s; }
  .budget-entry { display: flex; justify-content: space-between; align-items: center; padding: 9px 14px; border-radius: 4px; margin-bottom: 5px; background: var(--card2); }
  .budget-entry-left { flex: 1; }
  .budget-entry-name { font-size: 13px; color: var(--ink); }
  .budget-entry-meta { font-family: var(--font-mono); font-size: 10px; color: var(--muted); margin-top: 2px; }

  /* ── FORMS ── */
  .btn { padding: 8px 20px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; border: none; transition: all 0.15s; font-weight: 500; }
  .btn-primary { background: ${COLORS.rached.hex}; color: #fff; }
  .btn-primary:hover { background: ${COLORS.rached.text}; }
  .btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); }
  .btn-ghost:hover { color: var(--ink2); border-color: var(--ink2); }
  .btn-danger { background: transparent; color: ${COLORS.blocked.text}; border: 1px solid ${COLORS.blocked.hex}; }
  .btn-danger:hover { background: ${COLORS.blocked.bg}; }
  .btn-sm { padding: 5px 12px; font-size: 10px; }
  input, select, textarea { background: var(--card2); border: 1px solid var(--border); color: var(--ink); padding: 8px 12px; border-radius: 4px; font-family: var(--font-body); font-size: 13px; outline: none; width: 100%; transition: border-color 0.15s; }
  input:focus, select:focus, textarea:focus { border-color: ${COLORS.rached.hex}; background: #fff; }
  select option { background: #fff; }
  label { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 5px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
  .form-field { margin-bottom: 14px; }

  /* ── MODAL ── */
  .modal-overlay { position: fixed; inset: 0; background: rgba(42,34,24,0.45); display: flex; align-items: center; justify-content: center; z-index: 200; backdrop-filter: blur(2px); }
  .modal { background: var(--surface); border-radius: 8px; padding: 32px; width: 560px; max-width: 96vw; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg); border: 1px solid var(--border); }
  .modal-title { font-family: var(--font-disp); font-size: 22px; font-weight: 400; margin-bottom: 22px; color: var(--ink); }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--border); }

  /* ── COMMENTS ── */
  .comments-section { margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--border); }
  .comments-label { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
  .comment-item { background: var(--card2); border-radius: 4px; padding: 10px 12px; margin-bottom: 8px; }
  .comment-meta { font-family: var(--font-mono); font-size: 10px; color: var(--muted); margin-bottom: 4px; display: flex; gap: 8px; }
  .comment-text { font-size: 13px; color: var(--ink2); line-height: 1.5; }
  .comment-add { display: flex; gap: 8px; margin-top: 10px; }
  .comment-add textarea { resize: none; font-size: 12.5px; }

  /* ── TIMELINE ── */
  .tl-wrap { overflow-x: auto; }
  .tl-grid { display: grid; grid-template-columns: 190px repeat(12, 1fr); min-width: 760px; }
  .tl-hcell { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.07em; text-transform: uppercase; color: var(--muted); text-align: center; padding: 8px 4px; border-bottom: 1px solid var(--border); border-right: 1px solid var(--border); }
  .tl-hcell.current { color: ${COLORS.rached.text}; background: ${COLORS.rached.bg}; font-weight: 700; }
  .tl-label { font-family: var(--font-mono); font-size: 10px; color: var(--ink2); text-align: right; padding: 4px 12px 4px 0; display: flex; align-items: center; justify-content: flex-end; border-right: 1px solid var(--border); min-height: 26px; }
  .tl-cell { border-right: 1px solid var(--border); height: 26px; display: flex; align-items: center; }
  .tl-bar { height: 16px; width: 100%; }
  .milestone-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 22px; }
  .milestone-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 16px; box-shadow: var(--shadow-sm); }
  .milestone-date { font-family: var(--font-mono); font-size: 10px; color: ${COLORS.rached.text}; margin-bottom: 4px; font-weight: 500; }
  .milestone-label { font-size: 13px; color: var(--ink); }

  /* ── LILIA VIEW ── */
  .lilia-banner { background: linear-gradient(135deg,${COLORS.rached.bg} 0%,#FFF8EE 100%); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px 32px; margin-bottom: 28px; }
  .lilia-banner-title { font-family: var(--font-disp); font-size: 28px; font-style: italic; color: ${COLORS.rached.text}; margin-bottom: 4px; }
  .lilia-section { margin-bottom: 28px; }
  .lilia-section-title { font-family: var(--font-disp); font-size: 16px; color: var(--ink); border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 14px; }
  .lilia-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
  .lilia-kpi { background: var(--surface); border: 1px solid var(--border); border-radius: 5px; padding: 14px 18px; text-align: center; }
  .lilia-kpi-val { font-family: var(--font-disp); font-size: 30px; color: var(--ink); }
  .lilia-kpi-label { font-family: var(--font-mono); font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }
  .lilia-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 8px 0; border-bottom: 1px solid var(--border); gap: 16px; }
  .lilia-row:last-child { border-bottom: none; }
  .print-btn { display: flex; gap: 10px; margin-bottom: 20px; }

  /* ── GRIDS ── */
  .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .g3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .g4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

  @media print { .header,.nav,.print-btn { display: none !important; } .main { padding: 0; } }
  @media (max-width: 1100px) { .kanban { grid-template-columns: repeat(3,1fr); } .stat-grid,.g4 { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 800px)  { .main { padding: 20px; } .header,.nav { padding-left: 20px; padding-right: 20px; } .kanban { grid-template-columns: 1fr 1fr; } .dep-grid,.g2,.g3,.lilia-grid,.milestone-grid { grid-template-columns: 1fr; } .form-row { grid-template-columns: 1fr; } }
  @media (max-width: 560px)  { .kanban { grid-template-columns: 1fr; } .stat-grid { grid-template-columns: 1fr 1fr; } }
`;

// ─── Legend component ────────────────────────────────────────────────────────
// groups: array of { label, items: [{color, label, shape}] }
// shape: 'square' | 'round' | 'bar'
const Legend = ({ groups }) => (
  <div className="legend-bar">
    {groups.map((g, gi) => (
      <>
        {gi > 0 && <div key={`sep-${gi}`} className="legend-sep" />}
        <div key={g.label} className="legend-group">
          {g.label && <span className="legend-group-label">{g.label}</span>}
          {g.items.map(item => (
            <div key={item.label} className="legend-chip" style={{ background: item.bg || "#F0ECE6", borderColor: item.border || "#D0C4B0" }}>
              {item.shape === "round" && <span className="legend-swatch-round" style={{ background: item.color }} />}
              {item.shape === "bar"   && <span className="legend-swatch-bar"   style={{ background: item.color }} />}
              {(!item.shape || item.shape === "square") && <span className="legend-swatch" style={{ background: item.color }} />}
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: item.textColor || "#5A4E3E" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </>
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
    { label: "Phases (barres)", items: [
      { label: "Phase 0", color: COLORS.phase0.hex, bg: "#FDF6EE", border: "#E8C898", textColor: "#7A5020", shape: "bar" },
      { label: "Phase 1", color: COLORS.phase1.hex, bg: "#EAF2E4", border: "#88B878", textColor: "#2A5820", shape: "bar" },
      { label: "Phase 1b",color: COLORS.phase1b.hex,bg: "#E0F2F2", border: "#70B8B8", textColor: "#185858", shape: "bar" },
      { label: "Phase 2", color: COLORS.phase2.hex, bg: "#F5E8E4", border: "#C89888", textColor: "#5A1808", shape: "bar" },
      { label: "Phase 3", color: COLORS.phase3.hex, bg: "#EEE8F8", border: "#B098D8", textColor: "#3A1870", shape: "bar" },
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
      { label: "Phase 0 — Fondations",     color: COLORS.phase0.hex,  bg: "#FDF6EE", border: "#E8C898", textColor: "#7A5020", shape: "bar" },
      { label: "Phase 1 — Build",          color: COLORS.phase1.hex,  bg: "#EAF2E4", border: "#88B878", textColor: "#2A5820", shape: "bar" },
      { label: "Phase 1b — Soft Launch",   color: COLORS.phase1b.hex, bg: "#E0F2F2", border: "#70B8B8", textColor: "#185858", shape: "bar" },
      { label: "Phase 2 — Ouverture Hôtel",color: COLORS.phase2.hex,  bg: "#F5E8E4", border: "#C89888", textColor: "#5A1808", shape: "bar" },
      { label: "Phase 3 — Systèmes",       color: COLORS.phase3.hex,  bg: "#EEE8F8", border: "#B098D8", textColor: "#3A1870", shape: "bar" },
    ]},
    { label: "Livrables (barres claires = sous-activités)", items: [
      { label: "Shooting / Contenu", color: "#D4A96A", bg: "#FEF8EC", border: "#E8C880", textColor: "#7A5010", shape: "bar" },
      { label: "Rénovation",         color: "#C07050", bg: "#F8EDE8", border: "#E0A888", textColor: "#6A2808", shape: "bar" },
      { label: "Digital / Dev",      color: "#70A870", bg: "#E8F4E8", border: "#90C890", textColor: "#206020", shape: "bar" },
    ]},
  ],
  budget: [
    { label: "Enveloppes", items: [
      { label: "Digital & Tech",   color: COLORS.bDigital.hex, bg: "#FDF4DC", border: "#E8D080", textColor: "#5A4000", shape: "bar" },
      { label: "Rénovation",       color: COLORS.bRenov.hex,   bg: "#F8EDE8", border: "#D0A080", textColor: "#5A2010", shape: "bar" },
      { label: "Contenu",          color: COLORS.bContent.hex, bg: "#ECF4E4", border: "#90B870", textColor: "#1A4010", shape: "bar" },
      { label: "Mktg & Ops",       color: COLORS.bMkt.hex,     bg: "#E4EEF8", border: "#7098C8", textColor: "#0A2848", shape: "bar" },
    ]},
    { label: "Statut dépenses", items: [
      { label: "Prévu",   color: COLORS.bPrevu.hex,  bg: COLORS.bPrevu.bg,  border: "#D0C4B0", textColor: COLORS.bPrevu.text  },
      { label: "Engagé",  color: COLORS.bEngage.hex, bg: COLORS.bEngage.bg, border: "#E0B860", textColor: COLORS.bEngage.text },
      { label: "Payé",    color: COLORS.bPaye.hex,   bg: COLORS.bPaye.bg,   border: "#70C890", textColor: COLORS.bPaye.text   },
    ]},
  ],
  decisions: [
    { label: "Statut décision", items: [
      { label: "Prise ✓",     color: COLORS.done.hex,     bg: COLORS.done.bg,     border: COLORS.done.border,     textColor: COLORS.done.text     },
      { label: "En attente",  color: COLORS.progress.hex, bg: COLORS.progress.bg, border: COLORS.progress.border, textColor: COLORS.progress.text },
    ]},
  ],
  deps: [
    { label: "Statut asset", items: [
      { label: "Prêt ✓",      color: COLORS.depReady.hex,   bg: "#E0F5E8", border: "#70C890", textColor: "#1A6838" },
      { label: "En cours",    color: COLORS.depPending.hex, bg: "#FEF0E0", border: "#F0A860", textColor: "#8C4C10" },
      { label: "En attente",  color: COLORS.depWaiting.hex, bg: "#F0ECE6", border: "#D0C4B0", textColor: "#7A6A58" },
    ]},
  ],
  lilia: [
    { label: "Statuts tâches", items: [
      { label: "En cours", color: COLORS.progress.hex, bg: COLORS.progress.bg, border: COLORS.progress.border, textColor: COLORS.progress.text },
      { label: "Bloquée",  color: COLORS.blocked.hex,  bg: COLORS.blocked.bg,  border: COLORS.blocked.border,  textColor: COLORS.blocked.text  },
      { label: "Fait ✓",   color: COLORS.done.hex,     bg: COLORS.done.bg,     border: COLORS.done.border,     textColor: COLORS.done.text     },
    ]},
    { label: "Décisions", items: [
      { label: "Votre avis requis", color: COLORS.progress.hex, bg: COLORS.progress.bg, border: COLORS.progress.border, textColor: COLORS.progress.text },
      { label: "Prise ✓",          color: COLORS.done.hex,     bg: COLORS.done.bg,     border: COLORS.done.border,     textColor: COLORS.done.text     },
    ]},
  ],
};

// ─── Utilities ───────────────────────────────────────────────────────────────
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
      </div>

      <Legend groups={LEGENDS.dashboard} />

      <div className="stat-grid">
        {[
          { label:"Tâches accomplies", val:`${done}/${tasks.length}`, note:`${Math.round(done/tasks.length*100)}% du total`, accent: COLORS.done.hex },
          { label:"En cours",          val:inProg,  note:"tâches actives",  accent: COLORS.progress.hex },
          { label:"Bloquées",          val:blocked, note:blocked>0?"⚠ action requise":"aucune", accent: COLORS.blocked.hex },
          { label:"Décisions en attente", val:openDec, note:"à trancher", accent: COLORS.review.hex },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ "--accent": s.accent }}>
            <style>{`.stat-card[style*="${s.accent}"]::before { background: ${s.accent}; }`}</style>
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
                        style={{width:"auto",padding:"1px 6px",fontSize:10,background:"transparent",border:`1px solid ${sc.border||"var(--border)"}`,borderRadius:20,color:sc.text}}>
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

const LiliaView = ({ tasks, decisions, budget }) => {
  const done    = tasks.filter(t=>t.status==="done").length;
  const blocked = tasks.filter(t=>t.status==="blocked").length;
  const openDec = decisions.filter(d=>d.status==="open").length;
  const active  = tasks.filter(t=>t.status==="in-progress"||t.status==="blocked");
  const openD   = decisions.filter(d=>d.status==="open");

  return (
    <div>
      <div className="print-btn">
        <button className="btn btn-primary" onClick={()=>window.print()}>🖨 Imprimer / Exporter PDF</button>
        <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted)",alignSelf:"center"}}>Vue simplifiée · partageable avec Lilia</span>
      </div>

      <Legend groups={LEGENDS.lilia} />

      <div className="lilia-banner">
        <div className="lilia-banner-title">Domaine Sidi Abdallah</div>
        <div style={{fontFamily:"var(--font-mono)",fontSize:13,color:"var(--ink2)",margin:"4px 0 8px"}}>Rapport d'avancement projet</div>
        <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted)"}}>{today.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
      </div>

      <div className="lilia-section">
        <div className="lilia-section-title">En chiffres</div>
        <div className="lilia-grid">
          <div className="lilia-kpi"><div className="lilia-kpi-val">{done}/{tasks.length}</div><div className="lilia-kpi-label">Tâches complètes</div></div>
          <div className="lilia-kpi"><div className="lilia-kpi-val" style={{color:COLORS.blocked.text}}>{blocked}</div><div className="lilia-kpi-label">Bloquées</div></div>
          <div className="lilia-kpi"><div className="lilia-kpi-val" style={{color:COLORS.progress.text}}>{openDec}</div><div className="lilia-kpi-label">Décisions à prendre</div></div>
        </div>
      </div>

      <div className="lilia-section">
        <div className="lilia-section-title">Avancement par phase</div>
        {PHASES.map(p=>{
          const pT=tasks.filter(t=>t.phase===p.id); const pD=pT.filter(t=>t.status==="done").length;
          const pct=pT.length?Math.round(pD/pT.length*100):0;
          return (
            <div key={p.id} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:13}}>{p.label}</span>
                <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted)"}}>{pD}/{pT.length} · {p.dates}</span>
              </div>
              <div className="phase-track"><div className="phase-fill" style={{width:`${pct}%`,background:p.color}}/></div>
            </div>
          );
        })}
      </div>

      {active.length>0&&<div className="lilia-section">
        <div className="lilia-section-title">Tâches en cours & bloquées</div>
        {active.map(t=>(
          <div key={t.id} className="lilia-row">
            <div style={{flex:1}}>
              <div style={{fontSize:13,marginBottom:4}}>{t.title}</div>
              <div style={{display:"flex",gap:8}}><OwnerBadge o={t.owner}/><StatusBadge s={t.status}/></div>
            </div>
            {t.due&&<div style={{fontFamily:"var(--font-mono)",fontSize:11,color:isOverdue(t.due)?COLORS.blocked.text:"var(--muted)"}}>{fmtDate(t.due)}</div>}
          </div>
        ))}
      </div>}

      {openD.length>0&&<div className="lilia-section">
        <div className="lilia-section-title">Décisions à prendre — votre avis est requis</div>
        {openD.map(d=>(
          <div key={d.id} className="lilia-row">
            <div style={{flex:1}}>
              <div style={{fontSize:13,marginBottom:3}}>{d.decision}</div>
              {d.context&&<div style={{fontSize:12,color:"var(--muted)",fontStyle:"italic"}}>{d.context}</div>}
            </div>
            <DecStatusBadge s={d.status}/>
          </div>
        ))}
      </div>}

      <div className="lilia-section">
        <div className="lilia-section-title">Budget — vue synthétique</div>
        {Object.entries(budget).map(([k,t])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:4,height:16,background:t.color,borderRadius:2}}/>
              <span style={{fontSize:13}}>{t.name}</span>
            </div>
            <span style={{fontFamily:"var(--font-mono)",fontSize:13,color:t.color,fontWeight:500}}>
              {t.total>0?`${t.total.toLocaleString()} TND`:"À définir"}
            </span>
          </div>
        ))}
      </div>
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

  useEffect(()=>{
    (async()=>{
      try{const r=await window.storage.get("dsa3-tasks");    if(r)setTasksS(JSON.parse(r.value));}catch{}
      try{const r=await window.storage.get("dsa3-budget");   if(r)setBudgetS(JSON.parse(r.value));}catch{}
      try{const r=await window.storage.get("dsa3-decisions");if(r)setDecisionsS(JSON.parse(r.value));}catch{}
      setReady(true);
    })();
  },[]);

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
    {id:"lilia",     label:"Vue Lilia ↗"},
  ];

  return (
    <>
      <FontLink/>
      <style>{CSS}</style>
      <header className="header">
        <div className="header-brand">
          <div className="header-dot"/>
          <div>
            <div className="header-title">Domaine Sidi Abdallah</div>
          </div>
          <div className="header-divider"/>
          <div className="header-sub">Tableau de bord projet</div>
        </div>
        <div className="header-right">
          <div className="header-status">
            <span style={{width:6,height:6,background:ready?COLORS.done.hex:"var(--muted)",borderRadius:"50%",display:"inline-block"}}/>
            {ready?"Synchronisé":"Chargement…"}
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
    </>
  );
}
