# V.I.E Comparator

A React and TypeScript application for comparing V.I.E. indemnities across countries.

## Features

- Search countries by name
- Filter by minimum and maximum total indemnity
- Filter by geographic zone
- Display country flags
- Sort the table by clicking a column header
- Browse results with pagination (10 countries per page)

## Getting started

Requirements:

- Node.js 20 or newer
- npm

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application is then available at the local URL shown by Vite.

## Available scripts

```bash
npm run build  # Type-check and create a production build
npm run lint   # Run ESLint
npm run preview # Preview the production build
npm test        # Run the test suite once
npm run test:watch # Run tests in watch mode
npm run test:e2e # Run browser-based end-to-end tests
npm run test:e2e:ui # Open Playwright’s interactive test UI
```

## Data

Country indemnity data is stored in [`src/data/countries_v.i.e_data.tsx`](src/data/countries_v.i.e_data.tsx). The displayed total indemnity corresponds to the dataset’s `monthlyPay` value.

Country flags are provided by [`svg-country-flags`](https://github.com/hjnilsson/country-flags) and bundled in `public/flags`.

## Testing

Tests use Vitest with React Testing Library and cover the default pagination, name and zone filters, column sorting, and page navigation.

End-to-end tests use Playwright and run against a local Vite development server. Install the browser once with:

```bash
npx playwright install chromium
```

## Docker

Build and start the production container locally:

```bash
docker compose up --build
```

The application is then available at [http://localhost:8080](http://localhost:8080). Stop it with:

```bash
docker compose down
```

The GitHub Actions workflow runs tests, linting, and the production build for pushes and pull requests targeting `main`. A successful push to `main` also publishes `latest` and commit-specific tags to GitHub Container Registry. The repository’s Actions workflow must have permission to write packages for the publish step.

## AI assistance

AI was partially used during this project to assist with implementation, code organization, styling, and documentation. The resulting code and behavior were reviewed and tested locally.
