import { useWindowDimensions, PixelRatio } from 'react-native';

/**
 * Device tier classification based on the smaller screen dimension.
 * Used by components that need tier-specific layout decisions.
 */
export type DeviceTier = 'mobile' | 'tablet' | 'desktop' | 'tv' | 'billboard';

export interface ResponsiveConfig {
  width: number;
  height: number;
  isPortrait: boolean;
  scale: number;
  tier: DeviceTier;
  topBarHeight: number;
  sunBarHeight: number;
  bottomStripHeight: number;
  spacing: number;
  scaleFont: (size: number) => number;
}

export function useResponsive(): ResponsiveConfig {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  // Reference width for design scaling:
  // - Landscape target: 1024px
  // - Portrait target: 414px (typical mobile width)
  // No upper clamp — let the UI grow for TVs and ad boards.
  const scale = isPortrait
    ? Math.max(0.5, width / 414)
    : Math.max(0.5, width / 1024);

  // Device tier based on the smaller dimension
  const minDim = Math.min(width, height);
  const tier: DeviceTier =
    minDim < 600 ? 'mobile' :
    minDim < 1024 ? 'tablet' :
    minDim < 1600 ? 'desktop' :
    minDim < 3000 ? 'tv' : 'billboard';

  // Scaled bar heights — no upper clamp so they grow on TVs/billboards
  const topBarHeight = Math.max(40, 64 * scale);
  const sunBarHeight = Math.max(32, 48 * scale);
  const bottomStripHeight = Math.max(40, 64 * scale);

  // Fluid spacing factor
  const spacing = Math.max(4, 16 * scale);

  /**
   * Scales a font size dynamically by the screen scale factor, 
   * adjusted by the device's system-wide font accessibility scale.
   */
  const scaleFont = (size: number): number => {
    const fontScale = PixelRatio.getFontScale();
    return (size * scale) / fontScale;
  };

  return {
    width,
    height,
    isPortrait,
    scale,
    tier,
    topBarHeight,
    sunBarHeight,
    bottomStripHeight,
    spacing,
    scaleFont,
  };
}
