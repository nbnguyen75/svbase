# Primitives Architecture Rules — svbase (Base UI Port)

`svbase` exists to bring accessible, unstyled, headless UI component primitives (mirroring Base UI / Radix primitives) to Svelte 5.

## 1. Unstyled & Headless
- **Zero CSS opinions**: Do NOT bundle CSS styles, utility classes, or stylesheets inside library components.
- **Data Attributes for State**: Expose states via `data-*` attributes for easy styling:
  - `data-state="open" | "closed" | "checked" | "unchecked" | "indeterminate"`
  - `data-disabled=""`
  - `data-orientation="horizontal" | "vertical"`
  - `data-highlighted=""`
- **Render Delegation & Elements**: Allow consumer to pass custom elements or render snippets (`asChild` pattern or snippet props). Forward rest props to the underlying HTML element (`...restProps`).

## 2. Svelte 5 Runes Architecture
- **State & Deriveds**:
  - Use `$state` only for values that need reactivity. Use `$state.raw` for static/large structures.
  - Use `$derived` for all computations from props or state.
  - Never use `$effect` to sync or update local state; keep effects strictly for DOM interactions (focus traps, scroll locks, event listener attachments).
- **Controlled vs Uncontrolled**:
  - Support two-way binding using `$bindable()` for reactive state (e.g., `let { open = $bindable(false), onOpenChange }: Props = $props();`).
  - When state is controlled from outside, respect bound values and notify via callback props (`onValueChange`, `onOpenChange`, etc.).
- **Compound Components & Context**:
  - Organize compound parts using namespaced exports:
    ```ts
    export * as Dialog from './dialog';
    // Usage: <Dialog.Root><Dialog.Trigger /><Dialog.Portal><Dialog.Content /></Dialog.Portal></Dialog.Root>
    ```
  - Use strongly typed Svelte context (`setContext` / `getContext`) to share state between parent and child components without prop drilling.

## 3. Accessibility & WAI-ARIA
- **WAI-ARIA Design Patterns**: Every primitive must comply with its corresponding W3C WAI-ARIA authoring practices.
- **Attributes**: Ensure appropriate `role`, `aria-expanded`, `aria-controls`, `aria-haspopup`, `aria-selected`, `aria-valuenow`, `aria-disabled`, etc. are applied automatically.
- **Keyboard Navigation**:
  - Arrow keys navigation (Up/Down or Left/Right) for menus, tabs, accordions, radios.
  - Enter and Space triggers for buttons, checkboxes, toggles.
  - Escape closes overlays (dialogs, popovers, menus).
  - Tab and Shift+Tab focus trap in modal dialogs.
- **Focus Management**:
  - Return focus to trigger upon overlay close.
  - Initial focus on opening overlays (e.g. dialogs, popovers).
  - Roving tabindex for composite widgets (tabs, radiogroups, toolbars).

## 4. Porting from Base UI (React)
- Translate React `useState` / `useCallback` / `useRef` to Svelte 5 `$state`, `$derived`, and DOM element bindings (`bind:this={element}`).
- Translate React hooks-based logic into clean Svelte `.svelte.ts` state machine or controller classes where complex state orchestration is needed.
- Translate React portals to `svelte/portal` or `<svelte:boundary>` / custom Portal component.
