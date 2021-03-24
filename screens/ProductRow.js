import React from 'react'
import {Dimensions, FlatList, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import DraggableFlatList from "react-native-draggable-flatlist";
import {CustomPopUp} from '../components/PopUp'
import {getLables, getProducts} from '../actions'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import {api, dispatchFetchRequest} from '../constants/Backend'
import ScreenHeader from "../components/ScreenHeader";
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {SearchBar} from "react-native-elements";
import {ThemeContainer} from "../components/ThemeContainer";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";
import {StyledText} from "../components/StyledText";

class ProductRow extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext;

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        searchPrompt: 'Search by Keyword',
        productListTitle: 'Product List',
        ungrouped: 'Ungrouped',
        pinned: 'Pinned',
      },
      zh: {
        searchPrompt: '搜尋產品',
        productListTitle: '產品列表',
        ungrouped: '未分類',
        pinned: '置頂產品',
      }
    })

    this.state = {
      searchKeyword: null,
      searching: false,
      searchResults: [],
      activeSections: [],
      selectedProducts: [],
      labelId: null,
      productId: null,
      data: [{label: 'pinned', id: 'pinned'}, ...this.props.labels, {label: 'ungrouped', id: 'ungrouped'}],
      selectedToggleItems: new Map(),
      collapsedId: '',
      labelDragged: false,
      productDragged: false,
    }
    this.onChange = activeSections => {
      this.setState({activeSections})
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
    this.setState({collapsedId: id})
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
        this.onSelect(productId)
        this.props.getProducts()
        this.props.navigation.navigate('ProductsOverview')
      }
    ).then()
  }

  _renderSectionHeader = (item, index, drag, isActive, isEmptyLabel) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: isActive ? "#ccc" : '',
        }}
        onPress={() => this.onSelect(item.id)}
        onLongPress={item?.id === 'ungrouped' ? null : drag}
      >
        <View style={[styles.productPanel, {borderColor: this.context?.customMainThemeColor, borderBottomWidth: 1}]}>
          <View style={[styles.flex(1)]}>
            <StyledText style={[styles.listPanelText]}>{item.label}</StyledText>
          </View>
          <View style={[styles.tableCellView, styles.flex(1), styles.justifyRight]}>
            {item.id !== 'pinned' && item.id !== 'ungrouped' && (
              <MaterialIcon
                name="edit"
                size={22}
                style={[styles?.iconStyle(this.context?.customMainThemeColor), {paddingHorizontal: 10}]}
                onPress={() => {
                  this.props.navigation.navigate('CategoryCustomize', {
                    labelId: item.id
                  })
                }}
              />
            )}
            <AntDesignIcon name={this.state.selectedToggleItems.get(item.id) ? 'up' : 'down'} size={22} color="#ccc" />
          </View>
        </View>
        {(isEmptyLabel && this.state.selectedToggleItems.get(item.id)) &&
          <View style={[styles.productPanel]}>
            <View style={[styles.flex(1)]}>
              <StyledText style={[styles.listPanelText, {paddingLeft: 32}]}>({this?.context?.t('empty')})</StyledText>
            </View>

          </View>
        }
      </TouchableOpacity>
    );
  }

  renderItem = ({item, index, drag, isActive}) => {
    const map = this.props.products;

    let products = map[item.label]

    if (products == null) {
      products = map[item.id]
    }
    if (item.aType === 'LABEL') {
      return (
        <View>
          {this._renderSectionHeader(item, index, drag, isActive, (!products || products?.length === 0))}

        </View>
      );
    } else {
      let data = item
      return (
        (this.state.productDragged || this.state.selectedToggleItems.get(item.productLabelId) && !this.state.labelDragged) ?

          <View style={[styles.productPanel, {paddingLeft: 32}]} key={data.id}>
            <TouchableOpacity
              style={styles.flex(1)}
              onPress={() => {
                this.props.navigation.navigate('ProductEdit', {
                  productId: data.id,
                  labelId: data.productLabelId,
                  isPinned: this.props.products['pinned'].filter(pa => pa.id === data.id)[0] !== undefined
                })
              }}
              onLongPress={drag}
            >
              <StyledText style={styles.listPanelText}>{data.name}</StyledText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handlepinToggle(data.id)}>
              {
                <AntDesignIcon
                  name={'pushpin'}
                  size={22}
                  color={
                    data.pinned
                      ? this.context?.customMainThemeColor
                      : '#ccc'}
                  style={{transform: [{rotateY: '180deg'}]}} />
              }
            </TouchableOpacity>
          </View>
          : null


      );
    }

  };

  handleReArrange = (data, labelDragged = false, productDragged = false, labelIndexArr = [], productIndexArr = [], oldData = {}) => {

    const from = data.from;
    const labelIdToUpdate = oldData?.[from]?.id
    const to = data.to;
    if (from === to)
      return null
    let request = {
      index: to,
      previousProductLabelId: null,
      nextProductLabelId: null
    }
    if (labelIndexArr?.includes(from)) {
      if (to === 0) {
        request.nextProductLabelId = oldData?.[0]?.id
      } else {
        let preLabel = null
        let index = null
        let nextLabel = null
        for (let i = labelIndexArr.length - 1; i >= 0; i--) {
          if (to > from && labelIndexArr[i] <= to) {
            preLabel = oldData?.[labelIndexArr[i]]
            nextLabel = i === labelIndexArr.length - 1 ? null : oldData?.[labelIndexArr[i + 1]]
            index = i
            break
          }
          else if (to < from && labelIndexArr[i] < to) {
            preLabel = oldData?.[labelIndexArr[i]]
            nextLabel = i === labelIndexArr.length - 1 ? null : oldData?.[labelIndexArr[i + 1]]
            index = i
            break
          }
        }
        request.index = index
        request.previousProductLabelId = preLabel?.id
        request.nextProductLabelId = nextLabel?.id
      }

      dispatchFetchRequest(
        api.productLabel.sortPrdList(labelIdToUpdate),
        {
          method: 'POST',
          withCredentials: true,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(request)
        },
        response => {
          this.props.getLables()
          this.props.getProducts()
        }
      ).then()
    } else {
      let preLabel = null
      let index = null
      let nextLabel = null
      for (let i = labelIndexArr.length - 1; i >= 0; i--) {
        if (to > from && labelIndexArr[i] <= to) {
          preLabel = oldData?.[labelIndexArr[i]]
          nextLabel = i === labelIndexArr.length - 1 ? null : oldData?.[labelIndexArr[i + 1]]
          index = i
          break
        }
        else if (to < from && labelIndexArr[i] < to) {
          preLabel = oldData?.[labelIndexArr[i]]
          nextLabel = i === labelIndexArr.length - 1 ? null : oldData?.[labelIndexArr[i + 1]]
          index = i
          break
        }
      }

      dispatchFetchRequest(
        api.productLabel.changeProductLabel(oldData?.[from]?.id),
        {
          method: 'POST',
          withCredentials: true,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({productLabelId: preLabel?.id})
        },
        response => {
          this.props.getLables()
          this.props.getProducts()
        }
      ).then()
    }
  }

  searchProduct = (keyword) => {
    this.setState({searching: true})

    dispatchFetchRequest(api.product.search(keyword), {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {}
    }, response => {
      response.json().then(data => {
        this.setState({
          searchResults: data.results,
          searching: false
        })
      })
    }).then()
  }

  render() {
    const {
      labels = [],
      navigation,
      themeStyle
    } = this.props
    const {t, customMainThemeColor, customBackgroundColor} = this.context
    var getlabels = labels !== undefined && labels
    var labelsArr = [{label: t('product.pinned'), id: 'pinned'}, ...getlabels, {label: t('product.ungrouped'), id: 'ungrouped'}]

    let resultArr = []
    let labelIndexArr = []
    let productIndexArr = []
    let arrIndexCount = 0
    let pinnedArr = []
    let emptyLabelArr = []
    getlabels.forEach((label) => {
      resultArr.push({...label, aType: 'LABEL'})
      labelIndexArr.push(arrIndexCount)
      arrIndexCount++
      if (this.props.products[label.label]?.length === 0) {
        emptyLabelArr.push(label.label)
      } else {
        this.props.products[label.label]?.forEach((product) => {
          resultArr.push({...product, aType: 'PRODUCT'})
          productIndexArr.push(arrIndexCount)
          arrIndexCount++
        })
      }
    })
    resultArr.push({label: t('product.ungrouped'), id: 'ungrouped', aType: 'LABEL'})
    this.props.products?.ungrouped?.forEach((product) => {
      resultArr.push({...product, aType: 'PRODUCT', productLabelId: 'ungrouped'})
      productIndexArr.push(arrIndexCount)
      arrIndexCount++
    })

    this.props.products?.pinned?.forEach((product) => {
      pinnedArr.push({...product, aType: 'PRODUCT'})
    })


    return (
      <ThemeContainer>
        <View style={[styles.fullWidthScreen]}>
          <ScreenHeader backNavigation={true}
            title={t('productListTitle')}
            parentFullScreen={true}
            rightComponent={
              <CustomPopUp
                navigation={navigation}
                toRoute={['Category', 'Product', 'Option']}
                textForRoute={[t('newItem.category'), t('newItem.product'), t('newItem.productOption')]}
                params={[{}, {}, {customRoute: this.props.navigation.state.routeName}]}
              />}
          />
          <View>
            <SearchBar placeholder={t('searchPrompt')}
              onChangeText={this.searchProduct}
              onClear={() => {
                this.setState({searchResults: []})
              }}
              value={this.state.searchKeyword}
              showLoading={this.state.searching}
              lightTheme={false}
              // reset the container style.
              containerStyle={{
                padding: 4,
                borderRadius: 0,
                borderWidth: 0,
                borderTopWidth: 0,
                borderBottomWidth: 0,
                backgroundColor: customMainThemeColor
              }}
              inputStyle={{backgroundColor: customBackgroundColor}}
              inputContainerStyle={{borderRadius: 0, backgroundColor: customBackgroundColor}}
            />
            <FlatList
              style={{maxHeight: Dimensions.get('window').height / 3}}
              data={this.state.searchResults}
              renderItem={({item}) => {
                return (
                  <View key={item.id} style={[styles.tableRowContainerWithBorder]}>
                    <View style={[styles.tableCellView, {flex: 1}]}>
                      <TouchableOpacity
                        style={{flex: 1}}
                        onPress={() => {
                          this.props.navigation.navigate('ProductEdit', {
                            productId: item.id,
                            labelId: item.productLabelId,
                            isPinned: item.pinned
                          })
                        }}
                      >
                        <StyledText style={styles.tableCellText}>{item.name}</StyledText>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              }}
            />
          </View>
          <View style={[styles.childContainer]}>
            <TouchableOpacity
              style={{height: 46}}
              onPress={() => this.onSelect('pinned')}
            >
              <View style={[styles.productPanel, {borderColor: customMainThemeColor, borderBottomWidth: 1}]}>
                <View style={[styles.flex(1)]}>
                  <StyledText style={[styles.listPanelText]}>{t('product.pinned')}</StyledText>
                </View>
                <View style={[styles.tableCellView, styles.flex(1), styles.justifyRight]}>
                  <AntDesignIcon name={this.state.selectedToggleItems.get('pinned') ? 'up' : 'down'} size={22} color="#ccc" />
                </View>
              </View>
            </TouchableOpacity>
            {
              pinnedArr?.map((item) => {
                return (this.state.selectedToggleItems.get('pinned') ?
                  <View style={{height: 46}} key={item.id}>
                    <View style={[styles.productPanel, {paddingLeft: 32}]}>
                      <TouchableOpacity
                        style={styles.flex(1)}
                        onPress={() => {
                          this.props.navigation.navigate('ProductEdit', {
                            productId: item.id,
                            labelId: item.productLabelId,
                            isPinned: true
                          })
                        }}
                      >
                        <StyledText style={styles.listPanelText}>{item.name}</StyledText>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.handlepinToggle(item.id)}>
                        {
                          <AntDesignIcon
                            name={'pushpin'}
                            size={22}
                            color={customMainThemeColor}
                            style={{transform: [{rotateY: '180deg'}]}} />
                        }
                      </TouchableOpacity>
                    </View>
                  </View>
                  : null
                )
              })
            }


            <DraggableFlatList
              data={resultArr}
              renderItem={(item, index, drag, isActive) => this.renderItem(item, index, drag, isActive)}
              keyExtractor={(item, index) => `draggable-item-${item.id}`}
              onDragEnd={(data) => {
                if (resultArr?.[`${data?.from}`]?.id === 'ungrouped') {
                  console.log('do nothing')
                } else {
                  this.handleReArrange(data, this.state.labelDragged, this.state.productDragged, labelIndexArr, productIndexArr, resultArr)
                }
                this.setState({labelDragged: false, productDragged: false})
              }}
              onDragBegin={(index) => {
                if (labelIndexArr.includes(index) || resultArr?.[index]?.id === 'ungrouped') {
                  console.log('drag')
                  this.setState({labelDragged: true, productDragged: false})
                } else {
                  this.setState({labelDragged: false, productDragged: true})
                }
              }}
              layoutInvalidationKey={this.state.labelDragged || this.state.productDragged}

            />

          </View>
        </View>
      </ThemeContainer>
    )
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getProducts: () => dispatch(getProducts()),
  getLables: () => dispatch(getLables())
})

const enhance = compose(
  connect(null, mapDispatchToProps),
  withContext
)
export default enhance(ProductRow)
