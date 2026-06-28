/**
 * Wing-card widget mount tests — RN port of the Flutter Phase 8a wing
 * card invariants. Left wing carries the moon-driven readings (tithi /
 * nakshatra / moon-rashi); right wing carries the sun-driven readings
 * (sun-rashi / yoga / karana) plus the lunar-month gloss.
 */

import { render } from '@testing-library/react-native';
import React from 'react';
import { LeftWing, RightWing } from '../src/components/Wings';
import { stubState } from './helpers/stubState';

describe('LeftWing', () => {
  it('renders the yoga info', () => {
    const { getByText } = render(<LeftWing state={stubState()} />);
    expect(getByText('योग : साध्य')).toBeTruthy();
  });
});

describe('RightWing', () => {
  it('renders the karana info with chara label', () => {
    const { getByText } = render(<RightWing state={stubState()} />);
    expect(getByText('करण : विष्टि')).toBeTruthy();
    expect(getByText('चर')).toBeTruthy();
  });
});
