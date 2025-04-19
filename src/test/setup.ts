import { vi } from 'vitest';

// Mock fetch API
window.fetch = vi.fn() as unknown as typeof fetch;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock navigator
Object.defineProperty(window, 'navigator', {
  writable: true,
  value: {
    ...window.navigator,
    share: vi.fn(),
    canShare: vi.fn(),
    serviceWorker: {
      register: vi.fn().mockResolvedValue(undefined),
      getRegistration: vi.fn(),
      ready: Promise.resolve({
        active: { postMessage: vi.fn() },
      }),
    },
  },
});

// Setup ResizeObserver mock
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as unknown as typeof ResizeObserver; 