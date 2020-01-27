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
          style={[
            styles.welcomeText,
            styles.orange_color,
            styles.textBold,
            styles.nomgrBottom
          ]}
        >
          {t('menu.settings')}
        </Text>
        <Pages indicatorColor="#FF9100">
          <View>
            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View
                style={[
                  	styles.iconMargin,
                  	styles.grayBg,
                  	styles.half_width,
                  	styles.jc_alignIem_center
                	]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Account')}
                >
                  <View style={styles.customPaddingLarge}>
                    <MaterialIcon
                      name="account-box"
                      size={isTablet ? 70 : 40}
                      color="#f18d1a"
                      style={[styles.centerText]}
                    />
                    <Text style={[styles.centerText, styles.textMedium]}>
                      {t('settings.account')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.iconMargin,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Store')}
                >
                  <View style={styles.customPaddingLarge}>
                    <Icon
                      name="md-home"
                      size={isTablet ? 70 : 40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_10]}
                    />
                    <Text style={[styles.centerText, styles.textMedium]}>
                      {t('settings.stores')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View
                style={[
                  	styles.iconMargin,
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
                  <View style={styles.customPaddingLarge}>
                    <Icon
                      name="ios-beaker"
                      size={isTablet ? 70 : 40}
                      color="#f18d1a"
                      style={[styles.centerText]}
                    />
                    <Text style={[styles.centerText, styles.textMedium]}>
                      {t('settings.products')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.iconMargin,
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
                  <View style={styles.customPaddingLarge}>
                    <Icon
                      name="ios-people"
                      size={isTablet ? 70 : 40}
                      color="#f18d1a"
                      style={[styles.centerText]}
                    />
                    <Text style={[styles.centerText, styles.textMedium]}>{t('settings.staff')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View
                style={[
                  styles.iconMargin,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('PrinternKDS')}
                >
                  <View style={styles.customPaddingLarge}>
                    <Icon
                      name="md-print"
                      size={isTablet ? 70 : 40}
                      color="#f18d1a"
                      style={[styles.centerText]}
                    />
                    <Text style={[styles.centerText, styles.textMedium]}>
                      {t('settings.workingArea')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.iconMargin,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center
                ]}
              >
                <TouchableOpacity onPress={() => changeLanguage()}>
                  <View style={styles.customPaddingLarge}>
                    <MaterialIcon
                      name="language"
                      size={isTablet ? 70 : 40}
                      color="#f18d1a"
                      style={[styles.centerText]}
                    />
                    <Text style={[styles.centerText, styles.textMedium]}>
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
                style={[
                  styles.iconMargin,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('TableLayouts')}
                >
                  <View style={styles.customPaddingLarge}>
                    <MaterialIcon
                      name="event-seat"
                      size={isTablet ? 70 : 40}
                      color="#f18d1a"
                      style={[styles.centerText]}
                    />
                    <Text style={[styles.centerText, styles.textMedium]}>
                      {t('settings.tableLayouts')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.iconMargin,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('ShiftClose')}
                >
                  <View style={styles.customPaddingLarge}>
                    <Icon
                      name="md-book"
                      size={isTablet ? 70 : 40}
                      color="#f18d1a"
                      style={[styles.centerText]}
                    />
                    <Text style={[styles.centerText, styles.textMedium]}>
                      {t('settings.manageShifts')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View
                style={[
                  styles.iconMargin,
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
                  <View style={styles.customPaddingLarge}>
                    <FontAwesomeIcon
                      name="commenting"
                      size={isTablet ? 70 : 40}
                      color="#f18d1a"
                      style={[styles.centerText]}
                    />
                    <Text style={[styles.centerText, styles.textMedium]}>{t('settings.announcements')}</Text>
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
