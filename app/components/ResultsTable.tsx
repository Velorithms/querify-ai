"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ResultsTableProps {
  data: any[];
  onExportCSV: () => void;
}

export default function ResultsTable({ data, onExportCSV }: ResultsTableProps) {
  if (data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Results</CardTitle>
        <Button
          onClick={onExportCSV}
          size="sm"
          variant="outline"
          className="bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
        >
          <Download className="w-3 h-3 mr-2" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-800 border-b border-zinc-700">
                {headers.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-sm font-semibold text-white"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-zinc-800 hover:bg-zinc-800/50 transition"
                >
                  {headers.map((h) => (
                    <td key={h} className="px-4 py-3 text-sm text-zinc-300">
                      {String(row[h])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
