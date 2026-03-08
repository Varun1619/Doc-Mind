// ── Text chunking ──────────────────────────────────────────────────────────
export function chunkText(text, size = 400, overlap = 60) {
  const words = text.split(/\s+/)
  const chunks = []
  let i = 0
  while (i < words.length) {
    const chunk = words.slice(i, i + size).join(' ')
    if (chunk.trim().length > 30) chunks.push(chunk)
    i += size - overlap
  }
  return chunks
}

// ── PDF text extraction via pdf.js CDN ────────────────────────────────────
export async function extractText(file) {
  if (file.name.endsWith('.txt') || file.type === 'text/plain') {
    return file.text()
  }

  if (file.name.endsWith('.pdf') || file.type === 'application/pdf') {
    if (!window.pdfjsLib) {
      await new Promise((res, rej) => {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
        s.onload = res
        s.onerror = rej
        document.head.appendChild(s)
      })
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
    }
    const buf = await file.arrayBuffer()
    const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise
    let text = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      text += content.items.map(it => it.str).join(' ') + '\n'
    }
    return text
  }

  return file.text()
}

// ── Cosine similarity ──────────────────────────────────────────────────────
export function cosineSim(a, b) {
  let dot = 0, mA = 0, mB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    mA  += a[i] * a[i]
    mB  += b[i] * b[i]
  }
  return dot / (Math.sqrt(mA) * Math.sqrt(mB) + 1e-10)
}

// ── Gemini embedding ───────────────────────────────────────────────────────
export async function getGeminiEmbedding(text, apiKey) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: { parts: [{ text }] },
      }),
    }
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || 'Gemini embedding request failed')
  }
  const data = await res.json()
  return data.embedding.values
}

// ── Claude answer via Anthropic API ───────────────────────────────────────
export async function getClaudeAnswer(messages, context) {
  const systemPrompt = `You are a precise document assistant. Answer questions strictly based on the document context below.

Rules:
- Answer only from the provided context
- If the answer is not in the context, say: "I couldn't find this in your documents"
- Be concise, accurate, and cite which document the info comes from
- Do not hallucinate or infer beyond the context

RETRIEVED DOCUMENT CONTEXT:
${context}`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.content?.map(b => b.text || '').join('') || 'No response generated.'
}
