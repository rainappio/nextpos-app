import React from 'react';
import {Switch, Text, View} from 'react-native';
import styles from '../styles'
import {withContext} from "../helpers/contextHelper";

class ThemeToggleButton extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {theme, themeStyle, toggleTheme, locale} = this.props
    const t = locale.t

    return (
      <View style={styles.tableCellView}>
        <View>
          <Text style={[themeStyle]}>{t('preferences.darkMode')}</Text>
        </View>
        <View style={styles.alignRight}>
          <Switch
            onValueChange={(value) => toggleTheme()}
            value={theme === 'dark'}
          />
        </View>
      </View>
    )
  }
}

export default withContext(ThemeToggleButton)
