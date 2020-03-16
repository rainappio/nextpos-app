import React, {Component} from "react"
import {Text, TouchableOpacity, View} from "react-native"
import styles from '../styles'
import Icon from "react-native-vector-icons/Ionicons"
import PopUp from "./PopUp"
import {LocaleContext} from "../locales/LocaleContext"
import {withNavigation} from "react-navigation"

class ScreenHeader extends Component {
  static contextType = LocaleContext

  render() {
    const {
      title,
      backNavigation,
      backAction,
      rightComponent,
      parentFullScreen,
      style
    } = this.props

    const {t} = this.context

    const displayBackButton = backNavigation !== undefined ? backNavigation : true
    const backActionToUse = backAction !== undefined ? backAction : () => this.props.navigation.goBack()

    return (
      <View style={[styles.screenTopContainer, (parentFullScreen && {marginHorizontal: 15}), style, {borderWidth: 0}]}>
        <View style={{width: '20%', alignItems: 'flex-start', borderWidth: 0}}>
          {displayBackButton && (
            <TouchableOpacity
              hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
              onPress={backActionToUse}
            >
              <View>
                <Icon name="ios-arrow-back" size={32} style={styles.buttonIconStyle}/>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.screenTitle, {width: '60%', borderWidth: 0}]}>{title}</Text>
        <View style={{width: '20%', alignItems: 'flex-end', borderWidth: 0}}>
          {rightComponent}
        </View>
      </View>

    )
  }
}

export default withNavigation(ScreenHeader)
