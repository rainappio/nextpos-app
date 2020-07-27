import React, {Component} from "react";
import styles from "../styles";
import {TouchableOpacity, View} from "react-native";
import {withContext} from "../helpers/contextHelper";
import {StyledText} from "./StyledText";

class MenuButton extends Component {

  render() {
    const {onPress, icon, title, theme, themeStyle} = this.props
    return (
      <View style={styles.flex(1)}>
        <TouchableOpacity style={[styles.mainSquareButton, styles.withBorder, themeStyle]} onPress={onPress}>
          <View style={{justifyContent: 'center', alignItem: 'center'}}>
            {icon}
            <StyledText style={[styles.buttonText]}>{title}</StyledText>
          </View>
        </TouchableOpacity>
      </View>

    )
  }
}

export default withContext(MenuButton)
