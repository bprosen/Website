export interface VantaEffect {
  destroy?: () => void;
}

interface VantaNetConfig {
  el: HTMLElement;
  gyroControls: boolean;
  maxDistance: number;
  minHeight: number;
  minWidth: number;
  mouseControls: boolean;
  scale: number;
  scaleMobile: number;
  showDots: boolean;
  spacing: number;
  touchControls: boolean;
  backgroundColor?: number | string;
  color?: number | string;
}

interface VantaLibrary {
  NET: (config: VantaNetConfig) => VantaEffect;
}

declare global {
  interface Window {
    VANTA?: VantaLibrary;
  }
}
