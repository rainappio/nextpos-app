import React, {useContext} from "react";
import {ThemeContext} from "../themes/ThemeContext";
import styles from '../styles'
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scrollview";

export const ThemeKeyboardAwareScrollView = ({children}) => {
  const themeContext = useContext(ThemeContext)
  const themeStyle = themeContext.themeStyle

  return (
    <KeyboardAwareScrollView scrollIndicatorInsets={{right: 1}} style={themeStyle} contentContainerStyle={[themeStyle, {flexGrow: 1}]} keyboardShouldPersistTaps='always'>
      {children}
    </KeyboardAwareScrollView>
  )
}
