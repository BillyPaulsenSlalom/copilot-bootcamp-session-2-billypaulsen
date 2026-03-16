# UI Guidelines

These guidelines define the core visual and interaction standards for the TODO app.

## Goals

- Build a clean, calming, and focused experience for managing tasks.
- Use Material components consistently across screens.
- Ensure full keyboard accessibility for all features.

## Design System and Components

- Use Material Design components for all primary UI patterns.
- Prefer Material components over custom controls unless a custom control is necessary for a documented requirement.
- Keep component usage consistent across the app (same component for the same interaction pattern).

### Required Component Patterns

- App shell: Material app bar and content containers.
- Task input: Material text field with clear label and helper/error states.
- Actions: Material buttons (contained/outlined/text) based on action priority.
- Task list: Material list or card patterns with clear hierarchy.
- Selection and status: Material checkbox/switch/chip components as appropriate.
- Feedback: Material snackbar/alert/progress indicators for async states and confirmations.
- Dialogs: Material dialog for confirmations and destructive actions.

## Visual Style

### Color Palette (Calming Blues)

Use a blue-led palette with soft contrast and neutral supporting tones.

- Primary: #2F6FA8 (main actions, active states)
- Primary dark: #1E4F7A (hover/pressed states)
- Primary light: #EAF3FB (subtle backgrounds, selected rows)
- Accent: #5AA3D6 (secondary emphasis)
- Background: #F7FAFD (page background)
- Surface: #FFFFFF (cards, dialogs, form surfaces)
- Text primary: #1F2A37
- Text secondary: #4B5B6B
- Divider/border: #D6E2EE
- Error: #B3261E
- Success: #2E7D32

### Contrast and Readability

- Maintain WCAG 2.1 AA contrast at minimum.
- Body text should generally meet at least 4.5:1 contrast.
- Large text and UI state indicators should meet at least 3:1 contrast.
- Never use color alone to communicate status; add text labels or icons.

## Layout and Spacing

- Use an 8px spacing rhythm for margins, paddings, and gaps.
- Keep layouts uncluttered with clear visual grouping.
- Prioritize readable line lengths and avoid dense text blocks.
- Ensure responsive behavior for mobile and desktop widths.

## Typography

- Use the Material default type scale for consistency.
- Keep headings short and descriptive.
- Use sentence case for labels and actions.
- Use concise microcopy for errors, hints, and empty states.

## Interaction and States

- Every interactive component must include visible states: default, hover, focus, active, disabled.
- Loading and saving actions must communicate progress clearly.
- Destructive actions must require explicit confirmation.
- Undo should be offered when feasible (for example, after deleting a task).

## Keyboard Accessibility Requirements

Keyboard accessibility is mandatory for all core workflows.

### Navigation and Focus

- All interactive elements must be reachable using Tab/Shift+Tab.
- Focus order must follow visual and logical reading order.
- Use visible focus indicators with high contrast on all focusable controls.
- Do not remove browser focus outlines unless replaced by a clearly visible custom focus style.

### Keyboard Operations

- All actions available by mouse must be available by keyboard.
- Enter/Space should activate buttons and checkboxes according to expected behavior.
- Escape should close dialogs and transient overlays.
- Arrow key behavior should be implemented for composite controls where expected.

### Forms and Validation

- Inputs must have persistent, programmatically associated labels.
- Validation messages must be announced and discoverable through keyboard flow.
- Error states must include text feedback and not rely on color only.

### Screen Reader and Semantics

- Use semantic HTML as the default.
- Add ARIA only when native semantics are insufficient.
- Ensure dynamic updates (such as task added/deleted notifications) are announced appropriately.
- Verify accessible names for icon-only buttons.

## Content and Feedback Guidelines

- Keep action labels specific: "Add task" instead of "Submit" where applicable.
- Empty states should explain what to do next.
- Confirmation and error messages should be concise and actionable.
- Avoid jargon; write in plain, user-centered language.

## Quality Checklist

Before a UI change is considered complete, verify:

- Material components are used consistently.
- Color usage follows the blue calming palette.
- Focus indicators are visible and predictable.
- Full keyboard-only completion of task workflows is possible.
- Contrast checks pass WCAG AA.
- Responsive behavior works across common viewport sizes.
