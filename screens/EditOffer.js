import React, {Component} from "react";
import {connect} from "react-redux";
import {View} from "react-native";
import {LocaleContext} from "../locales/LocaleContext";
import ScreenHeader from "../components/ScreenHeader";
import {clearOrderOffer, getOffers, getOrderOffer, getLables, getProducts} from '../actions'
import styles from "../styles";
import OfferForm from "./OfferForm";
import {api, dispatchFetchRequest} from '../constants/Backend'
import LoadingScreen from "./LoadingScreen";
import moment from "moment";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";

class EditOffer extends Component {
  static navigationOptions = {
    header: null
  };
  static contextType = LocaleContext;

  state = {
    startDate: "",
    endDate: "",
  };

  componentDidMount() {
    this.props.getLables()
    this.props.getProducts()
    this.props.getOrderOffer(this.props.route.params.offerId);
  }

  handleonChange = (data) => {
    let startDate = moment(data.date).format('YYYY-MM-DD') + 'T' + moment(data.time).format('HH:mm:ss');
    let endDate = moment(data.todate).format('YYYY-MM-DD') + 'T' + moment(data.totime).format('HH:mm:ss')
    this.setState({
      startDate: startDate,
      endDate: endDate,
    });
  }

  handleSubmit = values => {
    values.productIds = []
    values.productLabelIds = []
    values.excludedProductIds = []
    const offerId = this.props.route.params.offerId

    if (!values.dateBound) {
      values.startDate = null
      values.endDate = null
    }

    if (Platform.OS !== "ios") {
      values.startDate = this.state.startDate;
      values.endDate = this.state.endDate;
    }

    if (values.offerType === 'PRODUCT') {
      values.appliesToAllProducts = values.productOfferDetails.appliesToAllProducts;
    }

    if (!values.productOfferDetails?.appliesToAllProducts) {
      values.includeLabels != null && values.includeLabels.map(label => {
        values.productLabelIds.push(label.id)
      })
      values.includeProducts != null && values.includeProducts.map(product => {
        values.productIds.push(product.id)
      })
    } else {
      values.excludeProducts != null && values.excludeProducts.map(product => {
        values.excludedProductIds.push(product.id)
      })
    }

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
    var offerId = this.props.route.params.offerId;
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
  }

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
        this.props.getOrderOffer(offerId);
        this.props.navigation.navigate("EditOffer");
      }
    ).then();
  };

  render() {
    const {t, isTablet} = this.context;
    const {orderOffer, isLoading, haveData, navigation, route, labels, products} = this.props;


    const initialValues = {...orderOffer}

    initialValues.selectedofferType = initialValues.offerType === "PRODUCT" ? 1 : 0;
    initialValues.dateBound = orderOffer.startDate != null || orderOffer.endDate != null

    if (orderOffer.startDate == null) {
      initialValues.startDate = new Date()
    }

    if (orderOffer.endDate == null) {
      initialValues.endDate = new Date()
    }

    if (isLoading) {
      return <LoadingScreen />

    } else if (haveData) {
      return (
        <ThemeKeyboardAwareScrollView>
          <View style={[styles.fullWidthScreen, isTablet && styles.horizontalPaddingScreen]}>
            <ScreenHeader
              title={t("editOfferTitle")}
              parentFullScreen={true}
              backAction={this.handleEditCancel}
            />
            <OfferForm
              initialValues={initialValues}
              handleEditCancel={this.handleEditCancel}
              isEditForm={true}
              onSubmit={this.handleSubmit}
              handleDeleteOffer={this.handleDeleteOffer}
              navigation={navigation}
              route={route}
              handleActivate={this.handleActivate}
              handleDeactivate={this.handleDeactivate}
              labels={labels}
              products={products}
              onChange={this.handleonChange}
            />
          </View>
        </ThemeKeyboardAwareScrollView>
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
  isLoading: state.orderOffer.loading,
  labels: state.labels.data.labels,
  products: state.products.data.results
});

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getLables: () => dispatch(getLables()),
  getProducts: () => dispatch(getProducts()),
  getOrderOffer: id => dispatch(getOrderOffer(id)),
  getOffers: () => dispatch(getOffers()),
  clearOrderOffer: () => dispatch(clearOrderOffer())
});

export default connect(mapStateToProps, mapDispatchToProps)(EditOffer);
