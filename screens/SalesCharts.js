import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Dimensions,
  FlatList,
  ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { LineChart } from 'react-native-chart-kit'
import { getRangedSalesReport } from '../actions'
import styles from '../styles'

class SalesCharts extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    dataArr: []
  }

  componentDidMount() {
    this.props.getRangedSalesReport()
  }

  render() {
    const { getrangedSalesReport, isLoading, haveData } = this.props
    let data = {}
    data.labels = []
    data.datasets = []
    let innerObj = {}
    innerObj.data = []

    if (haveData) {
      for (var i = 0; i < getrangedSalesReport.salesByRange.length; i++) {
        data.labels.push(getrangedSalesReport.salesByRange[i].formattedDate)
        innerObj.data.push(getrangedSalesReport.salesByRange[i].total)
      }
    }
    data.datasets.push(innerObj)

    const screenWidth = Dimensions.get('window').width
    const chartConfig = {
      backgroundColor: '#e26a00',
      backgroundGradientFrom: '#fb8c00',
      backgroundGradientTo: '#ffa726',
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: '#ffa726'
      }
    }

    Item = ({ salesByPrdData }) => {
      return (
        <View
          style={[styles.flex_dir_row, styles.paddingTopBtn8]}
          key={salesByPrdData.id}
        >
          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <Text style={[styles.paddingTopBtn8]}>
              {salesByPrdData.productName}
            </Text>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <Text>&nbsp;&nbsp;{salesByPrdData.productSales}</Text>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <Text>{salesByPrdData.percentage}&nbsp;%</Text>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <Text>{salesByPrdData.salesQuantity}</Text>
          </View>
        </View>
      )
    }

    if (isLoading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
      )
    }
    return (
      <ScrollView>
        <View style={[styles.container, styles.nomgrBottom]}>
          <BackBtn />
          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textMedium,
              styles.textBold
            ]}
          >
            Sales Charts
          </Text>

          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textMedium,
              styles.textBold
            ]}
          >
            Today Total Sales - {getrangedSalesReport.todayTotal}
          </Text>
        </View>
        {data.labels.length !== 0 && (
          <LineChart
            data={data}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
          />
        )}

        <View
          style={[
            styles.orange_bg,
            styles.flex_dir_row,
            styles.paddLeft20,
            styles.mgrtotop20,
            styles.paddingTopBtn8
          ]}
        >
          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text style={[styles.paddingTopBtn8]}>Product Name</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text style={{ marginLeft: -20 }}>&nbsp;&nbsp;Amount</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text>Percentage</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text>Quantity</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={getrangedSalesReport.salesByProducts}
          renderItem={({ item }) => {
            return <Item salesByPrdData={item} />
          }}
          keyExtractor={item => item.id}
        />
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  chkS: state,
  getrangedSalesReport: state.getrangedsalesreport.data,
  haveData: state.getrangedsalesreport.haveData,
  haveError: state.getrangedsalesreport.haveError,
  isLoading: state.getrangedsalesreport.loading
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getRangedSalesReport: () => dispatch(getRangedSalesReport())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SalesCharts)
