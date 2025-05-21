"use client";
import { useState } from "react";
import { Upload } from "lucide-react";
const FileUpload = () => {
  const handleFileupload = () => {
    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", "application/pdf");

    el.addEventListener("change", (ev) => {
      const target = ev.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        console.log(target.files);
        const file = target.files[0];
      }
    });

    el.click();
  };

  return (
    <div className="bg-slate-950 text-white items-center justify-center p-2 cursor-pointer">
      <Upload onClick={handleFileupload} />
    </div>
  );
};

export default FileUpload;
