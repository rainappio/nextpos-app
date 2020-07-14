import React from "react";
import {ThemeContext, themes} from "../themes/ThemeContext";
import {LocaleContext} from "../locales/LocaleContext";
import {AsyncStorage} from "react-native";

export const withContext = (Component) => {

  return class extends React.Component {
    static navigationOptions = {
      header: null
    }

    constructor(props) {
      super(props);
    }

    render() {
      return (
        <ThemeContext.Consumer>
          {themeContext => (
            <LocaleContext.Consumer>
              {localeContext => (
                <Component
                  theme={themeContext.theme}
                  themeStyle={themeContext.themeStyle}
                  complexTheme={themeContext.complexTheme}
                  toggleTheme={themeContext.toggleTheme}
                  locale={localeContext}
                  {...this.props} />
              )}
            </LocaleContext.Consumer>
          )}
        </ThemeContext.Consumer>
      )
    }
  }
}

export const getTheme = async () => {
  let theme = await AsyncStorage.getItem('theme')

  if (theme == null) {
    theme = 'light'
  }

  return theme
}

export const storeTheme = async (theme) => {
  await AsyncStorage.setItem('theme', theme)
}
