import { convertToModelMessages, streamText, UIMessage, tool, stepCountIs } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { createResource } from "@/lib/actions/resources";

// 创建 SiliconFlow 客户端
const model = createOpenAI({
  apiKey: process.env.SILICONFLOW_API_KEY,
  baseURL: process.env.AI_BASE_URL, // 只设置 base URL，SDK 会自动添加 /chat/completions
});

// 允许流式响应最长持续 30 秒
export const maxDuration = 30;

/**
 * 处理聊天 API 的 POST 请求
 * 接收用户消息，使用 OpenAI 模型生成流式响应
 */
export async function POST(req: Request) {
  // 从请求体中解析消息列表
  const { messages }: { messages: UIMessage[] } = await req.json();

  // 使用 SiliconFlow 的聊天模型生成流式文本响应
  // 使用 .chat() 方法明确指定使用 Chat Completions API
  const result = streamText({
    stopWhen: stepCountIs(5),
    model: model.chat("Qwen/QwQ-32B"),
    messages: convertToModelMessages(messages),
    system: `
    你是一个乐于助人的助手。在回答任何问题之前，请先查阅你的知识库。
    仅使用工具调用中的信息回答问题。
    如果在工具调用中未找到相关信息，请回复“抱歉，我不知道。
    `,

    tools: {
      addResource: tool({
        description: `将资源添加到您的知识库中。
                      如果用户主动提供了一条随机知识点，则使用此工具时无需请求确认。`,
        inputSchema: z.object({
          content: z.string().describe("要添加到知识库的内容或资源"),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
    },
  });

  // 返回 UI 消息流响应
  return result.toUIMessageStreamResponse();
}
