import React from 'react'
import { ScrollView, Text, View, TouchableOpacity, Image } from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtnCustom from '../components/BackBtnCustom'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons'
import images from '../assets/images'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";

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
        staffTimeCardReport: 'Staff Time Card'
      },
      zh: {
        salesReport: '銷售報表',
        staffTimeCardReport: '職員打卡表'
      }
    })
  }

  render() {
    const { t } = this.context

    return (
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <DismissKeyboard>
          <View style={styles.container}>
            <ScreenHeader backNavigation={false}
                          title={t('menu.reporting')}
            />

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <TouchableOpacity
                style={styles.mainSquareButton}
                onPress={() => this.props.navigation.navigate('SalesCharts')}
              >
                <View>
                  <FontAwesomeIcon
                    name="bar-chart"
                    size={40}
                    style={[styles.centerText, styles.margin_15, styles.orange_color]}
                  />
                  <Text
                    style={styles.centerText}
                  >
                    {t('salesReport')}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mainSquareButton}
                onPress={() => this.props.navigation.navigate('StaffTimeCard')}
              >
                <View style={styles.jc_alignIem_center}>
                  <Icon
                    name="md-time"
                    size={40}
                    style={[styles.centerText, styles.margin_15, styles.orange_color]}
                  />
                  <Text style={[styles.centerText]}>
                    {t('staffTimeCardReport')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

export default ReportsScreen
