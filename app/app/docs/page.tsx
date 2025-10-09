import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Code, Database, Zap, Shield, TrendingUp } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-zinc-400">
            Learn how to use Querify AI effectively
          </p>
        </div>

        <div className="space-y-8">
          {/* Getting Started */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-950/30 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <CardTitle className="text-white">Getting Started</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-zinc-300">
              <p>
                Querify AI transforms natural language questions into SQL queries
                using advanced AI. Simply type your question and let the AI do
                the rest.
              </p>
              <div className="bg-black border border-zinc-800 rounded-lg p-4">
                <p className="text-sm text-zinc-400 mb-2">Example:</p>
                <p className="text-emerald-400 font-mono text-sm">
                  "Show me the top 5 customers by total orders"
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Database Schema */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-950/30 rounded-lg">
                  <Database className="w-5 h-5 text-purple-400" />
                </div>
                <CardTitle className="text-white">Database Schema</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-zinc-300">
              <p>Our database consists of 4 main tables:</p>
              
              <div className="space-y-3">
                <div className="bg-black border border-zinc-800 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">users</h4>
                  <p className="text-sm text-zinc-400">
                    Stores customer information
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge className="bg-blue-950/30 border-blue-700 text-blue-400">
                      id
                    </Badge>
                    <Badge className="bg-blue-950/30 border-blue-700 text-blue-400">
                      name
                    </Badge>
                    <Badge className="bg-blue-950/30 border-blue-700 text-blue-400">
                      email
                    </Badge>
                  </div>
                </div>

                <div className="bg-black border border-zinc-800 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">products</h4>
                  <p className="text-sm text-zinc-400">
                    Product catalog with pricing
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge className="bg-blue-950/30 border-blue-700 text-blue-400">
                      id
                    </Badge>
                    <Badge className="bg-blue-950/30 border-blue-700 text-blue-400">
                      name
                    </Badge>
                    <Badge className="bg-blue-950/30 border-blue-700 text-blue-400">
                      price
                    </Badge>
                  </div>
                </div>

                <div className="bg-black border border-zinc-800 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">orders</h4>
                  <p className="text-sm text-zinc-400">
                    Customer orders with dates and totals
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge className="bg-blue-950/30 border-blue-700 text-blue-400">
                      id
                    </Badge>
                    <Badge className="bg-blue-950/30 border-blue-700 text-blue-400">
                      user_id
                    </Badge>
                    <Badge className="bg-blue-950/30 border-blue-700 text-blue-400">
                      order_date
                    </Badge>
                    <Badge className="bg-blue-950/30 border-blue-700 text-blue-400">
                      total
                    </Badge>
                  </div>
                </div>

                <div className="bg-black border border-zinc-800 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">order_items</h4>
                  <p className="text-sm text-zinc-400">
                    Individual items within orders
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge className="bg-blue-950/30 border-blue-700 text-blue-400">
                      id
                    </Badge>
                    <Badge className="bg-blue-950/30 border-blue-700 text-blue-400">
                      order_id
                    </Badge>
                    <Badge className="bg-blue-950/30 border-blue-700 text-blue-400">
                      product_id
                    </Badge>
                    <Badge className="bg-blue-950/30 border-blue-700 text-blue-400">
                      quantity
                    </Badge>
                    <Badge className="bg-blue-950/30 border-blue-700 text-blue-400">
                      unit_price
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Query Examples */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-950/30 rounded-lg">
                  <Code className="w-5 h-5 text-emerald-400" />
                </div>
                <CardTitle className="text-white">Query Examples</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-zinc-300">
              <div className="space-y-2">
                <p className="text-sm text-zinc-400">Analytics queries:</p>
                <div className="bg-black border border-zinc-800 rounded-lg p-3">
                  <p className="text-sm text-emerald-400 font-mono">
                    What's the average order value?
                  </p>
                </div>
                <div className="bg-black border border-zinc-800 rounded-lg p-3">
                  <p className="text-sm text-emerald-400 font-mono">
                    Show me total revenue by month
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-zinc-400">Customer insights:</p>
                <div className="bg-black border border-zinc-800 rounded-lg p-3">
                  <p className="text-sm text-emerald-400 font-mono">
                    Who are the top 10 customers by spending?
                  </p>
                </div>
                <div className="bg-black border border-zinc-800 rounded-lg p-3">
                  <p className="text-sm text-emerald-400 font-mono">
                    List customers who haven't ordered in 30 days
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-zinc-400">Product analysis:</p>
                <div className="bg-black border border-zinc-800 rounded-lg p-3">
                  <p className="text-sm text-emerald-400 font-mono">
                    What are the best selling products?
                  </p>
                </div>
                <div className="bg-black border border-zinc-800 rounded-lg p-3">
                  <p className="text-sm text-emerald-400 font-mono">
                    Show products with prices above $50
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-950/30 rounded-lg">
                  <Shield className="w-5 h-5 text-red-400" />
                </div>
                <CardTitle className="text-white">Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-zinc-300">
              <p>All queries are validated for safety before execution:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Only SELECT queries are allowed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>SQL injection patterns are blocked</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>No destructive operations (DROP, DELETE, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>AI-generated queries are sanitized</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-950/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                </div>
                <CardTitle className="text-white">Best Practices</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-zinc-300">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Be specific in your questions for better results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Use exact table and column names when you know them</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Remember column names use snake_case (e.g., user_id, order_date)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Use Ctrl+Enter keyboard shortcut to run queries quickly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Export results to CSV for further analysis</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
