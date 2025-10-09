# Querify AI - Component Architecture

## 🎨 Design Inspiration
Vercel/Next.js UI - Black background with white logo, clean minimalist design

## 📁 Component Structure

### Layout Components

#### `components/Navbar.tsx`
- Sticky navigation bar at the top
- Logo with gradient icon
- Navigation links: Query, Analytics, History, Docs
- Active state highlighting
- Vercel-inspired black background with backdrop blur

### Query Components

#### `components/QueryInput.tsx`
- Text area for natural language questions
- Run and Clear buttons
- Keyboard shortcut support (Ctrl+Enter)
- Loading state handling

#### `components/SQLDisplay.tsx`
- Displays generated SQL query
- Copy to clipboard functionality
- Execution time badge
- Syntax highlighting (emerald color for SQL)

#### `components/ResultsTable.tsx`
- Table display for query results
- Export to CSV functionality
- Hover effects on rows
- Responsive overflow handling

#### `components/ChartVisualization.tsx`
- Bar, Line, and Pie chart support
- Chart type switcher with badges
- Dark-themed Recharts configuration
- Responsive container

#### `components/StatsSidebar.tsx`
- Query statistics (rows, columns, execution time)
- Numeric fields display
- Tips card with gradient background
- Database schema reference

## 📄 Pages

### `/` - Query Page
Main interface for querying the database
- Query input with history sidebar
- SQL display and results
- Charts and statistics
- Component-based architecture

### `/analytics` - Analytics Dashboard
Query performance and usage insights
- Total queries count
- Average execution time
- Success rate metrics
- Queries by day chart
- Execution time trends

### `/history` - History Page
View all past queries
- Search functionality
- Query details with timestamps
- Execution time display
- Clear all history option

### `/docs` - Documentation
Complete guide to using Querify AI
- Getting started guide
- Database schema reference
- Query examples
- Security information
- Best practices

## 🎨 Design System

### Colors
- **Background**: `black`, `zinc-900`, `zinc-800`
- **Borders**: `zinc-800`, `zinc-700`
- **Text**: `white`, `zinc-200`, `zinc-300`, `zinc-400`, `zinc-500`
- **Accents**:
  - Blue: `#3b82f6`
  - Purple: `#8b5cf6`
  - Emerald: `#10b981`
  - Cyan: `#06b6d4`
  - Pink: `#ec4899`

### Typography
- **Font**: Geist Sans (primary), Geist Mono (code)
- **Headings**: Gradient text (blue → purple → pink)
- **Code**: Emerald color on black background

### Components
- **Cards**: `bg-zinc-900 border-zinc-800`
- **Buttons**: Gradient (blue → purple) or zinc variants
- **Badges**: Category-specific colors with dark backgrounds
- **Inputs**: `bg-zinc-800 border-zinc-700`

## 🚀 Features

### Query Interface
- ✅ Natural language to SQL conversion
- ✅ Query history with search
- ✅ Execution time tracking
- ✅ CSV export
- ✅ Multiple chart types
- ✅ Stats sidebar

### Analytics Dashboard
- ✅ Usage metrics
- ✅ Performance tracking
- ✅ Visual trends
- ✅ Daily query counts

### History Management
- ✅ Persistent storage (localStorage)
- ✅ Search functionality
- ✅ Query replay
- ✅ Clear history option

### Documentation
- ✅ Getting started guide
- ✅ Database schema
- ✅ Query examples
- ✅ Security information
- ✅ Best practices

## 🔧 Technical Stack

- **Framework**: Next.js 15.5.4
- **React**: 19.1.0
- **UI Components**: shadcn/ui
- **Icons**: lucide-react
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Prisma
- **AI**: Google Gemini 2.0 Flash

## 📦 Component Dependencies

```tsx
// Shared across components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import { 
  Database, LineChart, History, BookOpen,
  Play, Trash2, Copy, Download, Search, Clock
} from "lucide-react";

// Charts
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from "recharts";
```

## 🎯 Navigation Structure

```
Navbar (sticky)
├── Query (/)
├── Analytics (/analytics)
├── History (/history)
└── Docs (/docs)
```

## 💡 Usage

1. **Query Page**: Ask natural language questions
2. **Analytics Page**: View usage statistics and trends
3. **History Page**: Search and replay past queries
4. **Docs Page**: Learn about the database and query patterns

## 🔐 Security

- SQL injection prevention
- Query validation
- Read-only operations
- Safe pattern matching

---

**Last Updated**: 2025
**Version**: 2.0.0
**Design**: Vercel-inspired dark theme
