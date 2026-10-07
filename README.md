# AgriDron Solutions (agridron-frontend)

## Overview

**agridron-frontend** is an Angular 22 client application for managing agricultural drone operations in the AgriDron Solutions domain. The current implementation focuses on maintaining farms, parcels, crops, fumigation areas, missions, drones, and inventory, with the codebase organized around Domain-Driven Design (DDD) bounded contexts and layered responsibilities.

In development mode, the application consumes a local fake API exposed through json-server. The frontend is configured to call `http://localhost:3000/api/v1` for agricultural resources.

## Features

- Farm maintenance with create, read, update, and delete behavior
- Parcel management with GeoJSON geometry support and farm/crop association
- Crop variety maintenance with create, read, update, and delete behavior
- Fumigation area management within parcels
- Mission reports and operational metrics tracking
- Drone fleet management with status, battery, and maintenance tracking
- Chemical and nozzle inventory management
- Weather monitoring with alerts for wind and precipitation
- Reactive state management with Angular Signals and RxJS
- Material Design 3 (M3) styling with custom theme tokens via Angular Material
- Internationalization with English and Spanish resources using ngx-translate
- Client-side navigation with Angular Router
- HTTP communication through Angular HttpClient and REST Assembler pattern
- Layered organization by bounded context:
  - **fieldManagement**: Core agricultural domain (farms, parcels, crops, fumigation areas)
  - **inventoryResourceManagement**: Drone fleet, chemicals, nozzles, and maintenance records
  - **analyticsAndReporting**: Mission reports, operational metrics, performance indicators
  - **weatherIntegration**: Weather conditions and alerts
  - **iam**: Identity and access management (authentication, user profiles)
  - **shared**: Cross-cutting reusable technical contracts, base API infrastructure, shell layout, and internationalization components

## Current Scope

The currently enabled application routes expose:

- `/home` — Dashboard overview
- `/auth/sign-in` — User sign-in
- `/auth/sign-up` — User registration
- `/auth/user-profile` — User profile management
- `/farms` — Farm listing and management
- `/farms/new` — Farm creation
- `/farms/:id/edit` — Farm editing
- `/parcels` — Parcel listing and management
- `/parcels/new` — Parcel creation
- `/parcels/:id/edit` — Parcel editing
- `/parcels/:id` — Parcel detail view
- `/crops` — Crop listing and management (placeholder routes)
- `/fumigation-areas` — Fumigation area management (placeholder routes)
- `/analytics` — Reports and analytics
- `/drones` — Drone fleet listing and management

The codebase contains infrastructure for missions, drones, weather, chemicals, nozzles, and maintenance, with varying levels of presentation view completion.

## Architecture Overview

The application structure follows Domain-Driven Design (DDD) bounded contexts and layered responsibilities:

- **fieldManagement**: Core domain managing farms, parcels, crops, and fumigation areas.
- **inventoryResourceManagement**: Drone fleet, agrochemicals, nozzles, and maintenance records.
- **analyticsAndReporting**: Mission reports, operational metrics, performance indicators, and mission histories.
- **weatherIntegration**: Weather conditions and weather alerts.
- **iam**: Authentication, authorization, and user management.
- **shared**: Cross-cutting reusable technical contracts, base API infrastructure, shell layout, and internationalization components.

Each bounded context is structured into four distinct layers:

- **domain**: Entities (with TypeScript private fields), aggregates, and command models.
- **application**: Reactive state management use cases (Angular Signals, RxJS stores/services).
- **infrastructure**: REST API endpoints, DTO models, assemblers, HTTP client.
- **presentation**: Angular components, routed views, and forms.

## Project Structure

The repository layout uses the following tree structure:

