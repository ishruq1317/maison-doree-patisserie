import { useState, useEffect } from 'react';

declare const process: { env?: { NODE_ENV?: string } } | undefined;

// Browser-safe test environment detector
const isTestEnv = (): boolean => {
  try {
    if (typeof window !== 'undefined' && (window as any).__VITEST__) return true;
    if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'test') return true;
    if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.MODE === 'test') return true;
  } catch {
    // ignore
  }
  return false;
};

const prefersReducedMotion = (): boolean => {
  try {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  } catch {
    // ignore
  }
  return false;
};

export const useTypewriter = (text: string, speedMs: number = 22, delayMs: number = 60) => {
  const isTest = isTestEnv();
  const shouldSkipAnimation = isTest || prefersReducedMotion();

  const [displayedText, setDisplayedText] = useState(shouldSkipAnimation ? text : '');
  const [isComplete, setIsComplete] = useState(shouldSkipAnimation);

  useEffect(() => {
    if (shouldSkipAnimation || !text) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);

    let currentIndex = 0;
    let timer: ReturnType<typeof setInterval>;

    const startTimeout = setTimeout(() => {
      timer = setInterval(() => {
        if (currentIndex < text.length) {
          currentIndex++;
          setDisplayedText(text.slice(0, currentIndex));
        } else {
          setIsComplete(true);
          clearInterval(timer);
        }
      }, speedMs);
    }, delayMs);

    return () => {
      clearTimeout(startTimeout);
      if (timer) clearInterval(timer);
    };
  }, [text, speedMs, delayMs, shouldSkipAnimation]);

  return { displayedText, isComplete };
};

export default useTypewriter;
