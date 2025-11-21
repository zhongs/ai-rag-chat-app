import { embedMany } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const model = createOpenAI({
  apiKey: process.env.SILICONFLOW_API_KEY,
  baseURL: process.env.AI_BASE_URL,
})

// 将输入文本分割成多个文本块
// 按句号分割，去除空白和空字符串
const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split(".")
    .filter((i) => i !== "");
};


// 生成文本的向量嵌入
// 将输入文本分块后，批量生成向量嵌入，返回每个文本块及其对应的向量
export const generateEmbeddings = async (value: string): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  try {
    const { embeddings } = await embedMany({
      model: model.embedding("BAAI/bge-large-zh-v1.5"),
      values: chunks,
    });
    return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
  } catch (error) {
    console.error("生成向量嵌入时出错:", error);
    return [];
  }
};
