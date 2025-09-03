# Finance Dashboard

A modern, customizable finance dashboard built with React, TypeScript, and Material-UI. Connect to various financial APIs and create custom widgets for tracking stocks, crypto, and other financial data in real-time.

## ✨ Features

- **🎨 Dark Theme UI** - Professional dark interface with green accents
- **📊 Multiple Widget Types** - Card, Table, and Chart widgets
- **🔌 Universal API Integration** - Connect to any JSON API
- **⚡ Real-time Updates** - Configurable refresh intervals
- **🖱️ Drag & Drop** - Rearrange widgets with smooth animations
- **💾 Data Persistence** - Widget configurations saved in browser storage
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **🔍 Search Functionality** - Filter table data with search box

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Groww-Assignment
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Add your API keys to `.env`:
```env
REACT_APP_FINNHUB_API_KEY=your_finnhub_api_key_here
```

5. Start the development server:
```bash
npm start
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 Usage

### Adding Widgets

1. Click the "Add Widget" button in the header
2. Fill in the widget configuration:
   - **Widget Name**: Give your widget a descriptive name
   - **API URL**: Enter the API endpoint URL
   - **Refresh Interval**: Set how often to update the data (in seconds)
   - **Display Mode**: Choose between Card, Table, or Chart view
3. Click "Test API" to verify the connection and see available fields
4. Select the fields you want to display
5. Click "Add Widget" to create the widget

### Widget Types

#### Card Widget
- Displays key metrics in a clean card format
- Perfect for showing current prices, percentages, or single values
- Hover to reveal action buttons (refresh, settings, delete)

#### Table Widget
- Shows data in a searchable table format
- Automatically detects and displays array data
- Includes search functionality to filter results

#### Chart Widget
- Visualizes data with interactive charts
- Supports Line, Bar, and Pie chart types
- Automatically transforms data for chart display

### Managing Widgets

- **Refresh**: Click the refresh icon to manually update data
- **Delete**: Click the delete icon to remove a widget
- **Rearrange**: Drag and drop widgets to change their order
- **Settings**: Click the settings icon to configure widget options

## 🔌 API Integration

The dashboard supports connecting to any financial API. Here are some examples:

### Coinbase API (No API Key Required)
```
https://api.coinbase.com/v2/exchange-rates?currency=BTC
```

### Finnhub API (Requires API Key)
```
https://finnhub.io/api/v1/quote?symbol=AAPL
```

### Custom APIs
You can connect to any API that returns JSON data. The dashboard will automatically:
- Test the API connection
- Extract available fields from the response
- Allow you to select which fields to display

## 🏗️ Project Structure

```
src/
├── components/
│   ├── widgets/          # Widget components (Card, Table, Chart)
│   ├── ui/              # Reusable UI components
│   ├── layout/          # Layout components
│   └── forms/           # Form components
├── stores/
│   └── dashboardStore.ts # Main state management
├── services/
│   └── api/             # API service layer
├── utils/               # Utility functions
├── hooks/               # Custom React hooks
└── pages/               # Page components
```

## 🛠️ Technologies Used

- **React 19** - Latest React with hooks and functional components
- **TypeScript** - Type-safe development
- **Material-UI** - Professional UI components
- **Zustand** - Lightweight state management
- **React Beautiful DnD** - Drag and drop functionality
- **Recharts** - Chart visualization library
- **Axios** - HTTP client for API requests

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `REACT_APP_FINNHUB_API_KEY`: Your Finnhub API key
4. Deploy!

### Other Platforms

The app can be deployed to any static hosting platform:
- Netlify
- GitHub Pages
- AWS S3
- Firebase Hosting

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_FINNHUB_API_KEY=your_finnhub_api_key_here
```

## 📝 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
