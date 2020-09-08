import React, {useContext} from "react";
import {ThemeContext} from "../themes/ThemeContext";
import {ScrollView} from "react-native";

export const ThemeScrollView = ({refreshControl, style, children, reverse = false}) => {
  const themeContext = useContext(ThemeContext)
  const themeStyle = reverse ? themeContext.themeStyleReverse : themeContext.themeStyle

  const passedStyles = Array.isArray(style) ? style : [style]

  return (
    <ScrollView scrollIndicatorInsets={{right: 1}} style={[...passedStyles, themeStyle]} contentContainerStyle={[themeStyle, {flexGrow: 1}]} refreshControl={refreshControl}>
      {children}
    </ScrollView>
  )
}
