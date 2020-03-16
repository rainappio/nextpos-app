import React from 'react'
import {View} from 'react-native'
import SegmentedControlTab from "react-native-segmented-control-tab";
import {mainThemeColor} from "../styles";

const SegmentedControl = props => {
  const {
    input: { onChange },
    values,
    selectedIndex,
    vertical,
    ...rest
  } = props

  const horizontalStyleProps = {
    tabsContainerStyle: { width: '100%' },
    tabStyle: { borderColor: mainThemeColor, width: '100%' },
    tabTextStyle: { color: mainThemeColor},
    activeTabStyle: { backgroundColor: mainThemeColor }
  }

  const verticalStyleProps = {
    tabsContainerStyle: { width: '100%', flexDirection: 'column' },
    tabStyle: { borderColor: mainThemeColor, width: '100%' },
    tabTextStyle: { color: mainThemeColor },
    activeTabStyle: { backgroundColor: mainThemeColor }
  }

  return (
    <View>
      <SegmentedControlTab
        values={values}
        selectedIndex={selectedIndex}
        onTabPress={onChange}
        { ...(vertical ? verticalStyleProps : horizontalStyleProps) }
        {...rest}
      />
    </View>
  )
}

export default SegmentedControl
