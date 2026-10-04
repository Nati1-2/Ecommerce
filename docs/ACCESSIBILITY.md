# ♿ Accessibility & Universal Design Guidelines — Nati Platform

This document outlines the accessibility rules, WCAG 2.1 AA targets, semantic HTML requirements, keyboard focus standards, and ARIA usage for the **Nati.** E-Commerce Platform.

---

## 🎯 Target Standard: WCAG 2.1 AA

The **Nati.** platform strives to provide an inclusive shopping experience for all users, including those relying on screen readers, keyboard navigation, or high-contrast display modes.

---

## 🏗️ Semantic HTML Requirements

1. **Use True Native Elements**: Use true `<button>` elements for triggers and `<a>` elements for navigation. NEVER attach `onClick` handlers to `<div>` or `<span>` without making them accessible.
2. **Landmark Structure**: Every page view MUST use semantic HTML5 structural landmarks:
   ```html
   <header> ... </header>
   <nav> ... </nav>
   <main id="main-content"> ... </main>
   <footer> ... </footer>
   ```
3. **Heading Hierarchy**: Enforce a strict single `<h1>` per page, followed by sequential `<h2>`, `<h3>` tags. Never skip heading levels for visual styling.

---

## ⌨️ Keyboard Navigation & Focus Management

1. **Prominent Focus Rings**: All interactive elements (buttons, inputs, links, checkboxes) MUST feature visible focus rings on keyboard navigation (`focus-visible:ring-2 focus-visible:ring-indigo-500`).
2. **Modal Focus Trapping**: When a dialog or slide-over modal opens (e.g. cart drawer or variant selector modal):
   - Shift focus automatically into the modal container.
   - Trap keyboard tab navigation within the open modal.
   - Close the modal upon pressing the `Escape` key.
3. **Skip to Content Link**: Include a hidden "Skip to main content" link at the top of the body for keyboard screen-reader users.

---

## 📝 Accessible Forms & Inputs

- **Explicit Label Association**: Every input MUST be tied to an explicit `<label htmlFor="id">`.
- **Validation Announcements**: Bind input field errors via `aria-invalid="true"` and `aria-describedby="error-id"`.

---

## 🎨 Color Contrast & ARIA Standards

1. **Contrast Ratio**: Ensure a minimum contrast ratio of **4.5:1** for normal text and **3.0:1** for large headings across both Light and Dark themes.
2. **Decorative Icons**: All visual Lucide icons MUST be marked with `aria-hidden="true"` so screen readers ignore non-essential visual elements.
3. **Live Status Announcements**: Use `aria-live="polite"` containers for dynamic toast messages or dynamic cart subtotal updates.
