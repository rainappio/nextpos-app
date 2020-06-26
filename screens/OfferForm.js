import React from "react";
import { Field, reduxForm } from "redux-form";
import { Text, TouchableOpacity, View, Switch, Platform } from "react-native";
import { isRequired } from "../validators";
import InputText from "../components/InputText";
import { LocaleContext } from "../locales/LocaleContext";
import styles, { mainThemeColor } from "../styles";
import RNSwitch from "../components/RNSwitch";
import DeleteBtn from "../components/DeleteBtn";
import RenderDatePicker from "../components/DateTimePicker";
import SegmentedControl from "../components/SegmentedControl";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import RenderPureCheckBox from "../components/rn-elements/PureCheckBox";
import {
  api,
  dispatchFetchRequest,
  successMessage
} from "../constants/Backend";
import DateTimeFilterControlledForm from "./DateTimeFilterControlledForm";

class OfferForm extends React.Component {
  static navigationOptions = {
    header: null
  };
  static contextType = LocaleContext;

  constructor(props, context) {
    super(props, context);
    const selectedOfferIdx =
      this.props.initialValues !== undefined
        ? this.props.initialValues.selectedofferType
        : null;

    this.state = {
      isEnabled: false,
      selectedOfferType: selectedOfferIdx,
      products: [],
      uniqueProducts: [],
      from: {
        show: false
      },
      to: {
        show: false
      }
    };
  }

  componentDidMount() {
    let selectedProducts =
      this.props.initialValues.productOfferDetails !== null
        ? this.props.initialValues.productOfferDetails.selectedProducts
        : [];
    this.setState({
      products:
        this.props.selectedProducts !== undefined
          ? this.props.selectedProducts
          : selectedProducts
    });
  }

  handlegetDate = (event, selectedDate) => {
    console.log(`selected datetime: ${selectedDate}`);
  };

  showDatepicker = which => {
    if (which === "from") {
      this.setState({
        from: {
          show: !this.state.from.show
        }
      });
    } else if (which === "to") {
      this.setState({
        to: {
          show: !this.state.to.show
        }
      });
    }
  };

  toggleSwitch = () => {
    this.setState({
      isEnabled: !this.state.isEnabled
    });
  };

  handleDelete = productId => {
    dispatchFetchRequest(
      api.product.delete(productId),
      {
        method: "DELETE",
        withCredentials: true,
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      },
      response => {
        successMessage("deleted");
        this.props.navigation.navigate("NewOffer");
      }
    ).then();
  };

  handleIndexChange = index => {
    this.setState({
      selectedOfferType: index
    });
  };

  removeArrayItem = productId => {
    var updatedItems = this.state.products.filter(item => {
      return item.productId !== productId;
    });
    this.setState({
      products: updatedItems
    });
  };

  componentDidUpdate() {
    if (this.props.onChange) {
      this.props.onChange(this.state);
    }
  }

