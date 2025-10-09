"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell 
} from "recharts";

type QueryResult = { [key: string]: any };

type QueryHistory = {
  id: string;
  question: string;
  sql: string;
  timestamp: Date;
  rowCount: number;
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

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f7f', '#a4de6c', '#d0ed57'];

export default function Home() {
  const [question, setQuestion] = useState("");
  const [sql, setSQL] = useState("");
  const [data, setData] = useState<QueryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [hint, setHint] = useState("");
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
  const saveToHistory = useCallback((q: string, s: string, rowCount: number) => {
    const newEntry: QueryHistory = {
      id: Date.now().toString(),
      question: q,
      sql: s,
      timestamp: new Date(),
      rowCount
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
        
        if (json.sql) {
          saveToHistory(question, json.sql, (json.data || []).length);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Querify AI
                </h1>
                <p className="text-sm text-gray-500">Natural language to SQL</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                📜 History ({history.length})
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* History Sidebar */}
        {showHistory && (
          <div className="mb-6 bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Query History</h3>
              <button
                onClick={() => setHistory([])}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-sm text-gray-400">No queries yet</p>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="p-3 bg-gray-50 rounded border border-gray-100 hover:border-blue-300 cursor-pointer transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900">{item.question}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.rowCount} rows • {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Query Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Query Input Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ask a question about your data
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                          e.preventDefault();
                          handleRun();
                        }
                      }}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="e.g., Show me the top 10 customers by total order value..."
                      rows={3}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                      Ctrl+Enter to run
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={handleRun}
                  disabled={loading || !question.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
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
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              </div>

              {/* Example Questions */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Quick examples:</p>
                <div className="flex flex-wrap gap-2">
                  {exampleQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuestion(q)}
                      className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <span className="text-red-500">⚠️</span>
                  <div className="flex-1">
                    <p className="font-medium text-red-800">Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                    {hint && (
                      <div className="mt-2 p-2 bg-red-100 rounded border border-red-300">
                        <p className="text-xs font-medium text-red-900">💡 Hint:</p>
                        <p className="text-xs text-red-800">{hint}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {message && !error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">ℹ️ {message}</p>
              </div>
            )}

            {/* Generated SQL */}
            {sql && (
              <div className="bg-gray-900 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-300">Generated SQL</p>
                  <button
                    onClick={() => navigator.clipboard.writeText(sql)}
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    📋 Copy
                  </button>
                </div>
                <pre className="text-sm text-green-400 overflow-x-auto font-mono">{sql}</pre>
              </div>
            )}

            {/* Results Table */}
            {data.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-gray-900">
                      Results ({data.length} {data.length === 1 ? "row" : "rows"})
                    </h3>
                    {numericKeys.length > 0 && (
                      <div className="flex gap-1 border rounded-lg p-1">
                        {(["bar", "line", "pie"] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() => setChartType(type)}
                            className={`px-3 py-1 text-xs rounded transition-colors ${
                              chartType === type
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={exportCSV}
                    className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    📥 Export CSV
                  </button>
                </div>

                <div className="overflow-x-auto max-h-96">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        {Object.keys(data[0]).map((key) => (
                          <th
                            key={key}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {data.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          {Object.keys(row).map((key) => (
                            <td key={key} className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {String(row[key] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Charts */}
            {data.length > 0 && numericKeys.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Visualization</h3>
                <div className="w-full" style={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "bar" ? (
                      <BarChart data={data.slice(0, 20)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey={Object.keys(data[0])[0]} 
                          tick={{ fontSize: 12 }}
                          stroke="#6b7280"
                        />
                        <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                        />
                        <Legend />
                        {numericKeys.map((key, idx) => (
                          <Bar key={key} dataKey={key} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </BarChart>
                    ) : chartType === "line" ? (
                      <LineChart data={data.slice(0, 20)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey={Object.keys(data[0])[0]} 
                          tick={{ fontSize: 12 }}
                          stroke="#6b7280"
                        />
                        <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                        />
                        <Legend />
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
                        <Tooltip />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Query Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Rows returned</p>
                  <p className="text-2xl font-bold text-gray-900">{data.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Columns</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data[0] ? Object.keys(data[0]).length : 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Numeric fields</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {numericKeys.length > 0 ? (
                      numericKeys.map((k) => (
                        <span key={k} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {k}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">💡 Tips</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Be specific in your questions</li>
                <li>• Use table/column names if known</li>
                <li>• Try "Top N", "Average", "Total"</li>
                <li>• Press Ctrl+Enter to run</li>
                <li>• Check history for past queries</li>
              </ul>
            </div>

            {/* Schema Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-3">📊 Database Schema</h3>
              <div className="text-xs text-gray-600 space-y-3">
                <div>
                  <p className="font-medium text-gray-700">users</p>
                  <p className="ml-2">id, name, email</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">products</p>
                  <p className="ml-2">id, name, price</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">orders</p>
                  <p className="ml-2">id, user_id, order_date, total</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">order_items</p>
                  <p className="ml-2">id, order_id, product_id, quantity, unit_price</p>
                </div>
              </div>
              <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-800">
                  <span className="font-medium">Note:</span> Column names use snake_case (e.g., order_date, user_id)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
