import React, { Component } from 'react'
import { View, Switch, Text } from 'react-native'
import { ListItem } from 'react-native-elements'
import { LocaleContext } from '../locales/LocaleContext'
import styles from '../styles'

class RNSwitchGroup extends Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {

  }

  render() {
    const {
      input: { onChange, value, ...otherInput },
      customarr,
      meta,
      labels,
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
            <View style={[styles.tableRowContainer, styles.nopaddingLeft]}>
              <View style={[styles.tableCellView, { flex: 1 }]}>
                {<Text>{t(labels[ca])}</Text>}
              </View>
              <View style={[styles.tableCellView, { justifyContent: 'flex-end' }]}>
                <Switch
                  onValueChange={onChange}
                  value={value.includes(ca)}
                  {...otherInput}
                  {...rest}
                />
              </View>
            </View>}
          bottomDivider
          containerStyle={[styles.dynamicVerticalPadding(12), { padding: 0 }]}
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

export default RNSwitchGroup