```
agridron-frontend/
├── public/                             # Static public assets
├── server/                             # Fake REST API backend (json-server)
│   ├── db.json                         # Mock database resource collections
│   └── routes.json                     # Custom route rewrite definitions (/api/v1/*)
├── src/                                # Application source code
│   ├── index.html                      # Single-page HTML entry point
│   ├── main.ts                         # Application bootstrap entry point
│   ├── styles.css                      # Global CSS stylesheet
│   ├── material-theme.scss             # Angular Material 3 custom theme
│   ├── environments/                   # Environment configurations
│   │   ├── environment.ts              # Production environment
│   │   └── environment.development.ts  # Development environment
│   ├── app/                            # Main application module
│   │   ├── app.ts                      # Root component (standalone)
│   │   ├── app.html                    # Root component template
│   │   ├── app.css                     # Root component styles
│   │   ├── app.config.ts               # Application configuration (providers, routes)
│   │   ├── app.routes.ts               # Root routing definitions
│   │   ├── fieldManagement/            # Field Management Bounded Context
│   │   │   ├── application/            # Application state management (stores)
│   │   │   │   ├── farm.store.ts       # Farm store (CRUD operations)
│   │   │   │   ├── parcel.store.ts     # Parcel store (CRUD operations)
│   │   │   │   ├── crop.store.ts       # Crop store (CRUD operations)
│   │   │   │   └── fumigation-area.store.ts  # Fumigation area store
│   │   │   ├── domain/                 # Domain model (entities)
│   │   │   │   └── model/
│   │   │   │       ├── farm.entity.ts          # Farm entity
│   │   │   │       ├── parcel.entity.ts        # Parcel entity with GeoJSON geometry
│   │   │   │       ├── crop.entity.ts          # Crop entity
│   │   │   │       └── fumigationArea.entity.ts # Fumigation area entity
│   │   │   ├── infrastructure/         # Endpoints, responses, assemblers
│   │   │   │   ├── farm-api-endpoint.ts      # Farm REST endpoint
│   │   │   │   ├── farm-assembler.ts         # Farm DTO ↔ Entity assembler
│   │   │   │   ├── parcel-api-endpoint.ts    # Parcel REST endpoint
│   │   │   │   ├── parcel-assembler.ts       # Parcel DTO ↔ Entity assembler
│   │   │   │   ├── crop-api-endpoint.ts      # Crop REST endpoint
│   │   │   │   ├── crop-assembler.ts         # Crop DTO ↔ Entity assembler
│   │   │   │   ├── fumigation-area-api-endpoint.ts  # Fumigation area REST endpoint
│   │   │   │   ├── fumigation-area-assembler.ts     # Fumigation area assembler
│   │   │   │   ├── field-management-api.ts   # Base API client for field management
│   │   │   │   └── field-management-response.ts # Base response wrapper
│   │   │   └── presentation/           # Components, views, forms
│   │   │       ├── components/
│   │   │       │   ├── farm-page/            # Farm dashboard page
│   │   │       │   ├── farm-list/            # Farm list component
│   │   │       │   ├── farm-item/            # Farm item component
│   │   │       │   ├── new-farm-form/        # Farm create/edit form
│   │   │       │   ├── parcel-list/          # Parcel list component
│   │   │       │   ├── parcel-item/          # Parcel item component
│   │   │       │   ├── parcel-form/          # Parcel create/edit form
│   │   │       │   ├── parcel-detail/        # Parcel detail view
│   │   │       │   ├── crop-list/            # Crop list component
│   │   │       │   ├── crop-item/            # Crop item component
│   │   │       │   ├── crop-form/            # Crop create/edit form
│   │   │       │   ├── fumigation-area-list/ # Fumigation area list
│   │   │       │   ├── fumigation-area-item/ # Fumigation area item
│   │   │       │   └── fumigation-area-form/ # Fumigation area form
│   │   │       └── routes/
│   │   │           ├── fieldManagement.routes.ts  # Farm routes
│   │   │           ├── parcel.routes.ts          # Parcel routes
│   │   │           ├── crop.routes.ts            # Crop routes
│   │   │           └── fumigation-area.routes.ts # Fumigation area routes
│   │   ├── inventoryResourceManagement/ # Inventory & Resource Management BC
│   │   │   ├── application/            # Stores (drone, maintenance)
│   │   │   ├── domain/                 # Entities (drone, agrochemical, nozzle, maintenance)
│   │   │   ├── infrastructure/         # API endpoints, assemblers
│   │   │   └── presentation/           # Components (drone-page, dron-list, dron-item)
│   │   ├── analyticsAndReporting/      # Analytics & Reporting BC
│   │   │   ├── application/            # Stores (mission-report, mission-history, operational-metric, performance-indicator)
│   │   │   ├── domain/                 # Entities (mission-report, mission-history, operational-metric, performance-indicator)
│   │   │   ├── infrastructure/         # API endpoints, assemblers
│   │   │   └── presentation/           # Components (reports-page, report-detail, supply-usage-table, performance-indicator-list, mission-history-table)
│   │   ├── weatherIntegration/         # Weather Integration BC
│   │   │   ├── application/            # Weather service
│   │   │   ├── domain/                 # Entities (weather-condition, weather-alert)
│   │   │   └── infrastructure/         # API endpoints, assemblers
│   │   ├── iam/                        # Identity & Access Management BC
│   │   │   ├── application/            # Authentication service
│   │   │   ├── domain/                 # Entities (user, user-role), commands (sign-in, sign-up)
│   │   │   ├── infrastructure/         # Auth API, assemblers, request DTOs
│   │   │   └── presentation/           # Components (sign-in, sign-up, user-profile)
│   │   └── shared/                     # Shared Kernel & Infrastructure
│   │       ├── infrastructure/         # Base HTTP client, base API endpoint, base assembler, base entity, base response, error handling
│   │       └── presentation/           # Shared views (home, page-not-found)
├── angular.json                        # Angular CLI configuration
├── package.json                        # npm dependencies and project scripts
├── tsconfig.json                       # TypeScript configuration
├── tsconfig.app.json                   # App-specific TypeScript config
├── tsconfig.spec.json                  # Test TypeScript config
└── README.md                           # Main project documentation
```

