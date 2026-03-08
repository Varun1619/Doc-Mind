import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen, Zap, Shield, Search, MessageSquare,
  FileText, ChevronRight, ArrowRight,
} from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Button } from '../components/ui/Button.jsx'
import { ShootingStars } from '../components/ui/ShootingStars.jsx'
import { useTheme } from '../lib/ThemeContext.jsx'

// ── Gradient text — injected as real CSS class (theme-toggle proof) ────────
const GRAD_STYLE_ID = 'docmind-grad-style'
function injectGradStyle(accent, accent2) {
  let el = document.getElementById(GRAD_STYLE_ID)
  if (!el) { el = document.createElement('style'); el.id = GRAD_STYLE_ID; document.head.appendChild(el) }
  el.textContent = `
    .hero-grad-text {
      display: inline-block;
      background: linear-gradient(135deg, ${accent}, ${accent2}, #f97316);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
      animation: gradShift 4s ease infinite;
    }
  `
}

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
      opacity:   visible[id] ? 1 : 0,
      transform: visible[id] ? 'translateY(0)' : 'translateY(26px)',
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    },
  })
}

// ── Card — clean dark card, no animation ─────────────────────────────────
function MeteorCard({ children, style = {} }) {
  return (
    <div className="meteor-card" style={style}>
      {children}
    </div>
  )
}

// ── Data ───────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: <Search size={20} />,        title: 'Semantic Search',    desc: 'Gemini text-embedding-004 converts your docs into 1,536-dim vectors. Find the right passage even when words differ.' },
  { icon: <Zap size={20} />,           title: 'Real-time Indexing', desc: 'Upload a file and it is chunked, embedded, and fully searchable within seconds.' },
  { icon: <MessageSquare size={20} />, title: 'Grounded Answers',   desc: 'Claude Sonnet answers strictly from retrieved context. No hallucination — if the answer is not there, it says so.' },
  { icon: <Shield size={20} />,        title: 'Private by Default', desc: 'Documents are processed in your browser. Nothing is sent to external servers except the query and chunks.' },
  { icon: <FileText size={20} />,      title: 'Multi-doc Support',  desc: 'Index multiple files simultaneously and ask questions that span your entire corpus.' },
  { icon: <BookOpen size={20} />,      title: 'Source Attribution', desc: 'Every answer shows which document and chunk it came from with a similarity score.' },
]

const STEPS = [
  { n: '01', icon: <FileText size={18} />,      title: 'Upload your docs',      desc: 'Drop any PDF or TXT file. Multiple files supported at once.' },
  { n: '02', icon: <Zap size={18} />,           title: 'Gemini indexes them',   desc: 'Each doc is chunked and embedded via text-embedding-004 into 1,536-dim vectors.' },
  { n: '03', icon: <Search size={18} />,        title: 'Ask a question',        desc: 'Your query is embedded. Cosine similarity finds the most relevant chunks.' },
  { n: '04', icon: <MessageSquare size={18} />, title: 'Get a grounded answer', desc: 'Top chunks are passed to Claude Sonnet which answers strictly from context.' },
]

const STACK = [
  { name: 'Gemini text-embedding-004', role: 'Embeddings',    badge: 'Free',        dot: '#4285f4' },
  { name: 'Claude Sonnet 4',           role: 'Language Model',badge: 'Included',    dot: '#c96442' },
  { name: 'pdf.js by Mozilla',         role: 'PDF Parsing',   badge: 'Open Source', dot: '#22c55e' },
  { name: 'Cosine Similarity',         role: 'Vector Search', badge: 'In-browser',  dot: '#a78bfa' },
  { name: 'React + Vite',              role: 'Frontend',      badge: 'Open Source', dot: '#61dafb' },
  { name: 'In-memory Store',           role: 'Vector DB',     badge: 'No backend',  dot: '#f59e0b' },
]

