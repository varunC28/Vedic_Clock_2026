/**
 * Hook that manages the user's location — loads from AsyncStorage on mount,
 * and exposes a `saveLocation` callback for the LocationPromptScreen.
 *
 * When no saved location is found, returns `null` so App.tsx knows to
 * show the prompt. Once a location is saved, it calls `setLocation()`
 * on the solar module so all astronomy calculations use the new coords.
 */

import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationConfig, DEFAULT_LOCATION } from '../config';
import { setLocation } from '../core/solar';

const STORAGE_KEY = 'vedic_clock_location';

export function useLocation() {
  const [location, setLocationState] = useState<LocationConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check AsyncStorage for a previously saved location.
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: LocationConfig = JSON.parse(stored);
          setLocation(parsed);       // Update the solar module observer
          setLocationState(parsed);
        }
      } catch (e) {
        console.warn('useLocation: failed to read stored location', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Persist a new location to AsyncStorage and update the solar observer.
  const saveLocation = useCallback(async (loc: LocationConfig) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    } catch (e) {
      console.warn('useLocation: failed to persist location', e);
    }
    setLocation(loc);          // Update the solar module observer
    setLocationState(loc);     // Trigger re-render
  }, []);

  // Clear the saved location — takes the user back to the prompt screen.
  const clearLocation = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('useLocation: failed to clear location', e);
    }
    setLocationState(null);
  }, []);

  return { location, isLoading, saveLocation, clearLocation };
}
