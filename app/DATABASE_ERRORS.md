# Common Database Errors & Solutions

## Error Code 42703: Column Does Not Exist

**Example Error:**
```
column o.orderdate does not exist
```

**Cause:** The AI generated SQL with incorrect column name (camelCase instead of snake_case)

**Solution:**
- ✅ **Correct:** `order_date` (snake_case with underscore)
- ❌ **Incorrect:** `orderDate` (camelCase)

### Column Name Reference

| Table | Columns (use exact names) |
|-------|---------------------------|
| **users** | `id`, `name`, `email` |
| **products** | `id`, `name`, `price` |
| **orders** | `id`, `user_id`, `order_date`, `total` |
| **order_items** | `id`, `order_id`, `product_id`, `quantity`, `unit_price` |

### How We Fixed It

1. **Enhanced AI Prompt** - Added explicit instructions about snake_case column names
2. **Better Examples** - Provided correct SQL examples in the prompt
3. **Improved Schema Output** - Made column names more prominent
4. **Better Error Messages** - Added hints that explain the issue
5. **UI Improvements** - Show hint messages in error box

## Error Code 42P01: Table Does Not Exist

**Cause:** Incorrect table name or table doesn't exist

**Solution:**
- Check available tables: `users`, `products`, `orders`, `order_items`
- Run `npx prisma db push` if tables are missing

## Error Code 42601: Syntax Error

**Cause:** Invalid SQL syntax

**Common Issues:**
- Missing commas between columns
- Unclosed quotes or parentheses
- Incorrect JOIN syntax
- Missing FROM clause

**Solution:**
- Check the generated SQL for typos
- Verify JOIN conditions have ON clause
- Ensure all quotes are properly closed

## Best Practices

### 1. Use Exact Column Names
```sql
-- ✅ CORRECT
SELECT order_date, user_id FROM orders;

-- ❌ WRONG
SELECT orderDate, userId FROM orders;
```

### 2. Always Use Table Aliases
```sql
-- ✅ CORRECT
SELECT u.name, o.order_date 
FROM users u 
JOIN orders o ON u.id = o.user_id;

-- ❌ CONFUSING
SELECT users.name, orders.order_date 
FROM users 
JOIN orders ON users.id = orders.user_id;
```

### 3. Use Proper JOINs
```sql
-- ✅ CORRECT
FROM orders o 
JOIN users u ON o.user_id = u.id

-- ❌ WRONG (missing ON)
FROM orders o 
JOIN users u
```

### 4. Snake Case for Multi-Word Columns
```sql
-- ✅ CORRECT
order_date, user_id, unit_price, product_id

-- ❌ WRONG
orderDate, userId, unitPrice, productId
```

## Quick Fixes

### If you see "column does not exist"
1. Check the schema sidebar for exact column names
2. Replace camelCase with snake_case
3. Re-run the query

### If you see "table does not exist"
1. Run `npx prisma db push` to create tables
2. Verify you're connected to the correct database
3. Check DATABASE_URL in .env

### If you see "syntax error"
1. Check for missing commas
2. Verify all JOINs have ON clauses
3. Check for unclosed quotes or parentheses

## Testing SQL Before Running

You can test SQL in Prisma Studio:
```bash
npx prisma studio
```

Or use psql:
```bash
psql $DATABASE_URL
```

## Prevention

The app now:
- ✅ Shows exact column names in schema
- ✅ Provides better AI prompts
- ✅ Displays helpful error hints
- ✅ Includes column reference in sidebar
- ✅ Shows snake_case reminder

## Still Having Issues?

1. Check the "Database Schema" sidebar for exact column names
2. Look at the hint message below error (💡 Hint)
3. Review the generated SQL for typos
4. Try rephrasing your question
5. Use one of the example questions

---

**Remember:** PostgreSQL column names are case-sensitive and use snake_case!
