/**
 * LocationPromptScreen — shown once on first launch when no saved
 * location is found. Offers two paths:
 *   1. "Use Current Location" — requests GPS via expo-location
 *   2. "Enter Manually" — text inputs for latitude & longitude
 *
 * Styled to match the Vedic Clock's premium dark-gold aesthetic.
 */

import React, { useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import { LocationConfig, DEFAULT_LOCATION } from '../config';
import { colors } from '../theme';

interface Props {
  onLocationSelected: (loc: LocationConfig) => void;
}

export function LocationPromptScreen({ onLocationSelected }: Props): JSX.Element {
  const [showManual, setShowManual] = useState(false);
  const [cityName, setCityName] = useState('');
  const [latText, setLatText] = useState('');
  const [lonText, setLonText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Spinner animation for the GPS loading state
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
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

  async function handleGPS() {
    setErrorMessage(null);
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Location permission denied. Please enter your coordinates manually below.');
        setShowManual(true);
        setLoading(false);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Try reverse geocoding to get city name
      let city = `${pos.coords.latitude.toFixed(2)}°N, ${pos.coords.longitude.toFixed(2)}°E`;
      try {
        const [place] = await Location.reverseGeocodeAsync({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        if (place?.city) {
          city = place.city;
        } else if (place?.subregion) {
          city = place.subregion;
        }
      } catch {
        // Offline — fall back to coordinate string
      }

      const loc: LocationConfig = {
        city,
        cityHi: city,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        heightMeters: pos.coords.altitude ?? DEFAULT_LOCATION.heightMeters,
      };
      onLocationSelected(loc);
    } catch (e) {
      setErrorMessage('Unable to fetch location. Please enter your coordinates manually or check your device settings.');
      setShowManual(true);
      console.warn('LocationPromptScreen: GPS error', e);
    } finally {
      setLoading(false);
    }
  }

  function handleManualSubmit() {
    setErrorMessage(null);
    const lat = parseFloat(latText);
    const lon = parseFloat(lonText);
    if (isNaN(lat) || isNaN(lon) || latText.trim() === '' || lonText.trim() === '') {
      setErrorMessage('Please enter valid numbers for both latitude and longitude.');
      return;
    }
    if (lat < 6 || lat > 38 || lon < 68 || lon > 98) {
      setErrorMessage('Coordinates are outside India. Please enter values within Lat: 6°–38°N, Lon: 68°–98°E.');
      return;
    }
    const city = cityName.trim() || `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;
    const loc: LocationConfig = {
      city,
      cityHi: city,
      latitude: lat,
      longitude: lon,
      heightMeters: DEFAULT_LOCATION.heightMeters,
    };
    onLocationSelected(loc);
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Animated.View
          style={[styles.spinnerRing, { transform: [{ rotate: spin }] }]}
        />
        <View style={styles.innerCircle} />
        <Text style={styles.loadingText}>Fetching Location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>विक्रमादित्य वैदिक घड़ी</Text>
      <Text style={styles.subtitle}>Set Your Location</Text>
      <Text style={styles.description}>
        The clock needs your location to calculate accurate sunrise, sunset, and panchang timings.
      </Text>

      {/* Inline Error Banner */}
      {errorMessage && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {/* GPS Button */}
      <TouchableOpacity style={styles.gpsButton} onPress={handleGPS} activeOpacity={0.8}>
        <Text style={styles.gpsButtonIcon}>📍</Text>
        <Text style={styles.gpsButtonText}>Use Current Location</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Manual Entry */}
      {!showManual ? (
        <TouchableOpacity
          style={styles.manualToggle}
          onPress={() => setShowManual(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.manualToggleText}>Enter Coordinates Manually</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.manualForm}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>City Name</Text>
            <TextInput
              style={styles.input}
              value={cityName}
              onChangeText={(t) => { setCityName(t); setErrorMessage(null); }}
              placeholder="e.g. Indore"
              placeholderTextColor={colors.inkMuted}
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Latitude (°N)</Text>
            <TextInput
              style={styles.input}
              value={latText}
              onChangeText={(t) => { setLatText(t); setErrorMessage(null); }}
              placeholder="e.g. 22.7196"
              placeholderTextColor={colors.inkMuted}
              keyboardType="numeric"
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Longitude (°E)</Text>
            <TextInput
              style={styles.input}
              value={lonText}
              onChangeText={(t) => { setLonText(t); setErrorMessage(null); }}
              placeholder="e.g. 75.8577"
              placeholderTextColor={colors.inkMuted}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleManualSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Set Location</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgDeep,
    paddingHorizontal: 32,
  },
  title: {
    fontFamily: 'TiroDevanagariHindi_400Regular',
    fontSize: 32,
    color: colors.highlight,
    marginBottom: 8,
    textShadowColor: 'rgba(232, 185, 75, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 22,
    color: colors.ink,
    marginBottom: 12,
    letterSpacing: 1,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.inkMuted,
    textAlign: 'center',
    maxWidth: 400,
    marginBottom: 40,
    lineHeight: 20,
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgLiftHi,
    borderWidth: 1.5,
    borderColor: colors.highlight,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 24,
    shadowColor: colors.highlight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  gpsButtonIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  gpsButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: colors.highlight,
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    width: '80%',
    maxWidth: 350,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.pinstripe,
  },
  dividerText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: colors.inkMuted,
    marginHorizontal: 16,
    letterSpacing: 2,
  },
  manualToggle: {
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  manualToggleText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: colors.inkMuted,
    letterSpacing: 0.5,
  },
  manualForm: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  inputRow: {
    width: '100%',
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: colors.inkMuted,
    marginBottom: 6,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    color: colors.ink,
    borderWidth: 1.5,
    borderColor: colors.glassBorderHi,
    borderRadius: 10,
    backgroundColor: colors.bgLift,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  submitButton: {
    backgroundColor: colors.highlight,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 8,
    shadowColor: colors.highlight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  submitButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
    color: colors.bgDeep,
    letterSpacing: 1,
  },
  // Loading/spinner states
  spinnerRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: colors.bgLiftHi,
    borderTopColor: colors.highlight,
    borderRightColor: colors.highlightSoft,
    position: 'absolute',
  },
  innerCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.bgDeep,
    position: 'absolute',
  },
  loadingText: {
    marginTop: 120,
    fontFamily: 'Inter_500Medium',
    fontSize: 20,
    color: colors.highlight,
    letterSpacing: 1,
  },
  // Inline error banner
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(192, 72, 72, 0.15)',
    borderWidth: 1,
    borderColor: colors.ashubha,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 24,
    maxWidth: 460,
  },
  errorIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.ashubha,
    flex: 1,
    lineHeight: 20,
  },
});
