import React from "react";
import { View, Platform } from "react-native";
import { connect } from "react-redux";
import { getLables, getOffers, removeDuplicate } from "../actions";
import { api, dispatchFetchRequest } from "../constants/Backend";
import { LocaleContext } from "../locales/LocaleContext";
import ScreenHeader from "../components/ScreenHeader";
import styles from "../styles";
import NewOfferForm from "./NewOfferForm";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import moment from "moment";
import { getDate } from "javascript-time-ago/gradation";

class NewOffer extends React.Component {
  static navigationOptions = {
    header: null
  };
  static contextType = LocaleContext;

  state = {
    startDate: "",
    endDate: "",
    productIds: [],
    productLabelIds: [],
    uniqueProductLabelIds: []
  };

  handleonChange = (data) => {
    // let startDate = moment(data.date).format('YYYY-MM-DD') + 'T' + moment(data.time).format('HH:mm:ss');
    // let endDate = moment(data.todate).format('YYYY-MM-DD') + 'T' + moment(data.totime).format('HH:mm:ss');

    this.setState({
      startDate: moment(data.date).format('YYYY-MM-DD') + 'T' + moment(data.time).format('HH:mm:ss'),
      endDate: moment(data.todate).format('YYYY-MM-DD') + 'T' + moment(data.totime).format('HH:mm:ss'),
      products: data.products,
    });
  }

  componentDidMount() {
    this.props.getLables();
    // this.setState({
    //   products: this.props.navigation.state.params !== undefined && this.props.navigation.state.params.updatedProducts
    // })
  }

  handleSubmit = values => {
    let productLabelIds = [];
    let uniqueProductLabelIds = [];
    values.productIds = [];
    values.productLabelIds = [];
    const { products } = this.state;

    values.offerType !== 0 && values.appliesToAllProducts === undefined ? values.appliesToAllProducts = false : null
    values.discountValue = parseInt(values.discountValue);
    if (Platform.OS !== 'ios') {
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

    if (values.offerType == 1) {
      values.offerType = "PRODUCT";
    } else if (values.offerType == 0) {
      values.offerType = "ORDER";
      values.productIds = null;
      values.productLabelIds = null;
    }
    console.log(values)
    console.log("add payload")
    //return;
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
    //const { products } = this.state;
    // const selectedProducts =
    //   this.props.navigation.state.params !== undefined &&
    //   this.props.navigation.state.params.updatedProducts;

// console.log("==/+/=")
// console.log(this.state)
// console.log("==")
// console.log(products)
    return (
      <KeyboardAwareScrollView>
        <View style={styles.container_nocenterCnt}>
          <ScreenHeader title={t("newOfferTitle")} />
          <NewOfferForm
            onSubmit={this.handleSubmit}
            labels={this.props.labels}
            navigation={this.props.navigation}
            //selectedProducts={products.length !== selectedProducts.length ? selectedProducts : products}
            //selectedProducts={products}
            onChange={this.handleonChange}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = state => ({
  labels: state.labels.data.labels
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  getLables: () => dispatch(getLables()),
  getOffers: () => dispatch(getOffers())
});

export default connect(mapStateToProps, mapDispatchToProps)(NewOffer);
