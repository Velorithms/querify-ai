"use client";

import { useState, useEffect, useCallback } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import QueryInput from "@/components/QueryInput";
import SQLDisplay from "@/components/SQLDisplay";
import ResultsTable from "@/components/ResultsTable";
import ChartVisualization from "@/components/ChartVisualization";
import StatsSidebar from "@/components/StatsSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type QueryResult = { [key: string]: any };

type QueryHistory = {
  question: string;
  sql: string;
  timestamp: string;
  executionTime?: number;
};

export default function Home() {
  const [question, setQuestion] = useState("");
  const [sql, setSQL] = useState("");
  const [data, setData] = useState<QueryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [history, setHistory] = useState<QueryHistory[]>([]);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [historySearch, setHistorySearch] = useState("");

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("queryHistory");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = useCallback(
    (q: string, s: string, execTime: number) => {
      const newEntry: QueryHistory = {
        question: q,
        sql: s,
        timestamp: new Date().toISOString(),
        executionTime: execTime,
      };
      const updated = [newEntry, ...history].slice(0, 50);
      setHistory(updated);
      localStorage.setItem("queryHistory", JSON.stringify(updated));
    },
    [history]
  );

  const handleRun = async () => {
    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setData([]);
    setSQL("");
    setExecutionTime(0);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to execute query");
        return;
      }

      setSQL(json.sql);
      setData(json.data || []);
      setExecutionTime(json.executionTime || 0);
      setMessage(
        `Success! Retrieved ${json.data?.length || 0} row(s) in ${
          json.executionTime || 0
        }ms`
      );

      saveToHistory(question, json.sql, json.executionTime || 0);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuestion("");
    setSQL("");
    setData([]);
    setError("");
    setMessage("");
    setExecutionTime(0);
  };

  const exportCSV = () => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((h) => JSON.stringify(row[h] ?? "")).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `query_results_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const numericKeys =
    data.length > 0
      ? Object.keys(data[0]).filter((k) => typeof data[0][k] === "number")
      : [];

  const filteredHistory = history.filter(
    (item) =>
      item.question.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.sql.toLowerCase().includes(historySearch.toLowerCase())
  );

  const loadFromHistory = (item: QueryHistory) => {
    setQuestion(item.question);
    setSQL(item.sql);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* History Sidebar */}
          <div className="col-span-12 md:col-span-3">
            <Card className="bg-zinc-900 border-zinc-800 sticky top-20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>History</span>
                  <span className="text-xs font-normal bg-zinc-800 text-zinc-300 px-2 py-1 rounded">
                    {history.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search history..."
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500"
                  />
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredHistory.slice(0, 10).map((item, i) => (
                    <div
                      key={i}
                      onClick={() => loadFromHistory(item)}
                      className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-700 hover:border-blue-600 transition"
                    >
                      <p className="text-sm text-white line-clamp-2 mb-1">
                        {item.question}
                      </p>
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                        {item.executionTime && (
                          <span className="text-emerald-400">
                            {item.executionTime}ms
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-6 space-y-6">
            <QueryInput
              question={question}
              setQuestion={setQuestion}
              onRun={handleRun}
              onClear={handleClear}
              isLoading={loading}
            />

            {/* Status Messages */}
            {loading && (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full bg-zinc-800" />
                <Skeleton className="h-4 w-3/4 bg-zinc-800" />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && !error && (
              <Alert className="bg-emerald-950/30 border-emerald-700 text-emerald-300">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {/* SQL Display */}
            {sql && <SQLDisplay sql={sql} executionTime={executionTime} />}

            {/* Results Table */}
            {data.length > 0 && (
              <ResultsTable data={data} onExportCSV={exportCSV} />
            )}

            {/* Chart Visualization */}
            {data.length > 0 && numericKeys.length > 0 && (
              <ChartVisualization
                data={data}
                numericKeys={numericKeys}
                chartType={chartType}
                setChartType={setChartType}
              />
            )}
          </div>

          {/* Stats Sidebar */}
          <div className="col-span-12 md:col-span-3">
            {data.length > 0 && (
              <StatsSidebar
                data={data}
                executionTime={executionTime}
                numericKeys={numericKeys}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
