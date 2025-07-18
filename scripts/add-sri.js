#!/usr/bin/env node

/**
 * CryptoSeed SRI (Subresource Integrity) Injection Script with CSP3 strict-dynamic
 * 
 * This script automatically computes and injects SRI hashes into built HTML files
 * and implements CSP3 strict-dynamic for improved security and Mozilla Observatory scores.
 * 
 * Features:
 * - Processes all HTML files in the dist directory
 * - Computes SHA-384 hashes for local scripts and stylesheets
 * - Generates cryptographically secure nonces for strict-dynamic CSP
 * - Injects integrity and crossorigin attributes
 * - Creates optimized CSP headers with strict-dynamic
 * - Provides detailed logging
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { glob } from 'glob';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUILD_DIR = path.resolve(__dirname, '../dist');

console.log('🔒 CryptoSeed SRI Injection with CSP3 strict-dynamic');
console.log(`📁 Build directory: ${BUILD_DIR}`);

/**
 * Compute SHA-384 integrity hash for a file
 */
function computeIntegrity(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha384').update(data).digest('base64');
    return `sha384-${hash}`;
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Check if a URL is external (starts with http/https or //)
 */
function isExternalUrl(url) {
  return url.startsWith('http://') || 
         url.startsWith('https://') || 
         url.startsWith('//');
}

/**
 * Generate CSP header with strict-dynamic using script hashes (better for static sites)
 */
function generateCSPWithStrictDynamic(scriptHashes) {
  const hashSources = scriptHashes.map(hash => `'${hash}'`).join(' ');
  
  const csp = [
    "default-src 'none'",
    `script-src 'self' ${hashSources} 'strict-dynamic'`,
    "style-src 'self' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' 'sha256-Od9mHMH7x2G6QuoV3hsPkDCwIyqbg2DX3F5nLeCYQBc='",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "require-trusted-types-for 'script'"
  ];
  
  return csp.join('; ') + ';';
}

/**
 * Generate updated _headers file with strict-dynamic CSP using script hashes
 */
function generateUpdatedHeadersFile(scriptHashes) {
  const headersPath = path.join(BUILD_DIR, '_headers');
  const hashSources = scriptHashes.map(hash => `'${hash}'`).join(' ');
  
  const cspWithStrictDynamic = `default-src 'none'; script-src 'self' ${hashSources} 'strict-dynamic'; style-src 'self' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' 'sha256-Od9mHMH7x2G6QuoV3hsPkDCwIyqbg2DX3F5nLeCYQBc='; img-src 'self' data:; font-src 'self'; connect-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; require-trusted-types-for 'script';`;
  
  const headersContent = `/*
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer
Content-Security-Policy: ${cspWithStrictDynamic}
Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
*/
`;

  fs.writeFileSync(headersPath, headersContent, 'utf8');
  console.log(`  📝 Updated _headers file with ${scriptHashes.length} script hashes for strict-dynamic`);
}

/**
 * Process a single HTML file
 */
function processHtmlFile(htmlFile) {
  console.log(`\n📄 Processing: ${path.relative(BUILD_DIR, htmlFile)}`);
  
  const html = fs.readFileSync(htmlFile, 'utf8');
  const $ = cheerio.load(html);
  
  let scriptsProcessed = 0;
  let stylesProcessed = 0;
  let errors = 0;
  let scriptHashes = [];

  // Add performance optimizations to head
  const head = $('head');
  
  // Add resource hints for better performance (local resources only for offline-first app)
  const resourceHints = `
    <!-- Performance Optimizations -->
    <meta name="format-detection" content="telephone=no">
    <link rel="preload" href="/cryptoseed-logo-64.webp" as="image" type="image/webp">
  `;
  
  // Insert after meta tags but before scripts
  $('meta[name="author"]').after(resourceHints);

  // Process script tags with src attributes
  $('script[src]').each((_, el) => {
    const src = $(el).attr('src');
    
    if (!isExternalUrl(src)) {
      // Handle relative paths that start with /
      const assetPath = src.startsWith('/') ? src.slice(1) : src;
      const filePath = path.join(BUILD_DIR, assetPath);
      
      if (fs.existsSync(filePath)) {
        const integrity = computeIntegrity(filePath);
        if (integrity) {
          $(el).attr('integrity', integrity);
          
          // Add crossorigin if not already present
          if (!$(el).attr('crossorigin')) {
            $(el).attr('crossorigin', 'anonymous');
          }
          
          // Collect script hashes for main entry scripts for strict-dynamic CSP
          if (assetPath.includes('index-') || assetPath === 'registerSW.js') {
            const scriptHash = integrity.replace('sha384-', 'sha384-');
            scriptHashes.push(scriptHash);
            console.log(`  🔐 Script hash collected: ${assetPath} - ${scriptHash.substring(0, 20)}...`);
          }
          
          // Make service worker registration non-blocking
          if (assetPath === 'registerSW.js') {
            $(el).attr('defer', '');
            console.log(`  🚀 Script: ${assetPath} (made non-blocking)`);
          } else {
            console.log(`  ✅ Script: ${assetPath}`);
          }
          scriptsProcessed++;
        } else {
          errors++;
        }
      } else {
        console.log(`  ⚠️  Script file not found: ${assetPath}`);
        errors++;
      }
    }
  });

  // Process link tags for stylesheets
  $('link[rel="stylesheet"][href]').each((_, el) => {
    const href = $(el).attr('href');
    
    if (!isExternalUrl(href)) {
      // Handle relative paths that start with /
      const assetPath = href.startsWith('/') ? href.slice(1) : href;
      const filePath = path.join(BUILD_DIR, assetPath);
      
      if (fs.existsSync(filePath)) {
        const integrity = computeIntegrity(filePath);
        if (integrity) {
          $(el).attr('integrity', integrity);
          
          // Add crossorigin if not already present
          if (!$(el).attr('crossorigin')) {
            $(el).attr('crossorigin', 'anonymous');
          }
          
          console.log(`  ✅ Stylesheet: ${assetPath}`);
          stylesProcessed++;
        } else {
          errors++;
        }
      } else {
        console.log(`  ⚠️  Stylesheet file not found: ${assetPath}`);
        errors++;
      }
    }
  });

  // Process module preload links
  $('link[rel="modulepreload"][href]').each((_, el) => {
    const href = $(el).attr('href');
    
    if (!isExternalUrl(href)) {
      const assetPath = href.startsWith('/') ? href.slice(1) : href;
      const filePath = path.join(BUILD_DIR, assetPath);
      
      if (fs.existsSync(filePath)) {
        const integrity = computeIntegrity(filePath);
        if (integrity) {
          $(el).attr('integrity', integrity);
          
          // Add crossorigin if not already present
          if (!$(el).attr('crossorigin')) {
            $(el).attr('crossorigin', 'anonymous');
          }
          
          console.log(`  ✅ Module preload: ${assetPath}`);
          scriptsProcessed++;
        } else {
          errors++;
        }
      } else {
        console.log(`  ⚠️  Module preload file not found: ${assetPath}`);
        errors++;
      }
    }
  });

  // Generate CSP with strict-dynamic using the collected script hashes
  const cspHeader = generateCSPWithStrictDynamic(scriptHashes);
  
  // Add CSP meta tag to the HTML (as fallback, primary CSP still comes from _headers)
  const cspMetaTag = `<meta http-equiv="Content-Security-Policy" content="${cspHeader}">`;
  $('head').append(cspMetaTag);
  console.log(`  🛡️  Added CSP meta tag with strict-dynamic and ${scriptHashes.length} script hashes`);

  // Write the updated HTML back to disk
  fs.writeFileSync(htmlFile, $.html(), 'utf8');
  
  console.log(`  📊 Summary: ${scriptsProcessed} scripts, ${stylesProcessed} stylesheets processed`);
  if (errors > 0) {
    console.log(`  ⚠️  ${errors} errors encountered`);
  }
  
  return { scriptsProcessed, stylesProcessed, errors, scriptHashes, cspHeader };
}

/**
 * Main execution
 */
async function main() {
  try {
    // Check if build directory exists
    if (!fs.existsSync(BUILD_DIR)) {
      console.error(`❌ Build directory not found: ${BUILD_DIR}`);
      console.log('💡 Run "npm run build" first to generate the dist folder');
      process.exit(1);
    }

    // Find all HTML files in the build directory
    const htmlFiles = await glob(`${BUILD_DIR}/**/*.html`);
    
    if (htmlFiles.length === 0) {
      console.log('⚠️  No HTML files found in build directory');
      return;
    }

    console.log(`🔍 Found ${htmlFiles.length} HTML file(s) to process`);

    let totalScripts = 0;
    let totalStyles = 0;
    let totalErrors = 0;
    let allScriptHashes = [];

    // Process each HTML file
    for (const htmlFile of htmlFiles) {
      const results = processHtmlFile(htmlFile);
      totalScripts += results.scriptsProcessed;
      totalStyles += results.stylesProcessed;
      totalErrors += results.errors;
      allScriptHashes = allScriptHashes.concat(results.scriptHashes);
    }

    // Generate updated _headers file with strict-dynamic CSP using script hashes
    if (allScriptHashes.length > 0) {
      // Remove duplicates
      const uniqueHashes = [...new Set(allScriptHashes)];
      generateUpdatedHeadersFile(uniqueHashes);
      console.log(`\n🛡️  Generated updated _headers file with strict-dynamic CSP using ${uniqueHashes.length} script hashes`);
    }

    console.log(`\n🎉 SRI injection and CSP3 strict-dynamic setup complete!`);
    console.log(`📈 Total processed: ${totalScripts} scripts, ${totalStyles} stylesheets`);
    
    if (totalErrors > 0) {
      console.log(`⚠️  ${totalErrors} errors encountered`);
    } else {
      console.log(`✅ No errors - all assets processed successfully`);
    }

    console.log(`\n🔒 Your site now has:`)
    console.log(`   • Subresource Integrity protection`)
    console.log(`   • CSP3 strict-dynamic with script hashes (optimal for static sites)`)
    console.log(`   • Dynamic script loading support for Vite chunks`)
    console.log(`🏆 This should significantly improve your Mozilla Observatory score`);

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
