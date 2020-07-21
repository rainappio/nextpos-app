import React, { Component } from 'react'
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import styles, {mainThemeColor} from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import {ThemeContainer} from "./ThemeContainer";
import {withContext} from "../helpers/contextHelper";

class PopUp extends Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      isVisible: false
    }
  }

  toggleModal = visible => {
    this.setState({
      isVisible: visible
    })
  }

  render() {
    const {
      toRoute1,
      toRoute2,
      textForRoute1,
      textForRoute2,
      navigation,
      dataArr,
      themeStyle
    } = this.props
    const { t } = this.context

    return (
      <ThemeContainer>
        <TouchableOpacity
          onPress={() => {
            this.toggleModal(true)
          }}
        >
          <Icon name="md-add" size={32} color={mainThemeColor} />
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isVisible}
          onRequestClose={() => this.toggleModal(false)}
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
              contentContainerStyle={[styles.modalContainer, {width: '100%'}]}
            >
              <TouchableWithoutFeedback>
                <View style={[styles.boxShadow, styles.popUpLayout, themeStyle]}>
                  <Text
                    style={[
                      styles.welcomeText,
                      styles.orange_color,
                      styles.mgrbtn40
                    ]}
                  >
                    {t('newItem.new')}
                  </Text>
                  <View
                    style={[styles.jc_alignIem_center, styles.flex_dir_row, {width: '100%'}]}
                  >
                    <View
                      style={{flex: 1, marginHorizontal: 5}}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate(toRoute1)
                          this.toggleModal(false)
                        }}
                      >
                        <Text style={[styles.bottomActionButton, styles.actionButton]}>
                          {textForRoute1}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{flex: 1, marginHorizontal: 5}}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate(toRoute2, {
                            dataArr: dataArr
                          })
                          this.toggleModal(false)
                        }}
                      >
                        <Text style={[styles.bottomActionButton, styles.actionButton]}>{textForRoute2}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </TouchableOpacity>
        </Modal>
      </ThemeContainer>
    )
  }
}

export default withContext(PopUp)
