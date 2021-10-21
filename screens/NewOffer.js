import React from "react";
import {Platform, View} from "react-native";
import {connect} from "react-redux";
import {clearOrderOffer, getLables, getProducts, getOffers} from "../actions";
import {api, dispatchFetchRequest} from "../constants/Backend";
import {LocaleContext} from "../locales/LocaleContext";
import ScreenHeader from "../components/ScreenHeader";
import styles from "../styles";
import moment from "moment";
import OfferForm from "./OfferForm";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";

class NewOffer extends React.Component {
  static navigationOptions = {
    header: null
  };
  static contextType = LocaleContext;

  state = {
    startDate: "",
    endDate: "",
  };

  handleonChange = (data) => {
    let startDate = moment(data.date).format('YYYY-MM-DD') + 'T' + moment(data.time).format('HH:mm:ss');
    let endDate = moment(data.todate).format('YYYY-MM-DD') + 'T' + moment(data.totime).format('HH:mm:ss');

    this.setState({
      startDate: startDate,
      endDate: endDate,
    });
  }

  componentDidMount() {
    this.props.getLables()
    this.props.getProducts()

  }

  handleEditCancel = () => {
    this.props.clearOrderOffer();
    this.props.getOffers();
    this.props.navigation.navigate("ManageOffers");
  }

  handleSubmit = values => {
    values.productIds = []
    values.productLabelIds = []
    values.excludedProductIds = []

    if (!values.dateBound) {
      values.startDate = null
      values.endDate = null
    }

    if (Platform.OS !== 'ios') {
      values.startDate = this.state.startDate;
      values.endDate = this.state.endDate;
    }
    if (values.offerType === 'PRODUCT') {
      values.appliesToAllProducts = !!values.productOfferDetails?.appliesToAllProducts
    }

    if (!values.appliesToAllProducts) {
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
      api.order.createOffer,
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

  render() {
    const {t, isTablet} = this.context;
    const {products, labels} = this.props;


    return (
      <ThemeKeyboardAwareScrollView>
        <View style={[styles.fullWidthScreen, isTablet && styles.horizontalPaddingScreen]}>
          <ScreenHeader title={t("newOfferTitle")}
            parentFullScreen={true}
          />
          <OfferForm
            initialValues={{
              offerType: 0,
              startDate: new Date(),
              endDate: new Date()
            }}
            onSubmit={this.handleSubmit}
            handleEditCancel={this.handleEditCancel}
            isEditForm={false}
            navigation={this.props.navigation}
            labels={labels}
            products={products}
            onChange={this.handleonChange}
          />
        </View>
      </ThemeKeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = state => ({
  labels: state.labels.data.labels,
  products: state.products.data.results
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  getLables: () => dispatch(getLables()),
  getProducts: () => dispatch(getProducts()),
  getOffers: () => dispatch(getOffers()),
  clearOrderOffer: () => dispatch(clearOrderOffer())
});

export default connect(mapStateToProps, mapDispatchToProps)(NewOffer);