  render() {
    const {
      handleSubmit,
      isEditForm,
      handleEditCancel,
      onCancel,
      handleDeleteOffer,
      selectedProducts,
      initialValues,
      handleActivate,
      handleDeactivate
    } = this.props;
    const { t } = this.context;
    const { isEnabled, products } = this.state;

    return (
      <View>
        <View style={styles.fieldContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldTitle}>{t("offerName")}</Text>
          </View>
          <View style={{ flex: 3 }}>
            <Field
              name="offerName"
              component={InputText}
              placeholder={t("offerName")}
              secureTextEntry={false}
              autoFocus={!isEditForm}
              validate={isRequired}
            />
          </View>
        </View>

        {Platform.OS === "ios" ? (
          <View style={[styles.tableRowContainer]}>
            <View style={[styles.tableCellView, { flex: 2 }]}>
              <Field
                name="startDate"
                component={RenderDatePicker}
                onChange={this.handlegetDate}
                placeholder={t("order.date")}
                isShow={this.state.from.show}
                showDatepicker={() => this.showDatepicker("from")}
                needWeekFilter={true}
              />
            </View>
            <View
              style={[
                styles.tableCellView,
                { flex: 0.2, justifyContent: "center" }
              ]}
            >
              <Text>-</Text>
            </View>
            <View style={[styles.tableCellView, { flex: 2 }]}>
              <Field
                name="endDate"
                component={RenderDatePicker}
                onChange={this.handlegetDate}
                placeholder={t("order.date")}
                isShow={this.state.to.show}
                showDatepicker={() => this.showDatepicker("to")}
                needWeekFilter={true}
              />
            </View>
          </View>
        ) : (
          <View style={{ marginLeft: -10, marginRight: -10 }}>
            <DateTimeFilterControlledForm
              showAndroidDateTimeOnly={true}
              endDate={initialValues.endDate}
              startDate={initialValues.startDate}
            />
          </View>
        )}

        <View
          style={[
            styles.sectionContainer,
            styles.horizontalMargin,
            { marginLeft: 0, marginRight: 0 }
          ]}
        >
          <View style={[styles.sectionContent]}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitleText}>{t("offerType")}</Text>
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
            {this.state.selectedOfferType == 1 && (
              <View
                style={[
                  styles.fieldContainer,
                  styles.mgrtotop12,
                  styles.mgrbtn20
                ]}
              >
                <View style={{ flex: 3 }}>
                  <Text style={styles.fieldTitle}>{t("applytoAll")}</Text>
                </View>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Field
                    name="productOfferDetails.appliesToAllProducts"
                    component={RNSwitch}
                    onChange={this.toggleSwitch}
                  />
                </View>
              </View>
            )}

            {this.state.selectedOfferType === 1 && !isEnabled && !initialValues.productOfferDetails.appliesToAllProducts && (
                <View style={{ borderColor: "#ddd", borderWidth: 1 }}>
                  <AntDesignIcon
                    name={"pluscircle"}
                    size={22}
                    color={mainThemeColor}
                    style={{
                      transform: [{ rotateY: "180deg" }],
                      marginTop: 12,
                      marginBottom: 12,
                      marginRight: 22
                    }}
                    onPress={() =>
                      this.props.navigation.navigate(
                        "ProductsOverviewforOffer",
                        {
                          isEditForm: isEditForm,
                          updatedselectedProducts: this.state.products
                        }
                      )
                    }
                  />

                  {products !== undefined &&
                    products.map(selectedProduct => (
                      <View
                        style={[
                          {
                            paddingTop: 15,
                            paddingBottom: 15,
                            paddingLeft: 20,
                            borderBottomWidth: 0.5,
                            borderColor: "#ddd"
                          }
                        ]}
                        key={selectedProduct.productId}
                      >
                        <Text>{selectedProduct.name}</Text>
                        <TouchableOpacity
                          style={[{ position: "absolute", right: 24 }]}
                        >
                          <AntDesignIcon
                            name={"closecircle"}
                            size={22}
                            color={"#dc3545"}
                            style={{
                              transform: [{ rotateY: "180deg" }],
                              marginTop: 12
                            }}
                            // onPress={() => this.handleDelete(selectedProduct.productId)}
                            onPress={() =>
                              this.removeArrayItem(selectedProduct.productId)
                            }
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                </View>
              )}
          </View>
        </View>

        <View style={[styles.fieldContainer, { marginTop: 8 }]}>
          <View style={[styles.sectionTitleContainer, { flex: 1 }]}>
            <Text style={styles.sectionTitleText}>{t("discountType")}</Text>
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <View style={{ flex: 1 }}>
            <Field
              name="discountType"
              component={RenderPureCheckBox}
              customValue="AMOUNT_OFF"
              isIconAsTitle={false}
              title={t("amtOf")}
              validate={isRequired}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Field
              name="discountType"
              component={RenderPureCheckBox}
              customValue="PERCENT_OFF"
              isIconAsTitle={false}
              title={t("percentOff")}
            />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <View style={{ flex: 1.5 }}>
            <Text style={styles.fieldTitle}>{t("discountValue")}</Text>
          </View>
          <View style={{ flex: 2.5 }}>
            <Field
              name="discountValue"
              component={InputText}
              placeholder={t("discountValue")}
              secureTextEntry={false}
              //autoFocus={!isEditForm}
              validate={isRequired}
            />
          </View>
        </View>

        <View style={[styles.bottom]}>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={[styles.bottomActionButton, styles.actionButton]}>
              {t("action.save")}
            </Text>
          </TouchableOpacity>
          {!this.props.initialValues.active ? (
            <TouchableOpacity
              onPress={() => handleActivate(initialValues.offerId)}
            >
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {t("action.activate")}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => handleDeactivate(initialValues.offerId)}
            >
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {t("action.deactivate")}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={handleEditCancel}>
            <Text style={[styles.bottomActionButton, styles.cancelButton]}>
              {t("action.cancel")}
            </Text>
          </TouchableOpacity>

          <DeleteBtn handleDeleteAction={handleDeleteOffer} />
        </View>
      </View>
    );
  }
}

OfferForm = reduxForm({
  form: "newOffOfferFormerForm"
})(OfferForm);

export default OfferForm;
