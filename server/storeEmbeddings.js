import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { OllamaEmbeddings } from "@langchain/ollama";
import { getVectorStore } from "./vectorUtils.js";

let vectorStore;

const storeEmbeddings = async (splitDocs) => {
  console.log("starting embeddings...");

  const vectorStore = await getVectorStore();
  await vectorStore.addDocuments(splitDocs);

  console.log("all docs are added to vector store");
};

export { vectorStore };
export default storeEmbeddings;
