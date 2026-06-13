import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, Text } from 'react-native';
import { colors } from '../theme';

export function LoadingScreen(): JSX.Element {
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

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spinnerRing,
          { transform: [{ rotate: spin }] },
        ]}
      />
      <View style={styles.innerCircle} />
      <Text style={styles.text}>Loading Vedic Clock...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgDeep,
  },
  spinnerRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: colors.bgLiftHi,
    borderTopColor: colors.highlight,
    borderRightColor: colors.highlightSoft,
    position: 'absolute',
  },
  innerCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.bgDeep,
    position: 'absolute',
  },
  text: {
    marginTop: 200,
    color: colors.highlight,
    fontFamily: 'Inter_500Medium', // Or standard system font if Inter isn't loaded yet
    fontSize: 24,
    letterSpacing: 1,
  },
});
