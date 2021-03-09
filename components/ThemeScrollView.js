import React, {useContext} from "react";
import {ThemeContext} from "../themes/ThemeContext";
import {ScrollView} from "react-native";
import {LocaleContext} from '../locales/LocaleContext'

export const ThemeScrollView = ({refreshControl, style, children, reverse = false}) => {
  const themeContext = useContext(ThemeContext)
  const {customMainThemeColor, customSecondThemeColor, customBackgroundColor} = useContext(LocaleContext)
  const themeStyle = reverse ? themeContext.themeStyleReverse : themeContext.themeStyle
  const passedStyles = Array.isArray(style) ? style : [style]

  return (
    <ScrollView scrollIndicatorInsets={{right: 1}} style={[...passedStyles, themeStyle, (customMainThemeColor === '#006B35' && {backgroundColor: customBackgroundColor})]} contentContainerStyle={[themeStyle, {flexGrow: 1}, (customMainThemeColor === '#006B35' && {backgroundColor: customBackgroundColor})]} refreshControl={refreshControl}>
      {children}
    </ScrollView>
  )
}
