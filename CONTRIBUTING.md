# Contributing to AgriDron Solutions (agridron-frontend)

Thank you for contributing to the AgriDron Solutions frontend application! This document establishes the engineering standards, architecture rules, and development workflows to maintain high codebase quality, consistency, and scalability.

## Table of Contents

1. [Architecture & Design Principles](#architecture--design-principles)
   - [Domain-Driven Design (DDD)](#domain-driven-design-ddd)
   - [Object-Oriented Programming (OOP) & Clean Code](#object-oriented-programming-oop--clean-code)
2. [Git Workflow & Branching Strategy](#git-workflow--branching-strategy)
3. [Conventional Commits](#conventional-commits)
4. [Semantic Versioning (SemVer)](#semantic-versioning-semver)
5. [TypeScript Guidelines](#typescript-guidelines)
6. [Angular & Angular Material Standards](#angular--angular-material-standards)
7. [Quality Assurance & Development Workflow](#quality-assurance--development-workflow)
8. [Pull Request (PR) Process](#pull-request-pr-process)

---

## Architecture & Design Principles

### Domain-Driven Design (DDD)

The project organizes code into **Bounded Contexts** located under `src/app/`:

- **fieldManagement**: Core agricultural domain (Farms, Parcels, Crops, Fumigation Areas)
- **inventoryResourceManagement**: Drone fleet, agrochemicals, nozzles, and maintenance records
- **analyticsAndReporting**: Mission reports, operational metrics, performance indicators, mission histories
- **weatherIntegration**: Weather conditions and weather alerts
- **iam**: Identity and Access Management (Authentication, User registration, session tokens, authorization guards)
- **shared**: Cross-cutting reusable building blocks, layout, internationalization, base abstractions

Each bounded context is strictly divided into four architectural layers:

```
src/app/<bounded-context>/
├── domain/
│   └── model/           # Pure domain entities, value objects, domain interfaces, and commands.
│                        # Must NOT depend on Angular, HTTP, or UI layers.
├── infrastructure/      # REST API endpoints, DTO resources/responses, and Assemblers.
│                        # Handles HTTP communication and serialization/deserialization.
├── application/         # Application stores, state orchestrators, and reactive use-case workflows.
└── presentation/        # Standalone components, views, dialogs, forms, and route configurations.
    ├── components/      # UI components scoped to the context.
    └── routes/          # Routed view pages and forms (lazy-loaded route configs).
```

**Layer Dependency Rules:**

- `domain` → **no external dependencies** (pure TypeScript)
- `infrastructure` → depends on `domain` + Angular HttpClient
- `application` → depends on `domain` + `infrastructure` (via interfaces)
- `presentation` → depends on `application` + `domain` + Angular

### Object-Oriented Programming (OOP) & Clean Code

- **SOLID Principles**: Adhere to Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion across all classes and abstractions.
- **Encapsulation**: Domain entities and command models protect internal state using **TypeScript `private` fields** (or native `#` private fields where supported) rather than soft `_` prefixes, exposing explicit getters/setters or business behavior methods.
- **Assembler Pattern**: Keep infrastructure DTOs (`*Resource`, `*Response`) decoupled from domain entities (`*Entity`) using pure, bidirectional `BaseAssembler` implementations.
- **Composition over Inheritance**: Prefer composing specialized services/endpoints into facades (`BaseApi`) over deep class inheritance hierarchies.
- **Immutability**: Prefer `readonly` properties and immutable data structures in domain models.
- **Pure Functions**: Application layer use cases should be pure functions where possible; side effects isolated to infrastructure.

---

## Git Workflow & Branching Strategy

We follow the standard **Git Flow** branching model:

```
main ──────────────────────────────────────────●────── (Production Releases)
         \                                    /
develop ──●─────────●───────────────●────────●──────── (Integration Branch)
           \       /                 \      /
feature/    ●─────●                   ●────●           (Feature Branches)
```

### Branch Types & Naming Conventions

| Branch | Purpose | Source | Target |
|--------|---------|--------|--------|
| `main` | Production-ready code. Only merged from `release/*` or `hotfix/*`. Tagged with SemVer (e.g., `v1.2.0`). | — | — |
| `develop` | Primary integration branch where completed features are merged. | — | — |
| `feature/<context>-<short-description>` | New features or enhancements. | `develop` | `develop` |
| `bugfix/<context>-<issue-description>` | Non-urgent bug fixes. | `develop` | `develop` |
| `release/v<MAJOR.MINOR.PATCH>` | Release preparation, final validation, version bump. | `develop` | `main` + `develop` |
| `hotfix/v<MAJOR.MINOR.PATCH>` | Critical production fixes. | `main` | `main` + `develop` |

**Context values**: `fieldManagement`, `inventory`, `analytics`, `weather`, `iam`, `shared`, `app`

**Examples:**
- `feature/fieldManagement-farm-crud`
- `feature/inventory-drone-fleet`
- `bugfix/analytics-report-generation`
- `feature/iam-oauth-integration`
- `release/v1.0.0`
- `hotfix/v1.0.1`

---

## Conventional Commits

Commit messages must follow the **Conventional Commits v1.0.0** specification.

### Commit Format

```
<type>(<scope>): <short summary in imperative mood>

[optional body providing technical context, rationale, and motivation]

[optional footer(s) such as BREAKING CHANGE or issue tracker references]
```

### Commit Types

| Type | Description |
|------|-------------|
| `feat` | A new feature for the user or system |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, missing semi-colons, whitespace (no code change) |
| `refactor` | Refactoring code without fixing a bug or adding a feature |
| `perf` | Code changes that improve performance |
| `test` | Adding or updating unit tests |
| `build` | Build system, toolchain, or external dependency changes |
| `ci` | CI configuration files and automation scripts |
| `chore` | Maintenance tasks that do not alter production code |

### Allowed Scopes

Scopes must match a **Bounded Context**, core layer, or tool:

`fieldManagement`, `inventory`, `analytics`, `weather`, `iam`, `shared`, `app`, `deps`, `config`, `theme`, `env`

### Examples

```
feat(fieldManagement): add farm creation form with validation
fix(analytics): resolve mission report date filter offset bug
docs(shared): update ADR for Material 3 design token adoption
refactor(inventory): migrate drone store observables to Angular signals
perf(weather): cache weather conditions with TTL strategy
build(deps): update Angular to v22.1.0
chore(config): add staging environment configuration
```

---

## Semantic Versioning (SemVer)

Versions follow the **SemVer 2.0.0** schema: `MAJOR.MINOR.PATCH`

- **MAJOR** (X.0.0): Incompatible API changes, breaking route restructuring, fundamental architecture rewrites, or Angular major version upgrades.
- **MINOR** (0.X.0): Backwards-compatible new features, new bounded contexts, added capabilities, or Angular minor version upgrades.
- **PATCH** (0.0.X): Backwards-compatible bug fixes, security patches, or dependency patches.

**Release Process:**
1. Create `release/v<MAJOR.MINOR.PATCH>` from `develop`
2. Update version in `package.json`, `CHANGELOG.md`
3. Run full test suite and build verification
4. Merge to `main` and tag (`git tag -a v<MAJOR.MINOR.PATCH>`)
5. Merge back to `develop`

---

## TypeScript Guidelines

- **Strict Type Checking**: Maintain strict TypeScript configuration (`strict: true`, `noImplicitAny: true`, `noImplicitReturns: true`, `noUncheckedIndexedAccess: true`).
- **Avoid `any`**: Use explicit interfaces, generics, or `unknown` (with type narrowing) instead of `any`.
- **Target ECMAScript**: Target modern ECMAScript standard (ES2024) per `tsconfig.json`.
- **Private Properties in Domain Models**: Use TypeScript `private` fields (or native `#` private fields) for domain entity and command backing fields to ensure hard runtime encapsulation.
- **Naming Conventions**:
  - `PascalCase`: Classes, interfaces, types, enums, components (`FarmEntity`, `BaseApi`, `FarmListComponent`)
  - `camelCase`: Properties, methods, functions, variables, signals (`farmId`, `loadFarms`, `currentUser`)
  - `UPPER_SNAKE_CASE`: Global constants and immutable configuration maps (`API_BASE_URL`, `DEFAULT_PAGE_SIZE`)
  - `kebab-case`: All file and folder names (`farm-api-endpoint.ts`, `farm-list.component.html`, `farm-page.component.ts`)

### Domain Entity Pattern

```typescript
// domain/model/farm.entity.ts
export class FarmEntity extends BaseEntity {
  #name: string;
  #location: string;
  #ownerId: number;
  #image: string;

  constructor(id: number, name: string, location: string, ownerId: number, image: string) {
    super(id);
    this.#name = name;
    this.#location = location;
    this.#ownerId = ownerId;
    this.#image = image;
  }

  // Explicit getters
  get name(): string { return this.#name; }
  get location(): string { return this.#location; }
  get ownerId(): number { return this.#ownerId; }
  get image(): string { return this.#image; }

  // Business behavior methods (not anemic setters)
  updateDetails(name: string, location: string): void {
    this.#name = name;
    this.#location = location;
  }
}
```

---

## Angular & Angular Material Standards

### Angular Modern Conventions

- **Standalone Components**: Do not use `NgModule`. Declare all components, pipes, and directives as `standalone: true`.
- **Dependency Injection**: Use `inject(Service)` (via `inject()` function) rather than constructor-based injection for cleaner, modern DI.
- **Reactivity via Signals**:
  - Use `signal()`, `WritableSignal`, `computed()`, and `effect()` for local and store state.
  - Use modern signal queries: `viewChild()`, `viewChildren()`, `contentChild()`, `contentChildren()`.
- **Change Detection**: Leverage Angular's default `OnPush` change detection and signal-based reactivity. Avoid `ChangeDetectorRef.detectChanges()`.
- **Reactive Forms**: Use `FormBuilder` with explicit validators. Extend shared `BaseForm` for standardized validation feedback.
- **Lazy Loading**: All feature routes use lazy loading via `loadChildren`/`loadComponent`.
- **Route Guards**: Use functional guards (`canActivate: [() => inject(AuthService).isAuthenticated()]`).

### Angular Material (M3) Guidelines

- **Theme Consistency**: Use Material 3 (M3) design tokens (`var(--mat-sys-*)`) and `@angular/material` mixins (`@include mat.theme(...)`).
- **Styles Reference**: Global styles maintained via `src/material-theme.scss` and `src/styles.css` referenced in `angular.json`.
- **Component Usage**: Prefer Angular Material components (`MatTable`, `MatDialog`, `MatFormField`, etc.) over custom implementations.
- **Accessibility (a11y)**:
  - All interactive elements must include descriptive `aria-label` or visible labels.
  - Image assets must supply descriptive `alt` attributes.
  - Ensure high color contrast complying with WCAG 2.1 AA standards.
  - Use `MatTooltip` for additional context on icon-only buttons.

### Internationalization (i18n)

- **No Hardcoded Strings**: Do not hardcode UI strings in component templates or code.
- **Translation Files**: Add English keys to `src/assets/i18n/en.json` and Spanish translations to `src/assets/i18n/es.json` (to be created).
- **Usage in Templates**: Render localized strings using the translate pipe: `{{ 'farms.title' | translate }}`.
- **Usage in Components**: Use `TranslateService` with `instant()` or `get()` for dynamic strings.

---

## Quality Assurance & Development Workflow

### Prerequisites

- **Node.js**: v22.18.0+ or v24.12.0+ (Active LTS or modern)
- **npm**: v10+
- **Angular CLI**: v22+ (installed locally via `npx` or `npm run ng`)

### Development Commands

```bash
# Install dependencies
npm install

# Start development server (frontend at localhost:4200)
npm start
# or: ng serve

# Start fake REST API (json-server at localhost:3000)
npm run server
# or: cd server && npx json-server --watch db.json --routes routes.json --port 3000

# Run both concurrently (requires concurrently)
npm install -g concurrently
concurrently "npm run server" "npm start"

# Run ESLint linter
npm run lint
# or: npx eslint src/**/*.ts

# Run unit tests (Vitest)
npm test
# or: npx vitest run

# Run unit tests with UI
npm run test:ui
# or: npx vitest --ui

# Build production bundle
npm run build
# or: ng build --configuration production

# Preview production build locally
npm run preview
# or: ng build && npx http-server dist/agridron-frontend/browser
```

### Code Quality Gates (Pre-commit / CI)

All PRs must pass:

1. **Linting**: `npm run lint` — zero warnings/errors
2. **Type Checking**: `npx tsc --noEmit` — zero errors
3. **Unit Tests**: `npm test` — all tests pass, coverage thresholds met
4. **Build**: `npm run build` — succeeds without budget or compilation errors
5. **Format Check**: `npx prettier --check .` — consistent formatting

---

## Pull Request (PR) Process

Before submitting a pull request, verify that:

- [ ] Code adheres to **DDD boundaries** and **OOP principles** (layer isolation, encapsulation, assemblers).
- [ ] All commit messages adhere to **Conventional Commits** format.
- [ ] Code passes **linting** with zero warnings/errors (`npm run lint`).
- [ ] **TypeScript compilation** succeeds with strict mode (`npx tsc --noEmit`).
- [ ] All **unit tests** pass cleanly (`npm test`).
- [ ] **Production build** succeeds without budget or compilation errors (`npm run build`).
- [ ] New features include **unit tests** (minimum 80% coverage for new code).
- [ ] **Documentation** updated: `README.md`, `CHANGELOG.md`, ADRs if architectural changes.
- [ ] **Translation keys** added for all new UI strings (English + Spanish).
- [ ] **No hardcoded strings** in templates or components.
- [ ] **Accessibility** verified: labels, contrast, keyboard navigation.
- [ ] **Performance**: No unnecessary re-renders, proper `OnPush`/signals usage.
- [ ] The PR targets the **`develop` branch** (or `main` for hotfixes only).

### PR Title Format

Follow Conventional Commits for PR titles:

```
feat(fieldManagement): implement farm CRUD with parcel association
fix(analytics): correct operational metrics calculation
refactor(shared): migrate base assembler to generic type constraints
```

### Review Checklist for Reviewers

- [ ] Architecture: Correct bounded context and layer placement
- [ ] Domain: Entities encapsulate behavior, no anemic models
- [ ] Infrastructure: Assemblers correctly map DTO ↔ Entity
- [ ] Application: Stores use signals, no direct HTTP calls
- [ ] Presentation: Standalone components, proper DI, signal queries
- [ ] Tests: Meaningful assertions, edge cases covered
- [ ] i18n: All user-facing text uses translate pipe/service
- [ ] A11y: Semantic HTML, ARIA attributes, focus management
- [ ] Performance: No memory leaks, proper subscription cleanup

---

## Additional Resources

- [Angular Style Guide](https://angular.dev/style-guide)
- [Angular Material Theming](https://material.angular.dev/guide/theming)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Domain-Driven Design Reference](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Project README](./README.md)
- [Architecture Decision Records](./docs/adr/) (to be created)