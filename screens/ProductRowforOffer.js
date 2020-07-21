import React from 'react'
import {
  View,
  TouchableOpacity,
  Text, FlatList
} from 'react-native'
import { connect } from 'react-redux'
import DraggableFlatList from "react-native-draggable-flatlist";
import { DismissKeyboard } from '../components/DismissKeyboard'
import { getProducts, getLables } from '../actions'
import styles, { mainThemeColor } from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import { api, dispatchFetchRequest, successMessage } from '../constants/Backend'
import ScreenHeader from "../components/ScreenHeader";
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

class ProductRowforOffer extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext;

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        productListModalTitle: 'Select a product',
        ungrouped: 'Ungrouped',
        pinned: 'Pinned',
        alreadySelected: 'Selected'
      },
      zh: {
        productListModalTitle: '選擇產品',
        ungrouped: '未分類',
        pinned: '置頂產品',
        alreadySelected: '已選'
      }
    })

    this.state = {
      activeSections: [],
      labelId: null,
      productId: null,
      data: [{ label: 'pinned', id: 'pinned' }, ...this.props.labels, { label: 'ungrouped', id: 'ungrouped' }],
      selectedToggleItems: new Map(),
      collapsedId: '',
      products: [],
      uniqueselectedProducts: []
    }
    this.onChange = activeSections => {
      this.setState({ activeSections })
    }
  }

  componentDidMount() {
    let prdArr = this.props.updatedProducts !== undefined ? this.props.updatedProducts : []
    this.setState({ products: prdArr });
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
        this.props.navigation.navigate('ProductsOverviewforOffer')
        this.props.getProducts()
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
        onPress={() => this.onSelect(item.id)}
        onLongPress={drag}
      >
        <View style={[styles.listPanel, { paddingLeft: 20, paddingRight: 20, paddingTop: 8, paddingBottom: 10 }]}>
          <Text style={[styles.listPanelText]}>{item.label}</Text>
          <AntDesignIcon name={this.state.selectedToggleItems.get(item.id) ? 'up' : 'down'} size={22} color="#ccc" />
          {/* <AntDesignIcon name={this.state.collapsedId === item.id ? 'up' : 'down'} size={22} color="#ccc" /> */}
        </View>
      </TouchableOpacity>
    );
  }

  createProductsArr = (item) => {
    this.state.products.push(item);
    this.setState({
      uniqueselectedProducts: this.state.products
    })
  }

  checkProductExists = productId => {
    const found = this.state.products.find(p => {
      return (p.productId === productId)
    })

    return found !== undefined
  }

  renderItem = ({ item, index, drag, isActive }) => {
    let map = this.props.products;

    return (
      <View>
        {this._renderSectionHeader(item, index, drag, isActive)}
        {
          this.state.selectedToggleItems.get(item.id) &&
          //this.state.collapsedId === item.id &&
          <View>
            {map[item.label] !== undefined && map[item.label].map(data => {
              return (
                <View style={[{ paddingTop: 20, paddingBottom: 20, backgroundColor: '#f1f1f1', paddingLeft: 20, borderTopWidth: 0.11 }]} key={data.id}>
                  {
                    this.checkProductExists(data.id) ? (
                      <Text style={{marginRight: 50}}>{data.name} ({this.context.t('alreadySelected')})</Text>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          this.createProductsArr({productId: data.id, name: data.name, labelId: data.productLabelId});
                          const offerScreen = this.props.isEditForm ? 'EditOffer' : 'NewOffer'
                          this.props.navigation.navigate(offerScreen, {
                            updatedProducts: this.state.uniqueselectedProducts
                          })
                        }}
                      >
                        <Text style={{marginRight: 50}}>{data.name}</Text>
                      </TouchableOpacity>
                    )
                  }
                </View>
              )
            })}
          </View>
        }
      </View>
    );
  };

  render() {
    const {
      labels = [],
      navigation
    } = this.props
    const { t } = this.context
    var getlabels = !labels ? navigation.state.params.labels : labels
    var labelsArr = [{ label: 'pinned', id: 'pinned' }, ...getlabels, { label: 'ungrouped', id: 'ungrouped' }]

    return (
      <DismissKeyboard>
        <View style={[styles.fullWidthScreen, styles.nomgrBottom]}>
          <ScreenHeader backNavigation={true}
            title={t('productListModalTitle')}
            parentFullScreen={true}
          />
          <FlatList
            data={labelsArr}
            renderItem={(item, index, drag, isActive) => this.renderItem(item)}
            keyExtractor={(item, index) => `draggable-item-${item.label}`}
            onDragEnd={(data) => this.handleReArrange(data)}
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
)(ProductRowforOffer)
