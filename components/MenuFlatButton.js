import React, {Component} from "react";
import styles from "../styles";
import {TouchableOpacity, View} from "react-native";
import {withContext} from "../helpers/contextHelper";
import {StyledText} from "./StyledText";
import NavigationService from "../navigation/NavigationService";
import {connect} from "react-redux";
import {compose} from "redux";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";

class MenuFlatButton extends Component {

  render() {
    const {onPress, icon, title, theme, themeStyle, route, customMainThemeColor} = this.props
    const restrictedFeatures = this.props?.client?.clientSubscriptionAccess?.restrictedFeatures

    return (
      <View style={styles.flex(1)}>
        <TouchableOpacity style={[styles?.flexButton(customMainThemeColor), styles?.withBorder(this.props.locale), styles?.customBorderAndBackgroundColor(this.props.locale), {paddingVertical: 16}]} onPress={onPress}>
          <View style={{justifyContent: 'center', alignItem: 'center', flexDirection: 'row'}}>
            <StyledText style={[{marginRight: 8}]}>{icon}</StyledText>
            <StyledText style={[{marginTop: 8}]}>{title}</StyledText>
          </View>
          {NavigationService.checkSubscriptionAccess(route, restrictedFeatures) && <View style={{position: 'absolute', right: 8, bottom: 8}}>
            <MCIcon
              name="professional-hexagon"
              size={32}
              style={[styles?.buttonIconStyle(customMainThemeColor)]}
            />
          </View>}
        </TouchableOpacity>
      </View>

    )
  }
}

const mapStateToProps = state => ({
  client: state.client.data,
})

const enhance = compose(
  connect(mapStateToProps, null),
  withContext,
)

export default enhance(MenuFlatButton)
