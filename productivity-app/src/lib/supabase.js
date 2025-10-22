// File: src/lib/supabase.js
import 'react-native-url-polyfill/auto'; // Required for Supabase to work in React Native
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native'; // Import Platform to check the OS

// Create a conditional storage adapter.
// On native platforms (iOS/Android), it uses SecureStore.
// On web, it's undefined, so Supabase will default to using localStorage.
const ExpoSecureStoreAdapter = Platform.OS !== 'web' ? {
  getItem: (key) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key, value) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key) => {
    SecureStore.deleteItemAsync(key);
  },
} : undefined;

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter, // Use the conditional adapter
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

