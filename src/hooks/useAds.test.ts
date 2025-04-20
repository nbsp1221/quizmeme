import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/preact';
import { useAds } from './useAds';

describe('useAds', () => {
  let scriptElement: any;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock window.googletag
    Object.defineProperty(window, 'googletag', {
      value: {
        cmd: [],
        enableServices: vi.fn(),
        defineSlot: vi.fn().mockReturnValue({
          addService: vi.fn().mockReturnThis(),
        }),
        pubads: vi.fn().mockReturnThis(),
        display: vi.fn(),
      },
      configurable: true,
    });
    
    // Create a mock script element
    scriptElement = {
      src: '',
      async: false,
      onload: null,
    };
    
    // Mock document.createElement to return our mock script element
    document.createElement = vi.fn().mockReturnValue(scriptElement);
    
    // Mock document.head.appendChild to call the onload handler
    document.head.appendChild = vi.fn().mockImplementation((script) => {
      if (script && script.onload && typeof script.onload === 'function') {
        // Wait a tick before calling onload
        setTimeout(() => script.onload(), 0);
      }
      return script;
    });
  });

  it('should initialize ads on first call', () => {
    const { result } = renderHook(() => useAds());
    
    // Should not be initialized initially
    expect(result.current.adsInitialized).toBe(false);
    
    // Check script element creation
    expect(document.createElement).toHaveBeenCalledWith('script');
    expect(scriptElement.src).toBe('https://securepubads.g.doubleclick.net/tag/js/gpt.js');
    expect(scriptElement.async).toBe(true);
    
    // Manually trigger the script onload since our mock doesn't auto-trigger
    if (scriptElement.onload) {
      scriptElement.onload();
    }
    
    // Execute commands in googletag.cmd
    if (window.googletag && window.googletag.cmd) {
      window.googletag.cmd.forEach(cmd => {
        if (typeof cmd === 'function') cmd();
      });
    }
    
    // Check if services were enabled
    const googletag = window.googletag;
    expect(googletag && googletag.enableServices).toHaveBeenCalled();
    
    // Check if adsInitialized was set to true after the onload callback
    act(() => {
      // Force a state update to see the change
      result.current.initBannerAd('test');
    });
    
    expect(result.current.adsInitialized).toBe(true);
  });

  it('should initialize banner ad in specified container', () => {
    const { result } = renderHook(() => useAds());
    
    // Manually trigger initialization
    if (scriptElement.onload) {
      scriptElement.onload();
    }
    
    // Call initBannerAd with a container ID
    act(() => {
      result.current.initBannerAd('test-container', 'test-ad-unit');
    });
    
    // Manually execute googletag commands
    if (window.googletag && window.googletag.cmd) {
      window.googletag.cmd.forEach(cmd => {
        if (typeof cmd === 'function') cmd();
      });
    }
    
    // Check if the slot was defined with correct parameters
    const googletag = window.googletag;
    expect(googletag && googletag.defineSlot).toHaveBeenCalledWith(
      'test-ad-unit',
      [300, 250],
      'test-container'
    );
    
    // Check if the display function was called
    expect(googletag && googletag.display).toHaveBeenCalledWith('test-container');
  });

  it('should show interstitial ad', () => {
    const { result } = renderHook(() => useAds());
    
    // Mock console.log to check logged messages
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    // Call showInterstitial
    act(() => {
      result.current.showInterstitial();
    });
    
    // Manually execute googletag commands
    if (window.googletag && window.googletag.cmd) {
      window.googletag.cmd.forEach(cmd => {
        if (typeof cmd === 'function') cmd();
      });
    }
    
    // Check if the log message for interstitial display was shown
    expect(consoleLogSpy).toHaveBeenCalledWith('Interstitial ad would be displayed here');
    
    // Check if interstitialReady is set to true
    expect(result.current.interstitialReady).toBe(true);
    
    // Clean up
    consoleLogSpy.mockRestore();
  });

  it('should detect ad blocker presence', () => {
    // Mock document.querySelector to simulate ad blocker (return null height)
    document.querySelector = vi.fn().mockReturnValue({
      clientHeight: 0,
    }) as any;
    
    const { result } = renderHook(() => useAds());
    
    // Check ad blocker detection
    expect(result.current.isAdBlockerActive()).toBe(true);
    
    // Change mock to simulate no ad blocker
    document.querySelector = vi.fn().mockReturnValue({
      clientHeight: 250,
    }) as any;
    
    // Re-render the hook
    const { result: updatedResult } = renderHook(() => useAds());
    
    // Should now detect no ad blocker
    expect(updatedResult.current.isAdBlockerActive()).toBe(false);
  });

  it('should resolve promise when showing rewarded video', async () => {
    const { result } = renderHook(() => useAds());
    
    // Create a timer mock
    vi.useFakeTimers();
    
    // Start the rewarded video (returns a promise)
    const rewardPromise = result.current.showRewardedVideo();
    
    // Fast-forward timers to resolve the promise
    vi.advanceTimersByTime(1000);
    
    // Await the promise
    const rewardResult = await rewardPromise;
    
    // Should resolve to true
    expect(rewardResult).toBe(true);
    
    // Clean up
    vi.useRealTimers();
  });
}); 