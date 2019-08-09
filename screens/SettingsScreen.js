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

class SettingsScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <ScrollView>
        <DismissKeyboard>
          <View style={styles.container}>
            <BackBtn />
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textMedium,
                styles.textBold
              ]}
            >
              Settings
            </Text>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View
                style={[
                  styles.margin_15,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Product')}
                >
                  <View>
                    <Icon
                      name="md-lock"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>Account</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.margin_15,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Product')}
                >
                  <View>
                    <Icon
                      name="md-home"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>Storres</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View
                style={[
                  styles.margin_15,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('ProductList')}
                >
                  <View>
                    <Icon
                      name="ios-beaker"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>Products</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.margin_15,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity>
                  <View>
                    <Icon
                      name="md-star"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>Categories</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
              <View
                style={[
                  styles.margin_15,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Product')}
                >
                  <View>
                    <Icon
                      name="md-print"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>Printer & KDS</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.margin_15,
                  styles.grayBg,
                  styles.half_width,
                  styles.jc_alignIem_center,
                  styles.paddTop_30,
                  styles.paddBottom_30
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Product')}
                >
                  <View>
                    <Icon
                      name="md-copy"
                      size={40}
                      color="#f18d1a"
                      style={[styles.centerText, styles.margin_15]}
                    />
                    <Text style={styles.centerText}>Bill</Text>
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

export default SettingsScreen
