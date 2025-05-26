# PDF RAG Chat 🤖

![PDF RAG Chat Screenshot](https://raw.githubusercontent.com/yourusername/pdf-rag/main/screenshot.png)

A modern AI-powered chat application that lets you upload PDFs and have intelligent conversations with their content! Built with Next.js 14, Express, and powered by Ollama's deepseek-r1 model for advanced natural language understanding. Features real-time PDF processing with Bull queues, secure authentication via Clerk, and a beautiful UI crafted with Tailwind CSS and shadcn/ui.

## 🛠️ Prerequisites

Before you start, make sure you have:

1. **Node.js** (v18 or later)
2. **Docker**
3. **Ollama** installed with required models:

   ```bash
   # Install Ollama from https://ollama.ai

   # Pull the required models
   ollama pull deepseek-r1:1.5b
   ollama pull nomic-embed-text:latest
   ```

4. **Clerk Account**
   - Sign up at [clerk.com](https://clerk.com)
   - Create a new application
   - Get your API keys

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd pdf-rag
   ```

2. **Start Docker services**

   ```bash
   docker compose up -d
   ```

3. **Install dependencies**

   ```bash
   # Install server dependencies
   cd server
   pnpm install

   # Install client dependencies
   cd ../client
   pnpm install
   ```

4. **Environment Variables**

   Create `.env` file in the client directory:

   ```bash
   # client/.env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

5. **Start the development servers**

   In one terminal (for the main server):

   ```bash
   cd server
   pnpm run dev
   ```

   In another terminal (for the PDF processing worker):

   ```bash
   cd server
   pnpm run dev:worker
   ```

   In a third terminal (for the frontend):

   ```bash
   cd client
   pnpm run dev
   ```

6. **Open your browser**
   - Main application: Visit `http://localhost:3000`
   - Vector DB Dashboard: Visit `http://localhost:6333/dashboard` to monitor your PDF embeddings

## 💡 How to Use

1. Sign in or create an account
2. Upload your PDF(s)
3. Wait for the processing to complete
4. Start chatting with your PDF content!

## 🔧 Troubleshooting

- **Ollama not running?**
  Make sure Ollama is running in the background:

  ```bash
  ollama serve
  ```

- **PDF processing stuck?**
  Check if the required models are installed:

  ```bash
  ollama list
  ```

- **Authentication issues?**
  Verify your Clerk API keys in the `.env` file

## 🛠️ Tech Stack

- **Frontend**

  - Next.js 14
  - React
  - Tailwind CSS
  - Clerk (Authentication)
  - shadcn/ui

- **Backend**
  - Node.js
  - Express
  - Ollama
  - Bull (for job processing)
  - Qdrant (Vector Database)
  - Valkey (Redis-compatible queue)

(https://raw.githubusercontent.com/yourusername/pdf-rag/main/screenshot.png)

## 🔍 Why Valkey?

Used Valkey instead of Redis for our Bull queue because:

- **Performance**: Valkey is optimized for high-throughput scenarios, making it perfect for handling multiple PDF processing jobs
- **Memory Efficiency**: Better memory management for large PDF processing tasks
- **Compatibility**: Fully compatible with Redis protocol, so it works seamlessly with Bull
- **Modern Features**: Built-in support for modern data structures and patterns
- **Resource Usage**: Lower resource footprint compared to Redis while maintaining the same functionality

## 🤝 Contributing

Feel free to open issues or submit pull requests!
