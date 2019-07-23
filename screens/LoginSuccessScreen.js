import React from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import { doLogout } from '../actions'
import styles from '../styles'

class LoginSuccessScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const { doLogout } = this.props
    return (
      <View style={styles.container}>
        <Text>Login Success!</Text>
        <View
          style={[
            {
              width: '100%',
              backgroundColor: '#F39F86',
              position: 'absolute',
              bottom: 56,
              borderRadius: 4
            }
          ]}
        >
          <TouchableHighlight onPress={doLogout}>
            <Text style={styles.gsText}>Logout</Text>
          </TouchableHighlight>
        </View>
      </View>
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
