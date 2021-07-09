import React from 'react'
import {View} from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import MenuButton from "../components/MenuButton";
import {withContext} from "../helpers/contextHelper";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {ThemeContainer} from "../components/ThemeContainer";
import NavigationService from "../navigation/NavigationService";
import PermissionCheckTouchable from "../components/PermissionCheckTouchable";


class ReportsScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      userScope: false
    }
  }

  render() {
    const {themeStyle} = this.props
    const {t, customMainThemeColor} = this.context


    return (
      <ThemeContainer>
        <View style={styles.fullWidthScreen}>
          <ScreenHeader backNavigation={false}
            parentFullScreen={true}
            title={t('menu.reporting')}
          />

          <View style={[styles.flex(1)]}>
            <View style={[styles.menuContainer]}>

              <PermissionCheckTouchable
                requiredPermission='OWNER'
                uiComponent={
                  <MenuButton
                    route='SalesCharts'
                    onPress={() => NavigationService?.navigateToRoute('SalesCharts', {screen: 'SalesCharts'})}
                    title={t('salesReport')}
                    icon={
                      <FontAwesomeIcon
                        name="bar-chart"
                        size={40}
                        style={[styles?.buttonIconStyle(customMainThemeColor)]}
                      />
                    }
                  />
                }
              />


              <View style={styles.dynamicHorizontalPadding(6)} />
              <PermissionCheckTouchable
                requiredPermission='OWNER'
                uiComponent={
                  <MenuButton
                    route='StaffTimeCard'
                    onPress={() => NavigationService?.navigateToRoute('StaffTimeCard', {screen: 'StaffTimeCard'})}
                    title={t('staffTimeCardReport')}
                    icon={
                      <Icon
                        name="md-time"
                        size={40}
                        style={[styles?.buttonIconStyle(customMainThemeColor)]}
                      />
                    }
                  />
                }
              />


            </View>

            <View style={[styles.menuContainer]}>
              <PermissionCheckTouchable
                requiredPermission='OWNER'
                uiComponent={
                  <MenuButton
                    route='CustomerStats'
                    onPress={() => NavigationService?.navigateToRoute('CustomerStats', {screen: 'CustomerStats'})}
                    title={t('customerStatsReport')}
                    icon={
                      <Icon
                        name="md-trending-up"
                        size={40}
                        style={[styles?.buttonIconStyle(customMainThemeColor)]}
                      />
                    }
                  />
                }
              />


              <View style={styles.dynamicHorizontalPadding(6)} />

              <PermissionCheckTouchable
                requiredPermission='OWNER'
                uiComponent={
                  <MenuButton
                    route='ShiftHistory'
                    onPress={() => this.props.navigation.navigate('ShiftHistory')}
                    title={t('shiftHistory')}
                    icon={
                      <Icon
                        name="md-today"
                        size={40}
                        style={[styles?.buttonIconStyle(customMainThemeColor)]}
                      />
                    }
                  />
                }
              />

            </View>
            <View style={[styles.menuContainer]}>
              <View style={{flex: 1}}></View>
              <View style={styles.dynamicHorizontalPadding(6)} />
              <View style={{flex: 1}}></View>
            </View>
            <View style={[styles.menuContainer]}>
              <View style={{flex: 1}}></View>
              <View style={styles.dynamicHorizontalPadding(6)} />
              <View style={{flex: 1}}></View>
            </View>
          </View>
        </View>
      </ThemeContainer>
    )
  }
}

export default withContext(ReportsScreen)
