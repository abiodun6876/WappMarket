// generate-icons.js
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateIcons() {
  console.log('🎨 Generating WhatsApp Marketplace icons...');
  
  const publicDir = path.join(__dirname, 'public');
  await fs.mkdir(publicDir, { recursive: true });

  // SVG for favicon
  const faviconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <rect width="24" height="24" fill="#075E54" rx="6"/>
      <circle cx="9" cy="12" r="5" fill="#25D366"/>
      <circle cx="15" cy="12" r="5" fill="#25D366"/>
      <text x="12" y="16" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">W</text>
    </svg>
  `;

  // Save SVG favicon
  await fs.writeFile(path.join(publicDir, 'favicon.svg'), faviconSvg);
  console.log('✅ Created: favicon.svg');

  // Generate PNG icons using sharp
  const sizes = [16, 32, 192, 512];
  
  for (const size of sizes) {
    // Create a new image with sharp
    const svgBuffer = Buffer.from(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
        <rect width="${size}" height="${size}" fill="#075E54" rx="${size/8}"/>
        <circle cx="${size*0.375}" cy="${size/2}" r="${size/4}" fill="#25D366"/>
        <circle cx="${size*0.625}" cy="${size/2}" r="${size/4}" fill="#25D366"/>
        <text x="${size/2}" y="${size*0.66}" text-anchor="middle" fill="white" 
              font-family="Arial" font-size="${size/3}" font-weight="bold">W</text>
      </svg>
    `);

    const outputPath = size <= 32 
      ? path.join(publicDir, `favicon-${size}x${size}.png`)
      : path.join(publicDir, `icon-${size}.png`);
    
    await sharp(svgBuffer)
      .png()
      .toFile(outputPath);
    
    console.log(`✅ Created: ${path.basename(outputPath)}`);
  }

  // Create manifest.json for PWA
  const manifest = {
    "name": "WhatsApp Market",
    "short_name": "WappMarket",
    "description": "Nigerian Business WhatsApp Marketplace",
    "theme_color": "#075E54",
    "background_color": "#ffffff",
    "display": "standalone",
    "orientation": "portrait",
    "scope": "/",
    "start_url": "/",
    "icons": [
      {
        "src": "/icon-192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icon-512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any maskable"
      }
    ]
  };

  await fs.writeFile(
    path.join(publicDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('✅ Created: manifest.json');

  // Update index.html template
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
    <link rel="apple-touch-icon" href="/icon-192.png">
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#075E54">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WhatsApp Market - Nigerian Business Marketplace</title>
    <meta name="description" content="Find and connect with Nigerian businesses on WhatsApp. Logistics, services, retail, and more.">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

  await fs.writeFile(path.join(publicDir, 'index.html'), indexHtml);
  console.log('✅ Updated: index.html with icons');

  console.log('\n🎉 All icons generated successfully!');
  console.log('📁 Check the /public folder for generated files.');
}

generateIcons().catch(console.error);