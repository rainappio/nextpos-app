import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  TextInput
} from 'react-native'
import { connect } from 'react-redux'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import { isTablet } from '../actions'

class Sales extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        salesReportTitle: 'Sales Reports',
        salesDashboard: 'Sales Dashboard'
      },
      zh: {
        salesReportTitle: '銷售報表',
        salesDashboard: '銷售總覽'
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
        <View
          style={[styles.container, styles.nomgrBottom]}
        >
          <BackBtn size={isTablet ? 44 : 24}/>
          <Text
             style={styles.screenTitle}
          >
            {t('salesReportTitle')}
          </Text>
        </View>

        <View
          style={[
            styles.orange_bg,
            styles.flex_dir_row,
            styles.shoppingBar,
            styles.paddLeft20,
            styles.paddRight20
            // styles.top40
          ]}
        >
          <View style={[styles.jc_alignIem_center]}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('SalesCharts')}
            >
              <Text style={[styles.whiteColor, styles.defaultfontSize]}>
                {t('salesDashboard')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.container]}></View>
      </ScrollView>
    )
  }
}

export default Sales
