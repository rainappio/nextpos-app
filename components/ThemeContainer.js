import React, {useContext} from "react";
import {ThemeContext} from "../themes/ThemeContext";
import {View} from "react-native";
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'

export const ThemeContainer = ({children}) => {
  const themeContext = useContext(ThemeContext)
  const {customMainThemeColor, customSecondThemeColor, customBackgroundColor} = useContext(LocaleContext)

  return (
    <View style={[styles.mainContainer, themeContext.themeStyle, (customMainThemeColor === '#006B35' && {backgroundColor: customBackgroundColor})]}>
      {children}
    </View>
  )
}
