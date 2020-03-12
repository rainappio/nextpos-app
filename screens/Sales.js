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
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <View
          style={styles.container}
        >
          <BackBtn />
          <Text
            style={styles.screenTitle}
          >
            {t('salesReportTitle')}
          </Text>
        </View>

        <View style={styles.sectionBar}>

          <TouchableOpacity
            style={[styles.jc_alignIem_center, {flex: 1}]}
            onPress={() => this.props.navigation.navigate('SalesCharts')}
          >
            <Text style={[styles.paddingTopBtn8, styles.whiteColor]}>
              {t('salesDashboard')}
            </Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    )
  }
}

export default Sales
