/**
 * Validates that SQL is safe to execute (SELECT only, no dangerous operations)
 */
export function isSafeSQL(sql: string): boolean {
  if (!sql || typeof sql !== "string") return false;

  // Remove comments and normalize whitespace
  const cleaned = sql
    .replace(/--[^\n]*/g, "") // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim()
    .toLowerCase();

  if (!cleaned) return false;

  // Must start with SELECT
  if (!cleaned.startsWith("select")) return false;

  // Forbidden keywords that could modify data or schema
  const dangerousKeywords = [
    "insert", "update", "delete", "drop", "alter", "truncate",
    "create", "replace", "grant", "revoke", "exec", "execute",
    "pragma", "attach", "detach", "vacuum", "merge"
  ];

  for (const keyword of dangerousKeywords) {
    // Use word boundaries to avoid false positives (e.g., "updated_at" column)
    const regex = new RegExp(`\\b${keyword}\\b`, "i");
    if (regex.test(cleaned)) {
      console.warn(`Dangerous keyword detected: ${keyword}`);
      return false;
    }
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /;\s*select/i, // Multiple statements
    /;\s*drop/i,
    /;\s*delete/i,
    /;\s*update/i,
    /;\s*insert/i,
    /union.*select.*from/i, // UNION injection attempts (basic check)
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(cleaned)) {
      console.warn(`Suspicious pattern detected: ${pattern}`);
      return false;
    }
  }

  // Additional safety: ensure no multiple statements (basic check)
  const semicolonCount = (sql.match(/;/g) || []).length;
  if (semicolonCount > 1) {
    console.warn("Multiple statements detected");
    return false;
  }

  return true;
}

/**
 * Additional validation for query complexity/safety
 */
export function validateQueryComplexity(sql: string): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  // Check for LIMIT clause
  if (!/limit\s+\d+/i.test(sql)) {
    warnings.push("No LIMIT clause - query might return too many rows");
  }

  // Check for potential cartesian products (JOIN without ON)
  const joinCount = (sql.match(/\bjoin\b/gi) || []).length;
  const onCount = (sql.match(/\bon\b/gi) || []).length;
  
  if (joinCount > onCount) {
    warnings.push("Possible cartesian product - JOIN without ON clause");
  }

  return {
    isValid: warnings.length === 0,
    warnings
  };
}
