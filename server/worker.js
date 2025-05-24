import { Worker } from "bullmq";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document } from "@langchain/core/documents";
import { QdrantClient } from "@qdrant/js-client-rest";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OllamaEmbeddings } from "@langchain/ollama";

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    console.log("Job: ", job.data);
    const data = JSON.parse(job.data);
    console.log("data: ", data);

    // farhan you can do these
    // read the pdf from the path,
    // chunck the pdf,
    // call the openai embedding model for every chunk,
    // store the chunk in qdrant db

    //load the pdf
    const loader = new PDFLoader(data.path);
    const docs = await loader.load();
    // console.log("docs : ", docs);
    // console.log(docs[0].metadata);

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });
    const splitDocs = await textSplitter.splitDocuments(docs); // splits all pages

    console.log("Total split chunks:", splitDocs.length);
    // splitDocs.forEach((chunk, i) => {
    //   console.log(`--- Chunk ${i + 1} ---`);
    //   console.log(chunk.pageContent.slice(0, 200)); // preview
    // });

    // const textSplitter = new CharacterTextSplitter({
    //   chunkSize: 300,
    //   chunkOverlap: 50,
    // });
    // const texts = await textSplitter.splitText(docs[0].pageContent);
    // console.log("Length of text:", docs[0].pageContent.length);
    // console.log("Number of chunks:", texts.length);
    // texts.forEach((chunk, i) => {
    //   console.log(`\n--- Chunk ${i + 1} ---`);
    //   console.log(chunk);
    // });

    const client = new QdrantClient({ url: "http://localhost:6333" });
    // const embeddings = new OpenAIEmbeddings();
    // const vectorStore = await QdrantVectorStore.fromDocuments(
    //   docs,
    //   embeddings,
    //   {
    //     client,
    //     collectionName: "movie-collection",
    //   }
    // );

    const embeddings = new OllamaEmbeddings({
      model: "nomic-embed-text:latest",
      baseUrl: "http://localhost:11434", //default value got it from internet
    });
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: "http://localhost:6333",
        collectionName: "pdf-Embeddings",
      }
    );
    await vectorStore.addDocuments(splitDocs);
    console.log("all docs are added to vector store");
  },
  {
    concurrency: 100,
    connection: { host: "localhost", post: "6379" },
  }
);
