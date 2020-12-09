import {Platform, StyleSheet} from 'react-native'

export const mainThemeColor = '#f18d1a'
let CIRCLE_RADIUS = 50;
//export const mainThemeColor = '#f18dee'
//export const mainThemeColor = '#3e3d47'

export default StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  fullWidthScreen: {
    flex: 1,
    marginTop: 53,
    marginBottom: 23
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 53,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 23
  },
  selectedLabel: {
    backgroundColor: mainThemeColor,
    borderRadius: 10,
    paddingLeft: 10,
    paddingVertical: 3,
  },
  childContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 5
  },
  orderItemSideBar: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 8,
    marginBottom: 5
  },
  orderItemBox: {
    flex: 3,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 5
  },
  orderItemRightList: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 5,
    marginRight: 5
  },
  rootInput: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: 'right'
  },
  rootError: {
    textAlign: 'right',
    marginVertical: 3,
    color: '#f75336',
    fontSize: 12,
    fontStyle: 'italic'
  },
  rootWarn: {
    color: 'yellow',
    fontSize: 12,
    fontStyle: 'italic'
  },
  welcomeImage: {
    width: 60,
    height: 40,
    resizeMode: 'contain'
  },
  welcomeText: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 20,
    letterSpacing: 2,
    lineHeight: 32,
    marginVertical: 15,
  },
  text: {
    fontWeight: 'bold',
    marginTop: 22,
    marginBottom: 6
  },
  subText: {
    fontSize: 12,
    marginVertical: 10
  },
  margin_15: {
    margin: 10
  },
  grayBg: {
    backgroundColor: '#f5f5f5'
  },
  lightgrayBg: {
    backgroundColor: '#f1f1f1'
  },
  paddTop_30: {
    paddingTop: 30
  },
  paddBottom_30: {
    paddingBottom: 30
  },
  paddBottom_10: {
    paddingBottom: 10
  },
  jc_alignIem_center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  flex_dir_row: {
    flexDirection: 'row'
  },
  orange_color: {
    color: mainThemeColor
  },
  half_width: {
    width: '45%'
  },
  centerText: {
    textAlign: 'center'
  },
  mgr_20: {
    marginRight: 20
  },
  mgrbtn40: {
    marginBottom: 40
  },
  whiteColor: {
    color: '#fff'
  },
  boxShadow: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#f1f1f1',
    shadowColor: '#222222',
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 1,
    padding: 12
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  popUpLayout: {
    backgroundColor: '#fff',
    margin: 20
  },
  whiteBg: {
    backgroundColor: '#fff'
  },
  editIcon: {
    backgroundColor: mainThemeColor,
    width: '20%',
    //flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //position: 'absolute',
    //right: 38,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  delIcon: {
    backgroundColor: '#f75336',
    //flex: 1,
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    //position: 'absolute',
    //right: 0,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  rowFront: {
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1
  },
  rowFrontText: {
    padding: 15
  },
  rowBack: {
    alignItems: 'stretch',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primaryText: {
    fontSize: 22,
    color: mainThemeColor,
    fontWeight: 'bold'
  },
  textBig: {
    fontSize: 22
  },
  textMedium: {
    fontSize: 18
  },
  textBold: {
    fontWeight: 'bold'
  },
  orange_bg: {
    backgroundColor: mainThemeColor
  },
  mgrtotop12: {
    marginTop: 12
  },
  paddLeft20: {
    paddingLeft: 20
  },
  paddRight20: {
    paddingRight: 20
  },
  mgrtotop20: {
    marginTop: 20
  },
  paddingTopBtn20: {
    paddingTop: 20,
    paddingBottom: 20
  },
  borderBottomLine: {
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1
  },
  mgrbtn20: {
    marginBottom: 20
  },
  paddBottom_20: {
    paddingBottom: 20
  },
  paddTop_20: {
    paddingTop: 20
  },
  minustopMargin10: {
    marginTop: -10
  },
  nopaddingLeft: {
    paddingLeft: 0
  },
  quarter_width: {
    width: '25%'
  },
  oneFifthWidth: {
    width: '20%'
  },
  paddingTopBtn8: {
    paddingTop: 8,
    paddingBottom: 8
  },
  height90: {
    height: 730,
    overflow: 'scroll'
  },
  toRight: {
    textAlign: 'right'
  },
  itemCountContainer: {
    backgroundColor: mainThemeColor,
    borderWidth: 1,
    borderColor: '#fff',
    width: 24,
    height: 24,
    borderRadius: 24,
    fontSize: 14,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemCountText: {
    color: '#fff',
    fontSize: 14
  },
  shoppingBar: {
    backgroundColor: mainThemeColor,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 45,
    paddingHorizontal: 10
  },
  item: {
    borderTopWidth: 1,
    borderColor: '#ddd'
  },
  marginLeftRight35: {
    marginLeft: 25,
    marginRight: 25
  },
  leftpadd20: {
    paddingLeft: 10
  },
  nomgrBottom: {
    marginBottom: 0
  },
  rightAlign: {
    right: 0,
    position: 'absolute',
    top: 20
  },
  mgrbtn60: {
    marginBottom: 60
  },
  top40: {
    position: 'absolute',
    top: 160
  },
  no_mgrTop: {
    marginTop: 0
  },

  // named styles for applying to components
  screenTopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  screenTitle: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 22,
    //letterSpacing: 2,
    color: mainThemeColor,
    fontWeight: 'bold'
  },
  screenSubTitle: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 32,
    marginHorizontal: 10,
    marginBottom: 10,
    color: mainThemeColor,
    fontWeight: 'bold'
  },
  menuContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 12
  },
  squareButton: {
    margin: 10,
    backgroundColor: mainThemeColor,
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 30,
    borderRadius: 8
  },
  mainSquareButton: {
    //margin: 10,
    flex: 1,
    height: 140,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    borderRadius: 4
  },
  buttonIconStyle: {
    color: mainThemeColor,
    alignSelf: 'center'
  },
  buttonText: {
    textAlign: 'center',
    marginTop: 10
  },
  iconStyle: {
    color: mainThemeColor
  },
  sectionContainer: {
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 20
  },
  sectionContainerWithBorder: {
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 20,
    borderColor: '#f1f1f1',
    borderBottomWidth: 1,
  },
  sectionTitleContainer: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 15,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  sectionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: '#f1f1f1',
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  sectionBarText: {
    color: mainThemeColor,
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 17
  },
  sectionBarTextSmall: {
    color: mainThemeColor,
    textAlign: 'left',
  },
  sectionContent: {
    marginBottom: 20
  },
  announcementTitle: {
    color: mainThemeColor,
    fontWeight: 'bold',
    fontSize: 17
  },
  listPanel: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    paddingRight: 8,
    paddingVertical: 12
  },
  listPanelText: {
    fontSize: 16
  },
  productPanel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 8,
    paddingVertical: 12,
    borderBottomWidth: 0.4,
    borderColor: '#f4f4f4'
  },
  listPanelIcon: {
    color: mainThemeColor
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 5
  },
  fieldTitle: {
    fontWeight: 'bold'
  },
  horizontalMargin: {
    marginHorizontal: 15
  },
  verticalPadding: {
    paddingVertical: 20
  },
  dynamicHorizontalPadding: val => {
    return {paddingHorizontal: val}
  },
  dynamicVerticalPadding: val => {
    return {paddingVertical: val}
  },
  withBottomBorder: {
    borderBottomWidth: 1,
    borderColor: '#f1f1f1'
  },
  tableRowContainerWithBorder: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderColor: '#f1f1f1',
    borderBottomWidth: 1,
  },
  tableRowContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10
  },
  tableCellView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  tableCellText: {
    fontWeight: 'bold'
  },
  tableCellWhiteText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16
  },
  cardDigitBox: {
    borderWidth: 2,
    width: 30,
    height: 30,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardLabel: isSelected => {
    if (isSelected) {
      return {
        flex: 1,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: mainThemeColor,
        paddingVertical: 5
      }
    }
    else {
      return {
        flex: 1,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#00000000',
        paddingVertical: 5
      }
    }

  },
  markdownContainer: {
    backgroundColor: '#f1f1f1',
    padding: 10
  },
  messageBlock: {
    padding: 10,
    textAlign: 'center',
    alignItems: 'center'
  },
  searchButton: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    padding: Platform.OS === 'ios' ? 12 : 11,
    borderColor: mainThemeColor,
    backgroundColor: mainThemeColor,
    color: '#fff',
    overflow: 'hidden'
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 10,
    marginBottom: 10
  },
  flexButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: mainThemeColor,
    justifyContent: 'center',
    backgroundColor: mainThemeColor,
  },
  flexButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
  flexButtonSecondAction: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: mainThemeColor,
    justifyContent: 'center',
    backgroundColor: '#fff',
    color: mainThemeColor
  },
  flexButtonSecondActionText: {
    textAlign: 'center',
    fontSize: 16,
    color: mainThemeColor,
  },
  bottomActionButton: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: mainThemeColor,
    padding: 10,
    marginBottom: 10,
    overflow: 'hidden'
  },
  actionButton: {
    borderColor: mainThemeColor,
    backgroundColor: mainThemeColor,
    color: '#fff'
  },
  secondActionButton: {
    backgroundColor: '#fff',
    color: mainThemeColor
  },
  cancelButton: {
    backgroundColor: '#fff',
    color: mainThemeColor
  },
  deleteButton: {
    borderColor: '#f75336',
    color: '#fff',
    backgroundColor: '#f75336'
  },
  upButton: {
    position: 'absolute',
    // width: 50,
    // height: 30,
    // alignItems: 'center',
    // justifyContent: 'center',
    right: 0,
    bottom: 0
  },
  textAreaContainer: {
    padding: 5,
    marginVertical: 10
  },
  textArea: {
    height: 150,
    justifyContent: 'flex-start'
  },
  row: {
    flexDirection: 'column',
    alignItems: 'center',
    borderColor: '#f1f1f1',
    borderWidth: 1,
    flex: 1,
    marginBottom: 12,
    marginHorizontal: 10,
    borderRadius: 4,

    ...Platform.select({
      ios: {
        //width: window.width - 30 * 2,
        // shadowColor: 'rgba(0,0,0,0.2)',
        // shadowOpacity: 1,
        // shadowOffset: { height: 2, width: 2 },
        // shadowRadius: 2
      },

      android: {
        //width: window.width - 30 * 2,
        elevation: 0,
        marginVertical: 30,
      },
    })
  },
  list: {
    flexDirection: 'row'
  },
  tblContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10
  },
  tblhead: {
    backgroundColor: '#f75336'
  },
  tbltextHeader: {
    margin: 4,
    textAlign: 'center',
    color: '#fff'
  },
  tbltext: {
    padding: 10,
    textAlign: 'center'
  },
  tblrow: {
    flexDirection: 'row',
    //backgroundColor: '#f5f5f5'
  },
  circle: {
    backgroundColor: mainThemeColor,
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS
  },
  ballContainer: {
    flex: 1,

    borderWidth: 1,
    borderColor: mainThemeColor
  },
  datetimeBorder: {
    borderWidth: 1,
    padding: 8,
    paddingTop: 8,
    paddingBottom: 8,
    marginRight: 8,
    borderRadius: 4,
    borderColor: '#ccc',
    width: '50%'
  },

  // utility styles
  flexRow: {
    flexDirection: 'row'
  },
  justifyRight: {
    justifyContent: 'flex-end',
    flex: 1
  },
  alignRight: {
    alignItems: 'flex-end',
    flex: 1
  },
  flex: num => {
    return {flex: num}
  },
  withBorder: {
    borderWidth: 1
  },
  withoutBorder: {
    borderWidth: 0
  },
  hitSlop: {top: 20, bottom: 20, left: 50, right: 50},
  bottomButtonContainerWithoutFlex: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 15
  },
})
