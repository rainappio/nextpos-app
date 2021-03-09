import {TextInput, View} from "react-native";
import React from "react";
import styles from "../styles";
import {withContext} from "../helpers/contextHelper";

const StyledTextInput = (props) => {

  const {themeStyle} = props

  return (
    <View style={styles.flex(1)}>
      <TextInput
        {...props}
        placeholderTextColor={themeStyle.color}
        style={[

          themeStyle,
          styles?.rootInput(props?.locale),
          styles?.withBorder(props?.locale)
        ]}
      />
    </View>
  )
}

export default withContext(StyledTextInput)
