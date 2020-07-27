import React from "react";
import {Switch, View} from "react-native";

const RNSwitch = props => {
  const {
    input: { onChange, value, ...otherInput },
    meta,
    ...rest
  } = props;
  return (
    <View>
      <Switch
        onValueChange={onChange}
        value={value}
        {...otherInput}
        {...rest}
      />
    </View>
  );
};

export default RNSwitch;