## Technologies

- **Framework**: Angular 22 (Standalone Components, Signals, Control Flow Syntax)
- **Language**: TypeScript 6 (strict mode, ES2024)
- **UI & Theming**: Angular Material 22 (Material 3 tokens, custom theme via SCSS)
- **State & Reactivity**: Angular Signals, RxJS 7
- **Internationalization**: ngx-translate 18
- **Routing**: Angular Router 22 (Lazy loading, Route guards)
- **HTTP Client**: Angular HttpClient (with interceptors)
- **Mock API**: json-server 0.17
- **Build Tool**: Angular CLI 22 (esbuild/Vite)
- **Testing**: Vitest 4 (unit), Angular testing utilities
- **Code Quality**: ESLint, Prettier

## Documentation

- **Environment Configuration**: `src/environments/` — Environment-specific configuration files.
- **API Endpoints**: Defined in `environment.ts` / `environment.development.ts`.
- **Mock Database**: `server/db.json` — Complete mock data for farms, parcels, crops, drones, weather, missions, chemicals, nozzles, maintenance, and users.
- **Route Rewrites**: `server/routes.json` — Maps `/api/v1/*` to json-server collections.

## Prerequisites

Before running the project, make sure the environment includes:

- Node.js (v22.18.0+ or v24.12.0+)
- npm

## Installation

Install project dependencies from the project root:

```bash
npm install
```

## Running the Application

### Option 1: Start both frontend and fake API together

```bash
# Terminal 1: Fake REST API
npm run server
# or manually:
cd server && npx json-server --watch db.json --routes routes.json --port 3000

# Terminal 2: Frontend Dev Server
npm start
```

The application will be available at:
- **Frontend**: `http://localhost:4200/`
- **Fake API**: `http://localhost:3000/api/v1/`

### Option 2: Using Angular CLI directly

