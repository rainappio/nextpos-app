import React from 'react'
import { connect } from 'react-redux'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import images from '../assets/images'
import { getfetchOrderInflights, getOrder } from '../actions'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'

class CloseComplete extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        closeCompletedTitle: 'Closing is Completed',
        end: 'End'
      },
      zh: {
        closeCompletedTitle: 'Closing is Completed-CH',
        end: 'End-CH'
      }
    })

    this.state = {
      t: context.t
    }
  }

  render() {
    const { t } = this.state

    return (
      <View style={styles.container}>
        <Text
          style={[
            styles.welcomeText,
            styles.orange_color,
            styles.textMedium,
            styles.textBold
          ]}
        >
          {t('closeCompletedTitle')}
        </Text>

        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Image
            source={images.end}
          />
        </View>

        <View>
          <View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('LoginSuccess')}
            >
              <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('end')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

// const mapDispatchToProps = (dispatch, props) => ({
//   clearOrder: () => dispatch(clearOrder(props.order.orderId)),
//   getfetchOrderInflights: () => dispatch(getfetchOrderInflights())
// })

export default connect(
  null,
  null
)(CloseComplete)
