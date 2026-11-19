import { getLenis } from './lenis';

export interface FlightState {
  pFlight: number;
  isInFlight: boolean;
  activeStopIndex: number;
  activeStopNumber: string;
  activeStopTitle: string;
}

export const FLIGHT_STOPS_META = [
  { id: 0, number: '01', title: 'The Idea' },
  { id: 1, number: '02', title: 'The Numbers' },
  { id: 2, number: '03', title: 'The Place' },
  { id: 3, number: '04', title: 'The Menu & Kitchen' },
  { id: 4, number: '05', title: 'The Brand & Space' },
  { id: 5, number: '06', title: 'The Team' },
  { id: 6, number: '07', title: 'The Launch' },
  { id: 7, number: '08', title: 'The Scale' }
];

let currentState: FlightState = {
  pFlight: 0,
  isInFlight: false,
  activeStopIndex: 0,
  activeStopNumber: '01',
  activeStopTitle: 'The Idea'
};

const listeners = new Set<(state: FlightState) => void>();

export function updateFlightState(pFlight: number, isInFlight: boolean) {
  // 8 stops: calculate active stop index
  const totalSegments = 7;
  const startHold = 0.04;
  const endHold = 0.06;

  let stopIdx = 0;
  if (pFlight <= startHold) {
    stopIdx = 0;
  } else if (pFlight >= 1.0 - endHold) {
    stopIdx = 7;
  } else {
    const effective = (pFlight - startHold) / (1.0 - startHold - endHold);
    stopIdx = Math.min(7, Math.max(0, Math.round(effective * totalSegments)));
  }

  const meta = FLIGHT_STOPS_META[stopIdx] || FLIGHT_STOPS_META[0];

  currentState = {
    pFlight,
    isInFlight,
    activeStopIndex: stopIdx,
    activeStopNumber: meta.number,
    activeStopTitle: meta.title
  };

  listeners.forEach((cb) => cb(currentState));
}

export function getFlightState(): FlightState {
  return currentState;
}

export function subscribeFlightState(cb: (state: FlightState) => void): () => void {
  cb(currentState);
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/**
 * Scroll to a specific flight stop by index (0-7)
 */
export function scrollToFlightStop(stopIndex: number) {
  const container = document.getElementById('journey');
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const currentScroll = window.scrollY || document.documentElement.scrollTop;
  const containerTop = rect.top + currentScroll;
  const containerHeight = container.offsetHeight;
  const vh = window.innerHeight;

  const totalScrollRange = containerHeight - vh;
  if (totalScrollRange <= 0) return;

  // Hero portion ratio = 180 / 1260 = 0.142857
  const HERO_PORTION_RATIO = 180 / 1260;
  const startHold = 0.04;
  const endHold = 0.06;

  let rawFlightProgress = 0;
  if (stopIndex === 0) {
    rawFlightProgress = 0.02;
  } else if (stopIndex >= 7) {
    rawFlightProgress = 0.96;
  } else {
    rawFlightProgress = startHold + (stopIndex / 7) * (1.0 - startHold - endHold);
  }

  const targetGlobalProgress = HERO_PORTION_RATIO + rawFlightProgress * (1 - HERO_PORTION_RATIO);
  const targetScrollY = containerTop + targetGlobalProgress * totalScrollRange;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(targetScrollY, { duration: 1.1 });
  } else {
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  }
}
