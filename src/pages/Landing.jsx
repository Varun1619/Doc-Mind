import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen, Zap, Shield, Search, MessageSquare,
  FileText, ChevronRight, ArrowRight,
} from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Button } from '../components/ui/Button.jsx'
import { useTheme } from '../lib/ThemeContext.jsx'

// ── Scroll-reveal hook ─────────────────────────────────────────────────────
function useReveal() {
  const [visible, setVisible] = useState({})
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setVisible(v => ({ ...v, [e.target.dataset.reveal]: true }))
      }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
  return (id, delay = 0) => ({
    'data-reveal': id,
    style: {
      opacity:    visible[id] ? 1 : 0,
      transform:  visible[id] ? 'translateY(0)' : 'translateY(26px)',
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    },
  })
}

// ── Data ───────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: <Search size={20} />,       title: 'Semantic Search',    desc: 'Gemini text-embedding-004 converts your docs into 1,536-dim vectors. Find the right passage even when words differ.' },
  { icon: <Zap size={20} />,          title: 'Real-time Indexing', desc: 'Upload a file and it is chunked, embedded, and fully searchable within seconds.' },
  { icon: <MessageSquare size={20} />,title: 'Grounded Answers',   desc: 'Claude Sonnet answers strictly from retrieved context. No hallucination — if the answer is not there, it says so.' },
  { icon: <Shield size={20} />,       title: 'Private by Default', desc: 'Documents are processed in your browser. Nothing is sent to external servers except the query and chunks.' },
  { icon: <FileText size={20} />,     title: 'Multi-doc Support',  desc: 'Index multiple files simultaneously and ask questions that span your entire corpus.' },
  { icon: <BookOpen size={20} />,     title: 'Source Attribution', desc: 'Every answer shows which document and chunk it came from with a similarity score.' },
]

const STEPS = [
  { n: '01', icon: <FileText size={18} />, title: 'Upload your docs',    desc: 'Drop any PDF or TXT file. Multiple files supported at once.' },
  { n: '02', icon: <Zap size={18} />,      title: 'Gemini indexes them', desc: 'Each doc is chunked and embedded via text-embedding-004 into 1,536-dim vectors.' },
  { n: '03', icon: <Search size={18} />,   title: 'Ask a question',      desc: 'Your query is embedded. Cosine similarity finds the most relevant chunks.' },
  { n: '04', icon: <MessageSquare size={18} />, title: 'Get a grounded answer', desc: 'Top chunks are passed to Claude Sonnet which answers strictly from context.' },
]

const STACK = [
  { name: 'Gemini text-embedding-004', role: 'Embeddings',    badge: 'Free',       dot: '#4285f4' },
  { name: 'Claude Sonnet 4',           role: 'Language Model',badge: 'Included',   dot: '#c96442' },
  { name: 'pdf.js by Mozilla',         role: 'PDF Parsing',   badge: 'Open Source',dot: '#22c55e' },
  { name: 'Cosine Similarity',         role: 'Vector Search', badge: 'In-browser', dot: '#a78bfa' },
  { name: 'React + Vite',              role: 'Frontend',      badge: 'Open Source',dot: '#61dafb' },
  { name: 'In-memory Store',           role: 'Vector DB',     badge: 'No backend', dot: '#f59e0b' },
]

const FAQS = [
  { q: 'Is it really free?',                  a: 'Yes. Gemini text-embedding-004 has a free tier of 1,500 requests/minute with no credit card required. The Claude API is wired into this environment. For your own deployment, Groq offers a free LLM tier.' },
  { q: 'Where are my documents stored?',      a: 'Nowhere permanently. Documents are parsed and embedded in your browser tab. Vectors live in JavaScript memory — closing the tab clears everything. Nothing is sent to any database.' },
  { q: 'What file types are supported?',      a: 'PDF and plain text (.txt). PDF extraction is handled by Mozilla pdf.js running locally in your browser.' },
  { q: 'How accurate is the retrieval?',      a: "Gemini's embeddings understand synonyms and paraphrases, not just keyword matches. Accuracy depends on document quality and chunk size configuration." },
  { q: 'Can I use this in production?',       a: "The current version is a client-side prototype. For production you'd add a backend for secure API keys and a vector DB like Supabase pgvector for persistent storage." },
]

