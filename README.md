# Data Analytics Dashboard

A comprehensive data analytics dashboard built with Next.js, React, and Chart.js for visualizing business performance metrics.

## Features

- **Multi-category Data Visualization**: Performance, Transactional, and PICOS data
- **Real-time Data Integration**: Connects to Google Sheets for live data updates
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Charts**: Line charts for trend analysis
- **Tabbed Interface**: Easy navigation between different data categories

## Tech Stack

- **Frontend**: Next.js 14, React 18
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Data Integration**: Google Sheets API
- **HTTP Client**: Axios

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables for Google Sheets API
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with your Google Sheets API credentials:

```
GOOGLE_CLIENT_EMAIL=your-service-account-email
GOOGLE_PRIVATE_KEY=your-private-key
```

## Data Categories

- **Performance**: GMV, Revenue, Conversion Rate, Customer Metrics
- **Transactional**: Orders, Settlement Reports
- **PICOS**: Product Reviews, Stock, Pricing Data

## License

MIT
