import React, {Component} from "react";
import styles from "../styles";
import {Text, TouchableOpacity, View} from "react-native";

export default class MenuButton extends Component {

  render() {
    const {onPress, icon, title} = this.props
    return (
      <TouchableOpacity style={[styles.mainSquareButton]} onPress={onPress}>
        <View style={{justifyContent: 'center', alignItem: 'center'}}>
          {icon}
          <Text style={[styles.buttonText]}>{title}</Text>
        </View>
      </TouchableOpacity>

    )
  }

}
