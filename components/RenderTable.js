import React from 'react'
import {ScrollView, View, Text} from 'react-native'
import {Col, Table, TableWrapper} from 'react-native-table-component'
import styles from '../styles'
import {formatCurrency} from "../actions";
import {withContext} from "../helpers/contextHelper";
import {StyledText} from "../components/StyledText";

const RenderTable = (props) => {
  const tableHeaders = props.reportData.labels
  const tableData = props.reportData.data
  const orderCount = props.reportData.orderCount
  const isCurrency = props.isCurrency != null ? props.isCurrency : false
  const t = props?.locale?.t
  const customMainThemeColor = props?.locale?.customMainThemeColor

  const zippedData = tableHeaders.map((data, idx) => {
    return [data, isCurrency ? formatCurrency(tableData[idx]) : tableData[idx], orderCount?.[idx]]
  })

  let tableDataLastYear = []

  if (props.reportData.hasOwnProperty('data2')) {
    tableDataLastYear = props.reportData.data2

    if (tableData[0]?.length > tableDataLastYear[0]?.length) {
      tableDataLastYear[0][tableData[0].length - 1] = 0
    }
  }

  if (props?.type === 'card') {
    return (
      <View style={{height: 300, flexWrap: 'wrap', flex: 1, borderColor: customMainThemeColor, borderWidth: 1}}>
        <View style={[styles.sectionBar, {borderColor: customMainThemeColor}]}>
          <View style={[styles.tableCellView, {flex: 1}]}>
            <Text style={[styles?.sectionBarTextSmall(customMainThemeColor)]}>{t('order.date')}</Text>
          </View>

          <View style={[styles.tableCellView, {justifyContent: 'flex-end', flex: 1}]}>
            <Text style={styles?.sectionBarTextSmall(customMainThemeColor)}>{t('shift.totalInvoices')}</Text>
          </View>

          <View style={[styles.tableCellView, {justifyContent: 'flex-end', flex: 2}]}>
            <Text style={styles?.sectionBarTextSmall(customMainThemeColor)}>{t('amount')}</Text>
          </View>
        </View>
        <ScrollView style={{flex: 1}} nestedScrollEnabled>
          {zippedData?.map((item, index) => {
            return (
              <View key={index} style={{flexDirection: 'row', padding: 8, }}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <StyledText>{item?.[0]}</StyledText>
                </View>

                <View style={[styles.tableCellView, {justifyContent: 'flex-end', flex: 1}]}>
                  <StyledText style={{flexWrap: 'wrap'}}>{item?.[2]}</StyledText>
                </View>

                <View style={[styles.tableCellView, {justifyContent: 'flex-end', flex: 2}]}>
                  <StyledText style={{flexWrap: 'wrap'}}>{item?.[1]}</StyledText>
                </View>
              </View>
            )
          })}
        </ScrollView>
      </View>
    )
  }

  return (
    <View style={styles.tblContainer}>
      <ScrollView horizontal={true} nestedScrollEnabled>
        <Table style={{flexDirection: 'row'}}
          borderStyle={{borderWidth: 1, borderColor: '#f75336'}}>
          {zippedData && (
            <TableWrapper style={[styles.tblrow, {borderWidth: 0, borderColor: '#f75336'}]}>
              {
                zippedData.map((columnData, columnIndex) => {
                  return (
                    <Col
                      key={columnIndex}
                      data={[columnData?.[0], columnData?.[1]]}
                      flex={1}
                      textStyle={[styles.tbltext, props.themeStyle]}
                    />
                  )
                })
              }
            </TableWrapper>
          )}
          {/*{tableDataLastYear && (
            <TableWrapper style={[styles.tblrow]}>
              <Col data={["Last Year"]} heightArr={[40, 40]} widthArr={[80, 80]} textStyle={styles.tbltext}/>
              {
                tableDataLastYear.map((cellData, cellIndex) => (
                  <Cell key={cellIndex}
                        data={cellData}
                        textStyle={styles.tbltext} style={{height: 40, width: 62}}/>
                ))
              }
            </TableWrapper>
          )}*/}
        </Table>
      </ScrollView>
    </View>
  )
}

export default withContext(RenderTable)
