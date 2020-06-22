import React from 'react'
import {ScrollView, View} from 'react-native'
import {Cell, Col, Table, TableWrapper} from 'react-native-table-component'
import styles from '../styles'

const RenderTable = (props) => {

  const tableHeaders = props.reportData.labels
  const tableData = props.reportData.data
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
        <Table borderStyle={{borderColor: 'transparent'}}>
          {
            <TableWrapper style={[styles.tblrow]}>
              <Col data={["Date"]} heightArr={[40, 40]} widthArr={[80, 80]} textStyle={[styles.tbltext, styles.whiteColor]}
                   style={styles.orange_bg}/>
              {
                tableHeaders.map((cellData, cellIndex) => (
                  <Cell key={cellIndex}
                        data={cellData}
                        textStyle={styles.tbltextHeader}
                        style={styles.tblhead}/>
                ))
              }
            </TableWrapper>
          }
          {
            <TableWrapper style={[styles.tblrow]}>
              <Col data={["Total"]} heightArr={[40, 40]} widthArr={[80, 80]} textStyle={styles.tbltext}/>
              {
                tableData.map((cellData, cellIndex) => (
                  <Cell key={cellIndex}
                        data={cellData}
                        textStyle={styles.tbltext} style={{height: 40, width: 62}}/>
                ))
              }
            </TableWrapper>
          }

          {tableDataLastYear && (
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
          )}
        </Table>
      </ScrollView>
    </View>
  )
}

export default RenderTable
