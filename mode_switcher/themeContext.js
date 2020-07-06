import React from 'react';

export const themes = {
  light: {
    color: '#444',
    backgroundColor: '#fff',
  },
  dark: {
    color: '#fff',
    backgroundColor: '#222',
  },
};

export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {}
})