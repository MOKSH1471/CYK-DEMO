import Lenis from 'lenis';

let globalLenis: Lenis | null = null;
const listeners = new Set<(lenis: Lenis) => void>();

export function setLenis(lenis: Lenis | null) {
  globalLenis = lenis;
  if (typeof window !== 'undefined') {
    (window as any).__lenis = lenis;
  }
  if (lenis) {
    listeners.forEach((cb) => cb(lenis));
  }
}

export function getLenis(): Lenis | null {
  if (typeof window !== 'undefined' && (window as any).__lenis) {
    return (window as any).__lenis;
  }
  return globalLenis;
}

export function onLenisReady(cb: (lenis: Lenis) => void): () => void {
  const current = getLenis();
  if (current) {
    cb(current);
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
