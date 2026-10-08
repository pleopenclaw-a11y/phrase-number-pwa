import { useMemo, useState } from 'react'
import { ArrowDownUp, Copy, Eye, EyeOff, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react'
import './style.css'

type Mode = 'letters' | 'syllables' | 'custom'

function countUnits(word: string, mode: Mode, custom: string) {
  if (mode === 'custom') {
    const chars = Array.from(custom).filter((char) => char.trim())
    if (!chars.length) return Array.from(word).filter((char) => char.trim()).length
    return Array.from(word).filter((char) => chars.includes(char)).length
  }
  if (mode === 'syllables') {
    const marks = /[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/u
    return Array.from(word).filter((char) => !marks.test(char)).length
  }
  return Array.from(word).filter((char) => char.trim()).length
}

function App() {
  const [phrase, setPhrase] = useState('')
  const [mode, setMode] = useState<Mode>('letters')
  const [custom, setCustom] = useState('')
  const [separator, setSeparator] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [copied, setCopied] = useState(false)

  const words = useMemo(() => phrase.trim().split(/\s+/u).filter(Boolean), [phrase])
  const digits = useMemo(() => words.map((word) => String(countUnits(word, mode, custom))), [words, mode, custom])
  const result = digits.join(separator)

  async function copy() {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  function clear() {
    setPhrase('')
    setShowResult(false)
    setCopied(false)
  }

  return (
    <main className="page">
      <div className="glow glow-one" /><div className="glow glow-two" />
      <div className="shell">
        <header className="topbar">
          <a className="brand" href="#top" aria-label="Phrase to Number home">
            <span className="brand-icon"><ArrowDownUp size={20} /></span>
            <span>phrase<span className="brand-accent">2</span>number</span>
          </a>
          <span className="local-pill"><span className="green-dot" /> LOCAL ONLY</span>
        </header>

        <section className="hero" id="top">
          <div className="eyebrow"><Sparkles size={14} /> YOUR WORDS, YOUR SECRET CODE</div>
          <h1>Words into<br /><span>numbers.</span></h1>
          <p className="subtitle">Turn a phrase you remember into a number<br className="desktop-break" /> only you can recreate.</p>
        </section>

        <section className="workspace" aria-label="Phrase converter">
          <label className="field-label" htmlFor="phrase">YOUR PRIVATE PHRASE <span>✳</span></label>
          <div className="input-wrap">
            <textarea id="phrase" value={phrase} onChange={(e) => { setPhrase(e.target.value); setShowResult(true) }} placeholder="Type a phrase only you would know..." rows={2} maxLength={240} autoComplete="off" spellCheck={false} />
            {phrase && <button className="clear-btn" onClick={clear} aria-label="Clear phrase"><RotateCcw size={16} /></button>}
          </div>
          <div className="privacy-note"><ShieldCheck size={14} /> Your phrase never leaves this device. No accounts. No storage.</div>

          <div className="settings-head"><span className="field-label">CONVERSION METHOD</span><span className="field-hint">Pick a rule you can remember</span></div>
          <div className="mode-grid" role="group" aria-label="Conversion method">
            <button className={`mode-card ${mode === 'letters' ? 'selected' : ''}`} onClick={() => { setMode('letters'); setShowResult(true) }}>
              <span className="mode-icon">Aa</span><span className="mode-copy"><b>Letter count</b><small>Count characters in each word</small></span><span className="radio" />
            </button>
            <button className={`mode-card ${mode === 'syllables' ? 'selected' : ''}`} onClick={() => { setMode('syllables'); setShowResult(true) }}>
              <span className="mode-icon">◖</span><span className="mode-copy"><b>Thai character count</b><small>Count base characters per word</small></span><span className="radio" />
            </button>
            <button className={`mode-card ${mode === 'custom' ? 'selected' : ''}`} onClick={() => { setMode('custom'); setShowResult(true) }}>
              <span className="mode-icon">✳</span><span className="mode-copy"><b>Count chosen marks</b><small>Count only characters you choose</small></span><span className="radio" />
            </button>
          </div>
          {mode === 'custom' && <div className="custom-row"><label htmlFor="custom">Characters to count</label><input id="custom" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="e.g. vowels, or Thai characters" autoComplete="off" /></div>}

          <div className="options-row">
            <label htmlFor="separator">Between numbers</label>
            <select id="separator" value={separator} onChange={(e) => setSeparator(e.target.value)}>
              <option value="">Join together</option><option value="-">Hyphen</option><option value=" ">Space</option>
            </select>
          </div>

          <div className="result-card" aria-live="polite">
            <div className="result-top"><span className="field-label">YOUR NUMBER SEQUENCE</span><span className="digits-count">{digits.length} {digits.length === 1 ? 'digit' : 'digits'}</span></div>
            <div className={`result-value ${showResult && result ? 'visible' : ''}`}>
              {result ? (showResult ? result : '••••••') : <span className="placeholder-result">Your result appears here</span>}
            </div>
            <div className="result-actions">
              <button className="reveal-btn" disabled={!result} onClick={() => setShowResult(!showResult)}>{showResult ? <EyeOff size={16} /> : <Eye size={16} />}{showResult ? 'Hide' : 'Reveal'}</button>
              <button className="copy-btn" disabled={!result} onClick={copy}><Copy size={16} />{copied ? 'Copied!' : 'Copy number'}</button>
            </div>
          </div>

          {words.length > 0 && <div className="breakdown"><div className="breakdown-title">HOW IT ADDS UP</div><div className="word-list">{words.map((word, index) => <div className="word-row" key={`${index}-${word}`}><span className="word-index">{String(index + 1).padStart(2, '0')}</span><span className="word-text">{word}</span><span className="word-line" /><span className="word-count">{digits[index]}</span></div>)}</div></div>}
        </section>

        <footer><span>Made for better memory, not predictable passwords.</span><span className="footer-mark">P2N · OFFLINE BY DESIGN</span></footer>
      </div>
    </main>
  )
}

export default App
