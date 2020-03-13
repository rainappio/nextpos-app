import React from 'react'
import { connect } from 'react-redux'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import images from '../assets/images'
import { getfetchOrderInflights, getOrder } from '../actions'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";

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
    const { t } = this.context

    return (
      <View style={styles.container}>
        <ScreenHeader backNavigation={false}
                      title={t('closeCompletedTitle')}/>

        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Image
            source={images.end}
            style={[{width: 175, height: 150}]}
          />
        </View>

        <View>
          <View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('LoginSuccess')}
            >
              <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('action.done')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

export default connect(
  null,
  null
)(CloseComplete)
