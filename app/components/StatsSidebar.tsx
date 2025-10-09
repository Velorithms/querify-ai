"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatsSidebarProps {
  data: any[];
  executionTime: number;
  numericKeys: string[];
}

export default function StatsSidebar({
  data,
  executionTime,
  numericKeys,
}: StatsSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Query Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-zinc-400">Rows returned</p>
            <p className="text-3xl font-bold text-white">{data.length}</p>
          </div>
          <div>
            <p className="text-sm text-zinc-400">Columns</p>
            <p className="text-3xl font-bold text-white">
              {data[0] ? Object.keys(data[0]).length : 0}
            </p>
          </div>
          {executionTime > 0 && (
            <div>
              <p className="text-sm text-zinc-400">Execution time</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {executionTime}ms
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-zinc-400 mb-2">Numeric fields</p>
            <div className="flex flex-wrap gap-1">
              {numericKeys.length > 0 ? (
                numericKeys.map((k) => (
                  <Badge
                    key={k}
                    variant="outline"
                    className="border-blue-700 bg-blue-950/30 text-blue-400"
                  >
                    {k}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-zinc-500">None</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 border-blue-900">
        <CardHeader>
          <CardTitle className="text-white">💡 Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-zinc-300 space-y-2">
            <li>• Be specific in your questions</li>
            <li>• Use table/column names if known</li>
            <li>• Try "Top N", "Average", "Total"</li>
            <li>• Press Ctrl+Enter to run</li>
            <li>• Check history for past queries</li>
          </ul>
        </CardContent>
      </Card>

      {/* Schema Info */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">📊 Database Schema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-zinc-300 space-y-3">
            <div>
              <p className="font-medium text-zinc-200">users</p>
              <p className="ml-2 text-zinc-400">id, name, email</p>
            </div>
            <div>
              <p className="font-medium text-zinc-200">products</p>
              <p className="ml-2 text-zinc-400">id, name, price</p>
            </div>
            <div>
              <p className="font-medium text-zinc-200">orders</p>
              <p className="ml-2 text-zinc-400">id, user_id, order_date, total</p>
            </div>
            <div>
              <p className="font-medium text-zinc-200">order_items</p>
              <p className="ml-2 text-zinc-400">
                id, order_id, product_id, quantity, unit_price
              </p>
            </div>
          </div>
          <div className="mt-3 p-2 bg-blue-950/30 rounded border border-blue-900">
            <p className="text-xs text-blue-400">
              <span className="font-medium">Note:</span> Column names use
              snake_case
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
