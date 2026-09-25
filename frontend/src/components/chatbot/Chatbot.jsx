import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react'
import './Chatbot.css'

// Calls our own backend — Groq key stays safely on the server
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat`

const INITIAL_MESSAGES = [
  {
    role: 'assistant',
    content: "Hi! I'm the AI-Solutions assistant. Ask me anything about our services, past work, or how we can help your organisation.",
  },
]

export default function Chatbot() {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const bottomRef   = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) textareaRef.current?.focus()
  }, [open])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send full conversation so backend can maintain context
        body: JSON.stringify({ messages: updated }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Server error')

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      console.error('Chatbot error:', err)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please use our Contact Us form for enquiries.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <button
        className={`chatbot__fab${open ? ' chatbot__fab--open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? <X size={21} /> : <MessageCircle size={21} />}
      </button>

      {open && (
        <div className="chatbot__window" role="dialog" aria-label="AI-Solutions chat assistant">
          {/* Header */}
          <div className="chatbot__header">
            <div className="chatbot__header-left">
              <div className="chatbot__avatar"><Bot size={15} /></div>
              <div>
                <p className="chatbot__name">AI-Solutions Assistant</p>
                <p className="chatbot__status">
                  <span className="chatbot__dot" />
                  Online
                </p>
              </div>
            </div>
            <button className="chatbot__close" onClick={() => setOpen(false)} aria-label="Close">
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot__messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot__row chatbot__row--${msg.role}`}>
                <div className="chatbot__bubble">
                  {msg.role === 'assistant'
                    ? <Bot  size={12} className="chatbot__icon" />
                    : <User size={12} className="chatbot__icon" />}
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="chatbot__row chatbot__row--assistant">
                <div className="chatbot__bubble chatbot__bubble--typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="chatbot__footer">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about our services…"
              rows={1}
              className="chatbot__textarea"
            />
            <button
              className="chatbot__send"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              {loading
                ? <Loader2 size={15} className="chatbot__spin" />
                : <Send size={15} />}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
