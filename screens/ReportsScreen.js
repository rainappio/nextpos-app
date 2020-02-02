import React from 'react'
import { ScrollView, Text, View, TouchableOpacity, Image } from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtnCustom from '../components/BackBtnCustom'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons'
import images from '../assets/images'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import { isTablet } from '../actions'

class ReportsScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
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
      <ScrollView>
        <DismissKeyboard>
          <View style={[styles.container, styles.nomgrBottom]}>
            <Text
              style={styles.screenTitle}
            >
              {t('menu.reporting')}
            </Text>

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
                 	onPress={() => this.props.navigation.navigate('Sales')}
              	>
                <View style={styles.customPaddingLarge}>
                  <FontAwesomeIcon
                    name="bar-chart"
                    size={isTablet ? 70 : 40}
                    style={[styles.centerText, styles.iconMargin, styles.orange_color]}
                  />
                  <Text
                    style={[styles.centerText, styles.defaultfontSize]}
                  >
                    {t('salesReport')}
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
                //onPress={() => this.props.navigation.navigate('TablesSrc')}
              >
                <View style={styles.customPaddingLarge}>
                  <Icon
                    name="md-time"
                    size={isTablet ? 70 : 40}
                    	style={[styles.centerText, styles.iconMargin, styles.orange_color]}
                  />
                  <Text style={[styles.centerText, styles.defaultfontSize]}>
                    {t('staffTimeCardReport')}
                  </Text>
                </View>
              </TouchableOpacity>
              </View>
            </View>
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

export default ReportsScreen
