import React from 'react'
import {FlatList, Modal, Text, TouchableOpacity, View, Animated, Switch} from 'react-native'
import DraggableFlatList from "react-native-draggable-flatlist";
import styles from '../styles'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {StyledText} from "./StyledText";
import {withContext} from "../helpers/contextHelper";
import {ThemeContainer} from "./ThemeContainer";
import {LocaleContext} from "../locales/LocaleContext";

class ItemListDrag extends React.Component {

  static contextType = LocaleContext

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      isDragged: true,
      selectionValues: []
    }
  }


  removeItem = (id) => {
    const updatedItems = this.props.input?.value.filter(item => {
      return item.id !== id;
    })
    this.props.input.onChange(updatedItems)
  }

  setItemMultiple = (value, id) => {
    const updatedItems = this.props.input?.value
    let index = updatedItems.findIndex((item) => (item.id) == id)
    let target = {...updatedItems[index], multipleSelection: value}
    updatedItems[index] = target

    this.checkLableSort(updatedItems)
    this.props.input.onChange(updatedItems)
  }

  checkLableSort = (data) => {
    const selectionValues = data.map((item) => {return item.multipleSelection ?? false})

    this.setState({
      selectionValues: selectionValues
    })
    this.props.input.onChange(data)
  }


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

        {!!value &&
          <DraggableFlatList data={value}
            renderItem={({item, index, drag, isActive}) => (
              <View style={[styles.tableRowContainerWithBorder]} key={item.id}>
                <TouchableOpacity
                  style={[styles.jc_alignIem_center, {width: 60, marginRight: 4}]}
                  onLongPress={drag}
                >
                  <Animated.Text style={[styles.primaryText, {paddingVertical: 12}]}>
                    <MaterialIcon
                      name="drag-handle"
                      size={22}
                      style={[styles.iconStyle(this.context?.customMainThemeColor)]}
                    />
                  </Animated.Text>
                </TouchableOpacity>
                <View style={[styles.flex(5), styles.tableRowContainer]}>

                  <View style={[styles.flex(2)]}>
                    <StyledText>{item.name ?? item.label}</StyledText>
                  </View>
                  <View style={[styles.tableCellView, styles.justifyRight, {justifyContent: 'flex-end'}]}>
                    <View>
                      <StyledText>{t('product.multiple')}</StyledText>
                    </View>
                    <View style={[styles.dynamicHorizontalPadding(8)]}>
                      <Switch
                        onValueChange={(value) => {
                          this.setItemMultiple(value, (item.id))
                        }}
                        value={item?.multipleSelection ?? this.state?.selectionValues[index]}
                      />
                    </View>
                  </View>

                </View>
                <View style={[styles.tableCellView, {justifyContent: 'flex-end', width: 60}]}>
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
            )
            }
            keyExtractor={(item, index) => `item-${item.id}-${index}`}
            onDragEnd={(data) => {
              this.checkLableSort(data.data)
            }}
            onDragBegin={(index) => {}}
          />
        }

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
      </View >
    )
  }
}


export default withContext(ItemListDrag)
