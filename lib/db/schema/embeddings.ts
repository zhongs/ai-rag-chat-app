import { nanoid } from "@/lib/utils";
import { index, pgTable, text, varchar, vector } from "drizzle-orm/pg-core";
import { resources } from "./resources";


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
    // 向量嵌入数据，维度必须匹配模型输出
    // BAAI/bge-large-zh-v1.5: 1024维
    // 注意: HNSW 索引最多支持 2000 维
    embedding: vector("embedding", { dimensions: 1024 }).notNull(),
  },
  (table) => ({
    // 使用 HNSW 算法为 embedding 字段创建向量索引，支持余弦相似度查询
    embeddingIndex: index("embeddingIndex").using("hnsw", table.embedding.op("vector_cosine_ops")),
  })
);
