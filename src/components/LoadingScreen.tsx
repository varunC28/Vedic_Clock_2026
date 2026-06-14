import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, Text } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { colors } from '../theme';

export function LoadingScreen(): JSX.Element {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;
  const scale = isPortrait
    ? Math.max(0.5, width / 414)
    : Math.max(0.5, width / 1024);

  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const ringSize = 120 * scale;
  const innerSize = 104 * scale;

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.bgDeep,
    }}>
      <Animated.View
        style={{
          width: ringSize,
          height: ringSize,
          borderRadius: ringSize / 2,
          borderWidth: 8 * scale,
          borderColor: colors.bgLiftHi,
          borderTopColor: colors.highlight,
          borderRightColor: colors.highlightSoft,
          position: 'absolute',
          transform: [{ rotate: spin }],
        }}
      />
      <View style={{
        width: innerSize,
        height: innerSize,
        borderRadius: innerSize / 2,
        backgroundColor: colors.bgDeep,
        position: 'absolute',
      }} />
      <Text style={{
        marginTop: 200 * scale,
        color: colors.highlight,
        fontFamily: 'Inter_500Medium', // Or standard system font if Inter isn't loaded yet
        fontSize: 24 * scale,
        letterSpacing: 1 * scale,
      }}>Loading Vedic Clock...</Text>
    </View>
  );
}
