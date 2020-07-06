import React, { Component } from "react";
import { connect } from "react-redux";
import { View, ScrollView, AsyncStorage } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { LocaleContext } from "../locales/LocaleContext";
import { DismissKeyboard } from "../components/DismissKeyboard";
import ScreenHeader from "../components/ScreenHeader";
import { getOrderOffer, getOffers, clearOrderOffer, removeDuplicate } from '../actions'
import styles from "../styles";
import OfferForm from "./OfferForm";
import { api, dispatchFetchRequest, successMessage } from '../constants/Backend'
import LoadingScreen from "./LoadingScreen";
import moment from "moment";

class EditOffer extends Component {
  static navigationOptions = {
    header: null
  };
  static contextType = LocaleContext;

  state = {
    startDate: "",
    endDate: "",
    products: [],
    productIds: [],
    productLabelIds: [],
    uniqueProductLabelIds: []
  };

  componentDidMount() {
    this.props.getOrderOffer(this.props.navigation.state.params.offerId);
  }

  handleonChange = (data) => {
    let startDate = moment(data.date).format('YYYY-MM-DD') + 'T' + moment(data.time).format('HH:mm:ss');
    let endDate = moment(data.todate).format('YYYY-MM-DD') + 'T' + moment(data.totime).format('HH:mm:ss')
    this.setState({
      startDate: startDate,
      endDate: endDate,
      products: data.products
    });
  }

  handleSubmit = values => {
    let productLabelIds = [];
    let uniqueProductLabelIds = [];
    values.productIds = [];
    values.productLabelIds = [];
    var offerId = this.props.navigation.state.params.offerId;
    const { products } = this.state;

    values.offerType !== 0 && values.appliesToAllProducts === undefined ? values.appliesToAllProducts = false : null;
    if(values.productOfferDetails.appliesToAllProducts === true){
      values.appliesToAllProducts = true;
    }

    if (Platform.OS !== "ios") {
      values.startDate = this.state.startDate;
      values.endDate = this.state.endDate;
    }

    products !== undefined && products !== false && products.map(selectedProduct => {
      values.productIds.push(selectedProduct.productId)
      productLabelIds.push(selectedProduct.labelId)
      uniqueProductLabelIds = productLabelIds.filter(function (item, index) {
        return productLabelIds.indexOf(item) == index;
      })
      values.productLabelIds = uniqueProductLabelIds;
    })

    if (values.offerType === "PRODUCT") {
      values.offerType = 1;
    } else if (values.offerType === "ORDER") {
      values.offerType = 0;
      values.productIds = null;
      values.productLabelIds = null;
    }

    console.log(values)
    console.log("edit payload")
    //return;

    dispatchFetchRequest(
      api.order.updateOrderOfferById(offerId),
      {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      },
      response => {
        this.props.navigation.navigate("ManageOffers");
        this.props.getOffers();
      }
    ).then();
  };

  handleDeleteOffer = () => {
    var offerId = this.props.navigation.state.params.offerId;
    dispatchFetchRequest(
      api.order.deleteOrderOfferById(offerId),
      {
        method: "DELETE",
        withCredentials: true,
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      },
      response => {
        this.props.navigation.navigate("ManageOffers");
        this.props.getOffers();
        this.props.clearOrderOffer();
      }
    ).then();
  };

  handleEditCancel = () => {
    this.props.clearOrderOffer();
    this.props.getOffers();
    this.props.navigation.navigate("ManageOffers");
  };

  handleActivate = offerId => {
    dispatchFetchRequest(
      api.order.activateOrderOfferById(offerId),
      {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      },
      response => {
        successMessage("Activated");
        this.props.getOrderOffer(offerId);
        this.props.navigation.navigate("EditOffer");
      }
    ).then();
  };

  handleDeactivate = offerId => {
    dispatchFetchRequest(
      api.order.deactivateOrderOfferById(offerId),
      {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      },
      response => {
        successMessage("Deactivated");
        this.props.getOrderOffer(offerId);
        this.props.navigation.navigate("EditOffer");
      }
    ).then();
  };

  render() {
    const { t } = this.context;
    const { orderOffer, isLoading, haveData } = this.props;

    const selectedProducts =
      this.props.navigation.state.params !== undefined &&
      this.props.navigation.state.params.updatedProducts;

    orderOffer.selectedofferType = 0;
    if (orderOffer.offerType !== undefined) {
      if (orderOffer.offerType === "PRODUCT") {
        orderOffer.selectedofferType = 1;
      }
    }

    if (isLoading) {
      return <LoadingScreen />;
    } else if (haveData) {
      return (
        <KeyboardAwareScrollView>
          <DismissKeyboard>
            <View style={styles.container_nocenterCnt}>
              <ScreenHeader
                title={t("editOfferTitle")}
                backAction={this.handleEditCancel}
              />
              <OfferForm
                initialValues={
                 Object.keys(orderOffer).length !== 0 && orderOffer
                }
                handleEditCancel={this.handleEditCancel}
                isEditForm={true}
                onSubmit={this.handleSubmit}
                handleDeleteOffer={this.handleDeleteOffer}
                navigation={this.props.navigation}
                handleActivate={this.handleActivate}
                handleDeactivate={this.handleDeactivate}
                isLoading={isLoading}
                selectedProducts={selectedProducts}
                onChange={this.handleonChange}
              />
            </View>
          </DismissKeyboard>
        </KeyboardAwareScrollView>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => ({
  orderOffer: state.orderOffer.data,
  haveData: state.orderOffer.haveData,
  haveError: state.orderOffer.haveError,
  isLoading: state.orderOffer.loading
});

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getOrderOffer: id => dispatch(getOrderOffer(id)),
  getOffers: () => dispatch(getOffers()),
  clearOrderOffer: () => dispatch(clearOrderOffer())
});

export default connect(mapStateToProps, mapDispatchToProps)(EditOffer);
