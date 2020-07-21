import React from "react";
import { View, Platform } from "react-native";
import { connect } from "react-redux";
import {clearOrderOffer, getLables, getOffers} from "../actions";
import { api, dispatchFetchRequest } from "../constants/Backend";
import { LocaleContext } from "../locales/LocaleContext";
import ScreenHeader from "../components/ScreenHeader";
import styles from "../styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import moment from "moment";
import { getDate } from "javascript-time-ago/gradation";
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
    products: [],
    productIds: [],
    productLabelIds: [],
    uniqueProductLabelIds: []
  };

  handleonChange = (data) => {
    let startDate = moment(data.date).format('YYYY-MM-DD') + 'T' + moment(data.time).format('HH:mm:ss');
    let endDate = moment(data.todate).format('YYYY-MM-DD') + 'T' + moment(data.totime).format('HH:mm:ss');

    this.setState({
      startDate: startDate,
      endDate: endDate,
      products: data.products
    });
  }

  componentDidMount() {
    this.props.getLables();
    this.setState({
      products: this.props.navigation.state.params !== undefined && this.props.navigation.state.params.updatedProducts
    })
  }

  handleEditCancel = () => {
    this.props.clearOrderOffer();
    this.props.getOffers();
    this.props.navigation.navigate("ManageOffers");
  }

  handleSubmit = values => {
    values.productIds = [];
    values.productLabelIds = [];
    const { products } = this.state;

    if (!values.dateBound) {
      values.startDate = null
      values.endDate = null
    }

    if (Platform.OS !== 'ios') {
      values.startDate = this.state.startDate;
      values.endDate = this.state.endDate;
    }

    products != null && products.map(selectedProduct => {
      values.productIds.push(selectedProduct.productId)
    })

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
    const { t } = this.context;
    const { products } = this.state;
    const selectedProducts = this.props.navigation.state.params !== undefined && this.props.navigation.state.params.updatedProducts;

    return (
      <ThemeKeyboardAwareScrollView>
        <View style={styles.fullWidthScreen}>
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
            labels={this.props.labels}
            navigation={this.props.navigation}
            selectedProducts={selectedProducts}
            onChange={this.handleonChange}
          />
        </View>
      </ThemeKeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = state => ({
  labels: state.labels.data.labels
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  getLables: () => dispatch(getLables()),
  getOffers: () => dispatch(getOffers()),
  clearOrderOffer: () => dispatch(clearOrderOffer())
});

export default connect(mapStateToProps, mapDispatchToProps)(NewOffer);
