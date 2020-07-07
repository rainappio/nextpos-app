import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { Text, TouchableOpacity, View, Switch, Platform } from 'react-native'
import { isRequired } from '../validators'
import InputText from '../components/InputText'
import { LocaleContext } from '../locales/LocaleContext'
import styles, { mainThemeColor } from '../styles'
import RNSwitch from "../components/RNSwitch"
import RenderDatePicker from '../components/DateTimePicker'
import SegmentedControl from '../components/SegmentedControl'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import RenderPureCheckBox from '../components/rn-elements/PureCheckBox'
import { api, dispatchFetchRequest, successMessage } from '../constants/Backend'
import DateTimeFilterControlledForm from './DateTimeFilterControlledForm'
import { getLables, getOffers, removeDuplicate } from '../actions'

class NewOfferForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
    const selectedOfferIdx = this.props.initialValues !== undefined ? this.props.initialValues.selectedofferType : null;

    this.state = {
      isEnabled: false,
      selectedOfferType: selectedOfferIdx,
      products: [],
      from: {
        show: false
      },
      to: {
        show: false
      },
      startDate: "",
      endDate: "",
    }
  }

  handlegetDate = (event, selectedDate) => {
    console.log(`selected datetime: ${selectedDate}`)
  }

  showDatepicker = (which) => {

    if (which === 'from') {
      this.setState({
        from: {
          show: !this.state.from.show
        }
      })

    } else if (which === 'to') {
      this.setState({
        to: {
          show: !this.state.to.show
        }
      })
    }
  };

  toggleSwitch = () => {
    this.setState({
      isEnabled: !this.state.isEnabled
    })
  }

  handleIndexChange = index => {
    this.setState({
      selectedOfferType: index
    });
  };

  removeArrayItem = (productId) => {
    var updatedItems = this.state.products.filter(item => {
      return item.productId !== productId
    });
    this.setState({
      products: updatedItems
    })
  }

  componentDidUpdate() {
    if (this.props.onChange) {
      this.props.onChange(this.state);
    }
  }

  render() {
    const {
      handleSubmit,
      selectedProducts
    } = this.props
    const { t, theme } = this.context
    const { isEnabled } = this.state

    return (
      <View>
        <View style={styles.fieldContainer}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.fieldTitle, theme]}>{t('offerName')}</Text>
          </View>
          <View style={{ flex: 3 }}>
            <Field
              name="offerName"
              component={InputText}
              placeholder={t('offerName')}
              secureTextEntry={false}
              validate={isRequired}
              theme={theme}
            />
          </View>
        </View>

        {
          Platform.OS === 'ios'
            ?
            <View style={[styles.tableRowContainer]}>
              <View style={[styles.tableCellView, { flex: 2 }]}>
                <Field
                  name="startDate"
                  component={RenderDatePicker}
                  onChange={this.handlegetDate}
                  placeholder={t('order.date')}
                  isShow={this.state.from.show}
                  showDatepicker={() => this.showDatepicker('from')}
                  needWeekFilter={true}
                  theme={theme}
                />
              </View>
              <View style={[styles.tableCellView, { flex: 0.2, justifyContent: 'center' }]}>
                <Text>-</Text>
              </View>
              <View style={[styles.tableCellView, { flex: 2 }]}>
                <Field
                  name="endDate"
                  component={RenderDatePicker}
                  onChange={this.handlegetDate}
                  placeholder={t('order.date')}
                  isShow={this.state.to.show}
                  showDatepicker={() => this.showDatepicker('to')}
                  needWeekFilter={true}
                  theme={theme}
                />
              </View>
            </View>
            :
            <View style={{ marginLeft: -10, marginRight: -10 }}>
              <DateTimeFilterControlledForm
                showAndroidDateTimeOnly={true}
                //onChange={this.eventHandler}
                onChange={this.props.onChange}
              />
            </View>
        }

        <View style={[styles.sectionContainer, styles.horizontalMargin, { marginLeft: 0, marginRight: 0 }]}>
          <View style={[styles.sectionContent]}>
            <View style={styles.sectionTitleContainer}>
              <Text style={[styles.sectionTitleText, theme]}>{t('offerType')}</Text>
            </View>
            <View style={{ paddingLeft: 0, paddingRight: 0 }}>
              <View>
                <Field
                  name="offerType"
                  component={SegmentedControl}
                  selectedIndex={this.state.selectedOfferType}
                  values={["Order", "Product"]}
                  onChange={this.handleIndexChange}
                  validate={isRequired}
                />
              </View>
            </View>
            {
              this.state.selectedOfferType == 1 &&
              <View style={[styles.fieldContainer, styles.mgrtotop12, styles.mgrbtn20]}>
                <View style={{ flex: 3 }}>
                  <Text style={[styles.fieldTitle, theme]}>{t('applytoAll')}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Field
                    name="appliesToAllProducts"
                    component={RNSwitch}
                    onChange={this.toggleSwitch}
                    value={isEnabled}
                  />
                </View>
              </View>
            }

            <View>
              {
                !isEnabled && this.state.selectedOfferType === 1 &&
                <View style={{ borderColor: '#ddd', borderWidth: 1 }}>
                  <AntDesignIcon
                    name={'pluscircle'}
                    size={22}
                    color={mainThemeColor}
                    style={{ transform: [{ rotateY: '180deg' }], marginTop: 12, marginBottom: 12, marginRight: 22 }}
                    onPress={() => this.props.navigation.navigate('ProductsOverviewforOffer', {
                      updatedselectedProducts: this.state.products
                    })} />
                  {
                    this.state.products.map((selectedProduct) =>
                      <View style={[{ paddingTop: 15, paddingBottom: 15, paddingLeft: 20, borderBottomWidth: 0.5, borderColor: '#ddd' }]} key={selectedProduct.productId} >
                        <Text style={theme}>{selectedProduct.name}</Text>
                        <TouchableOpacity style={[{ position: 'absolute', right: 24 }]}>
                          <AntDesignIcon
                            name={'closecircle'}
                            size={22}
                            color={'#dc3545'}
                            style={{ transform: [{ rotateY: '180deg' }], marginTop: 12 }}
                            onPress={() => this.removeArrayItem(selectedProduct.productId)}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                </View>
              }
            </View>
          </View>
        </View>

        <View style={[styles.fieldContainer, { marginTop: 8 }]}>
          <View style={[styles.sectionTitleContainer, { flex: 1 }]}>
            <Text style={[styles.sectionTitleText, theme]}>{t('discountType')}</Text>
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <View style={{ flex: 1 }}>
            <Field
              name="discountType"
              component={RenderPureCheckBox}
              customValue='AMOUNT_OFF'
              isIconAsTitle={false}
              title={t('amtOf')}
              validate={isRequired}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Field
              name="discountType"
              component={RenderPureCheckBox}
              customValue='PERCENT_OFF'
              isIconAsTitle={false}
              title={t('percentOff')}
            />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <View style={{ flex: 1.5 }}>
            <Text style={[styles.fieldTitle, theme]}>{t('discountValue')}</Text>
          </View>
          <View style={{ flex: 2.5 }}>
            <Field
              name="discountValue"
              component={InputText}
              placeholder={t('discountValue')}
              secureTextEntry={false}
              validate={isRequired}
              theme={theme}
            />
          </View>
        </View>

        <View style={[styles.bottom]}>
          <TouchableOpacity
            onPress={handleSubmit}
          >
            <Text style={[styles.bottomActionButton, styles.actionButton]}>
              {t('action.save')}
            </Text>
          </TouchableOpacity>

          <View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ManageOffers')}>
              <Text
                style={[styles.bottomActionButton, styles.cancelButton]}
              >
                {t('action.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

NewOfferForm = reduxForm({
  form: 'newOffOfferForm',
  initialValues: { startDate: new Date(), endDate: new Date() }
})(NewOfferForm)

export default NewOfferForm
