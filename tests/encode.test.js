import test from 'node:test'
import assert from 'node:assert/strict'
import { encodePhrase } from '../src/encode.js'

test('encodes the entire phrase as a stable four-digit code', async () => {
  const result = await encodePhrase('แมวชอบกินปลา', 4)
  assert.match(result.code, /^\d{4}$/)
  assert.equal(result.code, (await encodePhrase('แมวชอบกินปลา', 4)).code)
})

test('returns six digits when six are selected', async () => {
  const result = await encodePhrase('แมวชอบกินปลา', 6)
  assert.match(result.code, /^\d{6}$/)
})

test('uses the entire phrase so changing a later character changes the digest', async () => {
  const first = await encodePhrase('แมวชอบกินปลา', 6)
  const changed = await encodePhrase('แมวชอบกินปลาดำ', 6)
  assert.notEqual(first.digest, changed.digest)
})

test('rejects an empty or whitespace-only phrase', async () => {
  await assert.rejects(encodePhrase('   ', 4), /Enter a phrase/)
})
