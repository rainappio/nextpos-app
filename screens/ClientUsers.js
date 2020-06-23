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
import ScreenHeader from "../components/ScreenHeader";

class ClientUsers extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        clientUsersTitle: 'Client Users'
      },
      zh: {
        clientUsersTitle: '選擇使用者'
      }
    })

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
    const { t, theme } = this.context

    return (
      <View style={[styles.container_nocenterCnt, { backgroundColor: theme.background }]}>

        <ScreenHeader backNavigation={true}
          title={t('clientUsersTitle')}
          rightComponent={
            <TouchableOpacity onPress={() => this.handleDefaultUserLogout(navigation)}>
              <Text style={styles.sectionBarText}>
                {t('logout')}
              </Text>
            </TouchableOpacity>
          }
        />

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
                <Text style={{ marginLeft: 60, marginTop: -30, color: theme.foreground }}>
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
