# ToggleCorp Task-Tracker: Design Document

## 1. Technology Stack

*   **Framework:** Next.js 15 (App Router) + React 19
    *   *Why:* Next.js provides a robust foundation with excellent developer experience, out-of-the-box optimizations, and an intuitive file-based routing system. The App Router enables clean layout composition. I considered Vite for a pure SPA, but Next.js's built-in routing and ecosystem made setup faster.
*   **Styling:** Tailwind CSS v4
    *   *Why:* Rapid styling without context switching. The utility-first approach ensures consistent design tokens and eliminates dead CSS. 
*   **UI Primitives:** Shadcn UI / Radix UI
    *   *Why:* Provides accessible, unstyled components (Dialog, Input) out of the box. It ensures keyboard navigation and ARIA roles are handled correctly without reinventing the wheel.
*   **Icons:** Lucide React
    *   *Why:* Clean, modern, and lightweight SVG icons that integrate seamlessly with React.
*   **State Management:** React `useState` + Custom `useLocalStorage` Hook
    *   *Why:* A custom hook is the simplest way to sync React state with browser storage without the overhead of heavy libraries like Redux or Zustand.

## 2. AI & Tooling Workflow

*   **Antigravity:** Used as the primary code editor and agentic assistant for scaffolding the application structure and executing file modifications.
*   **ChatGPT:** Utilized for initial brainstorming, defining the feature scope, and planning the architecture before writing code.
*   **Claude:** Responsible for code review, performing the codebase audit, and fixing specific bugs (e.g., resolving the React hydration mismatch with `localStorage`).

## 3. Architecture & Data Flow

The application is built entirely as a Client-Side App (using `"use client"` directives) to heavily leverage the browser's `localStorage` for persistence.

*   **State Location:** State lives at the page level (`app/page.tsx` for Projects, `app/tasks/[slug]/page.tsx` for Tasks).
*   **Data Flow:** Data flows top-down. The page component reads from `localStorage` on mount, holds the data in memory via React state, and passes it down to presentation components (`Dashboard`, `Board`, `TaskCard`) via props.
*   **Persistence:** The `useLocalStorage` hook intercepts state updates. Whenever a task or project is added/edited, the hook updates the React state and simultaneously stringifies and saves the data to `localStorage`. An initialization `useEffect` ensures the client safely hydrates the stored data without triggering Next.js SSR mismatch errors.

## 4. How It Could Break (And How to Fix It)

1.  **LocalStorage Quota Exceeded (5MB Limit)**
    *   *The Break:* If a user adds thousands of tasks with massive descriptions, `localStorage.setItem` will throw a `QuotaExceededError`, and the app will silently fail to save new data.
    *   *The Fix:* In production, I would wrap the storage call in a try-catch block that alerts the user. Ultimately, I would migrate to IndexedDB (which has a much larger quota) or a cloud database.
2.  **Multi-Tab Race Conditions**
    *   *The Break:* If a user opens the app in Tab A and Tab B, edits a task in Tab A, and then edits a different task in Tab B, Tab B's save will overwrite Tab A's save because it's using a stale snapshot of the array.
    *   *The Fix:* I would add a `window.addEventListener('storage', ...)` listener to sync the React state whenever `localStorage` changes in another tab. For production, a real database with optimistic concurrency control or WebSockets would be used.
3.  **Data Corruption / Schema Evolution**
    *   *The Break:* If I change the `Task` type in the future (e.g., adding a new required field), the app will crash when it tries to render old `localStorage` data that lacks that field.
    *   *The Fix:* I would introduce runtime schema validation using a library like **Zod**. Before parsing and using data from `localStorage`, I would validate it and provide default values or migrations for outdated objects.

## 5. Trade-Offs Made

1.  **Chevron Buttons over Drag-and-Drop**
    *   *Why:* Implementing drag-and-drop (e.g., `dnd-kit`) provides a slick UX but is notoriously difficult to make fully keyboard accessible and bug-free on mobile. I chose clickable "Move" buttons to guarantee 100% accessibility and simplicity within the time constraint.
2.  **Client-Side Filtering over Server-Side Search**
    *   *Why:* Searching is done instantly in memory using a simple `useMemo` filter. Because `localStorage` naturally caps the dataset size, client-side filtering is blazing fast and saves the complexity of building a debounced API search layer.
3.  **Local Storage over a Real Backend**
    *   *Why:* To keep the scope tight and focus on the UI/UX. It removes latency and allows the app to work entirely offline, but sacrifices cross-device syncing.

## 6. One More Week: What I Would Add/Fix

If given more time, these would be the top priorities:

1.  **Proper Backend & Database Structure:** I would transition from `localStorage` to a hosted PostgreSQL database (e.g., Supabase or Vercel Postgres) using Prisma or Drizzle. This unlocks cross-device syncing, multi-user collaboration, and team workspaces.
2.  **Customizable Columns (Kanban Flexibility):** Instead of locking users into three fixed statuses ("To Do", "In Progress", "Done"), I would refactor the data model to allow users to create, rename, and reorder as many custom columns as they need per project.
3.  **Drag-and-Drop Capability:** With the core functionality rock-solid, I would spend the time to properly implement a robust, accessible drag-and-drop library to make organizing tasks feel more tactile and modern.
