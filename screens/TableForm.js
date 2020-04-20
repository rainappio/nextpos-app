import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { isRequired } from '../validators'
import InputText from '../components/InputText'
import InputNumber from '../components/InputNumber'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import DeleteBtn from "../components/DeleteBtn";

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
  }

  render() {
    const { navigation, handleSubmit, handleDeleteTable, isEdit, initialValues, tableLayout } = this.props

    const { t } = this.context

    return (
      <View style={styles.contentContainer}>
        <View style={[styles.fieldContainer]}>
          <View style={[{ flex: 1 }]}>
            <Text style={styles.fieldTitle}>{t('tableName')}</Text>
          </View>
          <View style={[{ flex: 3 }]}>
            <Field
              name="tableName"
              component={InputText}
              validate={isRequired}
              placeholder={t('tableName')}
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={[styles.fieldContainer]}>
          <View style={[{ flex: 1 }]}>
            <Text style={styles.fieldTitle}>{t('tableCapacity')}</Text>
          </View>
          <View style={[{ flex: 3 }]}>
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

        <View style={[styles.bottom]}>
          {isEdit ? (
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {t('action.update')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={[styles.bottomActionButton, styles.actionButton]}>
                {t('action.save')}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.bottomActionButton, styles.cancelButton]}>
              {t('action.cancel')}
            </Text>
          </TouchableOpacity>
          {isEdit && (
            <DeleteBtn
              handleDeleteAction={() => handleDeleteTable(tableLayout.id, initialValues.tableId)}
            />
          )}
        </View>
      </View>
    )
  }
}

TableForm = reduxForm({
  form: 'tableForm'
})(TableForm)

export default TableForm
