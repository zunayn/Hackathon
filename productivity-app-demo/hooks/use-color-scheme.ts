import { useColorScheme as useSystemScheme } from 'react-native';

export type ColorScheme = 'light' | 'dark';

export function useColorScheme(): ColorScheme | null {
  const scheme = useSystemScheme();
  return scheme ?? 'light';
}
