# eBay Multichannel Manager

A comprehensive sales management system prototype for eBay and multichannel e-commerce operations with AI-powered pricing optimization.

## Features

### 📊 Dashboard
- Real-time revenue analytics and trends
- Platform-specific performance metrics (eBay, Shopify, Auction sites)
- Supplier statistics with visual charts
- Quick access metrics for orders, inventory, and pricing

### 📦 Order Management
- Unified order tracking across multiple platforms
- Automatic fee calculation for each platform:
  - eBay: 13.25% final value fee + 2.9% payment processing
  - Shopify: 2.9% + $0.30 payment processing
  - Auction sites: 15% commission + 3% payment processing
- Real-time filtering and search functionality
- Order status tracking and updates

### 💰 AI-Powered Pricing Optimization
- Intelligent pricing recommendations based on:
  - Target profit margins
  - Risk assessment levels
  - Competitor analysis simulation
  - Market demand factors
- Real-time impact calculation
- Bulk pricing updates with preview
- Interactive settings panel with margin sliders

### 📋 Inventory Management
- Real-time stock tracking with visual indicators
- Supplier-based inventory analysis
- Low stock alerts and notifications
- Batch inventory updates
- Stock movement history

### 🤝 Customer Offer Management
- Automated offer evaluation and recommendations
- AI-powered negotiation assistance
- Customer history and behavior analysis
- Quick response templates
- Offer acceptance/rejection tracking

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Shadcn/ui components
- **Charts**: Recharts for data visualization
- **Notifications**: Sonner for toast notifications
- **Design**: Glassmorphism with Bento Grid layout
- **State Management**: React hooks and context

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── orders/            # Order management
│   ├── pricing/           # AI pricing optimization
│   ├── inventory/         # Inventory tracking
│   ├── offers/            # Customer offers
│   └── layout.tsx         # Root layout
├── components/
│   ├── layout/            # Navigation and layout components
│   └── ui/                # Shadcn/ui components
├── lib/
│   ├── types.ts          # TypeScript interfaces
│   └── utils.ts          # Utility functions
└── data/
    └── mock-data.ts      # Sample data for prototype
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ebay-multichannel-manager
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Key Components

### Pricing Algorithm
The AI pricing system uses sophisticated calculations:

```typescript
const generateRecommendations = async () => {
  const targetMarginValue = targetMargin[0];
  const costPrice = basePrice * 0.6;
  
  // Risk-based pricing adjustments
  let priceAdjustment = 1;
  if (riskLevel[0] <= 3) priceAdjustment = 0.95; // Conservative
  else if (riskLevel[0] >= 7) priceAdjustment = 1.1; // Aggressive
  
  const recommendedPrice = (costPrice / (1 - targetMarginValue / 100)) * priceAdjustment;
};
```

### Platform Fee Calculations
Automatic fee calculation for different platforms:

```typescript
const calculateFees = (price: number, platform: string) => {
  switch (platform) {
    case 'eBay':
      return price * 0.1325 + price * 0.029; // 13.25% + 2.9%
    case 'Shopify':
      return price * 0.029 + 0.30; // 2.9% + $0.30
    case 'Auction':
      return price * 0.15 + price * 0.03; // 15% + 3%
  }
};
```

## Design System

### Glassmorphism Effects
The UI uses modern glassmorphism design with:
- Semi-transparent backgrounds with backdrop blur
- Subtle border highlights
- Gradient overlays for depth
- Smooth hover transitions

### Color Scheme
- Primary: Blue gradient (#3B82F6 to #1D4ED8)
- Success: Green (#10B981)
- Warning: Orange (#F59E0B)
- Error: Red (#EF4444)
- Neutral: Gray scale with proper contrast ratios

## Data Models

### Core Entities

```typescript
interface Product {
  id: string;
  name: string;
  currentPrice: number;
  costPrice: number;
  stock: number;
  supplier: string;
  platform: string;
  lastUpdated: Date;
}

interface Order {
  id: string;
  customerName: string;
  products: Product[];
  total: number;
  platform: string;
  status: string;
  fees: number;
  profit: number;
  date: Date;
}

interface CustomerOffer {
  id: string;
  customerName: string;
  productName: string;
  offerPrice: number;
  currentPrice: number;
  message: string;
  date: Date;
  status: string;
}
```

## Features In Development

- [ ] Real-time data synchronization with eBay API
- [ ] Advanced analytics with predictive modeling
- [ ] Multi-language support (Korean/English)
- [ ] Mobile responsive design enhancements
- [ ] Automated inventory replenishment
- [ ] Customer communication templates

## Performance Optimizations

- Server-side rendering with Next.js App Router
- Lazy loading for heavy components
- Optimized image loading and compression
- Bundle splitting for faster load times
- Efficient state management to minimize re-renders

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is a prototype for demonstration purposes.

---

**Note**: This is a prototype system with mock data. For production use, integrate with actual eBay API, payment processors, and inventory management systems.