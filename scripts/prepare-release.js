#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function prepareRelease() {
  console.log('🔧 Preparing standalone release...');
  
  const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
  const version = packageJson.version || '1.0.0';
  
  const standaloneDir = 'dist-standalone';
  const releaseDir = 'release';
  
  // Create release directory
  await fs.mkdir(releaseDir, { recursive: true });
  
  // Find the built HTML file
  const files = await fs.readdir(standaloneDir);
  const htmlFile = files.find(file => file.endsWith('.html'));
  
  if (!htmlFile) {
    throw new Error('No HTML file found in dist-standalone directory');
  }
  
  const sourcePath = path.join(standaloneDir, htmlFile);
  const targetFileName = `cryptoseed-v${version}-standalone.html`;
  const targetPath = path.join(releaseDir, targetFileName);
  
  // Copy and rename the file
  await fs.copyFile(sourcePath, targetPath);
  console.log(`✅ Created: ${targetFileName}`);
  
  // Generate SHA256 checksum
  const fileBuffer = await fs.readFile(targetPath);
  const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  const checksumFileName = `${targetFileName}.sha256`;
  const checksumPath = path.join(releaseDir, checksumFileName);
  
  await fs.writeFile(checksumPath, `${hash}  ${targetFileName}\n`);
  console.log(`✅ Created: ${checksumFileName}`);
  
  // Create release notes
  const releaseNotesPath = path.join(releaseDir, 'release-notes.md');
  const releaseNotes = `# CryptoSeed v${version} - Standalone Release

## Downloads
- **Standalone HTML**: \`${targetFileName}\`
- **SHA256 Checksum**: \`${checksumFileName}\`

## Verification
\`\`\`bash
# Download both files, then verify:
sha256sum -c ${checksumFileName}
\`\`\`

## Usage
1. Download the standalone HTML file
2. Verify the checksum (recommended)
3. Open in any modern browser
4. Works completely offline

## Security Features
- Client-side only encryption (ChaCha20-Poly1305)
- No data transmission
- No backend dependencies
- Cryptographically verifiable

**SHA256**: \`${hash}\`
`;

  await fs.writeFile(releaseNotesPath, releaseNotes);
  console.log(`✅ Created: release-notes.md`);
  
  // Display summary
  console.log('\n🎉 Release preparation complete!');
  console.log('\nFiles created:');
  console.log(`   📄 ${targetFileName}`);
  console.log(`   🔐 ${checksumFileName}`);
  console.log(`   📝 release-notes.md`);
  console.log('\nNext steps:');
  console.log('1. Test the standalone HTML file');
  console.log('2. Create GitHub release');
  console.log('3. Upload the files to the release');
}

prepareRelease().catch(console.error);
