import { useState, useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import Controls from './Controls'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export default function ChatInterface({ sessionId }) {
  const [messages, setMessages] = useState([])
  const [mode, setMode] = useState('interview')
  const [hintLevel, setHintLevel] = useState(0)
  const [activeAgent, setActiveAgent] = useState('DSA')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/session/${sessionId}`)
        if (res.ok) {
          const data = await res.json()
          setMessages(data.history || [])
          setHintLevel(data.hintLevel)
          setMode(data.currentMode)
        }
      } catch (err) {
        console.error('Failed to load session:', err)
      }
    }
    fetchSession()
  }, [sessionId])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSendMessage = async (text) => {
    if (!text.trim()) return

    const newMsg = { role: 'user', content: text, timestamp: new Date().toISOString() }
    setMessages((prev) => [...prev, newMsg])
    setIsLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: text,
          mode,
          hintLevel
        })
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: data.reply, timestamp: new Date().toISOString() }
      ])
      setHintLevel(data.hintLevel)
      if (data.activeAgent) setActiveAgent(data.activeAgent)
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: '[SYS_ERR] Neural uplink severed. Check connection.', timestamp: new Date().toISOString() }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetHint = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })
      const data = await res.json()
      setHintLevel(data.hintLevel)
      handleSendMessage("I am currently stuck. Can you provide a hint?")
    } catch (err) {
      console.error(err)
    }
  }

  const handleResetHint = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })
      const data = await res.json()
      setHintLevel(data.hintLevel)
    } catch (err) {
      console.error(err)
    }
  }

  const getAgentColor = (agent) => {
    if (agent === 'LLD') return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30'
    if (agent === 'HLD') return 'text-fuchsia-400 bg-fuchsia-400/10 border-fuchsia-400/30'
    if (agent === 'Behavioral') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
    return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/30' // DSA Default
  }

  return (
    <div className="flex flex-col h-full relative z-10 w-full">
      {/* Top Bar */}
      <div className="bg-gray-900/80 backdrop-blur-sm p-4 flex justify-between items-center text-xs border-b border-gray-800 shadow-sm relative z-20">
         <div className="flex items-center gap-4">
            <div className={`px-3 py-1.5 rounded-md border text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center gap-2 transition-all ${getAgentColor(activeAgent)}`}>
               <div className={`w-2 h-2 rounded-full animate-pulse ${activeAgent === 'LLD' ? 'bg-cyan-400' : activeAgent === 'HLD' ? 'bg-fuchsia-400' : activeAgent === 'Behavioral' ? 'bg-emerald-400' : 'bg-indigo-400'}`}></div>
               {activeAgent} NODE ACTIVE
            </div>
         </div>
         <div className="flex items-center gap-3 pr-2">
             <div className="flex items-center gap-2">
                <span className="text-gray-500 font-mono">Strictness:</span>
                <span className="text-gray-300 uppercase tracking-widest bg-gray-800 px-2 py-1 rounded font-semibold text-[10px]">{mode}</span>
             </div>
             <div className="w-px h-4 bg-gray-700 mx-2"></div>
             <div className="flex items-center gap-2">
                <span className="text-gray-500 font-mono">Hint Lvl:</span>
                <span className={`text-gray-900 px-2 py-1 rounded font-bold text-[10px] ${hintLevel > 0 ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]' : 'bg-gray-600'}`}>{hintLevel}/3</span>
             </div>
         </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 w-full">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
             <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 max-w-md text-center backdrop-blur-sm">
                <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto flex items-center justify-center mb-4 border border-gray-700">
                   <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-200 mb-2">Systems Online</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                   Upload a LeetCode problem, design prompt, or behavioral question. The router will automatically engage the appropriate Neural Node.
                </p>
             </div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} role={msg.role} content={msg.content} />
        ))}
        {isLoading && (
          <div className="flex w-full mt-4 justify-start">
             <div className="bg-gray-800 text-gray-200 border border-gray-700 rounded-2xl rounded-tl-sm px-6 py-4 shadow-lg flex items-center gap-3">
                <span className="font-mono text-sm text-indigo-400">Thinking</span>
                <span className="flex gap-1 mt-1">
                   <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                   <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                   <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </span>
             </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <Controls 
        onSend={handleSendMessage} 
        onGetHint={handleGetHint}
        onResetHint={handleResetHint}
        mode={mode}
        setMode={setMode}
        hintLevel={hintLevel}
        isLoading={isLoading}
      />
    </div>
  )
}
