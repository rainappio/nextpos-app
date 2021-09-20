import React from 'react'
import {FlatList, TouchableOpacity, View, Animated} from 'react-native'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";

class LabelSelector extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext;

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        selectProductTitle: 'Select product',
        alreadySelected: 'Selected'
      },
      zh: {
        selectProductTitle: '選擇產品',
        alreadySelected: '已選'
      }
    })

    this.state = {
      selectedToggleItems: new Map(),
      labels: [],
    }
  }

  onSelect = (id, item) => {
    const newSelected = new Map(this.state.selectedToggleItems);
    newSelected.set(id, !this.state.selectedToggleItems.get(id));
    if (!this.state.selectedToggleItems.get(id)) {
      this.addLabel(item)
    } else {
      this.removeLabel(item)
    }
    this.setState({
      selectedToggleItems: newSelected
    })

  }


  addLabel = (item) => {
    this.setState({
      labels: [item, ...this.state.labels]
    }, () => {
      this.props.handleOnSelect(this.state.labels)
    })
  }
  removeLabel = (item) => {
    let arr = this.state.labels
    arr.splice(arr.map((item) => item.id).indexOf(item.id), 1)
    this.setState({
      labels: arr
    }, () => {
      this.props.handleOnSelect(this.state.labels)
    })
  }


  renderItem = ({item, index, drag, isActive}) => {

    return (
      <View>
        <TouchableOpacity
          style={[styles.dynamicVerticalPadding(4), {
            backgroundColor: this.state.selectedToggleItems.get(item.id) ? '#ccc' : this.context.customBackgroundColor,
          }]}
          onPress={() => this.onSelect(item.id, item)}
        >
          <View style={[styles.productPanel]}>
            <View style={[styles.flex(1)]}>
              <StyledText style={[styles.listPanelText]}>{item.label}</StyledText>
            </View>
            <View style={[styles.flex(1), styles.alignRight]}>
              {this.state.selectedToggleItems.get(item.id) &&
                <AntDesignIcon name={'check'} size={22} color={this.context?.customMainThemeColor} />
              }
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {
      labels,
      themeStyle
    } = this.props
    const {t} = this.context


    return (
      <ThemeContainer>
        <ScreenHeader backNavigation={false}
          parentFullScreen={true}
          title={t('selectProductTitle')}
        />
        <FlatList
          data={labels}
          renderItem={(item, index, drag, isActive) => this.renderItem(item)}
          keyExtractor={(item, index) => `item-${item.label}`}
          ListHeaderComponent={
            <View style={[themeStyle, {borderTopWidth: 0.4}]} />
          }
        />
      </ThemeContainer>
    )
  }
}

const enhance = compose(
  withContext
)
export default enhance(LabelSelector)
