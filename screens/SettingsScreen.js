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
                style={[
                  styles.margin_15,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Account')}
                >
                  <View>
                    <Icon
                      name="md-lock"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>
                      {t('settings.account')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.margin_15,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Store')}
                >
                  <View>
                    <Icon
                      name="md-home"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>
                      {t('settings.stores')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View
                style={[
                  styles.margin_15,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('ProductsOverview')
                  }
                >
                  <View>
                    <Icon
                      name="ios-beaker"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>
                      {t('settings.products')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.margin_15,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('StaffsOverview')
                  }
                >
                  <View>
                    <Icon
                      name="ios-people"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>{t('settings.staff')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View
                style={[
                  styles.margin_15,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('PrinternKDS')}
                >
                  <View>
                    <Icon
                      name="md-print"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>
                      {t('settings.workingArea')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.margin_15,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity onPress={() => changeLanguage()}>
                  <View>
                    <MaterialIcon
                      name="language"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>
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
                  styles.margin_15,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('TableLayouts')}
                >
                  <View>
                    <Icon
                      name="md-lock"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>
                      {t('settings.tableLayouts')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.margin_15,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('ShiftClose')}
                >
                  <View>
                    <Icon
                      name="md-lock"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>
                      {t('settings.manageShifts')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View
                style={[
                  styles.margin_15,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Announcements')
                  }
                >
                  <View>
                    <FontAwesomeIcon
                      name="commenting"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>Announcements</Text>
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
