import React from 'react'
import {
  AsyncStorage,
  View,
  Text,
  Image,
  FlatList,
  RefreshControl,
  TouchableHighlight
} from 'react-native'
import { connect } from 'react-redux'
import { getClientUsrs, doLogout, isTablet } from '../actions'
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
      <View
        style={[styles.container]}
        refreshControl={<RefreshControl refreshing={refreshing} />}
      >
        <BackBtn size={isTablet ? 44 : 28}/>
        <View
          style={[
            {
              width: '100%',
              position: 'absolute',
              top: 0
            }
          ]}
        >
          <TouchableHighlight>
            <Text
              style={[{ textAlign: 'right', color: '#f18d1a' }, styles.defaultfontSize]}
              onPress={() => this.handleDefaultUserLogout(navigation)}
            >
              {t('logout')}
            </Text>
          </TouchableHighlight>
        </View>

        <View style={styles.commonMgrTop}>
          <FlatList
            data={clientusers}
            renderItem={({ item }) => (
              <View
                style={[{
                    flex: 1,
                    flexDirection: 'column',
                    margin: 1
                  }, styles.commonMgrBtntenPxLarger
                ]}
              >
                <Text
                 style={[styles.customAvator, styles.defaultfontSize]}
                  onPress={() =>
                    this.props.navigation.navigate('ClientUserLogin', {
                      clientusersName: item.username,
                      defaultUser: item.defaultUser
                    })
                  }
                >
                  {item.username[0].toUpperCase()}
                </Text>
                <Text style={[styles.customAvatorUserName, styles.defaultfontSize]}>
                  {item.nickname != null ? item.nickname : item.username}
                </Text>
              </View>
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
