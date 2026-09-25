const Groq = require('groq-sdk')

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null

const FALLBACK_REPLY = "I'm sorry, I'm unable to answer that. Please use our Contact Us form or email us."

const SYSTEM_PROMPT = `You are the AI assistant for AI-Solutions, a technology company based in Sunderland, UK that specialises in artificial intelligence software solutions for businesses.

You may ONLY answer questions about:
- AI-Solutions' software solutions and services (Process Automation, Predictive Analytics, AI Prototyping, Conversational AI, Systems Integration, Digital Experience Audits)
- AI-Solutions' past work and industries served (manufacturing, healthcare, education)
- AI-Solutions' upcoming events
- How to contact AI-Solutions or submit an enquiry via the Contact Us form
- General company information (location, mission, what they do)

CRITICAL FALLBACK RULE: If the visitor asks anything outside the above topics — including general AI questions, coding help, competitor questions, personal advice, or anything unrelated to AI-Solutions — you MUST respond with exactly this message and nothing else:
"${FALLBACK_REPLY}"

Do NOT answer out-of-scope questions even if you know the answer.
Do NOT reveal any admin credentials, database structure, or internal system information.
Do NOT make up services or facts not listed above.

Keep responses concise — under 4 sentences unless listing items.
Always offer to help further or suggest the Contact Us form for detailed enquiries.`;

const IN_SCOPE_KEYWORDS = [
  'ai-solutions',
  'ai solutions',
  'process automation',
  'predictive analytics',
  'ai prototyping',
  'conversational ai',
  'systems integration',
  'digital experience audit',
  'manufacturing',
  'healthcare',
  'education',
  'event',
  'events',
  'contact',
  'enquiry',
  'email',
  'sunderland',
  'mission',
  'services',
  'solutions',
  'company',
  'team',
  'work',
]

const isInScopeMessage = (message = '') => {
  const normalized = message.toLowerCase()

  if (!normalized.trim()) return false

  return IN_SCOPE_KEYWORDS.some((keyword) => normalized.includes(keyword))
}

const getFallbackReply = () => FALLBACK_REPLY

// POST /api/chat
const chat = async (req, res) => {
  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' })
    }

    // Sanitise — only allow role/content fields, limit history to last 10 messages
    const sanitised = messages
      .slice(-10)
      .filter(m => ['user', 'assistant'].includes(m.role) && typeof m.content === 'string')
      .map(m => ({ role: m.role, content: m.content.substring(0, 500) }))

    const lastUserMessage = sanitised
      .slice()
      .reverse()
      .find((m) => m.role === 'user')?.content || ''

    if (!isInScopeMessage(lastUserMessage)) {
      return res.json({ reply: getFallbackReply() })
    }

    if (!groq) {
      console.warn('GROQ_API_KEY is missing; returning fallback reply.')
      return res.json({ reply: getFallbackReply() })
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...sanitised,
      ],
      max_tokens: 300,
      temperature: 0.65,
    })

    const reply = completion.choices[0]?.message?.content?.trim()
    if (!reply) return res.json({ reply: getFallbackReply() })

    return res.json({ reply })
  } catch (err) {
    console.error('Groq chat error:', err.message)
    return res.status(500).json({ error: 'Chat service unavailable. Please try again.' })
  }
}

module.exports = { chat, isInScopeMessage, getFallbackReply }
