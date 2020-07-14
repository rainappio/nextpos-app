import React from 'react'
import { Text, View } from 'react-native'
import { Stepper, List } from '@ant-design/react-native'
import styles from '../styles'
import {StyledText} from "./StyledText";
import {withContext} from "../helpers/contextHelper";
import {themes} from "../themes/ThemeContext";

class RenderStepper extends React.Component {
  render() {
    const {
      input: { onBlur, onChange, onFocus, value },
      customValue,
      optionName,
      meta: { error, touched, valid },
      themeStyle,
      ...rest
    } = this.props

    return (
      <View>
        <View style={[styles.flex_dir_row, { alignItems: 'center' }]}>
          <View style={{ width: '60%' }}>
            <StyledText>{optionName}</StyledText>
          </View>

          <View style={{ width: '40%' }}>
            <Stepper
              key={1}
              clear
              error
              onChange={onChange}
              max={20}
              min={0}
              readOnly={false}
              value={value}
              showNumber
              inputStyle={themeStyle}
            />
          </View>
        </View>
        <View style={{ width: '100%', marginTop: 8 }}>
          {!valid &&
            touched &&
            (error && <Text style={styles.rootError}>{error}</Text>)}
        </View>
      </View>
    )
  }
}

export default withContext(RenderStepper)
