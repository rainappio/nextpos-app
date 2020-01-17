import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {
  Image,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
  FlatList, ScrollView
} from 'react-native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import {isEmail, isRequired} from '../validators'
import InputText from '../components/InputText'
import InputNumber from '../components/InputNumber'
import {DismissKeyboard} from '../components/DismissKeyboard'
import AddBtn from '../components/AddBtn'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'

class TableLayoutForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        addTableLayoutTitle: 'Add Table Layout',
        editTableLayoutTitle: 'Edit Table Layout',
        layoutName: 'Layout Name',
        totalCapacity: 'Total Floor Capacity',
        tables: 'Tables'
      },
      zh: {
        addTableLayoutTitle: '新增樓面',
        editTableLayoutTitle: '編輯樓面',
        layoutName: '樓面名稱',
        totalCapacity: '桌位總數',
        tables: '桌位'
      }
    })

    this.state = {
      t: context.t
    }
  }

  render() {
    const {
      handleSubmit,
      isEdit,
      initialValues,
      tables = [],
      handleEditCancel
    } = this.props
    const {t} = this.state

    Item = ({table, layoutId}) => {
      return (
        <View
          style={{
            width: '100%',
            paddingTop: 15,
            paddingBottom: 15
          }}
        >
          <Text>{table.tableName}</Text>
          <AntDesignIcon
            name="ellipsis1"
            size={25}
            color="black"
            style={{position: 'absolute', right: 0, top: 15}}
            onPress={() => {
              this.props.navigation.navigate('TableEdit', {
                tableId: table.tableId,
                layoutId: layoutId
              })
            }}
          />
        </View>
      )
    }

    return (
      <ScrollView contentContainerStyle={[styles.contentContainer]}>
        <View>
          <View style={styles.fieldContainer}>
            <View style={{flex: 1}}>
              <Text style={styles.fieldTitle}>{t('layoutName')}</Text>
            </View>
            <View style={{flex: 3}}>
              <Field
                name="layoutName"
                component={InputText}
                validate={isRequired}
                placeholder={t('layoutName')}
                autoCapitalize="none"
              />
            </View>
          </View>

          {isEdit ? (
            <View>
              <View style={styles.fieldContainer}>
                <View style={{flex: 1}}>
                  <Text style={styles.fieldTitle}>{t('totalCapacity')}</Text>
                </View>
                <View style={{flex: 3}}>
                  <Text
                    style={{
                      borderWidth: 1,
                      borderColor: '#ddd',
                      width: 125,
                      fontSize: 19,
                      color: '#888',
                      paddingTop: 10,
                      paddingBottom: 10,
                      paddingLeft: 25
                    }}
                  >
                    {isEdit && initialValues.totalCapacity}
                  </Text>
                </View>
              </View>

              <View style={styles.mgrtotop12}>
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldTitle}>
                    {t('tables')}
                  </Text>
                  <AddBtn
                    onPress={() =>
                      this.props.navigation.navigate('TableAdd', {
                        layoutId: initialValues.id
                      })
                    }
                  />
                </View>
                <FlatList
                  data={initialValues.tables}
                  renderItem={({item}) => (
                    <Item table={item} layoutId={initialValues.id}/>
                  )}
                  keyExtractor={item => item.tableId}
                />
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.bottom}>
          {isEdit ? (
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('action.update')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('action.save')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('TableLayouts')}
          >
            <Text style={[styles.bottomActionButton, styles.cancelButton]}>{t('action.cancel')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}

TableLayoutForm = reduxForm({
  form: 'tableLayoutForm'
})(TableLayoutForm)

export default TableLayoutForm
