import { StyleSheet } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
export default StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 53,
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 36
  },
  childContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
    marginLeft: 0,
    marginRight: 0,
    paddingRight: 0
  },
  rootInput: {
    height: 80,
    padding: 20,
    marginBottom: 10,
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1,
    fontSize: 22
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
    width: 80,
    height: 80,
    resizeMode: 'contain'
  },
  welcomeText: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 20,
    letterSpacing: 2,
    lineHeight: 55,
    marginBottom: 16,
    fontSize: 30
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
    fontSize: 22
  },
  signInText: {
    color: '#F39F86',
    padding: 10,
    textAlign: 'center',
    fontSize: RFPercentage(2.4)	 
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
    color: '#f18d1a'
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
  container_nocenterCnt: {
    flex: 1,
    marginTop: 62,
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 20
  },
  mgrbtn40: {
    marginBottom: 40
  },
  pickerStyle: {
    width: '100%',
    justifyContent: 'center',
    paddingRight: 0,
    paddingLeft: 0,
    marginTop: 8
  },
  leftpadd32: {
    paddingLeft: 32
  },
  fullWidth: {
    width: '100%'
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
    padding: 60,
    margin: 40
  },
  whiteBg: {
    backgroundColor: '#fff'
  },
  editIcon: {
    backgroundColor: '#f18d1a',
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    right: 58,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    opacity: 0.6,
    bottom: 4
  },
  delIcon: {
    backgroundColor: '#f18d1a',
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    padding: 8,
    bottom: 4
  },
  standalone: {
    marginTop: 20,
    marginBottom: 20
  },
  standaloneRowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    justifyContent: 'center',
    height: 50
  },
  standaloneRowBack: {
    alignItems: 'center',
    backgroundColor: '#8BC645',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15
  },
  backTextWhite: {
    color: '#FFF'
  },
  rowFront: {
    backgroundColor: '#fff',
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1
    // paddingLeft: 10
  },
  rowFrontText: {
    padding: 15
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 0
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0
  },
  borderRadius4: {
    borderRadius: 4
  },
  textBig: {
    fontSize: 30
  },
  textMedium: {
    fontSize: RFPercentage(2.3)
  },
  textBold: {
    fontWeight: 'bold'
  },
  uerIcon: {
    color: '#fff',
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    width: 30,
    height: 30,
    borderRadius: 30,
    paddingTop: 2
  },
  orange_bg: {
    backgroundColor: '#f18d1a'
  },
  editIconII: {
    backgroundColor: '#f18d1a',
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
    opacity: 0.6,
    bottom: 4
  },
  colordelIcon: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    right: 0
  },
  onethirdWidth: {
    width: '35%'
  },
  onesixthWidth: {
    width: '65%'
  },
  mgrtotop8: {
    marginTop: 8
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
  BlackColorTitle: {
    textAlign: 'center',
    fontSize: 20,
    letterSpacing: 2,
    lineHeight: 32,
    marginBottom: 16,
    marginTop: -8
  },
  paddingTopBtn20: {
    paddingTop: 20,
    paddingBottom: 20
  },
  paddingTopBtn15: {
    paddingTop: 15,
    paddingBottom: 15
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
  itemCount: {
    backgroundColor: 'white',
    color: '#000',
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
    right: -40,
    top: 8,
    textAlign: 'center'
  },
  shoppingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 80
  },
  item: {
    borderTopWidth: 1,
    borderColor: '#ddd'
  },
  verticalMiddle: {
    justifyContent: 'center'
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
  fullhalf_width: {
    width: '50%'
  },
  no_mgrTop: {
    marginTop: 0
  },

  // named styles for applying to components
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  screenTitle: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 20,
    letterSpacing: 2,
    lineHeight: 32,
    marginBottom: 16,
    marginTop: -8,
    color: '#f18d1a',
    fontWeight: 'bold'
  },
  squareButton: {
    margin: 10,
    backgroundColor: '#f18d1a',
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 80,
    borderRadius: 4
  },
  mainSquareButton: {
    margin: 10,
    width: '45%',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    borderRadius: 4
  },
  sectionBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f18d1a',
    paddingVertical: 22
  },
  sectionBarText: {
    color: '#fff',
    fontSize: 18
  },
  listPanel: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    marginRight: 0,
    paddingTop: 24,
    paddingBottom: 24
  },
  listPanelText: {
    flex: 9,
    fontSize: 16
  },
  listPanelIcon: {
    flex: 1,
    justifyContent: 'flex-end',
    color: '#f18d1a'
  },
  fieldContainer: {
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 10
  },
  fieldTitle: {
    fontWeight: 'bold'
  },
  messageBlock: {
    padding: 10,
    textAlign: 'center',
    alignItems: 'center'
  },
  bottom: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  bottomActionButton: {
    width: '50%',
    textAlign: 'center',
    fontSize: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#F39F86',
    padding: 15,
    marginBottom: 10
  },
  actionButton: {
    backgroundColor: '#F39F86',
    color: '#fff'
  },
  cancelButton: {
    backgroundColor: '#fff',
    color: '#F39F86'
  },
  deleteButton: {
    backgroundColor: '#ff6d07'
  },
  LRmgr_35minus: {
    marginLeft: -30,
    marginRight: -30
  },
  Rightmgr_30minus: {
    marginRight: -30
  },
  upButtonImage: {
    resizeMode: 'contain',
    width: 22,
    height: 20,
    marginRight: 8,
    padding: 8
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
  iconMargin: {
  	margin: 20
  },
   defaultfontSize: {
  	fontSize: RFPercentage(2.4)	 
  },
  customMgr: {
  	marginTop: 35,
  	marginBottom: 35
  },
  commonMgrBtn: {
  	marginBottom: 40
  },
  customPaddingLarge: {
		paddingTop: 60,
  	paddingBottom: 60
  },
  commonMgrBtntenPxLarger: {
		marginBottom: 60
  },
  commonMgrTop: {
  	marginTop: 80
  },
  mainlogoImg: {
  	flex: 1,
  	width: 40,
  	height: 80,
  	resizeMode: 'contain'
  },
  percentPadding: {
		padding: '4%'
  },
  commonpaddingTopBtn: {
  	paddingTop: 20,
  	paddingBottom: 20
  },
  customAvator: {
  	backgroundColor: '#f1f1f1',
    width: 88,
    height: 88,
    borderRadius: 88,
    textAlign: 'center',
    lineHeight: 88
  },
  customAvatorUserName: {
  	marginLeft: 120, 
  	marginTop: -60 
  },
  cashBox: {
    width: 100,
    height: 70,
    borderWidth: 2,
    borderColor: '#f18d1a',
    marginRight: 17,
    paddingTop: 16
  },
  heading: {
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
  heading1: {
    fontSize: 32,
    backgroundColor: '#000000',
    color: '#FFFFFF',
  },
  customLogo: {
  	fontSize: 70
  }
})
