import React, {Component, PureComponent} from 'react'
import {Dimensions, StyleSheet, View} from 'react-native'
import {Circle, G, Line, Rect, Svg, Text} from 'react-native-svg'
import * as d3 from 'd3'
import {mainThemeColor} from "../styles";


export default class SvgBarChart extends Component {
  render() {

    const { data, legend, round } = this.props

    return (
      <View style={[styles.container]}>
        <BarChart data={data} horizontalMargin={20} legend={legend} round={round} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const GRAPH_MARGIN = 20
const GRAPH_BAR_WIDTH = 10
const colors = {
  axis: '#ccc',
  bars: mainThemeColor
}

class BarChart extends PureComponent {

  render() {
    const { horizontalMargin, legend } = this.props

    // Dimensions
    const svgHeight = 200
    const svgWidth = Dimensions.get('window').width - horizontalMargin
    const graphHeight = svgHeight - 2 * GRAPH_MARGIN
    const graphWidth = svgWidth - GRAPH_MARGIN
    const horizontalPadding = (svgWidth - graphWidth) / 2

    const data = this.props.data

    // X scale point
    const xDomain = data.map(item => item.label)
    const xRange = [0, graphWidth]
    const x = d3.scalePoint()
      .domain(xDomain)
      .range(xRange)
      .padding(1)

    // Y scale linear
    const maxValue = d3.max(data, d => d.value)

    const topValue = Math.ceil(maxValue / this.props.round) * this.props.round
    const yDomain = [0, topValue]
    const yRange = [0, graphHeight]
    const y = d3.scaleLinear()
      .domain(yDomain)
      .range(yRange)

    // top axis and middle axis
    const middleValue = topValue / 2

    return (
      <Svg width={svgWidth} height={svgHeight + 60} style={{borderWidth: 0, borderColor: mainThemeColor}}>
        <G x={horizontalPadding} y={graphHeight + GRAPH_MARGIN + 30}>
          {/* Top value label */}
          <G x={graphWidth} y={-(graphHeight + GRAPH_MARGIN) - 10}>
            <Circle cx={-80} cy={-5} r="6" fill={mainThemeColor}/>
            <Text
              //x={graphWidth}
              textAnchor="end"
              //y={y(topValue) * -1 - 30}
              fontSize={12}
              fill="black"
              fillOpacity={0.7}>
              {legend}
            </Text>
          </G>
          {/* top axis */}
          <Line
            x1="0"
            y1={y(topValue) * -1}
            x2={graphWidth}
            y2={y(topValue) * -1}
            stroke={colors.axis}
            strokeDasharray={[3, 3]}
            strokeWidth="1"
          />

          {/* middle axis */}
          <Line
            x1="0"
            y1={y(middleValue) * -1}
            x2={graphWidth}
            y2={y(middleValue) * -1}
            stroke={colors.axis}
            strokeDasharray={[3, 3]}
            strokeWidth="1"
          />

          {/* bottom axis */}
          <Line
            x1="0"
            y1="2"
            x2={graphWidth}
            y2="2"
            stroke={colors.axis}
            strokeWidth="0.5"
          />

          {/* bars */}
          {data.map(item => (
            <G key={`bar-${item.label}`}>
              <Text
                x={x(item.label) - (GRAPH_BAR_WIDTH / 2)}
                y={y(item.value) * -1 - 3}
                fontSize={8}
                fill='black'
              >
                {item.value}
              </Text>
              <Rect
                x={x(item.label) - (GRAPH_BAR_WIDTH / 2)}
                y={y(item.value) * -1}
                rx={2.5}
                width={GRAPH_BAR_WIDTH}
                height={y(item.value)}
                fill={colors.bars}
              />
            </G>
          ))}

          {/* labels */}
          {data.map(item => (
            <Text
              key={`label-${item.label}`}
              fontSize="10"
              x={x(item.label)}
              y="14"
              textAnchor="middle">{item.label % 4 === 0 ? item.label : ''}</Text>
          ))}

          <Text
            fontSize="12"
            x={graphWidth / 2}
            y="30"
            fill="black"
            textAnchor="middle">Hours</Text>
        </G>
      </Svg>
    )
  }
}
