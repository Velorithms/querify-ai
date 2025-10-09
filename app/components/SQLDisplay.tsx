"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface SQLDisplayProps {
  sql: string;
  executionTime: number;
}

export default function SQLDisplay({ sql, executionTime }: SQLDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Generated SQL</CardTitle>
        <div className="flex items-center gap-2">
          {executionTime > 0 && (
            <Badge className="bg-gradient-to-r from-emerald-950 to-cyan-950 border-emerald-700 text-emerald-300">
              ⚡ {executionTime}ms
            </Badge>
          )}
          <Button
            onClick={handleCopy}
            size="sm"
            variant="outline"
            className="bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 mr-2" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="bg-black border border-zinc-800 rounded-lg p-4 overflow-x-auto">
          <code className="text-emerald-400 text-sm font-mono">{sql}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
