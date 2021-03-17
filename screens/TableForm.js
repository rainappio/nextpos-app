import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {Text, TouchableOpacity, View} from 'react-native'
import {isRequired} from '../validators'
import InputText from '../components/InputText'
import InputNumber from '../components/InputNumber'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import DeleteBtn from "../components/DeleteBtn";
import {StyledText} from "../components/StyledText";

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
    const {navigation, handleSubmit, handleDeleteTable, isEdit, initialValues, tableLayout} = this.props
    const {t, customMainThemeColor} = this.context

    return (
      <View style={styles.contentContainer}>
        <View style={[styles.tableRowContainerWithBorder]}>
          <View style={[styles.tableCellView, styles.flex(1)]}>
            <StyledText style={styles.fieldTitle}>{t('tableName')}</StyledText>
          </View>
          <View style={[styles.tableCellView, styles.justifyRight]}>
            <Field
              name="tableName"
              component={InputText}
              validate={isRequired}
              placeholder={t('tableName')}
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={[styles.tableRowContainerWithBorder]}>
          <View style={[styles.tableCellView, styles.flex(1)]}>
            <StyledText style={styles.fieldTitle}>{t('tableCapacity')}</StyledText>
          </View>
          <View style={[styles.tableCellView, styles.justifyRight]}>
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

        <View style={[styles.bottom, styles.horizontalMargin]}>
          {isEdit ? (
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                {t('action.update')}
              </Text>
            </TouchableOpacity>
          ) : (
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                  {t('action.save')}
                </Text>
              </TouchableOpacity>
            )}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
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
