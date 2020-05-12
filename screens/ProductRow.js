import React from 'react'
import {
  View,
  TouchableOpacity,
  Alert,
  Text,
  FlatList,
  Image,
  SwipeableListView
} from 'react-native'
import { connect } from 'react-redux'
import DraggableFlatList from "react-native-draggable-flatlist";
import { DismissKeyboard } from '../components/DismissKeyboard'
import PopUp from '../components/PopUp'
import { getProducts, clearLabel, getLables, getProduct } from '../actions'
import styles, { mainThemeColor } from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import { api, dispatchFetchRequest, successMessage } from '../constants/Backend'
import ScreenHeader from "../components/ScreenHeader";
import Collapsible from "react-native-collapsible";
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/Ionicons'
import DraggableAccordion from '../components/DraggableAccordion'
import { Accordion, List, SwipeAction } from '@ant-design/react-native'
import { tickStep } from 'd3';

const exampleData = [...Array(8)].map((d, index) => ({
  key: `item-${index}`, // For example only -- don't use index as your key!
  label: index,
  backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${index *
    5}, ${132})`
}));

class ProductRow extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext;

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        productListTitle: 'Product List',
        ungrouped: 'Ungrouped',
        pinned: 'Pinned'
      },
      zh: {
        productListTitle: '產品列表',
        ungrouped: '未分類',
        pinned: '置頂產品'
      }
    })

    this.state = {
      activeSections: [],
      selectedProducts: [],
      labelId: null,
      productId: null,
      data: [{ label: 'pinned', id: 'pinned' }, ...this.props.labels, { label: 'ungrouped', id: 'ungrouped' }],
      selectedToggleItems: new Map(),
      collapsedId: []
    }
    this.onChange = activeSections => {
      this.setState({ activeSections })
    }
  }

  onSelect = (id) => {
    const newSelected = new Map(this.state.selectedToggleItems);
    newSelected.set(id, !this.state.selectedToggleItems.get(id));
    this.setState({
      selectedToggleItems: newSelected
    })
  }

  handleCollapsed = id => {
    this.setState({ collapsedId: id })
  }

  //https://stackoverflow.com/questions/57738626/collapsible-and-draggable-sectionlist-for-react-native-application

  handleDelete = productId => {
    dispatchFetchRequest(
      api.product.delete(productId),
      {
        method: 'DELETE',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      response => {
        this.props.navigation.navigate('ProductsOverview')
        this.props.getProducts()
      }
    ).then()
  }

  handlepinToggle = productId => {
    dispatchFetchRequest(
      api.product.togglePin(productId),
      {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      response => {
        successMessage('Toggled')
        this.onSelect(productId)
        this.props.getProducts()
        this.props.navigation.navigate('ProductsOverview')
      }
    ).then()
  }

  _renderSectionHeader = (item, index, drag, isActive) => {
    return (
      <TouchableOpacity
        style={{
          paddingTop: 10,
          paddingBottom: 6,
          borderWidth: 0.5,
          borderColor: '#f4f4f4',
          backgroundColor: isActive ? "#ccc" : ''
        }}
        //onPress={() => this.onSelect(item.id)}
        onPress={() => this.handleCollapsed(item.id)}
        onLongPress={drag}
      >
        <View style={[styles.listPanel, { paddingLeft: 20, paddingRight: 20, paddingTop: 8, paddingBottom: 10 }]}>
          <Text style={[styles.listPanelText]}>{item.label}</Text>
          {item.id !== 'pinned' && item.id !== 'ungrouped' && (
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
          {/* <AntDesignIcon name={this.state.selectedToggleItems.get(item.id) ? 'up' : 'down'} size={22} color="#ccc" /> */}
          <AntDesignIcon name={this.state.collapsedId === item.id ? 'up' : 'down'} size={22} color="#ccc" />
        </View>
      </TouchableOpacity>
    );
  }

  // _renderItemSection = (data, rowMap) => {
  //   return (
  //     <View style={[{ paddingTop: 20, paddingBottom: 20, backgroundColor: '#f1f1f1', paddingLeft: 20, borderTopWidth: 0.11 }]}>
  //       <Text onPress={() => {
  //         this.props.navigation.navigate('ProductEdit', {
  //           productId: data.item.id,
  //           labelId: data.item.productLabelId,
  //           isPinned: this.props.products['pinned'].filter(pa => pa.id == data.item.id)[0] !== undefined ? true : false
  //         })
  //       }} style={{ marginRight: 50 }}>{data.item.name}</Text>

  //       <TouchableOpacity onPress={() => this.handlepinToggle(data.item.id)} style={[{ position: 'absolute', right: 24 }]}>
  //         {
  //           <AntDesignIcon
  //             name={'pushpin'}
  //             size={22}
  //             color={
  //               this.state.selectedToggleItems.get(data.item.id) === data.item.id
  //                 //data.item.pinned
  //                 ? mainThemeColor
  //                 : '#ccc'}
  //             style={{ transform: [{ rotateY: '180deg' }], marginTop: 18 }} />
  //         }
  //       </TouchableOpacity>
  //     </View>
  //   )
  // }

  // _renderHiddenItemSection = (data, rowMap) => (
  //   <View style={[styles.delIcon, styles.rightAlign, { top: 8, right: -4 }]} key={rowMap}>
  //     <Icon name="md-trash" size={22} color="#fff" onPress={() => Alert.alert(
  //       `${this.context.t('action.confirmMessageTitle')}`,
  //       `${this.context.t('action.confirmMessage')}`,
  //       [
  //         {
  //           text: `${this.context.t('action.yes')}`,
  //           onPress: () => this.handleDelete(data.item.id)
  //         },
  //         {
  //           text: `${this.context.t('action.no')}`,
  //           onPress: () => console.log('Cancelled'),
  //           style: 'cancel'
  //         }
  //       ]
  //     )}
  //     />
  //   </View>
  // )

  // _renderSectionItems = (item, map) => {
  //   const { t } = this.context
  //   return (
  //     <FlatList
  //       data={map[item.label]}
  //       //extraData={this.state}
  //       keyExtractor={(data, rowMap) => rowMap.toString()}
  //       renderItem={this._renderItemSection}
  //       // renderHiddenItem={this._renderHiddenItemSection}
  //       // leftOpenValue={-60}
  //       // rightOpenValue={0}
  //       // swipeRowStyle={{ marginBottom: -2.2, backgroundColor: '#f75336' }}
  //       initialNumToRender={10}
  //     />
  //   );
  // }

  renderItem = ({ item, index, drag, isActive }) => {
    var map = this.props.products;

    // console.log(this.state.collapsedId === item.id)
    // console.log("inside renderItem")

    return (
      <View>
        {/* <Text>DUMMY</Text>  */}
        {this._renderSectionHeader(item, index, drag, isActive)}
        {/* <Collapsible collapsed={!this.state.selectedToggleItems.get(item.id)}> */}
        <Collapsible collapsed={this.state.collapsedId !== item.id}>
          {
            // this._renderSectionItems(item, map)
            map[item.label] !== undefined && map[item.label].map(data => (
              <View style={[{ paddingTop: 20, paddingBottom: 20, backgroundColor: '#f1f1f1', paddingLeft: 20, borderTopWidth: 0.11 }]} key={data.id}>
                <Text onPress={() => {
                  this.props.navigation.navigate('ProductEdit', {
                    productId: data.id,
                    labelId: data.productLabelId,
                    isPinned: this.props.products['pinned'].filter(pa => pa.id == data.id)[0] !== undefined ? true : false
                  })
                }} style={{ marginRight: 50 }}>{data.name}</Text>

                <TouchableOpacity onPress={() => this.handlepinToggle(data.id)} style={[{ position: 'absolute', right: 24 }]}>
                  {
                    <AntDesignIcon
                      name={'pushpin'}
                      size={22}
                      color={
                        //this.state.selectedToggleItems.get(data.id) === data.id
                        //this.state.selectedToggleItem === data.id
                        data.pinned
                          ? mainThemeColor
                          : '#ccc'}
                      style={{ transform: [{ rotateY: '180deg' }], marginTop: 18 }} />
                  }
                </TouchableOpacity>
              </View>
            )
            )
          }
        </Collapsible>
        {
          //this.state.selectedToggleItems.get(item.id) &&
          // this.state.collapsedId === item.id &&
          // <View>
          //   {map[item.label] !== undefined && map[item.label].map(data => {
          //     return (
          //       <View key={data.id}>
          //         <Text key={data.id}>{'' + data.pinned}</Text>
          //         <TouchableOpacity onPress={() => this.handlepinToggle(data.id)} style={[{ position: 'absolute', right: 24 }]}>
          //           <AntDesignIcon
          //             name={'pushpin'}
          //             size={22}
          //             color={data.pinned ? mainThemeColor : '#ccc'}
          //             style={{ transform: [{ rotateY: '180deg' }], marginTop: 18 }} />
          //         </TouchableOpacity>
          //       </View>
          //     )
          //   })}
          // </View>
        }
      </View>
    );
  };

  handleReArrange = (data) => {
    var from = data.from;
    var to = data.to;

    var previousProductLabelId = this.state.data[from].id;
    var nextProductLabelId = this.state.data[to].id;

    var changedPosition = {};
    changedPosition.index = to - 1;

    if (changedPosition.index < 0) {
      return false;
    } else if (changedPosition.index === 0) {
      changedPosition.previousProductLabelId = null;
    } else {
      changedPosition.previousProductLabelId = previousProductLabelId
    }

    if (changedPosition.index === this.state.data.length - 3) {
      changedPosition.nextProductLabelId = null;
    } else if (changedPosition.index > this.state.data.length - 3) {
      return false;
    } else {
      changedPosition.nextProductLabelId = nextProductLabelId
    }

    previousProductLabelId !== undefined &&
      dispatchFetchRequest(
        api.productLabel.sortPrdList(previousProductLabelId),
        {
          method: 'POST',
          withCredentials: true,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(changedPosition)
        },
        response => {
          successMessage('Success')
          this.props.getLables()
          this.props.getProducts()
        }
      ).then()
  }

  render() {
    const {
      products = [],
      labels = [],
      navigation
    } = this.props
    const { t } = this.context
    var getlabels = labels !== undefined && labels
    var labelsArr = [{ label: 'pinned', id: 'pinned' }, ...getlabels, { label: 'ungrouped', id: 'ungrouped' }]

    return (
      <DismissKeyboard>
        <View style={[styles.fullWidthScreen, styles.nomgrBottom]}>
          <ScreenHeader backNavigation={true}
            title={t('productListTitle')}
            parentFullScreen={true}
            rightComponent={
              <PopUp
                navigation={navigation}
                toRoute1={'Category'}
                toRoute2={'Product'}
                textForRoute1={t('newItem.category')}
                textForRoute2={t('newItem.product')}
              />}
          />
          <DraggableFlatList
            //data={labelsArr}
            data={exampleData}
            //renderItem={(item, index, drag, isActive) => this.renderItem(item, index, drag, isActive)}
            renderItem={() => <Text>DUMMY</Text>}
            keyExtractor={(item, index) => `draggable-item-${item.label}`}
            onDragEnd={(data) => this.handleReArrange(data)}
            //extraData={this.state.selectedToggleItems}
            //extraData={this.state.collapsedId}
            initialNumToRender={10}
          />
        </View>
      </DismissKeyboard>
    )
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getProducts: () => dispatch(getProducts()),
  getLables: () => dispatch(getLables())
})

export default connect(
  null,
  mapDispatchToProps
)(ProductRow)
