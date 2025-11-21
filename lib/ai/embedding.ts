/**
 * AI 向量嵌入工具模块
 * 提供文本向量化和相似度检索功能
 * 
 * 功能：
 * - 将文本转换为向量嵌入（1024维）
 * - 批量生成向量嵌入
 * - 基于余弦相似度的语义搜索
 */

import { createOpenAI } from "@ai-sdk/openai";
import { embed, embedMany } from 'ai';
import { db } from '@/lib/db';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { embeddings } from '@/lib/db/schema/embeddings';

// 创建 OpenAI 客户端（兼容 SiliconFlow API）
const model = createOpenAI({
  apiKey: process.env.SILICONFLOW_API_KEY,
  baseURL: process.env.AI_BASE_URL,
})

// 嵌入模型：BAAI/bge-large-zh-v1.5（1024维，中文优化）
const embeddingModel = model.embedding('BAAI/bge-large-zh-v1.5');


/**
 * 将输入文本分割成多个文本块
 * 按句号分割，便于后续向量化处理
 * @param input - 输入的长文本
 * @returns 文本块数组
 */
const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split(".") // 按句号分割
    .filter((i) => i !== ""); // 过滤空字符串
};

/**
 * 批量生成文本的向量嵌入
 * 将输入文本分块后，批量生成向量嵌入，返回每个文本块及其对应的向量
 * @param value - 输入的长文本
 * @returns 包含文本内容和向量嵌入的对象数组
 */
export const generateEmbeddings = async (value: string): Promise<Array<{ embedding: number[]; content: string }>> => {
  // 将长文本分割成多个文本块
  const chunks = generateChunks(value);
  
  try {
    // 批量生成向量嵌入（提高效率）
    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: chunks,
    });
    // 将向量和对应的文本内容组合返回
    return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
  } catch (error) {
    // 如果生成失败，记录错误并返回空数组
    console.error("生成向量嵌入时出错:", error);
    return [];
  }
};

/**
 * 为单个文本生成向量嵌入
 * @param value - 输入文本
 * @returns 向量嵌入数组（数字数组）
 */
export const generateEmbedding = async (value: string): Promise<number[]> => {
  // 将文本中的换行符替换为空格，避免格式问题
  const input = value.replaceAll('\\n', ' ');
  // 使用嵌入模型生成向量
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

/**
 * 根据用户查询从知识库中查找相关内容
 * 使用余弦相似度计算查询向量与存储向量的相似性
 * @param userQuery - 用户的查询文本
 * @returns 相关内容列表，包含文本内容和相似度分数
 */
export const findRelevantContent = async (userQuery: string) => {
  // 将用户查询转换为向量嵌入
  const userQueryEmbedded = await generateEmbedding(userQuery);
  
  // 计算余弦相似度：1 - 余弦距离 = 相似度分数（0-1之间，越接近1越相似）
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded,
  )})`;
  
  // 查询数据库，筛选相似度 > 0.5 的内容
  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.5)) // 只返回相似度大于 0.5 的结果
    .orderBy(t => desc(t.similarity)) // 按相似度降序排列
    .limit(4); // 最多返回 4 条结果
  
  return similarGuides;
};