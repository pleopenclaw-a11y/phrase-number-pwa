export function encodePhrase(phrase: string, length: 4 | 6): Promise<{
  code: string
  digest: string
  details: { byte: number; digit: string }[]
}>
