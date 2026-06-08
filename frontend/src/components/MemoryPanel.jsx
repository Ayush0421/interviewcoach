import { useState, useEffect } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export default function MemoryPanel() {
  const [memories, setMemories] = useState([])
  const [newContent, setNewContent] = useState('')
  const [newType, setNewType] = useState('mistake')
  const [isSaving, setIsSaving] = useState(false)

  const fetchMemories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/memory/all`)
      const data = await res.json()
      setMemories(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchMemories()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    if (!newContent.trim()) return

    setIsSaving(true)
    try {
      await fetch(`${API_BASE_URL}/memory/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: newType, content: newContent })
      })
      setNewContent('')
      fetchMemories()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const getTypeColor = (type) => {
    switch(type) {
      case 'mistake': return 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.05)]'
      case 'note': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.05)]'
      case 'pattern': return 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30 shadow-[0_0_10px_rgba(217,70,239,0.05)]'
      default: return 'bg-gray-800 text-gray-300 border-gray-700'
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 border border-gray-800 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden mt-4 mb-6 backdrop-blur-md">
      <div className="bg-gray-900/80 p-5 border-b border-gray-800 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-cyan-500 to-fuchsia-500"></div>
        <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
           <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
           Memory Core
        </h2>
        <p className="text-xs text-gray-500 font-mono mt-1">Vector DB Context Injection</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {memories.length === 0 ? (
          <div className="text-xs text-gray-600 font-mono italic text-center mt-10">
             &gt;_ Vector store empty. Provide data.
          </div>
        ) : (
          memories.map((mem) => (
            <div key={mem.id} className={`p-4 rounded-xl border text-sm transition-all hover:scale-[1.02] cursor-default ${getTypeColor(mem.type)}`}>
              <div className="font-bold uppercase text-[10px] tracking-widest mb-2 flex items-center gap-1.5 opacity-80">
                 <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                 {mem.type}
              </div>
              <div className="leading-relaxed opacity-90">{mem.content}</div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSave} className="p-5 bg-gray-950/50 border-t border-gray-800 space-y-3">
        <select 
          value={newType} 
          onChange={e => setNewType(e.target.value)}
          className="w-full text-xs font-semibold uppercase tracking-wider border border-gray-700 rounded-lg p-2.5 bg-gray-900 text-gray-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="mistake">Error / Mistake</option>
          <option value="note">Concept Note</option>
          <option value="pattern">Design Pattern</option>
        </select>
        <textarea
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
          placeholder="Store neural data..."
          className="w-full text-sm border border-gray-700 rounded-lg p-3 bg-gray-900 text-gray-200 resize-none h-20 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-gray-600"
        />
        <button 
          type="submit" 
          disabled={isSaving || !newContent.trim()}
          className="w-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold uppercase tracking-widest text-xs py-3 rounded-lg hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-indigo-600/20 disabled:hover:text-indigo-400 cursor-pointer"
        >
          {isSaving ? 'VECTORIZING...' : '+ INJECT MEMORY'}
        </button>
      </form>
    </div>
  )
}
