'use client'

import { useState } from 'react'
import { MOCK_MESSAGES, WorkerMessage } from '@/lib/mock-worker'

function fmt(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diffDays === 0) return d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return 'Yesterday'
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })
}

function fmtFull(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<WorkerMessage[]>(MOCK_MESSAGES)
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_MESSAGES[0]?.id ?? null)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)

  const selected = messages.find(m => m.id === selectedId) ?? null

  function selectThread(id: string) {
    setSelectedId(id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, unread: false } : m))
  }

  function sendReply() {
    if (!reply.trim() || !selectedId) return
    setSending(true)
    setTimeout(() => {
      setMessages(prev => prev.map(m => {
        if (m.id !== selectedId) return m
        return {
          ...m,
          last_message: reply.trim(),
          last_message_at: new Date().toISOString(),
          thread: [...m.thread, { from: 'me' as const, text: reply.trim(), at: new Date().toISOString() }],
        }
      }))
      setReply('')
      setSending(false)
    }, 600)
  }

  const totalUnread = messages.filter(m => m.unread).length

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {totalUnread > 0 ? `${totalUnread} unread` : 'All caught up'}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex" style={{ minHeight: 'min(520px, 70vh)' }}>
        {/* Thread list */}
        <div className={`w-full lg:w-72 shrink-0 border-r border-gray-100 flex flex-col ${selected && 'hidden lg:flex'}`}>
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {messages.map(m => (
              <button key={m.id} onClick={() => selectThread(m.id)}
                className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition ${
                  selectedId === m.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}>
                <div className={`w-10 h-10 rounded-full ${m.avatar_color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {m.avatar_initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-sm truncate ${m.unread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {m.employer_name}
                    </p>
                    <span className="text-[10px] text-gray-400 shrink-0">{fmt(m.last_message_at)}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{m.job_title}</p>
                  <p className={`text-xs truncate mt-0.5 ${m.unread ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                    {m.last_message}
                  </p>
                </div>
                {m.unread && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* Thread detail */}
        {selected ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Thread header */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
              <button onClick={() => setSelectedId(null)}
                className="lg:hidden text-gray-400 hover:text-gray-600 mr-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className={`w-9 h-9 rounded-full ${selected.avatar_color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                {selected.avatar_initials}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{selected.employer_name}</p>
                <p className="text-xs text-gray-400">{selected.job_title}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {selected.thread.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    msg.from === 'me'
                      ? 'bg-gray-900 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.from === 'me' ? 'text-gray-200' : 'text-gray-400'}`}>
                      {fmtFull(msg.at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply box */}
            <div className="border-t border-gray-100 px-4 py-3 flex items-end gap-3">
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply() } }}
                rows={2}
                placeholder="Type a reply... (Enter to send)"
                className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder:text-gray-400"
              />
              <button onClick={sendReply} disabled={!reply.trim() || sending}
                className="bg-gray-900 hover:bg-gray-800 disabled:opacity-40 text-white p-2.5 rounded-xl transition shrink-0">
                {sending ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="font-medium">Select a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
