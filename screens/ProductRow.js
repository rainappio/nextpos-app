import React from 'react'
import {
  View,
  TouchableOpacity,
  Text, FlatList,
  Dimensions
} from 'react-native'
import {connect} from 'react-redux'
import DraggableFlatList from "react-native-draggable-flatlist";
import {DismissKeyboard} from '../components/DismissKeyboard'
import PopUp from '../components/PopUp'
import {getProducts, getLables} from '../actions'
import styles, {mainThemeColor} from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import {api, dispatchFetchRequest, successMessage} from '../constants/Backend'
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
      collapsedId: ''
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

  _renderSectionHeader = (item, index, drag, isActive) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: isActive ? "#ccc" : ''
        }}
        onPress={() => this.onSelect(item.id)}
        onLongPress={drag}
      >
        <View style={[styles.productPanel]}>
          <View style={[styles.flex(1)]}>
            <StyledText style={[styles.listPanelText]}>{item.label}</StyledText>
          </View>
          <View style={[styles.tableCellView, styles.flex(1), styles.justifyRight]}>
            {item.id !== 'pinned' && item.id !== 'ungrouped' && (
              <MaterialIcon
                name="edit"
                size={22}
                style={styles.iconStyle}
                onPress={() => {
                  this.props.navigation.navigate('CategoryCustomize', {
                    labelId: item.id
                  })
                }}
              />
            )}
            <AntDesignIcon name={this.state.selectedToggleItems.get(item.id) ? 'up' : 'down'} size={22} color="#ccc"/>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderItem = ({item, index, drag, isActive}) => {
    const map = this.props.products;

    let products = map[item.label]

    if (products == null) {
      products = map[item.id]
    }

    return (
      <View>
        {this._renderSectionHeader(item, index, drag, isActive)}
        {
          this.state.selectedToggleItems.get(item.id) &&
          <View>
            {products != null && products.map(data => {
              return (
                <View style={[styles.productPanel]} key={data.id}>
                  <TouchableOpacity
                    style={styles.flex(1)}
                    onPress={() => {
                      this.props.navigation.navigate('ProductEdit', {
                        productId: data.id,
                        labelId: data.productLabelId,
                        isPinned: this.props.products['pinned'].filter(pa => pa.id === data.id)[0] !== undefined
                      })
                    }}
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
                            ? mainThemeColor
                            : '#ccc'}
                        style={{transform: [{rotateY: '180deg'}]}}/>
                    }
                  </TouchableOpacity>
                </View>
              )
            })}
          </View>
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
        this.props.getLables()
        this.props.getProducts()
      }
    ).then()
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
    const {t} = this.context
    var getlabels = labels !== undefined && labels
    var labelsArr = [{label: t('product.pinned'), id: 'pinned'}, ...getlabels, {label: t('product.ungrouped'), id: 'ungrouped'}]

    return (
      <ThemeContainer>
        <View style={[styles.fullWidthScreen]}>
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
                         backgroundColor: mainThemeColor
                       }}
                       inputStyle={{backgroundColor: themeStyle.backgroundColor}}
                       inputContainerStyle={{borderRadius: 0, backgroundColor: themeStyle.backgroundColor}}
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
          <View style={styles.childContainer}>
            <DraggableFlatList
              data={labelsArr}
              renderItem={(item, index, drag, isActive) => this.renderItem(item, index, drag, isActive)}
              keyExtractor={(item, index) => `draggable-item-${item.label}`}
              onDragEnd={(data) => this.handleReArrange(data)}
              initialNumToRender={10}
              ListHeaderComponent={
                <View style={[themeStyle, {borderTopWidth: 0.4}]}/>
              }
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
