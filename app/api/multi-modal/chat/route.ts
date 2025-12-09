import { streamText, convertToModelMessages, type UIMessage, stepCountIs } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

// 创建 SiliconFlow 客户端
const model = createOpenAI({
  apiKey: process.env.SILICONFLOW_API_KEY,
  baseURL: process.env.AI_BASE_URL, // 只设置 base URL，SDK 会自动添加 /chat/completions
});

// 允许流式响应最长持续 30 秒
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: model.chat("deepseek-ai/DeepSeek-OCR"),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
