import React from 'react';
import { Text, View } from 'react-native';
import { ThemeContext } from './themeContext'

function ThemeTogglerButton() {
  return (
    <ThemeContext.Consumer>
      {({ theme, toggleTheme }) => (
        <Text
          onPress={toggleTheme}
          style={theme}
          >
          Change Theme
        </Text>
      )}
    </ThemeContext.Consumer>
  )
}
export default ThemeTogglerButton