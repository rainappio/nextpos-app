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
import { isTablet } from '../actions'
import styles from '../styles'

class ReservationScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <BackBtn size={isTablet ? 44 : 28}/>
          <Text
           style={[
            styles.welcomeText,
            styles.orange_color,
            styles.textBold
          ]}
          >
            Reservation
          </Text>
          <Text style={styles.defaultfontSize}>Feature in development.</Text>
        </View>
      </ScrollView>
    )
  }
}

export default ReservationScreen
