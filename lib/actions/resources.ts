"use server";

import { db } from "@/lib/db";
import { NewResourceParams, insertResourceSchema, resources } from "@/lib/db/schema/resources";
import { embeddings as embeddingsTable, generateEmbeddings } from "@/lib/db/schema/embeddings";

/**
 * 创建资源并生成向量嵌入
 * @param input - 新资源参数，包含资源内容
 * @returns 成功消息或错误信息
 */
export const createResource = async (input: NewResourceParams) => {
  try {
    // 验证输入参数，提取资源内容
    const { content } = insertResourceSchema.parse(input);

    // 插入资源到数据库，并返回创建的资源记录
    const [resource] = await db.insert(resources).values({ content }).returning();

    // 为资源内容生成向量嵌入（将文本分块并转换为向量）
    const embeddings = await generateEmbeddings(content);
    // 将所有向量嵌入批量插入到数据库，关联到对应的资源ID
    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        resourceId: resource.id, // 关联资源ID
        ...embedding, // 包含 content 和 embedding 字段
      }))
    );

    return "Resource successfully created.";
  } catch (e) {
    // 捕获并返回错误信息
    if (e instanceof Error) return e.message.length > 0 ? e.message : "Error, please try again.";
  }
};
