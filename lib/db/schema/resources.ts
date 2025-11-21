import { sql } from "drizzle-orm";
import { text, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { nanoid } from "@/lib/utils";

// 定义资源表结构
export const resources = pgTable("resources", {
  // 主键ID，自动生成唯一标识符
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  // 资源内容，存储文本数据
  content: text("content").notNull(),

  // 创建时间，自动设置为当前时间
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  // 更新时间，自动设置为当前时间
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

// 资源插入验证模式 - 用于验证 API 请求
// 排除了 id、createdAt、updatedAt 字段，这些字段会自动生成
export const insertResourceSchema = createSelectSchema(resources)
  .extend({})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

// 新资源参数类型 - 用于类型化 API 请求参数和组件内部使用
export type NewResourceParams = z.infer<typeof insertResourceSchema>;
