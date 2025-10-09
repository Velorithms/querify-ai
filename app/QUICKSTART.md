# 🚀 Quick Start Guide - Querify AI

## 30-Second Setup

1. **Copy `.env.example` to `.env`**
   ```bash
   cp .env.example .env
   ```

2. **Add your API key to `.env`**
   ```env
   GEMINI_API_KEY="your_key_here"
   DATABASE_URL="postgresql://user:pass@localhost:5432/db"
   ```

3. **Setup database**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. **Run**
   ```bash
   npm run dev
   ```

5. **Open** http://localhost:3000

## 💡 Example Questions to Try

Copy and paste these into the query box:

### Simple Queries
```
How many users do we have?
```

```
List all products
```

### Intermediate Queries
```
Top 5 products by revenue
```

```
Show me the average order value
```

### Advanced Queries
```
Monthly revenue trend for 2024
```

```
Which users have never placed an order?
```

```
Products that have been ordered more than 10 times
```

## ⌨️ Keyboard Shortcuts

- **Ctrl+Enter** (or **Cmd+Enter** on Mac) - Run query
- **Click example chips** - Auto-fill question
- **History button** - View past queries

## 📊 Chart Types

Switch between:
- **Bar Chart** - Compare values
- **Line Chart** - Show trends
- **Pie Chart** - Show proportions

## 📥 Export Data

1. Run a query
2. Click "Export CSV" button
3. File downloads automatically

## 🐛 Troubleshooting

### "API key not configured"
→ Add `GEMINI_API_KEY` to your `.env` file

### "Database connection failed"  
→ Check your `DATABASE_URL` in `.env`

### "No tables found"
→ Run `npx prisma db push`

### TypeScript errors
→ Run `npm install`

## 🎯 Pro Tips

1. **Be specific** - "Top 10 customers by revenue" is better than "show customers"
2. **Use dates** - Specify "2024" or "last month" for time-based queries
3. **Check history** - Reuse successful queries from history
4. **Export often** - Download results for further analysis
5. **Use limits** - Mention "top 10" or "limit 50" for large datasets

## 📚 Database Schema Quick Reference

**Tables:**
- `users` - id, name, email
- `products` - id, name, price
- `orders` - id, user_id, order_date, total
- `order_items` - id, order_id, product_id, quantity, unit_price

**Relationships:**
- Users → Orders (one-to-many)
- Orders → Order Items (one-to-many)
- Products → Order Items (one-to-many)

## 🔥 Power User Features

### History Management
- Stores last 20 queries
- Click to reload any query
- Clear all history with one click

### Smart Charts
- Auto-detects numeric columns
- Limits to top 20 rows for clarity
- Color-coded for easy reading

### Copy SQL
- Click "Copy" button on generated SQL
- Use in other SQL tools
- Learn SQL by example

## 📱 Mobile Usage

- Fully responsive design
- Touch-friendly buttons
- Swipe to scroll tables
- Tap example chips to select

## 🎨 UI Features

- **Loading spinner** - Shows when query is running
- **Error messages** - Clear explanations of issues
- **Empty state** - Helpful message when no results
- **Stats sidebar** - See row/column counts at a glance

## 🚀 Next Steps

1. Try the example questions
2. Explore your own data
3. Export results to CSV
4. Build dashboards with the data
5. Share insights with your team

---

**Need Help?** Check the full README.md for detailed documentation.

**Server Status:** ✅ Running on http://localhost:3001