// ── Landing page ───────────────────────────────────────────────────────────
export default function Landing() {
  const { t } = useTheme()
  const navigate = useNavigate()
  const reveal = useReveal()
  const [faqOpen, setFaqOpen] = useState(null)

  return (
    <div style={{ background: t.bg, color: t.text, minHeight: '100vh', transition: 'background 0.3s, color 0.3s' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '110px 20px 80px' }}>

        {/* Grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${t.border} 1px,transparent 1px),linear-gradient(90deg,${t.border} 1px,transparent 1px)`, backgroundSize: '52px 52px', opacity: 0.45, pointerEvents: 'none' }} />

        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '12%', left: '8%', width: 520, height: 520, borderRadius: '50%', background: `radial-gradient(circle,${t.glow} 0%,transparent 70%)`, pointerEvents: 'none', animation: 'pulseGlow 7s ease infinite' }} />
        <div style={{ position: 'absolute', bottom: '8%', right: '5%', width: 380, height: 380, borderRadius: '50%', background: `radial-gradient(circle,${t.glow} 0%,transparent 70%)`, pointerEvents: 'none', animation: 'pulseGlow 9s ease infinite 2.5s' }} />

        {/* Floating doc chips */}
        <div className="hide-mobile" style={{ position: 'absolute', top: '20%', right: '4%', animation: 'float1 6s ease-in-out infinite', display: 'flex', flexDirection: 'column', gap: 7, opacity: 0.75 }}>
          {['quarterly_report.pdf', 'architecture.txt', 'research_v2.pdf'].map((name, i) => (
            <div key={i} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 9, padding: '7px 13px', display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, fontWeight: 600, color: t.text2, backdropFilter: 'blur(8px)', whiteSpace: 'nowrap' }}>
              <FileText size={12} color={t.accent} />{name}
            </div>
          ))}
        </div>

        <div className="hide-mobile" style={{ position: 'absolute', bottom: '22%', left: '3%', animation: 'float2 7s ease-in-out infinite 1.2s', opacity: 0.65 }}>
          <div style={{ background: t.surface, border: `1px solid ${t.accentBorder}`, borderRadius: 12, padding: '12px 15px', fontSize: 12, maxWidth: 190, backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: t.accent, fontWeight: 700, marginBottom: 5 }}>
              <Search size={12} /> Semantic match
            </div>
            <div style={{ fontSize: 10.5, color: t.text3, lineHeight: 1.6 }}>"How does auth work?" → 94.2% in architecture.txt</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 720, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="fade-up-1">
            <Badge color="accent" style={{ marginBottom: 26 }}>
              <Zap size={11} /> Gemini Embeddings · Claude Sonnet
            </Badge>
          </div>

          <h1 className="cab fade-up-2" style={{ fontWeight: 900, fontSize: 'clamp(38px,6.5vw,72px)', lineHeight: 1.06, letterSpacing: '-0.04em', color: t.text, marginBottom: 22 }}>
            Ask anything.{' '}
            <span className="serif" style={{ fontStyle: 'italic', background: `linear-gradient(135deg,${t.accent},${t.accent2},#818cf8)`, backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'gradShift 4s ease infinite' }}>
              From your docs.
            </span>
          </h1>

          <p className="fade-up-3" style={{ fontSize: 'clamp(15px,2vw,17.5px)', color: t.text2, lineHeight: 1.78, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
            Upload PDFs and text files. DocMind indexes them with real semantic embeddings, then answers natural language questions — strictly from your content.
          </p>

          <div className="fade-up-4" style={{ display: 'flex', gap: 11, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="primary" onClick={() => navigate('/app')}>
              Start for free <ArrowRight size={16} />
            </Button>
            <Button variant="ghost">
              View on GitHub
            </Button>
          </div>

          <div className="fade-up-5" style={{ display: 'flex', gap: 36, justifyContent: 'center', marginTop: 54 }}>
            {[['100%', 'Free to use'], ['1,536', 'Embedding dims'], ['Zero', 'Data stored']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div className="cab" style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.04em', color: t.text }}>{val}</div>
                <div style={{ fontSize: 10.5, color: t.text3, marginTop: 2, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '100px 20px', background: t.bg2 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div {...reveal('feat-head')} style={{ textAlign: 'center', marginBottom: 52, ...reveal('feat-head').style }}>
            <Badge color="accent" style={{ marginBottom: 14 }}>Features</Badge>
            <h2 className="cab" style={{ fontWeight: 900, fontSize: 'clamp(26px,3.8vw,42px)', letterSpacing: '-0.035em', color: t.text, marginBottom: 12 }}>
              Everything for{' '}
              <span className="serif" style={{ fontStyle: 'italic', color: t.accent }}>document intelligence</span>
            </h2>
            <p style={{ fontSize: 15.5, color: t.text2, maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>Built on free, open APIs. No vendor lock-in. Own your data completely.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={i} {...reveal(`feat-${i}`, i * 0.07)} style={{
                background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18,
                padding: '26px 24px', transition: 'all 0.25s', position: 'relative', overflow: 'hidden',
                ...reveal(`feat-${i}`, i * 0.07).style,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.border2; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${t.glow}` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border;  e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 11, background: t.accentBg, border: `1px solid ${t.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.accent, marginBottom: 14 }}>{f.icon}</div>
                <h3 className="cab" style={{ fontWeight: 700, fontSize: 15.5, letterSpacing: '-0.02em', color: t.text, marginBottom: 7 }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, color: t.text2, lineHeight: 1.72 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '100px 20px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div {...reveal('how-head')} style={{ textAlign: 'center', marginBottom: 52, ...reveal('how-head').style }}>
            <Badge color="accent" style={{ marginBottom: 14 }}>How it Works</Badge>
            <h2 className="cab" style={{ fontWeight: 900, fontSize: 'clamp(26px,3.8vw,42px)', letterSpacing: '-0.035em', color: t.text }}>
              Upload to answer{' '}
              <span className="serif" style={{ fontStyle: 'italic', color: t.accent }}>in seconds</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
            {STEPS.map((s, i) => (
              <div key={i} {...reveal(`step-${i}`, i * 0.1)} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24, transition: 'all 0.2s', ...reveal(`step-${i}`, i * 0.1).style }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.accentBorder; e.currentTarget.style.boxShadow = `0 8px 24px ${t.glow}` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border;       e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: t.accentBg, border: `1px solid ${t.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.accent }}>{s.icon}</div>
                  <span className="mono" style={{ fontSize: 11, color: t.text3, fontWeight: 500 }}>{s.n}</span>
                </div>
                <h3 className="cab" style={{ fontWeight: 700, fontSize: 15, color: t.text, marginBottom: 7, letterSpacing: '-0.02em' }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STACK ── */}
      <section id="stack" style={{ padding: '80px 20px', background: t.bg2 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div {...reveal('stack-head')} style={{ textAlign: 'center', marginBottom: 46, ...reveal('stack-head').style }}>
            <Badge color="accent" style={{ marginBottom: 14 }}>Tech Stack</Badge>
            <h2 className="cab" style={{ fontWeight: 900, fontSize: 'clamp(24px,3.5vw,38px)', letterSpacing: '-0.035em', color: t.text }}>
              Built with{' '}
              <span className="serif" style={{ fontStyle: 'italic', color: t.accent }}>free tools only</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: 12 }}>
            {STACK.map((item, i) => (
              <div key={i} {...reveal(`stack-${i}`, i * 0.06)} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 13, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.18s', ...reveal(`stack-${i}`, i * 0.06).style }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.border2; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border;  e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.dot, flexShrink: 0, boxShadow: `0 0 8px ${item.dot}80` }} />
                <div style={{ flex: 1 }}>
                  <div className="cab" style={{ fontWeight: 700, fontSize: 13.5, color: t.text, letterSpacing: '-0.01em' }}>{item.name}</div>
                  <div style={{ fontSize: 11.5, color: t.text3, marginTop: 2 }}>{item.role}</div>
                </div>
                <Badge color="muted">{item.badge}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div {...reveal('faq-head')} style={{ textAlign: 'center', marginBottom: 44, ...reveal('faq-head').style }}>
            <Badge color="accent" style={{ marginBottom: 14 }}>FAQ</Badge>
            <h2 className="cab" style={{ fontWeight: 900, fontSize: 'clamp(24px,3.5vw,38px)', letterSpacing: '-0.035em', color: t.text }}>Common questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {FAQS.map((item, i) => (
              <div key={i} {...reveal(`faq-${i}`, i * 0.07)} style={{ background: t.surface, border: `1px solid ${faqOpen === i ? t.accentBorder : t.border}`, borderRadius: 13, overflow: 'hidden', transition: 'border-color 0.2s', ...reveal(`faq-${i}`, i * 0.07).style }}>
                <button
                  className="cab"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  style={{ width: '100%', padding: '17px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: t.text, fontFamily: "'Cabinet Grotesk',system-ui,sans-serif", fontSize: 14.5, fontWeight: 700, textAlign: 'left', letterSpacing: '-0.01em' }}
                >
                  {item.q}
                  <ChevronRight size={15} style={{ flexShrink: 0, transform: faqOpen === i ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', color: t.text3 }} />
                </button>
                {faqOpen === i && (
                  <div style={{ padding: '0 20px 16px', paddingTop: 14, fontSize: 13.5, color: t.text2, lineHeight: 1.75, borderTop: `1px solid ${t.border}`, animation: 'slideDown 0.18s ease' }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: '60px 20px 80px' }}>
        <div {...reveal('cta')} style={{ maxWidth: 800, margin: '0 auto', background: `linear-gradient(135deg,${t.accentBg},${t.surface})`, border: `1px solid ${t.accentBorder}`, borderRadius: 24, padding: '56px 36px', textAlign: 'center', position: 'relative', overflow: 'hidden', ...reveal('cta').style }}>
          <div style={{ position: 'absolute', top: -70, right: -70, width: 240, height: 240, borderRadius: '50%', background: `radial-gradient(circle,${t.glow} 0%,transparent 70%)`, pointerEvents: 'none' }} />
          <Badge color="accent" style={{ marginBottom: 18 }}><Zap size={11} /> Free forever</Badge>
          <h2 className="cab" style={{ fontWeight: 900, fontSize: 'clamp(24px,3.8vw,40px)', letterSpacing: '-0.04em', color: t.text, marginBottom: 12 }}>
            Start asking your{' '}
            <span className="serif" style={{ fontStyle: 'italic', color: t.accent }}>documents questions</span>
          </h2>
          <p style={{ fontSize: 15, color: t.text2, marginBottom: 30, lineHeight: 1.7 }}>No signup. No credit card. Upload a file and go.</p>
          <Button variant="primary" onClick={() => navigate('/app')} style={{ fontSize: 15, padding: '13px 30px' }}>
            Open DocMind <ArrowRight size={16} />
          </Button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${t.border}`, padding: '24px 20px', background: t.bg2 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><BookOpen size={13} /></div>
            <span className="cab" style={{ fontWeight: 800, fontSize: 13.5, color: t.text }}>DocMind</span>
            <span style={{ fontSize: 12, color: t.text3 }}>· Open source RAG assistant</span>
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            {['GitHub', 'Twitter', 'Docs'].map(l => (
              <button key={l} className="cab" style={{ fontSize: 12.5, color: t.text3, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = t.text}
                onMouseLeave={e => e.currentTarget.style.color = t.text3}>{l}</button>
            ))}
          </div>
          <div style={{ fontSize: 11.5, color: t.text3 }}>Built with Gemini + Claude · 100% free</div>
        </div>
      </footer>
    </div>
  )
}
