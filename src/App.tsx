import { useEffect, useState } from 'react'
import { ArrowDownUp, Copy, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react'
import { encodePhrase } from './encode.js'
import './style.css'

function App() {
  const [phrase, setPhrase] = useState('')
  const [length, setLength] = useState<4 | 6>(4)
  const [copied, setCopied] = useState(false)
  const [encoded, setEncoded] = useState<{ code: string; digest: string; details: { byte: number; digit: string }[] } | null>(null)

  useEffect(() => {
    let active = true
    if (!phrase.trim()) {
      setEncoded(null)
      return () => { active = false }
    }
    encodePhrase(phrase, length).then((value) => {
      if (active) setEncoded(value)
    }).catch(() => {
      if (active) setEncoded(null)
    })
    return () => { active = false }
  }, [phrase, length])

  const result = encoded?.code ?? ''

  async function copy() {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  function clear() {
    setPhrase('')
    setEncoded(null)
    setCopied(false)
  }

  return (
    <main className="page">
      <div className="glow glow-one" /><div className="glow glow-two" />
      <div className="shell">
        <header className="topbar">
          <a className="brand" href="#top" aria-label="หน้าหลัก แปลงข้อความเป็นตัวเลข">
            <span className="brand-icon"><ArrowDownUp size={20} /></span>
            <span>ข้อความ<span className="brand-accent">→</span>ตัวเลข</span>
          </a>
          <span className="local-pill"><span className="green-dot" /> ประมวลผลในเครื่อง</span>
        </header>

        <section className="hero" id="top">
          <div className="eyebrow"><Sparkles size={14} /> เปลี่ยนข้อความให้เป็นชุดตัวเลข</div>
          <h1>ข้อความเป็น<br /><span>ตัวเลข</span></h1>
          <p className="subtitle">พิมพ์ข้อความ แล้วรับชุดตัวเลขตามความยาวที่เลือก<br className="desktop-break" /> ใช้ตัวอักษรตามลำดับจากข้อความของคุณ</p>
        </section>

        <section className="workspace" aria-label="เครื่องมือแปลงข้อความเป็นตัวเลข">
          <label className="field-label" htmlFor="phrase">ข้อความที่ต้องการแปลง</label>
          <div className="input-wrap">
            <textarea id="phrase" value={phrase} onChange={(e) => { setPhrase(e.target.value); setEncoded(null); setCopied(false) }} placeholder="พิมพ์ข้อความหรือประโยคที่นี่..." rows={3} maxLength={240} autoComplete="off" spellCheck={false} />
            {phrase && <button className="clear-btn" onClick={clear} aria-label="ล้างข้อความ"><RotateCcw size={16} /></button>}
          </div>
          <div className="privacy-note"><ShieldCheck size={14} /> ข้อความประมวลผลบนอุปกรณ์นี้ ไม่ส่งออกและไม่บันทึก</div>

          <div className="settings-head"><span className="field-label">ความยาวชุดตัวเลข</span><span className="field-hint">เลือก 4 หรือ 6 หลัก</span></div>
          <div className="mode-grid" role="group" aria-label="เลือกความยาวชุดตัวเลข">
            <button className={`mode-card ${length === 4 ? 'selected' : ''}`} onClick={() => { setLength(4); setEncoded(null); setCopied(false) }} aria-pressed={length === 4}>
              <span className="mode-icon">4</span><span className="mode-copy"><b>4 หลัก</b><small>แปลงข้อความทั้งก้อนเป็นเลข 4 หลัก</small></span><span className="radio" />
            </button>
            <button className={`mode-card ${length === 6 ? 'selected' : ''}`} onClick={() => { setLength(6); setEncoded(null); setCopied(false) }} aria-pressed={length === 6}>
              <span className="mode-icon">6</span><span className="mode-copy"><b>6 หลัก</b><small>แปลงข้อความทั้งก้อนเป็นเลข 6 หลัก</small></span><span className="radio" />
            </button>
          </div>

          <div className="result-card" aria-live="polite">
            <div className="result-top"><span className="field-label">ชุดตัวเลขที่ได้</span><span className="digits-count">SHA-256 · {length} หลัก</span></div>
            <div className={`result-value ${result ? 'visible' : ''}`}>
              {result || <span className="placeholder-result">{phrase.trim() ? 'กำลังคำนวณ...' : 'พิมพ์ข้อความเพื่อเริ่มแปลง'}</span>}
            </div>
            <div className="result-actions">
              <button className="copy-btn" disabled={!result} onClick={copy}><Copy size={16} />{copied ? 'คัดลอกแล้ว!' : 'คัดลอกตัวเลข'}</button>
            </div>
          </div>
          <p className="field-hint" style={{ margin: '12px 0 0', lineHeight: 1.6 }}>นำข้อความทั้งหมดไปคำนวณด้วย SHA-256 จากนั้นแปลงไบต์แรก ๆ เป็นเลขหลักหน่วยจนได้ {length} หลัก</p>

          {encoded && <div className="breakdown" aria-label="รายละเอียดการแปลงข้อความด้วย SHA-256">
            <div className="breakdown-title">รายละเอียดการแปลง</div>
            <p className="field-hint" style={{ margin: '0 0 8px', lineHeight: 1.6 }}>ข้อความทั้งก้อน → SHA-256 → ไบต์ → เศษจากการหาร 10</p>
            <div className="word-list">
              {encoded.details.map(({ byte, digit }, index) => <div className="word-row" key={index}>
                <span className="word-index">ไบต์ {index + 1}</span>
                <span className="word-text" style={{ maxWidth: 'none' }}>{byte} ÷ 10</span>
                <span className="word-line" />
                <span className="word-count" style={{ minWidth: 'auto' }}>เศษ {digit}</span>
              </div>)}
            </div>
            <p className="field-hint" style={{ margin: '10px 0 0', lineHeight: 1.6, overflowWrap: 'anywhere' }}>ค่า SHA-256: {encoded.digest}</p>
          </div>}
        </section>

        <footer><span>ไม่ควรใช้ผลลัพธ์นี้เป็นรหัสผ่านหรือ PIN จริง</span><span className="footer-mark">P2N · ใช้งานออฟไลน์ได้</span></footer>
      </div>
    </main>
  )
}

export default App