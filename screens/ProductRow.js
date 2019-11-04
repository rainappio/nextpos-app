import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  AsyncStorage
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import {
  Accordion,
  List,
  SwipeListView,
  SwipeRow,
  SwipeAction
} from '@ant-design/react-native'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import DropDown from '../components/DropDown'
import PopUp from '../components/PopUp'
import { getProducts, clearLabel } from '../actions'
import styles from '../styles'

class ProductRow extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super(...arguments)
    this.state = {
      activeSections: [],
      selectedProducts: [],
      refreshing: false,
      status: '',
      labelId: null
    }
    this.onChange = activeSections => {
      this.setState({ activeSections })
    }
  }

  PanelHeader = (labelName, labelId) => {
    return (
      <View
        style={{
          width: '100%',
          marginRight: 8,
          paddingTop: 15,
          paddingBottom: 15
        }}
      >
        <Text style={{ fontSize: 16 }}>{labelName}</Text>
        <AntDesignIcon
          name="ellipsis1"
          size={25}
          color="black"
          style={{ position: 'absolute', right: 0, top: 15 }}
          onPress={() => {
            this.props.navigation.navigate('CategoryCustomize', {
              labelId: labelId
            })
          }}
        />
      </View>
    )
  }

  onOpenNP = id => {
    this.setState({
      labelId: id
    })
  }

  render() {
    const {
      products = [],
      labels = [],
      navigation,
      haveData,
      haveError,
      isLoading,
      label
    } = this.props
    const { selectedProducts } = this.state
    var map = new Map(Object.entries(products))

    const right = [
      {
        text: <Icon name="md-create" size={25} color="#fff" />,
        onPress: () =>
          this.props.navigation.navigate('ProductEdit', {
            productId: this.state.labelId
          }),
        style: { backgroundColor: '#f18d1a90' }
      }
    ]

    return (
      <ScrollView
        refreshControl={<RefreshControl refreshing={this.state.refreshing} />}
      >
        <DismissKeyboard>
          <View style={styles.container}>
            <BackBtn />
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textMedium,
                styles.textBold
              ]}
            >
              Product List
            </Text>
            <PopUp navigation={navigation} />

            <Accordion
              onChange={this.onChange}
              activeSections={this.state.activeSections}
              duration={300}
            >
              {labels.map(lbl => (
                <Accordion.Panel
                  header={this.PanelHeader(lbl.label, lbl.id)}
                  key={lbl.id}
                >
                  <List>
                    {map.get(lbl.label).map(prd => (
                      <SwipeAction
                        autoClose={true}
                        right={right}
                        onOpen={() => this.onOpenNP(prd.id)}
                        onClose={() => {}}
                        key={prd.id}
                      >
                        <List.Item
                          style={{
                            backgroundColor: '#f1f1f1'
                          }}
                        >
                          {prd.name}
                        </List.Item>
                      </SwipeAction>
                    ))}
                  </List>
                </Accordion.Panel>
              ))}
            </Accordion>
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getProducts: () => dispatch(getProducts()),
  clearLabel: () => dispatch(clearLabel())
})

ProductRow = reduxForm({
  form: 'productlist_searchform'
})(ProductRow)

export default connect(
  null,
  mapDispatchToProps
)(ProductRow)
