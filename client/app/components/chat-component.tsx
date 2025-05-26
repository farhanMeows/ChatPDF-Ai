"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2, Send, FileText } from "lucide-react";
import clsx from "clsx";
import { v4 as uuid } from "uuid";
import { usePdf } from "../context/PdfContext";

interface IMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
}

const ChatComponent: React.FC = () => {
  const [message, setMessage] = React.useState("");
  const [history, setHistory] = React.useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { hasProcessedPdfs } = usePdf();
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isLoading]);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendChatMessage = React.useCallback(async () => {
    if (!hasProcessedPdfs) return;

    // Optimistic update for user message
    const userMsg: IMessage = { id: uuid(), role: "user", content: message };
    setHistory((h) => [...h, userMsg]);
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/chat?message=${message}`);

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = (await res.json()) as {
        response: { message: { content: string } };
      };

      const cleaned = data.response.message.content
        .replace(/<think>[\s\S]*?<\/think>/g, "")
        .trimStart();

      console.log(cleaned);

      const assistantMsg: IMessage = {
        id: uuid(),
        role: "assistant",
        content: cleaned,
      };
      setHistory((h) => [...h, assistantMsg]);
    } catch (error) {
      const errMsg: IMessage = {
        id: uuid(),
        role: "assistant",
        content:
          "⚠️ Sorry, something went wrong. Please try again or check your connection.",
      };
      setHistory((h) => [...h, errMsg]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [message, hasProcessedPdfs]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Chat
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {!hasProcessedPdfs ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <FileText className="h-12 w-12 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  No PDFs Ready for Chat
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Upload and wait for PDFs to be processed before starting a
                  chat
                </p>
              </div>
            </div>
          ) : history.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Start a conversation by asking a question about your PDF
              </p>
            </div>
          ) : (
            history.map((msg) => (
              <div
                key={msg.id}
                className={clsx(
                  "group flex w-full",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={clsx(
                    "whitespace-pre-line max-w-[80%] rounded-2xl px-4 py-2 text-sm sm:text-base",
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-2 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendChatMessage();
          }}
          className="flex items-center gap-2"
        >
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              hasProcessedPdfs
                ? "Type your question..."
                : "Waiting for PDFs to be processed..."
            }
            className="flex-1"
            disabled={isLoading || !hasProcessedPdfs}
          />
          <Button
            type="submit"
            disabled={!message.trim() || isLoading || !hasProcessedPdfs}
            size="icon"
            className="h-10 w-10"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;
