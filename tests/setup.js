import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Ensure crypto.subtle is available for tests (needed for generateNonce)
// In Node.js 18+, webcrypto is available, but jsdom might not expose it properly
if (!global.crypto) {
  global.crypto = {};
}
if (!global.crypto.subtle) {
  // Provide a working mock for crypto.subtle.digest
  // This is needed for the generateNonce function in UtilityFunctions
  global.crypto.subtle = {
    digest: async (algorithm, data) => {
      // Create a proper hash buffer (32 bytes for SHA-256)
      const hash = new Uint8Array(32);
      // Fill with deterministic data based on input for consistent test results
      const dataArray = new Uint8Array(data);
      for (let i = 0; i < 32; i++) {
        hash[i] = (dataArray[i % dataArray.length] || 0) ^ (i * 7);
      }
      return hash.buffer;
    },
  };
}

// Ensure navigator.mediaDevices is available for tests (needed for video recording)
if (!global.navigator) {
  global.navigator = {};
}
if (!global.navigator.mediaDevices) {
  global.navigator.mediaDevices = {
    getUserMedia: vi.fn(() => Promise.resolve({
      getTracks: () => [{ stop: vi.fn() }],
    })),
    getDisplayMedia: vi.fn(() => Promise.resolve({
      getTracks: () => [{ stop: vi.fn() }],
    })),
  };
}

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
})

