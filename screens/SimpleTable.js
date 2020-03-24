import React from 'react'
import { View, ScrollView, TouchableOpacity, Text } from 'react-native'
import { Table, TableWrapper, Row, Rows, Col, Cell } from 'react-native-table-component'
import moment from 'moment'
import styles from '../styles'

export default SimpleTable = (props) => {
	
	var headerArr = [props.reportData.labels]
	var dataArr = [props.reportData.data]

  return (
    <View style={styles.tblContainer}>
      <ScrollView horizontal={true}>
        <Table borderStyle={{borderColor: 'transparent'}}>          
          	{
          		headerArr.map((rowData, index) => (
              	<TableWrapper key={index} style={[styles.tblrow]}>
              		<Col data={["Date"]} style={styles.tbltitle} heightArr={[40,40]} widthArr={[50,50]} textStyle={[styles.tbltext, styles.whiteColor]} style={styles.orange_bg}/>
                	{
                  	rowData.map((cellData, cellIndex) => (
                    	<Cell key={cellIndex} data={moment(cellData, 'YYYY-MM-DD').format('MM-DD')} textStyle={styles.tbltextHeader} style={styles.tblhead}/>
                  	))
                	}
              	</TableWrapper>
            	))
          	}
						{ 
            	dataArr.map((rowData, index) => (
              	<TableWrapper key={index} style={[styles.tblrow]}>
              	<Col data={["Total"]} style={styles.tbltitle} heightArr={[40,40]} widthArr={[50,50]} textStyle={styles.tbltext}/>
                	{
                  	rowData.map((cellData, cellIndex) => (
                    	<Cell key={cellIndex} data={(cellData % 1 != 0) ? '$' + cellData.toFixed(2) : '$'+ cellData} textStyle={styles.tbltext} style={{height: 40, width: 62}}/>
                  	))
                	}
              	</TableWrapper>
            	))
          	}
        	</Table>
        </ScrollView>
      </View>    
  )
}