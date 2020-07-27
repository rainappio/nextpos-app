import React from 'react'
import {ScrollView, View} from 'react-native'
import {Col, Table, TableWrapper} from 'react-native-table-component'
import styles from '../styles'
import {formatCurrency} from "../actions";
import {withContext} from "../helpers/contextHelper";

const RenderTable = (props) => {

  const tableHeaders = props.reportData.labels
  const tableData = props.reportData.data
  const isCurrency = props.isCurrency != null ? props.isCurrency : false

  const zippedData = tableHeaders.map((data, idx) => {
    return [data, isCurrency ? formatCurrency(tableData[idx]) : tableData[idx]]
  })

  let tableDataLastYear = []

  if (props.reportData.hasOwnProperty('data2')) {
    tableDataLastYear = props.reportData.data2

    if (tableData[0].length > tableDataLastYear[0].length) {
      tableDataLastYear[0][tableData[0].length - 1] = 0
    }
  }

  return (
    <View style={styles.tblContainer}>
      <ScrollView horizontal={true}>
        <Table style={{flexDirection: 'row'}}
               borderStyle={{borderWidth: 1, borderColor: '#f75336'}}>
          {zippedData && (
            <TableWrapper style={[styles.tblrow, {borderWidth: 0, borderColor: '#f75336'}]}>
              {
                zippedData.map((columnData, columnIndex) => {
                  return (
                    <Col
                      key={columnIndex}
                      data={columnData}
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
