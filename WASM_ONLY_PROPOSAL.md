# WASM-Only Architecture Proposal

## Current Problem

The hybrid WASM/JavaScript architecture creates security inconsistencies:

- ✅ **Browsers**: WASM with secure memory wiping
- ❌ **Testing**: JavaScript with memory vulnerabilities
- ⚠️ **Users**: Don't know which backend they get

## Proposed Solution: WASM-Only

### 1. Production Code Changes

```typescript
// src/lib/encryptionWASM.ts (new file)
export async function initializeEncryption() {
  // Require browser environment
  if (typeof window === 'undefined') {
    throw new Error('CryptoSeed requires a browser environment for WASM security');
  }
  
  // WASM-only initialization
  const [argon2Module, sodiumModule] = await Promise.all([
    import('argon2-browser'),
    import('libsodium-wrappers')
  ]);
  
  if (!argon2Module || !sodiumModule) {
    throw new Error('WASM libraries required for secure encryption');
  }
  
  const argon2 = argon2Module.default || argon2Module;
  const sodium = sodiumModule.default || sodiumModule;
  
  await sodium.ready;
  
  return {
    backend: 'wasm',
    secureMemory: true,
    argon2,
    sodium
  };
}
```

### 2. Testing Strategy Changes

#### Option A: Browser-Based Testing
```javascript
// jest.config.browser.cjs
module.exports = {
  preset: 'jest-puppeteer', // or 'jest-environment-jsdom'
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.browser.setup.ts'],
  testMatch: ['**/*.browser.test.ts']
};
```

#### Option B: Separate Test Suites
```javascript
// Keep current Jest for unit tests (mock WASM)
// Add Playwright/Puppeteer for integration tests
```

### 3. Development Workflow

#### For Development:
- Use browser dev server
- WASM loads normally
- Real security testing possible

#### For Testing:
- Mock WASM modules in unit tests
- Use browser automation for integration tests
- Focus on business logic separation

### 4. Benefits

#### Security Benefits:
- ✅ **Guaranteed secure memory handling**
- ✅ **No JavaScript memory vulnerabilities**
- ✅ **Consistent security model**
- ✅ **Clear security guarantees to users**

#### Architecture Benefits:
- ✅ **Simpler codebase (no hybrid logic)**
- ✅ **No environment detection complexity**
- ✅ **Clear browser-first design**

#### User Benefits:
- ✅ **Honest security claims**
- ✅ **No false sense of security**
- ✅ **Better performance (WASM optimized)**

### 5. Implementation Plan

#### Phase 1: Create WASM-Only Module
1. Create `src/lib/encryptionWASM.ts`
2. Remove Noble.js dependencies
3. Update `encryptionProcessing.ts` to use WASM-only

#### Phase 2: Update Testing
1. Add browser testing setup
2. Mock WASM for unit tests
3. Add integration tests in real browser

#### Phase 3: Clean Up
1. Remove hybrid logic
2. Remove Noble.js imports
3. Update documentation

#### Phase 4: Validate
1. Test in multiple browsers
2. Verify memory wiping works
3. Performance benchmarks

### 6. Risk Mitigation

#### Risk: Testing Complexity
**Mitigation**: Separate unit tests (mocked) from integration tests (browser)

#### Risk: Development Workflow
**Mitigation**: Browser-based development server (already exists)

#### Risk: CI/CD Changes
**Mitigation**: Add headless browser testing to CI pipeline

## Conclusion

Eliminating the JavaScript fallback:
- ✅ **Solves the core memory security problem**
- ✅ **Provides consistent security guarantees**
- ✅ **Simplifies architecture**
- ⚠️ **Requires testing workflow changes**

The security benefits outweigh the development complexity.
