/**
 * Decorative gilt arch — RN port of `lib/widgets/gilt_arch.dart`.
 *
 * Caps the top and bottom of the central dial column. Pure SVG path: a
 * shallow arc spanning the column's width with a gilt stroke, plus a
 * small bindu-dot at the apex.
 *
 * All stroke widths and the bindu radius now scale proportionally with
 * the arch dimensions so the ornament looks correct on any device.
 */

import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme';

interface Props {
  width: number;
  height: number;
  /** 'up' = apex points up (top cap), 'down' = apex points down (bottom). */
  direction?: 'up' | 'down';
}

export function GiltArch({ width, height, direction = 'up' }: Props): JSX.Element {
  // Derive a scale factor from the arch width — the reference design
  // targets ~200px width, so strokeWidths of 1.5 / 0.7 match at that size.
  const archScale = Math.max(0.4, width / 200);

  // A simple quadratic-curve arch. Apex at midpoint, baseline at edges.
  const apexY = direction === 'up' ? 0 : height;
  const baseY = direction === 'up' ? height : 0;
  const d = `M 0 ${baseY} Q ${width / 2} ${apexY} ${width} ${baseY}`;
  const apexCircleY = direction === 'up' ? height * 0.18 : height * 0.82;
  return (
    <Svg width={width} height={height}>
      <Path
        d={d}
        fill="none"
        stroke={colors.giltLight}
        strokeWidth={1.5 * archScale}
        strokeLinecap="round"
      />
      <Path
        d={d}
        fill="none"
        stroke={colors.giltDeep}
        strokeWidth={0.7 * archScale}
        strokeLinecap="round"
        opacity={0.5}
        transform={`translate(0, ${direction === 'up' ? 4 * archScale : -4 * archScale})`}
      />
      {/* Apex bindu dot. */}
      <Circle cx={width / 2} cy={apexCircleY} r={2.5 * archScale} fill={colors.bindu} />
    </Svg>
  );
}
