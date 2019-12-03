import React from 'react'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { readableDateFormat, clearOrder } from '../actions'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles'

class OrdersSummaryRow extends React.Component {
  constructor(props) {
    super(props)

    console.debug(`order id: ${this.props.order.orderId}`)
  }

  handleCancel = () => {
    this.props.clearOrder()
    this.props.navigation.navigate('Tables')
  }

  render() {
    const {
      products = [],
      labels = [],
      navigation,
      haveData,
      haveError,
      isLoading,
      label,
      order,
      handleDelete,
      initialValues
    } = this.props

    return (
      <ScrollView>
        <View
          style={{
            marginTop: 62,
            marginLeft: 35,
            marginRight: 35,
            marginBottom: 30
          }}
        >
          <BackBtn />
          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textMedium,
              styles.textBold
            ]}
          >
            Order Summary
          </Text>

          <View style={[styles.flex_dir_row]}>
            <View style={[styles.quarter_width]}>
              <TouchableOpacity
              //onPress={() => this.props.navigation.navigate('Orders')}
              >
                <View>
                  <Text
                    style={[
                      styles.paddingTopBtn8,
                      styles.textBig,
                      styles.orange_color
                    ]}
                  >
                    {this.props.navigation.state.params.tableName ===
                      undefined ||
                    this.props.navigation.state.params.tableName == 0
                      ? order.tableInfo.tableName
                      : this.props.navigation.state.params.tableName}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
              <TouchableOpacity
              //onPress={() => this.props.navigation.navigate('Orders')}
              >
                <View>
                  <FontAwesomeIcon
                    name="user"
                    size={25}
                    color="#f18d1a"
                    style={[styles.centerText]}
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
              </TouchableOpacity>
            </View>

            <View style={[styles.fullhalf_width, styles.mgr_20]}>
              <TouchableOpacity>
                <View>
                  <Text style={[styles.toRight, styles.mgr_20]}>
                    Staff - {order.servedBy}
                  </Text>
                  <Text style={[styles.toRight, styles.mgr_20]}>
                    {readableDateFormat(order.createdDate)}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.orange_bg,
            styles.flex_dir_row,
            styles.shoppingBar,
            styles.paddLeft20,
            styles.paddRight20,
            styles.top40
          ]}
        >
          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text style={[styles.paddingTopBtn8, styles.whiteColor]}>
                Product
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text style={[styles.whiteColor]}>&nbsp;&nbsp;QTY</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text style={styles.whiteColor}>U/P</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text style={styles.whiteColor}>Subtotal</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.container]}>
          <Text style={styles.textBold}>{order.orderId}</Text>
          {
            // this.props.navigation.state.params.orderState === 'OPEN' &&
            <AddBtn
              onPress={() =>
                this.props.navigation.navigate('OrderFormII', {
                  tableId: this.props.navigation.state.params.tableId,
                  orderId: order.orderId,
                  onSubmit: this.props.navigation.state.params.onSubmit,
                  handleDelete: this.props.navigation.state.params.handleDelete
                })
              }
            />
          }

          {order.lineItems.map(lineItem => (
            <View key={lineItem.lineItemId}>
              <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
                <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
                  <TouchableOpacity
                  //onPress={() => this.props.navigation.navigate('Orders')}
                  >
                    <Text style={{ textAlign: 'left', marginLeft: -28 }}>
                      {lineItem.productName}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
                  <TouchableOpacity
                  //onPress={() => this.props.navigation.navigate('Orders')}
                  >
                    <Text>&nbsp;&nbsp;{lineItem.quantity}</Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('OrdersSummary')
                    }
                  >
                    <Text>${lineItem.price}</Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('OrdersSummary')
                    }
                  >
                    <Text style={{ marginRight: -24 }}>
                      {lineItem.subTotal.amountWithoutTax} TX
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[styles.mgrbtn20]}>
                <Text style={{ textAlign: 'left', marginLeft: 4 }}>
                  {lineItem.options}
                </Text>
              </View>
            </View>
          ))}

          <View
            style={[
              styles.flex_dir_row,
              styles.mgrtotop20,
              styles.grayBg,
              styles.paddingTopBtn8
            ]}
          >
            <View style={[styles.half_width]}>
              <Text>Total</Text>
            </View>

            <View style={[styles.half_width]}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('OrdersSummary')}
              >
                <Text style={{ textAlign: 'right', marginRight: -26 }}>
                  {order.orderTotal} TX
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {order.state === 'OPEN' ? (
            <View
              style={{
                width: '100%',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86',
                backgroundColor: '#F39F86',
                marginRight: '2%',
                marginTop: 22
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.state.params.onSubmit(order.orderId)
                }
                //onPress={this.props.handleSubmit}
              >
                <Text style={[styles.signInText, styles.whiteColor]}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          ) : order.state === 'IN_PROCESS' ? (
            <View
              style={{
                width: '100%',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86',
                backgroundColor: '#F39F86',
                marginRight: '2%',
                marginTop: 22
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.state.params.onSubmit(order.orderId)
                }
                //onPress={this.props.handleSubmit}
              >
                <Text style={[styles.signInText, styles.whiteColor]}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          ) : order.state === 'DELIVERED' ? (
            <View
              style={{
                width: '100%',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86',
                backgroundColor: '#F39F86',
                marginRight: '2%',
                marginTop: 22
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.state.params.onSubmit(order.orderId)
                }
                //onPress={this.props.handleSubmit}
              >
                <Text style={[styles.signInText, styles.whiteColor]}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View
            style={{
              width: '100%',
              borderRadius: 4,
              borderWidth: 1,
              borderColor: '#F39F86',
              marginTop: 8
            }}
          >
            <TouchableOpacity onPress={() => this.handleCancel()}>
              <Text style={styles.signInText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: '100%',
              borderRadius: 4,
              borderWidth: 1,
              borderColor: '#F39F86',
              marginTop: 8
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.state.params.handleDelete(order.orderId)
              }}
            >
              <Text style={styles.signInText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  clearOrder: () => dispatch(clearOrder(props.order.orderId))
})

export default connect(
  null,
  mapDispatchToProps
)(OrdersSummaryRow)
