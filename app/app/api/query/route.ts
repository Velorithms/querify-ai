import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";
import { isSafeSQL } from "@/utils/sqlValidator";
import { getDynamicSchema } from "@/utils/getSchema";

// In-memory cache for schema (refreshes every 5 minutes)
let schemaCache: { schema: string; timestamp: number } | null = null;
const SCHEMA_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getCachedSchema(): Promise<string> {
  const now = Date.now();
  if (schemaCache && now - schemaCache.timestamp < SCHEMA_CACHE_TTL) {
    return schemaCache.schema;
  }
  
  const schema = await getDynamicSchema();
  schemaCache = { schema, timestamp: now };
  return schema;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Validate request
    const body = await req.json();
    const { question } = body;
    
    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required and must be a string" },
        { status: 400 }
      );
    }

    if (question.length > 500) {
      return NextResponse.json(
        { error: "Question is too long (max 500 characters)" },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured. Please set GEMINI_API_KEY in your environment." },
        { status: 500 }
      );
    }

    // Get schema (cached)
    const schema = await getCachedSchema();

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.1, // Lower temperature for more consistent SQL generation
        maxOutputTokens: 500,
      }
    });

    // Enhanced prompt with better instructions
    const prompt = `You are a PostgreSQL expert. Convert the user's natural language question into a valid PostgreSQL SELECT query.

DATABASE SCHEMA:
${schema}

CRITICAL: Use EXACT column names from the schema above. PostgreSQL uses snake_case (e.g., order_date, user_id, unit_price).

STRICT RULES:
1. Generate ONLY a SELECT statement (no INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE)
2. Use EXACT column names as shown in schema (snake_case: order_date NOT orderDate)
3. Use table aliases for clarity (e.g., FROM orders o, FROM users u)
4. Add appropriate JOINs when querying multiple tables
5. Add LIMIT clause (default: LIMIT 100, max: LIMIT 1000) unless user specifies otherwise
6. Use aggregate functions (SUM, AVG, COUNT, MAX, MIN) when appropriate
7. For "top N" queries, use ORDER BY with LIMIT
8. For date/time queries, use PostgreSQL date functions (DATE_TRUNC, EXTRACT)
9. Output ONLY the SQL query, no explanations or markdown
10. Use meaningful column aliases with AS keyword
11. Column names are case-sensitive - use lowercase with underscores

CORRECT EXAMPLES:
Question: "Top 5 products by revenue"
SQL: SELECT p.name, SUM(oi.quantity * oi.unit_price) AS total_revenue FROM products p JOIN order_items oi ON p.id = oi.product_id GROUP BY p.id, p.name ORDER BY total_revenue DESC LIMIT 5;

Question: "How many orders per user?"
SQL: SELECT u.name, COUNT(o.id) AS order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.id, u.name ORDER BY order_count DESC LIMIT 100;

Question: "Orders from last month"
SQL: SELECT o.id, o.order_date, o.total, u.name FROM orders o JOIN users u ON o.user_id = u.id WHERE o.order_date >= CURRENT_DATE - INTERVAL '1 month' ORDER BY o.order_date DESC LIMIT 100;

REMEMBER: Always use snake_case column names (order_date, user_id, unit_price, product_id, order_id)

USER QUESTION: "${question}"

SQL:`;

    // Generate SQL
    const result = await model.generateContent(prompt);
    let sql = result.response?.text()?.trim() || "";

    if (!sql) {
      return NextResponse.json(
        { error: "AI failed to generate SQL. Please try rephrasing your question." },
        { status: 500 }
      );
    }

    // Clean up the SQL
    sql = sql
      .replace(/```sql\n?/gi, "")
      .replace(/```\n?/g, "")
      .replace(/^SQL:\s*/i, "")
      .trim();

    // Remove trailing semicolon if present (we'll add it back)
    sql = sql.replace(/;+$/, "");

    // Validate SQL safety
    if (!isSafeSQL(sql)) {
      return NextResponse.json(
        { 
          error: "Generated SQL contains unsafe operations. Only SELECT queries are allowed.",
          sql: sql
        },
        { status: 400 }
      );
    }

    // Execute query with timeout protection
    let data: any[];
    try {
      data = await db.$queryRawUnsafe(sql + ";");
    } catch (dbError: any) {
      console.error("Database error:", dbError);
      
      // Provide specific hints for common errors
      let hint = "Check if column names and table references are correct";
      
      if (dbError.code === "42703") {
        hint = "Column does not exist. Remember: use snake_case (order_date, not orderDate). Check schema for exact column names.";
      } else if (dbError.code === "42P01") {
        hint = "Table does not exist. Available tables: users, products, orders, order_items";
      } else if (dbError.code === "42601") {
        hint = "Syntax error in SQL. Check for missing commas, parentheses, or keywords.";
      }
      
      return NextResponse.json(
        {
          error: `Database error: ${dbError.message || "Query execution failed"}`,
          sql: sql,
          hint: hint,
          errorCode: dbError.code
        },
        { status: 400 }
      );
    }

    const executionTime = Date.now() - startTime;

    // Return results
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return NextResponse.json({
        sql: sql,
        data: [],
        message: "Query executed successfully but returned no results.",
        executionTime: `${executionTime}ms`
      });
    }

    return NextResponse.json({
      sql: sql,
      data: Array.isArray(data) ? data : [data],
      executionTime: `${executionTime}ms`,
      rowCount: Array.isArray(data) ? data.length : 1
    });

  } catch (err: any) {
    console.error("API Error:", err);
    
    // Handle specific error types
    if (err.name === "GoogleGenerativeAIError") {
      return NextResponse.json(
        { error: "AI service error. Please try again or check your API key." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: err.message || "An unexpected error occurred",
        type: err.name || "UnknownError"
      },
      { status: 500 }
    );
  }
}
