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

class ReportsScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.context.localize({
      en: {
        salesReport: 'Sales Reports',
        staffTimeCardReport: 'Staff Time Card',
        customerStatsReport: 'Customer Statistics',
        shiftHistory: 'Shift History'
      },
      zh: {
        salesReport: '銷售報表',
        staffTimeCardReport: '職員打卡表',
        customerStatsReport: '來客總覽',
        shiftHistory: '營收紀錄'
      }
    })
  }

  render() {
    const {themeStyle} = this.props
    const {t} = this.context

    return (
      <ThemeContainer>
        <View style={styles.fullWidthScreen}>
          <ScreenHeader backNavigation={false}
            parentFullScreen={true}
            title={t('menu.reporting')}
          />

          <View style={[styles.flex(1)]}>
            <View style={[styles.menuContainer]}>
              <MenuButton
                onPress={() => this.props.navigation.navigate('SalesCharts')}
                title={t('salesReport')}
                icon={
                  <FontAwesomeIcon
                    name="bar-chart"
                    size={40}
                    style={[styles.buttonIconStyle]}
                  />
                } />
              <View style={styles.dynamicHorizontalPadding(6)} />
              <MenuButton
                onPress={() => this.props.navigation.navigate('StaffTimeCard')}
                title={t('staffTimeCardReport')}
                icon={
                  <Icon
                    name="md-time"
                    size={40}
                    style={[styles.buttonIconStyle]}
                  />
                } />
            </View>

            <View style={[styles.menuContainer]}>
              <MenuButton
                onPress={() => this.props.navigation.navigate('CustomerStats')}
                title={t('customerStatsReport')}
                icon={
                  <Icon
                    name="md-trending-up"
                    size={40}
                    style={[styles.buttonIconStyle]}
                  />
                } />
              <View style={styles.dynamicHorizontalPadding(6)} />
              <MenuButton
                onPress={() => this.props.navigation.navigate('ShiftHistory')}
                title={t('shiftHistory')}
                icon={
                  <Icon
                    name="md-today"
                    size={40}
                    style={[styles.buttonIconStyle]}
                  />
                } />
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
