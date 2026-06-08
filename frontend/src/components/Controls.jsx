import { useState } from 'react'

export default function Controls({ onSend, onGetHint, onResetHint, mode, setMode, hintLevel, isLoading }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSend(text)
    setText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="p-5 bg-gray-900 border-t border-gray-800 space-y-4 rounded-b-2xl relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
         <select 
            value={mode} 
            onChange={(e) => setMode(e.target.value)}
            className="text-xs font-semibold tracking-wide border border-gray-700 rounded-lg py-2 px-3 bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer appearance-none shadow-sm"
            disabled={isLoading}
         >
            <option value="interview">Strict Interview Mode</option>
            <option value="learning">Learning Mode</option>
            <option value="debug">Debug Mode</option>
         </select>

         <div className="flex space-x-3">
            <button 
                onClick={onResetHint}
                disabled={hintLevel === 0 || isLoading}
                className="text-xs font-semibold tracking-wider px-4 py-2 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white border border-gray-700 rounded-lg transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
                Reset ({hintLevel})
            </button>
            <button 
                onClick={onGetHint}
                disabled={hintLevel >= 3 || isLoading}
                className="text-xs px-4 py-2 text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 hover:border-yellow-500/40 rounded-lg transition-all disabled:opacity-30 font-bold shadow-[0_0_10px_rgba(234,179,8,0.1)] hover:shadow-[0_0_15px_rgba(234,179,8,0.2)] flex items-center gap-1.5 uppercase tracking-wider"
            >
                {hintLevel >= 3 ? 'Max Hint' : '💡 Extract Hint'}
            </button>
         </div>
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="flex relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Initiate prompt sequence... (Shift+Enter for multi-line)"
          className="w-full text-gray-200 border border-gray-700 bg-gray-950 p-4 pr-24 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm h-16 shadow-inner placeholder-gray-600 font-mono"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="absolute right-2 bottom-2 top-2 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wider uppercase text-xs rounded-lg flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          Send <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </form>
    </div>
  )
}
