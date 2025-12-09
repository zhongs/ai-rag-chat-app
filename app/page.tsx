import Link from 'next/link';
import { Brain, Sparkles } from 'lucide-react';

const demos = [
  {
    id: 'rag',
    title: 'RAG 知识库',
    description: '检索增强生成 (Retrieval-Augmented Generation)',
    icon: Brain,
    color: 'blue',
    features: [
      '添加和管理知识库',
      '语义搜索',
      '基于知识库回答问题',
      '向量相似度检索',
    ],
    href: '/rag',
    status: 'active',
  },
  {
    id: 'multi-modal',
    title: '多模态对话',
    description: 'Multi-modal Conversation',
    icon: Sparkles,
    color: 'purple',
    features: [
      '纯文本对话',
      '图像识别（即将支持）',
      '文档理解（即将支持）',
      '实时流式响应',
    ],
    href: '/multi-modal',
    status: 'active',
  },
];

const colorClasses = {
  blue: {
    bg: 'bg-blue-100',
    hoverBg: 'group-hover:bg-blue-500',
    text: 'text-blue-600',
    hoverText: 'group-hover:text-white',
    border: 'hover:border-blue-500',
    button: 'bg-blue-500 group-hover:bg-blue-600',
  },
  purple: {
    bg: 'bg-purple-100',
    hoverBg: 'group-hover:bg-purple-500',
    text: 'text-purple-600',
    hoverText: 'group-hover:text-white',
    border: 'hover:border-purple-500',
    button: 'bg-purple-500 group-hover:bg-purple-600',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🤖 AI Demo 集合
          </h1>
          <p className="text-xl text-gray-600">
            探索不同的 AI 功能演示
          </p>
          <p className="text-sm text-gray-500 mt-2">
            基于 Vercel AI SDK + SiliconFlow API
          </p>
        </div>

        {/* Demo 卡片网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {demos.map((demo) => {
            const Icon = demo.icon;
            const colors = colorClasses[demo.color as keyof typeof colorClasses];
            const isComingSoon = demo.status === 'coming-soon';

            const card = (
              <div
                className={`group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 border-2 border-transparent ${
                  isComingSoon
                    ? 'opacity-60 cursor-not-allowed'
                    : `cursor-pointer hover:shadow-2xl ${colors.border}`
                }`}
              >
                {/* Coming Soon 标签 */}
                {isComingSoon && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gray-200 text-gray-600 text-xs font-semibold rounded-full">
                    即将推出
                  </div>
                )}

                <div className="flex flex-col h-full">
                  {/* 图标和标题 */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`p-3 ${colors.bg} rounded-xl ${colors.hoverBg} transition-colors duration-300`}
                    >
                      <Icon
                        className={`w-8 h-8 ${colors.text} ${colors.hoverText} transition-colors duration-300`}
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {demo.title}
                      </h2>
                      <p className="text-sm text-gray-500">{demo.description}</p>
                    </div>
                  </div>

                  {/* 功能列表 */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {demo.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* 按钮 */}
                  {!isComingSoon && (
                    <div
                      className={`px-6 py-2.5 ${colors.button} text-white rounded-lg text-center font-medium transition-colors`}
                    >
                      开始体验 →
                    </div>
                  )}
                </div>
              </div>
            );

            return isComingSoon ? (
              <div key={demo.id}>{card}</div>
            ) : (
              <Link key={demo.id} href={demo.href}>
                {card}
              </Link>
            );
          })}
        </div>

        {/* 底部信息 */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Next.js 14 · React · TypeScript · TailwindCSS · Drizzle ORM</p>
          <p className="mt-2">
            <a
              href="https://github.com/zhongs/ai-rag-chat-app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              查看源码
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}