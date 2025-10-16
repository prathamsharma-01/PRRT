# Copilot Instructions for Quick Commerce Platform (Dark Store Model)

## Project Overview
This is a **microservices-based quick commerce platform** implementing the dark store model. It consists of 4 frontend applications and 9 backend microservices, currently in early development (backend services are stubbed).

**Key Brand**: "Quikry" - appears in customer-facing apps and localStorage keys.

## Architecture & Structure

### Frontend Applications (React/React Native)
Located in `openwork-platform/frontend/`:

1. **customer-app/** - Vite React app (port 3000)
   - Main customer-facing shopping interface
   - Uses Leaflet for maps, localStorage for state persistence
   - Key pattern: localStorage keys prefixed with `quikry_` (e.g., `quikry_pincode`)
   - Entry point: `src/main.jsx`

2. **delivery-app/web/** - Vite React app (port 5174)
   - Order management and map-based delivery tracking
   - Uses Leaflet maps, localStorage for order state (`delivery_orders_v1`)

3. **seller-dashboard/web/** - Vite React app (port 5175)
   - Seller product/inventory management (minimal implementation)

4. **customer-service-dashboard/web/** - Vite React app (port 5176)
   - Customer support interface (minimal implementation)

5. **shared-ui/** - Shared component library
   - Exports: Header, Footer, Banner, LoginCard
   - Import pattern: `import { Header } from '../../../shared-ui/src/index.jsx'`
   - All web apps use relative imports (not npm workspace resolution)

### Backend Microservices
Located in `openwork-platform/backend/` (services are placeholder directories):
- api-gateway, user-service, catalog-service, inventory-service, order-service
- payment-service, delivery-service, notification-service, analytics-service
- **database/** contains `init-mongo.js` - MongoDB initialization script with sample data

### Data Model (MongoDB - `quick-commerce` DB)
Collections: users, products, categories, inventory, orders, stores
- Products have: name, description, price, unit, categoryId, imageUrl, isActive
- Sample categories: "Fruits & Vegetables", "Dairy & Breakfast", "Snacks & Beverages", "Household"

## Development Workflows

### Starting the Platform
**From workspace root** (`/openwork copy/`):
```bash
npm run dev                # Starts customer-app only (port 3000)
npm run start:all          # Starts all 4 apps with concurrently
npm run start:customer     # Customer app
npm run start:delivery     # Delivery app on port 5174
npm run start:seller       # Seller dashboard on port 5175
npm run start:customer-service # Customer service on port 5176
```

**Note**: Root and `openwork-platform/` have different package.json scripts. Use root-level commands.

### Build System Differences
- **All web apps**: Use Vite (unified build system)
- **Common patterns**: 
  - Entry file: `src/main.jsx` (not `index.js`)
  - HTML file at root with `<script type="module" src="/src/main.jsx">`
  - Hot Module Replacement (HMR) enabled by default
- Each app builds independently with `npm run build`

### Database Setup
Initialize MongoDB with sample data:
```bash
mongo < openwork-platform/backend/database/init-mongo.js
```

## Project-Specific Patterns

### Shared UI Integration
- **No npm package resolution** - all imports use relative paths: `../../../shared-ui/src/`
- Import both components and CSS: `import '../../../shared-ui/src/shared.css'`
- Pattern in vite apps: main.jsx imports shared CSS globally

### State Management (Customer App)
- **No Redux/Context** - uses local React state + localStorage
- Persisted state: pincode, delivery estimate, cart items, user session
- Example: `window.localStorage.setItem('quikry_pincode', pincode)`

### Mapping & Geolocation
- **Leaflet** is the mapping library (not Google Maps)
- OpenStreetMap Nominatim API for geocoding (bias to India with `countrycodes=in`)
- Fix Leaflet marker icons manually: import from `leaflet/dist/images/`

### Cart Implementation
- Cart state lifted to App.js, passed as props (no global state)
- Quantity controls: +/- buttons that update parent state
- Product data is currently hardcoded in components (no API calls yet)

### Authentication Pattern
- Simple localStorage-based auth (no JWT implementation yet)
- Example: `delivery_user` stored in localStorage with user object
- No backend auth service connected

## Critical Conventions

### Port Allocation
- 3000: customer-app (react-scripts default)
- 5174: delivery-app
- 5175: seller-dashboard
- 5176: customer-service-dashboard
- 8000: API Gateway (planned, not implemented)

### Naming Conventions
- Database: `quick-commerce`
- Brand name in code: "Quikry" (customer-app) vs "OpenWork" (package names)
- localStorage keys: `quikry_*` or `delivery_*`
- Service folders: kebab-case (e.g., `user-service`)

### Dependencies Version Pinning
- React: 18.2.0 (pinned across all apps)
- Vite: ^5.0.0
- Leaflet: ^1.9.4

## Missing/Incomplete Areas

1. **Backend services** - Only directory structure exists, no implementations
2. **API integration** - Frontend apps use mock/hardcoded data
3. **Docker/K8s** - Referenced in README but no actual configs present
4. **Testing** - No test files or test commands configured
5. **Shared-ui as package** - Currently just relative imports, not published workspace package
6. **CI/CD** - No GitHub Actions or Jenkins configs

## When Adding Features

### For Frontend Changes
- Customer app: Add to `openwork-platform/frontend/customer-app/src/`
- For shared components: Add to `shared-ui/src/` and export in `index.jsx`
- Remember: Vite apps need HMR-compatible code (avoid default exports issues)

### For Backend Services
- Each service should follow Node.js/Express pattern (per README architecture)
- Connect to MongoDB at `quick-commerce` database
- Plan for API Gateway routing at `:8000`

### For State Management
- Continue using localStorage for persistence until Redux/Context is added
- Keep state in parent components (App.js) and pass down as props
- Prefix localStorage keys appropriately (`quikry_*` or service-specific)

## Gotchas

1. **Duplicate folder structure**: `openwork-platform/frontend/openwork-platform/` exists (likely copy artifact)
2. **Workspace imports don't work**: Must use relative paths for shared-ui despite workspace config
3. **Concurrently dependency**: Must install at root for `start:all` to work
4. **Vite HMR**: All apps now use Vite - ensure proper JSX syntax and module exports
5. **No .env files**: Configuration is hardcoded (pincode defaults, API endpoints)

## External Integrations

- **OpenStreetMap Nominatim** - Geocoding/search (rate-limited, no API key)
- **Unsplash** - Some product images use Unsplash URLs
- **Shopify CDN** - Other product images hosted on Shopify CDN

## Quick Reference

**See product examples**: `customer-app/src/components/Products.js`
**Sample data structure**: `backend/database/init-mongo.js`
**Shared components**: `frontend/shared-ui/src/`
**Map implementation**: `delivery-app/web/src/DeliveryMap.jsx`
**Cart logic**: `customer-app/src/components/Cart/Cart.js`
