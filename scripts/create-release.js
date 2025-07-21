#!/usr/bin/env node

import fs from 'fs/promises';
import { execSync } from 'child_process';

async function createGitHubRelease() {
  console.log('🚀 Creating GitHub release...');
  
  const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
  const version = `v${packageJson.version}`;
  
  // Read release notes
  const releaseNotes = await fs.readFile('release/release-notes.md', 'utf8');
  
  try {
    // Create the release using git commands
    console.log(`📝 Creating tag ${version}...`);
    execSync(`git tag ${version}`, { stdio: 'inherit' });
    
    console.log(`📤 Pushing tag to GitHub...`);
    execSync(`git push origin ${version}`, { stdio: 'inherit' });
    
    console.log(`✅ Tag ${version} created and pushed!`);
    console.log('\n📋 Manual steps needed:');
    console.log('1. Go to: https://github.com/PurpleBass/cryptoseed/releases');
    console.log(`2. Click "Create release from tag" for ${version}`);
    console.log('3. Upload these files:');
    console.log('   - release/cryptoseed-v3.1.0-standalone.html');
    console.log('   - release/cryptoseed-v3.1.0-standalone.html.sha256');
    console.log('4. Copy-paste the release notes from release/release-notes.md');
    console.log('\n🎯 Your download button will then work!');
    
  } catch (error) {
    console.error('❌ Error creating release:', error.message);
    console.log('\n📋 Manual steps:');
    console.log('1. Create tag manually: git tag v3.1.0 && git push origin v3.1.0');
    console.log('2. Go to GitHub and create release from tag');
    console.log('3. Upload the files from the release/ directory');
  }
}

createGitHubRelease().catch(console.error);
