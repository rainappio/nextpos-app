import React from 'react';
import {Switch, Text, TouchableOpacity, View} from 'react-native';
import {ThemeContext} from './ThemeContext'
import styles from '../styles'
import {withContext} from "../helpers/contextHelper";
import RNSwitch from "../components/RNSwitch";
import {Field} from "redux-form";

class ThemeToggleButton extends React.Component {

  constructor(props) {
    super(props);

    props.locale.localize({
      en: {
        toggleTheme: 'Dark Mode'
      },
      zh: {
        toggleTheme: '深色模式'
      }
    })
  }

  render() {
    const {theme, themeStyle, toggleTheme, locale} = this.props
    const t = locale.t

    return (
      <View style={styles.tableCellView}>
        <Text style={[themeStyle]}>{t('toggleTheme')}</Text>
        <Switch
          onValueChange={(value) => toggleTheme()}
          value={theme === 'dark'}
        />
      </View>
    )
  }
}

export default withContext(ThemeToggleButton)
