/**
 * Embedding utilities — talks to Ollama's local API.
 */

const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://localhost:11434";
const MODEL = process.env.EMBED_MODEL ?? "nomic-embed-text";

export async function embed(text: string, type: "query" | "document" = "query"): Promise<number[]> {
  const prefix = type === "query" ? "search_query" : "search_document";
  const res = await fetch(`${OLLAMA_URL}/api/embed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, input: `${prefix}: ${text}` }),
  });

  if (!res.ok) {
    throw new Error(`Ollama embed failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { embeddings: number[][] };
  return data.embeddings[0];
}

export async function embedBatch(texts: string[], type: "query" | "document" = "document"): Promise<number[][]> {
  const prefix = type === "query" ? "search_query" : "search_document";
  const prefixed = texts.map((t) => `${prefix}: ${t}`);
  const res = await fetch(`${OLLAMA_URL}/api/embed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, input: prefixed }),
  });

  if (!res.ok) {
    throw new Error(`Ollama embed failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { embeddings: number[][] };
  return data.embeddings;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
