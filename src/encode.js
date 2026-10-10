export async function encodePhrase(phrase, length) {
  if (typeof phrase !== 'string' || !phrase.trim()) {
    throw new Error('Enter a phrase')
  }
  if (length !== 4 && length !== 6) {
    throw new Error('Code length must be 4 or 6')
  }

  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(phrase))
  const bytes = new Uint8Array(digest)
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  const decimalDigits = Array.from(bytes, (byte) => String(byte % 10))
  const details = Array.from(bytes.slice(0, length), (byte, index) => ({ byte, digit: decimalDigits[index] }))

  return { code: decimalDigits.slice(0, length).join(''), digest: hex, details }
}
