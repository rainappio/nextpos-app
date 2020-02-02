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
import { isTablet } from '../actions'

class ReservationScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <BackBtn size={isTablet ? 44 : 24}/>
          <Text
            style={styles.screenTitle}
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
