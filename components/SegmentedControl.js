import React, {useEffect} from 'react'
import {View, Text} from 'react-native'
import SegmentedControlTab from "react-native-segmented-control-tab";
import styles, {mainThemeColor} from "../styles";
import {withContext} from "../helpers/contextHelper";

const SegmentedControl = props => {
  const {
    input: {onChange, value},
    values,
    selectedIndex,
    vertical,
    themeStyle,
    ...rest
  } = props


  const horizontalStyleProps = {
    tabsContainerStyle: {width: '100%'},
    tabStyle: {borderColor: mainThemeColor, width: '100%', backgroundColor: themeStyle.backgroundColor},
    tabTextStyle: {color: mainThemeColor},
    activeTabStyle: {backgroundColor: mainThemeColor}
  }

  const verticalStyleProps = {
    tabsContainerStyle: {width: '100%', flexDirection: 'column'},
    tabStyle: {borderColor: mainThemeColor, width: '100%', backgroundColor: themeStyle.backgroundColor},
    tabTextStyle: {color: mainThemeColor},
    activeTabStyle: {backgroundColor: mainThemeColor}
  }

  useEffect(() => {
    if (!!selectedIndex || selectedIndex === 0) {
      onChange(selectedIndex)
    }

  }, []);

  return (
    <View>
      <SegmentedControlTab
        values={values}
        selectedIndex={selectedIndex ?? value}
        onTabPress={onChange}
        {...(vertical ? verticalStyleProps : horizontalStyleProps)}
        {...rest}
      />
      {!!props?.meta && !props?.meta?.valid && props?.meta?.touched && <Text style={[styles.rootError]}>{props?.meta?.error}</Text>}
    </View>
  )
}

export default withContext(SegmentedControl)
