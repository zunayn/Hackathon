/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type ThemeProps = { light?: string; dark?: string };

// Return a themed color by name, allowing per-theme overrides via props.
export function useThemeColor(
  props: ThemeProps,
  colorName: keyof typeof Colors.light
): string {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];
  if (colorFromProps) return colorFromProps;
  return Colors[theme][colorName];
}
