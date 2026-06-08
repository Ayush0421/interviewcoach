import { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import MemoryPanel from './components/MemoryPanel'

function App() {
  const [sessionId, setSessionId] = useState('')
  
  useEffect(() => {
    const existingSession = localStorage.getItem('interview_session_id')
    if (existingSession) {
      setSessionId(existingSession)
    } else {
      const newSession = crypto.randomUUID()
      localStorage.setItem('interview_session_id', newSession)
      setSessionId(newSession)
    }
  }, [])

  if (!sessionId) return (
     <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="animate-pulse flex flex-col items-center">
           <div className="h-12 w-12 rounded-full border-t-4 border-indigo-500 animate-spin mb-4"></div>
           <p className="text-indigo-400 font-mono text-sm tracking-widest">INITIALIZING NEURAL NET...</p>
        </div>
     </div>
  )

  const handleClearSession = () => {
     if(window.confirm("Are you sure you want to clear your conversation history?")) {
        const newSession = crypto.randomUUID()
        localStorage.setItem('interview_session_id', newSession)
        setSessionId(newSession)
     }
  }

  return (
    <div className="flex h-screen w-full flex-col bg-gray-950 items-center overflow-hidden selection:bg-indigo-500/30">
      {/* Header */}
      <header className="w-full max-w-7xl p-6 pb-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">AI Interview Coach</h1>
            <p className="text-xs text-indigo-300/70 font-mono tracking-wider mt-1 border-b border-indigo-500/30 inline-block pb-0.5">V2.0 // MULTI-AGENT ARCHITECTURE</p>
          </div>
        </div>
        <div className="flex space-x-3">
           <button 
              onClick={handleClearSession}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-red-400 bg-red-400/10 border border-red-400/20 hover:bg-red-400/20 hover:border-red-400/50 rounded-lg transition-all duration-300"
           >
              Clear Session
           </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex w-full max-w-7xl h-full gap-6 px-6 pb-6 pt-2 z-10 h-[calc(100vh-100px)]">
         {/* Main Chat Area */}
         <main className="flex-[3] min-w-0 bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-indigo-500/5 before:to-transparent before:pointer-events-none">
           <ChatInterface sessionId={sessionId} />
         </main>
         
         {/* Sidebar Memory Panel */}
         <aside className="flex-[1] min-w-[320px] max-w-sm flex flex-col">
            <MemoryPanel />
         </aside>
      </div>

      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  )
}

export default App
