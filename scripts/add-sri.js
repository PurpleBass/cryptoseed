#!/usr/bin/env node

/**
 * CryptoSeed SRI (Subresource Integrity) Injection Script
 * 
 * This script automatically computes and injects SRI hashes into built HTML files
 * to improve security and Mozilla Observatory scores.
 * 
 * Features:
 * - Processes all HTML files in the dist directory
 * - Computes SHA-384 hashes for local scripts and stylesheets
 * - Injects integrity and crossorigin attributes
 * - Preserves existing crossorigin attributes
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

console.log('🔒 CryptoSeed SRI Injection');
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
 * Process a single HTML file
 */
function processHtmlFile(htmlFile) {
  console.log(`\n📄 Processing: ${path.relative(BUILD_DIR, htmlFile)}`);
  
  const html = fs.readFileSync(htmlFile, 'utf8');
  const $ = cheerio.load(html);
  
  let scriptsProcessed = 0;
  let stylesProcessed = 0;
  let errors = 0;

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

  // Write the updated HTML back to disk
  fs.writeFileSync(htmlFile, $.html(), 'utf8');
  
  console.log(`  📊 Summary: ${scriptsProcessed} scripts, ${stylesProcessed} stylesheets processed`);
  if (errors > 0) {
    console.log(`  ⚠️  ${errors} errors encountered`);
  }
  
  return { scriptsProcessed, stylesProcessed, errors };
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

    // Process each HTML file
    for (const htmlFile of htmlFiles) {
      const results = processHtmlFile(htmlFile);
      totalScripts += results.scriptsProcessed;
      totalStyles += results.stylesProcessed;
      totalErrors += results.errors;
    }

    console.log(`\n🎉 SRI injection complete!`);
    console.log(`📈 Total processed: ${totalScripts} scripts, ${totalStyles} stylesheets`);
    
    if (totalErrors > 0) {
      console.log(`⚠️  ${totalErrors} errors encountered`);
    } else {
      console.log(`✅ No errors - all assets processed successfully`);
    }

    console.log(`\n🔒 Your site now has Subresource Integrity protection!`);
    console.log(`🏆 This should improve your Mozilla Observatory score`);

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
