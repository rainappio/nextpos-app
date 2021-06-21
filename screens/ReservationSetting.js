import React from 'react'
import {ScrollView, View, Alert, TouchableOpacity, Text} from 'react-native'
import {Button} from "react-native-elements"
import {LocaleContext} from "../locales/LocaleContext";
import styles from '../styles'
import {StyledText} from "../components/StyledText";
import {ThemeContainer} from "../components/ThemeContainer";
import {getClientUsrs} from '../actions'
import {connect} from 'react-redux'
import LoadingScreen from "./LoadingScreen";
import Icon from 'react-native-vector-icons/Ionicons'


class ReservationSetting extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
    this.state = {
      isLoading: false,
      screenMode: 'calendar',
    }
  }

  componentDidMount() {
    this.props.getClientUsrs()
  }



  render() {
    const {
      clientusers = [],
      navigation,
      haveData,
      haveError,
      isLoading,
      currentUser
    } = this.props
    const {t, isTablet, themeStyle, customMainThemeColor, customBackgroundColor} = this.context

    this.props.navigation.openDrawer




    if (isLoading || this.state.isLoading) {
      return (
        <LoadingScreen />
      )
    } else {
      if (isTablet) {
        return (
          <ThemeContainer>
            <View style={[styles.fullWidthScreen]}>
              <View style={{flex: 3, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center'}}>
                <Button
                  icon={
                    <Icon name="hammer" size={32} color={customMainThemeColor} />
                  }
                  type='outline'
                  raised
                  onPress={() => console.log('setting test')}
                  buttonStyle={{minWidth: 320, borderColor: customMainThemeColor, backgroundColor: customBackgroundColor}}
                  title={('Coming soon...')}
                  titleStyle={{marginLeft: 10, color: customMainThemeColor}}
                />
              </View>
            </View>
          </ThemeContainer>
        )
      } else {
        return (
          <ThemeContainer>
            <View style={[styles.fullWidthScreen]}>
              <View style={{flex: 3, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center'}}>
                <Button
                  icon={
                    <Icon name="hammer" size={32} color={customMainThemeColor} />
                  }
                  type='outline'
                  raised
                  onPress={() => console.log('setting test')}
                  buttonStyle={{minWidth: 320, borderColor: customMainThemeColor, backgroundColor: customBackgroundColor}}
                  title={('Coming soon...')}
                  titleStyle={{marginLeft: 10, color: customMainThemeColor}}
                />
              </View>
            </View>
          </ThemeContainer>
        )
      }
    }
  }
}

const mapStateToProps = state => ({
  clientusers: state.clientusers.data.users,
  haveData: state.clientusers.haveData,
  haveError: state.clientusers.haveError,
  isLoading: state.clientusers.loading,
  currentUser: state.clientuser.data,
})

const mapDispatchToProps = dispatch => ({
  getClientUsrs: () => dispatch(getClientUsrs())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReservationSetting)
