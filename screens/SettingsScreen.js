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
        <Text style={styles.screenTitle}>
          {t('menu.settings')}
        </Text>
        <Pages indicatorColor="#FF9100">
          <View>
            <View style={[styles.flex_dir_row]}>
              <TouchableOpacity
                style={styles.mainSquareButton}
                onPress={() => this.props.navigation.navigate('Account')}
              >
                <View>
                  <MaterialIcon
                    name="account-box"
                    size={40}
                    color="#f18d1a"
                    style={[styles.centerText, styles.margin_15]}
                  />
                  <Text style={styles.centerText}>
                    {t('settings.account')}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mainSquareButton}
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

            <View style={[styles.flex_dir_row]}>
              <TouchableOpacity
                style={styles.mainSquareButton}
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

              <TouchableOpacity
                style={styles.mainSquareButton}
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

            <View style={[styles.flex_dir_row]}>
              <TouchableOpacity
                style={styles.mainSquareButton}
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

              <TouchableOpacity
                style={styles.mainSquareButton}
                onPress={() => changeLanguage()}>
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

          <View>
            <View style={[styles.flex_dir_row]}>
              <TouchableOpacity
                style={styles.mainSquareButton}
                onPress={() => this.props.navigation.navigate('TableLayouts')}
              >
                <View>
                  <MaterialIcon
                    name="event-seat"
                    size={40}
                    color="#f18d1a"
                    style={[styles.centerText, styles.margin_15]}
                  />
                  <Text style={styles.centerText}>
                    {t('settings.tableLayouts')}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mainSquareButton}
                onPress={() => this.props.navigation.navigate('ShiftClose')}
              >
                <View>
                  <Icon
                    name="md-book"
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

            <View style={[styles.flex_dir_row, { width: '50%'}]}>
              <TouchableOpacity
                style={styles.mainSquareButton}
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
                  <Text style={styles.centerText}>{t('settings.announcements')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Pages>
      </View>
    )
  }
}

export default SettingsScreen
