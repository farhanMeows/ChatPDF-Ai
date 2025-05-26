import { Worker } from "bullmq";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document } from "@langchain/core/documents";
import { QdrantClient } from "@qdrant/js-client-rest";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OllamaEmbeddings } from "@langchain/ollama";
import storeEmbeddings from "./storeEmbeddings.js";

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    console.log("Job: ", job.data);
    const data = JSON.parse(job.data);
    console.log("data: ", data);

    // farhan you got this
    // read the pdf from the path,
    // chunck the pdf,
    // call the openai embedding model for every chunk,
    // store the chunk in qdrant db

    // cant use openai, got no credits

    //load the pdf
    const loader = new PDFLoader(data.path);
    const docs = await loader.load();
    // console.log("docs : ", docs);
    // console.log(docs[0].metadata);

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 50,
    });
    const splitDocs = await textSplitter.splitDocuments(docs); // splits all pages

    console.log("Total split chunks:", splitDocs.length);

    await storeEmbeddings(splitDocs);
    await job.updateProgress("100");
  },
  {
    concurrency: 100,
    connection: { host: "localhost", post: "6379" },
  }
);
