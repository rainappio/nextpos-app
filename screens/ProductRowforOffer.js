import React from 'react'
import {
  View,
  TouchableOpacity,
  Text, FlatList
} from 'react-native'
import {connect} from 'react-redux'
import DraggableFlatList from "react-native-draggable-flatlist";
import {DismissKeyboard} from '../components/DismissKeyboard'
import {getProducts, getLables} from '../actions'
import styles, {mainThemeColor} from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import {api, dispatchFetchRequest, successMessage} from '../constants/Backend'
import ScreenHeader from "../components/ScreenHeader";
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";

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
        alreadySelected: 'Selected'
      },
      zh: {
        productListModalTitle: '選擇產品',
        alreadySelected: '已選'
      }
    })

    this.state = {
      activeSections: [],
      labelId: null,
      productId: null,
      data: [{label: 'pinned', id: 'pinned'}, ...this.props.labels, {label: 'ungrouped', id: 'ungrouped'}],
      selectedToggleItems: new Map(),
      collapsedId: '',
      products: [],
      uniqueselectedProducts: []
    }
    this.onChange = activeSections => {
      this.setState({activeSections})
    }
  }

  componentDidMount() {
    let prdArr = this.props.updatedProducts !== undefined ? this.props.updatedProducts : []
    this.setState({products: prdArr});
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

  _renderSectionHeader = (item, index, drag, isActive) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: isActive ? "#ccc" : ''
        }}
        onPress={() => this.onSelect(item.id)}
      >
        <View style={[styles.productPanel]}>
          <View style={[styles.flex(1)]}>
            <StyledText style={[styles.listPanelText]}>{item.label}</StyledText>
          </View>
          <View style={[styles.flex(1), styles.alignRight]}>
            <AntDesignIcon name={this.state.selectedToggleItems.get(item.id) ? 'up' : 'down'} size={22} color="#ccc"/>
          </View>
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

  renderItem = ({item, index, drag, isActive}) => {
    let map = this.props.products;

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
                <View style={[styles.productPanel]}
                      key={data.id}>
                  {
                    this.checkProductExists(data.id) ? (
                      <StyledText style={{marginRight: 50}}>{data.name} ({this.context.t('alreadySelected')})</StyledText>
                    ) : (
                      <TouchableOpacity
                        style={styles.flex(1)}
                        onPress={() => {
                          this.createProductsArr({productId: data.id, name: data.name, labelId: data.productLabelId});
                          const offerScreen = this.props.isEditForm ? 'EditOffer' : 'NewOffer'
                          this.props.navigation.navigate(offerScreen, {
                            updatedProducts: this.state.uniqueselectedProducts
                          })
                        }}
                      >
                        <StyledText>{data.name}</StyledText>
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
      labels,
      themeStyle
    } = this.props
    const {t} = this.context

    const labelsArr = [{label: t('product.pinned'), id: 'pinned'}, ...labels, {label: t('product.ungrouped'), id: 'ungrouped'}]

    return (
      <ThemeContainer>
        <View style={[styles.fullWidthScreen]}>
          <ScreenHeader backNavigation={true}
                        title={t('productListModalTitle')}
                        parentFullScreen={true}
          />
          <FlatList
            data={labelsArr}
            renderItem={(item, index, drag, isActive) => this.renderItem(item)}
            keyExtractor={(item, index) => `item-${item.label}`}
            initialNumToRender={10}
            ListHeaderComponent={
              <View style={[themeStyle, {borderTopWidth: 0.4}]}/>
            }
          />
        </View>
      </ThemeContainer>
    )
  }
}

const enhance = compose(
  withContext
)
export default enhance(ProductRowforOffer)
