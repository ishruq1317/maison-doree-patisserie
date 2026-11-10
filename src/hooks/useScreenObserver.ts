import { useState, useEffect, useCallback } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'ultrawide';
export type ScreenOrientation = 'portrait' | 'landscape';

export interface ScreenObserverState {
  width: number;
  height: number;
  aspectRatio: number;
  aspectRatioLabel: string;
  orientation: ScreenOrientation;
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isUltrawide: boolean;
  isTouch: boolean;
}

const getScreenState = (): ScreenObserverState => {
  if (typeof window === 'undefined') {
    return {
      width: 1280,
      height: 800,
      aspectRatio: 1.6,
      aspectRatioLabel: '16:10',
      orientation: 'landscape',
      deviceType: 'desktop',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isUltrawide: false,
      isTouch: false,
    };
  }

  const width = window.innerWidth || 1280;
  const height = window.innerHeight || 800;
  const rawRatio = width / (height || 1);

  let aspectRatioLabel = '16:9';
  if (rawRatio < 0.65) aspectRatioLabel = '9:16';
  else if (rawRatio < 0.85) aspectRatioLabel = '3:4';
  else if (rawRatio < 1.15) aspectRatioLabel = '1:1';
  else if (rawRatio < 1.45) aspectRatioLabel = '4:3';
  else if (rawRatio < 1.7) aspectRatioLabel = '16:10';
  else if (rawRatio < 2.1) aspectRatioLabel = '16:9';
  else aspectRatioLabel = '21:9';

  const orientation: ScreenOrientation = height > width ? 'portrait' : 'landscape';
  const isTouch = typeof navigator !== 'undefined' && (navigator.maxTouchPoints > 0 || 'ontouchstart' in window);

  let deviceType: DeviceType = 'desktop';
  if (width < 768 || (height < 500 && orientation === 'landscape' && isTouch)) {
    deviceType = 'mobile';
  } else if (width < 1024 || (isTouch && width < 1200)) {
    deviceType = 'tablet';
  } else if (width < 1600 && rawRatio < 2.1) {
    deviceType = 'desktop';
  } else {
    deviceType = 'ultrawide';
  }

  return {
    width,
    height,
    aspectRatio: parseFloat(rawRatio.toFixed(2)),
    aspectRatioLabel,
    orientation,
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop' || deviceType === 'ultrawide',
    isUltrawide: deviceType === 'ultrawide',
    isTouch,
  };
};

export const useScreenObserver = (): ScreenObserverState => {
  const [screenState, setScreenState] = useState<ScreenObserverState>(getScreenState);

  const handleResize = useCallback(() => {
    setScreenState(getScreenState());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Trigger immediate update
    handleResize();

    let animationFrameId: number;
    const throttledResize = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleResize);
    };

    window.addEventListener('resize', throttledResize, { passive: true });
    window.addEventListener('orientationchange', throttledResize, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', throttledResize);
      window.removeEventListener('orientationchange', throttledResize);
    };
  }, [handleResize]);

  return screenState;
};

export default useScreenObserver;
