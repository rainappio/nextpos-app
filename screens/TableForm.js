import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
  FlatList
} from 'react-native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { isEmail, isRequired } from '../validators'
import InputText from '../components/InputText'
import InputNumber from '../components/InputNumber'
import { DismissKeyboard } from '../components/DismissKeyboard'
import AddBtn from '../components/AddBtn'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'

class TableForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        addTableTitle: 'Add Table',
        editTableTitle: 'Edit Table',
        tableName: 'Table Name',
        tableCapacity: 'Table Capacity'
      },
      zh: {
        addTableTitle: '新增桌位',
        editTableTitle: '編輯桌位',
        tableName: '桌位名稱',
        tableCapacity: '桌位人數'
      }
    })

    this.state = {
      t: context.t
    }
  }

  render() {
    const {
      navigation,
      handleSubmit,
      isEdit,
      initialValues,
      tables = [],
      handleEditCancel
    } = this.props

    const { t } = this.state

    return (
      <DismissKeyboard>
        <KeyboardAvoidingView>
          <View
            style={[
              styles.jc_alignIem_center,
              styles.flex_dir_row,
              styles.mgrbtn20
            ]}
          >
            <View style={[styles.onethirdWidth, styles.mgrtotop8]}>
              <Text>{t('tableName')}</Text>
            </View>
            <View style={[styles.onesixthWidth]}>
              <Field
                name="tableName"
                component={InputText}
                validate={isRequired}
                placeholder={t('tableName')}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
            <View style={[styles.onethirdWidth]}>
              <Text>{t('tableCapacity')}</Text>
            </View>
            <View style={[styles.onesixthWidth]}>
              <Field
                name="capacity"
                component={InputNumber}
                type="up-down"
                placeholder={t('tableCapacity')}
                minValue={1}
                customVal={isEdit && initialValues.capacity}
              />
            </View>
          </View>

          <View
            style={[
              {
                width: '100%',
                backgroundColor: '#F39F86',
                marginTop: 40,
                borderRadius: 4
              }
            ]}
          >
            {isEdit ? (
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={styles.gsText}>{t('action.update')}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={styles.gsText}>{t('action.save')}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View
            style={[
              {
                width: '100%',
                marginTop: 8,
                borderRadius: 4,
                backgroundColor: '#F39F86'
              }
            ]}
          >
            {isEdit ? (
              <TouchableOpacity onPress={() => handleEditCancel()}>
                <Text style={styles.gsText}>{t('action.cancel')}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate('TableLayoutEdit')}
              >
                <Text style={styles.gsText}>{t('action.cancel')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </DismissKeyboard>
    )
  }
}

TableForm = reduxForm({
  form: 'tableForm'
})(TableForm)

export default TableForm
