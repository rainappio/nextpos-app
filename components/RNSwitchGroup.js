import React, { Component } from 'react'
import { View, Switch, Text } from 'react-native'
import { ListItem } from 'react-native-elements'
import { LocaleContext } from '../locales/LocaleContext'
import styles from '../styles'
import {StyledText} from "./StyledText";
import {withContext} from "../helpers/contextHelper";

class RNSwitchGroup extends Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  render() {
    const {
      input: { onChange, value, ...otherInput },
      customarr,
      meta,
      labels,
      themeStyle,
      ...rest
    } = this.props
    const { t } = this.context

    const Swtiches = customarr !== undefined && customarr.map((ca, ix) => {
      const onChange = checked => {
        const arr = [...this.props.input.value]
        if (checked) {
          arr.push(ca)
        } else {
          arr.splice(arr.indexOf(ca), 1)
        }
        return this.props.input.onChange(arr)
      }

      return (
        ca !== 'BASE' &&
        <ListItem
          key={ix}
          title={
            <View style={[styles.tableRowContainer]}>
              <View style={[styles.tableCellView, { flex: 1 }]}>
                <StyledText>{t(labels[ca])}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <Switch
                  onValueChange={onChange}
                  value={value.includes(ca)}
                  {...otherInput}
                  {...rest}
                />
              </View>
            </View>}
          bottomDivider
          containerStyle={[styles.dynamicVerticalPadding(12), { padding: 0, backgroundColor: themeStyle.backgroundColor }]}
        />
      )
    })
    return (
      <View>
        {Swtiches}
      </View>
    )
  }
}

export default withContext(RNSwitchGroup)
