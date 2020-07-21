import React, {useContext} from 'react'
import {Text} from 'react-native'
import {ThemeContext} from "../themes/ThemeContext";

/**
 * https://stackoverflow.com/questions/30465651/passing-keys-to-children-in-react-js
 */
export const StyledText = ({id, style, children}) => {

  const themeContext = useContext(ThemeContext)
  const passedStyles = Array.isArray(style) ? style : [style]

  return (
    <Text
      key={id}
      style={[...passedStyles, {color: themeContext.themeStyle.color}]}
    >
      {children}
    </Text>
  )
}
