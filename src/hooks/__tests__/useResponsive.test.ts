import { renderHook } from '@testing-library/react-native';
import { useResponsive } from '../useResponsive';
import { useWindowDimensions } from 'react-native';

import * as ReactNative from 'react-native';

// Mock useWindowDimensions and PixelRatio safely without breaking core react-native modules
jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native');
  return Object.setPrototypeOf({
    useWindowDimensions: jest.fn(),
    PixelRatio: {
      ...rn.PixelRatio,
      getFontScale: jest.fn(() => 1),
    },
  }, rn);
});

describe('useResponsive Hook', () => {
  const mockedUseWindowDimensions = useWindowDimensions as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    { name: 'Mobile (Portrait)', width: 400, height: 800, expectedTier: 'mobile', expectedScale: 400 / 414 },
    { name: 'Tablet (Landscape)', width: 1024, height: 768, expectedTier: 'tablet', expectedScale: 1024 / 1024 },
    { name: 'Desktop (Landscape) (1440x1080)', width: 1440, height: 1080, expectedTier: 'desktop' },
    { name: 'TV (Landscape) (2560x1600)', width: 2560, height: 1600, expectedTier: 'tv' },
    { name: 'Billboard (Landscape) (5120x3200)', width: 5120, height: 3200, expectedTier: 'billboard' },
    { name: 'Small mobile threshold test', width: 320, height: 568, expectedTier: 'mobile', expectedScale: 320 / 414 },
  ];

  testCases.forEach(({ name, width, height, expectedTier, expectedScale }) => {
    it(`should return correct tier and scale for ${name} (${width}x${height})`, () => {
      mockedUseWindowDimensions.mockReturnValue({ width, height });

      const { result } = renderHook(() => useResponsive());

      // Because we cap scale minimums at 0.5 for both portrait and landscape
      const isPortrait = height > width;
      let finalExpectedScale = isPortrait ? Math.max(0.5, width / 414) : Math.max(0.5, width / 1024);

      expect(result.current.tier).toBe(expectedTier);
      expect(result.current.scale).toBeCloseTo(finalExpectedScale, 4);
      expect(result.current.isPortrait).toBe(isPortrait);
    });
  });

  it('should scale bar heights proportionally without upper bounds', () => {
    // Very wide TV
    mockedUseWindowDimensions.mockReturnValue({ width: 2048, height: 1152 }); // Scale should be 2048 / 1024 = 2.0
    const { result } = renderHook(() => useResponsive());
    
    expect(result.current.scale).toBe(2.0);
    expect(result.current.topBarHeight).toBe(128); // Math.max(40, 64 * 2) = 128
    expect(result.current.bottomStripHeight).toBe(128); // Math.max(40, 64 * 2) = 128
  });

  it('should not fall below minimum bar heights on extremely narrow screens', () => {
    // Test scale floor hitting 0.5
    mockedUseWindowDimensions.mockReturnValue({ width: 200, height: 400 }); // Portrait, scale max(0.5, 200/414) = 0.5
    const { result: verySmallResult } = renderHook(() => useResponsive());
    
    // Math.max(40, 64 * 0.5) = 40 (instead of 32)
    expect(verySmallResult.current.topBarHeight).toBe(40);
  });
});
