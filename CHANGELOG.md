# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-06

### Added

- **Core Domain CRUD Operations**: Complete Create, Read, Update, Delete implementations across all bounded contexts:
  - **fieldManagement**: Farms, Parcels (with GeoJSON geometry), Crops, Fumigation Areas
  - **inventoryResourceManagement**: Drones, Agrochemicals, Nozzles, Maintenance Records
  - **analyticsAndReporting**: Mission Reports, Mission Histories, Operational Metrics, Performance Indicators
  - **weatherIntegration**: Weather Conditions, Weather Alerts
  - **iam**: User Authentication (Sign In, Sign Up), User Profiles

- **Domain-Driven Design Architecture**: Strict four-layer separation per bounded context:
  - `domain/model/` — Pure entities with TypeScript private field encapsulation
  - `infrastructure/` — REST endpoints, DTO resources, assemblers (DTO ↔ Entity)
  - `application/` — Reactive stores using Angular Signals and RxJS
  - `presentation/` — Standalone Angular components, lazy-loaded routes

- **Angular 22 Modern Stack**:
  - Standalone components (no NgModule)
  - Angular Signals for reactive state management
  - Functional dependency injection with `inject()`
  - Angular Router with lazy loading and functional guards
  - Angular HttpClient with interceptor-based error handling
  - OnPush change detection strategy

- **UI & Theming**:
  - Angular Material 22 with Material Design 3 (M3) design tokens
  - Custom theme via `src/material-theme.scss`
  - Responsive layout with MatSidenav, MatToolbar, MatList
  - Accessible components (WCAG 2.1 AA compliant)

- **Internationalization (i18n)**:
  - ngx-translate integration
  - Translation infrastructure ready for English/Spanish
  - Translate pipe for template localization

- **Fake REST API Backend**:
  - json-server with `server/db.json` mock data
  - Custom routes via `server/routes.json` (`/api/v1/*` mapping)
  - Complete mock datasets for all entities

- **Development Infrastructure**:
  - Vitest for unit testing
  - ESLint + Prettier for code quality
  - Environment-based configuration (`environment.ts` / `environment.development.ts`)
  - Vite-powered build via Angular CLI

- **Project Documentation**:
  - Comprehensive README.md with architecture overview, project structure, and run instructions
  - CONTRIBUTING.md with engineering standards, Git Flow, Conventional Commits, and PR process

### Infrastructure

- **Shared Kernel** (`shared/`):
  - `BaseEntity` — Base class with identity management
  - `BaseApi` — Axios wrapper with interceptors
  - `BaseApiEndpoint` — Generic REST endpoint abstraction
  - `BaseAssembler` — Bidirectional DTO ↔ Entity transformation
  - `BaseResponse` — Standardized API response wrapper
  - Error handling mixin for infrastructure layer

- **Authentication & Authorization**:
  - JWT-based authentication flow
  - Route guards for protected routes
  - User role management (Admin, Operator, Viewer)
  - Session persistence

### Developer Experience

- **Code Scaffolding**: Angular CLI schematics for components, services, guards
- **Type Safety**: Strict TypeScript configuration (strict mode, noImplicitAny)
- **Testing**: Vitest with component testing utilities
- **Linting**: ESLint with Angular-specific rules
- **Formatting**: Prettier with consistent code style

---

## [Unreleased]

### Planned

- **Parcel Detail View Enhancement**: Map visualization for GeoJSON geometry
- **Mission Management CRUD**: Full mission lifecycle (planning, execution, completion)
- **Drone Telemetry Dashboard**: Real-time battery, GPS, status monitoring
- **Weather Alert Notifications**: Push notifications for critical weather conditions
- **Report Generation**: PDF/Excel export for mission reports and analytics
- **Multi-language Support**: Complete Spanish translations
- **E2E Testing**: Cypress or Playwright integration
- **CI/CD Pipeline**: GitHub Actions for build, test, deploy
- **Docker Support**: Containerization for deployment
- **API Documentation**: OpenAPI/Swagger spec generation