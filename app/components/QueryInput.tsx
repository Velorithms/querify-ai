"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Trash2 } from "lucide-react";

interface QueryInputProps {
  question: string;
  setQuestion: (value: string) => void;
  onRun: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export default function QueryInput({
  question,
  setQuestion,
  onRun,
  onClear,
  isLoading,
}: QueryInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      onRun();
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Ask a Question</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., Show me the top 5 customers by total orders..."
          className="min-h-[120px] bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 resize-none"
        />
        <div className="flex gap-3">
          <Button
            onClick={onRun}
            disabled={!question.trim() || isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Run Query
          </Button>
          <Button
            onClick={onClear}
            variant="outline"
            className="bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
