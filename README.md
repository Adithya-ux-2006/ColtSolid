# ClotSolid

ClotSolid is a medical web application focused on blood clot awareness, symptom screening, and finding nearby medical centres. It provides educational information about deep vein thrombosis (DVT), pulmonary embolism (PE), and related conditions.

## Features

- **Symptom Search**: Search symptoms and get evidence-backed remedy suggestions
- **Medical Centre Finder**: Locate hospitals, clinics, and diagnostic centres near you using OpenStreetMap data
- **Blood Clot Warning Signs**: Learn the warning signs of DVT and PE in plain language
- **Research Datasets**: Browse relevant Kaggle datasets for blood clot research
- **Risk Assessment**: Basic symptom screening with clear, plain-language results
- **Prevention Tips**: General prevention information for blood clots

## Tech Stack

- React 19 with Vite
- Tailwind CSS for styling
- Zustand for state management
- Leaflet for interactive maps
- Supabase for backend services

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## External Services

### Location Services (Free, No API Key Required)

- **OpenStreetMap**: Map tiles and data
- **Overpass API**: Nearby medical centre search
- **Nominatim**: Geocoding for manual location search

### Important Limitations

#### External Location Services

- Nearby medical-centre information comes from community-maintained OpenStreetMap data. Data completeness varies by region.
- Some centres may have missing names, phone numbers, opening hours, or addresses. This depends on what volunteers have contributed to OpenStreetMap.
- External services (Overpass API, Nominatim) may temporarily limit requests during unusually high usage periods. The application uses caching, request throttling, and fallback endpoints to reduce failures.
- No paid map or geolocation API is required. All location services are free tier.
- Exact browser location is used only for the user's active search and is not permanently stored by the application. Coordinates are cached temporarily in session storage for the current browsing session only.

#### Medical Information

- ClotSolid provides general educational information and basic symptom screening. It cannot diagnose or rule out a blood clot.
- Only a qualified healthcare professional can assess symptoms and arrange the correct tests.
- Do not delay emergency care because of a result shown on this website.
- For emergencies in India, call 112.

## Deployment

This application is configured for deployment on Netlify. The `netlify.toml` file includes:

- SPA routing configuration
- Security headers
- Netlify Functions support
- Static asset caching

## License

This project is for educational purposes. Medical datasets referenced from Kaggle are owned by their respective publishers.
