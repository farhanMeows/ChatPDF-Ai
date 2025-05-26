"use client";

import React, { createContext, useContext, useState } from "react";

interface UploadedFile {
  name: string;
  status: "uploading" | "processing" | "success" | "error";
  jobId?: string;
}

interface PdfContextType {
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  hasProcessedPdfs: boolean;
}

const PdfContext = createContext<PdfContextType | undefined>(undefined);

export function PdfProvider({ children }: { children: React.ReactNode }) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const hasProcessedPdfs = uploadedFiles.some(
    (file) => file.status === "success"
  );

  return (
    <PdfContext.Provider
      value={{ uploadedFiles, setUploadedFiles, hasProcessedPdfs }}
    >
      {children}
    </PdfContext.Provider>
  );
}

export function usePdf() {
  const context = useContext(PdfContext);
  if (context === undefined) {
    throw new Error("usePdf must be used within a PdfProvider");
  }
  return context;
}
