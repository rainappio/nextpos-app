import React from 'react'
import {AsyncStorage, FlatList, Text, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import {doLogout, getClientUsrs, getCurrentClient} from '../actions'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";
import {ThemeScrollView} from "../components/ThemeScrollView";


class ClientUsers extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)



  }

  componentDidMount() {
    this.props.getClientUsrs()
    this.props.getCurrentClient()
    this.context.localize({
      en: {
        clientUsersTitle: 'Client Users'
      },
      zh: {
        clientUsersTitle: '選擇使用者'
      }
    })
  }

  async handleDefaultUserLogout(navigation) {
    try {
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('clientusrToken')
      navigation.navigate('Login')
      this.props.dispatch(this.props.dispatch(doLogout()))
    } catch (err) {
      console.log(`The error is: ${err}`)
    }
  }

  render() {
    const {clientusers, navigation} = this.props
    const {t, customMainThemeColor, customBackgroundColor, customSecondThemeColor} = this.context
    return (

      <ThemeScrollView>
        <View style={[styles.fullWidthScreen]}>
          <ScreenHeader backNavigation={!!navigation?.actions?.pop}
            parentFullScreen={true}
            title={t('clientUsersTitle')}
            rightComponent={
              <TouchableOpacity onPress={() => this.handleDefaultUserLogout(navigation)}>
                <Text style={styles?.sectionBarText(customSecondThemeColor)}>
                  {t('logout')}
                </Text>
              </TouchableOpacity>
            }
          />

          <View style={[styles.horizontalMargin, {marginTop: 28}]}>
            <FlatList
              data={clientusers}
              renderItem={({item}) => (
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
                  <View style={styles.tableCellView}>
                    <View style={{
                      backgroundColor: customMainThemeColor,
                      width: 44,
                      height: 44,
                      borderRadius: 4,
                    }}>
                      <Text
                        style={{

                          textAlign: 'center',
                          lineHeight: 44,
                          color: customBackgroundColor,
                        }}
                      >
                        {item?.displayName[0].toUpperCase()}
                      </Text>
                    </View>
                    <StyledText style={{marginLeft: 15}}>
                      {item?.displayName}
                    </StyledText>
                  </View>
                </TouchableOpacity>
              )}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </ThemeScrollView>
    )
  }
}

const mapStateToProps = state => ({
  clientusers: state.clientusers.data.users
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getCurrentClient: () => dispatch(getCurrentClient()),
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
