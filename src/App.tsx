import { useState } from 'react'
import { ArrowDownUp, Copy, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react'
import './style.css'

function App() {
  const [phrase, setPhrase] = useState('')
  const [length, setLength] = useState<4 | 6>(4)
  const [copied, setCopied] = useState(false)

  // Each Unicode code point except whitespace is one character.
  const characters = Array.from(phrase).filter((char) => !/\s/u.test(char))
  const canConvert = characters.length >= length
  const characterDetails = characters.slice(0, length).map((char) => ({
    character: char,
    codePoint: char.codePointAt(0)!,
    digit: String(char.codePointAt(0)! % 10),
  }))
  const result = canConvert ? characterDetails.map(({ digit }) => digit).join('') : ''

  async function copy() {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  function clear() {
    setPhrase('')
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
            <textarea id="phrase" value={phrase} onChange={(e) => { setPhrase(e.target.value); setCopied(false) }} placeholder="พิมพ์ข้อความหรือประโยคที่นี่..." rows={3} maxLength={240} autoComplete="off" spellCheck={false} />
            {phrase && <button className="clear-btn" onClick={clear} aria-label="ล้างข้อความ"><RotateCcw size={16} /></button>}
          </div>
          <div className="privacy-note"><ShieldCheck size={14} /> ข้อความประมวลผลบนอุปกรณ์นี้ ไม่ส่งออกและไม่บันทึก</div>

          <div className="settings-head"><span className="field-label">ความยาวชุดตัวเลข</span><span className="field-hint">เลือก 4 หรือ 6 หลัก</span></div>
          <div className="mode-grid" role="group" aria-label="เลือกความยาวชุดตัวเลข">
            <button className={`mode-card ${length === 4 ? 'selected' : ''}`} onClick={() => { setLength(4); setCopied(false) }} aria-pressed={length === 4}>
              <span className="mode-icon">4</span><span className="mode-copy"><b>4 หลัก</b><small>ต้องมีอักขระอย่างน้อย 4 ตัว</small></span><span className="radio" />
            </button>
            <button className={`mode-card ${length === 6 ? 'selected' : ''}`} onClick={() => { setLength(6); setCopied(false) }} aria-pressed={length === 6}>
              <span className="mode-icon">6</span><span className="mode-copy"><b>6 หลัก</b><small>ต้องมีอักขระอย่างน้อย 6 ตัว</small></span><span className="radio" />
            </button>
          </div>

          <div className="result-card" aria-live="polite">
            <div className="result-top"><span className="field-label">ชุดตัวเลขที่ได้</span><span className="digits-count">{characters.length} / {length} อักขระ</span></div>
            <div className={`result-value ${result ? 'visible' : ''}`}>
              {result || <span className="placeholder-result">{characters.length ? `พิมพ์อีก ${length - characters.length} อักขระเพื่อแปลง` : 'ผลลัพธ์จะแสดงที่นี่'}</span>}
            </div>
            <div className="result-actions">
              <button className="copy-btn" disabled={!result} onClick={copy}><Copy size={16} />{copied ? 'คัดลอกแล้ว!' : 'คัดลอกตัวเลข'}</button>
            </div>
          </div>
          <p className="field-hint" style={{ margin: '12px 0 0', lineHeight: 1.6 }}>ระบบใช้ {length} อักขระแรก (ไม่นับช่องว่าง) แปลงรหัสอักขระแต่ละตัวเป็นเลขหลักหน่วย 0–9</p>

          {canConvert && <div className="breakdown" aria-label="แจกแจงการแปลงอักขระเป็นตัวเลข">
            <div className="breakdown-title">ที่มาของตัวเลขแต่ละหลัก</div>
            <p className="field-hint" style={{ margin: '0 0 10px', lineHeight: 1.6 }}>ตัวเลข = รหัสอักขระ ÷ 10 แล้วใช้เศษที่เหลือ</p>
            <div className="word-list">
              {characterDetails.map(({ character, codePoint, digit }, index) => <div className="word-row" key={`${index}-${codePoint}`}>
                <span className="word-index">หลัก {index + 1}</span>
                <span className="word-text" style={{ maxWidth: '20%' }}>{character}</span>
                <span className="word-line" />
                <span className="word-count" style={{ minWidth: 'auto' }}>รหัส {codePoint} → {digit}</span>
              </div>)}
            </div>
          </div>}
        </section>

        <footer><span>ไม่ควรใช้ผลลัพธ์นี้เป็นรหัสผ่านหรือ PIN จริง</span><span className="footer-mark">P2N · ใช้งานออฟไลน์ได้</span></footer>
      </div>
    </main>
  )
}

export default App