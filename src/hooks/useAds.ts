import { useEffect, useState } from 'preact/hooks';

// Define the global AdSense/Google Ad Manager types
declare global {
  interface Window {
    adsbygoogle?: any[];
    googletag?: {
      cmd: any[];
      defineSlot?: (adUnitPath: string, size: number[], divId: string) => any;
      pubads?: () => any;
      enableServices?: () => void;
      display?: (divId: string) => void;
    };
  }
}

export function useAds() {
  const [adsInitialized, setAdsInitialized] = useState(false);
  const [interstitialReady, setInterstitialReady] = useState(false);
  
  // Initialize AdSense once per session
  useEffect(() => {
    if (adsInitialized) return;
    
    // Initialize Google Ad Manager
    if (!window.googletag) {
      window.googletag = { cmd: [] as any[] };
    }
    
    // Load the Google Publisher Tag library
    const script = document.createElement('script');
    script.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
    script.async = true;
    script.onload = () => {
      window.googletag?.cmd.push(() => {
        window.googletag?.enableServices?.();
        setAdsInitialized(true);
      });
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Clean up only if necessary
    };
  }, [adsInitialized]);
  
  // Function to initialize banner ad in a specific container
  const initBannerAd = (containerId: string, adUnitId: string = '/6355419/Travel/Europe/France/Paris') => {
    const googletag = window.googletag;
    if (!googletag || !googletag.defineSlot || !googletag.pubads || !googletag.display) return;
    
    googletag.cmd.push(() => {
      // Define the ad slot
      const slot = googletag.defineSlot?.(adUnitId, [300, 250], containerId);
      slot?.addService(googletag.pubads?.());
      
      // Display the ad
      googletag.display?.(containerId);
    });
  };
  
  // Function to show interstitial ad after quiz completion
  const showInterstitial = () => {
    const googletag = window.googletag;
    if (!googletag) return;
    
    // Only show interstitial after quiz completion, per policy requirements
    googletag.cmd.push(() => {
      // Here we would normally trigger the interstitial
      // For demonstration, we're just logging it
      console.log('Interstitial ad would be displayed here');
      setInterstitialReady(true);
    });
  };
  
  // Function to request rewarded video (optional feature)
  const showRewardedVideo = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!window.googletag) {
        resolve(false);
        return;
      }
      
      // In a real implementation, we would show a rewarded video here
      // For demonstration, we simulate a successful view
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  };
  
  // Function to check if device is likely using an ad blocker
  const isAdBlockerActive = (): boolean => {
    return !window.googletag || document.querySelector('.ad-container')?.clientHeight === 0;
  };
  
  return {
    adsInitialized,
    interstitialReady,
    initBannerAd,
    showInterstitial,
    showRewardedVideo,
    isAdBlockerActive
  };
} 