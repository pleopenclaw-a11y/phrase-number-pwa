import { useEffect, useState } from 'react'
import { ArrowUpRight, Check, Clipboard, Info, RotateCcw, ShieldCheck, X } from 'lucide-react'
import { encodePhrase } from './encode.js'
import './style.css'

type Encoded = {
  code: string
  digest: string
  details: { byte: number; digit: string }[]
}

function App() {
  const [phrase, setPhrase] = useState('')
  const [length, setLength] = useState<4 | 6>(4)
  const [encoded, setEncoded] = useState<Encoded | null>(null)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    let active = true
    setEncoded(null)
    if (phrase.trim()) {
      encodePhrase(phrase, length)
        .then(value => { if (active) setEncoded(value) })
        .catch(() => { if (active) setEncoded(null) })
    }
    return () => { active = false }
  }, [phrase, length])

  useEffect(() => {
    if (!showDetails) return
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowDetails(false)
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [showDetails])

  const result = encoded?.code ?? ''
  const hasPhrase = phrase.trim().length > 0

  function changePhrase(value: string) {
    setPhrase(value)
    setEncoded(null)
    setCopied(false)
    setCopyError(false)
  }

  function changeLength(value: 4 | 6) {
    setLength(value)
    setEncoded(null)
    setCopied(false)
    setCopyError(false)
  }

  async function copyCode() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setCopyError(false)
    } catch {
      setCopied(false)
      setCopyError(true)
    }
  }

  return (
    <main className="viewport">
      <div className="app-frame">
        <header className="header">
          <div className="identity" aria-label="Phrase to Number">
            <span className="logo">P<span>/</span>N</span>
            <div className="identity-wordmark"><strong>PHRASE / NUMBER</strong><small>TEXT UTILITY — 001</small></div>
          </div>
          <span className="status"><span className="status-dot" /> LOCAL</span>
        </header>

        <div className="intro">
          <div className="intro-label"><span className="rule" /> เครื่องมือแปลงข้อความ</div>
          <h1>ข้อความ <span>→</span> ตัวเลข</h1>
          <p>ใส่ข้อความ เลือกจำนวนหลัก แล้วคัดลอกได้ทันที</p>
        </div>

        <div className="work-area">
          <div className="controls">
            <section className="input-section" aria-labelledby="input-heading">
              <div className="section-head"><label id="input-heading" htmlFor="phrase">01 <span>/</span> ข้อความต้นทาง</label><span className="small-meta">{phrase.length} / 240</span></div>
              <div className="input-box">
                <textarea
                  id="phrase"
                  className="phrase-input"
                  value={phrase}
                  maxLength={240}
                  onChange={event => changePhrase(event.target.value)}
                  placeholder="พิมพ์คำหรือประโยคที่นี่…"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-label="ข้อความที่ต้องการแปลงเป็นตัวเลข"
                  rows={2}
                />
                {phrase.length > 0 && <button className="reset-button" type="button" onClick={() => changePhrase('')} aria-label="ล้างข้อความทั้งหมด"><X size={18} strokeWidth={2} /></button>}
              </div>
              <div className="input-subline"><span className="input-dot" /> ไม่จัดเก็บข้อความที่พิมพ์</div>
            </section>

            <section className="mode-section" aria-label="เลือกความยาวตัวเลข">
              <div className="section-head"><span>02 <span>/</span> จำนวนหลัก</span><span className="small-meta">เลือกความยาว</span></div>
              <div className="segmented" role="group" aria-label="เลือกความยาวชุดตัวเลข">
                <button type="button" className={length === 4 ? 'segment active' : 'segment'} aria-pressed={length === 4} onClick={() => changeLength(4)}><b>04</b><span>4 หลัก</span></button>
                <button type="button" className={length === 6 ? 'segment active' : 'segment'} aria-pressed={length === 6} onClick={() => changeLength(6)}><b>06</b><span>6 หลัก</span></button>
              </div>
            </section>
          </div>

          <section className="result-section" aria-labelledby="result-heading">
            <div className="result-head"><span id="result-heading">03 <span>/</span> RESULT</span><span className="hash-mark">SHA—256</span></div>
            <div className="result-center" aria-live="polite" aria-atomic="true">
              <span className={result ? 'result-code ready' : 'result-code empty'}>{result || '—'.repeat(length)}</span>
              <span className="result-caption">{result ? `${length} DIGITS · พร้อมใช้งาน` : hasPhrase ? 'กำลังประมวลผล…' : 'รอข้อความต้นทาง'}</span>
            </div>
            <button type="button" className="copy-button" disabled={!result} onClick={copyCode}>
              {copied ? <Check size={19} strokeWidth={2.3} /> : <Clipboard size={19} strokeWidth={1.9} />}
              <span>{copyError ? 'คัดลอกไม่ได้ กรุณาลองอีกครั้ง' : copied ? 'คัดลอกแล้ว' : 'คัดลอกตัวเลข'}</span>
              <ArrowUpRight size={18} strokeWidth={1.9} className="copy-arrow" />
            </button>
          </section>
        </div>

        <footer className="foot">
          <div className="trust-row"><span><ShieldCheck size={15} /> คำนวณในเครื่องเท่านั้น</span><button type="button" onClick={() => setShowDetails(true)}>วิธีคำนวณ <Info size={14} /></button></div>
          <p>เพื่อช่วยจำเท่านั้น ไม่แนะนำให้ใช้เป็น PIN หรือรหัสผ่านจริง</p>
        </footer>
      </div>

      {showDetails && <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.currentTarget === event.target) setShowDetails(false) }}>
        <section className="details-sheet" role="dialog" aria-modal="true" aria-labelledby="details-heading">
          <div className="details-header"><div><span className="details-overline">METHODOLOGY / 001</span><h2 id="details-heading">วิธีคำนวณตัวเลข</h2></div><button type="button" onClick={() => setShowDetails(false)} aria-label="ปิดรายละเอียด"><X size={20} /></button></div>
          <p className="details-description">นำข้อความทั้งหมดไปทำ SHA-256 แล้วนำไบต์แรกตามจำนวนหลักที่เลือก หารด้วย 10 และใช้เศษเป็นตัวเลขแต่ละหลัก ข้อความเดิมจึงให้ผลลัพธ์เดิมเสมอ</p>
          {encoded ? <><div className="details-table" aria-label="รายละเอียดแต่ละหลัก">{encoded.details.map(({byte, digit}, index) => <div className="details-row" key={index}><span>{String(index + 1).padStart(2, '0')}</span><span>{byte} % 10</span><strong>{digit}</strong></div>)}</div><div className="digest-title">SHA-256 DIGEST</div><code className="digest">{encoded.digest}</code></> : <div className="details-empty">พิมพ์ข้อความในหน้าแรกเพื่อดูรายละเอียดของผลลัพธ์</div>}
          <div className="details-warning"><RotateCcw size={16} /> ไม่ใช่ระบบสุ่ม PIN ที่ปลอดภัยสำหรับบัญชีจริง</div>
        </section>
      </div>}
    </main>
  )
}

export default App
