import React, {Component} from "react"
import {LocaleContext} from "../locales/LocaleContext";
import styles from "../styles";
import {Text, View} from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import {formatDate} from "../actions";
import { withNavigation } from 'react-navigation'

class OrderTopInfo extends Component {
  static contextType = LocaleContext

  render() {
    const {order} = this.props
    const { t } = this.context

    return (
      <View>
        <View style={[styles.tableRowContainer]}>
          <View style={[styles.tableCellView, {width: '35%'}]}>
            <View>
              <Text
                style={[
                  styles.paddingTopBtn8,
                  styles.textBig,
                  styles.orange_color
                ]}
              >
                {order.orderType === 'IN_STORE' ? order.tableDisplayName : t('order.takeOut')}
              </Text>
            </View>
          </View>

          <View style={[styles.tableCellView, {width: '15%'}]}>
            <View>
              <FontAwesomeIcon
                name="user"
                size={25}
                style={[styles.buttonIconStyle]}
              >
                <Text style={[styles.textBig, styles.orange_color]}>
                  &nbsp;
                  {!this.props.navigation.state.params.customerCount
                    ? order.demographicData.male +
                    order.demographicData.female +
                    order.demographicData.kid
                    : this.props.navigation.state.params.customerCount}
                </Text>
              </FontAwesomeIcon>
            </View>
          </View>

          <View style={[styles.tableCellView, { justifyContent: 'flex-end', width: '50%'}]}>
            <View>
              <Text style={{textAlign: 'right'}}>
                {t('order.staff')} - {order.servedBy}
              </Text>
              <Text>
                {formatDate(order.createdDate)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.tableRowContainer}>
          <Text>Order ID: </Text>
          <Text style={styles.tableCellText}>{order.serialId}</Text>
        </View>

        <View style={styles.tableRowContainer}>
          <Text>{t('order.orderStatusLong')}: </Text>
          <Text style={styles.tableCellText}>{t(`orderState.${order.state}`)}</Text>
        </View>

      </View>

    )
  }
}

export default withNavigation(OrderTopInfo)
