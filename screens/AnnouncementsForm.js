import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {Text, TouchableOpacity, View, Platform} from 'react-native'
import DeleteBtn from '../components/DeleteBtn'
import InputText from '../components/InputText'
import RenderPureCheckBox from '../components/rn-elements/PureCheckBox'
import {isRequired} from '../validators'
import styles from '../styles'
import {LocaleContext} from "../locales/LocaleContext";
import {withContext} from "../helpers/contextHelper";
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import IonIcon from 'react-native-vector-icons/Ionicons'
import IconDropDown from '../components/IconDropDown'

class AnnouncementsForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext
  constructor(props, context) {
    super(props, context)
    this.state = {
      titleIcon: props?.initialValues?.titleIcon ?? 'ios-attach'
    }
  }

  componentDidMount() {
    this.context.localize({
      en: {
        newAnnouncementTitle: 'New Announcement',
        editAnnouncementTitle: 'Edit Announcement',
        announcementTitle: 'Title',
        markdownContent: 'Markdown Content'
      },
      zh: {
        newAnnouncementTitle: '新公告',
        editAnnouncementTitle: '編輯公告',
        announcementTitle: '標題',
        markdownContent: 'Markdown內容'
      }
    })
  }

  render() {
    const {
      handleSubmit,
      isEdit,
      handleEditCancel,
      handleDelete,
      initialValues,
      themeStyle
    } = this.props

    const {t, customMainThemeColor} = this.context

    const iconsArr = [
      {label: 'ios-attach', value: 'ios-attach'},
      {label: 'ios-newspaper', value: 'ios-newspaper'},
      {label: 'ios-notifications', value: 'ios-notifications'},
      {label: 'chatbox-ellipses-sharp', value: 'chatbox-ellipses-sharp'},
      {label: 'md-today', value: 'md-today'}
    ]

    return (
      <View style={{flex: 1}}>
        <View style={{
          flexDirection: 'row', ...(Platform.OS !== 'android' && {
            zIndex: 10
          })
        }}>
          <View style={{width: 50, height: 50, marginRight: 8}}>
            <Field
              component={IconDropDown}
              name="titleIcon"
              isEdit={isEdit}
            />
          </View>
          <View style={{flex: 1, height: '100%'}}>
            <Field
              component={InputText}
              name="title"
              placeholder={t('announcementTitle')}
              validate={isRequired}
              alignLeft={true}
              extraStyle={{height: '100%'}}
            />
          </View>
        </View>

        <View style={[styles.textAreaContainer, themeStyle, styles?.withBorder(this.context), {height: 250}]}>
          <Field
            component={InputText}
            name="markdownContent"
            placeholder={t('markdownContent')}
            validate={isRequired}
            multiline={true}
            height={240}
            alignLeft={true}
            extraStyle={styles.withoutBorder}
          />
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
              {t('action.save')}
            </Text>
          </TouchableOpacity>

          {isEdit ? (
            <TouchableOpacity onPress={handleEditCancel}>
              <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                {t('action.cancel')}
              </Text>
            </TouchableOpacity>
          ) : (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Announcements')}
              >
                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                  {t('action.cancel')}
                </Text>
              </TouchableOpacity>
            )}

          {initialValues !== undefined && initialValues.id != null && (
            <DeleteBtn
              handleDeleteAction={handleDelete}
              params={{id: initialValues.id}}
            />
          )}
        </View>
      </View>
    )
  }
}

AnnouncementsForm = reduxForm({
  form: 'announce_add_form'
})(AnnouncementsForm)

export default withContext(AnnouncementsForm)
