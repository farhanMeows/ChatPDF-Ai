import express from "express";
import cors from "cors";
import multer from "multer";
import { Queue } from "bullmq";
import path from "path";
import { getVectorStore } from "./vectorUtils.js";
import ollama from "ollama";

const queue = new Queue("file-upload-queue", {
  connection: { host: "localhost", post: "6379" },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  return res.json({ status: "All Good" });
});

app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
  const job = await queue.add(
    "file-ready",
    JSON.stringify({
      filename: req.file.originalname,
      destination: req.file.destination,
      path: req.file.path,
    })
  );
  return res.json({ message: "uploaded", jobId: job.id });
});

app.get("/job-status/:id", async (req, res) => {
  const { id } = req.params;

  const job = await queue.getJob(id);
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  const state = await job.getState(); // "waiting" | "active" | "completed" | "failed" ...
  const progress = job.progress ?? 0; // number | object | undefined
  // if (progress === "100") {
  //   state = completed;
  // }
  console.log(state);

  res.json({ state, progress });
});

app.get("/chat", async (req, res) => {
  const userQuery = req.query.message;
  const vectorStore = await getVectorStore();
  const retriever = vectorStore.asRetriever({
    k: 3,
  });
  const result = await retriever.invoke(userQuery);
  //   console.log(result);

  //   const result = await vectorStore.similaritySearch(userQuery, 5);
  //   console.log(result);
  const SYSTEM_PROMPT = `You are a helpful and intelligent AI assistant. You are given extracted text from a PDF document, provided below as CONTEXT.

  Your tasks:
  1. When asked to summarize, provide a clear, structured, and comprehensive summary — not just a surface-level overview.
  2. Identify major topics, key ideas, and learning objectives.
  3. Group related content into meaningful sections or themes if appropriate.
  4. Ignore duplicate content or formatting errors caused by the PDF extraction process.
  5. Do not reference the content as a "PDF" — treat the CONTEXT as accurate, readable source text.
  6. Only use the provided CONTEXT to generate your answers. Do not hallucinate or assume facts not present.
  
  CONTEXT:
  ${result.map((r) => r.pageContent).join("\n\n")}`;

  console.log(SYSTEM_PROMPT);

  const message = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userQuery },
  ];
  const response = await ollama.chat({
    model: "deepseek-r1:1.5b",
    // model: "llama3.2:3b",s
    messages: message,
    stream: false,
  });

  return res.json({ response });
});
app.listen(8000, () => console.log("server started on Port 8000"));
