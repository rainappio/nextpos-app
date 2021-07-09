import React from 'react'
import {ScrollView, View} from 'react-native'
import {Pages} from 'react-native-pages'
import Icon from 'react-native-vector-icons/Ionicons'
import {default as MaterialIcon} from 'react-native-vector-icons/MaterialIcons'
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import styles from '../styles'
import ScreenHeader from "../components/ScreenHeader";
import MenuButton from "../components/MenuButton";
import {LocaleContext} from "../locales/LocaleContext";
import {ThemeContainer} from "../components/ThemeContainer";
import NavigationService from "../navigation/NavigationService";
import {Entypo} from '@expo/vector-icons';

class SettingsScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext

  render() {
    const {t, changeLanguage, changeAppType, appType, customMainThemeColor} = this.context

    let menuButtonsArr = [
      <MenuButton
        route='Account'
        onPress={() => this.props.navigation.navigate('Account')}
        title={t('settings.account')}
        icon={
          <MaterialIcon
            name="account-box"
            size={40}
            style={[styles?.buttonIconStyle(customMainThemeColor)]}
          />
        } />,

      <MenuButton
        route='Store'
        onPress={() => this.props.navigation.navigate('Store')}
        title={t('settings.stores')}
        icon={
          <Icon
            name="md-home"
            size={40}
            style={[styles?.buttonIconStyle(customMainThemeColor)]}
          />
        } />,

      <MenuButton
        route='ProductsOverview'
        onPress={() =>
          this.props.navigation.navigate('ProductsOverview')
        }
        title={t('settings.products')}
        icon={
          <Icon
            name="ios-beaker"
            size={40}
            style={[styles?.buttonIconStyle(customMainThemeColor)]}
          />
        }
      />,

      <MenuButton
        route='StaffsOverview'
        onPress={() =>
          NavigationService?.navigateToRoute('StaffsOverview', {screen: 'StaffsOverview'})
        }
        title={t('settings.staff')}
        icon={
          <Icon
            name="ios-people"
            size={40}
            style={[styles?.buttonIconStyle(customMainThemeColor)]}
          />
        }
      />,

      <MenuButton
        route='Announcements'
        onPress={() => this.props.navigation.navigate('Announcements')}
        title={t('settings.announcements')}
        icon={
          <FontAwesomeIcon
            name="commenting"
            size={40}
            style={[styles?.buttonIconStyle(customMainThemeColor)]}
          />
        }
      />,

      <MenuButton
        route='ShiftClose'
        onPress={() => this.props.navigation.navigate('ShiftClose')}
        title={t('settings.manageShifts')}
        icon={
          <Icon
            name="md-book"
            size={40}
            style={[styles?.buttonIconStyle(customMainThemeColor)]}
          />
        }
      />,

      <MenuButton
        route='MemberScreen'
        onPress={() => NavigationService?.navigateToRoute('MemberScreen', {screen: 'MemberScreen'})}
        title={t('settings.member')}
        icon={
          <FontAwesome5Icon
            name="user-cog"
            size={40}
            style={[styles?.buttonIconStyle(customMainThemeColor)]}
          />
        }
      />,

      <MenuButton
        route='ManageOffers'
        onPress={() => this.props.navigation.navigate('ManageOffers')}
        title={t('settings.manageOffers')}
        icon={
          <FontAwesomeIcon
            name="sun-o"
            size={40}
            style={[styles?.buttonIconStyle(customMainThemeColor)]}
          />
        }
      />,

      <MenuButton
        route='TableLayouts'
        onPress={() => this.props.navigation.navigate('TableLayouts')}
        title={t('settings.tableLayouts')}
        icon={
          <MaterialIcon
            name="event-seat"
            size={40}
            style={[styles?.buttonIconStyle(customMainThemeColor)]}
          />
        }
      />,

      <MenuButton
        route='PrinternKDS'
        onPress={() => this.props.navigation.navigate('PrinternKDS')}
        title={t('settings.workingArea')}
        icon={
          <Icon
            name="md-print"
            size={40}
            style={[styles?.buttonIconStyle(customMainThemeColor)]}
          />
        }
      />,

      <MenuButton
        route='EinvoiceStatusScreen'
        onPress={() => NavigationService?.navigateToRoute('EinvoiceStatusScreen', {screen: 'EinvoiceStatusScreen'})}
        title={t('settings.eInvoice')}
        icon={
          <FontAwesome5Icon
            name="file-invoice-dollar"
            size={40}
            style={[styles?.buttonIconStyle(customMainThemeColor)]}
          />
        }
      />,

      <MenuButton
        route='SubscriptionScreen'
        onPress={() => this.props.navigation.navigate('SubscriptionScreen')}
        title={t('settings.subscription')}
        icon={
          <MCIcon
            name="professional-hexagon"
            size={40}
            style={[styles?.buttonIconStyle(customMainThemeColor)]}
          />
        }
      />,

    ]



    return (
      <ThemeContainer>
        <View style={[styles.fullWidthScreen]}>
          <ScreenHeader backNavigation={false}
            parentFullScreen={true}
            title={t('menu.settings')} />


          <Pages indicatorColor={customMainThemeColor}>
            <View style={{flex: 1, paddingBottom: 16}}>
              <View style={[styles.menuContainer]}>
                {menuButtonsArr?.[0] ?? <View style={{flex: 1}}></View>}
                <View style={styles.dynamicHorizontalPadding(6)} />
                {menuButtonsArr?.[1] ?? <View style={{flex: 1}}></View>}
              </View>

              <View style={[styles.menuContainer]}>
                {menuButtonsArr?.[2] ?? <View style={{flex: 1}}></View>}
                <View style={styles.dynamicHorizontalPadding(6)} />
                {menuButtonsArr?.[3] ?? <View style={{flex: 1}}></View>}
              </View>

              <View style={[styles.menuContainer]}>
                {menuButtonsArr?.[4] ?? <View style={{flex: 1}}></View>}
                <View style={styles.dynamicHorizontalPadding(6)} />
                {menuButtonsArr?.[5] ?? <View style={{flex: 1}}></View>}
              </View>
              <View style={[styles.menuContainer]}>
                {menuButtonsArr?.[6] ?? <View style={{flex: 1}}></View>}
                <View style={styles.dynamicHorizontalPadding(6)} />
                {menuButtonsArr?.[7] ?? <View style={{flex: 1}}></View>}
              </View>
            </View>

            <View style={{flex: 1, paddingBottom: 16}}>
              <View style={[styles.menuContainer]}>
                {menuButtonsArr?.[8] ?? <View style={{flex: 1}}></View>}
                <View style={styles.dynamicHorizontalPadding(6)} />
                {menuButtonsArr?.[9] ?? <View style={{flex: 1}}></View>}
              </View>
              <View style={[styles.menuContainer]}>
                {menuButtonsArr?.[10] ?? <View style={{flex: 1}}></View>}
                <View style={styles.dynamicHorizontalPadding(6)} />
                {menuButtonsArr?.[11] ?? <View style={{flex: 1}}></View>}
              </View>

              <View style={[styles.menuContainer]}>
                {menuButtonsArr?.[12] ?? <View style={{flex: 1}}></View>}
                <View style={styles.dynamicHorizontalPadding(6)} />
                {menuButtonsArr?.[13] ?? <View style={{flex: 1}}></View>}
              </View>

              <View style={[styles.menuContainer]}>
                {menuButtonsArr?.[14] ?? <View style={{flex: 1}}></View>}
                <View style={styles.dynamicHorizontalPadding(6)} />
                {menuButtonsArr?.[15] ?? <View style={{flex: 1}}></View>}
              </View>

            </View>
          </Pages>
        </View>
      </ThemeContainer>
    )
  }
}

export default SettingsScreen

