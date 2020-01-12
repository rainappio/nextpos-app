import React from 'react'
import { ScrollView, Text, View, TouchableOpacity, Image } from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtnCustom from '../components/BackBtnCustom'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import images from '../assets/images'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'

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

    this.state = {
      t: context.t
    }
  }

  render() {
    const { t } = this.state

    return (
      <ScrollView>
        <DismissKeyboard>
          <View style={styles.container}>
            <BackBtnCustom
              onPress={() => this.props.navigation.navigate('LoginSuccess')}
            />
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textMedium,
                styles.textBold
              ]}
            >
              {t('menu.reporting')}
            </Text>

            <View style={[styles.jc_alignIem_center]}>
              <View
                style={[
                  styles.margin_15,
                  styles.orange_bg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Sales')}
                >
                  <View>
                    <FontAwesomeIcon
                      name="bar-chart"
                      size={40}
                      color="#fff"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text
                      style={[
                        styles.centerText,
                        styles.textBold,
                        styles.whiteColor
                      ]}
                    >
                      {t('salesReport')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.jc_alignIem_center]}>
              <View
                style={[
                  styles.margin_15,
                  styles.lightgrayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddingTopBtn20
                ]}
              >
                <TouchableOpacity
                //onPress={() => this.props.navigation.navigate('TablesSrc')}
                >
                  <View style={styles.jc_alignIem_center}>
                    <Image
                      source={images.beenclock}
                      style={{ width: 50, height: 50, margin: 15 }}
                    />
                    <Text style={[styles.centerText, styles.textBold]}>
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
