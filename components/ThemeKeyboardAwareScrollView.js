import React, {useContext} from "react";
import {ThemeContext} from "../themes/ThemeContext";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

export const ThemeKeyboardAwareScrollView = (props) => {
  const themeContext = useContext(ThemeContext)
  const themeStyle = themeContext.themeStyle

  return (
    <KeyboardAwareScrollView scrollIndicatorInsets={{right: 1}} style={themeStyle} contentContainerStyle={[themeStyle, {flexGrow: 1}]} keyboardShouldPersistTaps='always'
      innerRef={ref => {
        !!props?.getRef && props?.getRef(ref)
      }}
    >
      {props?.children}
    </KeyboardAwareScrollView>
  )
}
