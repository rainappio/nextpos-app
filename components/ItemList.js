import React from 'react'
import {FlatList, Modal, Text, TouchableOpacity, View} from 'react-native'
import styles from '../styles'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import {StyledText} from "./StyledText";
import {withContext} from "../helpers/contextHelper";
import {ThemeContainer} from "./ThemeContainer";
import {LocaleContext} from "../locales/LocaleContext";

class ItemList extends React.Component {

  static contextType = LocaleContext

  constructor(props) {
    super(props);

    this.state = {
      visible: false
    }
  }

  removeItem = id => {
    const updatedItems = this.props.input.value.filter(item => {
      return item.id !== id;
    });

    this.props.input.onChange(updatedItems)
  };


  render() {
    const {
      input: {onBlur, onChange, onFocus, value},
      themeStyle,
      listSelector,
      ...rest
    } = this.props
    const {t, customMainThemeColor} = this.context

    return (
      <View style={styles.flex(1)}>
        <View style={[styles.tableRowContainer, styles.flex(1)]}>
          <View style={[styles.tableCellView, styles.flex(1)]}>
            <AntDesignIcon
              name={"pluscircle"}
              size={22}
              color={customMainThemeColor}
              style={[{transform: [{rotateY: "180deg"}], }, styles.justifyRight]}
              onPress={() => {
                this.setState({visible: true})
              }}
            />
          </View>
        </View>

        <FlatList data={value}
          renderItem={({item, index}) => (
            <View style={styles.tableRowContainerWithBorder} key={item.id}>
              <View style={styles.tableCellView}>
                <StyledText>{item.name}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <TouchableOpacity
                  onPress={() => this.removeItem(item.id)}
                  hitSlop={styles.hitSlop}
                >
                  <AntDesignIcon
                    name={"closecircle"}
                    size={22}
                    color={"#dc3545"}
                    style={{
                      transform: [{rotateY: "180deg"}],
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => item.id + index}
        />

        <Modal transparent={true}
          visible={this.state.visible}>
          <ThemeContainer>
            <View style={styles.fullWidthScreen}>

              {/*initialize listSelector with handleOnSelect function*/}
              <View style={[styles.flex(4)]}>
                {listSelector((selectedValues) => {
                  this.props.input.onChange(selectedValues)
                })}
              </View>

              <View style={[styles.bottom, styles.horizontalMargin]}>
                <TouchableOpacity onPress={() => {
                  this.setState({visible: false})
                }}>
                  <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                    {t('action.done')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ThemeContainer>
        </Modal>
      </View>
    )
  }
}

export default withContext(ItemList)
