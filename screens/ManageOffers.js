import React from 'react'
import { View, Text, FlatList, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import ScreenHeader from "../components/ScreenHeader"
import { LocaleContext } from '../locales/LocaleContext'
import AddBtn from '../components/AddBtn'
import { getOffers } from '../actions'
import LoadingScreen from "./LoadingScreen"
import styles from '../styles'

class ManageOffers extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  componentDidMount() {
    this.context.localize({
      en: {
        manageOffersTitle: 'Manage Offers',
        newOfferTitle: 'New Offer',
        editOfferTitle: 'Edit Offer',
        offerName: 'Offer Name',
        Active: 'Active',
        startDate: 'Start Date',
        offerType: 'Offer Type',
        discountValue: 'Discount Value',
        discountType: 'Discount Type',
        amountOff: 'Amount Off',
        percentOff: 'Percent Off',
        applytoAll: 'Applies to All Product',
        amtOf: 'Amount Off',
        percentOff: 'Percent Off'
      },
      zh: {
        manageOffersTitle: 'Manage Offers-CH',
        newOfferTitle: 'New Offer-CH',
        editOfferTitle: 'Edit Offer-CH',
        offerName: 'Offer Name-CH',
        Active: 'Active-CH',
        endDate: 'End Date-CH',
        offerType: 'Offer Type-CH',
        discountValue: 'Discount Value-CH',
        discountType: 'Discount Type-CH',
        amountOff: 'Amount Off-CH',
        percentOff: 'Percent Off-CH',
        applytoAll: 'Applies to All Product-CH',
        amtOf: 'Amount Off-CH',
        percentOff: 'Percent Off-CH'
      }
    })
    this.props.getOffers()
  }

  Item = (item) => {
    return (
      <View style={styles.rowFront}>
        <Text style={[styles.rowFrontText, this.context.theme]}
          onPress={() => this.props.navigation.navigate('EditOffer', {
            offerId: item.offerId
          })}
        >{item.offerName}</Text>
      </View>
    );
  }

  render() {
    const { navigation, offers, isLoading } = this.props
    const { t, theme } = this.context

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    }
    return (
      <ScrollView scrollIndicatorInsets={{ right: 1 }} style={theme}>
        <View style={[styles.container, theme]}>
          <ScreenHeader title={t('manageOffersTitle')}
            parentFullScreen={true}
            rightComponent={
              <AddBtn
                onPress={() => navigation.navigate('NewOffer')}
              />}
          />
          <FlatList
            data={offers}
            renderItem={({ item }) => this.Item(item)}
            keyExtractor={(item) => item.offerId}
          />
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  offers: state.offers.data.results,
  isLoading: state.offers.loading
})

const mapDispatchToProps = dispatch => ({
  getOffers: () => dispatch(getOffers())
})

export default connect(mapStateToProps, mapDispatchToProps)(ManageOffers)