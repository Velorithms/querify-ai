"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface ChartVisualizationProps {
  data: any[];
  numericKeys: string[];
  chartType: "bar" | "line" | "pie";
  setChartType: (type: "bar" | "line" | "pie") => void;
}

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4", "#10b981"];

export default function ChartVisualization({
  data,
  numericKeys,
  chartType,
  setChartType,
}: ChartVisualizationProps) {
  if (data.length === 0 || numericKeys.length === 0) return null;

  const firstNumericKey = numericKeys[0];
  const firstStringKey = Object.keys(data[0]).find(
    (k) => typeof data[0][k] === "string"
  );

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Visualization</CardTitle>
          <div className="flex gap-2">
            {(["bar", "line", "pie"] as const).map((type) => (
              <Badge
                key={type}
                onClick={() => setChartType(type)}
                className={`cursor-pointer transition ${
                  chartType === type
                    ? "bg-blue-950 text-blue-400 border-blue-700"
                    : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartType === "bar" && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey={firstStringKey || "id"}
                stroke="#71717a"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#71717a" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              {numericKeys.slice(0, 3).map((key, i) => (
                <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
        {chartType === "line" && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey={firstStringKey || "id"}
                stroke="#71717a"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#71717a" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              {numericKeys.slice(0, 3).map((key, i) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
        {chartType === "pie" && (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey={firstNumericKey}
                nameKey={firstStringKey || "id"}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
