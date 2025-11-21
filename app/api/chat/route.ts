import { getChatModel } from '@/lib/ai/openai-config';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

// 允许流式响应最长持续 30 秒
export const maxDuration = 30;

/**
 * 处理聊天 API 的 POST 请求
 * 接收用户消息，使用 OpenAI 模型生成流式响应
 */
export async function POST(req: Request) {
  // 从请求体中解析消息列表
  const { messages }: { messages: UIMessage[] } = await req.json();

  // 使用配置的聊天模型生成流式文本响应（根据环境变量自动选择平台和模型）
  const result = streamText({
    model: getChatModel(), // 使用配置的默认模型
    messages: convertToModelMessages(messages), // 将 UI 消息转换为模型消息格式
  });

  // 返回 UI 消息流响应
  return result.toUIMessageStreamResponse();
}