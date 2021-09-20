import React from 'react'
import {FlatList, TouchableOpacity, View} from 'react-native'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";

class ProductSelector extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext;

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        selectProductTitle: 'Select product',
        alreadySelected: 'Selected'
      },
      zh: {
        selectProductTitle: '選擇產品',
        alreadySelected: '已選'
      }
    })

    this.state = {
      activeSections: [],
      data: [{label: 'pinned', id: 'pinned'}, ...this.props.labels, {label: 'ungrouped', id: 'ungrouped'}],
      selectedToggleItems: new Map(),
      products: [],
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
            <AntDesignIcon name={this.state.selectedToggleItems.get(item.id) ? 'up' : 'down'} size={22} color="#ccc" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  addProduct = (item) => {
    this.setState({
      products: [item, ...this.state.products]
    }, () => {
      this.props.handleOnSelect(this.state.products)
    })
  }

  checkProductExists = id => {
    const found = this.state.products.find(p => {
      return (p.id === id)
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
                <View style={[styles.productPanel, styles.withBottomBorder]}
                  key={data.id}>
                  {
                    this.checkProductExists(data.id) ? (
                      <StyledText style={{marginRight: 50}}>{data.name} ({this.context.t('alreadySelected')})</StyledText>
                    ) : (
                        <TouchableOpacity
                          style={styles.flex(1)}
                          onPress={() => {
                            this.addProduct({id: data.id, name: data.name});
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

    const enhancedLabels = [{label: t('product.pinned'), id: 'pinned'}, ...labels, {label: t('product.ungrouped'), id: 'ungrouped'}]

    return (
      <ThemeContainer>
        <ScreenHeader backNavigation={false}
          parentFullScreen={true}
          title={t('selectProductTitle')}
        />
        <FlatList
          data={enhancedLabels}
          renderItem={(item, index, drag, isActive) => this.renderItem(item)}
          keyExtractor={(item, index) => `item-${item.label}`}
          ListHeaderComponent={
            <View style={[themeStyle, {borderTopWidth: 0.4}]}/>
          }
        />
      </ThemeContainer>
    )
  }
}

const enhance = compose(
  withContext
)
export default enhance(ProductSelector)
