import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  TextInput
} from 'react-native'
import { Indicator, Pages } from 'react-native-pages'
import Icon from 'react-native-vector-icons/Ionicons'
import { default as MaterialIcon } from 'react-native-vector-icons/MaterialIcons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtnCustom from '../components/BackBtnCustom'
import { isTablet } from '../actions'
import styles from '../styles'

class SettingsScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    let { t, changeLanguage } = this.props.screenProps

    return (
      <View style={[styles.container, styles.nomgrBottom]}>
        <Text
          style={isTablet ? [
            styles.welcomeText,
            styles.orange_color,
            styles.tabletTextBig,
            styles.textBold,
            styles.nomgrBottom,
            styles.paddTop_30 
          ]
          :
        	[
            styles.welcomeText,
            styles.orange_color,
            styles.textMedium,
            styles.textBold,
            styles.nomgrBottom
          ]}
        >
          {t('menu.settings')}
        </Text>
        <Pages indicatorColor="#FF9100" style={{ marginTop: 20 }}>
          <View>
            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View
                style={isTablet 
                	?
                	[
                  	{margin: 25},
                  	styles.grayBg,
                  	styles.half_width,
                  	styles.jc_alignIem_center                  	    
                	]
                	:
                	[
                  	styles.margin_15,
                  	styles.grayBg,
                  	styles.half_width,
                  	styles.jc_alignIem_center
                	]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Account')}
                >
                  <View style={[styles.paddTop_30, styles.paddBottom_30]}>
                    <MaterialIcon
                      name="account-box"
                      size={isTablet ? 80 : 40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={isTablet ? [styles.centerText, styles.tabletTextMedium] : [styles.centerText]}>
                      {t('settings.account')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={isTablet 
                	?
                	[
                  	{margin: 25},
                  	styles.grayBg,
                  	styles.half_width,
                  	styles.jc_alignIem_center     
                	]
                	:
                	[
                  	styles.margin_15,
                  	styles.grayBg,
                  	styles.half_width,
                  	styles.jc_alignIem_center
                	]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Store')}
                >
                  <View style={[styles.paddTop_30, styles.paddBottom_30]}>
                    <Icon
                      name="md-home"
                      size={isTablet ? 80 : 40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={isTablet ? [styles.centerText, styles.tabletTextMedium] : [styles.centerText]}>
                      {t('settings.stores')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View
                style={isTablet 
                	?
                	[
                  	{margin: 25},
                  	styles.grayBg,
                  	styles.half_width,
                  	styles.jc_alignIem_center     
                	]
                	:
                	[
                  	styles.margin_15,
                  	styles.grayBg,
                  	styles.half_width,
                  	styles.jc_alignIem_center
                	]}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('ProductsOverview')
                  }
                >
                  <View style={[styles.paddTop_30, styles.paddBottom_30]}>
                    <Icon
                      name="ios-beaker"
                      size={isTablet ? 80 : 40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={isTablet ? [styles.centerText, styles.tabletTextMedium] : [styles.centerText]}>
                      {t('settings.products')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={isTablet 
                	?
                	[
                  	{margin: 25},
                  	styles.grayBg,
                  	styles.half_width,
                  	styles.jc_alignIem_center     
                	]
                	:
                	[
                  	styles.margin_15,
                  	styles.grayBg,
                  	styles.half_width,
                  	styles.jc_alignIem_center
                	]}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('StaffsOverview')
                  }
                >
                  <View style={[styles.paddTop_30, styles.paddBottom_30]}>
                    <Icon
                      name="ios-people"
                      size={isTablet ? 80 : 40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={isTablet ? [styles.centerText, styles.tabletTextMedium] : [styles.centerText]}>{t('settings.staff')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View
                style={isTablet 
                	?
                	[
                  	{margin: 25},
                  	styles.grayBg,
                  	styles.half_width,
                  	styles.jc_alignIem_center     
                	]
                	:
                	[
                  	styles.margin_15,
                  	styles.grayBg,
                  	styles.half_width,
                  	styles.jc_alignIem_center
                	]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('PrinternKDS')}
                >
                  <View style={[styles.paddTop_30, styles.paddBottom_30]}>
                    <Icon
                      name="md-print"
                      size={isTablet ? 80 : 40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={isTablet ? [styles.centerText, styles.tabletTextMedium] : [styles.centerText]}>
                      {t('settings.workingArea')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={isTablet 
                	?
                	[
                  	{margin: 25},
                  	styles.grayBg,
                  	styles.half_width,
                  	styles.jc_alignIem_center     
                	]
                	:
                	[
                  	styles.margin_15,
                  	styles.grayBg,
                  	styles.half_width,
                  	styles.jc_alignIem_center
                	]}
              >
                <TouchableOpacity onPress={() => changeLanguage()}>
                  <View style={[styles.paddTop_30, styles.paddBottom_30]}>
                    <MaterialIcon
                      name="language"
                      size={isTablet ? 80 : 40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={isTablet ? [styles.centerText, styles.tabletTextMedium] : [styles.centerText]}>
                      {t('settings.language')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View>
            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View
                style={isTablet 
                	?
                	[
                  	{margin: 25},
                  	styles.grayBg,
                  	styles.half_width,
                  	styles.jc_alignIem_center     
                	]
                	:
                	[
                  	styles.margin_15,
                  	styles.grayBg,
                  	styles.half_width,
                  	styles.jc_alignIem_center
                	]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('TableLayouts')}
                >
                  <View style={[styles.paddTop_30, styles.paddBottom_30]}>
                    <MaterialIcon
                      name="event-seat"
                      size={isTablet ? 80 : 40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={isTablet ? [styles.centerText, styles.tabletTextMedium] : [styles.centerText]}>
                      {t('settings.tableLayouts')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={isTablet 
                	?
                	[
                  	{margin: 25},
                  	styles.grayBg,
                  	styles.half_width,
                  	styles.jc_alignIem_center     
                	]
                	:
                	[
                  	styles.margin_15,
                  	styles.grayBg,
                  	styles.half_width,
                  	styles.jc_alignIem_center
                	]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('ShiftClose')}
                >
                  <View style={[styles.paddTop_30, styles.paddBottom_30]}>
                    <Icon
                      name="md-book"
                      size={isTablet ? 80 : 40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={isTablet ? [styles.centerText, styles.tabletTextMedium] : [styles.centerText]}>
                      {t('settings.manageShifts')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View
                style={isTablet 
                	?
                	[
                  	{margin: 30},
                  	styles.grayBg,
                  	styles.half_width,
                  	styles.jc_alignIem_center     
                	]
                	:
                	[
                  	styles.margin_15,
                  	styles.grayBg,
                  	styles.half_width,
                  	styles.jc_alignIem_center
                	]}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Announcements')
                  }
                >
                  <View style={[styles.paddTop_30, styles.paddBottom_30]}>
                    <FontAwesomeIcon
                      name="commenting"
                      size={isTablet ? 80 : 40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={isTablet ? [styles.centerText, styles.tabletTextMedium] : [styles.centerText]}>{t('settings.announcements')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Pages>
      </View>
    )
  }
}

export default SettingsScreen