const FAQS = [
  { q: 'Is it really free?',             a: 'Yes. Gemini text-embedding-004 has a free tier of 1,500 requests/minute with no credit card required. The Claude API is wired into this environment. For your own deployment, Groq offers a free LLM tier.' },
  { q: 'Where are my documents stored?', a: 'Nowhere permanently. Documents are parsed and embedded in your browser tab. Vectors live in JavaScript memory — closing the tab clears everything. Nothing is sent to any database.' },
  { q: 'What file types are supported?', a: 'PDF and plain text (.txt). PDF extraction is handled by Mozilla pdf.js running locally in your browser.' },
  { q: 'How accurate is the retrieval?', a: "Gemini's embeddings understand synonyms and paraphrases, not just keyword matches. Accuracy depends on document quality and chunk size configuration." },
  { q: 'Can I use this in production?',  a: "The current version is a client-side prototype. For production you'd add a backend for secure API keys and a vector DB like Supabase pgvector for persistent storage." },
]

// ── Animated GitHub Button ─────────────────────────────────────────────────
function GitHubButton({ href }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center',
          width: 42, height: 42, borderRadius: hovered ? '50%' : '10px',
          background: hovered ? 'linear-gradient(135deg,#7f1d1d,#450a0a)' : 'linear-gradient(135deg,#1f2937,#111827)',
          color: '#fff', border: 'none', cursor: 'pointer',
          transform: hovered ? 'translateY(10px)' : 'translateY(0)',
          transition: 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)',
          boxShadow: hovered ? '0 0 24px rgba(239,68,68,0.5)' : '0 4px 16px rgba(0,0,0,0.4)',
          overflow: 'visible',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 15 15" style={{ width: 18, height: 18, flexShrink: 0 }}>
          <path clipRule="evenodd" fillRule="evenodd" fill="currentColor"
            d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
          />
        </svg>
        <span style={{
          position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)',
          fontSize: 12, fontWeight: 600, color: '#fca5a5',
          opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease 0.15s',
          whiteSpace: 'nowrap', pointerEvents: 'none',
          fontFamily: "'Cabinet Grotesk',system-ui,sans-serif",
          letterSpacing: '-0.01em', textShadow: '0 1px 4px rgba(0,0,0,0.6)',
        }}>GitHub</span>
      </button>
    </a>
  )
}

