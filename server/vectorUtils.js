import { QdrantClient } from "@qdrant/js-client-rest";
import { OllamaEmbeddings } from "@langchain/ollama";
import { QdrantVectorStore } from "@langchain/qdrant";

export const getVectorStore = async () => {
  const client = new QdrantClient({ url: "http://localhost:6333" });
  const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text:latest",
    baseUrl: "http://localhost:11434",
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      client,
      collectionName: "pdf-Embeddings",
    }
  );

  return vectorStore;
};
