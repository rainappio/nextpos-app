import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  ScrollView,
  Text,
  View,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { Accordion, List, SwipeAction } from '@ant-design/react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import PopUp from '../components/PopUp'
import { getProducts, clearLabel } from '../actions'
import styles, { mainThemeColor } from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import { api, dispatchFetchRequest, successMessage } from '../constants/Backend'
import ScreenHeader from "../components/ScreenHeader";

class ProductRow extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext

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
    }
    this.onChange = activeSections => {
      this.setState({ activeSections })
    }
  }

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
        this.props.navigation.navigate('ProductsOverview')
        this.props.getProducts()
      }
    ).then()
  }

  PanelHeader = (labelName, labelId) => {
    return (
      <View style={styles.listPanel}>
        <Text style={styles.listPanelText}>{labelName}</Text>
        {labelId !== '0' && (
          <MaterialIcon
            name="edit"
            size={22}
            style={styles.listPanelIcon}
            onPress={() => {
              this.props.navigation.navigate('CategoryCustomize', {
                labelId: labelId
              })
            }}
          />
        )}
      </View>
    )
  }

  onOpenNP = (prodId, lblId) => {
    this.setState({
      productId: prodId,
      labelId: lblId
    })
  }

  render() {
    const {
      products = [],
      labels = [],
      navigation,
      haveData,
      haveError,
      isLoading,
      label
    } = this.props
    const { t } = this.context

    var map = new Map(Object.entries(products))
    const right = [
      {
        text: <Icon name="md-trash" size={24} color="#fff" />,
        onPress: () => {
          Alert.alert(
            `${t('action.confirmMessageTitle')}`,
            `${t('action.confirmMessage')}`,
            [
              {
                text: `${t('action.yes')}`,
                onPress: () => this.handleDelete(this.state.productId)
              },
              {
                text: `${t('action.no')}`,
                onPress: () => console.log('Cancelled'),
                style: 'cancel'
              }
            ]
          )
        },
        style: { backgroundColor: '#f75336' }
      }
    ]

    return (
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <DismissKeyboard>
          <View style={styles.fullWidthScreen}>
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

            <Accordion
              onChange={this.onChange}
              activeSections={this.state.activeSections}
              duration={300}
              style={styles.childContainer}
            >
              <Accordion.Panel
                header={this.PanelHeader(t('pinned'), '0')}
                key="pinned"
              >
                <List>
                  {map.get('pinned') !== undefined &&
                    map.get('pinned').map(prd => (
                      <SwipeAction
                        autoClose={true}
                        right={right}
                        onOpen={() => this.onOpenNP(prd.id, '0')}
                        onClose={() => { }}
                        key={prd.id}
                      >
                        <List.Item
                          key={prd.id}
                          style={{
                            backgroundColor: '#f1f1f1'
                          }}
                          onPress={() => {
                            this.props.navigation.navigate('ProductEdit', {
                              productId: prd.id,
                              labelId: prd.productLabelId,
                              isPinned: true
                            })
                          }}
                        >
                          {prd.name}
                        </List.Item>
                      </SwipeAction>
                    ))}
                </List>
              </Accordion.Panel>

              {labels.map(lbl => (
                <Accordion.Panel
                  header={this.PanelHeader(lbl.label, lbl.id)}
                  key={lbl.id}
                >
                  <List>
                    {map.get(lbl.label) !== undefined && map.get(lbl.label).map(prd => (
                      <SwipeAction
                        autoClose={true}
                        right={right}
                        onOpen={() => this.onOpenNP(prd.id, lbl.id)}
                        onClose={() => { }}
                        key={prd.id}
                      >
                        <List.Item
                          key={prd.id}
                          style={{
                            backgroundColor: '#f1f1f1'
                          }}
                          onPress={() => {
                            this.props.navigation.navigate('ProductEdit', {
                              productId: prd.id,
                              labelId: prd.productLabelId,
                              isPinned: map.get('pinned').filter(pa => pa.id == prd.id)[0] !== undefined ? true : false
                            })
                          }}
                        >
                          {prd.name}
                          <TouchableOpacity onPress={() => this.handlepinToggle(prd.id)} style={[{ position: 'absolute', right: 15 }]}>
                            <AntDesignIcon
                              name={'pushpin'}
                              size={22}
                              color={!prd.pinned ? '#ccc' : mainThemeColor}
                              style={{ transform: [{ rotateY: '180deg' }] }} />
                          </TouchableOpacity>

                        </List.Item>
                      </SwipeAction>
                    ))}
                  </List>
                </Accordion.Panel>
              ))}

              <Accordion.Panel
                header={this.PanelHeader(t('ungrouped'), '0')}
                key="ungrouped"
              >
                <List>
                  {map.get('ungrouped') !== undefined &&
                    map.get('ungrouped').map(prd => (
                      <SwipeAction
                        autoClose={true}
                        right={right}
                        onOpen={() => this.onOpenNP(prd.id, '0')}
                        onClose={() => { }}
                        key={prd.id}
                      >
                        <List.Item
                          key={prd.id}
                          style={{
                            backgroundColor: '#f1f1f1'
                          }}
                          onPress={() => {
                            this.props.navigation.navigate('ProductEdit', {
                              productId: prd.id,
                              labelId: prd.productLabelId,
                              isPinned: map.get('pinned').filter(pa => pa.id == prd.id)[0] !== undefined ? true : false
                            })
                          }}
                        >
                          {prd.name}
                        </List.Item>
                      </SwipeAction>
                    ))}
                </List>
              </Accordion.Panel>
            </Accordion>
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getProducts: () => dispatch(getProducts()),
  clearLabel: () => dispatch(clearLabel())
})

ProductRow = reduxForm({
  form: 'productlist_searchform'
})(ProductRow)

export default connect(
  null,
  mapDispatchToProps
)(ProductRow)
