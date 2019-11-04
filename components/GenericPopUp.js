import {
  Modal,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import styles from '../styles'
import React from 'react'

/**
 * https://stackoverflow.com/questions/42329240/react-native-onpress-being-called-automatically
 */
class GenericPopUp extends React.Component {
  state = {
    isVisible: false
  }

  toggleModal(visible) {
    this.setState({
      isVisible: visible
    })
  }

  render() {
    const { handleConfirmAction } = this.props

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
                      styles.welcomeText,
                      styles.orange_color,
                      styles.mgrbtn40
                    ]}
                  >
                    Are you sure?
                  </Text>

                  <View
                    style={[
                      styles.jc_alignIem_center,
                      styles.flex_dir_row,
                      styles.paddLeft20,
                      styles.paddRight20
                    ]}
                  >
                    <TouchableHighlight onPress={() => handleConfirmAction()}>
                      <Text style={styles.signInText}>Yes</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this.toggleModal(false)}>
                      <Text style={styles.signInText}>No</Text>
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

export default GenericPopUp
