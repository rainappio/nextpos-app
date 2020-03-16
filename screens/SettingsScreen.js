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
import styles, {mainThemeColor} from '../styles'
import ScreenHeader from "../components/ScreenHeader";
import MenuButton from "../components/MenuButton";

class SettingsScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    let { t, changeLanguage } = this.props.screenProps

    return (
      <View style={[styles.container, styles.nomgrBottom]}>
        <ScreenHeader backNavigation={false}
                      title={t('menu.settings')}/>

        <Pages indicatorColor={mainThemeColor}>
          <View>
            <View style={[styles.flex_dir_row]}>
              <MenuButton
                onPress={() => this.props.navigation.navigate('Account')}
                title={t('settings.account')}
                icon={
                  <MaterialIcon
                    name="account-box"
                    size={40}
                    style={[styles.buttonIconStyle]}
                  />
                }/>

              <MenuButton
                onPress={() => this.props.navigation.navigate('Store')}
                title={t('settings.stores')}
                icon={
                  <Icon
                    name="md-home"
                    size={40}
                    style={[styles.buttonIconStyle]}
                  />
                }/>
            </View>

            <View style={[styles.flex_dir_row]}>
              <MenuButton
                onPress={() =>
                  this.props.navigation.navigate('ProductsOverview')
                }
                title={t('settings.products')}
                icon={
                  <Icon
                    name="ios-beaker"
                    size={40}
                    style={[styles.buttonIconStyle]}
                  />
                }
              />

              <MenuButton
                onPress={() =>
                  this.props.navigation.navigate('StaffsOverview')
                }
                title={t('settings.staff')}
                icon={
                  <Icon
                    name="ios-people"
                    size={40}
                    style={[styles.buttonIconStyle]}
                  />
                }
              />
            </View>

            <View style={[styles.flex_dir_row]}>
              <MenuButton
                onPress={() => this.props.navigation.navigate('PrinternKDS')}
                title={t('settings.workingArea')}
                icon={
                  <Icon
                    name="md-print"
                    size={40}
                    style={[styles.buttonIconStyle]}
                  />
                }
              />

              <MenuButton
                onPress={() => changeLanguage()}
                title={t('settings.language')}
                icon={
                  <MaterialIcon
                    name="language"
                    size={40}
                    style={[styles.buttonIconStyle]}
                  />
                }
              />
            </View>
          </View>

          <View>
            <View style={[styles.flex_dir_row]}>
              <MenuButton
                onPress={() => this.props.navigation.navigate('TableLayouts')}
                title={t('settings.tableLayouts')}
                icon={
                  <MaterialIcon
                    name="event-seat"
                    size={40}
                    style={[styles.buttonIconStyle]}
                  />
                }
              />

              <MenuButton
                onPress={() => this.props.navigation.navigate('ShiftClose')}
                title={t('settings.manageShifts')}
                icon={
                  <Icon
                    name="md-book"
                    size={40}
                    style={[styles.buttonIconStyle]}
                  />
                }
              />
            </View>

            <View style={[styles.flex_dir_row, { width: '50%'}]}>
              <MenuButton
                onPress={() => this.props.navigation.navigate('Announcements')}
                title={t('settings.announcements')}
                icon={
                  <FontAwesomeIcon
                    name="commenting"
                    size={40}
                    style={[styles.buttonIconStyle]}
                  />
                }
              />
            </View>
          </View>
        </Pages>
      </View>
    )
  }
}

export default SettingsScreen
