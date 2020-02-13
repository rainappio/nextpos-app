import React from "react";
import {LineChart} from "react-native-chart-kit";
import {Dimensions, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";


class Chart extends React.Component {

  constructor(props, context) {
    super(props, context)

    this.state = {
      dotContent: {}
    }
  }

  resetDotContentDisplay() {
    const dotContent = this.state.dotContent
    const dotContentKeys = Object.keys(dotContent)
    dotContentKeys && dotContentKeys.map(key => {
      dotContent[key].visible = false
    })

    this.setState({dotContent: dotContent})
  }

  render() {
    const {width = Dimensions.get('window').width, height = 300, props} = this.props
    const {legend, labels, data, data2} = this.props.data

    const processedData = {
      legend: legend,
      labels: labels,
      datasets: []
    }

    if (data !== undefined) {
      processedData.datasets.push({
        data: data,
        color: (opacity = 1) => `rgba(255, 167, 38, ${opacity})`, // optional
        strokeWidth: 2
      })
    }

    if (data2 !== undefined) {
      processedData.datasets.push({
        data: data2,
        color: (opacity = 1) => `rgba(255, 38, 38, ${opacity})`, // optional
        strokeWidth: 2
      })
    }

    const chartConfig = {
      backgroundColor: "#ffa726",
      backgroundGradientFrom: "#fff",
      backgroundGradientTo: "#fff",
      decimalPlaces: 1, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(82, 81, 81, ${opacity})`,
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
    }

    return (
      <ScrollView horizontal={true}>
        <TouchableOpacity activeOpacity={1} onPress={() => this.resetDotContentDisplay()}>
          <LineChart
            data={processedData}
            width={width} // from react-native
            height={height}
            fromZero={true}
            onDataPointClick={(dataPoint) => {
              const key = dataPoint.x + dataPoint.y;
              const dotContent = this.state.dotContent
              dotContent[key] = {visible: true, value: dataPoint.value}

              this.setState({dotContent: dotContent})
            }}

            renderDotContent={(dataPoint) => {
              const key = dataPoint.x + dataPoint.y;

              return (
                <View key={Math.random()}>
                  {this.state.dotContent[key] !== undefined && this.state.dotContent[key].visible && (
                    <View style={{
                      position: 'absolute',
                      top: dataPoint.y,
                      left: dataPoint.x,
                      backgroundColor: '#fff',
                      borderColor: '#ccc',
                      borderRadius: 4,
                      borderWidth: 1,
                      padding: 3
                    }}>
                      <Text style={{color: 'gray'}}>${this.state.dotContent[key].value}</Text>
                    </View>
                  )}
                </View>
              )
            }}
            chartConfig={chartConfig}
            bezier
            style={{
              borderRadius: 0
            }}
            {...props}
          />
        </TouchableOpacity>
      </ScrollView>

    )
  }
}

export default Chart
