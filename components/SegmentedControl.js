import React from 'react'
import {View} from 'react-native'
import SegmentedControlTab from "react-native-segmented-control-tab";
import { isTablet } from '../actions'
import styles from '../styles'

const SegmentedControl = props => {
  const {
    input: { onChange },
    values,
    selectedIndex,
    vertical,
    customHeight,
    ...rest
  } = props

  const horizontalStyleProps = {
    tabsContainerStyle: { width: '100%' },
    tabStyle: { borderColor: '#f18d1a', width: '100%', height: customHeight},
    tabTextStyle: [{ color: '#f18d1a'}, styles.defaultfontSize],
    activeTabStyle: { backgroundColor: '#f18d1a' }
  }

  const verticalStyleProps = {
    tabsContainerStyle: { width: '100%', flexDirection: 'column'},
    tabStyle: { borderColor: '#f18d1a', width: '100%', height: customHeight},
    tabTextStyle: [{ color: '#f18d1a'}, styles.defaultfontSize],
    activeTabStyle: { backgroundColor: '#f18d1a' }
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
