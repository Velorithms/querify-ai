# 🚀 Quick Start Guide - Querify AI v2.0

## ⚡ 30-Second Start

```bash
cd app
npm run dev
# Visit http://localhost:3001
```

## 🎯 What You Got

### ✅ 4 Pages
1. **Query** (/) - Ask questions in natural language
2. **Analytics** (/analytics) - See usage statistics
3. **History** (/history) - Browse past queries
4. **Docs** (/docs) - Learn the system

### ✅ 6 Components
1. **Navbar** - Navigation bar
2. **QueryInput** - Question input
3. **SQLDisplay** - SQL viewer
4. **ResultsTable** - Data table
5. **ChartVisualization** - Charts (bar/line/pie)
6. **StatsSidebar** - Stats and info

### ✅ Features
- Natural language to SQL conversion
- Query history with search
- CSV export
- Multiple chart types
- Execution time tracking
- Dark Vercel-inspired UI

## 🎨 Design

**Vercel-Inspired:**
- Black background (#000000)
- White logo and text
- Zinc UI elements
- Gradient accents
- Minimalist clean design

## 📍 URLs

- **Query**: http://localhost:3001/
- **Analytics**: http://localhost:3001/analytics
- **History**: http://localhost:3001/history
- **Docs**: http://localhost:3001/docs

## 💡 Try These Queries

```
"Show me the top 5 customers by total orders"
"What's the average order value?"
"List all products with their prices"
"Show total revenue by month"
"Which products have never been ordered?"
```

## ⌨️ Keyboard Shortcuts

- **Ctrl + Enter**: Run query
- Click history item to load it

## 📦 What Changed

### Before:
- 1 page, 633 lines
- No navigation
- Mixed code

### After:
- 4 pages
- 6 components
- Clean architecture
- Vercel-inspired design

## 📁 Key Files

```
app/
├── components/
│   ├── Navbar.tsx          ← Navigation
│   ├── QueryInput.tsx      ← Input form
│   ├── SQLDisplay.tsx      ← SQL viewer
│   ├── ResultsTable.tsx    ← Data table
│   ├── ChartVisualization.tsx ← Charts
│   └── StatsSidebar.tsx    ← Stats
├── app/
│   ├── page.tsx            ← Query page
│   ├── analytics/page.tsx  ← Analytics
│   ├── history/page.tsx    ← History
│   └── docs/page.tsx       ← Docs
└── api/
    └── query/route.ts      ← Backend
```

## 🎨 Colors Quick Ref

```css
/* Backgrounds */
bg-black         → Pure black
bg-zinc-900      → Cards
bg-zinc-800      → Inputs

/* Text */
text-white       → Primary
text-zinc-400    → Muted

/* Accents */
blue-600         → Primary action
purple-600       → Secondary
emerald-400      → Success
```

## 🔧 Component Props

### QueryInput
```tsx
<QueryInput
  question={string}
  setQuestion={fn}
  onRun={fn}
  onClear={fn}
  isLoading={boolean}
/>
```

### SQLDisplay
```tsx
<SQLDisplay
  sql={string}
  executionTime={number}
/>
```

### ResultsTable
```tsx
<ResultsTable
  data={array}
  onExportCSV={fn}
/>
```

### ChartVisualization
```tsx
<ChartVisualization
  data={array}
  numericKeys={array}
  chartType="bar"|"line"|"pie"
  setChartType={fn}
/>
```

### StatsSidebar
```tsx
<StatsSidebar
  data={array}
  executionTime={number}
  numericKeys={array}
/>
```

## 📊 Database Schema

```
users:        id, name, email
products:     id, name, price
orders:       id, user_id, order_date, total
order_items:  id, order_id, product_id, quantity, unit_price
```

**Note:** Columns use snake_case (user_id, order_date)

## 🛡️ Security

✓ Only SELECT queries
✓ SQL injection blocked
✓ No destructive operations
✓ AI query validation

## 📈 Analytics Metrics

- Total Queries
- Average Execution Time
- Success Rate (98%)
- Queries by Day (chart)
- Execution Time Trend (chart)

## 📜 History Features

- Search all queries
- Click to replay
- View execution times
- Clear all option

## 📖 Documentation Sections

1. Getting Started
2. Database Schema
3. Query Examples
4. Security Info
5. Best Practices

## ✨ Best Practices

1. Be specific in questions
2. Use table/column names
3. Remember snake_case
4. Use Ctrl+Enter shortcut
5. Export results to CSV

## 🎯 Example Usage

### 1. Ask a Question
```
Type: "Show me top 5 customers"
Press: Ctrl+Enter or click Run
```

### 2. View Results
- See generated SQL
- View data table
- Switch chart types
- Check execution time

### 3. Export Data
```
Click: "Export CSV" button
Download: query_results_[timestamp].csv
```

### 4. Review History
```
Navigate: /history
Search: Type keywords
Click: Any query to reload it
```

### 5. Check Analytics
```
Navigate: /analytics
View: Usage stats and trends
```

## 🔄 Quick Tips

- **History Search**: Filter by question or SQL
- **Chart Types**: Click badges to switch
- **Copy SQL**: Click copy button on SQL display
- **Export**: Download results as CSV
- **Keyboard**: Ctrl+Enter to run quickly

## 📱 Pages Overview

### Query (/)
**Layout**: History | Query & Results | Stats
**Purpose**: Main interface for querying

### Analytics (/analytics)
**Layout**: Stats Grid | Charts
**Purpose**: Usage insights and performance

### History (/history)
**Layout**: Search | Timeline List
**Purpose**: Browse all past queries

### Docs (/docs)
**Layout**: Sections with Cards
**Purpose**: Learning and reference

## 🎨 UI Components Used

- shadcn/ui: Button, Card, Badge, Input, Textarea, Alert, Skeleton
- lucide-react: 15+ icons
- Recharts: Bar, Line, Pie charts
- Tailwind CSS: All styling

## ✅ Status

- **Server**: ✅ Running on :3001
- **Pages**: ✅ 4/4 working
- **Components**: ✅ 6/6 functional
- **Theme**: ✅ Dark Vercel-inspired
- **Features**: ✅ All implemented
- **Errors**: ✅ None

## 📚 Documentation

- **COMPONENT_ARCHITECTURE.md** - Component details
- **REFACTOR_SUMMARY.md** - Refactor info
- **SITE_MAP.md** - Visual site structure
- **README_NEW.md** - Complete overview
- **This file** - Quick reference

## 🚀 You're Ready!

Open http://localhost:3001 and start querying! 🎉

---

**Version**: 2.0.0
**Design**: Vercel/Next.js Inspired
**Status**: ✅ Complete & Running
