const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  console.log('Starting icon generation...');
  
  // Ensure public directory exists
  const publicDir = './public';
  if (!fs.existsSync(publicDir)) {
    console.log('Creating public directory...');
    fs.mkdirSync(publicDir);
  }

  // Read the base SVG
  console.log('Reading base SVG...');
  const svg = fs.readFileSync('./public/base-icon.svg');
  
  console.log('Generating icons...');
  
  // Generate PWA icons
  await sharp(svg)
    .resize(192, 192)
    .toFile('./public/pwa-192x192.png')
    .then(() => console.log('Created pwa-192x192.png'));

  await sharp(svg)
    .resize(512, 512)
    .toFile('./public/pwa-512x512.png')
    .then(() => console.log('Created pwa-512x512.png'));

  // Generate Apple touch icon
  await sharp(svg)
    .resize(180, 180)
    .toFile('./public/apple-touch-icon.png')
    .then(() => console.log('Created apple-touch-icon.png'));

  // Copy SVG as masked icon
  fs.copyFileSync(
    './public/base-icon.svg',
    './public/masked-icon.svg'
  );
  console.log('Created masked-icon.svg');

  console.log('Icon generation complete!');
}

generateIcons().catch(error => {
  console.error('Error generating icons:', error);
  process.exit(1);
});