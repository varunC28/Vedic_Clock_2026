import React from 'react';
import { render } from '@testing-library/react-native';
import { DialCore } from '../DialCore';
import * as ResponsiveHook from '../../hooks/useResponsive';

jest.mock('../../hooks/useResponsive');
jest.mock('expo-av', () => ({
  Video: 'Video',
}));

describe('DialCore Responsiveness', () => {
  const mockState = {
    nowUtc: new Date(),
    todaySunrise: new Date(),
    todaySunset: new Date(),
    panchang: {
      tithi: { nameHi: 'प्रतिपदा' },
      nakshatra: { nameHi: 'अश्विनी' },
      yoga: { nameHi: 'विष्कुम्भ' },
      karana: { nameHi: 'बव' },
      vara: { nameHi: 'रविवार' },
    },
    muhurtas: [],
    zodiacSigns: [],
    todayFestival: null,
    vikramSamvatYear: 2083,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly on a mobile screen (scale 0.75)', () => {
    jest.spyOn(ResponsiveHook, 'useResponsive').mockReturnValue({
      scale: 0.75,
      tier: 'mobile',
      width: 414,
      height: 896,
      isPortrait: true,
      topBarHeight: 50,
      sunBarHeight: 40,
      bottomStripHeight: 50,
      spacing: 10,
      scaleFont: (size) => size * 0.75,
    });

    const { toJSON } = render(<DialCore state={mockState as any} size={300} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders correctly on a large TV screen (scale 2.0)', () => {
    jest.spyOn(ResponsiveHook, 'useResponsive').mockReturnValue({
      scale: 2.0,
      tier: 'tv',
      width: 1920,
      height: 1080,
      isPortrait: false,
      topBarHeight: 120,
      sunBarHeight: 100,
      bottomStripHeight: 120,
      spacing: 30,
      scaleFont: (size) => size * 2.0,
    });

    const { toJSON } = render(<DialCore state={mockState as any} size={900} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
