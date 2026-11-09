# Scroll stack (empilement collant + scroll fluide)

Pattern de page où des « scènes » plein écran s'empilent : chaque scène reste collée en haut et la suivante vient la recouvrir au scroll, avec un raccord arrondi et une ombre. Utilisé aujourd'hui uniquement sur l'accueil (`src/components/home-page.tsx`). À réutiliser sur d'autres pages en suivant ce document.

## Composants

| Élément | Fichier | Rôle |
| --- | --- | --- |
| `SmoothScrollProvider` | `src/components/smooth-scroll-provider.tsx` | Instancie Lenis une fois, à la racine (`main.tsx`). Aucune instance si `prefers-reduced-motion: reduce` (scroll natif), et suit le changement de préférence en direct. |
| `useSmoothScroll()` | `src/lib/smooth-scroll.ts` | `scrollTo(top, { immediate })` : passe par Lenis s'il est actif, sinon par `window.scrollTo`. |
| `ScrollStack` / `StackScene` | `src/components/scroll-stack.tsx` | Conteneur et scène. Le CSS est dans `scroll-stack.css`. |
| `useScrollToScene()` | `src/lib/scroll-stack.ts` | `scrollToScene(id, { focusId })` : fait défiler vers une scène et déplace le focus. |

## Utilisation

```tsx
<ScrollStack>
  <StackScene id="intro" tone="clear" labelledBy="intro-title">…</StackScene>
  <StackScene id="suite" tone="tint" labelledBy="suite-title">
    <div className="stack-scene-inner">…</div>
  </StackScene>
</ScrollStack>
```

- `tone` : `clear` (transparent, laisse voir le fond du site, à réserver à la première scène), `bg`, `tint` ou `surface`. Toujours un token : jamais de couleur en dur.
- Une scène sans fond opaque laisse transparaître la précédente : toutes les scènes sauf la première doivent avoir un `tone` opaque.
- `.stack-scene-inner` donne la largeur de contenu standard (`--container`, `--gutter`).
- Donner à chaque scène un nom accessible (`labelledBy` ou `label`).
- Tout le contenu reste dans le DOM au chargement : aucune scène ne dépend du JS pour être indexable. Pour un contenu qui change selon un choix, rendre toutes les variantes et masquer les autres avec `hidden`.

## Scène horizontale (`HorizontalScene`)

Variante où le scroll vertical fait glisser des panneaux vers la gauche, puis rend la main à la pile verticale. Utilisée sur l'accueil entre le hero et la méthode (choix du parcours, un panneau par catégorie du configurateur, récapitulatif).

```tsx
<HorizontalScene id="votre-projet" label="Votre projet" panels={[
  { tone: 'tint', content: <Premier /> },
  { tone: 'bg', content: <Second /> },
]} />
```

- Chaque panneau tient dans `100dvh` : prévoir un contenu compact (le panneau coupe ce qui dépasse). Le nombre de panneaux peut changer à l'exécution.
- La scène est haute de `100dvh + (n - 1) × max(80vw, 80dvh)` ; son viewport est `sticky` et la progression (`--hscene-p`, de 0 à 1) pilote un `translate3d` du rail. Rien n'est animé par React.
- Prop `unlocked` (index du dernier panneau atteignable) : la scène n'est haute que de `reach - 1` panneaux (`reach = unlocked + 1`, variable `--reach`) et les panneaux verrouillés sont `inert` (masqués en mode vertical). Le défilement ou la tabulation ne peuvent donc pas révéler un panneau avant qu'il soit débloqué. La page d'accueil débloque le panneau suivant au choix du parcours, à la sélection d'une option ou au clic sur Suivant.
- Replis : sous `(min-width: 901px) and (min-height: 640px)` ou avec `prefers-reduced-motion: reduce`, les panneaux s'empilent verticalement dans une scène normale. La requête est dupliquée dans `scroll-stack.css` et `horizontalQuery` (`lib/scroll-stack.ts`) : les garder identiques.
- Aller à un panneau : `scrollToScene(id, { panel, focusId })`. Quand le panneau n'existe pas encore (parcours changé), lancer le scroll dans un `useEffect` après le rendu et appeler `markProgrammaticScroll()` avant le `setState`, pour que le focus programmatique ne soit pas pris pour un saut clavier.
- Focus clavier : un panneau hors écran ou recouvert qui reçoit le focus est ramené à l'écran (`HorizontalScene`).

## Tokens (`src/tokens.css`)

`--radius-xl` (arrondi du raccord), `--shadow-stack` (ombre portée vers le haut, variante sombre incluse), `--stack-pad-top` (dégage l'en-tête flottant), `--stack-pad-bottom`.

## Comment ça marche

- Les scènes sont des frères `position: sticky`. `top: min(0px, calc(100dvh - var(--stack-h)))` : une scène plus courte que l'écran se colle à 0, une scène plus haute se colle quand son bord bas est atteint, donc son contenu se lit en entier avant d'être recouvert. `--stack-h` est mesurée par un `ResizeObserver` dans `StackScene`.
- Une scène complètement recouverte garde ses éléments focalisables. Quand le focus y revient (Maj+Tab), `StackScene` fait défiler jusqu'à elle. Pour sa position de repos, `sceneFlowTop` additionne la hauteur des scènes précédentes, car une scène collée annonce sa position collée.
- Après un défilement programmé vers une scène (`scrollToScene`), passer `focusId` pour déplacer le focus dans la cible. Sinon le focus reste dans une scène désormais recouverte, et le Tab suivant ramène la page en arrière.
- Lenis : `html.lenis { scroll-behavior: auto }` (`smooth-scroll-provider.css`) évite de cumuler avec le `scroll-behavior: smooth` natif. `allowNestedScroll` laisse défiler les zones à overflow, et les éléments `role="dialog"` / `role="alertdialog"` sont exclus du lissage.
- `prefers-reduced-motion: reduce` : pas de Lenis, et les scènes redeviennent des sections normales (`position: relative`), seul le raccord arrondi reste.

## Pièges

- Le composant parent d'une scène ne doit pas avoir d'`overflow` autre que `visible` ou `clip` (un `hidden` ou `auto` casse le sticky). `.site-shell` utilise déjà `overflow: clip`.
- Pour un ajout de contenu dans une scène : si ses styles dépendent d'un sélecteur `.home-page h2` ou similaire, vérifier la spécificité, l'ordre des feuilles CSS suit l'ordre des imports.
