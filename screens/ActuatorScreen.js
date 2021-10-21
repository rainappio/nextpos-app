import React from 'react'
import styles from '../styles'
import {View, Text, TouchableOpacity} from 'react-native'
import * as Network from 'expo-network';
import {LocaleContext} from '../locales/LocaleContext'
import {getActuatorStatus} from '../actions'
import {compose} from "redux";
import {connect} from 'react-redux'
import {withContext} from "../helpers/contextHelper";
import ScreenHeader from "../components/ScreenHeader";
import {StyledText} from "../components/StyledText";
import {ThemeContainer} from "../components/ThemeContainer";
import {MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';

class ActuatorScreen extends React.Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      isConnected: false,
      networkType: null,
    }
  }

  componentDidMount() {
    this.props.getActuatorStatus()
    this.getNetwork()
    // {
    //   type: NetworkStateType.CELLULAR,
    //   isConnected: true,
    //   isInternetReachable: true,
    // }
  }

  getNetwork = async () => {
    let network = await Network.getNetworkStateAsync()
    console.log(network)
    this.setState({isConnected: network.isInternetReachable, networkType: network.type})
  }

  render() {
    const {actuator} = this.props
    const {t, customMainThemeColor, customBackgroundColor, isTablet} = this.context

    // console.log('actuator', actuator)
    return (
      <ThemeContainer>
        <View style={[styles.fullWidthScreen, (isTablet && styles.horizontalPaddingScreen)]}>
          <ScreenHeader backNavigation={true}
            parentFullScreen={true}
            title={t('menu.actuator')}
          />

          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <View style={{paddingRight: 8}}>
                <MaterialCommunityIcons name='check-network-outline' size={20} />
              </View>
              <StyledText style={styles.fieldTitle}>{t('actuator.status')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
              <View style={[styles.jc_alignIem_center, {width: 18, height: 18, borderRadius: 50, borderWidth: 1, borderColor: '#006B35'}, (actuator?.groups == undefined) && {borderColor: '#f75336'}]}>
                <View style={[{width: 12, height: 12, borderRadius: 50, backgroundColor: '#006B35'}, (actuator?.groups == undefined) && {backgroundColor: '#f75336'}]}></View>

              </View>
            </View>

          </View>
          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <View style={{paddingRight: 8}}>
                <MaterialCommunityIcons name='wifi' size={20} />
              </View>
              <StyledText style={styles.fieldTitle}>{t('actuator.netType')}</StyledText>
            </View>
            <View style={[styles.tableCellView, {flex: 3, justifyContent: 'flex-end'}]}>
              <View style={[styles.jc_alignIem_center]}>
                <StyledText>{this.state.networkType}</StyledText>
              </View>
            </View>
          </View>


        </View>
      </ThemeContainer>
    )
  }
}


const mapStateToProps = state => ({
  actuator: state.actuator.data,
  haveData: state.actuator.haveData,
  haveError: state.actuator.haveError,
  isLoading: state.actuator.loading
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getActuatorStatus: name => dispatch(getActuatorStatus(name))
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withContext
)

export default enhance(ActuatorScreen)

