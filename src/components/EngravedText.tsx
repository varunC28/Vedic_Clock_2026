import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * EngravedText — 3-layer text effect simulating a carved gold inscription.
 *
 * Accepts `fontSize` as a prop — all shadow radii and offsets now scale
 * proportionally with the font size for consistent rendering on any device.
 */
export function EngravedText({ text, fontSize }: { text: string; fontSize: number }) {
  // Derive shadow sizes relative to fontSize for proportional scaling
  const shadowScale = fontSize / 28; // normalised to the reference design's 28px

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: fontSize * 1.5 }}>
      {/* Outer soft fog glow */}
      <Text style={[styles.baseText, { fontSize, textShadowRadius: 12 * shadowScale, textShadowColor: 'rgba(255, 140, 0, 0.5)', textShadowOffset: { width: 0, height: 0 } }]}>
        {text}
      </Text>
      {/* Deep shadow simulating the carved recess */}
      <Text style={[styles.baseText, { position: 'absolute', fontSize, textShadowRadius: 2 * shadowScale, textShadowColor: 'rgba(0,0,0,0.95)', textShadowOffset: { width: 0, height: 2 * shadowScale } }]}>
        {text}
      </Text>
      {/* Bright illuminated face */}
      <Text style={[styles.baseText, { position: 'absolute', fontSize, color: '#FFF5D1', textShadowColor: 'rgba(255, 255, 255, 0.4)', textShadowRadius: 2 * shadowScale, textShadowOffset: { width: 0, height: 0 } }]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  baseText: {
    color: '#FFE8A1',
    fontWeight: 'bold',
    letterSpacing: 2,
    includeFontPadding: false,
    fontVariant: ['tabular-nums'],
  }
});
