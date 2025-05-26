"use client";
import { useState, useCallback, useEffect } from "react";
import { Upload, FileText, Loader2, X, CheckCircle2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { usePdf } from "../context/PdfContext";

interface UploadedFile {
  name: string;
  status: "uploading" | "processing" | "success" | "error";
  jobId?: string;
}

const FileUpload = () => {
  const { uploadedFiles, setUploadedFiles } = usePdf();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const processingFiles = uploadedFiles.filter(
      (f) => f.status === "processing" && f.jobId
    );
    if (processingFiles.length === 0) return;

    const interval = setInterval(async () => {
      for (const file of processingFiles) {
        try {
          const response = await fetch(
            `http://localhost:8000/job-status/${file.jobId}`
          );
          const data = await response.json();
          console.log(data.state);

          if (data.state === "completed") {
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.jobId === file.jobId ? { ...f, status: "success" } : f
              )
            );
          } else if (data.state === "failed") {
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.jobId === file.jobId ? { ...f, status: "error" } : f
              )
            );
          }
        } catch (error) {
          console.error("Error checking job status:", error);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [uploadedFiles, setUploadedFiles]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        name: file.name,
        status: "uploading" as const,
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);
      setIsUploading(true);

      for (const file of acceptedFiles) {
        try {
          const formData = new FormData();
          formData.append("pdf", file);

          const response = await fetch("http://localhost:8000/upload/pdf", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Upload failed");
          }

          const data = await response.json();

          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.name === file.name
                ? { ...f, status: "processing", jobId: data.jobId }
                : f
            )
          );
        } catch (error) {
          console.error("Upload error:", error);
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.name === file.name ? { ...f, status: "error" } : f
            )
          );
        }
      }

      setIsUploading(false);
    },
    [setUploadedFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    disabled: isUploading,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
            : "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600"
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-gray-500 dark:text-gray-400" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {isDragActive ? "Drop your PDFs here" : "Drag & drop PDFs here"}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              or click to select files
            </p>
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Uploaded PDFs
          </h3>
          <ul className="space-y-2">
            {uploadedFiles.map((file) => (
              <li
                key={file.name}
                className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {file.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {file.status === "uploading" && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  )}
                  {file.status === "processing" && (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                      <span className="text-xs text-gray-500">
                        Processing...
                      </span>
                    </div>
                  )}
                  {file.status === "success" && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  {file.status === "error" && (
                    <span className="text-red-500">✕</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
