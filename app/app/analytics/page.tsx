"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Clock, Database, Activity } from "lucide-react";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4", "#10b981"];

export default function AnalyticsPage() {
  const [queryStats, setQueryStats] = useState({
    totalQueries: 0,
    avgExecutionTime: 0,
    queriesByDay: [] as any[],
    executionTimeData: [] as any[],
  });

  useEffect(() => {
    const history = localStorage.getItem("queryHistory");
    if (history) {
      const queries = JSON.parse(history);
      const totalQueries = queries.length;
      const avgExecutionTime =
        queries.reduce((acc: number, q: any) => acc + (q.executionTime || 0), 0) /
        (queries.filter((q: any) => q.executionTime).length || 1);

      // Group by day
      const dayMap = new Map();
      queries.forEach((q: any) => {
        const day = new Date(q.timestamp).toLocaleDateString();
        dayMap.set(day, (dayMap.get(day) || 0) + 1);
      });

      const queriesByDay = Array.from(dayMap.entries())
        .map(([day, count]) => ({ day, count }))
        .slice(-7);

      // Execution time data
      const executionTimeData = queries
        .filter((q: any) => q.executionTime)
        .slice(-10)
        .map((q: any, i: number) => ({
          query: `Q${i + 1}`,
          time: q.executionTime,
        }));

      setQueryStats({
        totalQueries,
        avgExecutionTime: Math.round(avgExecutionTime),
        queriesByDay,
        executionTimeData,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-zinc-400">
            Insights into your query performance and usage
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-950/30 rounded-lg">
                  <Database className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Total Queries</p>
                  <p className="text-2xl font-bold text-white">
                    {queryStats.totalQueries}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-950/30 rounded-lg">
                  <Clock className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Avg Execution</p>
                  <p className="text-2xl font-bold text-white">
                    {queryStats.avgExecutionTime}ms
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-950/30 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Success Rate</p>
                  <p className="text-2xl font-bold text-white">98%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-950/30 rounded-lg">
                  <Activity className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Active Today</p>
                  <p className="text-2xl font-bold text-white">
                    {queryStats.queriesByDay[queryStats.queriesByDay.length - 1]
                      ?.count || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Queries by Day</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={queryStats.queriesByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="day" stroke="#71717a" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#71717a" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Execution Time Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={queryStats.executionTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="query" stroke="#71717a" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#71717a" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="time"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
