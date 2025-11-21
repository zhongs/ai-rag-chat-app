import { nanoid } from "@/lib/utils";
import { index, pgTable, text, varchar, vector } from "drizzle-orm/pg-core";
import { resources } from "./resources";
import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";

const embeddingModel = openai.embedding("text-embedding-ada-002");

// 定义向量嵌入表结构
export const embeddings = pgTable(
  "embeddings",
  {
    // 主键ID，自动生成唯一标识符
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    // 关联的资源ID，外键引用 resources 表，级联删除
    resourceId: varchar("resource_id", { length: 191 }).references(() => resources.id, { onDelete: "cascade" }),
    // 文本内容，用于存储被向量化的原始文本片段
    content: text("content").notNull(),
    // 向量嵌入数据，维度根据配置的模型自动确定
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  },
  (table) => ({
    // 使用 HNSW 算法为 embedding 字段创建向量索引，支持余弦相似度查询
    embeddingIndex: index("embeddingIndex").using("hnsw", table.embedding.op("vector_cosine_ops")),
  })
);

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
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};
