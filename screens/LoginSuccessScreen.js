import React from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { doLogout } from '../actions'
import styles from '../styles'

class LoginSuccessScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const { doLogout } = this.props
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={[styles.jc_alignIem_center, styles.paddBottom_40]}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/logo.png')
                  : require('../assets/images/logo.png')
              }
              style={styles.welcomeImage}
            />
          </View>

          <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
            <View
              style={[
                styles.margin_15,
                styles.grayBg,
                styles.half_width,
                styles.jc_alignIem_center,
                styles.paddTop_40,
                styles.paddBottom_40
              ]}
            >
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Product')}
              >
                <View>
                  <Icon
                    name="md-people"
                    size={40}
                    color="#f18d1a"
                    style={[styles.centerText, styles.margin_15]}
                  />
                  <Text style={styles.centerText}>Tables</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.margin_15,
                styles.grayBg,
                styles.half_width,
                styles.jc_alignIem_center,
                styles.paddTop_40,
                styles.paddBottom_40
              ]}
            >
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Product')}
              >
                <View>
                  <Icon
                    name="md-document"
                    size={40}
                    color="#f18d1a"
                    style={[styles.centerText, styles.margin_15]}
                  />
                  <Text style={styles.centerText}>Orders</Text>
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
                styles.paddTop_40,
                styles.paddBottom_40
              ]}
            >
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Product')}
              >
                <View>
                  <Icon
                    name="ios-calendar"
                    size={40}
                    color="#f18d1a"
                    style={[styles.centerText, styles.margin_15]}
                  />
                  <Text style={styles.centerText}>Reservations</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.margin_15,
                styles.grayBg,
                styles.half_width,
                styles.jc_alignIem_center,
                styles.paddTop_40,
                styles.paddBottom_40
              ]}
            >
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Product')}
              >
                <View>
                  <FontAwesomeIcon
                    name="bar-chart"
                    size={40}
                    color="#f18d1a"
                    style={[styles.centerText, styles.margin_15]}
                  />
                  <Text style={styles.centerText}>Reporting</Text>
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
                styles.paddTop_40,
                styles.paddBottom_40
              ]}
            >
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Product')}
              >
                <View>
                  <Icon
                    name="md-settings"
                    size={40}
                    color="#f18d1a"
                    style={[styles.centerText, styles.margin_15]}
                  />
                  <Text style={styles.centerText}>Setting</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.margin_15,
                styles.grayBg,
                styles.half_width,
                styles.jc_alignIem_center,
                styles.paddTop_40,
                styles.paddBottom_40
              ]}
            >
              <TouchableOpacity onPress={doLogout}>
                <View>
                  <Icon
                    name="ios-log-out"
                    size={40}
                    color="#f18d1a"
                    style={[styles.centerText, styles.margin_15]}
                  />
                  <Text style={styles.centerText}>Logout</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  doLogout: () => {
    dispatch(doLogout())
  }
})

export default connect(
  null,
  mapDispatchToProps
)(LoginSuccessScreen)
