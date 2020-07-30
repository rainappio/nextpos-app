import React from 'react'
import {Text, View} from 'react-native'
import {CheckBox} from 'react-native-elements'
import IonIcon from 'react-native-vector-icons/Ionicons'
import styles, {mainThemeColor} from "../../styles";
import {withContext} from "../../helpers/contextHelper";
import {StyledText} from "../StyledText";

class RenderPureCheckBox extends React.Component {
  state = {
    checked: true
  }

  render() {
    const {
      input: {onBlur, onChange, onFocus, value},
      customValue,
      optionName,
      total,
      title,
      isIconAsTitle,
      meta: {error, touched, valid},
      themeStyle,
      ...rest
    } = this.props

    return (
      <View style={styles.flex(1)}>
        <CheckBox
          title={
            <View>
              {!isIconAsTitle ? (
                <StyledText>{title}</StyledText>
              ) : (
                <IonIcon
                  name={customValue}
                  size={26}
                  color={mainThemeColor}
                  style={{marginLeft: 22}}
                />
              )}
            </View>
          }
          checkedIcon={'check-circle'}
          uncheckedIcon={'circle'}
          checked={value === customValue}
          onPress={() => onChange(customValue)}
          containerStyle={{backgroundColor: themeStyle.backgroundColor}}
        />
        {!valid && touched && <Text style={[styles.rootError, styles.mgrtotop12, styles.centerText]}>{error}</Text>}
      </View>
    )
  }
}

export default withContext(RenderPureCheckBox)
