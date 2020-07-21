import React, {useContext} from "react";
import {ThemeContext} from "../themes/ThemeContext";
import {View} from "react-native";
import styles from '../styles'

export const ThemeContainer = ({children}) => {
  const themeContext = useContext(ThemeContext)

  return (
    <View style={[styles.mainContainer, themeContext.themeStyle]}>
      {children}
    </View>
  )
}
