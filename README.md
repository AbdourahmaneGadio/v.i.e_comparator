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
```

## Data

Country indemnity data is stored in [`src/data/countries_v.i.e_data.tsx`](src/data/countries_v.i.e_data.tsx). The displayed total indemnity corresponds to the dataset’s `monthlyPay` value.

Country flags are provided by [`svg-country-flags`](https://github.com/hjnilsson/country-flags) and bundled in `public/flags`.

## AI assistance

AI was partially used during this project to assist with implementation, code organization, styling, and documentation. The resulting code and behavior were reviewed and tested locally.
