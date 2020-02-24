import React from 'react'
import {
  AsyncStorage,
  View,
  Text,
  Image,
  FlatList,
  RefreshControl,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import { getClientUsrs, doLogout } from '../actions'
import styles from '../styles'
import BackBtn from '../components/BackBtn'
import { LocaleContext } from '../locales/LocaleContext'

class ClientUsers extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      t: context.t
    }
  }

  componentDidMount() {
    this.props.getClientUsrs()
  }

  async handleDefaultUserLogout(navigation) {
    try {
      await AsyncStorage.removeItem('token')
      navigation.navigate('Login')
      this.props.dispatch(this.props.dispatch(doLogout()))
    } catch (err) {
      console.log(`The error is: ${err}`)
    }
  }

  render() {
    const { clientusers, refreshing, navigation } = this.props
    const { t } = this.state

    return (
      <View style={[styles.container, {justifyContent: 'flex-start'}]}>
        <View>
          <View>
            <BackBtn/>
            <TouchableOpacity>
              <Text
                style={{textAlign: 'right', color: '#f18d1a'}}
                onPress={() => this.handleDefaultUserLogout(navigation)}
              >
                {t('logout')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: 80 }}>
          <FlatList
            data={clientusers}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  margin: 1,
                  marginBottom: 30
                }}
                onPress={() =>
                  this.props.navigation.navigate('ClientUserLogin', {
                    clientusersName: item.username,
                    displayName: item.displayName,
                    defaultUser: item.defaultUser
                  })
                }
              >
                <Text
                  style={{
                    backgroundColor: '#f1f1f1',
                    width: 44,
                    height: 44,
                    borderRadius: 44,
                    textAlign: 'center',
                    lineHeight: 44
                  }}
                >
                  {item.username[0].toUpperCase()}
                </Text>
                <Text style={{ marginLeft: 60, marginTop: -30 }}>
                  {item.nickname != null ? item.nickname : item.username}
                </Text>
              </TouchableOpacity>
            )}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  clientusers: state.clientusers.data.users
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getClientUsrs: () => {
    dispatch(getClientUsrs())
  },
  doLoggedOut: () => {
    dispatch(doLogout())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientUsers)
