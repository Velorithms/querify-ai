import { db } from "@/lib/db";

type TableInfo = { table_name: string };
type ColumnInfo = { column_name: string; data_type: string; is_nullable: string };
type ForeignKeyInfo = {
  table_name: string;
  column_name: string;
  foreign_table_name: string;
  foreign_column_name: string;
};

/**
 * Dynamically retrieves the PostgreSQL database schema
 * Returns a formatted string describing all tables, columns, and relationships
 */
export async function getDynamicSchema(): Promise<string> {
  try {
    // Get all tables in the public schema
    const tables: TableInfo[] = await db.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name NOT LIKE '_prisma%'
      ORDER BY table_name;
    `;

    if (tables.length === 0) {
      return "No tables found in database. Please run migrations first.";
    }

    let schemaDescription = "DATABASE TABLES (use exact column names below):\n\n";

    // Get detailed info for each table
    for (const { table_name } of tables) {
      const columns: ColumnInfo[] = await db.$queryRaw`
        SELECT 
          column_name, 
          data_type,
          is_nullable
        FROM information_schema.columns 
        WHERE table_name = ${table_name}
        ORDER BY ordinal_position;
      `;

      const columnDescriptions = columns.map((c) => {
        const nullable = c.is_nullable === "YES" ? " (nullable)" : "";
        return `  ${c.column_name} (${c.data_type})${nullable}`;
      });

      schemaDescription += `TABLE ${table_name}:\n`;
      schemaDescription += columnDescriptions.join("\n");
      schemaDescription += "\n\n";
    }

    // Get foreign key relationships
    const foreignKeys: ForeignKeyInfo[] = await db.$queryRaw`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name;
    `;

    if (foreignKeys.length > 0) {
      schemaDescription += "RELATIONSHIPS (Foreign Keys):\n";
      foreignKeys.forEach((fk) => {
        schemaDescription += `  ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}\n`;
      });
      schemaDescription += "\n";
    }

    // Add helpful context
    schemaDescription += `
IMPORTANT NOTES:
- Column names use snake_case (order_date, user_id, unit_price, etc.)
- Always use exact column names from above
- Table names: users, products, orders, order_items

QUERY TIPS:
- Use table aliases (e.g., SELECT u.name FROM users u)
- Join tables using foreign key relationships shown above
- Use aggregate functions: COUNT(), SUM(), AVG(), MAX(), MIN()
- For rankings: use ORDER BY with LIMIT
- For grouping: use GROUP BY with aggregate functions
- For dates: use DATE_TRUNC() and EXTRACT()
`;

    return schemaDescription;
  } catch (error) {
    console.error("Error fetching schema:", error);
    return "Error: Unable to fetch database schema. Please check database connection.";
  }
}
