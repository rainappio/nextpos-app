import { StyleSheet } from 'react-native'
export default StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 62,
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 62,
    position: 'relative'
  },
  childContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 8,
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 20,
    position: 'relative'
  },
  rootInput: {
    height: 44,
    padding: 10,
    marginBottom: 10,
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1
  },
  rootError: {
    color: 'red',
    fontSize: 12,
    fontStyle: 'italic'
  },
  welcomeImage: {
    width: 40,
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
    fontSize: 12
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
    marginBottom: 20,
    position: 'relative'
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
    padding: 25,
    margin: 20
  },
  whiteBg: {
    backgroundColor: '#fff'
  },
  editIcon: {
    backgroundColor: '#f18d1a',
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    right: 38,
    paddingTop: 6,
    paddingBottom: 6,
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
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
    padding: 8,
    bottom: 4
  },
  editIcon: {
    backgroundColor: '#f18d1a',
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    right: 38,
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
    marginTop: 30,
    marginBottom: 30
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
    borderBottomWidth: 1,
    paddingLeft: 10
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
    fontSize: 22
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
  }
})
