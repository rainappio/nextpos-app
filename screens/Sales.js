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

class Sales extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <ScrollView>
        <View
          style={{
            marginTop: 62,
            marginLeft: 35,
            marginRight: 35
          }}
        >
          <BackBtn />
          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textMedium,
              styles.textBold
            ]}
          >
            Sales
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
          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('SalesCharts')}
            >
              <Text style={[styles.paddingTopBtn8, styles.whiteColor]}>
                Sales
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
