// Generates right-sized logo assets from assets/images/logo.png (master).
// Usage: node scripts/optimize-logo.mjs
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'images')
const master = path.join(dir, 'logo.png')

const targets = [
  { file: 'logo-sm.png', size: 192 },
  { file: 'splash-icon.png', size: 512 },
  { file: 'icon.png', size: 1024 },
]

for (const { file, size } of targets) {
  const out = path.join(dir, file)
  await sharp(master)
    .resize(size, size, { fit: 'cover', position: 'center' })
    .png({ compressionLevel: 9 })
    .toFile(out)
  console.log(`wrote ${file} (${size}x${size})`)
}
