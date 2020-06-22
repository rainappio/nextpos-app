import { StyleSheet, Platform, Dimensions } from 'react-native'
const window = Dimensions.get('window')
export const mainThemeColor = '#f18d1a'
let CIRCLE_RADIUS = 25;
//export const mainThemeColor = '#f18dee'
//export const mainThemeColor = '#3e3d47'

export default StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  fullWidthScreen: {
    flex: 1,
    marginTop: 53,
    marginBottom: 36
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 53,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 36
  },
  container_nocenterCnt: {
    flex: 1,
    marginTop: 53,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 36
  },
  childContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 50
  },
  rootInput: {
    paddingVertical: 10,
    paddingLeft: 10,
    textAlign: 'right'
  },
  rootError: {
    color: 'red',
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
    marginBottom: 16,
    marginTop: -8
  },
  gsText: {
    padding: 10,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16
  },
  text: {
    fontWeight: 'bold',
    marginTop: 22,
    marginBottom: 6
  },
  textSmall: {
    fontSize: 12,
    marginTop: 10,
    marginBottom: 10
  },
  signInText: {
    color: '#F39F86',
    padding: 10,
    textAlign: 'center',
    fontSize: 16
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
  textLeftWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10
  },
  grayText: {
    color: '#888'
  },
  mgr_20: {
    marginRight: 20
  },
  mgrbtn40: {
    marginBottom: 40
  },
  isActive: {
    color: '#000',
    borderBottomWidth: 2,
    borderBottomColor: '#F39F86'
  },
  whiteColor: {
    color: '#fff'
  },
  boxShadow: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 1,
    padding: 12
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)'
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
    backgroundColor: '#fff',
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
  userIcon: {
    color: '#fff',
    fontSize: 28,
    textAlign: 'center',
    width: 30,
    height: 30,
    lineHeight: 30,
    borderRadius: 30
  },
  quarter_width: {
    width: '25%'
  },
  oneFifthWidth: {
    width: '20%'
  },
  myradio: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: 30,
    height: 30,
    borderRadius: 40
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 45
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
    letterSpacing: 2,
    color: mainThemeColor,
    fontWeight: 'bold'
  },
  screenSubTitle: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 32,
    marginHorizontal: 10,
    color: mainThemeColor,
    fontWeight: 'bold'
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
    margin: 10,
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
  stateIconStyle: {
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
    marginVertical: 15,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  sectionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
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
  listPanel: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    marginRight: 0,
    paddingTop: 12,
    paddingBottom: 12
  },
  listPanelText: {
    flex: 9,
    fontSize: 16
  },
  listItemContainer: {
    backgroundColor: '#F8F8F8'
  },
  listPanelIcon: {
    flex: 1,
    justifyContent: 'flex-end',
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
  dynamicVerticalPadding: val => {
    return { paddingVertical: val }
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
  optionsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderColor: '#f1f1f1',
    borderBottomWidth: 1,
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
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 0
  },
  textArea: {
    height: 150,
    justifyContent: 'flex-start'
  },
  stcontainer: {
    flex: 1,
    marginTop: 53,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 36
  },
  row: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#f1f1f1',
    borderWidth: 1,
    flex: 1,
    marginBottom: 12,
    borderRadius: 4,

    ...Platform.select({
      ios: {
        width: window.width - 30 * 2,
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 1,
        shadowOffset: { height: 2, width: 2 },
        shadowRadius: 2
      },

      android: {
        width: window.width - 30 * 2,
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
  },
  tblhead: { height: 40, backgroundColor: mainThemeColor, width: 62 },
  tbltextHeader: { margin: 4, textAlign: 'center', color: '#fff' },
  tbltext: { margin: 4, textAlign: 'center' },
  tblrow: { flexDirection: 'row', backgroundColor: '#f5f5f5' },
  grayPrevBtn: {
    position: 'absolute',
    left: 45,
    top: 2,
    bottom: 2,
    right: 2,
    paddingTop: 3,
    backgroundColor: '#f1f1f1',
    borderRadius: 4,
    paddingLeft: 12,
  },
  grayNextBtn: {
    position: 'absolute',
    right: 45,
    top: 2,
    bottom: 2,
    left: 2,
    paddingTop: 3,
    backgroundColor: '#f1f1f1',
    paddingLeft: 12,
    borderRadius: 4
  },
  circle: {
    backgroundColor: mainThemeColor,
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS
  },
  col: {
    flexDirection: "column"
  },
  ballContainer: {
    height: 600,
    borderWidth: 1,
    borderColor: mainThemeColor
  }
})
