"use client";

import FileUpload from "./components/file-upload";
import ChatComponent from "./components/chat-component";
import { PdfProvider } from "./context/PdfContext";
import { SignIn, SignUp } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="items-center justify-center mr-10">
            <h1 className="text-3xl font-bold tracking-tight  text-gray-900 dark:text-white">
              ChatPDF-Ai
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in to start chatting with your PDFs
            </p>
          </div>
          <div className="mt-8">
            <SignIn />
          </div>
        </div>
      </div>
    );
  }

  return (
    <PdfProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              ChatPDF-Ai
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Upload your PDF and chat with its contents
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Upload PDF
                  </h2>
                  <FileUpload />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="h-[calc(100vh-16rem)] rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <ChatComponent />
              </div>
            </div>
          </div>
        </main>
      </div>
    </PdfProvider>
  );
}
