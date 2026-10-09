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
          <a className="brand" href="#top" aria-label="หน้าหลัก แปลงวลีเป็นตัวเลข">
            <span className="brand-icon"><ArrowDownUp size={20} /></span>
            <span>วลี<span className="brand-accent">→</span>ตัวเลข</span>
          </a>
          <span className="local-pill"><span className="green-dot" /> ประมวลผลในเครื่อง</span>
        </header>

        <section className="hero" id="top">
          <div className="eyebrow"><Sparkles size={14} /> จำวลีของคุณ แปลงเป็นรหัสตัวเลข</div>
          <h1>แปลงวลีเป็น<br /><span>ตัวเลข</span></h1>
          <p className="subtitle">เปลี่ยนวลีที่คุณจำได้ ให้เป็นชุดตัวเลข<br className="desktop-break" /> ด้วยกติกาที่คุณเลือกเอง</p>
        </section>

        <section className="workspace" aria-label="เครื่องมือแปลงวลีเป็นตัวเลข">
          <label className="field-label" htmlFor="phrase">วลีของคุณ <span>✳</span></label>
          <div className="input-wrap">
            <textarea id="phrase" value={phrase} onChange={(e) => { setPhrase(e.target.value); setShowResult(true) }} placeholder="พิมพ์วลีที่ต้องการ..." rows={2} maxLength={240} autoComplete="off" spellCheck={false} />
            {phrase && <button className="clear-btn" onClick={clear} aria-label="ล้างข้อความ"><RotateCcw size={16} /></button>}
          </div>
          <div className="privacy-note"><ShieldCheck size={14} /> ข้อความอยู่บนอุปกรณ์นี้เท่านั้น ไม่ส่งออกและไม่บันทึก</div>

          <div className="settings-head"><span className="field-label">วิธีแปลง</span><span className="field-hint">เลือกกติกาที่จำได้</span></div>
          <div className="mode-grid" role="group" aria-label="เลือกวิธีแปลง">
            <button className={`mode-card ${mode === 'letters' ? 'selected' : ''}`} onClick={() => { setMode('letters'); setShowResult(true) }} aria-pressed={mode === 'letters'}>
              <span className="mode-icon">กข</span><span className="mode-copy"><b>นับตัวอักษรในแต่ละคำ</b><small>นับทุกตัวอักษร ยกเว้นช่องว่าง</small></span><span className="radio" />
            </button>
            <button className={`mode-card ${mode === 'syllables' ? 'selected' : ''}`} onClick={() => { setMode('syllables'); setShowResult(true) }} aria-pressed={mode === 'syllables'}>
              <span className="mode-icon">◖</span><span className="mode-copy"><b>นับอักขระไทยพื้นฐาน</b><small>ไม่นับสระและวรรณยุกต์ที่กำกับ</small></span><span className="radio" />
            </button>
            <button className={`mode-card ${mode === 'custom' ? 'selected' : ''}`} onClick={() => { setMode('custom'); setShowResult(true) }} aria-pressed={mode === 'custom'}>
              <span className="mode-icon">✳</span><span className="mode-copy"><b>นับเฉพาะอักขระที่กำหนด</b><small>ระบุตัวอักษรที่ต้องการนับ</small></span><span className="radio" />
            </button>
          </div>
          {mode === 'custom' && <div className="custom-row"><label htmlFor="custom">อักขระที่ให้นับ</label><input id="custom" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="พิมพ์ตัวอักษรที่ต้องการนับ" autoComplete="off" /></div>}

          <div className="options-row">
            <label htmlFor="separator">ตัวคั่นระหว่างตัวเลข</label>
            <select id="separator" value={separator} onChange={(e) => setSeparator(e.target.value)}>
              <option value="">ไม่คั่น</option><option value="-">ขีดกลาง (-)</option><option value=" ">เว้นวรรค</option>
            </select>
          </div>

          <div className="result-card" aria-live="polite">
            <div className="result-top"><span className="field-label">ชุดตัวเลขของคุณ</span><span className="digits-count">{digits.length} คำ</span></div>
            <div className={`result-value ${showResult && result ? 'visible' : ''}`}>
              {result ? (showResult ? result : '••••••') : <span className="placeholder-result">ผลลัพธ์จะแสดงที่นี่</span>}
            </div>
            <div className="result-actions">
              <button className="reveal-btn" disabled={!result} onClick={() => setShowResult(!showResult)}>{showResult ? <EyeOff size={16} /> : <Eye size={16} />}{showResult ? 'ซ่อนตัวเลข' : 'แสดงตัวเลข'}</button>
              <button className="copy-btn" disabled={!result} onClick={copy}><Copy size={16} />{copied ? 'คัดลอกแล้ว!' : 'คัดลอกตัวเลข'}</button>
            </div>
          </div>

          {words.length > 0 && <div className="breakdown"><div className="breakdown-title">แจกแจงวิธีนับ</div><div className="word-list">{words.map((word, index) => <div className="word-row" key={`${index}-${word}`}><span className="word-index">{String(index + 1).padStart(2, '0')}</span><span className="word-text">{word}</span><span className="word-line" /><span className="word-count">{digits[index]}</span></div>)}</div></div>}
        </section>

        <footer><span>ช่วยจำรูปแบบตัวเลข ไม่เหมาะกับการสร้างรหัสผ่านที่คาดเดายาก</span><span className="footer-mark">P2N · ใช้งานออฟไลน์ได้</span></footer>
      </div>
    </main>
  )
}

export default App
