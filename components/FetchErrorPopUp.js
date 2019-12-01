import {Modal, ScrollView, Text, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native'
import styles from '../styles'
import React from 'react'

/**
 * https://stackoverflow.com/questions/42329240/react-native-onpress-being-called-automatically
 *
 * @deprecated
 */
class FetchErrorPopUp extends React.Component {
  state = {
    isVisible: false
  }

  toggleModal(visible) {
    this.setState({
      isVisible: visible
    })
  }

  render() {
    const {errorResponse} = this.props
    const {t} = this.props.screenProps

    let errorMessage = ''

    if (errorResponse != null) {
      switch (errorResponse.status) {
        case 401:
          errorMessage = "Your are not authenticated for this operation."
          break
        case 403:
          errorMessage = "You are not authorized for this operation."
          break
        default:
          errorMessage = "Encountered an error with your request. Please consult service provider."
      }
    }

    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isVisible}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalContainer}
            onPressOut={() => {
              this.toggleModal(false)
            }}
          >
            <ScrollView
              directionalLockEnabled={true}
              contentContainerStyle={styles.modalContainer}
            >
              <TouchableWithoutFeedback>
                <View
                  style={[styles.whiteBg, styles.boxShadow, styles.popUpLayout]}
                >
                  <Text
                    style={[
                      //styles.welcomeText,
                      styles.orange_color,
                      styles.mgrbtn40
                    ]}
                  >
                    {errorMessage}
                  </Text>

                  <View
                    style={[
                      styles.jc_alignIem_center,
                      styles.flex_dir_row,
                      styles.paddLeft20,
                      styles.paddRight20
                    ]}
                  >
                    <TouchableHighlight onPress={() => this.toggleModal(false)}>
                      <Text style={styles.signInText}>{t('action.dismiss')}</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </TouchableOpacity>
        </Modal>
      </View>
    )
  }
}

export default FetchErrorPopUp
