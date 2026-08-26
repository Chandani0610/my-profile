// hooks/useThemeColors.js
import { useTheme } from '../context/ThemeContext';

export const useThemeColors = () => {
  const { themeColors } = useTheme();
  return themeColors;
};