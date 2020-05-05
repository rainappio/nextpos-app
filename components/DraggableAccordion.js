import React, { Component } from 'react';
import {
  Switch,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert
} from 'react-native';
import { t } from 'i18n-js';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'
import Icon from 'react-native-vector-icons/Ionicons'
import styles, { mainThemeColor } from '../styles'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import Collapsible from 'react-native-collapsible';


export default class DraggableAccordion extends Component {
  state = {
    activeSections: [],
    collapsed: true,
    multipleSelect: false
  };

  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  render() {
    const { item, map = [], handlepinToggle, handleDelete } = this.props

    return (
      <View>
        {/* <View style={[styles.listPanel, { paddingLeft: 20, paddingRight: 20, paddingTop: 8, paddingBottom: 10 }]}> */}
        <Text style={[styles.listPanelText, { backgroundColor: 'red' }]} onPress={this.toggleExpanded}>{item.label}</Text>
        {item.id !== undefined && (
          <MaterialIcon
            name="edit"
            size={22}
            style={styles.listPanelIcon}
            onPress={() => {
              this.props.navigation.navigate('CategoryCustomize', {
                labelId: item.id
              })
            }}
          />
        )}
        <AntDesignIcon name={this.state.collapsed ? 'down' : 'up'} size={22} color="#ccc" />
        {/* </View> */}

        {
          // this.state.collapsed &&
          //   <View>
          <Collapsible collapsed={this.state.collapsed} style={{ borderWidth: 1 }} enablePointerEvents={true}>
            <SwipeListView
              data={map[item.label] !== undefined &&
                map[item.label]}
              keyExtractor={(data, rowMap) => rowMap.toString()}
              renderItem={(data, rowMap) => {
                return (
                  <View style={[{ paddingTop: 20, paddingBottom: 20, backgroundColor: '#f1f1f1', paddingLeft: 20, borderTopWidth: 0.11 }]}>
                    <Text onPress={() => {
                      this.props.navigation.navigate('ProductEdit', {
                        productId: data.item.id,
                        labelId: data.item.productLabelId,
                        isPinned: map.get('pinned').filter(pa => pa.id == data.item.id)[0] !== undefined ? true : false
                      })
                    }}>{data.item.name}</Text>

                    <TouchableOpacity onPress={() => handlepinToggle(data.item.id)} style={[{ position: 'absolute', right: 24 }]}>
                      <AntDesignIcon
                        name={'pushpin'}
                        size={22}
                        color={!data.item.pinned ? '#ccc' : mainThemeColor}
                        style={{ transform: [{ rotateY: '180deg' }], marginTop: 18 }} />
                    </TouchableOpacity>
                  </View>
                )
              }}
              renderHiddenItem={(data, rowMap) => {
                return (
                  <View style={styles.rowBack} key={rowMap}>
                    <View style={{ width: '60%' }}>
                    </View>
                    <View style={[styles.delIcon, styles.rightAlign, { top: 0, bottom: 0 }]}>
                      <Icon name="md-trash" size={22} color="#fff" onPress={() => Alert.alert(
                        `${t('action.confirmMessageTitle')}`,
                        `${t('action.confirmMessage')}`,
                        [
                          {
                            text: `${t('action.yes')}`,
                            onPress: () => handleDelete(data.item.id)
                          },
                          {
                            text: `${t('action.no')}`,
                            onPress: () => console.log('Cancelled'),
                            style: 'cancel'
                          }
                        ]
                      )
                      } />
                    </View>
                  </View>
                )
              }}
              leftOpenValue={-68}
              rightOpenValue={0}
              swipeRowStyle={{ marginBottom: -6 }}
            />
          </Collapsible>
          // </View>
        }
      </View>
    )
  }
}
