## Résumé

<!-- Une phrase sur ce que cette PR change et pourquoi. -->

## Type de changement

- [ ] Nouvelle feature (frontend / backend / DB)
- [ ] Correction de bug
- [ ] Refactoring (comportement inchangé)
- [ ] Mise à jour de contenu (texte, photo, traduction)
- [ ] Configuration / infrastructure
- [ ] Tests

## Linear / Issue

Fixes: <!-- `DSA-123` ou `#issue-number` -->

## Checklist

### Code
- [ ] TypeScript compile sans erreur (`npx tsc --noEmit`)
- [ ] ESLint passe (`pnpm lint`)
- [ ] Aucun `console.log` oublié
- [ ] Aucune clé API ou secret dans le code

### Comportement
- [ ] Testé localement en FR + EN
- [ ] Testé avec audience TN et audience intl (cookie override)
- [ ] Testé sur mobile (simulateur ou vrai appareil)

### Si frontend
- [ ] Responsive : mobile (375px) + desktop (1280px) vérifié
- [ ] Accessibilité : pas de contraste < 4.5:1, labels sur les formulaires
- [ ] Images : `next/image` avec `alt` et `sizes`

### Si backend
- [ ] Inputs validés (zod)
- [ ] Erreurs gérées correctement (statuts HTTP appropriés)
- [ ] Tests écrits ou mis à jour si logique métier

### Si migration DB
- [ ] Migration non-destructive vérifiée
- [ ] `prisma migrate status` propre sur dev Supabase
- [ ] Seed mis à jour si nécessaire

## Captures d'écran (si frontend)

<!-- Avant / Après si possible. Mobile + Desktop. -->

## Notes pour le review

<!-- Contexte supplémentaire, décisions prises, alternatives considérées. -->