```bash
ng serve
```

## Available Scripts

From the project root, the following scripts are available:

| Script | Description |
|--------|-------------|
| `npm start` | Starts Angular development server (`ng serve`) |
| `npm run build` | Compiles and builds production bundles (`ng build`) |
| `npm run watch` | Builds with watch mode in development |
| `npm run test` | Executes unit tests with Vitest (`ng test`) |
| `npm run server` | Starts json-server on port 3000 |

## Fake API Notes

- The fake API provides resources for: farms, parcels, fumigation-areas, crops, weather, mission-reports, mission-histories, operational-metrics, performance-indicators, drones, chemicals, nozzles, maintenance, and users.
- The development environment maps `/api/v1/*` requests through `server/routes.json` to json-server collections.
- Angular's HttpClient calls `/api/v1/...` which should be proxied to `http://localhost:3000` in development (configure proxy in `angular.json` or use a proxy.conf.json).
- The API base URL is configured in `src/environments/environment.development.ts`.

## Environment Variables

Key environment variables (defined in `src/environments/environment.ts` / `environment.development.ts`):

| Variable | Description | Default (dev) |
|----------|-------------|---------------|
| `AgriDronProviderApiBaseUrl` | Base URL for API calls | `http://localhost:3000/api/v1` |
| `AgriDronProviderFarmsEndpointPath` | Farms endpoint path | `/farms` |
| `AgriDronProviderParcelsEndpointPath` | Parcels endpoint path | `/parcels` |
| `AgriDronProviderCropsEndpointPath` | Crops endpoint path | `/crops` |
| `AgriDronProviderFumigationAreasEndpointPath` | Fumigation areas endpoint path | `/fumigation-areas` |
| `AgriDronProviderMissionReportsEndpointPath` | Mission reports endpoint path | `/mission-reports` |
| `AgriDronProviderMissionHistoriesEndpointPath` | Mission histories endpoint path | `/mission-histories` |
| `AgriDronProviderOperationalMetricsEndpointPath` | Operational metrics endpoint path | `/operational-metrics` |
| `AgriDronProviderPerformanceIndicatorsEndpointPath` | Performance indicators endpoint path | `/performance-indicators` |
| `AgriDronProviderDronesMetricsEndpointPath` | Drones endpoint path | `/drones` |
| `AgriDronProvideChemicalsEndpointPath` | Chemicals endpoint path | `/chemicals` |
| `AgriDronProvideNozzlesEndpointPath` | Nozzles endpoint path | `/nozzles` |
| `AgriDronProvideMaintenanceRecordEndpointPath` | Maintenance records endpoint path | `/maintenance` |
| `weatherApiBaseUrl` | Weather API base URL | `http://localhost:3000/api/v1` |
| `weatherEndpointPath` | Weather endpoint path | `/weather` |

## Project Notes

- Translation files are managed via ngx-translate (to be configured in `src/assets/i18n/`).
- The development API base URL is defined in `environment.development.ts`.
- The production environment file points to a mockapi.io endpoint which should be adjusted for the real deployment target.
- Angular Material components are used with custom M3 theme tokens defined in `material-theme.scss`.
- The layout uses Angular Material components (sidenav, toolbar, list) with responsive content area.
- Domain entities use TypeScript `private` fields for encapsulation.
- Assemblers transform DTOs ↔ Domain Entities, keeping the domain pure.
- All components are standalone (no NgModule required).

## Development Workflow

For local development, start the fake API first and then start the Angular application:

```bash
# Terminal 1: Fake REST API
cd server && npx json-server --watch db.json --routes routes.json --port 3000

# Terminal 2: Angular Dev Server
ng serve
```

Or run them in parallel using a tool like `concurrently`:

```bash
npm install -g concurrently
concurrently "npm run server" "npm start"
```

## Code Scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running Unit Tests

To execute unit tests with the Vitest test runner, use the following command:

```bash
ng test
```

## Running End-to-End Tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.