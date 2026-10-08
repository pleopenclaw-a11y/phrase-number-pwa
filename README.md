# Phrase → Number

A privacy-first phrase-to-number helper built for phones and installable as a PWA.

## What it does
- Converts each whitespace-separated word into a count; the sequence is easy to recreate from a phrase and a chosen rule.
- Letter count: counts Unicode code points in each word (Thai combining marks are counted individually).
- Thai character count: counts base characters, ignoring Thai vowel/tone combining marks.
- Chosen-mark count: counts only characters entered in the custom selector.
- Optional space or hyphen separators; per-word breakdown; reveal/hide and copy controls.
- All processing runs locally in the browser. The phrase is not sent to a server or stored by the app.
- Installable offline PWA.

## Security note
This tool is a memory aid, not a password generator. A short PIN derived from a phrase may be guessable, especially if the phrase or counting rule is known. Do not enter real passwords, PINs, account details, addresses, dates, or other sensitive personal information. For device passcodes, prefer a random code generated and stored by a reputable password manager, or a longer alphanumeric passcode. Never reuse the sample phrase or output in a real credential.

## Development
```sh
npm install
npm run dev
npm run build
npm run preview
```

## Deploy
The project is a static Vite site and can be imported into Vercel from GitHub. Build command: `npm run build`; output directory: `dist`.
