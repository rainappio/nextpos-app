import React from 'react'
import {FlatList, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import ScreenHeader from "../components/ScreenHeader"
import {LocaleContext} from '../locales/LocaleContext'
import AddBtn from '../components/AddBtn'
import {getOffers} from '../actions'
import LoadingScreen from "./LoadingScreen"
import styles from '../styles'
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";

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
        offerStatus: 'Offer Status',
        dateBound: 'Set Date Range',
        active: 'Active',
        inactive: 'Inactive',
        startDate: 'Start Date',
        endDate: 'End Date',
        offerType: 'Offer Type',
        discountValue: 'Discount Value',
        discountType: 'Discount Type',
        amountOff: 'Amount Off',
        percentOff: 'Percent Off',
        applyToAll: 'Applies to All Product',
        offerTypeName: {
          ORDER: 'Order',
          PRODUCT: 'Product'
        },
        triggerType: 'Trigger Type',
        triggerTypeName: {
          AT_CHECKOUT: 'At Checkout',
          ALWAYS: 'Always'
        },
      },
      zh: {
        manageOffersTitle: '促銷管理',
        newOfferTitle: '新增促銷',
        editOfferTitle: '編輯促銷',
        offerName: '促銷名稱',
        offerStatus: '狀態',
        dateBound: '設定期限',
        active: '啟用中',
        inactive: '停用中',
        startDate: '開始',
        endDate: '結束',
        offerType: '促銷種類',
        discountValue: '折扣',
        discountType: '折扣種類',
        amountOff: '折扣$',
        percentOff: '折扣%',
        applyToAll: '套用到所有產品',
        offerTypeName: {
          ORDER: '套用訂單',
          PRODUCT: '套用產品'
        },
        triggerType: '促銷顯示',
        triggerTypeName: {
          AT_CHECKOUT: '結帳時',
          ALWAYS: '隨時'
        },
      }
    })
    this.props.getOffers()
  }

  Item = (item) => {
    return (
      <View style={styles.rowFront}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('EditOffer', {
            offerId: item.offerId
          })}
        >
          <StyledText style={styles.rowFrontText}>{item.offerName} ({this.context.t(`offerTypeName.${item.offerType}`)})</StyledText>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { navigation, offers, isLoading } = this.props
    const { t } = this.context

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    }
    return (
      <ThemeScrollView>
        <View style={[styles.fullWidthScreen]}>
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
            ListEmptyComponent={
              <View>
                <StyledText style={styles.messageBlock}>{t('general.noData')}</StyledText>
              </View>
            }
          />
        </View>
      </ThemeScrollView>
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
