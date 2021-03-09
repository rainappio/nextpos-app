import React, {useContext} from "react";
import {ThemeContext} from "../themes/ThemeContext";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {LocaleContext} from '../locales/LocaleContext'

export const ThemeKeyboardAwareScrollView = (props) => {
  const themeContext = useContext(ThemeContext)
  const themeStyle = themeContext.themeStyle
  const {customMainThemeColor, customSecondThemeColor, customBackgroundColor} = useContext(LocaleContext)

  return (
    <KeyboardAwareScrollView scrollIndicatorInsets={{right: 1}} style={[themeStyle, (customMainThemeColor === '#006B35' && {backgroundColor: customBackgroundColor})]} contentContainerStyle={[themeStyle, {flexGrow: 1}, (customMainThemeColor === '#006B35' && {backgroundColor: customBackgroundColor})]} keyboardShouldPersistTaps='always'
      innerRef={ref => {
        !!props?.getRef && props?.getRef(ref)
      }}
    >
      {props?.children}
    </KeyboardAwareScrollView>
  )
}
