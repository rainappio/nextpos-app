import React, {useContext} from "react";
import {ThemeContext} from "../themes/ThemeContext";
import {ScrollView, View} from "react-native";
import styles from '../styles'

export const ThemeScrollView = ({refreshControl, style, children}) => {
  const themeContext = useContext(ThemeContext)
  const themeStyle = themeContext.themeStyle

  const passedStyles = Array.isArray(style) ? style : [style]

  return (
    <ScrollView scrollIndicatorInsets={{right: 1}} style={[...passedStyles, themeStyle]} contentContainerStyle={[themeStyle, {flexGrow: 1}]} refreshControl={refreshControl}>
      {children}
    </ScrollView>
  )
}
