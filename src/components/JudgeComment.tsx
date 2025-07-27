import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, MessageSquare } from "lucide-react";

interface JudgeCommentProps {
  comment: string;
}

export default function JudgeComment({ comment }: JudgeCommentProps) {
  // Remove <think> tags and clean up the comment
  const cleanComment = comment
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .trim();

  if (!cleanComment) return null;

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-700/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <Scale className="w-5 h-5" />
          Comentário do Juiz IA
          <MessageSquare className="w-4 h-4 ml-auto" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-amber-50/50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200/30 dark:border-amber-700/20">
          <p className="text-amber-900 dark:text-amber-100 leading-relaxed whitespace-pre-wrap">
            {cleanComment}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}