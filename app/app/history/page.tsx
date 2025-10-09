"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clock, Trash2 } from "lucide-react";

interface QueryHistory {
  question: string;
  sql: string;
  timestamp: string;
  executionTime?: number;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<QueryHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("queryHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      localStorage.removeItem("queryHistory");
      setHistory([]);
    }
  };

  const filteredHistory = history.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sql.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Query History
          </h1>
          <p className="text-zinc-400">
            View and search through your past queries
          </p>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search queries..."
              className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500"
            />
          </div>
          <Button
            onClick={clearHistory}
            variant="outline"
            className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        {filteredHistory.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="py-12 text-center">
              <p className="text-zinc-400">No queries found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item, index) => (
              <Card key={index} className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-base mb-2">
                        {item.question}
                      </CardTitle>
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                        {item.executionTime && (
                          <Badge className="bg-emerald-950/30 border-emerald-700 text-emerald-400">
                            {item.executionTime}ms
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-black border border-zinc-800 rounded-lg p-4 overflow-x-auto">
                    <code className="text-emerald-400 text-sm font-mono">
                      {item.sql}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
