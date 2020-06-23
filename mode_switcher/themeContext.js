import React from 'react';

export const themes = {
  light: {
    foreground: '#444',
    background: '#fff',
  },
  dark: {
    foreground: '#ddd',
    background: '#222',
  },
};

export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => { }
})