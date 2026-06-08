import React from 'react'
import ReactMarkdown from 'react-markdown'

export default function MessageBubble({ role, content }) {
  const isUser = role === 'user'
  
  return (
    <div className={`flex w-full mt-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[95%] sm:max-w-[85%] min-w-0 break-words rounded-2xl px-6 py-4 shadow-lg transition-all duration-300 hover:shadow-xl ${
          isUser 
            ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-tr-sm shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-indigo-400/20' 
            : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-sm shadow-black/20 font-sans leading-relaxed'
        }`}
      >
        <div className={`markdown-body w-full overflow-hidden ${isUser ? 'text-[15px]' : 'text-sm text-gray-300'}`}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <ReactMarkdown
               components={{
                 strong: ({node, ...props}) => <strong className="font-bold text-white tracking-wide shadow-sm" {...props} />,
                 em: ({node, ...props}) => <em className="italic text-indigo-300" {...props} />,
                 p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                 ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                 ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                 li: ({node, ...props}) => <li className="mb-1" {...props} />,
                 h1: ({node, ...props}) => <h1 className="text-xl font-bold text-white mb-2" {...props} />,
                 h2: ({node, ...props}) => <h2 className="text-lg font-bold text-indigo-100 mb-2 mt-4" {...props} />,
                 h3: ({node, ...props}) => <h3 className="text-base font-bold text-indigo-200 mb-2 mt-3" {...props} />,
                 code: ({node, inline, ...props}) => 
                    inline 
                    ? <code className="bg-gray-900 text-cyan-300 px-1.5 py-0.5 rounded font-mono text-xs border border-gray-700" {...props} />
                    : <code className="block bg-gray-950 text-cyan-400 p-4 rounded-xl font-mono text-xs overflow-x-auto mb-4 border border-gray-800 shadow-inner leading-normal" {...props} />
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  )
}