// ── Landing ────────────────────────────────────────────────────────────────
export default function Landing() {
  const { t } = useTheme()
  const navigate = useNavigate()
  const reveal   = useReveal()
  const [faqOpen, setFaqOpen] = useState(null)

  useEffect(() => {
    injectGradStyle(t.accent, t.accent2)
    // Sync CSS variables for .meteor-card with current theme
    const root = document.documentElement
    root.style.setProperty('--card-bg',           t.surface)
    root.style.setProperty('--card-border',       t.accentBorder)
    root.style.setProperty('--card-border-hover', t.border2)
  }, [t])

  return (
    <div style={{ background: t.bg, color: t.text, minHeight: '100vh', transition: 'background 0.3s,color 0.3s' }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '110px 20px 80px', background: t.bg }}>

        {/* Starfield */}
        <div className="starfield" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

        {/* Radial centre glow */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'radial-gradient(ellipse at center, rgba(255,100,100,0.05) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />

        {/* Three red shooting star layers */}
        <ShootingStars starColor="#ef4444" trailColor="#f97316" minSpeed={15} maxSpeed={35} minDelay={1000} maxDelay={3000} />
        <ShootingStars starColor="#dc2626" trailColor="#fca5a5" minSpeed={10} maxSpeed={25} minDelay={2000} maxDelay={4500} />
        <ShootingStars starColor="#fca5a5" trailColor="#fb923c" minSpeed={18} maxSpeed={38} minDelay={1500} maxDelay={3500} />

        {/* Floating doc chips */}
        <div className="hide-mobile" style={{ position: 'absolute', top: '20%', right: '4%', zIndex: 2, animation: 'float1 6s ease-in-out infinite', display: 'flex', flexDirection: 'column', gap: 7, opacity: 0.8 }}>
          {['quarterly_report.pdf', 'architecture.txt', 'research_v2.pdf'].map((name, i) => (
            <div key={i} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 9, padding: '7px 13px', display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, fontWeight: 600, color: t.text2, backdropFilter: 'blur(12px)', whiteSpace: 'nowrap' }}>
              <FileText size={12} color={t.accent} />{name}
            </div>
          ))}
        </div>

        <div className="hide-mobile" style={{ position: 'absolute', bottom: '22%', left: '3%', zIndex: 2, animation: 'float2 7s ease-in-out infinite 1.2s', opacity: 0.75 }}>
          <div style={{ background: t.surface, border: `1px solid ${t.accentBorder}`, borderRadius: 12, padding: '12px 15px', fontSize: 12, maxWidth: 190, backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: t.accent, fontWeight: 700, marginBottom: 5 }}>
              <Search size={12} /> Semantic match
            </div>
            <div style={{ fontSize: 10.5, color: t.text3, lineHeight: 1.6 }}>"How does auth work?" → 94.2% in architecture.txt</div>
          </div>
        </div>

        {/* Hero content */}
        <div style={{ maxWidth: 720, textAlign: 'center', position: 'relative', zIndex: 3 }}>
          <div className="fade-up-1">
            <Badge color="accent" style={{ marginBottom: 26 }}>
              <Zap size={11} /> Gemini Embeddings · Claude Sonnet
            </Badge>
          </div>

          <h1 className="cab fade-up-2" style={{ fontWeight: 900, fontSize: 'clamp(38px,6.5vw,72px)', lineHeight: 1.06, letterSpacing: '-0.04em', color: t.text, marginBottom: 22 }}>
            Ask anything.{' '}
            <span className="serif hero-grad-text" style={{ fontStyle: 'italic' }}>
              From your docs.
            </span>
          </h1>

          <p className="fade-up-3" style={{ fontSize: 'clamp(15px,2vw,17.5px)', color: t.text2, lineHeight: 1.78, maxWidth: 520, margin: '0 auto 36px' }}>
            Upload PDFs and text files. DocMind indexes them with real semantic embeddings,
            then answers natural language questions — strictly from your content.
          </p>

          <div className="fade-up-4" style={{ display: 'flex', gap: 11, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button variant="primary" onClick={() => navigate('/app')}>
              Start for free <ArrowRight size={16} />
            </Button>
            <GitHubButton href="https://github.com/Varun1619/Doc-Mind" />
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

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: '100px 20px', background: t.bg2 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div {...reveal('feat-head')} style={{ textAlign: 'center', marginBottom: 52, ...reveal('feat-head').style }}>
            <Badge color="accent" style={{ marginBottom: 14 }}>Features</Badge>
            <h2 className="cab" style={{ fontWeight: 900, fontSize: 'clamp(26px,3.8vw,42px)', letterSpacing: '-0.035em', color: t.text, marginBottom: 12 }}>
              Everything for{' '}
              <span className="serif" style={{ fontStyle: 'italic', color: t.accent }}>document intelligence</span>
            </h2>
            <p style={{ fontSize: 15.5, color: t.text2, maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>
              Built on free, open APIs. No vendor lock-in. Own your data completely.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 18 }}>
            {FEATURES.map((f, i) => (
              <div key={i} {...reveal(`feat-${i}`, i * 0.07)} style={{ ...reveal(`feat-${i}`, i * 0.07).style }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #ef4444, #f97316)', transform: 'scale(0.78)', borderRadius: '50%', filter: 'blur(48px)', opacity: 0.2, pointerEvents: 'none' }} />
                  <MeteorCard style={{ padding: '26px 24px' }} count={10}>
                    <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171', marginBottom: 14 }}>{f.icon}</div>
                    <h3 className="cab" style={{ fontWeight: 700, fontSize: 15.5, letterSpacing: '-0.02em', color: t.text, marginBottom: 7 }}>{f.title}</h3>
                    <p style={{ fontSize: 13.5, color: t.text2, lineHeight: 1.72 }}>{f.desc}</p>
                  </MeteorCard>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '100px 20px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div {...reveal('how-head')} style={{ textAlign: 'center', marginBottom: 52, ...reveal('how-head').style }}>
            <Badge color="accent" style={{ marginBottom: 14 }}>How it Works</Badge>
            <h2 className="cab" style={{ fontWeight: 900, fontSize: 'clamp(26px,3.8vw,42px)', letterSpacing: '-0.035em', color: t.text }}>
              Upload to answer{' '}
              <span className="serif" style={{ fontStyle: 'italic', color: t.accent }}>in seconds</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
            {STEPS.map((s, i) => (
              <div key={i} {...reveal(`step-${i}`, i * 0.1)} style={{ ...reveal(`step-${i}`, i * 0.1).style }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #dc2626, #b91c1c)', transform: 'scale(0.78)', borderRadius: '50%', filter: 'blur(40px)', opacity: 0.18, pointerEvents: 'none' }} />
                  <MeteorCard style={{ padding: 24 }} count={8}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fca5a5' }}>{s.icon}</div>
                      <span className="mono" style={{ fontSize: 11, color: t.text3, fontWeight: 600 }}>{s.n}</span>
                    </div>
                    <h3 className="cab" style={{ fontWeight: 700, fontSize: 15, color: t.text, marginBottom: 7, letterSpacing: '-0.02em' }}>{s.title}</h3>
                    <p style={{ fontSize: 13, color: t.text2, lineHeight: 1.7 }}>{s.desc}</p>
                  </MeteorCard>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STACK ────────────────────────────────────────────────────────── */}
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
              <div key={i} {...reveal(`stack-${i}`, i * 0.06)} style={{ ...reveal(`stack-${i}`, i * 0.06).style }}>
                <MeteorCard style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, borderRadius: 13 }} count={6}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.dot, flexShrink: 0, boxShadow: `0 0 8px ${item.dot}` }} />
                  <div style={{ flex: 1 }}>
                    <div className="cab" style={{ fontWeight: 700, fontSize: 13.5, color: t.text, letterSpacing: '-0.01em' }}>{item.name}</div>
                    <div style={{ fontSize: 11.5, color: t.text2, marginTop: 2 }}>{item.role}</div>
                  </div>
                  <span className="cab" style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', whiteSpace: 'nowrap' }}>{item.badge}</span>
                </MeteorCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div {...reveal('faq-head')} style={{ textAlign: 'center', marginBottom: 44, ...reveal('faq-head').style }}>
            <Badge color="accent" style={{ marginBottom: 14 }}>FAQ</Badge>
            <h2 className="cab" style={{ fontWeight: 900, fontSize: 'clamp(24px,3.5vw,38px)', letterSpacing: '-0.035em', color: t.text }}>Common questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {FAQS.map((item, i) => (
              <div key={i} {...reveal(`faq-${i}`, i * 0.07)} style={{ ...reveal(`faq-${i}`, i * 0.07).style }}>
                <MeteorCard style={{ borderRadius: 13, overflow: 'hidden' }} count={6}>
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
                </MeteorCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section style={{ padding: '60px 20px 80px' }}>
        <div {...reveal('cta')} style={{ maxWidth: 800, margin: '0 auto', ...reveal('cta').style, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,#ef4444,#f97316)', transform: 'scale(0.82)', borderRadius: '50%', filter: 'blur(64px)', opacity: 0.18, pointerEvents: 'none' }} />
          <MeteorCard style={{ padding: '56px 36px', textAlign: 'center', borderRadius: 24 }} count={20}>
            <Badge color="accent" style={{ marginBottom: 18 }}><Zap size={11} /> Free forever</Badge>
            <h2 className="cab" style={{ fontWeight: 900, fontSize: 'clamp(24px,3.8vw,40px)', letterSpacing: '-0.04em', color: t.text, marginBottom: 12 }}>
              Start asking your{' '}
              <span className="serif" style={{ fontStyle: 'italic', color: '#f87171' }}>documents questions</span>
            </h2>
            <p style={{ fontSize: 15, color: t.text2, marginBottom: 30, lineHeight: 1.7 }}>No signup. No credit card. Upload a file and go.</p>
            <Button variant="primary" onClick={() => navigate('/app')} style={{ fontSize: 15, padding: '13px 30px' }}>
              Open DocMind <ArrowRight size={16} />
            </Button>
          </MeteorCard>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
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
