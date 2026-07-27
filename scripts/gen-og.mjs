// One-off: generate a branded 1200x630 social-share (Open Graph) image
// from the existing hero photo, with a soft dark gradient + brand name.
import sharp from 'sharp';

const W = 1200;
const H = 630;

const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(40,32,26,0)"/>
      <stop offset="55%" stop-color="rgba(40,32,26,0.15)"/>
      <stop offset="100%" stop-color="rgba(40,32,26,0.72)"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fade)"/>
  <text x="${W / 2}" y="${H - 150}" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif" font-size="88"
        font-weight="600" fill="#ffffff">Alexandra Maja</text>
  <text x="${W / 2}" y="${H - 90}" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif" font-size="34"
        font-style="italic" fill="#f2ece4">Plante · Aromaterapie · Viață naturală</text>
</svg>`);

await sharp('public/images/hero.jpg')
  .resize(W, H, { fit: 'cover', position: 'center' })
  .composite([{ input: overlay, top: 0, left: 0 }])
  .jpeg({ quality: 84 })
  .toFile('public/og-default.jpg');

console.log('og-default.jpg written');
