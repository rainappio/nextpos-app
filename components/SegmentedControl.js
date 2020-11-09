import React, {useEffect} from 'react'
import {View} from 'react-native'
import SegmentedControlTab from "react-native-segmented-control-tab";
import {mainThemeColor} from "../styles";
import {withContext} from "../helpers/contextHelper";

const SegmentedControl = props => {
  const {
    input: {onChange, value},
    values,
    selectedIndex,
    vertical,
    themeStyle,
    //meta: { error, touched, valid },
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
    if (selectedIndex === 0 || !!selectedIndex) {
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
      {/*{!valid && touched && <Text style={[styles.rootError, styles.mgrtotop12, styles.centerText]}>{error}</Text>}*/}
    </View>
  )
}

export default withContext(SegmentedControl)
