import React, {Component} from 'react'
import {Switch, View} from 'react-native'
import {ListItem} from 'react-native-elements'
import {LocaleContext} from '../locales/LocaleContext'
import styles from '../styles'
import {StyledText} from "./StyledText";
import {withContext} from "../helpers/contextHelper";

class RNSwitchPayGroup extends Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  render() {
    const {
      input: {onChange, value, ...otherInput},
      customarr,
      meta,
      themeStyle,
      ...rest
    } = this.props
    const {t, customBackgroundColor} = this.context


    const arrFind = [...this.props.input.value]
    const Swtiches = customarr !== undefined && customarr.map((payment, index) => {
      const onChange = checked => {
        const arr = [...this.props.input.value]
        if (checked) {
          arr.push(payment)
          console.log("push", payment)
        } else {
          arr.splice(arr.map((item) => item.id).indexOf(payment.id), 1)
          console.log("splice", payment, value)
        }
        return this.props.input.onChange(arr)
      }

      return (
        !!value &&
        <ListItem
          key={payment.id}
          title={
            <View style={[styles.tableRowContainer, {paddingVertical: 0}]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <StyledText>{t(`settings.paymentMethods.${payment.paymentKey}`)}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <Switch
                  onValueChange={onChange}
                  value={!!arrFind.find(item => item?.id === payment.id)}
                  disabled={payment.paymentKey == 'CARD' || payment.paymentKey == 'CASH'}
                  {...otherInput}
                  {...rest}
                />
              </View>
            </View>}
          bottomDivider
          containerStyle={[styles.dynamicVerticalPadding(12), {padding: 0, backgroundColor: customBackgroundColor}]}
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

export default withContext(RNSwitchPayGroup)
