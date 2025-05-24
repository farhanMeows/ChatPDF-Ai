import { Worker } from "bullmq";

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    console.log("Job: ", job.data);
    const data = JSON.parse(job.data);
    // farhan you can do these
    // read the pdf from the path,
    // chunck the pdf,
    // call the openai embedding model for every chunk,
    // store the chunk in qdrant db
  },
  {
    concurrency: 100,
    connection: { host: "localhost", post: "6379" },
  }
);
