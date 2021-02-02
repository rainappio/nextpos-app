import React from 'react'
import {connect} from 'react-redux'
import {Image, Text, TouchableOpacity, View} from 'react-native'
import images from '../assets/images'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import {ThemeContainer} from "../components/ThemeContainer";
import {handleSendEmail} from "../helpers/shiftActions";

class CloseComplete extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        closeCompletedTitle: 'Closing Account Complete'
      },
      zh: {
        closeCompletedTitle: '關帳完成'
      }
    })
  }

  render() {
    const {t} = this.context

    return (
      <ThemeContainer>
        <View style={styles.container}>
          <ScreenHeader backNavigation={false}
            title={t('closeCompletedTitle')} />

          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          >
            <Image
              source={images.end}
              style={[{width: 175, height: 150}]}
            />
          </View>

          <View>
            <TouchableOpacity
              onPress={() => handleSendEmail(this.props.navigation.state.params?.mostRecentShift?.id)}
            >
              <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('shift.sendEmail')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('LoginSuccess')}
            >
              <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('action.done')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ThemeContainer>
    )
  }
}

export default connect(
  null,
  null
)(CloseComplete)
