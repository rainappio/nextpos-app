import React from 'react';

/**
 * https://stackoverflow.com/questions/53988193/how-to-get-multiple-static-contexts-in-new-context-api-in-react-v16-6
 * https://stackoverflow.com/questions/53346462/react-multiple-contexts/53346541
 */
export const themes = {
  light: {
    color: '#444',
    backgroundColor: '#fff',
    borderColor: '#e7e7e7',
    shadowColor: '#222222',

  },
  dark: {
    color: '#e7e7e7',
    backgroundColor: '#222222',
    borderColor: '#e7e7e7',
    shadowColor: '#e7e7e7',

  },
}

export const complexTheme = {
  light: {
    overlay: {
      color: '#f5f5f5',
      backgroundColor: '#222222',
    },
    shade: {
      backgroundColor: '#f5f5f5'
    },
    invalid: {
      color: '#727272'
    }
  },
  dark: {
    overlay: {
      color: '#444',
      backgroundColor: '#fff',
    },
    shade: {
      backgroundColor: '#4a4747'
    },
    invalid: {
      color: '#969696'
    }
  }
}

export const ThemeContext = React.createContext({
  theme: 'light',
  themeStyle: themes.dark,
  themeStyleReverse: themes.light,
  complexTheme: complexTheme.light,
  toggleTheme: () => {
  }
})
