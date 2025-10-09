"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

type QueryResult = { [key: string]: any };

type QueryHistory = {
  id: string;
  question: string;
  sql: string;
  timestamp: Date;
  rowCount: number;
  executionTime: number;
};

const exampleQuestions = [
  "Show total sales per month for 2024",
  "Top 5 products by revenue",
  "Number of orders per user",
  "Users who bought product 'Laptop'",
  "Most popular products by quantity sold",
  "Average order value by user",
  "Monthly revenue trend",
  "Products never ordered"
];

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export default function Home() {
  const [question, setQuestion] = useState("");
  const [sql, setSQL] = useState("");
  const [data, setData] = useState<QueryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [hint, setHint] = useState("");
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [history, setHistory] = useState<QueryHistory[]>([]);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("queryHistory");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed.map((h: any) => ({ ...h, timestamp: new Date(h.timestamp) })));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = useCallback((q: string, s: string, rowCount: number, execTime: number) => {
    const newEntry: QueryHistory = {
      id: Date.now().toString(),
      question: q,
      sql: s,
      timestamp: new Date(),
      rowCount,
      executionTime: execTime
    };
    const updated = [newEntry, ...history].slice(0, 20); // Keep last 20
    setHistory(updated);
    localStorage.setItem("queryHistory", JSON.stringify(updated));
  }, [history]);

  const handleRun = async () => {
    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setHint("");
    setData([]);
    setSQL("");

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });
      
      const json = await res.json();
      
      if (json.error) {
        setError(json.error);
        setHint(json.hint || "");
        if (json.sql) {
          setSQL(json.sql);
        }
      } else {
        setSQL(json.sql);
        setData(json.data || []);
        setMessage(json.message || "");
        setExecutionTime(json.executionTime || 0);
        
        if (json.sql) {
          saveToHistory(question, json.sql, (json.data || []).length, json.executionTime || 0);
        }
      }
    } catch (err: any) {
      setError(err.message || "Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        handleRun();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [question]);

  const handleClear = () => {
    setQuestion("");
    setSQL("");
    setData([]);
    setError("");
    setMessage("");
    setHint("");
  };

  const exportCSV = () => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? "")).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `query-results-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadFromHistory = (item: QueryHistory) => {
    setQuestion(item.question);
    setShowHistory(false);
  };

  const numericKeys = data.length
    ? Object.keys(data[0]).filter((k) => typeof data[0][k] === "number")
    : [];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Querify AI
                </h1>
                <p className="text-sm text-zinc-400">Natural language to SQL</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowHistory(!showHistory)}
                className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-white"
              >
                📜 History ({history.length})
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* History Sidebar */}
        {showHistory && (
          <Card className="mb-6 bg-zinc-900 border-zinc-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Query History</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setHistory([]);
                    localStorage.removeItem("queryHistory");
                  }}
                  className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                >
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-sm text-zinc-500">No queries yet</p>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="p-3 bg-zinc-800/50 rounded border border-zinc-700 hover:border-blue-500 cursor-pointer transition-all group"
                    >
                      <p className="text-sm font-medium text-white group-hover:text-blue-400">{item.question}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                        <span>{item.rowCount} rows</span>
                        <span>•</span>
                        <span>{item.executionTime}ms</span>
                        <span>•</span>
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Query Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Query Input Section */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Ask a question about your data</CardTitle>
                <CardDescription className="text-zinc-400">
                  Type your question in natural language and get instant SQL and results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        handleRun();
                      }
                    }}
                    className="min-h-[100px] bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500"
                    placeholder="e.g., Show me the top 10 customers by total order value..."
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-zinc-500">
                    Ctrl+Enter to run
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleRun}
                    disabled={loading || !question.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Running...
                      </span>
                    ) : (
                      "🚀 Run Query"
                    )}
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="border-zinc-700 bg-zinc-950 hover:bg-zinc-800 text-white"
                  >
                    Clear
                  </Button>
                </div>

                {/* Example Questions */}
                <div>
                  <p className="text-xs text-zinc-500 mb-2">Quick examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {exampleQuestions.map((q, idx) => (
                      <Badge
                        key={idx}
                        onClick={() => setQuestion(q)}
                        variant="outline"
                        className="cursor-pointer border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                      >
                        {q}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Messages */}
            {error && (
              <Alert className="bg-red-950/20 border-red-900 text-red-400">
                <AlertDescription>
                  <div className="flex gap-2">
                    <span>⚠️</span>
                    <div className="flex-1">
                      <p className="font-medium">Error</p>
                      <p className="text-sm mt-1">{error}</p>
                      {hint && (
                        <div className="mt-2 p-2 bg-red-900/30 rounded border border-red-800">
                          <p className="text-xs font-medium">💡 Hint:</p>
                          <p className="text-xs">{hint}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {message && !error && (
              <Alert className="bg-yellow-950/20 border-yellow-900 text-yellow-400">
                <AlertDescription>
                  ℹ️ {message}
                </AlertDescription>
              </Alert>
            )}

            {/* Execution Time Badge */}
            {executionTime > 0 && !loading && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-emerald-700 bg-emerald-950/30 text-emerald-400">
                  ⚡ Executed in {executionTime}ms
                </Badge>
                {data.length > 0 && (
                  <Badge variant="outline" className="border-blue-700 bg-blue-950/30 text-blue-400">
                    📊 {data.length} rows returned
                  </Badge>
                )}
              </div>
            )}

            {/* Generated SQL */}
            {sql && (
              <Card className="bg-zinc-950 border-zinc-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-zinc-400">Generated SQL</CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigator.clipboard.writeText(sql)}
                      className="text-xs text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                      📋 Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm text-emerald-400 overflow-x-auto font-mono bg-black/50 p-4 rounded border border-zinc-800">{sql}</pre>
                </CardContent>
              </Card>
            )}

            {/* Results Table */}
            {data.length > 0 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CardTitle className="text-white">
                        Results
                      </CardTitle>
                      {numericKeys.length > 0 && (
                        <div className="flex gap-1">
                          {(["bar", "line", "pie"] as const).map((type) => (
                            <Button
                              key={type}
                              size="sm"
                              variant={chartType === type ? "default" : "outline"}
                              onClick={() => setChartType(type)}
                              className={chartType === type 
                                ? "bg-blue-600 hover:bg-blue-700" 
                                : "border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                              }
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={exportCSV}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      📥 Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto max-h-96 rounded border border-zinc-800">
                    <table className="min-w-full divide-y divide-zinc-800">
                      <thead className="bg-zinc-950 sticky top-0">
                        <tr>
                          {Object.keys(data[0]).map((key) => (
                            <th
                              key={key}
                              className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-zinc-900/50 divide-y divide-zinc-800">
                        {data.map((row, idx) => (
                          <tr key={idx} className="hover:bg-zinc-800/50 transition-colors">
                            {Object.keys(row).map((key) => (
                              <td key={key} className="px-4 py-3 text-sm text-zinc-300 whitespace-nowrap">
                                {String(row[key] ?? "")}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Charts */}
            {data.length > 0 && numericKeys.length > 0 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full" style={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "bar" ? (
                        <BarChart data={data.slice(0, 20)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                          <XAxis 
                            dataKey={Object.keys(data[0])[0]} 
                            tick={{ fontSize: 12, fill: '#a1a1aa' }}
                            stroke="#52525b"
                          />
                          <YAxis tick={{ fontSize: 12, fill: '#a1a1aa' }} stroke="#52525b" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
                          />
                          <Legend wrapperStyle={{ color: '#a1a1aa' }} />
                          {numericKeys.map((key, idx) => (
                            <Bar key={key} dataKey={key} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </BarChart>
                      ) : chartType === "line" ? (
                        <LineChart data={data.slice(0, 20)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                          <XAxis 
                            dataKey={Object.keys(data[0])[0]} 
                            tick={{ fontSize: 12, fill: '#a1a1aa' }}
                            stroke="#52525b"
                          />
                          <YAxis tick={{ fontSize: 12, fill: '#a1a1aa' }} stroke="#52525b" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
                          />
                          <Legend wrapperStyle={{ color: '#a1a1aa' }} />
                          {numericKeys.map((key, idx) => (
                            <Line 
                              key={key} 
                              type="monotone" 
                              dataKey={key} 
                              stroke={COLORS[idx % COLORS.length]}
                              strokeWidth={2}
                            />
                          ))}
                        </LineChart>
                      ) : (
                        <PieChart>
                          <Pie
                            data={data.slice(0, 10)}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry: any) => `${entry.name}: ${((entry.percent || 0) * 100).toFixed(0)}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey={numericKeys[0]}
                            nameKey={Object.keys(data[0])[0]}
                          >
                            {data.slice(0, 10).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
                          />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
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
                        <Badge key={k} variant="outline" className="border-blue-700 bg-blue-950/30 text-blue-400">
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
                    <p className="ml-2 text-zinc-400">id, order_id, product_id, quantity, unit_price</p>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-blue-950/30 rounded border border-blue-900">
                  <p className="text-xs text-blue-400">
                    <span className="font-medium">Note:</span> Column names use snake_case
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
