import React from 'react'
import { View, Text } from 'react-native'
import SegmentedControlTab from "react-native-segmented-control-tab";
import styles, { mainThemeColor } from "../styles";

const SegmentedControl = props => {
  const {
    input: { onChange },
    values,
    selectedIndex,
    vertical,
    meta: { error, touched, valid },
    ...rest
  } = props

  const horizontalStyleProps = {
    tabsContainerStyle: { width: '100%' },
    tabStyle: { borderColor: mainThemeColor, width: '100%' },
    tabTextStyle: { color: mainThemeColor },
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
        {...(vertical ? verticalStyleProps : horizontalStyleProps)}
        {...rest}
      />
      {!valid && touched && <Text style={[styles.rootError, styles.mgrtotop12, styles.centerText]}>{error}</Text>}
    </View>
  )
}

export default SegmentedControl
