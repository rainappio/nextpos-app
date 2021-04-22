import React, {Component} from "react";
import styles from "../styles";
import {TouchableOpacity, View} from "react-native";
import {withContext} from "../helpers/contextHelper";
import {LocaleContext} from "../locales/LocaleContext";
import {StyledText} from "./StyledText";
import {connect} from "react-redux";
import {compose} from "redux";
import {getClientUsr} from '../actions'
import {getToken} from '../constants/Backend'
import {getCurrentUserRole, getCurrentUserScope} from "../helpers/permissionActions"


class PermissionCheckTouchable extends Component {

  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      userInScope: false
    }
  }

  async componentDidMount() {
    // await this.checkCurrentUserScope()
    await this.checkCurrentUserPermission()
  }
  componentDidUpdate(prevProps, prevState) {
    if ((prevProps?.currentUser?.username !== this.props?.currentUser?.username || prevProps?.client?.clientName !== this.props?.client?.clientName)) {

      this.checkCurrentUserPermission()
      // this.checkCurrentUserScope()
    }
  }

  // tmp method: user roles
  checkCurrentUserPermission = async () => {
    let token = await getToken()
    this.props?.getCurrentUser(token.username)
    let permission = getCurrentUserRole(this.props?.currentUser, this.props?.requiredPermission)

    this.setState({userInScope: permission})
  }

  // 2021/04/21: prepare for future token.scope check
  // checkCurrentUserScope = async () => {
  //   let permission = await getCurrentUserScope()
  //   console.log("scope permission = ", permission)
  //   this.setState({userInScope: permission})
  // }


  render() {
    const {uiComponent} = this.props
    const {t, customMainThemeColor} = this.context

    let userInScope = this.state.userInScope

    if (!!userInScope) {
      return (
        <View style={[styles.flex(1)]}>
          {uiComponent}
        </View>
      )
    } else {
      return (
        <View style={[styles.flex(1), {position: 'relative'}]}>
          <TouchableOpacity style={[styles.jc_alignIem_center, {position: 'absolute', zIndex: 3, width: '100%', height: '100%', top: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.5)'}]}>
            <View style={{justifyContent: 'center', alignItem: 'center', paddingHorizontal: 8}}>
              <StyledText style={[styles.whiteColor, styles.textMedium, styles.textBold,]}>
                {t('backend.403')}
              </StyledText>
            </View>
          </TouchableOpacity>
          {uiComponent}
        </View >
      )
    }


  }
}
const mapStateToProps = state => ({
  currentUser: state.clientuser.data,
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getCurrentUser: name => dispatch(getClientUsr(name)),
})



const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withContext,
)

export default enhance(PermissionCheckTouchable)
